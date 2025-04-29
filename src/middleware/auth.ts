// src/middleware/auth.ts

import type { Env } from "../types/env";
import { errorResponse } from "../utils/response";
import type { IRequest } from "itty-router"; // 导入 IRequest

/**
 * 鉴权中间件：验证 Bearer Token
 * 适用于所有 /api/* 路径
 *
 * @param request - 请求对象 (IRequest)
 * @param env - 环境对象，包含 Secrets
 * // 注意：itt-router 中间件没有显式的 next 函数，通过返回值控制流程
 * @returns Promise<Response | void> - 如果鉴权失败，返回错误响应 (Response)；否则，不返回 (void) 让链继续。
 */
export async function authenticateApiRequest(
	request: IRequest, // 只有 request 和 env (或其他通过 fetch 传入的参数)
	env: Env,
): Promise<Response | undefined> {
	// 返回值类型：Response (失败) 或 undefined (成功继续)
	// 1. 获取 Authorization 头
	const authHeader = request.headers.get("Authorization");

	// 2. 检查 Authorization 头是否存在且格式正确 (Bearer token)
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		// 返回错误响应，这将停止路由链的执行
		return errorResponse(
			"Unauthorized - Missing or malformed Authorization header.",
			401,
		);
	}

	// 3. 提取 token (跳过 "Bearer ")
	const token = authHeader.substring(7); // "Bearer ".length = 7

	// 4. 验证 token
	// 建议：对于生产环境中的 API 密钥，应使用更安全的比较方法，如 timing-safe comparison
	// Cloudflare Workers 提供了 `crypto.subtle.timingSafeEqual`
	// const encoder = new TextEncoder();
	// const expectedTokenBytes = encoder.encode(env.API_TOKEN);
	// const actualTokenBytes = encoder.encode(token);

	// if (actualTokenBytes.byteLength !== expectedTokenBytes.byteLength ||
	//     !crypto.subtle.timingSafeEqual(actualTokenBytes, expectedTokenBytes)) {
	//     return errorResponse("Unauthorized - Invalid token.", 401);
	// }

	// 简单字符串比较 (出于示例目的，timing-safe 比较更安全)
	if (token !== env.API_TOKEN) {
		// 返回错误响应，这将停止路由链的执行
		return errorResponse("Unauthorized - Invalid token.", 401);
	}

	// 5. 鉴权成功
	// 不返回任何内容 (隐式返回 undefined)，让 itty-router 继续执行下一个处理函数
}
