# AI Code Mentor Web

[AI Code Mentor](https://github.com/kikifory/ai-code-mentor) 的前端应用。用户提交算法题目与代码，查看 AI 结构化分析报告，并对报告进行多轮追问。

---

## 功能概览

| 页面 | 说明 |
|------|------|
| 登录 / 注册 | JWT 认证，Token 持久化到 localStorage |
| 首页 | 快捷入口与最近分析记录 |
| 代码分析 | Monaco 编辑器、题目表单、客户端乱码校验 |
| 分析报告 | Markdown 渲染、复制报告、AI 问答助手 |
| 历史记录 | 分页列表、筛选、删除 |

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite 5 |
| UI | Element Plus |
| 状态 | Pinia |
| 路由 | Vue Router |
| 编辑器 | Monaco Editor |
| Markdown | markdown-it + github-markdown-css |
| HTTP | Axios |

---

## 环境要求

- Node.js 18+
- 后端服务 [ai-code-mentor](https://github.com/kikifory/ai-code-mentor) 已在本地 `8080` 端口运行

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器访问 [http://localhost:5173](http://localhost:5173)。

开发模式下，`/api` 请求会通过 Vite 代理转发到 `http://localhost:8080`（见 `vite.config.ts`）。

### 3. 生产构建

```bash
npm run build
npm run preview
```

构建产物在 `dist/` 目录。部署时需将 `/api` 反向代理到后端服务。

---

## 项目结构

```
ai-code-mentor-web/
├── src/
│   ├── api/              # 接口封装（auth、analysis、request）
│   ├── components/       # 公共组件（Layout、CodeEditor）
│   ├── router/           # 路由与登录守卫
│   ├── stores/           # Pinia 状态（user）
│   ├── styles/           # 全局样式（auth.css）
│   ├── utils/            # 工具函数（校验、列表解析）
│   └── views/            # 页面组件
├── vite.config.ts        # Vite 配置与 API 代理
└── package.json
```

---

## 与后端联调

1. 按后端 README 启动 MySQL 与 Spring Boot（默认 `8080`）
2. 在本项目执行 `npm run dev`（默认 `5173`）
3. 注册账号 → 提交代码分析 → 查看报告与追问

后端 API 文档见：[ai-code-mentor/docs/API.md](https://github.com/kikifory/ai-code-mentor/blob/master/docs/API.md)

---

## 相关仓库

- 后端：[kikifory/ai-code-mentor](https://github.com/kikifory/ai-code-mentor)

---

## License

MIT
