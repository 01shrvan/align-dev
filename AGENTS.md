# Agent Instructions for Align Project

This document contains instructions for coding agents operating in this repository.

## 1. Project Overview & Operational Commands

*   **Package Manager:** `npm`
*   **Development Server:** `npm run dev` (Runs on port 3000)
*   **Build:** `npm run build` (Runs `prisma generate` + Next.js build)
*   **Lint:** `npm run lint` (ESLint)
*   **Type Check:** `npx tsc --noEmit`
*   **Database:**
    *   Generate Client: `npx prisma generate` (Outputs to `src/generated/prisma`)
    *   Seed Data: `npm run seed:communities`
    *   Studio: `npx prisma studio`
*   **Testing:**
    *   **Status:** No automated testing framework is currently configured.
    *   **Policy:** Do NOT run `npm test`. If requested to add tests, propose installing **Vitest** and **React Testing Library**.
*   **Utility Scripts:**
    *   `npm run verify:user verify <userId>` - Verify a user
    *   `npm run verify:list` - List verified users
    *   `npm run add-aligners-tag` - Add tag to users
    *   `npm run debug:persona-cooldown` - Debug persona system

## 2. Tech Stack & Key Libraries

*   **Core Framework:** Next.js 15 (App Router, Server Actions)
*   **Language:** TypeScript (Strict mode)
*   **Styling:** Tailwind CSS v4, `tailwindcss-animate`, `tailwind-merge`
*   **UI Components:**
    *   Radix UI primitives (`@radix-ui/*`)
    *   Shadcn/ui pattern (`src/components/ui`)
    *   Icons: `lucide-react`
*   **State Management:**
    *   Global Client State: `zustand`
    *   Server State/Caching: `@tanstack/react-query`
*   **Database:** PostgreSQL (Neon)
    *   ORM: Prisma (`@prisma/client` generated to custom path)
    *   Auth Adapter: `@lucia-auth/adapter-prisma`
*   **Authentication:** Lucia Auth v3
*   **Forms:** React Hook Form (`react-hook-form`) + Zod (`zod`, `@hookform/resolvers`)
*   **Feature Libraries:**
    *   **Rich Text:** Tiptap (`@tiptap/react`)
    *   **File Uploads:** UploadThing (`@uploadthing/react`)
    *   **Real-time Chat:** Stream Chat (`stream-chat-react`)
    *   **AI:** Google Generative AI (`@google/generative-ai`)
    *   **Email:** Nodemailer / Resend
    *   **HTTP Client:** Ky (`ky`)
    *   **Date Handling:** `date-fns`

## 3. Code Style & Conventions

### Imports & File Structure
*   **Path Aliases:** ALWAYS use `@/` to refer to `src/` (e.g., `import { cn } from "@/lib/utils"`).
*   **Import Grouping:**
    1.  **External:** React, Next.js, 3rd party libraries.
    2.  **Internal:** Components, Hooks, Lib, Types (starting with `@/`).
    3.  **Relative:** `./styles.css`, `./types`.
*   **Exports:**
    *   **Pages/Layouts:** `export default function Page() {}`
    *   **Components:** Prefer named exports: `export function MyComponent() {}`

### Component Guidelines
*   **Server vs Client:**
    *   **Default:** Server Components (no `"use client"`).
    *   **Client:** Add `"use client"` ONLY if using hooks (`useState`, `useEffect`) or event listeners.
*   **Naming:** PascalCase for component files (e.g., `FollowButton.tsx`).
*   **Props:** Explicitly define `interface Props`. Avoid `any`.
*   **Async:** Server Components MUST be `async` if they fetch data.

### Styling (Tailwind)
*   **Utility Classes:** Use Tailwind utility classes for all styling.
*   **Merging:** ALWAYS use the `cn()` utility from `@/lib/utils` for conditional classes.
    *   Example: `className={cn("text-sm font-medium", isActive && "text-primary", className)}`
*   **Formatting:** Trust Prettier (`prettier-plugin-tailwindcss`) to sort classes.

### Database Interaction
*   **Prisma Client:** NEVER import `PrismaClient` directly to instantiate it.
*   **Singleton:** ALWAYS import the singleton instance: `import prisma from "@/lib/prisma";`
*   **Types:** Import types from the generated client if needed, or rely on inference.
    *   *Note:* The schema outputs to `../src/generated/prisma`.

### Authentication Pattern
*   **Server Side:** Use `validateRequest()` from `@/auth`.
    ```typescript
    import { validateRequest } from "@/auth";
    export default async function Page() {
      const { user } = await validateRequest();
      if (!user) { /* redirect or handle */ }
    }
    ```
*   **Redirects:** Use `redirect()` from `next/navigation`.

## 4. Error Handling & Data Fetching

*   **Server Actions:**
    *   Use `"use server"` at the top of action files.
    *   Return objects with `{ error: string }` or `{ success: boolean, data: ... }`.
    *   Wrap DB calls in `try/catch`.
*   **Client Data:** Use `useQuery` from `@tanstack/react-query`.
*   **UI Feedback:** Use `sonner` for toast notifications (`toast.error("Message")`).
*   **Validation:** Use Zod schemas for all inputs.

## 5. Project Structure

*   `src/app/`: App Router pages.
    *   `(auth)/`: Route group for authentication pages.
    *   `(main)/`: Route group for main application layout.
    *   `api/`: API routes (use sparingly, prefer Server Actions).
*   `src/components/`:
    *   `ui/`: Reusable Shadcn UI components.
    *   `[feature]/`: Feature-specific components.
*   `src/lib/`: `prisma.ts`, `utils.ts`, `validations.ts`.
*   `prisma/`: `schema.prisma`, `seed-communities.ts`.

## 6. Agent Operational Rules & Clean Code

1.  **Read First:** Always read the file or component you are about to modify to understand its context and imports.
2.  **No Unwanted Artifacts:**
    *   **Comments:** Remove all "TODO" comments once addressed. Do NOT leave commented-out code snippets. Remove default boilerplate comments if they provide no value.
    *   **Logs:** Remove `console.log` statements before finishing a task.
    *   **Files:** Delete any temporary files created during development.
3.  **Strict Adherence:** Follow existing patterns (e.g., how `prisma` is imported, how `cn` is used).
4.  **No Blind Installs:** Check `package.json` before installing new libraries. Use existing ones if possible.
5.  **Safety:**
    *   Do not commit secrets.
    *   Do not run destructive DB commands (`prisma migrate reset`) without explicit permission.
    *   Do not edit `package-lock.json` manually.
6.  **Formatting:** Ensure code is properly indented and formatted (Prettier compatible) before submitting.
