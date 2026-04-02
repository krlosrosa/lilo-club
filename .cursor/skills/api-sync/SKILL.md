---
name: api-sync
description: Synchronizes API endpoints with Zod schemas and TanStack Query hooks. Use when adding new API integrations or updating data models.
---
# API Sync
Ensures type safety between the backend/API and the frontend state.

## When to Use
- Use when the user says "I need to fetch data from /endpoint".
- Helpful for maintaining a single source of truth for data validation.

## Instructions
1. **Schema Definition:** Create or update a Zod schema in `src/lib/validations/`.
2. **Type Inference:** Export a TypeScript type inferred from the Zod schema: `export type Feature = z.infer<typeof schema>`.
3. **Hook Generation:** Create a custom hook in `src/hooks/queries/` using the global API instance at @src/lib/api.ts.
4. **Pattern:** Always include `isLoading`, `isError`, and `data` in the hook return for consistent UI handling.