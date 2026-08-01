<p align="center">
  <img src="https://raw.githubusercontent.com/attocash/integrations-n8n/main/docs/images/atto-n8n-banner.png" alt="Atto nodes for n8n: payments, accounts, receivables, and live network events" width="100%">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@attocash/n8n-nodes-atto"><img src="https://img.shields.io/npm/v/@attocash/n8n-nodes-atto.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@attocash/n8n-nodes-atto"><img src="https://img.shields.io/npm/dw/@attocash/n8n-nodes-atto.svg" alt="npm weekly downloads"></a>
  <a href="https://github.com/attocash/integrations-n8n/actions/workflows/n8n-node-package.yml"><img src="https://github.com/attocash/integrations-n8n/actions/workflows/n8n-node-package.yml/badge.svg" alt="n8n Atto Node CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
</p>

# Atto for n8n

Use Atto in n8n workflows. The package can derive wallet addresses, read network data, sign payments, receive funds, change representatives, and start workflows from live Atto events.

It includes two nodes:

- **Atto** runs wallet, account, receivable, transaction, account-entry, and representative operations.
- **Atto Trigger** listens to receivable, account, transaction, and account-entry streams.

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Credentials](#credentials)
- [Nodes](#nodes)
- [Example workflows](#example-workflows)
- [Security](#security)
- [Compatibility](#compatibility)
- [Development](#development)
- [How Commons is used](#how-commons-is-used)
- [Support](#support)

## Installation

### Self-hosted n8n

1. Open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `@attocash/n8n-nodes-atto`.
4. Confirm the community-node warning and install the package.

Restart n8n if the nodes do not appear in the node picker. The [n8n community-node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) covers other self-hosted installation methods.

## Quick start

1. Create an **Atto API** credential.
2. Set the Node Base URL for the Atto HTTP API.
3. Add an **Atto** or **Atto Trigger** node to a workflow.
4. Choose a resource and operation, then run the node.

Read operations and triggers use the Node Base URL. Sending, receiving, and changing representatives also require the Worker Base URL and wallet material.

<p align="center">
  <img src="https://raw.githubusercontent.com/attocash/integrations-n8n/main/docs/images/receivable-workflow.png" alt="An n8n workflow that receives an Atto receivable" width="900">
</p>

The example above starts when a receivable appears and passes it to **Receivable > Receive**. Import [`examples/incoming-to-receive.json`](./examples/incoming-to-receive.json) to use the same layout.

## Credentials

Create an **Atto API** credential in n8n.

| Field | When it is needed |
| --- | --- |
| Node Base URL | Network reads, transaction publication, and triggers |
| Worker Base URL | Send, receive, and representative-change operations |
| API Key, Header, and Prefix | Optional authentication for Node and Worker requests |
| Wallet Secret Type and Wallet Secret | Signing and filters that derive an address from credentials |
| Key Index | Mnemonic-derived addresses; defaults to `0` |

The wallet secret can be a 24-word Atto mnemonic or a compatible hex private key. n8n encrypts credential values at rest.

The credential test sends `GET /` to the Node Base URL. It does not send the wallet secret or call the Worker Base URL.

## Nodes

### Atto

| Resource | Operations | What it does |
| --- | --- | --- |
| Address | Derive | Derives an address and public key from a mnemonic or private key |
| Account | Get | Reads balance, representative, height, and frontier |
| Receivable | Get, Receive | Lists pending receivables or publishes a receive transaction |
| Transaction | Get, Send | Reads transaction streams or publishes a send transaction |
| Account Entry | Get | Fetches entries by hash or reads a bounded entry stream |
| Representative | Change | Publishes a representative-change transaction |

Send and receive wait up to 60 seconds for publication by default. Stream reads stop when they reach **Max Items** or **Timeout**.

<p align="center">
  <img src="https://raw.githubusercontent.com/attocash/integrations-n8n/main/docs/images/atto-node-operations.png" alt="The Atto node resource and operation controls in n8n" width="900">
</p>

### Atto Trigger

| Event | Filters |
| --- | --- |
| Receivable | Credential-derived address, manual addresses, and minimum amount |
| Account Update | Credential-derived address, manual addresses, or all accounts |
| Transaction | Hash, credential-derived address, manual addresses, or all transactions |
| Account Entry | Hash, credential-derived address, manual addresses, or all entries |

Triggers use Atto's NDJSON endpoints. When a stream closes or fails, the node reconnects with exponential backoff from 1 to 30 seconds. Receiving an event resets the delay.

## Example workflows

The [`examples`](./examples) directory contains importable workflows:

- [`send-transaction.json`](./examples/send-transaction.json) sends Atto from a manual trigger.
- [`incoming-to-receive.json`](./examples/incoming-to-receive.json) receives an incoming receivable.
- [`ping-pong-receivable.json`](./examples/ping-pong-receivable.json) receives a payment and sends the same raw amount back.
- [`receivable-trigger.json`](./examples/receivable-trigger.json) starts a workflow when a receivable appears.

Attach your **Atto API** credential after importing a workflow. Replace placeholder addresses before running a transaction operation.

## Security

Store wallet material in n8n credentials when working with real funds. The node also accepts wallet material as password-type node parameters for local derivation and controlled testing, but your n8n instance may retain node parameters in workflow or execution records.

The node does not log or return wallet secrets, seeds, private keys, or API keys. Review n8n execution-data retention and access controls before using signing operations in production.

## Compatibility

| Component | Requirement |
| --- | --- |
| n8n node metadata | Nodes API v1 |
| Node.js runtime and development | 22.22.0 or newer |
| Package manager | npm |
| Container integration tests | Docker or a local Podman socket |

The Node.js requirement is checked when npm installs the package. The official current n8n container image uses a compatible runtime; custom installations must provide Node.js 22.22.0 or newer.

## Development

Install dependencies and run the checks:

```bash
npm ci --ignore-scripts
npm run build
npm run lint
npm test
```

`npm test` runs the integration, smoke, trigger, and unit test files in sequence. The integration file records a skip when neither Docker nor a local Podman socket is available. Require the container path with:

```bash
ATTO_TEST_INTEGRATION=1 npm run test:integration
```

Start the n8n development environment with:

```bash
npm run dev
```

### Install from a checkout

If you have shell access inside an n8n container:

```bash
cd /tmp
git clone https://github.com/attocash/integrations-n8n.git
cd integrations-n8n
npm run install:n8n
```

The installer builds, validates, packs, and installs the generated tarball. It uses these locations in order:

1. `N8N_NODES_DIR`, when set.
2. `${N8N_USER_FOLDER}/.n8n/nodes`, when `N8N_USER_FOLDER` is set.
3. `${HOME}/.n8n/nodes`.

Set `RUN_TESTS=1` to run the full test suite before installation. Restart n8n when the installer finishes.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the release process and maintainer setup.

## How Commons is used

Atto Commons supplies the protocol models, address derivation, block construction, hashing, and signing.

| Package | Role in this repository | Published package |
| --- | --- | --- |
| `@attocash/commons-core` | Runtime protocol implementation | Bundled into the built protocol adapter |
| `@attocash/commons-test` | Node and Worker mocks for integration tests | Not used or installed at runtime |
| `n8n-workflow` | n8n types and runtime APIs | Provided by n8n as a peer dependency |

Network requests go through n8n's HTTP helpers. The npm package has no production dependencies; Commons Core is bundled once so n8n does not need a separate Commons installation.

## Support

- Read the operation notes in [USAGE.md](./USAGE.md).
- Open a bug or feature request in [GitHub Issues](https://github.com/attocash/integrations-n8n/issues).
- See the [n8n community-node documentation](https://docs.n8n.io/integrations/community-nodes/).

This package is available under the [MIT License](./LICENSE).
