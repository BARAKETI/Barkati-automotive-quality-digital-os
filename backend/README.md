# Hosting backend

This folder was added on 29 October 2026. It serves the existing frontend and GET/HEAD /api/health. It is not the original AVO application backend and does not implement accounts, shared cases, databases, uploads, approvals or AI inference.

Run from repository root: npm run build, then npm start. PORT comes from Azure or defaults to 8080. The server serves only frontend/dist. It does not require npm runtime dependencies. Azure App Service TLS and access control are configured at the hosting layer.
