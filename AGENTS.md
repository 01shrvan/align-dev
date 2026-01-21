# Agent Instructions for Align Project

This document contains instructions for coding agents operating in this repository.

## 1. Build, Lint, and Test Commands

*   **Package Manager:** `npm`
*   **Development Server:** `npm run dev` (Runs on port 3000)
*   **Build:** `npm run build` (Next.js build + Prisma generate)
*   **Lint:** `npm run lint` (ESLint)
*   **Database:**
    *   Generate Client: `npx prisma generate`
    *   Seed Data: `npm run seed:communities`
    *   Verify User: `npm run verify:user verify <userId>`
*   **Testing:** Currently, there is no automated testing framework set up.
    *   *Agent Note:* Do not attempt to run `npm test`. If asked to write tests, check with the user first or propose installing Jest/Vitest.

## 2. Tech Stack & Key Libraries

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript (Strict mode)
*   **Styling:** Tailwind CSS v4, `tailwindcss-animate`
*   **UI Components:** Radix UI primitives, Shadcn/ui pattern
*   **State Management:** Zustand, TanStack Query (`@tanstack/react-query`)
*   **Database:** PostgreSQL (via Prisma ORM)
*   **Auth:** Lucia Auth
*   **Forms:** React Hook Form + Zod

## 3. Code Style & Conventions

### Imports & File Structure
*   **Path Aliases:** Use `@/` to refer to `src/`.
    *   Example: `import { cn } from "@/lib/utils";`
*   **Grouping:** Group imports by:
    1.  External libraries (e.g., `react`, `next/*`)
    2.  Internal modules (e.g., `@/components/*`, `@/lib/*`)
*   **Exports:**
    *   Pages (`page.tsx`, `layout.tsx`): Use `export default`.
    *   Components/Utils: Prefer named exports (e.g., `export function Button`).

### Component Guidelines
*   **Server vs Client:**
    *   Default to Server Components (no `"use client"`).
    *   Add `"use client"` at the top only when needing interactivity (state, effects, event listeners).
*   **Naming:** PascalCase for component files (e.g., `FollowButton.tsx`).
*   **Props:** Define types/interfaces for props.
*   **Async:** Use `async/await` for data fetching in Server Components.

### Styling
*   **Tailwind:** Use utility classes for styling.
*   **Class Merging:** ALWAYS use the `cn()` utility from `@/lib/utils` when allowing className overrides or using conditional classes.
    *   Correct: `className={cn("bg-red-500", className)}`
    *   Incorrect: `className={`bg-red-500 ${className}`}`

### Data Fetching & Database
*   **Prisma:** Use the singleton instance from `@/lib/prisma`.
    *   `import prisma from "@/lib/prisma";`
*   **React Query:** Use for client-side data fetching/caching.
*   **Server Actions:** Prefer Server Actions for mutations where possible.

### Error Handling
*   Use `try/catch` blocks for async operations, especially database calls.
*   Use `sonner` for toast notifications on the client side.
*   Validate inputs using Zod schemas (`@/lib/validations` or defined in-file).

## 4. Specific Patterns

*   **Authentication:** Use `validateRequest()` from `@/auth` in Server Components/Actions to get the current user.
    *   `const { user } = await validateRequest();`
*   **Date Handling:** Use `date-fns` for date manipulation and formatting.
*   **Icons:** Use `lucide-react`.

## 5. File Organization

*   `src/app/`: Next.js App Router pages and layouts.
*   `src/components/`: Reusable UI components.
    *   `src/components/ui/`: Primitive UI components (buttons, inputs).
*   `src/lib/`: Utility functions, Prisma client, configuration.
*   `src/hooks/`: Custom React hooks.
*   `prisma/`: Database schema and seeds.
