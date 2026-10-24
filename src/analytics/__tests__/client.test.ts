import { createAnonClient, type KeyValueStorage } from '../client';

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: async (k) => data[k] ?? null,
    setItem: async (k, v) => {
      data[k] = v;
    },
    removeItem: async (k) => {
      delete data[k];
    },
  };
}

const HOUR = 60 * 60 * 1000;
const T0 = Date.UTC(2026, 9, 23, 12, 0, 0);

function setup(opts: { online?: boolean; storage?: ReturnType<typeof memoryStorage>; now?: () => number } = {}) {
  const storage = opts.storage ?? memoryStorage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodies: any[][] = [];
  let online = opts.online ?? true;
  const fetchMock = jest.fn(async (_url: string, init: RequestInit) => {
    if (!online) throw new Error('offline');
    bodies.push(JSON.parse(init.body as string));
    return { ok: true, status: 200 } as Response;
  });
  const client = createAnonClient({
    appKey: 'A-SH-1',
    host: 'https://stats.example',
    mode: 'kids',
    appVersion: '1.2.0',
    buildNumber: '42',
    osName: 'iOS',
    osVersion: '26.1.2',
    locale: 'pt-BR',
    isDebug: false,
    storage,
    storageKey: 'test',
    fetch: fetchMock as unknown as typeof fetch,
    now: opts.now ?? (() => T0),
  });
  return { client, storage, bodies, fetchMock, goOnline: () => (online = true) };
}

beforeEach(() => jest.useFakeTimers({ doNotFake: ['nextTick', 'queueMicrotask'] }));
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('cliente anônimo', () => {
  it('envia sem identificadores e com menos detalhe no modo kids', async () => {
    const { client, bodies, fetchMock } = setup();
    client.setEnabled(true);
    client.track('level_start', { level_id: 'w1_l01' });
    await client.ready;
    await client.flush();
    client.setActive(false);
    const [event] = bodies[0];
    expect(event.eventName).toBe('level_start');
    expect(event.props).toEqual({ level_id: 'w1_l01' });
    expect(event.systemProps).toEqual(
      expect.objectContaining({ locale: 'pt', osVersion: '26', appBuildNumber: '', appVersion: '1.2.0' }),
    );
    expect(event.sessionId).toMatch(new RegExp(`^${T0 / 1000}\\d{8}$`));
    const headers = (fetchMock.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
    expect(headers['App-Key']).toBe('A-SH-1');
    expect(JSON.stringify(event)).not.toMatch(/device|install|model|user/i);
  });

  it('guarda offline e manda depois, com a hora atual quando o evento ficou velho', async () => {
    let t = T0;
    const storage = memoryStorage();
    const first = setup({ online: false, storage, now: () => t });
    first.client.setEnabled(true);
    first.client.track('level_complete', { level_id: 'w1_l02' });
    await first.client.ready;
    await first.client.flush();
    first.client.setActive(false); // grava a fila
    await Promise.resolve();
    expect(JSON.parse(storage.data['test:queue'])).toHaveLength(1);

    // app reaberto 2 dias depois, com internet
    t = T0 + 48 * HOUR;
    const second = setup({ storage, now: () => t });
    second.client.setEnabled(true);
    await second.client.ready;
    await second.client.flush();
    second.client.setActive(false);
    const [event] = second.bodies[0];
    expect(event.timestamp).toBe(new Date(t).toISOString());
    expect(event.props).toEqual({ level_id: 'w1_l02', queued_day: '2026-10-23' });
    expect(Number(event.sessionId.slice(0, -8)) * 1000).toBe(t);
    expect(second.client.__state().queue).toHaveLength(0);
  });

  it('conta marcos uma vez por instalação', async () => {
    const storage = memoryStorage();
    const a = setup({ storage });
    a.client.setEnabled(true);
    a.client.trackOnce('first_open', 'first_open');
    a.client.trackOnce('first_open', 'first_open');
    await a.client.ready;
    await Promise.resolve();
    expect(a.client.__state().queue.filter((e) => e.name === 'first_open')).toHaveLength(1);
    await a.client.flush();
    expect(a.bodies.flat().filter((e) => e.eventName === 'first_open')).toHaveLength(1);
    a.client.setActive(false);

    const b = setup({ storage });
    b.client.setEnabled(true);
    b.client.trackOnce('first_open', 'first_open');
    await b.client.ready;
    await Promise.resolve();
    await b.client.flush();
    expect(b.bodies.flat().filter((e) => e.eventName === 'first_open')).toHaveLength(0);
    b.client.setActive(false);
  });

  it('desligado não envia nada e apaga a fila', async () => {
    const { client, storage, fetchMock } = setup({ online: false });
    client.setEnabled(true);
    client.track('app_open');
    client.setEnabled(false);
    client.track('level_start', { level_id: 'w1_l01' });
    await client.ready;
    await client.flush();
    expect(client.__state().queue).toHaveLength(0);
    expect(storage.data['test:queue']).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
