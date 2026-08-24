import { $ } from "bun"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { downloadCliToResources } from "./utils"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootEnv = path.resolve(__dirname, "../../../.env")

await $`bun run install-electron`

await $`bun ./scripts/copy-icons.ts ${process.env.OPENCODE_CHANNEL ?? "dev"}`

await $`cd ../opencode && bun --env-file=${rootEnv} script/build-node.ts`
try {
  await downloadCliToResources()
} catch (error) {
  console.warn(
    "Skipped downloading opencode CLI to resources (offline or unavailable). " +
      "The desktop sidecar uses the bundled opencode server build, so this is non-fatal for local builds.",
    error,
  )
}
