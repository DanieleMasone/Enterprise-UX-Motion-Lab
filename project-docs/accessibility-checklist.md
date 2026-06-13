# Accessibility Checklist

Use this checklist when changing interaction behavior, layout density, motion, or UI primitives in Enterprise UX Motion Lab.

## Keyboard Navigation

- `Ctrl+K` and `Cmd+K` open the command palette from the dashboard.
- Escape closes dialogs and transient overlays.
- Tab order reaches theme, density, data-state controls, filters, severity toggles, table detail actions, and command actions.
- Command palette focus stays inside the dialog and returns to the launcher or prior focused control when closed.
- Mouse and keyboard execution paths remain equivalent for command actions.

## Semantics And Focus

- Native `button`, `input`, and `select` elements are preferred over custom controls.
- Related control clusters expose group semantics when a visible label is not enough.
- Segmented controls expose selected state with `aria-pressed`.
- Expandable table details expose `aria-expanded` and `aria-controls`.
- Quantitative indicators such as confidence use semantic roles such as `meter`.
- Focus-visible styling remains visible in light and dark themes.

## State Communication

- Loading states use skeletons with status semantics instead of decorative spinners.
- Empty states provide recovery actions when filters caused the empty result.
- Degraded telemetry uses a status region without blocking the operational workflow.
- Dark mode and density changes preserve the same information architecture.

## Motion

- Components use `src/motion/motion.tokens.ts` and `src/motion/transitions.ts` for motion values.
- Reduced-motion preference collapses movement while preserving state changes.
- Motion explains disclosure, feedback, loading, or orientation changes.
- Decorative looping or long-running animations are not used.

## Responsive Enterprise Layout

- Dense tables keep horizontal scrolling inside the table shell instead of collapsing into unreadable cards.
- Expanded narrative detail panels wrap inside the visible table shell even when dense table columns scroll horizontally.
- Filters, KPI cards, detail panels, and dialogs do not create page-level horizontal overflow at mobile widths.
- Touch targets remain readable at 360px wide.
- Command palette stays within the viewport on desktop and mobile.

## Verification

- Run `npm run test` after behavior changes.
- Run `npm run test:e2e` after command palette, responsive layout, theme, density, or filter changes.
- Run `npm run test:coverage` before publishing changes that affect shared behavior.
