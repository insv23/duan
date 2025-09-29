# 40_batch.hurl — Batch create mixed (201) and all-invalid (400)
# Requires variables: base_url, api_token (use --variables-file hurl/.env)

# Mixed batch: some successes and some errors (201)
POST {{base_url}}/api/links/batch
Authorization: Bearer {{api_token}}
Content-Type: application/json

[
  {
    "short_code": "hurl40-mix-a",
    "url": "https://example.com/batch-ok1",
    "description": "ok item 1"
  },
  {
    "url": "https://example.com/batch-ok2",
    "description": "ok item 2 without shortcode"
  },
  {
    "short_code": "hurl40-mix-a",
    "url": "https://example.com/batch-dup"
  },
  {
    "short_code": "bad/short",
    "url": "https://example.com/batch-bad-short"
  },
  {
    "url": "not-a-url"
  }
]

HTTP/2 201
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.success[*]" count == 2
jsonpath "$.errors[*]" count == 3


# All invalid batch: expect 400 and zero success
POST {{base_url}}/api/links/batch
Authorization: Bearer {{api_token}}
Content-Type: application/json

[
  {},
  { "url": "not-a-url" },
  { "short_code": "invalid/short", "url": "https://example.com/x" }
]

HTTP/2 400
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.success[*]" count == 0
jsonpath "$.errors[*]" count == 3
jsonpath "$.errors[?(@.error == 'URL is required')]" count == 1
jsonpath "$.errors[?(@.error == 'Invalid URL format')]" count == 1
jsonpath "$.errors[?(@.error == 'Invalid short_code format. Only alphanumeric characters, hyphens, and underscores are allowed.')]" count == 1

