#!/usr/bin/env bun
import { $ } from "bun"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { downloadCliToResources, resolveChannel } from "./utils"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// The standalone project root holds .env (offline models snapshot). Pass it
// explicitly because the build-node subprocess changes directory to
// packages/opencode and would otherwise not load it.
const rootEnv = path.resolve(__dirname, "../../../.env")

const channel = resolveChannel()
await $`bun ./scripts/copy-icons.ts ${channel}`
await $`bun ./scripts/copy-metainfo.ts ${channel}`

await $`cd ../opencode && bun --env-file=${rootEnv} script/build-node.ts`
if (channel === "dev") {
  try {
    await downloadCliToResources()
  } catch (error) {
    console.warn(
      "Skipped downloading opencode CLI to resources (offline or unavailable). " +
        "The desktop sidecar uses the bundled opencode server build, so this is non-fatal for local builds.",
      error,
    )
  }
}
