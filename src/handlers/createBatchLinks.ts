// src/handlers/createBatchLinks.ts

import type { Env } from "../types/env";
import { jsonResponse, errorResponse } from "../utils/response";

// 定义批量创建链接请求体的接口
interface CreateBatchLinksRequestItem {
	short_code?: string;
	url: string;
	description?: string | null;
}

interface CreateBatchLinksResponse {
	success: {
		short_code: string;
		short_url: string;
		original_url: string;
		description?: string | null;
	}[];
	errors: {
		original_url: string;
		short_code?: string;
		error: string;
	}[];
}

// 生成随机短码
function generateRandomShortcode(length = 4): string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	return Array.from({ length }, () =>
		chars.charAt(Math.floor(Math.random() * chars.length)),
	).join("");
}

// 验证URL格式
function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
}

// 验证短码格式
function isValidShortcode(shortcode: string): boolean {
	const shortCodeRegex = /^[a-zA-Z0-9_-]+$/;
	return !shortcode.includes("/") && shortCodeRegex.test(shortcode);
}

// 处理批量创建短链接的 POST 请求
export async function handleCreateBatchLinks(
	request: Request,
	env: Env,
): Promise<Response> {
	// 1. 解析请求体
	let items: CreateBatchLinksRequestItem[];
	try {
		const body = await request.json();
		if (!Array.isArray(body)) {
			return errorResponse("Request body must be an array", 400);
		}
		items = body as CreateBatchLinksRequestItem[];
	} catch (e) {
		return errorResponse("Invalid JSON body", 400);
	}

	// 如果数组为空，返回错误
	if (items.length === 0) {
		return errorResponse("Empty array provided", 400);
	}

	// 2. 处理每个链接项
	const response: CreateBatchLinksResponse = {
		success: [],
		errors: [],
	};

	const origin = new URL(request.url).origin;

	// 3. 逐个处理链接
	for (const item of items) {
		// 验证必填字段
		if (!item.url) {
			response.errors.push({
				original_url: item.url || "",
				short_code: item.short_code,
				error: "URL is required",
			});
			continue;
		}

		// 验证URL格式
		if (!isValidUrl(item.url)) {
			response.errors.push({
				original_url: item.url,
				short_code: item.short_code,
				error: "Invalid URL format",
			});
			continue;
		}

		// 处理短码
		let shortCode = item.short_code;

		// 如果没有提供短码，生成随机短码
		if (!shortCode) {
			shortCode = generateRandomShortcode();
		} else if (!isValidShortcode(shortCode)) {
			// 验证短码格式
			response.errors.push({
				original_url: item.url,
				short_code: shortCode,
				error:
					"Invalid short_code format. Only alphanumeric characters, hyphens, and underscores are allowed.",
			});
			continue;
		}

		// 4. 尝试插入数据库
		try {
			const descriptionToBind =
				item.description === undefined ? null : item.description;
			const isEnabled = 1;

			await env.DB.prepare(
				"INSERT INTO links (short_code, original_url, description, is_enabled) VALUES (?, ?, ?, ?)",
			)
				.bind(shortCode, item.url, descriptionToBind, isEnabled)
				.run();

			// 构建完整的短链接 URL
			const shortUrl = `${origin}/${shortCode}`;

			// 添加到成功列表
			response.success.push({
				short_code: shortCode,
				short_url: shortUrl,
				original_url: item.url,
				description: descriptionToBind,
			});
		} catch (e: unknown) {
			// 处理数据库错误
			let errorMessage = "Database error during link creation";

			// 处理唯一约束错误
			if (
				e instanceof Error &&
				typeof e.message === "string" &&
				e.message.includes("UNIQUE constraint failed")
			) {
				errorMessage = `Short_code '${shortCode}' already exists`;
			}

			response.errors.push({
				original_url: item.url,
				short_code: shortCode,
				error: errorMessage,
			});
		}
	}

	// 5. 返回结果
	return jsonResponse(
		{
			message: `Processed ${items.length} links: ${response.success.length} created, ${response.errors.length} failed`,
			...response,
		},
		response.success.length > 0 ? 201 : 400,
	);
}
