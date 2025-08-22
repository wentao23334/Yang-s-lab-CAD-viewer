# Project Agent Playbook (Gemini + Playwright MCP)

## 目标
- 我在这个项目里让你“添加某功能/改某模块”时，请按以下步骤自动执行：
  1) 启动或连接到本地预览服务（见下方命令/端口）。
  2) 使用 **Playwright MCP** 打开站点 URL，收集：
     - `browser_console_messages`（console）
     - `browser_network_requests`（网络请求与 4xx/5xx）
     - （可选）`browser_take_screenshot`（截图）
  3) 若发现 `pageerror`、`console.error/Uncaught` 或 4xx/5xx，请定位源文件并**最小必要修改**（先给出 diff 计划，再落盘）。
  4) 刷新页面复验，重复最多 3 轮：每轮输出剩余问题清单与下一步计划。

## 启动/预览

- 开发：`npm run dev` 端口 **5173**
- 生产预览：`npm run build && npm run preview`
- 若端口或命令不同，请以 `package.json` 为准；如服务已在运行则直连。

**重要提示：关于本地开发服务器的启动**

由于 `npm run dev` 等本地开发服务器命令会持续运行，不会自动终止，我无法直接通过工具等待其完成。为了确保验证流程顺畅，当需要启动本地开发服务器时，请您：

1.  **在您的终端中手动运行 `npm run dev` 命令。**
2.  **确认服务器已成功启动并显示类似 "ready in XXX ms" 的消息。**
3.  **通知我服务器已就绪**，我将随后使用 Playwright (MCP) 连接到该运行中的服务器进行验证。

---

## Playwright MCP 约定
- 导航到：`http://localhost:5173/`（按需改成你的预览地址）
- 工具调用：`browser_navigate` → `browser_console_messages` → `browser_network_requests` → （必要时）`browser_take_screenshot`
- 判定：存在致命错误或 4xx/5xx 视为失败，进入“修复→复验”循环
- 复验：每次修改后重新加载页面并再次收集同样数据

## 代码修改边界与质量阀
- **最小改动**，保持对外接口不破坏；先展示 **diff** 再写入文件
- 遵守项目的 ESLint/Prettier/TypeScript 规则（如有）
- 涉及依赖：先写入 `package.json` 再安装，说明理由

## 安全限制
- 禁止危险命令（如 `rm -rf`、未知脚本下载/执行）
- 仅可使用白名单命令（git / npm / node / vite / playwright 等）