// src/utils/response.ts

// 标准 JSON 响应
export const jsonResponse = (data: unknown, status = 200): Response => {
	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
		status,
	});
};

// 标准错误响应
export const errorResponse = (message: string, status = 400): Response => {
	// 错误响应通常包含一个 'error' 字段
	return jsonResponse({ error: message }, status);
};
