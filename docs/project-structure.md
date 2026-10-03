## Project Structure

- `src/routes` - Presentation layer; defines API endpoints and router composition.
- `src/controllers` - Presentation layer; handles HTTP requests and responses.
- `src/middlewares` - Presentation layer; handles request processing and cross-cutting checks.
- `src/services` - Application layer; contains business logic and use cases.
- `src/repositories` - Infrastructure layer; handles database access and persistence.
- `src/types` - Shared types; defines application data.
- `src/utils` - Shared utilities; contains reusable helper functions.
- `src/app.ts` - starts the Express server.

### Prisma Structure

- `prisma/migrations/` - Database history; stores versioned schema changes.
- `prisma/schema.ts` - Persistence layer; defines the database contract and models.
- `prisma/db.ts` - Infrastructure layer; creates the database client.
- `prisma/seed.ts` - Database setup; inserts development or initial data.

Recommended layout:

```
prisma/
├── migrations/
├── schema.ts
├── schema.json       # generated
├── schema.d.ts       # generated
├── db.ts
└── seed.ts
```

## After changing shcema models in prisma folder run

```bash
npm run contract:emit
npx tsc --noEmit
```

## Cloudinary Structure 

                Shared
                  │
        ┌─────────▼─────────┐
        │ Cloudinary Service │
        │   uploadImage()    │
        └─────────┬─────────┘
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
   User Dev   Product Dev  Banner Dev
       │          │          │
    profile     product     banner
     image       image       image

### with Docker (Optional No need to run, You can start with yarn dev to start the project)

Requirements: Docker Desktop must be running and `.env` must exist.

Development:

```bash
yarn docker:dev
```

Stop the development containers:

```bash
yarn docker:dev:down
```

