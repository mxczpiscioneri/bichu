/**
 * Cliente mínimo para o Aptabase self-hosted (stats.4mtecnologia.com.br), sem SDK nativo.
 *
 * Só contagem anônima: nada de id de aparelho, id de instalação ou modelo do aparelho. O
 * servidor guarda um hash de IP+navegador com sal que troca todo dia (o IP não é gravado)
 * e o país/estado. A sessão é um número aleatório em memória (some ao fechar o app).
 *
 * - fila offline gravada no aparelho: sem internet, os eventos esperam e vão depois;
 * - eventos "uma vez por instalação" (primeira abertura, primeira vez que passa de fase);
 * - heartbeat enquanto o app está aberto, para contar quem está jogando agora;
 * - modo 'kids' manda menos detalhe (idioma sem região, só a versão principal do sistema).
 *
 * Não depende de nada do jogo: dá para copiar para outro app e mudar só as opções.
 */

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export type Props = Record<string, string | number>;

export interface AnonClientOptions {
  appKey: string;
  host: string;
  mode: 'kids' | 'adult';
  appVersion: string;
  buildNumber?: string;
  osName: string;
  osVersion: string;
  /** ex.: "pt-BR"; no modo kids vira só "pt" */
  locale: string;
  isDebug: boolean;
  storage: KeyValueStorage;
  /** prefixo das chaves gravadas no aparelho */
  storageKey: string;
  fetch?: typeof fetch;
  now?: () => number;
}

interface QueuedEvent {
  name: string;
  props: Props;
  /** quando aconteceu (ms) */
  t: number;
  /** sessão em que aconteceu */
  sid: string;
}

const SDK_VERSION = '4m-anon@1.0.0';
const SESSION_IDLE_MS = 60 * 60 * 1000;
/** o servidor recusa evento e sessão com mais de ~1 dia: antes disso, reenvia como "agora" */
const MAX_EVENT_AGE_MS = 20 * 60 * 60 * 1000;
const MAX_QUEUE = 300;
const MAX_ONCE_KEYS = 1000;
const BATCH = 25;
const REQUEST_TIMEOUT_MS = 10_000;
const HEARTBEAT_MS = 60_000;

/** sessionId no formato do Aptabase: segundos do início + 8 dígitos aleatórios */
function newSessionId(now: number): string {
  const rand = Math.floor(Math.random() * 1e8)
    .toString()
    .padStart(8, '0');
  return `${Math.floor(now / 1000)}${rand}`;
}

