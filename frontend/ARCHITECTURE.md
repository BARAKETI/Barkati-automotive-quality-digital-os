# Architecture and extension contract

The browser reads one case object validated by src/model.js. It calls pure functions in src/engine.js; no backend or remote numerical service is required. Edits update the local case and revision and invalidate human closure. JSON is the portable interchange format. CSV is measurement/register interchange, not an enterprise connector.

Shared entities: case/specification/study, evidence, tests, causes, actions, exposure, Design/Process/Equipment risks, Control Plan, APQP deliverables, audit findings, and local activity events. Links use stable record IDs. The schema version is barkati.quality.case.1. The executable validator and fixtures are the authoritative current contract.

A hosted increment must preserve these IDs and introduce authenticated users, tenant IDs, access policies, immutable server events, document object storage, retention, migrations and protected server-side model calls. Do not trust local reviewer strings as electronic signatures or run API keys in the browser.

To embed under an existing hub, copy dist to the desired directory and link to its index.html. Asset paths are relative. Review and reconcile case identity before merging legacy customer data. A new static path can create a different local-storage origin; use JSON export/import to transfer records.
