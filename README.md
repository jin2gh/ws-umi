# ws-umi
umi 项目，存放一些业务 demo。

```sh
├── apps
│   ├── rc-pc                # React 应用
│   │   ├── src
│   │   ├── .umirc.ts        # Umi 配置
│   │   └── package.json
│   └── vue3                 # Vue 应用
│       ├── src
│       ├── .umirc.ts        # Umi 配置（启用 Vue 插件）
│       └── package.json
├── packages                 # 共享包
├── package.json             # 根项目配置
├── turbo.json               # Turbo 任务流水线
├── pnpm-workspace.yaml      # 声明 Monorepo Workspace（pnpm）
└── tsconfig.json            # 根 TypeScript 配置（引用子包）
```