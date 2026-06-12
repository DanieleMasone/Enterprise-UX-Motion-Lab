# Enterprise UX Motion Lab

[![CI and GitHub Pages](https://github.com/DanieleMasone/Enterprise-UX-Motion-Lab/actions/workflows/pages.yml/badge.svg)](https://github.com/DanieleMasone/Enterprise-UX-Motion-Lab/actions/workflows/pages.yml)
[![React](https://img.shields.io/badge/React-19-0f766e)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-2563eb)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-9a6200)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-18201d)](LICENSE)

A production-grade React and TypeScript portfolio project for functional UX micro-interactions in dense enterprise interfaces.

This is not a decorative animation gallery. The app models an internal risk operations dashboard where motion helps users understand state changes, preserve orientation, expose detail progressively, and maintain confidence during loading or degraded telemetry.

**Links**

- [Live demo](https://danielemasone.github.io/enterprise-ux-motion-lab/)
- [Coverage report](https://danielemasone.github.io/enterprise-ux-motion-lab/coverage/)
- [TypeDoc documentation](https://danielemasone.github.io/enterprise-ux-motion-lab/docs/)
- [CI workflow](https://github.com/DanieleMasone/Enterprise-UX-Motion-Lab/actions/workflows/pages.yml)

## Product Surface

The application simulates a risk-monitoring dashboard used by operations analysts, platform owners, risk managers, and audit stakeholders.

Implemented capabilities:

- KPI cards for fast operational scanning
- Dense anomaly and risk table with priority metadata
- Search, region, status, and severity filters
- Expandable detail panels with root cause, recommendation, and audit context
- Command palette opened with `Ctrl+K` or `Cmd+K`
- Dark mode and density toggles
- Loading skeletons, empty states, and degraded telemetry disclosure
- Reduced-motion support through system preference detection
- Keyboard-accessible controls, focus states, and command workflows
- Responsive layout with horizontal table overflow where dense columns need space

## Architecture

```txt
src/
  app/                    Global app state and shell
  data/                   Domain records and KPI models
  features/
    command-palette/      Command action model and palette UI
    dashboard/            Risk queue, filters, KPI scan, details
    loading-states/       Data resilience state copy
  motion/                 Motion tokens, transitions, reduced-motion policy
  styles/                 Global design layer and responsive CSS
  test/                   Shared test setup
  ui/                     Reusable primitives
```

The structure is feature-based because the project is meant to communicate maintainable product architecture, not isolated component demos. Shared UI primitives stay small. Domain logic such as filters and state transitions is pure where practical so it can be tested directly.

## Motion Principles

Motion is treated as a governed design-system layer.

- Use centralized tokens in `src/motion/motion.tokens.ts`
- Request semantic transitions from `src/motion/transitions.ts`
- Respect system reduced-motion preferences through `src/motion/reduced-motion.ts`
- Keep transitions short enough for repeated enterprise workflows
- Animate state changes, panel disclosure, list entry, and feedback only when it improves comprehension
- Avoid decorative motion, slow flourishes, and attention traps

## Testing Strategy

The test suite focuses on behavior that would matter in a real enterprise tool:

- Command palette search, execution, and Escape handling
- Browser-level command palette keyboard flow with `Ctrl+K`
- Dark mode and density state changes
- Filter narrowing and reset behavior
- Expandable detail panel behavior
- Loading, empty, and degraded states
- Reduced-motion policy and transition collapse
- Pure app-state and dashboard-filter helpers

Coverage is generated with Vitest and V8 into `coverage/`, then copied into the GitHub Pages artifact under `/coverage/`. Playwright stays deliberately small: Chromium covers smoke, command palette, theme and density persistence, filtering, disclosure, and resilience states without adding a browser matrix or screenshot maintenance burden.

## Documentation

TypeDoc generates API documentation for public primitives, motion policy, domain models, and shared helpers. TSDoc comments are intentionally selective: they explain reusable contracts and policy decisions without narrating obvious component internals.

Generated documentation is copied into the Pages artifact under `/docs/`.

## Accessibility And UX Discipline

The interface keeps enterprise information density intact while supporting accessible workflows:

- Native buttons, inputs, and selects
- `aria-pressed`, `aria-expanded`, `aria-controls`, status regions, and dialog semantics
- Visible focus states
- Keyboard command palette access
- Reduced-motion support
- Skeletons instead of generic loading spinners
- Empty states with recovery actions
- Degraded states that disclose risk without blocking work

## Performance Considerations

The project keeps interaction cost low:

- No backend or unnecessary state management library
- Short, centralized transitions
- No long-running decorative animations
- Vite production build
- Lightweight static Pages output
- Pure filter helpers with small in-memory data
- Generated artifacts excluded from source control

## Tooling

- React 19, TypeScript 6, and Vite 8 for the application surface
- Motion for functional, token-governed UI transitions
- Vitest, Testing Library, jsdom, and V8 coverage for unit and component behavior
- Playwright for focused browser-level user journeys
- TypeDoc for generated API documentation
- GitHub Actions and GitHub Pages for verification, packaging, and deployment

## Quality Gates

Local and CI verification are intentionally explicit:

1. `npm ci`
2. `npm run typecheck`
3. `npm run test`
4. `npm run test:coverage`
5. `npm run build`
6. `npm run docs`
7. `npm run test:e2e`
8. `npm run pages:build`

Generated `dist/`, `coverage/`, `docs/`, `pages-dist/`, Playwright reports, and test results stay out of source control.

## CI/CD And Pages

`.github/workflows/pages.yml` runs:

1. `npm ci`
2. `npm run typecheck`
3. `npm run test`
4. `npm run test:coverage`
5. `npm run build`
6. `npm run docs`
7. `npx playwright install --with-deps chromium`
8. `npm run test:e2e`
9. `node scripts/prepare-pages.mjs`
10. GitHub Pages upload and deployment

The published artifact contains:

- `/enterprise-ux-motion-lab/` for the app
- `/enterprise-ux-motion-lab/coverage/` for coverage
- `/enterprise-ux-motion-lab/docs/` for TypeDoc

## Trade-Offs

- No router: the lab is a single operational surface, so routing would add structure without product value.
- No global state library: local React state and pure helpers are enough for this scope.
- Focused Playwright only: critical journeys run in Chromium without screenshot baselines or a browser matrix.
- Plain CSS: the design system is small, static, and easier to audit without a styling dependency.
- Static data: the portfolio goal is frontend UX and architecture, not backend integration.

## Local Development

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run typecheck
npm run test
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
npm run test:all
npm run docs
npm run build
npm run pages:build
```

`npm run pages:build` produces `pages-dist/` with the app, coverage report, docs, and `.nojekyll`.

## Roadmap

- Add a small interaction performance note with measured build and bundle data
- Add one or two visual screenshots after the first Pages deployment
- Add optional keyboard roving behavior inside the command palette if command volume grows
- Add a lightweight accessibility audit checklist after the UI settles
