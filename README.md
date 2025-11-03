# bruss-floor

Shop Floor applications for BRUSS - standalone Next.js application.

## Installation

```bash
git clone <repo-url>
cd bruss-floor
bun install
```

## Configuration

Create `.env.local` file:

```env
MONGO_URI=<same as in main application>
NEXT_PUBLIC_LOCALE=pl-PL
LANG=pl
```

## Running

### Development

```bash
bun dev
```

### Production

```bash
bun run build
pm2 start pm2.config.js
```
