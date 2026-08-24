# Runtime Warnings & Troubleshooting

> 本文档记录项目运行过程中遇到的常见错误及其解决方案，便于团队成员快速排查问题。

---

## 1. SSL 证书验证失败

**错误信息：**
```
error: UNABLE_TO_VERIFY_LEAF_SIGNATURE downloading tarball ghostty-web@github:anomalyco/ghostty-web
```

**原因：**  
下载 GitHub 上的依赖时，SSL 证书验证失败（常见于企业内网、代理环境或 Windows 证书链不完整）。

**解决方案：**
```bash
# 临时跳过 SSL 验证安装依赖
set NODE_TLS_REJECT_UNAUTHORIZED=0
bun install
```

**如何避免：**
- 配置正确的公司代理和证书
- 或在 `bunfig.toml` 中配置 `[install] strict-ssl = false`（不推荐生产环境使用）

---

## 2. Electron 模块未找到

**错误信息：**
```
Error: Cannot find module 'D:\...\packages\desktop\node_modules\electron\install.js'
```

**原因：**  
Electron 依赖未正确安装，或安装过程中断导致模块损坏。

**解决方案：**
```bash
# 重新安装依赖
bun install
```

**如何避免：**
- 确保网络稳定后再执行安装
- 安装失败后删除 `node_modules` 重新安装

---

## 3. entities 模块解析错误

**错误信息：**
```
error: Could not resolve: "entities/lib/decode.js"
error: Cannot find module 'entities/decode'
```

**原因：**  
`htmlparser2` 和 `parse5` 依赖不同版本的 `entities` 包，bun 的依赖提升导致模块路径冲突。

**解决方案：**
```bash
# 安装兼容版本
bun remove entities
bun add entities@5.0.0

# 如果仍有问题，清除缓存重新安装
Remove-Item -Recurse -Force node_modules\.bun
bun install --force
```

**如何避免：**
- 锁定 `entities` 版本在 `package.json` 中
- 升级 bun 至最新版本（依赖解析可能改善）

---

## 4. MODELS_DEV_API_JSON 路径不存在

**错误信息：**
```
ENOENT: no such file or directory, open 'D:\...\models-dev-api.json'
```

**原因：**  
`.env` 文件中的 `MODELS_DEV_API_JSON` 指向了硬编码的本地路径，换电脑或换用户名后路径失效。

**解决方案：**  
修改 `packages/opencode/script/generate.ts`，支持自动检测项目根目录下的 `models-dev-api.json`（见下方修复）。

**如何避免：**  
不要在 `.env` 中使用绝对路径，改用相对路径或自动检测逻辑。

---

## 5. CLI 版本下载失败（非致命警告）

**错误信息：**
```
error: No version matching "0.0.0-next-16350" found for specifier "@opencode-ai/cli-windows-x64-baseline"
Skipped downloading opencode CLI to resources (offline or unavailable).
```

**原因：**  
CLI 版本号尚未发布到 npm，或网络无法访问 npm 仓库。

**解决方案：**  
此警告为非致命错误，桌面应用会使用内置的 opencode server 构建版本。如需完整功能：
- 确保网络可访问 npm 仓库
- 等待 CLI 版本发布

**如何避免：**  
- 在 `scripts/utils.ts` 中更新 `CLI_VERSION` 为已发布的版本号
- 或在离线环境下忽略此警告

---

## 6. Content Security Policy 警告

**警告信息：**
```
Electron Security Warning (Insecure Content-Security-Policy)
```

**原因：**  
开发模式下未设置严格的 CSP 策略，或启用了 `unsafe-eval`。

**解决方案：**  
此警告仅在开发模式显示，打包后自动消失。生产环境已配置正确的 CSP 策略。

**如何避免：**  
- 开发时可忽略此警告
- 如需消除，在 Electron 主进程配置 CSP 头

---

## 通用排查步骤

```bash
# 1. 清除所有缓存和依赖
Remove-Item -Recurse -Force node_modules
Remove-Item -Force bun.lock

# 2. 重新安装依赖（含 SSL 跳过）
set NODE_TLS_REJECT_UNAUTHORIZED=0
bun install

# 3. 启动开发
bun run dev:desktop
```

---

*文档更新时间：2026-08-24*
