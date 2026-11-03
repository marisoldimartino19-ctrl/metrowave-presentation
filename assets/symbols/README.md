# Simboli delle stazioni

Un file SVG per stazione (`01-piscinola.svg` … `20-centro-direzionale.svg`),
collegato in `assets/js/stations.js` tramite il campo `symbol`:

```js
symbol: "assets/symbols/01-piscinola.svg",
```

## Regole per gli SVG

- `viewBox="0 0 100 100"`, senza margini interni.
- **Nessun colore fisso**: `fill="currentColor"` sull'`<svg>`, nessun `fill`/`stroke`
  esadecimale sulle forme. Il colore lo decide il sito: a riposo quello della
  stazione, in hover il nero o il bianco più contrastato con la card.
- Le sfumature si fanno con `fill-opacity`, non con colori diversi.
- Eventuali colori fissi necessari passano da una classe definita in
  `assets/css/style.css` (`.sym-base`, `.sym-accent`).

## Dopo aver aggiunto o modificato un simbolo

I simboli vengono inseriti inline nella pagina (così ereditano il colore) e
raccolti in `assets/js/symbols.js`. Rigenerarlo con:

```
python3 assets/symbols/build-symbols.py
```

Finché `symbol` è `null`, card e pannello della mappa mostrano lo spazio tratteggiato predisposto.
