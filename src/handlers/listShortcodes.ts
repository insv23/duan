// src/handlers/listShortcodes.ts

import type { Env } from "../types/env";
import { jsonResponse, errorResponse } from "../utils/response";
import type { IRequest } from "itty-router";

// 处理获取所有 shortcodes 列表的 GET 请求
export async function handleListShortcodes(
	request: IRequest,
	env: Env,
): Promise<Response> {
	try {
		// 1. 从数据库中查询所有链接的 short_code
		// SELECT short_code FROM links 将只返回 short_code 列
		const { results } = await env.DB.prepare(
			"SELECT short_code FROM links",
		).all<{ short_code: string }>();

		// 2. 提取 short_code 值并构建一个字符串数组
		// results 是一个 [{ short_code: 'abc' }, { short_code: 'xyz' }, ...] 格式的数组
		// 我们需要将其转换为 ['abc', 'xyz', ...]
		const shortcodes = results ? results.map((row) => row.short_code) : [];

		// 3. 返回成功响应 (JSON 数组)
		// 如果数据库是空的，shortcodes 会是 []，jsonResponse( [] ) 返回空数组的 JSON
		return jsonResponse(shortcodes, 200);
	} catch (e: unknown) {
		// 4. 错误处理
		console.error("D1 error during shortcode listing:", e);
		return errorResponse(
			"Internal server error during shortcode listing.",
			500,
		);
	}
}
