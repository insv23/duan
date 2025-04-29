// src/handlers/listLinks.ts

import type { Env } from "../types/env"; // 导入环境类型
import { jsonResponse, errorResponse } from "../utils/response"; // 导入响应助手函数

// 定义链接数据的类型接口，与数据库 schema.sql 对应
// 注意 D1 数据库在 SELECT 时，BOOLEAN/INTEGER 类型会返回 0 或 1
interface Link {
	short_code: string;
	original_url: string;
	description: string | null; // 数据库中可能是 NULL
	is_enabled: number; // 0 或 1
	created_at: string; // 存储为 TEXT 的时间戳
	last_visited_at: string | null; // 数据库中可能是 NULL
	visit_count: number;
}

// 处理获取所有短链接的 GET 请求
export async function handleListLinks(
	request: Request, // itty-router 提供的请求对象
	env: Env, // 导入并使用 Env 类型
): Promise<Response> {
	try {
		// 1. 查询数据库获取所有链接
		// 使用 .all() 方法来获取所有匹配的行
		// <Link> 是类型断言，告诉 TypeScript 每一行的结构
		const { results } = await env.DB.prepare("SELECT * FROM links").all<Link>();

		// results 将是一个 Link 对象的数组 (可能为空)
		// 2. 返回成功响应，包含链接列表
		return jsonResponse(results, 200); // 200 OK
	} catch (e: unknown) {
		// 3. 错误处理
		console.error("D1 error during link listing:", e);
		return errorResponse("Internal server error during link listing.", 500); // 500 Internal Server Error
	}
}
