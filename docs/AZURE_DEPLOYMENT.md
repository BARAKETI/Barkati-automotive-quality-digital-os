# Azure deployment — 29 October 2026

## Choose a route

**Route A — Azure Static Web Apps:** appropriate for the current browser-only application. Deploy frontend/dist; no backend is needed. Case records stay in the user's browser.

**Route B — Azure App Service (Linux / Node.js):** use the supplied backend to serve the same frontend and a health endpoint. This is the route if your deployment team expects separate frontend and backend folders.

**Route C — container hosting:** use the supplied Dockerfile on a provider supporting Linux containers. It starts the same Node host on PORT 8080 by default. Docker build/run has not been executed here.

## 1. Prepare GitHub

1. Extract Barkati_Quality_OS_Azure_Full_Source_2026-10-29.zip.
2. Create your own repository, then upload the extracted contents so frontend/, backend/, package.json and .github/ are at repository root. Do not upload just the ZIP.
3. Run npm run build, npm test, and npm run verify locally or inspect the provided GitHub verification workflow.
4. The repository has no required API keys. Never commit Azure tokens or a real .env file.

## 2A. Azure Static Web Apps

1. In Azure, create a Static Web App and connect the repository/branch.
2. For the portal-generated build workflow, use custom settings: app location frontend, API location empty, output location dist. Its build command is npm run build in frontend.
3. Alternatively, copy deployment/azure-static-web-apps.yml.example to .github/workflows/deploy-static.yml. Add the Static Web App's deployment token to the GitHub repository secret named AZURE_STATIC_WEB_APPS_API_TOKEN. Run that workflow manually. Use one deployment workflow, not both.
4. The supplied workflow builds and tests first, then uploads frontend/dist using app_location: frontend/dist, skip_app_build: true, output_location empty and api_location empty.
5. Confirm the site's startup, synthetic calculation, JSON export/restore, report and workbook/offline downloads. Configure the intended audience in Azure before sharing.

No /api/health endpoint is supplied on the static-only route. No separate database or Azure Functions resource is required by this release.

## 2B. Azure App Service

1. Create or choose a Linux Web App using an available Node.js 24 LTS runtime. Select the service plan/region according to your subscription and budget.
2. In Configuration / general settings, set the startup command to:

```
pm2 start backend/server.cjs --no-daemon
```

3. Keep HTTPS enabled. The server uses the platform-provided PORT and listens on 0.0.0.0.
4. Deploy the provided Barkati_Quality_OS_Azure_App_Service_Deploy_2026-10-29.zip with Azure CLI or your approved release pipeline. It contains backend/, frontend/dist/ and package.json directly at ZIP root; no enclosing folder.
5. For this prebuilt ZIP, set SCM_DO_BUILD_DURING_DEPLOYMENT=false. It has no npm dependencies or build step to run.
6. Confirm /api/health returns HTTP 200 with status ok. Open the root page and test the synthetic workflow and download links.
7. If private access is needed, configure App Service Authentication and the permitted identities. The server itself does not implement a login or user authorization system.

Commands for an already created Web App; replace the placeholders with your own resource names:

```bash
az login
az webapp list-runtimes --os linux
az webapp config set --resource-group YOUR_RESOURCE_GROUP --name YOUR_APP_NAME --linux-fx-version "NODE|24-lts" --startup-file "pm2 start backend/server.cjs --no-daemon"
az webapp config appsettings set --resource-group YOUR_RESOURCE_GROUP --name YOUR_APP_NAME --settings SCM_DO_BUILD_DURING_DEPLOYMENT=false
az webapp deploy --resource-group YOUR_RESOURCE_GROUP --name YOUR_APP_NAME --src-path Barkati_Quality_OS_Azure_App_Service_Deploy_2026-10-29.zip --type zip
```

Runtime availability can change; use the runtime list to confirm the selected stack. These commands are provided for your use and have not been run against your subscription.

## 2C. Other container providers

From the full-source root, after npm run build:

```bash
docker build -t barkati-quality-os .
docker run --rm -p 8080:8080 -e PORT=8080 barkati-quality-os
```

Configure the provider's public ingress to the container port, HTTPS and access policy. The image runs as the non-root node user. There is no server-side persistent volume requirement because cases remain browser-local.

## 3. Handover and user data

- Moving from the ChatGPT Site, local HTML or another domain does not migrate browser local storage. Export case JSON before switching, then import it at the new origin.
- The offline file remains available in frontend/dist/downloads/Barkati_Quality_OS_Offline.html. Download it to use without cloud connectivity.
- The separate Frontend ZIP contains the frontend/ folder. The Backend ZIP contains the backend/ folder. Extract both into the same parent, or use the recommended full-source ZIP.
- Do not describe /api/health as a case-management API. Database, tenant isolation, AI and enterprise approvals require a separate implementation increment.
- To connect the external AVO PPMA, provide its actual source repository and database schema with synthetic data. This package does not contain that unavailable source.

## Official references checked 29 October 2026

- Node.js runtime, PORT and PM2 startup: https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs
- Static build app_location/output_location/api_location and skip_app_build: https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration
- ZIP root structure and az webapp deploy: https://learn.microsoft.com/en-us/azure/app-service/deploy-zip
