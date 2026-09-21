# PC Build Simulator

Run with Node.js 22.13 or newer (Node 24 recommended):

```sh
pnpm install --frozen-lockfile
npm run dev
```

Open http://localhost:3000, register an account, and select components in the builder. Use **My builds** to revisit saved assemblies.

The default `/api` runs inside Next.js; no separate backend is needed. Accounts, signing keys, and builds persist in `.data/pc-builder.sqlite`. Keep this directory private and backed up. `PC_BUILDER_DATA_DIR` can point to another persistent directory. A hosted deployment needs a persistent disk and a Node runtime supporting `node:sqlite`; ephemeral/serverless filesystems will not preserve accounts. The separate `backend/` Express application is an alternative API and is not used by default.

The catalog contains sample prices and relative scores. 3D parts are illustrative, not exact manufacturer models. Compatibility checks cover the supplied catalog's socket, memory, cooler, GPU clearance, and estimated power data; they do not replace manufacturer checks. Thermal results are not simulated. Forum data and benchmark examples remain demonstration data.

Validation:

```sh
npm run typecheck
npm run build
# With the dev server running:
npm test
```

The smoke test checks all eight catalogs, account registration and login, profile edits, build creation/retrieval/deletion, prices, invalid components, and access restrictions. It creates a uniquely named local test account and deletes the build it creates. Set `TEST_URL` to test a different local server.
