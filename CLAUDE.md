# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shop Floor Management Application for BRUSS manufacturing. Next.js 16 + React 19 with MongoDB primary database, PostgreSQL legacy support. Multi-language (pl, de, en, tl, uk, be) shop floor modules.

## Commands

```bash
# Development
bun install           # Install deps
bun dev              # Dev server on port 3005

# Production
bun run build        # Build Next.js

## Architecture

### Module Pattern
Each module under `app/[lang]/{module}/` is self-contained:
```

{module}/
├── page.tsx # Entry (receives dict + lang props)
├── layout.tsx # Module layout (often with QueryProvider)
├── actions.ts # Server actions ('use server')
├── components/ # React components
├── data/ # MongoDB/PostgreSQL queries
└── lib/
├── types.ts # TypeScript types
├── zod.ts # Validation schemas
├── stores.ts # Zustand state
├── dict.ts # Translation loader
└── query-provider.tsx # React Query setup

```

### Current Modules
- **inwentaryzacja**: Inventory management (login → card selection → position edit)
- **oven**: Oven process & fault management (most complex)
- **eol136153**: Generate bulk labels based on ERP system labels
- **dmcheck**: Code-based parts tracking system

### Data Flow
Client → React Hook Form → Server Actions (Zod validation) → MongoDB → React Query Cache → UI

### State Management
- **Zustand + persist**: Client state (operators, cards, positions)
- **React Query**: Server state caching (5min staleTime default)

### Database
- **MongoDB**: Primary DB, use `dbc(collectionName)` wrapper from `lib/db/mongo.ts`. Database name for developmnet: `next_bruss_dev`.

### i18n
- **Languages**: pl (default), de, en, tl, uk, be
- **Route pattern**: `/{lang}/{module}/`
- **Translations**: `/app/dict/{module}/{locale}.json` (lazy-loaded)
- **Middleware**: `proxy.ts` negotiates Accept-Language headers
- **Usage**: Each module's `getDictionary(lang)` function

### UI & Styling
- **Tailwind CSS 4.1**: CSS variables (baseColor: neutral)
- **shadcn/ui**: pre-built components in `components/ui/`
- **Radix UI**: Low-level primitives
- **Lucide React**: Icons
- **Utility**: `cn()` from `lib/utils/cn.ts` (clsx + tailwind-merge)

## Adding Features

1. **Define schema**: Add Zod schema to `lib/zod.ts`
2. **Add types**: TypeScript interfaces in `lib/types.ts`
3. **Server action**: Implement in `actions.ts` with Zod validation
4. **React component**: Build in `components/`
5. **State** (if needed): Add Zustand store in `lib/stores.ts`
6. **Translations**: Update JSON files in `/app/dict/{module}/{locale}.json`

## Form Handling
- **React Hook Form** with `zodResolver`
- **Zod refinements**: Custom validation (e.g., prevent duplicates)
- **Server re-validation**: Always re-validate with Zod before DB ops

## Key Dependencies
- **Framework**: next@16.0.1, react@19.2.0
- **UI**: @radix-ui/*, shadcn/ui (via components.json)
- **Forms**: react-hook-form@7.65.0, zod@3.25.76
- **State**: zustand@5.0.8, @tanstack/react-query@5.90.5
- **DB**: mongodb@6.3.0
- **Styling**: tailwindcss@4.1.16
- **Utilities**: date-fns@4.1.0, uuid@9.0.1

## Important Paths
- MongoDB wrapper: `lib/db/mongo.ts`
- i18n config: `lib/config/i18n.ts`
- shadcn/ui components: `components/ui/`
- Global styles: `app/globals.css`
- Middleware: `proxy.ts`

```
