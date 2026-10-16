# TrackBack – Backend

**TrackBack** is a lightweight campus lost-and-found platform where community members can report found items, search for lost ones, and coordinate handovers — without adding overhead for staff or changing any physical infrastructure.

This repository is the backend of TrackBack, built with **Express 5** and **TypeScript**. It provides RESTful APIs for authentication, lost & found item management, claims, notifications, media uploads, and smart item matching.

---

## Features

- User registration, login, and JWT-based authentication via HTTP-only cookies
- Profile management (update name, bio, profile photo)
- Report and manage lost item posts (create, update, delete, view)
- Report and manage found item posts (create, update, delete, view)
- Search and browse across all lost & found items with keyword, category, location, type, and date filters
- Submit and track claims on found items
- In-app notifications for claim updates and item matches
- Smart item matching between lost and found posts
- Secure image upload via Cloudinary
- Password reset flow via email (Nodemailer)
- My Posts view — all posts by the authenticated user

---

## Tech Stack

- **Express 5** – Web framework
- **TypeScript 7** – Type-safe JavaScript
- **Prisma 8** (postgres) – ORM and database contract layer
- **PostgreSQL** – Relational database
- **Docker + Docker Compose** – Containerization

---

## Software Architecture

This project follows a **Layered Architecture** pattern, separating concerns across four distinct layers:

- **Routes** — Define API endpoints and map them to controllers
- **Controllers** — Handle HTTP request/response, validate inputs, and delegate to services
- **Services** — Contain core business logic; orchestrate calls to repositories
- **Repositories** — Handle all direct database access via Prisma ORM

This separation keeps the codebase modular, testable, and easy to extend — changes to the database layer don't affect business logic, and vice versa.

```
Request → Router → Controller → Service → Repository → Database
```

---

## API Endpoints


### Auth — `/auth`
| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive auth cookie |
| `POST` | `/auth/logout` | Logout and clear auth cookie |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password` | Reset password with token |

### Lost Items — `/lost-items`
| Method | Path | Description |
|---|---|---|
| `GET` | `/lost-items` | List lost items |
| `POST` | `/lost-items` | Report a new lost item |
| `GET` | `/lost-items/:id` | Get lost item details |
| `PUT` | `/lost-items/:id` | Update a lost item |
| `DELETE` | `/lost-items/:id` | Delete a lost item |

### Found Items — `/found-items`
| Method | Path | Description |
|---|---|---|
| `GET` | `/found-items` | List found items |
| `POST` | `/found-items` | Report a new found item |
| `GET` | `/found-items/:id` | Get found item details |
| `PUT` | `/found-items/:id` | Update a found item |
| `DELETE` | `/found-items/:id` | Delete a found item |

### Search & Browse — `/items`
| Method | Path | Description |
|---|---|---|
| `GET` | `/items/search` | Search across all lost & found items |

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `keyword` | `string` | Filter by title, description, category, or location |
| `category` | `string` | Filter by category |
| `location` | `string` | Filter by location |
| `type` | `lost` \| `found` \| `all` | Filter by item type |
| `dateFrom` | `string` | Filter items from this date |
| `dateTo` | `string` | Filter items up to this date |
| `page` | `number` | Page number (default: `1`) |
| `limit` | `number` | Items per page (default: `10`, max: `100`) |

### Claims
| Method | Path | Description |
|---|---|---|
| `GET` | `/claims` | List claims for the current user |
| `POST` | `/claims` | Submit a claim on a found item |
| `GET` | `/claims/:id` | Get claim details |

### My Posts — `/my-posts`
| Method | Path | Description |
|---|---|---|
| `GET` | `/my-posts` | Get all posts by the current user |

### Users — `/users`
| Method | Path | Description |
|---|---|---|
| `GET` | `/users/me` | Get current user profile |
| `PUT` | `/users/me` | Update current user profile |

### Notifications
| Method | Path | Description |
|---|---|---|
| `GET` | `/notifications` | List notifications for the current user |
| `PATCH` | `/notifications/:id/read` | Mark a notification as read |

### Media — `/media`
| Method | Path | Description |
|---|---|---|
| `POST` | `/media/upload` | Upload an image (returns Cloudinary URL) |

### Matching
| Method | Path | Description |
|---|---|---|
| `GET` | `/matching/:id` | Get potential matches for a lost/found item |

---

## Getting Started

### Local Development

```bash
# Install dependencies
yarn install

# Emit Prisma contract artifacts
yarn contract:emit

# Start dev server with hot reload
yarn dev
```

Server starts at `http://localhost:8080`.

### Docker Development

```bash
# Start with Docker Compose 
yarn docker:dev

# Follow app logs
yarn docker:dev:logs

# Stop and remove containers + volumes
yarn docker:dev:down
```

---

## Contributors

- **Kyi Thant Sin**
- **Saw Zi Dunn**
- **May Nyein Chan**
