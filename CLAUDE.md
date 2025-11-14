# CLAUDE.md - AI Assistant Guide for BRUSS Floor

## Project Overview

**BRUSS Floor** is a standalone Next.js application for shop floor operations at BRUSS. It provides multiple specialized applications for different manufacturing processes including:

- **EOL136153** - End-of-line quality control
- **Inwentaryzacja** - Inventory management system
- **DMCheck** - Data matrix checking
- **Oven** - Oven process management

## Technology Stack

### Core Framework
- **Next.js 16.0.1** (App Router with React Server Components)
- **React 19.2.0**
- **TypeScript 5.9.3**
- Target: ES2017

### UI Libraries
- **Radix UI** - Headless UI components
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **shadcn/ui** - UI component system (New York style)
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### State Management
- **Zustand 5.0.8** - Lightweight state management with persistence
- **TanStack Query (React Query) 5.90.5** - Server state management

### Databases
- **MongoDB** - Primary database (via native driver)
- **PostgreSQL** - Secondary database (via pg driver)

### Form & Validation
- **React Hook Form 7.65.0** - Form handling
- **Zod 3.25.76** - Schema validation

### Development Tools
- **ESLint** - Code linting (Next.js config)
- **Prettier 3.6.2** - Code formatting
- **Bun** - Package manager and runtime

### Deployment
- **PM2** - Production process management
- Port: 1995 (production)
- Port: 3005 (development)

## Project Structure

```
bruss-floor/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Internationalized routes
│   │   ├── eol136153/           # EOL quality control app
│   │   ├── inwentaryzacja/      # Inventory management app
│   │   ├── dmcheck/             # Data matrix checking app
│   │   ├── oven/                # Oven management app
│   │   ├── components/          # Shared route components
│   │   └── layout.tsx           # Language-specific layout
│   ├── dict/                     # Translation dictionaries
│   │   ├── eol136153/
│   │   ├── inwentaryzacja/
│   │   ├── dmcheck/
│   │   └── oven/
│   ├── globals.css              # Global styles & Tailwind imports
│   └── layout.tsx               # Root layout
├── components/                   # Shared React components
│   ├── ui/                      # shadcn/ui components
│   ├── error-component.tsx
│   ├── footer.tsx
│   └── theme-mode-toggle.tsx
├── lib/                         # Shared utilities and configs
│   ├── config/
│   │   └── i18n.ts             # i18n configuration
│   ├── db/
│   │   ├── mongo.ts            # MongoDB client & connection
│   │   └── pg.ts               # PostgreSQL pool
│   ├── providers/
│   │   └── theme-provider.tsx  # Theme context provider
│   └── utils/
│       ├── cn.ts               # Class name utility
│       └── date-format.ts      # Date formatting utilities
├── public/                      # Static assets
├── .cursor/                     # Cursor IDE settings
├── .github/                     # GitHub workflows
├── components.json              # shadcn/ui configuration
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── pm2.config.js               # PM2 process configuration
├── postcss.config.mjs          # PostCSS configuration
├── proxy.ts                    # Proxy configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Basic project documentation
```

## Architecture Patterns

### Module Structure

Each application module (e.g., inwentaryzacja, eol136153, oven) follows a consistent structure:

```
app/[lang]/[module]/
├── components/              # Module-specific components
├── data/                   # Data fetching functions (optional)
├── lib/
│   ├── dict.ts            # Dictionary type definitions
│   ├── query-provider.tsx # React Query provider wrapper
│   ├── stores.ts          # Zustand state stores
│   ├── types.ts           # TypeScript type definitions
│   └── zod.ts             # Zod validation schemas
├── actions.ts             # Server Actions
├── error.tsx              # Error boundary
├── layout.tsx             # Module layout
└── page.tsx               # Main page component
```

### Key Conventions

#### 1. Server Actions Pattern

Server Actions are defined in `actions.ts` files with the `'use server'` directive:

```typescript
'use server';

import { dbc } from '@/lib/db/mongo';
import { someSchemaType } from './lib/zod';

/**
 * Always include JSDoc comments describing:
 * - Purpose of the action
 * - @param descriptions
 * - @returns description
 */
export async function actionName(data: someSchemaType) {
  try {
    const collection = await dbc('collection_name');
    // Business logic here
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { error: 'actionName server action error' };
  }
}
```

