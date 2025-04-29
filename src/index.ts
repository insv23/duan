// src/index.ts

import { AutoRouter } from "itty-router";
import { handleRedirect } from "./handlers/redirect";
import { handleCreateLink } from "./handlers/createLink";
import { handleUpdateLink } from "./handlers/updateLink";

const router = AutoRouter();

// GET /:shortcode - 短链接重定向
router.get("/:shortcode", handleRedirect);

// POST /api/create - 创建短链接
router.post("/api/create", handleCreateLink);

// PATCH /api/links/:shortcode - 修改短链接
router.patch("/api/links/:shortcode", handleUpdateLink);

export default router;
