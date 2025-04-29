// src/index.ts

import { AutoRouter } from "itty-router";
import { handleRedirect } from "./handlers/redirect";

const router = AutoRouter();

// 定义路由并绑定处理函数
router.get("/:code", handleRedirect);

export default router;