**Important conventions:**
- All server actions should return `{ success: data }` or `{ error: 'message' }` or `{ message: 'info' }`
- Always wrap in try-catch blocks
- Log errors with `console.error`
- Use descriptive error messages
- Include comprehensive JSDoc documentation

#### 2. State Management with Zustand

State stores are defined in `lib/stores.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StateType = {
  value: string;
  setValue: (value: string) => void;
};

// Use persist middleware for data that should survive page reloads
export const useMyStore = create<StateType>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    { name: 'storage-key' },
  ),
);

// Without persistence
export const useAnotherStore = create<StateType>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

#### 3. Database Access

**MongoDB:**
```typescript
import { dbc } from '@/lib/db/mongo';

// Get collection
const collection = await dbc('collection_name');

// Use standard MongoDB operations
const result = await collection.findOne({ ... });
```

**PostgreSQL:**
```typescript
import pgp from '@/lib/db/pg';

// Use pg pool directly
const result = await pgp.query('SELECT * FROM table WHERE id = $1', [id]);
```

**Important:**
- MongoDB connection uses singleton pattern with HMR support
- PostgreSQL uses connection pooling
- Always sanitize `_id` fields from MongoDB results before returning to client

#### 4. Internationalization (i18n)

The app supports 6 languages: Polish (pl), German (de), English (en), Tagalog (tl), Ukrainian (uk), Belarusian (be)

**Dictionary structure:**
```
app/dict/[module]/[locale].json
```

**Usage pattern:**
```typescript
// In dictionary file (lib/dict.ts)
export type Dict = typeof import('@/app/dict/[module]/pl.json');

// In server components
import { getDictionary } from '@/lib/dict';
const dictionary = await getDictionary(lang);

// In client components - pass as prop from server component
```

**Default locale:** Set via `LANG` environment variable (default: 'pl')

#### 5. Client vs Server Components

**Server Components (default):**
- Use for data fetching with Server Actions
- Can directly access databases
- No state or effects
- Async functions allowed

**Client Components (`'use client'`):**
- Use for interactivity, state, effects
- Must call Server Actions for data mutations
- Wrap with React Query for server state
- Example pattern in page.tsx files

#### 6. Styling

**CSS Variables:**
- Defined in `app/globals.css`
- Uses OKLCH color space
- Supports light/dark themes
- Custom selection color: `#92b34e`

**Tailwind Classes:**
- Use `cn()` utility from `@/lib/utils/cn` to merge classes
- shadcn/ui components use `class-variance-authority`
- Responsive design with mobile-first approach

**Component styling:**
```typescript
import { cn } from '@/lib/utils/cn';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Allow external className override
)} />
```

#### 7. Type Safety

**Always define types:**
- Zod schemas in `lib/zod.ts` for runtime validation
- TypeScript types in `lib/types.ts` for compile-time safety
- Infer types from Zod schemas: `type MyType = z.infer<typeof mySchema>`

**Example:**
```typescript
// lib/zod.ts
import { z } from 'zod';

export const loginSchema = z.object({
  personalNumber: z.string().min(1),
  pin: z.string().length(4),
});

export type LoginType = z.infer<typeof loginSchema>;
```

## Development Workflows

### Setup

```bash
# Clone repository
git clone <repo-url>
cd bruss-floor

# Install dependencies
bun install

# Create environment file
cp .env.example .env.local
# Edit .env.local with proper values
```

### Required Environment Variables

```env
MONGO_URI=mongodb://...          # MongoDB connection string
NEXT_PUBLIC_LOCALE=pl-PL        # Public locale (optional)
LANG=pl                          # Default language (optional)
```

### Development

```bash
# Start dev server on port 3005
bun dev

# Lint code
bun lint

# Format code (if prettier script exists)
bun prettier --write .
```

### Production Build

```bash
# Build for production
bun run build

# Start with PM2
pm2 start pm2.config.js

# View logs
pm2 logs bruss-floor

# Restart
pm2 restart bruss-floor
```

### Git Workflow

- Main branch: Branch name varies by deployment
- Feature branches: Use descriptive names
- Commit messages: Clear, concise descriptions of changes
- Always test locally before pushing

## Best Practices for AI Assistants

