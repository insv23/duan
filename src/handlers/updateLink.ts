// src/handlers/updateLink.ts

import type { Env } from "../types/env"; // 导入环境类型
import { jsonResponse, errorResponse } from "../utils/response"; // 导入响应助手函数
import type { IRequest } from "itty-router"; // 导入 itty-router 的请求类型，包含 params

// 定义 PATCH /api/links/:shortcode 请求体的类型
interface UpdateLinkRequestBody {
	url?: string; // url 是可选的
	is_enabled?: number; // is_enabled 是可选的 (0 or 1)
	description?: string | null; // description 是可选的，可以是 string 或 null
}

// 处理更新短链接的 PATCH 请求
// IRequest<any, { shortcode: string }> 可以更具体地定义 params 的类型
export async function handleUpdateLink(
	request: IRequest, // 使用 IRequest 来访问 params
	env: Env, // 导入并使用 Env 类型
): Promise<Response> {
	// 1. 从 URL 获取 shortcode
	const shortcodeToUpdate = request.params.shortcode;

	// 基本验证 shortcode 参数是否存在且不为空
	if (!shortcodeToUpdate) {
		return errorResponse("Short code not provided in the URL path.", 400);
	}

	// 可以选择添加 shortcode 格式验证，但通常由 create 保证，
	// 如果允许用户通过 PATCH 修改 shortcode 本身，则需要更严格的验证。
	// 假设这里 shortcode 本身不能通过 PATCH 修改，只通过 URL 确定要更新哪个。

	// 2. 解析请求体
	let body: UpdateLinkRequestBody;
	try {
		body = (await request.json()) as UpdateLinkRequestBody;
	} catch (e) {
		console.error("JSON parsing error:", e);
		return errorResponse("Invalid JSON body", 400);
	}

	// 3. 验证请求体数据并构建动态更新语句
	const fieldsToUpdate: string[] = []; // 存储要更新的字段的 SQL 片段
	const bindValues: (string | number | null)[] = []; // 存储要绑定的值

	// 检查并处理 url 字段
	if (body.url !== undefined) {
		// 检查是否明确提供了 url 字段（即使是 null 或空字符串）
		// 验证 url 格式
		if (body.url === null || body.url.trim() === "") {
			// 如果提供了 url 但为空或 null，可以选择不允许或允许清空 (不常见)
			// 这里选择不允许空的 url 更新
			return errorResponse("URL cannot be empty or null.", 400);
		}
		try {
			new URL(body.url); // 验证格式
			fieldsToUpdate.push("original_url = ?");
			bindValues.push(body.url);
		} catch (e) {
			return errorResponse("Invalid URL format.", 400);
		}
	}

	// 检查并处理 is_enabled 字段
	if (body.is_enabled !== undefined) {
		// 检查是否明确提供了 is_enabled 字段
		if (
			typeof body.is_enabled !== "number" ||
			(body.is_enabled !== 0 && body.is_enabled !== 1)
		) {
			return errorResponse(
				"Invalid value for is_enabled. Must be 0 or 1.",
				400,
			);
		}
		fieldsToUpdate.push("is_enabled = ?");
		bindValues.push(body.is_enabled);
	}

	// 检查并处理 description 字段
	// description 可以是 string, null, 或 undefined (未提供)
	if (body.description !== undefined) {
		// 检查是否明确提供了 description 字段
		// null 是允许的值，string 也是允许的值
		// 如果提供了，就更新
		fieldsToUpdate.push("description = ?");
		bindValues.push(body.description); // null 会被正确绑定为 SQL NULL
	}

	// 4. 检查是否有任何字段需要更新
	if (fieldsToUpdate.length === 0) {
		return errorResponse(
			"No valid fields provided for update (url, is_enabled, description).",
			400,
		);
	}

	// 5. 构建完整的 SQL UPDATE 语句
	const setClause = fieldsToUpdate.join(", ");
	const sql = `UPDATE links SET ${setClause} WHERE short_code = ?`;

	// 将 shortcodeToUpdate 添加到绑定值的末尾，对应 WHERE 子句中的 ?
	bindValues.push(shortcodeToUpdate);

	try {
		// 6. 执行数据库更新操作
		const result = await env.DB.prepare(sql)
			.bind(...bindValues) // 使用 spread 语法绑定所有值
			.run();

		// 7. 检查更新结果
		if (result.meta.rows_written === 0) {
			// 如果 rows_written 是 0，表示没有找到匹配的 short_code
			return errorResponse(`Short code '${shortcodeToUpdate}' not found.`, 404);
		}

		// 8. 返回成功响应
		// result.meta 可以包含一些操作信息，例如 rows_written
		return jsonResponse(
			{
				message: `Link with short code '${shortcodeToUpdate}' updated successfully`,
				// 可以选择返回更新后的部分信息，这里仅确认成功
			},
			200, // 200 OK is typical for PATCH success
		);
	} catch (e: unknown) {
		// 9. 错误处理
		console.error(`Error updating link '${shortcodeToUpdate}':`, e);

		// 通用数据库错误处理
		return errorResponse("Internal server error during link update.", 500);
	}
}
