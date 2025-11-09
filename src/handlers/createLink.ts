// src/handlers/createLink.ts

import type { Env } from "../types/env"; // 导入环境类型
import { jsonResponse, errorResponse } from "../utils/response"; // 导入响应助手函数

// 定义创建链接请求体的接口（放在这里或单独文件）
interface CreateLinkRequestBody {
	short_code: string;
	url: string;
	description?: string | null; // description 是可选的，可以是 string 或 null
}

// 处理创建短链接的 POST 请求
export async function handleCreateLink(
	request: Request, // itty-router 提供的请求对象
	env: Env, // 导入并使用 Env 类型
): Promise<Response> {
	// 1. 解析请求体
	let body: CreateLinkRequestBody;
	try {
		body = (await request.json()) as CreateLinkRequestBody;
	} catch (e) {
		return errorResponse("Invalid JSON body", 400);
	}

	const { short_code, url, description } = body;

	// 2. 验证请求体数据
	if (!short_code || !url) {
		return errorResponse(
			"Missing required fields: short_code and url are required.",
			400,
		);
	}

	const trimmedShortCode = short_code.trim();
	const normalizedShortCode = trimmedShortCode.toLowerCase();

	if (!trimmedShortCode) {
		return errorResponse("short_code cannot be empty.", 400);
	}

	// 简单验证 short_code 格式
	// 不允许包含 /
	if (trimmedShortCode.includes("/")) {
		return errorResponse("short_code cannot contain slashes", 400);
	}
	// 只允许字母数字_-等
	const shortCodeRegex = /^[a-zA-Z0-9_-]+$/;
	if (!shortCodeRegex.test(trimmedShortCode)) {
		return errorResponse(
			"Invalid short_code format. Only alphanumeric characters, hyphens, and underscores are allowed.",
			400,
		);
	}

	// 简单验证 url 格式 (使用 URL 构造函数，如果无效会抛错)
	try {
		new URL(url);
	} catch (e) {
		return errorResponse("Invalid URL format.", 400);
	}

	try {
		// 3. 准备插入数据
		// 确保 description 如果是 undefined 则存为 NULL
		const descriptionToBind = description === undefined ? null : description;

		// is_enabled 默认为 true (1)
		const isEnabled = 1;

		// 4. 执行数据库插入操作
		const result = await env.DB.prepare(
			"INSERT INTO links (short_code, original_url, description, is_enabled) VALUES (?, ?, ?, ?)",
		)
			.bind(normalizedShortCode, url, descriptionToBind, isEnabled)
			.run();

		// 构建完整的短链接 URL
		const shortUrl = `${new URL(request.url).origin}/${normalizedShortCode}`;

		// 5. 返回成功响应
		// result.meta 可以包含一些操作信息，例如 rows_written
		return jsonResponse(
			{
				message: "Link created successfully",
				short_code: normalizedShortCode,
				short_url: shortUrl,
				original_url: url,
			},
			201,
		); // 201 Created
	} catch (e: unknown) {
		// 6. 错误处理
		// 处理数据库错误 (特别是唯一约束冲突)
		// D1/SQLite 唯一约束错误通常包含 "UNIQUE constraint failed"
		if (
			e instanceof Error && // 检查是否是 Error 实例
			typeof e.message === "string" && // 检查 message 是否是字符串
			e.message.includes("UNIQUE constraint failed")
		) {
			// 409 Conflict 表示资源（短码）已存在
			return errorResponse(
				`Short_code '${normalizedShortCode}' already exists.`,
				409,
			);
		}

		// 处理其他未知错误
		return errorResponse("Internal server error during link creation.", 500);
	}
}
