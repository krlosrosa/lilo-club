---
name: ui-audit
description: Audits the current file or folder for Accessibility (A11y), Tailwind best practices, and shadcn/ui consistency.
disable-model-invocation: true
---
# UI Audit
A specialized reviewer for Frontend quality.

## When to Use
- Use this skill by typing `/ui-audit` before a Pull Request.
- Helpful for catching missing `aria-labels` or arbitrary Tailwind values.

## Instructions
1. **Tailwind Check:** Identify any arbitrary values (e.g., `text-[#343434]`) and suggest the nearest theme token from @tailwind.config.js.
2. **A11y Check:**
   - Verify `alt` tags on all `img` or `Image` tags.
   - Check if buttons have labels or `aria-label`.
   - Ensure interactive elements are keyboard accessible.
3. **Shadcn Consistency:** Point out if a custom element was created when a shadcn/ui component already exists in `@src/components/ui`.
4. **Report:** Provide a bulleted list of "Issues Found" and "Suggested Fixes".