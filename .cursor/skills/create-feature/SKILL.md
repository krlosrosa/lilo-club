---
name: create-feature
description: Generates a complete feature structure including components, hooks, and types. Use when the user wants to start a new UI section or business module.
---
# Create Feature
Standardize the creation of new features to ensure architectural consistency.

## When to Use
- Use this skill when starting a new module (e.g., "Create a Checkout feature").
- Helpful for scaffolding boilerplate without repeating manual steps.

## Instructions
1. **Analyze Requirements:** Use the `ask questions` tool to clarify if the feature needs a dedicated API hook or just UI.
2. **Root:** `apps/web/src/features/<feature-name>/` with this layout:
   - **`screens/`** — route-level compositions (`*Screen.tsx`), data fetching and wiring TanStack Query here when not extracted to hooks.
   - **`components/`** — presentational pieces and forms; keep files under ~150 lines (split subfolders by area).
   - **`hooks/`** — `index.ts` re-exporting the feature API client and/or `use*` hooks shared by multiple screens.
   - **`utils/`** — pure helpers, formatters, payload builders (no React).
   - **`api.ts`** (optional) — `createBrowserApiClient()` instance for this domain.
   - **`types.ts`**, **`constants.ts`** as needed.
   - **`index.ts`** — public exports for the app router (screens + anything consumers need).
3. **Routes:** Keep `src/app/**/page.tsx` thin—import the feature’s `*Screen` from `@/features/<name>/screens/...` or a **narrow** barrel. Do not put Server-only screens (`next/headers`, etc.) in the same `index.ts` as Client screens: client pages that import the barrel will pull server code into the client bundle (Turbopack error).
4. **Shadcn:** Check `@src/components/ui` before custom markup.
5. **Cross-feature logic:** Use `src/hooks/` only when shared across multiple features.
