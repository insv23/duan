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

1. Create a D1 database in Cloudflare.
   <img width="1269" alt="image" src="https://github.com/user-attachments/assets/e12d5a1f-44d8-4fd2-9129-cad34df37bda" />
	 <img width="743" alt="image" src="https://github.com/user-attachments/assets/d39427c1-ab96-426b-8555-90e4c2e9c78c" />

2. Execute SQL statements in Console
   ```sql
   DROP TABLE IF EXISTS links;
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
	<img width="1014" alt="image" src="https://github.com/user-attachments/assets/e07158f0-a50f-4ea4-ae5a-f279e1b75da6" />
 	<img width="990" alt="image" src="https://github.com/user-attachments/assets/3c453c0e-60a0-4c97-ba50-0ce707a6b844" />

3. Copy the D1 Database ID.
   <img width="980" alt="image" src="https://github.com/user-attachments/assets/84656de1-20ca-4c11-85c9-dc676a5b7b08" />

4. [Fork](https://github.com/insv23/duan/fork) the repository to your GitHub account.
   <img width="1225" alt="image" src="https://github.com/user-attachments/assets/78484a50-96ee-4733-994f-d49e9bb64149" />


5. Edit the `wrangler.jsonc` file and replace the `database_name` whit `duan-db` and the `database_id` with your D1 database ID.
   <img width="1277" alt="image" src="https://github.com/user-attachments/assets/5f9ffc73-99e6-4ebd-a86e-9087329b4114" />
	 <img width="728" alt="image" src="https://github.com/user-attachments/assets/cc51871a-4e5c-48bb-ad03-51eaa93446df" />

6. Create a project in Cloudflare Workers, select your forked repository.
   <img width="948" alt="image" src="https://github.com/user-attachments/assets/688b5ff8-f8a0-4b43-bbf3-b1148237c601" />
	 <img width="963" alt="image" src="https://github.com/user-attachments/assets/a5cf1342-d4b6-4433-a137-84e98bbb3c73" />
	 <img width="720" alt="image" src="https://github.com/user-attachments/assets/f71781d1-79eb-43f9-b5b0-634bacaba5ac" />

7. Set API_TOKEN in Cloudflare Workers.
   <img width="982" alt="image" src="https://github.com/user-attachments/assets/ed7f9665-883e-42ac-868c-e50e54c804db" />
	 <img width="1009" alt="image" src="https://github.com/user-attachments/assets/1865735f-2f2a-450b-bcf7-186dc0fc3e83" />

 	 Step 7: Online random token generator: https://it-tools.tech/token-generator
 
	 <img width="442" alt="image" src="https://github.com/user-attachments/assets/da882224-c1bd-4dd2-b468-f2951c1ddd6a" />

8. Cloudflare provides a free domain for your worker, e.g., `your-worker-name.workers.dev`.
	 <img width="1015" alt="image" src="https://github.com/user-attachments/assets/8a73ebb1-87eb-4e4d-9005-98e3616cd007" />

   You can test it with cURL or [HTTPie](https://httpie.io/).
   <img width="1082" alt="image" src="https://github.com/user-attachments/assets/332ca650-61df-477b-be9c-476d72643923" />


9. Bind your own domain.

	**This is required if you use the Duan Raycast extension, as *.workers.dev has TLS issues.**

 	For easy configuration, I recommend hosting your domain on Cloudflare. The images below illustrate how straightforward the setup process is.
	<img width="1023" alt="image" src="https://github.com/user-attachments/assets/c5949dbe-6745-49e4-9dc5-c96f1a6612df" />
 	<img width="421" alt="image" src="https://github.com/user-attachments/assets/5cfd90f2-42b8-4afd-83f0-621ea5c89b96" />
	<img width="418" alt="image" src="https://github.com/user-attachments/assets/ab0943d8-eefa-4e9f-a697-80f69cb4454a" />

11. How to use it?
    
    The Duan extension in [Raycast](https://www.raycast.com/) is currently the only UI available.

		A web interface isn't available yet. 🙃


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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare D1 Database](https://developers.cloudflare.com/d1/)
- [itty-router](https://github.com/kwhitley/itty-router)
