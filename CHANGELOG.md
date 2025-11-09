# Changelog

## 2025-11-09

- Standardize short_code handling to lowercase during creation, retrieval, batch creation, deletion, updates, and redirects so the entire flow is case-insensitive.
- Refactored shortcode trimming/normalization into `normalizeShortCode`/`isValidShortCode` utilities shared across handlers.

