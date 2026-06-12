# AGENTS.md

Guidance for future Codex work in Enterprise UX Motion Lab.

## Project Purpose

This repository demonstrates senior frontend architecture and functional UX motion for data-heavy enterprise interfaces. The product surface is an internal risk operations dashboard, not a landing page and not an animation showcase.

## Architectural Rules

- Preserve the feature-based structure under `src/features/`.
- Keep shared primitives in `src/ui/` only when they are genuinely reusable.
- Keep domain data and models in `src/data/`.
- Keep app-wide state orchestration in `src/app/`.
- Do not add backend code.
- Do not add routing unless a clear product workflow requires it.
- Do not introduce state management libraries unless local React state is no longer adequate.

## UX And Motion Rules

- Motion must be functional, not decorative.
- Avoid slow or excessive animations.
- Preserve enterprise information density.
- Use centralized motion tokens from `src/motion/motion.tokens.ts`.
- Use semantic transition helpers from `src/motion/transitions.ts`.
- Keep accessibility and reduced-motion support intact.
- Do not hardcode ad hoc duration or easing values inside components.
- Motion should explain state change, clarify feedback, improve affordance, support perceived performance, or preserve orientation.

## Testing Expectations

- Update tests when behavior changes.
- Prefer meaningful interaction assertions over render-only tests.
- Cover command palette behavior, filters, expandable panels, loading states, empty states, degraded states, theme and density controls, and reduced-motion policy where relevant.
- Keep Playwright E2E tests focused on critical user journeys and real UX behavior.
- Do not add brittle screenshot tests unless a visual regression risk clearly justifies them.
- Keep Playwright reports and traces out of git.
- Preserve CI runtime by avoiding unnecessary browser matrices and oversized E2E suites.
- Keep `npm run test` and `npm run test:coverage` passing.
- Keep `npm run test:e2e` passing when browser-level behavior changes.
- Do not fake coverage.

## Documentation Expectations

- Keep TSDoc selective and useful.
- Document reusable UI primitives, motion tokens, shared utilities, domain models, and interaction helpers when the contract is not obvious.
- Do not add comments that restate the code.
- Keep `npm run docs` working.

## CI And Pages Expectations

- Keep GitHub Pages output working.
- `scripts/prepare-pages.mjs` must copy the Vite app, coverage report, and TypeDoc docs into `pages-dist/`.
- The expected public paths are:
  - `/enterprise-ux-motion-lab/`
  - `/enterprise-ux-motion-lab/coverage/`
  - `/enterprise-ux-motion-lab/docs/`
- Keep the CI workflow focused: install, typecheck, test, coverage, build, docs, package, deploy.
- Install Playwright browsers only for the E2E step, and use Chromium unless another browser adds clear value.
- Avoid obsolete GitHub Actions versions.

## Dependency Policy

- Do not introduce unnecessary dependencies.
- Prefer mature, maintainable, enterprise-appropriate packages.
- Avoid hype-driven animation or UI libraries.
- If adding a dependency, document why it is needed and update tests where behavior changes.

## Code Style

- Use TypeScript strictness as the default guardrail.
- Keep components small enough to reason about.
- Extract pure helpers when behavior deserves direct tests.
- Keep CSS sober, responsive, and information-dense.
- Avoid decorative gradients, landing-page patterns, and low-density marketing layouts.
- Ensure text fits in controls and panels at mobile and desktop widths.

## What Not To Do

- Do not turn this into a generic portfolio landing page.
- Do not add decorative animations without UX purpose.
- Do not remove reduced-motion support.
- Do not make the table unusable on mobile by squashing columns.
- Do not commit generated `dist/`, `coverage/`, `docs/`, or `pages-dist/` output.
- Do not commit `playwright-report/`, `test-results/`, or `blob-report/` output.
- Do not leave TODO-only features.
- Do not weaken tests, docs, or Pages packaging to make a build pass.
