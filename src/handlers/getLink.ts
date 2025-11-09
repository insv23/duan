// src/handlers/getLink.ts

import type { Env } from "../types/env";
import { jsonResponse, errorResponse } from "../utils/response";
import type { IRequest } from "itty-router";

// 处理获取指定 shortcode 链接的 GET 请求
export async function handleGetLink(
	request: IRequest,
	env: Env,
): Promise<Response> {
	// 1. 从路径参数中获取 shortcode
	const shortcodeParam = request.params.shortcode;

	// 2. 验证 shortcode 是否存在
	if (!shortcodeParam) {
		return errorResponse("Missing shortcode in path.", 400);
	}

	const trimmedShortcode = shortcodeParam.trim();
	if (!trimmedShortcode) {
		return errorResponse("Missing shortcode in path.", 400);
	}

	const normalizedShortcode = trimmedShortcode.toLowerCase();

	try {
		// 3. 从数据库中获取链接
		const { results } = await env.DB.prepare(
			"SELECT * FROM links WHERE short_code = ?",
		)
			.bind(normalizedShortcode)
			.all();

		// 4. 检查是否找到了链接
		if (!results || results.length === 0) {
			return errorResponse(
				`Link with shortcode '${trimmedShortcode}' not found.`,
				404,
			);
		}

		// 5. 返回成功响应
		const link = results[0]; // 假设 short_code 是唯一的，所以只取第一个结果
		return jsonResponse(link, 200);
	} catch (e: unknown) {
		// 6. 错误处理
		console.error("D1 error during link retrieval:", e);
		return errorResponse("Internal server error during link retrieval.", 500);
	}
}
