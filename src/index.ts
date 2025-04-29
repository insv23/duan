// src/index.ts

import { AutoRouter } from "itty-router";
import { handleRedirect } from "./handlers/redirect";
import { handleCreateLink } from "./handlers/createLink";

const router = AutoRouter();

// GET /:code - 短链接重定向
router.get("/:code", handleRedirect);

// POST /api/create - 创建短链接
router.post("/api/create", handleCreateLink);

export default router;
