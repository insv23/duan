# 10_create_get_list.hurl — Create one, get one, list contains, duplicate conflict
# Requires variables: base_url, api_token (use --variables-file hurl/.env)

# Create a link (201)
POST {{base_url}}/api/links
Authorization: Bearer {{api_token}}
Content-Type: application/json

{
  "short_code": "hurl10-cases-001",
  "url": "https://example.com/hurl10",
  "description": "Example link for hurl tests"
}

HTTP/2 201
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.short_code" == "hurl10-cases-001"
jsonpath "$.original_url" == "https://example.com/hurl10"
jsonpath "$.short_url" == "{{base_url}}/hurl10-cases-001"


# Get single link (200)
GET {{base_url}}/api/links/hurl10-cases-001
Authorization: Bearer {{api_token}}

HTTP/2 200
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.short_code" == "hurl10-cases-001"
jsonpath "$.original_url" == "https://example.com/hurl10"
jsonpath "$.is_enabled" == 1
jsonpath "$.description" == "Example link for hurl tests"


# List contains the created link (200)
GET {{base_url}}/api/links
Authorization: Bearer {{api_token}}

HTTP/2 200
[Asserts]
header "content-type" contains "application/json"
jsonpath "$[?(@.short_code == 'hurl10-cases-001')]" count == 1


# Duplicate creation should conflict (409)
POST {{base_url}}/api/links
Authorization: Bearer {{api_token}}
Content-Type: application/json

{
  "short_code": "hurl10-cases-001",
  "url": "https://example.com/hurl10"
}

HTTP/2 409
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.error" == "Short_code 'hurl10-cases-001' already exists."

