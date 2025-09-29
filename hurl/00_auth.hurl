# 00_auth.hurl — Authentication tests
# Requires variables: base_url, api_token (loaded via --variables-file hurl/.env)

# 1) Missing Authorization header -> 401
GET {{base_url}}/api/links

HTTP/2 401
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.error" == "Unauthorized - Missing or malformed Authorization header."


# 2) Malformed Authorization header (not Bearer) -> 401
GET {{base_url}}/api/links
Authorization: Foo bar

HTTP/2 401
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.error" == "Unauthorized - Missing or malformed Authorization header."


# 3) Wrong Bearer token -> 401
GET {{base_url}}/api/links
Authorization: Bearer invalid-token

HTTP/2 401
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.error" == "Unauthorized - Invalid token."


# 4) Correct Bearer token -> 200
GET {{base_url}}/api/links
Authorization: Bearer {{api_token}}

HTTP/2 200
[Asserts]
header "content-type" contains "application/json"
