# Yummy Kingdom Update

## Local setup
1. Install dependencies:
```bash
npm install
```

2. Create env file from template:
```bash
copy .env.local.example .env.local
```

3. Set required values in `.env.local`:
- `DATABASE_URL` (required)
- `AUTH_SECRET` (recommended, but dev fallback is now included)

4. Run database migrations and seed:
```bash
npx prisma migrate dev
npx ts-node db/seed.ts
```

5. Start app:
```bash
npm run dev
```

## Fix for your current errors
- `MissingSecret`: fixed for development via fallback in `auth.ts`.
- `Invalid URL` (Prisma): means `DATABASE_URL` is missing or malformed. Add a valid PostgreSQL/Neon URL to `.env.local`.
