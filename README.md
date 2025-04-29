# duan - URL shortener powered by Cloudflare Workers and D1 Database

## Development

### File Structure
```text
src/ // 源代码根目录
├── handlers/           // 请求处理函数目录，存放处理特定请求（如API endpoint）的逻辑
│   ├── createLink.ts       // 处理创建链接的逻辑
│   ├── redirect.ts         // 处理短码重定向的逻辑
│   └── updateLink.ts       // 处理更新链接的逻辑
├── middleware/         // 中间件目录，存放请求处理链中的中间件函数（如认证、日志）
│   └── auth.ts             // 处理认证（authentication）相关的中间件
├── types/              // 类型定义目录，存放TypeScript的类型定义
│   └── env.ts              // 定义环境变量的类型
├── utils/              // 工具函数目录，存放通用的、可复用的助手函数
│   └── response.ts         // 处理响应相关的通用函数（如格式化成功/错误响应）
└── index.ts            // 项目入口文件，通常负责应用程序的初始化、路由设置和导入其他模块

```