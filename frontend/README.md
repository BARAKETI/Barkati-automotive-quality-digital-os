# Barkati Quality OS — connected engineering release

Open **Barkati_Quality_OS_Offline.html** for the self-contained local application, or **dist/index.html** through a local HTTP server. All runtime assets are local. Read **docs/Delivery_Guide.html** for step-by-step use and deployment and **docs/Source_Audit.html** for the recovered baseline and repair decisions.

## Verify and deploy

Requires Node.js >=20, no runtime package installation:

```
npm test
node tests/mutations.cjs
npm run build
npm run check
```

GitHub Actions runs these gates. Netlify build: `npm run build`; publish directory: `dist`. Upload extracted source contents to GitHub, not the ZIP itself. No personal GitHub repository has been created by this delivery.

## Delivered scope

SPC, balanced measurement studies, selected quality tools, evidence-based 8D, linked risk/Control Plan registers, APQP submission register, audit actions, forecast ROI, method notes, JSON/CSV exports and printable HTML reports. The workbook is an independent editable cross-check, not a live Excel add-in. The app uses deterministic evidence checks, not an LLM. EN/FR/DE navigation is available; technical content is English.

## Source layout

- src/: calculation engine, case model, content, interface
- tools/: build, validation and reference fixture tools
- tests/: numerical, workflow and mutation checks
- fixtures/: synthetic cases and independent numeric reference
- docs/: operating guide, source audit, acceptance and integration boundaries
- workbooks/: editable verification workbook
- qa/: actual verification records
- dist/: static deployment assets

## Reproduce reference and workbook

`tools/reference_fixture.py` requires Python, NumPy and SciPy and generates fixtures/reference.json. `tools/build-workbook.mjs` is provided as authoring provenance and requires @oai/artifact-tool, an artifact-authoring runtime dependency not needed for application use or Netlify. The supplied XLSX is immediately usable without that tool.

## Data and release boundaries

Single-user local storage is neither encrypted nor tamper-proof. Export JSON backups. No SAP/Q-DAS/Minitab direct integration or multi-user backend is represented as complete. Synthetic examples are labelled and are not customer achievements. Review the current customer method, source license and evidence before operational release. Existing portfolio masters are not modified.

Contact: Mohamed Barkati, +216 50129234.
