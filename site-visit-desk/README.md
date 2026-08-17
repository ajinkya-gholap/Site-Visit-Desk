# Site Visit Desk — Commtel Networks

A single-page React app for coordinators to raise and manage field site-visit
requests. No backend — all data lives in React state, seeded from
`src/data/mockRequests.js` and served through a fake async API in
`src/api/mockApi.js`.

## Setup and run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint       # oxlint
```

Requires Node 18+. No environment variables or backend needed.

## How I covered each topic

| Topic (Section 3)                     | File(s)                                                                                   |
|----------------------------------------|---------------------------------------------------------------------------------------------|
| 3.1 Forms & multiple inputs            | `components/RequestForm/RequestForm.jsx`, `FormField.jsx`, `utils/validate.js`             |
| 3.2 Textarea                           | `components/RequestForm/NotesTextarea.jsx`                                                 |
| 3.3 Select (incl. dependent + multi)   | `components/RequestForm/RequestForm.jsx` (category/engineer `<select>`, `notifyTeams` multi-select), `data/engineers.js` |
| 3.4 Checkbox                           | `components/RequestForm/ServicesCheckboxGroup.jsx`, `accessApproved` checkbox in `RequestForm.jsx` |
| 3.5 Radio                              | `components/RequestForm/RadioGroup.jsx` (reused for Severity + Preferred contact)          |
| 3.6 Events                             | `RequestForm.jsx` (`onSubmit`/`onBlur`), `hooks/useDebouncedValue.js`, `Modal/RequestDetailsModal.jsx` (Escape + backdrop), `Queue/RequestCard.jsx` (copy ID) |
| 3.7 Conditional rendering              | `components/Queue/QueueStates.jsx`, `RequestCard.jsx` (overdue flag, status-based actions) |
| 3.8 Lists & keys                       | `components/Queue/Queue.jsx` (derived `useMemo` filter/sort), `RequestList.jsx`            |
| 3.9 CSS styling                        | `styles/tokens.css`, `styles/global.css`, per-component `*.module.css`, `utils/cx.js`      |
| 3.10 Suspense                          | `components/Analytics/AnalyticsPanel.jsx`, `SiteAnalytics.jsx`, `AnalyticsSkeleton.jsx`, `AnalyticsErrorBoundary.jsx` |
| 3.11 Portals                           | `components/Modal/RequestDetailsModal.jsx`, `components/Toast/ToastHost.jsx`               |

## Grid vs Flexbox (3.9)

The main layout (`App.module.css` `.layout`) uses **CSS Grid**, not Flexbox.
The two columns need independently, page-controlled widths — a fixed-width
form rail (`380px`) alongside a fluid queue column — rather than
content-driven sizing. Grid's `grid-template-columns: 380px 1fr` expresses
that directly; doing the same in Flexbox would mean fighting `flex-basis` /
`flex-shrink` on both children to fake fixed + fluid behaviour. Grid also
made the responsive collapse trivial: swapping to `grid-template-columns: 1fr`
under 768px is a single declaration. Flexbox is used *within* components
(toolbar controls, card footers, radio/checkbox rows) where children just
need to flow and wrap along one axis — a better fit for that smaller-scale
alignment job.

## Portal-clipping note (3.11)

`App.module.css` gives `.queueColumn` (an ancestor of the "View details"
button that opens the modal) both `overflow: hidden` and `transform:
translateZ(0)`. The `transform` creates a new containing block for
fixed/absolutely positioned descendants, and combined with `overflow:
hidden` it would clip any modal rendered *inline* inside that column,
regardless of `position: fixed`. `RequestDetailsModal` avoids this entirely
by rendering through `createPortal` into `#modal-root`, a sibling of `#root`
declared in `index.html` — so it sits outside the clipped ancestor and
paints as a normal full-viewport overlay. `ToastHost` uses the same escape
hatch into its own `#toast-root`.

## Data & fake API

`src/api/mockApi.js` exposes `fetchRequests()` (1.2s delay, 15% random
failure so the error state is reachable) and `createRequest()` (0.9s delay).
`src/data/mockRequests.js` seeds 10 requests covering every category, all
four severities, all three statuses, and multiple overdue dates.

## What I'd do differently with more time

- Extract the form's state/validation/touched logic into a reusable
  `useForm(initialValues, validate)` hook (listed as a stretch goal) — right
  now `RequestForm.jsx` is doing a bit more than a "small, single-purpose"
  component ideally should.
- Add a real keyboard focus trap inside the modal (Tab currently doesn't
  loop back from the last focusable element to the first).
- Persist the queue to `localStorage` so a refresh doesn't lose newly
  created requests.
- Add Vitest + React Testing Library coverage for `validate.js` and the
  `Queue` filtering/sorting logic, since both are pure and cheap to test.
- Swap the CSS bar chart in `SiteAnalytics` for something built with
  `<svg>` so bar widths animate more smoothly and are easier to make
  accessible (currently relies on color + adjacent numeric labels only).

## Screenshots

_Add screenshots here before submitting: the four queue states (loading,
error, empty, no-match), the details modal open, the Suspense skeleton for
Analytics, and the browser Network tab showing `SiteAnalytics` fetched as a
separate chunk on demand (visible as `SiteAnalytics-*.js` in `npm run
build` output)._