const day = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function createAnonClient(opts: AnonClientOptions) {
  const now = opts.now ?? Date.now;
  const doFetch = opts.fetch ?? fetch;
  const queueKey = `${opts.storageKey}:queue`;
  const onceKey = `${opts.storageKey}:once`;
  const kids = opts.mode === 'kids';

  const systemProps = {
    isDebug: opts.isDebug,
    osName: opts.osName,
    osVersion: kids ? opts.osVersion.split('.')[0] : opts.osVersion,
    locale: kids ? opts.locale.split(/[-_]/)[0].toLowerCase() : opts.locale,
    appVersion: opts.appVersion,
    appBuildNumber: kids ? '' : (opts.buildNumber ?? ''),
    sdkVersion: SDK_VERSION,
  };

  let enabled = false;
  let loaded = false;
  let queue: QueuedEvent[] = [];
  let once = new Set<string>();
  let session = { id: newSessionId(now()), last: now() };
  let flushing: Promise<void> | null = null;
  let failures = 0;
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let active = true;

  const quiet = (p: Promise<unknown>) => p.catch(() => undefined);

  const sessionStart = (sid: string) => Number(sid.slice(0, -8)) * 1000;

  function sessionId(): string {
    const t = now();
    if (t - session.last > SESSION_IDLE_MS || t - sessionStart(session.id) > MAX_EVENT_AGE_MS) {
      session = { id: newSessionId(t), last: t };
    }
    session.last = t;
    return session.id;
  }

  function save() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      quiet(opts.storage.setItem(queueKey, JSON.stringify(queue)));
    }, 500);
  }

  function scheduleFlush(ms = 15_000) {
    if (flushTimer || !enabled || !active) return;
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void flush();
    }, ms);
  }

  function enqueue(name: string, props: Props, persist = true) {
    if (!enabled) return;
    queue.push({ name, props, t: now(), sid: sessionId() });
    if (queue.length > MAX_QUEUE) queue = queue.slice(queue.length - MAX_QUEUE);
    if (persist) save();
    scheduleFlush();
  }

  /** Eventos velhos (ficaram offline) vão com a hora atual e o dia original em `queued_day`. */
  function toPayload(e: QueuedEvent) {
    const t = now();
    const stale = t - e.t > MAX_EVENT_AGE_MS || t - sessionStart(e.sid) > MAX_EVENT_AGE_MS;
    return {
      timestamp: new Date(stale ? t : e.t).toISOString(),
      sessionId: stale ? sessionId() : e.sid,
      eventName: e.name,
      systemProps,
      props: stale ? { ...e.props, queued_day: day(e.t) } : e.props,
    };
  }

  async function post(batch: QueuedEvent[]): Promise<'ok' | 'drop' | 'retry'> {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS) : null;
    try {
      const res = await doFetch(`${opts.host}/api/v0/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'App-Key': opts.appKey, 'User-Agent': SDK_VERSION },
        body: JSON.stringify(batch.map(toPayload)),
        signal: ctrl?.signal,
      });
      if (res.ok) return 'ok';
      // 4xx (fora 429) não melhora tentando de novo: descarta para não travar a fila
      return res.status >= 400 && res.status < 500 && res.status !== 429 ? 'drop' : 'retry';
    } catch {
      return 'retry';
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  /** Envia a fila; se já tem um envio em andamento, devolve o mesmo. */
  function flush(): Promise<void> {
    if (flushing) return flushing;
    if (!enabled || !loaded || queue.length === 0) return Promise.resolve();
    flushing = sendQueue().finally(() => {
      flushing = null;
    });
    return flushing;
  }

  async function sendQueue(): Promise<void> {
    while (enabled && queue.length > 0) {
      const batch = queue.slice(0, BATCH);
      const result = await post(batch);
      if (result === 'retry') {
        failures++;
        break;
      }
      failures = 0;
      queue = queue.filter((e) => !batch.includes(e));
      save();
    }
    // sem rede: tenta de novo mais devagar (até ~5 min)
    if (queue.length > 0) scheduleFlush(Math.min(15_000 * 2 ** failures, 5 * 60_000));
  }

  function startHeartbeat() {
    if (heartbeat || !enabled || !active) return;
    // heartbeat não vai para a fila gravada: se não chegar agora, não vale para "online agora"
    heartbeat = setInterval(() => {
      enqueue('heartbeat', {}, false);
      void flush();
    }, HEARTBEAT_MS);
  }

  function stopHeartbeat() {
    if (heartbeat) clearInterval(heartbeat);
    heartbeat = null;
  }

  async function load() {
    try {
      const [q, o] = await Promise.all([opts.storage.getItem(queueKey), opts.storage.getItem(onceKey)]);
      const stored: QueuedEvent[] = q ? JSON.parse(q) : [];
      if (Array.isArray(stored)) queue = [...stored.filter((e) => e && typeof e.name === 'string'), ...queue].slice(-MAX_QUEUE);
      const keys: string[] = o ? JSON.parse(o) : [];
      if (Array.isArray(keys)) once = new Set([...keys, ...once]);
    } catch {
      // armazenamento corrompido: começa do zero
    }
    loaded = true;
  }
  const ready = load();

  return {
    track(name: string, props: Props = {}) {
      enqueue(name, props);
    },

    /** Envia só na primeira vez que `key` aparece nesta instalação. */
    trackOnce(key: string, name: string, props: Props = {}) {
      if (!enabled) return;
      void ready.then(() => {
        if (!enabled || once.has(key)) return;
        once.add(key);
        if (once.size > MAX_ONCE_KEYS) once = new Set([...once].slice(-MAX_ONCE_KEYS));
        quiet(opts.storage.setItem(onceKey, JSON.stringify([...once])));
        enqueue(name, props);
      });
    },

    setEnabled(value: boolean) {
      enabled = value;
      if (value) {
        startHeartbeat();
        void ready.then(() => flush());
      } else {
        // desligado na Área dos pais: apaga o que estava esperando para ir
        stopHeartbeat();
        queue = [];
        quiet(opts.storage.removeItem(queueKey));
      }
    },

    /** Chamar quando o app vai para o fundo / volta (AppState). */
    setActive(value: boolean) {
      active = value;
      if (value) {
        startHeartbeat();
        void flush();
      } else {
        stopHeartbeat();
        if (flushTimer) clearTimeout(flushTimer);
        flushTimer = null;
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = null;
        quiet(opts.storage.setItem(queueKey, JSON.stringify(queue)));
        void flush();
      }
    },

    flush,
    /** Só para testes. */
    __state: () => ({ queue, once, session, loaded }),
    ready,
  };
}

export type AnonClient = ReturnType<typeof createAnonClient>;
