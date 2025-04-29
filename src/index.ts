import { AutoRouter } from "itty-router";

export interface Env {
	DB: D1Database;
}

// --- 助手函数 ---

// 标准 JSON 响应
const jsonResponse = (data: unknown, status = 200): Response => {
	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
		status,
	});
};

// 标准错误响应
const errorResponse = (message: string, status = 400): Response => {
	// 错误响应通常包含一个 'error' 字段
	return jsonResponse({ error: message }, status);
};

// 将路由处理逻辑抽象为一个独立的异步函数
async function handleRedirect(
	{ params }: { params: { code?: string } },
	env: Env,
): Promise<Response> {
	const short_code = params.code;

	//  short_code 格式验证，例如不允许包含 /
	if (!short_code || short_code.includes("/")) {
		// 使用 errorResponse 替代手动创建 Response
		return errorResponse("Invalid short code format", 400); // 通常是 400 Bad Request
	}

	try {
		// 查询链接信息，包括是否启用
		const link = await env.DB.prepare(
			"SELECT original_url, is_enabled FROM links WHERE short_code = ?",
		)
			.bind(short_code)
			.first<{ original_url: string; is_enabled: number } | null>();

		// 如果未找到链接或链接未启用
		if (!link || link.is_enabled !== 1) {
			// 使用 errorResponse 替代手动创建 Response
			return errorResponse("Short code not found or disabled.", 404);
		}

		// 异步更新访问统计和最后访问时间
		await env.DB.prepare(
			"UPDATE links SET last_visited_at = CURRENT_TIMESTAMP, visit_count = visit_count + 1 WHERE short_code = ?",
		)
			.bind(short_code)
			.run();

		// 执行 302 重定向
		return Response.redirect(link.original_url, 302);
	} catch (e: unknown) {
		console.error("D1 error during redirect:", e);
		// 在跳转路径遇到数据库错误，返回 500
		// 使用 errorResponse 替代手动创建 Response
		return errorResponse("Internal server error during redirect lookup", 500);
	}
}

const router = AutoRouter();

router.get("/:code", handleRedirect);

export default router;
