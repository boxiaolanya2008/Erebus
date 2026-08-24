import { existsSync } from "node:fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dir = path.resolve(__dirname, "..")

process.chdir(dir)

const modelsUrl = process.env.OPENCODE_MODELS_URL || "https://models.dev"

// 自动检测本地 models-dev-api.json 文件
function findLocalModelsFile(): string | null {
  // 优先检查环境变量指定的路径
  if (process.env.MODELS_DEV_API_JSON && existsSync(process.env.MODELS_DEV_API_JSON)) {
    return process.env.MODELS_DEV_API_JSON
  }

  // 自动查找项目根目录下的 models-dev-api.json
  const projectRoot = path.resolve(__dirname, "../../..")
  const localPath = path.join(projectRoot, "models-dev-api.json")
  if (existsSync(localPath)) {
    return localPath
  }

  // 查找 opencode 包目录下的 models-dev-api.json
  const opencodePath = path.join(dir, "models-dev-api.json")
  if (existsSync(opencodePath)) {
    return opencodePath
  }

  return null
}

const localModelsFile = findLocalModelsFile()
export const modelsData = localModelsFile
  ? await Bun.file(localModelsFile).text()
  : await fetch(`${modelsUrl}/api.json`).then((x) => x.text())

console.log(`Loaded models.dev snapshot${localModelsFile ? ` from ${localModelsFile}` : " (remote)"}`)
