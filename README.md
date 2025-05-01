# duan - URL shortener powered by Cloudflare Workers and D1 Database

<p align="center">
  <img src="https://img.shields.io/badge/cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/D1%20Database-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare D1">
  <img src="https://img.shields.io/badge/Free%20Tier-100%25-brightgreen?style=for-the-badge" alt="Free Tier Compatible">
</p>

## 📖 Overview

**duan** is a lightweight, high-performance URL shortener built on Cloudflare's edge infrastructure. It leverages Cloudflare Workers for serverless compute and D1 Database for reliable storage, offering global low-latency performance.

### 💰 Cost-Effective Solution

**Completely free to run** within Cloudflare's generous free tier limits:
- Runs entirely on Cloudflare Workers and D1 Database free tier
- No server costs or database hosting fees
- 100,000 Worker requests per day for free
- 5 million D1 database reads and 100,000 writes per day for free
- Global CDN distribution at no additional cost

### ✨ Features

- **Fast Redirects**: Serve redirects from the edge with minimal latency
- **API-First Design**: Complete RESTful API for managing short links
- **Secure Authentication**: API token-based authentication for administrative endpoints
- **Batch Operations**: Create multiple short links in a single request
- **Custom Short Codes**: Define your own memorable short codes or let the system generate random ones
- **Analytics**: Track visit counts and last access time for each link
- **Lightweight**: Minimal dependencies, optimized for edge deployment

## 🚀 Getting Started

### Prerequisites

- Cloudflare account with Workers and D1 access
- A domain name for your short links.
    - Optional for pure API usage, Cloudflare provides a *.workers.dev subdomain
    - Necessary for Duan Raycast extension

### Installation

1. Create a D1 database in Cloudflare and copy the database ID.

2. Fork the repository to your GitHub account.

3. Edit the `wrangler.jsonc` file and replace the `database_id` with your D1 database ID.

3. Create a project in Cloudflare Workers.

4. Select the "Import from GitHub" option and select your forked repository.

5. Set API_TOKEN in Cloudflare Workers.

6. Cloudflare provides a free domain for your worker, e.g., `your-worker-name.workers.dev`.
You can test it with cURL or HTTPie.

6. 绑定你自己的域名


### Development

1. Clone the repository:
   ```bash
   git clone https://github.com/insv23/duan.git
   cd duan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a D1 database:
   ```bash
   npx wrangler d1 create prod-cf-d1-short-link
   ```

4. Update the `wrangler.jsonc` file with your database ID.

5. Initialize the database schema:
   ```bash
   # 在远程应用 schema (用于 wrangler deploy)
   npx wrangler d1 execute prod-cf-d1-short-link --remote --file=./schema.sql
   ```

6. Set up your API token:
   ```bash
   npx wrangler secret put API_TOKEN
   ```

7. Start the deployment server:
    ```bash
    npx wrangler deploy
    ```

## 🔌 API Reference

### Public Endpoints

- **GET /:shortcode**
  - Redirects to the original URL associated with the shortcode

### Protected Endpoints (require API token)

- **POST /api/links**
  - Create a new short link
  - Body: `{ "short_code": "custom", "url": "https://example.com", "description": "Optional description" }`

- **POST /api/links/batch**
  - Create multiple short links in a single request
  - Body: Array of link objects `[{ "url": "https://example.com", "short_code": "optional", "description": "optional" }, ...]`

- **GET /api/links**
  - List all links

- **GET /api/links/:shortcode**
  - Get details for a specific link

- **GET /api/shortcodes**
  - Get a list of all shortcodes

- **PATCH /api/links/:shortcode**
  - Update an existing link
  - Body: `{ "url": "https://new-url.com", "is_enabled": 1, "description": "Updated description" }`

- **DELETE /api/links/:shortcode**
  - Delete a specific link

### Authentication

All API endpoints require an API token passed in the Authorization header:

```
Authorization: Bearer your-api-token
```

## 📁 Project Structure

```text
src/
├── handlers/           // Request handler directory for specific endpoint logic
│   ├── createBatchLinks.ts  // Logic for batch link creation
│   ├── createLink.ts       // Logic for creating a single link
│   ├── deleteLink.ts       // Logic for deleting a specific link
│   ├── getLink.ts          // Logic for retrieving a specific link
│   ├── listLinks.ts        // Logic for listing all links
│   ├── listShortcodes.ts   // Logic for listing all shortcodes
│   ├── redirect.ts         // Logic for shortcode redirection
│   └── updateLink.ts       // Logic for updating a link
├── middleware/         // Middleware directory for request processing functions
│   └── auth.ts             // Authentication middleware
├── types/              // Type definitions directory for TypeScript types
│   └── env.ts              // Environment variable type definitions
├── utils/              // Utility functions directory for reusable helper functions
│   └── response.ts         // Common response formatting functions
└── index.ts            // Project entry point responsible for routing
```


### Example: Creating a batch of links

```bash
http POST https://your-worker-url.workers.dev/api/links/batch \
  Authorization:"Bearer your-api-token" \
  @batch-links.json
```

Example `batch-links.json`:
```json
[
  {
    "url": "https://example.com/page1",
    "description": "Example page 1"
  },
  {
    "short_code": "custom1",
    "url": "https://example.com/page2",
    "description": "Example page with custom shortcode"
  }
]
```

## 📊 Database Schema

```sql
CREATE TABLE links (
    short_code TEXT PRIMARY KEY,
    original_url TEXT NOT NULL,
    description TEXT,
    is_enabled INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_visited_at TEXT,
    visit_count INTEGER DEFAULT 0
);
```

## 💸 Free Tier Usage

This project is designed to operate completely within Cloudflare's free tier limits:

### Cloudflare Workers Free Tier
- 100,000 requests per day
- Up to 10ms CPU time per invocation
- 128MB memory limit
- Available in all Cloudflare edge locations worldwide

### Cloudflare D1 Database Free Tier
- 5 million reads per day
- 100,000 writes per day
- 1GB storage
- 100 databases per account

For most personal or small business URL shorteners, these limits are more than sufficient. If you need to scale beyond these limits, Cloudflare offers affordable paid plans.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare D1 Database](https://developers.cloudflare.com/d1/)
- [itty-router](https://github.com/kwhitley/itty-router)
