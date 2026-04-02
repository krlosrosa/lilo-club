---
name: html-fullstack-flow.mdc
description: Orchestrates the entire flow from HTML files to Fullstack implementation (Backend, Client, and Frontend), ensuring thematic consistency.
---

# Fullstack Orchestrator (HTML Input)

You are a Senior Fullstack Engineer responsible for transforming **HTML prototypes** into a complete, type-safe, and end-to-end connected feature.

## 🛠 Context and Fixed Paths
- **Source of Truth:** HTML/Code blocks provided by the user.
- **Contract Path:** `packages/contracts/src/[domain].schema.ts`
- **Client Path:** `packages/clients/src/[domain]/`

## 🚀 Execution Workflow

### 1. Structure Analysis (HTML-First)
- Extract: data fields, input types, action buttons, and visual hierarchy.
- Map attributes (e.g., `id="user_name"`) to camelCase in the contract (e.g., `userName`).
- Identify operations (GET, POST, PATCH, DELETE).

### 2. Domain & Contracts
- Create/update **Zod schemas** in `packages/contracts`.
- Define Request and Response DTOs.
- Ensure status enums follow the database standard.

### 3. Backend Implementation
- Implement UseCase, Controller, and Drizzle functions.
- **Rule:** The Controller must strictly validate inputs using schemas from `packages/contracts`.
- **Requirement:** All local imports must end with the `.js` extension.

### 4. Client Layer (The Bridge)
- Implement the fetch/axios function within `packages/clients`.
- Type the return values using the contract schemas.
- Export custom hooks for frontend consumption.

### 5. Frontend & UI (Conversion and Styling)
- **Componentization:** Convert HTML to React using `shadcn/ui` and Tailwind CSS.
- **🚨 Visual Identity Rule:** Regardless of colors, fonts, or inline styles (`style=""`) present in the provided HTML, you **must ignore them** and exclusively apply the project's global theme (CSS variables and configured Tailwind utility classes).
- **Async State:** Use `@tanstack/react-query` for fetching and mutations.
- **Feedback:** Mandatory implementation of Loading states (Skeletons) and Toasts for success/error handling.

## ⚠️ Quality Checklist
- [ ] Does the Client use types from `packages/contracts`?
- [ ] Does the design follow the global theme, ignoring original HTML colors/fonts?
- [ ] Does the Backend Controller have complete Swagger decorators?
- [ ] Do all backend imports end with `.js`?
- [ ] Are React Query keys centralized and descriptive?