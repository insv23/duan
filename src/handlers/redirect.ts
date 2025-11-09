// src/handlers/redirect.ts

import type { Env } from "../types/env"; // 从 types 目录导入 Env 类型
import { errorResponse } from "../utils/response"; // 从 utils 目录导入错误响应函数
import { normalizeShortCode, isValidShortCode } from "../utils/shortcode";

// 负责处理短码重定向的逻辑
export async function handleRedirect(
	{ params }: { params: { shortcode?: string } }, // itty-router 提供的参数结构
	env: Env, // 导入并使用 Env 类型
): Promise<Response> {
	const shortCodeParam = params.shortcode;

	const normalizedShortCode = normalizeShortCode(shortCodeParam);
	if (!normalizedShortCode) {
		return errorResponse("Invalid short_code format", 400); // Bad Request
	}

	if (!isValidShortCode(normalizedShortCode)) {
		return errorResponse("Invalid short_code format", 400); // Bad Request
	}

	try {
		// 查询链接信息，包括是否启用
		const link = await env.DB.prepare(
			"SELECT original_url, is_enabled FROM links WHERE short_code = ?",
		)
			.bind(normalizedShortCode)
			.first<{ original_url: string; is_enabled: number } | null>();

		// 如果未找到链接或链接未启用
		if (!link || link.is_enabled !== 1) {
			return errorResponse("Short_code not found or disabled.", 404); // Not Found
		}

		// 异步更新访问统计和最后访问时间
		await env.DB.prepare(
			"UPDATE links SET last_visited_at = CURRENT_TIMESTAMP, visit_count = visit_count + 1 WHERE short_code = ?",
		)
			.bind(normalizedShortCode)
			.run();

		// 执行 302 重定向
		return Response.redirect(link.original_url, 302);
	} catch (e: unknown) {
		console.error("D1 error during redirect:", e);
		// 在跳转路径遇到数据库错误，返回 500
		return errorResponse("Internal server error during redirect lookup", 500); // Internal Server Error
	}
}
