# Erebus 🔥

**Erebus** (厄瑞玻斯) — AI coding agent forged in primordial darkness.

Named after the Greek primordial deity of darkness, Erebus is a standalone desktop application for AI-assisted coding. It bundles an Electron shell, a SolidJS renderer, and the OpenCode server engine into a self-contained project that can be built and run independently.

## Features

### ⚡ GPU Acceleration (Configurable)
- **Hardware Acceleration**: GPU rasterization, zero-copy compositing, accelerated 2D Canvas
- **GPU-Accelerated Rendering**: GPU compositing for model messages, thinking blocks, and Markdown
- Toggle both independently in **Settings → General → GPU Acceleration**
- Default: both enabled

### 🌐 Multi-Language Support
- 60+ languages with automatic detection
- GPU settings section fully internationalized
- Language setting persists across sessions

### 🚀 Performance Optimizations
- **Async window creation**: Window shows immediately while server starts in background
- **Lazy Sentry**: Error reporting loaded on-demand, not on critical path
- **Optimized retry**: Faster recovery from transient failures (200ms base delay)

### 📁 Unified APPDATA Storage
- All data (database, config, logs) stored under `%APPDATA%\com.erebus.desktop\`
- No more scattered files across `~/.local/share` and `~/.config`

## Prerequisites

- [Bun](https://bun.sh) `1.3.14` (pinned via `packageManager`)
- Node toolchain for native modules (`@lydell/node-pty`, tree-sitter)
- For full packaged build: network access (Electron runtime, CLI binary) + `tar`/`zip`

## Quick Start

```bash
# Install dependencies
bun install

# Build the bundled opencode server (node build for the sidecar)
bun run build:server

# Launch in dev mode (Electron + hot reload)
bun run dev:desktop
```

## Build

```bash
# Full build (server + desktop)
bun run build

# Or step by step:
bun run build:server    # 1) Build opencode server dist/node
bun run build:desktop   # 2) Build Electron app
```

### Offline Builds

The build scripts fetch a `models.dev` model-catalog snapshot from the network by default. For offline environments:

- `.env` sets `MODELS_DEV_API_JSON` to a local `models-dev-api.json` placeholder
- Replace with a real snapshot for accurate model data
- The CLI download in `prebuild.ts` is gracefully degraded (try/catch) when offline

## Project Structure

```
desktop-standalone/
├── package.json          # workspace root + build scripts
├── .env                  # offline build config (MODELS_DEV_API_JSON)
├── models-dev-api.json   # offline placeholder for models.dev snapshot
├── .github/              # TEAM_MEMBERS (consumed by the build script)
├── patches/              # patched dependencies
└── packages/
    ├── desktop/          # Electron shell — main, preload, renderer
    ├── app/              # SolidJS renderer UI (shared with web)
    ├── ui/               # Shared DOM components
    ├── session-ui/       # Session UI (messages, diff, markdown)
    ├── core/             # Domain engine (config, sessions, tools, permissions)
    ├── llm/              # Model provider abstraction (OpenAI, Anthropic, Google…)
    ├── protocol/         # Public HttpApi contract
    ├── server/           # HttpApi handlers + embedded host
    ├── schema/           # Domain value definitions (Effect Schema)
    ├── sdk/              # JS/TS SDK (legacy + v2)
    ├── tui/              # Terminal UI (also used by server)
    ├── plugin/           # Plugin SDK
    ├── codemode/         # Code migration utilities
    ├── script/           # Build/script helpers
    ├── opencode/         # CLI + server (produces dist/node for the sidecar)
    ├── effect-drizzle-sqlite/
    ├── effect-sqlite-node/
    └── http-recorder/
```

| Package | Purpose |
|---------|---------|
| `desktop` | Electron main/preload/renderer, sidecar management, IPC |
| `app` | SolidJS renderer UI, settings, platform integration |
| `ui` | Shared DOM components (buttons, dialogs, themes) |
| `session-ui` | Message rendering, markdown, diff, thinking blocks |
| `core` | Domain engine — sessions, tools, permissions, config |
| `llm` | Model provider abstraction with connection pooling |
| `protocol` | Public HttpApi contract (paths, payloads, errors) |
| `server` | HttpApi handlers, middleware, persistence |
| `schema` | Domain value definitions (Effect Schema) |
| `sdk` | JavaScript/TypeScript SDK (legacy + v2) |
| `opencode` | CLI entry + server build (produces sidecar bundle) |

## Architecture

Erebus follows a strict dependency DAG:

```
Schema → Protocol → Server → Core
                ↓
             Client (zero-Effect)
                ↓
             SDK / sdk-next
                ↓
             desktop (Electron shell)
```

- **Client** runtime depends only on Schema + Protocol (never Core or Server)
- **Server** embeds Core as in-process Effect Layers
- **Desktop** spawns the server as a sidecar via `virtual:opencode-server`

## Key Changes from Upstream

| Area | Change |
|------|--------|
| Branding | Renamed to Erebus, `com.erebus.desktop` appId, `erebus://` protocol |
| Storage | All data unified to APPDATA via `XDG_DATA_HOME` + `XDG_CONFIG_HOME` |
| Performance | Async window creation, lazy Sentry, 200ms retry delay |
| GPU | Configurable hardware acceleration + GPU-composited message rendering |
| i18n | 60+ languages, GPU settings fully internationalized |

## License

MIT