### When Adding New Features

1. **Follow existing patterns:**
   - Study similar modules before creating new ones
   - Maintain consistent file structure
   - Use same naming conventions

2. **Type safety first:**
   - Define Zod schemas for all form inputs
   - Create TypeScript types for all data structures
   - Use type inference where possible

3. **Error handling:**
   - Always wrap async operations in try-catch
   - Return consistent error objects
   - Log errors server-side
   - Show user-friendly messages client-side

4. **Performance considerations:**
   - Use Server Components by default
   - Only use Client Components when necessary
   - Implement proper loading states
   - Use React Query for caching

5. **Accessibility:**
   - Use semantic HTML
   - Radix UI components are accessible by default
   - Add proper ARIA labels where needed
   - Test keyboard navigation

### When Modifying Existing Code

1. **Understand the context:**
   - Read related files in the module
   - Check how similar features are implemented
   - Review type definitions and schemas

2. **Maintain consistency:**
   - Match existing code style
   - Keep same error message patterns
   - Follow established naming conventions

3. **Test thoroughly:**
   - Test both success and error cases
   - Verify database operations
   - Check UI responsiveness
   - Test with different locales if i18n is involved

### Common Pitfalls to Avoid

1. **Don't mix client/server boundaries incorrectly:**
   - Server Actions must be in separate files or marked with 'use server'
   - Client components can't directly access databases
   - State hooks only work in client components

2. **Don't forget error handling:**
   - Every Server Action needs try-catch
   - Every async operation needs error handling
   - Database operations can fail

3. **Don't hardcode values that should be configurable:**
   - Use environment variables
   - Store configuration in database when appropriate
   - Support all languages in i18n features

4. **Don't ignore TypeScript errors:**
   - Fix type errors properly
   - Don't use `any` unless absolutely necessary
   - Use proper type guards

5. **Don't skip validation:**
   - Validate all user inputs with Zod
   - Sanitize database inputs
   - Check authorization where needed

## Module-Specific Notes

### Inwentaryzacja (Inventory)

- Multi-step workflow: Login → Card Selection → Position Selection → Position Edit
- Supports up to 3 operators per inventory session
- Uses persistent Zustand stores for session data
- Position numbers: 1-25 per card
- Card numbers: Auto-assigned (finds lowest available)
- Quantity validation: Integers required for unit 'st' (pieces)

### EOL136153 (End of Line)

- Quality control for production lines
- Scans boxes and pallets
- Tracks article status
- Real-time status updates

### Oven

- Manages oven heating processes
- Multi-operator support
- Program selection per oven
- Temperature monitoring
- Fault reporting system
- HYDRA batch tracking

### DMCheck

- Data matrix code verification
- Barcode scanning
- Quality assurance

## Useful Commands

```bash
# Development
bun dev                    # Start dev server
bun build                  # Production build
bun start                  # Start production server
bun lint                   # Run ESLint

# PM2 (Production)
pm2 start pm2.config.js    # Start application
pm2 restart bruss-floor    # Restart application
pm2 stop bruss-floor       # Stop application
pm2 logs bruss-floor       # View logs
pm2 status                 # Check status

# Database operations (via MongoDB shell or Compass)
# Connect using MONGO_URI from environment

# Code quality
npx prettier --write .     # Format all files
```

## Files to Check Before Making Changes

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `lib/db/mongo.ts` - Database connection patterns
- `lib/config/i18n.ts` - Language configuration
- `components.json` - shadcn/ui configuration
- Similar module in `app/[lang]/` - Pattern reference

## Troubleshooting

### Build Issues
- Check Node.js/Bun version compatibility
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && bun install`

### Database Connection
- Verify MONGO_URI in environment
- Check network connectivity to MongoDB
- Check PostgreSQL connection in `lib/db/pg.ts`

### Type Errors
- Run `bun run build` to see all type errors
- Check `tsconfig.json` paths configuration
- Ensure all imports use `@/` alias correctly

### Runtime Errors
- Check browser console for client-side errors
- Check PM2 logs for server-side errors: `pm2 logs`
- Verify Server Actions return correct format

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zustand Documentation](https://zustand.docs.pmnd.rs)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com)

---

**Last Updated:** 2025-11-14

This document should be updated whenever significant architectural changes are made to the codebase.
