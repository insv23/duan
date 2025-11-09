// src/utils/shortcode.ts

const shortCodeRegex = /^[a-zA-Z0-9_-]+$/;

export function normalizeShortCode(
	input: string | undefined | null,
): string | null {
	if (input == null) {
		return null;
	}

	const trimmed = input.trim();
	if (!trimmed) {
		return null;
	}

	return trimmed.toLowerCase();
}

export function isValidShortCode(input: string | undefined | null): boolean {
	if (input == null) {
		return false;
	}

	const trimmed = input.trim();
	if (!trimmed) {
		return false;
	}

	if (trimmed.includes("/")) {
		return false;
	}

	return shortCodeRegex.test(trimmed);
}
