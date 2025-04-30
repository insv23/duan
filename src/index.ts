// src/index.ts

import { AutoRouter } from "itty-router";
import { handleRedirect } from "./handlers/redirect";
import { handleCreateLink } from "./handlers/createLink";
import { handleUpdateLink } from "./handlers/updateLink";
import { authenticateApiRequest } from "./middleware/auth";
import { handleListLinks } from "./handlers/listLinks";
import { handleDeleteLink } from "./handlers/deleteLink";
import { handleGetLink } from "./handlers/getLink";
import { handleListShortcodes } from "./handlers/listShortcodes";

const router = AutoRouter();

// GET /:shortcode - 短链接重定向
router.get("/:shortcode", handleRedirect);

// --- API 路由 (需要鉴权) ---
// 在所有以 /api/ 开头的路由前应用 authenticateApiRequest 中间件
router.all("/api/*", authenticateApiRequest);

// POST /api/links - 创建短链接
router.post("/api/links", handleCreateLink);

// PATCH /api/links/:shortcode - 修改短链接
router.patch("/api/links/:shortcode", handleUpdateLink);

// GET /api/links - 获取所有链接列表
router.get("/api/links", handleListLinks);

// DELETE /api/links/:shortcode - 删除特定链接
router.delete("/api/links/:shortcode", handleDeleteLink);

// GET /api/links/:shortcode - 获取特定链接
router.get("/api/links/:shortcode", handleGetLink);

// GET /api/shortcodes - 获取所有 shortcode 列表 (只返回 shortcode 字符串数组)
router.get("/api/shortcodes", handleListShortcodes);

export default router;
