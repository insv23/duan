# 30_delete.hurl — Delete then verify missing
# Requires variables: base_url, api_token (use --variables-file hurl/.env)

# Create a link to delete (201)
POST {{base_url}}/api/links
Authorization: Bearer {{api_token}}
Content-Type: application/json

{
  "short_code": "hurl30-del-001",
  "url": "https://example.com/to-delete"
}

HTTP/2 201
[Asserts]
header "content-type" contains "application/json"


# Delete the link (200)
DELETE {{base_url}}/api/links/hurl30-del-001
Authorization: Bearer {{api_token}}

HTTP/2 200
[Asserts]
header "content-type" contains "application/json"


# Get single should now be 404
GET {{base_url}}/api/links/hurl30-del-001
Authorization: Bearer {{api_token}}

HTTP/2 404
[Asserts]
header "content-type" contains "application/json"
jsonpath "$.error" == "Link with shortcode 'hurl30-del-001' not found."

