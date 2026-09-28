"""Build site/creditos.html from assets/animals/models/models.json and the animal seed.

    python3 tools/site/credits.py
"""

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
models = json.loads((ROOT / "assets/animals/models/models.json").read_text())
seed = json.loads((ROOT / "content/animals/legacy-seed.json").read_text())
names = {a["id"]: a["name"]["ptBR"] for a in (seed["animals"] if isinstance(seed, dict) else seed)}
LABELS = {"CC-BY-3.0": "CC BY 3.0", "CC0-1.0": "CC0 1.0 (domínio público)"}

groups: dict[tuple[str, str], dict] = {}
for animal_id, m in models.items():
    g = groups.setdefault((m["author"], m["license"]), {"url": m["licenseUrl"], "items": []})
    g["items"].append((names.get(animal_id, animal_id), m["sourceUrl"]))

sections = []
for (author, lic), g in groups.items():
    items = "\n".join(
        f'      <li><a href="{html.escape(url)}">{html.escape(name)}</a></li>'
        for name, url in sorted(g["items"], key=lambda i: i[0])
    )
    sections.append(
        f"""  <h3>{html.escape(author)}</h3>
  <p>Licença <a href="{html.escape(g['url'])}">{LABELS.get(lic, lic)}</a></p>
  <ul>
{items}
  </ul>"""
    )

page = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bichu · Créditos</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
  <a class="back" href="./">← Bichu</a>
  <h1>Créditos</h1>

  <h2>Modelos 3D</h2>
  <p>Usados na realidade aumentada do Bichu. Todos foram convertidos para GLB, reorientados, redimensionados para a escala real e tiveram as texturas reduzidas.</p>
{chr(10).join(sections)}

  <h2>Outros</h2>
  <ul>
    <li><strong>Ilustrações, sons e locuções:</strong> acervo do Zoo Babies / AnimalSounds.</li>
    <li><strong>Ícones:</strong> Microsoft Fluent Emoji (licença MIT).</li>
    <li><strong>Fontes:</strong> Fredoka e Nunito (SIL Open Font License).</li>
    <li><strong>Mascote:</strong> Bichu, o Guardião da Floresta.</li>
  </ul>
  <p class="meta">Gerado a partir de assets/animals/models/models.json.</p>
</main>
</body>
</html>
"""
(ROOT / "site/creditos.html").write_text(page)
print("site/creditos.html:", sum(len(g["items"]) for g in groups.values()), "modelos")
