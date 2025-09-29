# 20_update_redirect_toggle.hurl — Update fields and verify redirect toggling
# Requires variables: base_url, api_token (use --variables-file hurl/.env)

# Create a link for this test (201)
POST {{base_url}}/api/links
Authorization: Bearer {{api_token}}
Content-Type: application/json

{
  "short_code": "hurl20-upd-001",
  "url": "https://example.com/original20",
  "description": "Original desc"
}

HTTP/2 201
[Asserts]
header "content-type" contains "application/json"


# Update url/description/is_enabled=0 (200)
PATCH {{base_url}}/api/links/hurl20-upd-001
Authorization: Bearer {{api_token}}
Content-Type: application/json

{
  "url": "https://example.com/updated20",
  "description": "Updated desc",
  "is_enabled": 0
}

HTTP/2 200
[Asserts]
header "content-type" contains "application/json"


# Redirect should be disabled (404)
GET {{base_url}}/hurl20-upd-001

HTTP/2 404
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.error" == "Short_code not found or disabled."


# Re-enable redirect (200)
PATCH {{base_url}}/api/links/hurl20-upd-001
Authorization: Bearer {{api_token}}
Content-Type: application/json

{
  "is_enabled": 1
}

HTTP/2 200
[Asserts]
header "content-type" contains "application/json"


# Redirect should return 302 to the updated url
GET {{base_url}}/hurl20-upd-001

HTTP/2 302
[Asserts]
header "location" == "https://example.com/updated20"

