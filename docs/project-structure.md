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

### Using Cloudinary Folders

`cloudinaryFolders.ts` keeps upload destinations in one place:

```ts
const CLOUDINARY_FOLDERS = {
  USER_PROFILE: "users/profile",
  LOST_ITEM: "lost-items/images",
};
```

Pass the folder key to the upload service to organize the images in cloudinary:

```ts
const images = await uploadImages(files, CLOUDINARY_FOLDERS.LOST_ITEM);

const images = await uploadImages(files, CLOUDINARY_FOLDERS.USER_PROFILE);

```

With `CLOUDINARY_ROOT_FOLDER=trackback-dev`, the images are stored under:

```text
trackback-dev/lost-items/images
```

Use `"USER_PROFILE"` for profile images. Add a new key to `CLOUDINARY_FOLDERS` when a new image category is needed.

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

