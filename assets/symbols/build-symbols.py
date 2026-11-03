#!/usr/bin/env python3
"""Raccoglie gli SVG di questa cartella in assets/js/symbols.js.

I simboli vengono inseriti inline nella pagina (non come <img>) così ereditano
il colore della card tramite currentColor, anche aprendo index.html da file.
Da rilanciare dopo aver aggiunto o modificato un simbolo:

    python3 assets/symbols/build-symbols.py
"""
import json
from pathlib import Path

here = Path(__file__).resolve().parent
symbols = {
    f"assets/symbols/{p.name}": p.read_text().strip()
    for p in sorted(here.glob("*.svg"))
}
out = here.parent / "js" / "symbols.js"
out.write_text(
    "/* Generato da assets/symbols/build-symbols.py — non modificare a mano */\n"
    f"window.METROWAVE_SYMBOLS = {json.dumps(symbols, ensure_ascii=False, indent=0)};\n"
)
print(f"{len(symbols)} simboli → {out.relative_to(here.parent.parent)}")
