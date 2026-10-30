# Barkati-automotive-quality-digital-os-
Automotive Quality Digital OS for EV/BMS/HV readiness, Battery Passport readiness, APQP/PFMEA/PPAP, plastics/overmolding, product securization, 8D/CAPA and S/4HANA quality analytics.


---

## Connected Engineering Workbench — Azure source

Added 30 October 2026. The existing portfolio and product HTML files are retained. The executable application is in `frontend/`, with its optional Node hosting server in `backend/`. The broader repository description above describes the existing catalogue; implemented scope for this application is documented below.

# Barkati Quality OS — Azure source handover

This package is for **Barkati Quality OS — Connected Engineering Workbench**, released 29 October 2026. It is not the source of the external AVOCarbon PPMA application.

## Folders

- `frontend/src/`: editable HTML, CSS, UI JavaScript, statistical engine, shared case model and method content.
- `frontend/dist/`: prebuilt website, downloads and offline HTML.
- `frontend/tests/`, `fixtures/`, `tools/`, `workbooks/`, `docs/`: verification and supporting materials.
- `backend/server.cjs`: optional Node.js hosting backend, serving frontend/dist and GET/HEAD /api/health.
- `backend/tests/`: HTTP tests.
- `deployment/`: optional Azure Static Web Apps workflow template.
- `.github/workflows/verify.yml`: source verification CI.
- `Dockerfile`: portable container definition using the prebuilt frontend.
- `docs/AZURE_DEPLOYMENT.md` and `DEPLOYMENT_GUIDE.html`: step-by-step cloud instructions.

## Run locally

Use Node.js 24 LTS (22 or newer is accepted by the package). No runtime npm dependencies are required.

```
npm run build
npm test
npm run verify
npm start
```

Open http://localhost:8080 and http://localhost:8080/api/health. To use the application without any server, open `frontend/Barkati_Quality_OS_Offline.html` in a browser that supports local JavaScript.

## What the backend does

The previous release had no backend. This new folder supplies an HTTP host and health endpoint, not database storage or business APIs. Cases remain in browser local storage and JSON exports. There is no user/role API, authenticated approval, file-upload API, server-side case store or remote LLM. The frontend does not call the health endpoint as part of its workflow.

Azure App Service and Static Web Apps are alternative deployment routes. Do not configure backend/ as an Azure Functions api_location: it is a Node HTTP server, not an Azure Function.

## Deployment status

Source, built files, tests and deployment artifacts are provided. No resource has been provisioned or published into your Azure subscription. The existing private ChatGPT Site is unaffected. Azure hosting access does not automatically inherit that Site's private audience; configure provider access controls for your intended audience.

## Verification

42 frontend tests and 13 hosting-backend tests pass. Four targeted calculation mutations are detected; 72 DOM-stub render combinations and three embedded-download byte comparisons pass. ZIPs are extracted and hash-checked. Azure subscription deployment and the Docker image are not executed in this environment. Earlier browser/mobile limitations remain documented in frontend/qa/QA_Report.json.
