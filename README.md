# duan - URL shortener powered by Cloudflare Workers and D1 Database

## Development

### File Structure
```text
src/
├── handlers/
│   └── redirect.ts      // 负责处理短码重定向的逻辑
├── utils/
│   └── response.ts      // 负责处理响应相关的助手函数
├── types/
│   └── env.ts           // 存放环境类型定义
└── index.ts             // 入口文件，负责设置路由和导入其他模块
```