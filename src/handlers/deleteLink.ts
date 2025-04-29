// src/handlers/deleteLink.ts

import type { Env } from "../types/env"; // 导入环境类型
import { jsonResponse, errorResponse } from "../utils/response"; // 导入响应助手函数
import type { IRequest } from "itty-router"; // itty-router 请求对象，用于访问 params

// 处理删除短链接的 DELETE 请求
export async function handleDeleteLink(
	request: IRequest, // itty-router 提供的请求对象，包含 params
	env: Env, // 导入并使用 Env 类型
): Promise<Response> {
	// 1. 从路径参数中获取 shortcode
	const shortcode = request.params.shortcode;

	// 2. 验证 shortcode 是否存在
	if (!shortcode) {
		return errorResponse("Missing shortcode in path.", 400); // Bad Request
	}

	try {
		// 3. 执行数据库删除操作
		// 使用 .run() 执行 DELETE, UPDATE, INSERT 等非查询语句
		// meta.changes 会返回被删除的行数
		const result = await env.DB.prepare(
			"DELETE FROM links WHERE short_code = ?",
		)
			.bind(shortcode)
			.run();

		// 4. 检查是否成功删除了行
		if (result.meta.changes === 0) {
			// 如果 changes 是 0，说明没有找到匹配 shortcode 的行
			return errorResponse(
				`Link with shortcode '${shortcode}' not found.`,
				404,
			); // Not Found
		}

		// 5. 返回成功响应
		// 200 OK 表示请求成功，并已执行删除
		return jsonResponse(
			{ message: `Link with shortcode '${shortcode}' deleted successfully.` },
			200,
		);
	} catch (e: unknown) {
		// 6. 错误处理
		console.error("D1 error during link deletion:", e);
		return errorResponse("Internal server error during link deletion.", 500); // 500 Internal Server Error
	}
}
