# S-011 - Character Identity And Roster

> Generated from LLM Workbench v2.3.

**Spec ID:** S-011
**Status:** complete
**Priority:** 1
**Owner:** Character Module
**Updated:** 2026-07-17
**Catalog description:** Let each player authenticate and access only their own scannable character roster and character records.
**Blockers:** none
**Latest event:** Implemented auth/ownership/roster behavior was captured with current green source proof.
**Next gate:** none

## Outcome

Players sign up or sign in, receive a protected session, and can list/open only
their own characters.

## Why It Matters

Character data is private player state. Every creator, sheet, and progression
workflow depends on trustworthy identity and ownership isolation.

## Current Verified State

- API implements bcrypt-hashed users, JWT issue/validation, protected character
  routes, and owner-scoped data access.
- Client stores only `pdb-token`, exposes auth context, protects roster/create/
  sheet routes, and renders roster cards with name/race/class/level.
- API tests cover duplicate users, invalid credentials/tokens, sanitized user
  output, empty/user-scoped roster, and unowned character reads/writes.
- Client tests cover auth context/pages, route protection, and roster rendering.

## Desired Behavior

- Sign-up validates unique identity and never returns password hashes.
- Sign-in returns a usable token or explicit error.
- Protected routes reject missing/invalid/expired tokens.
- Roster and character operations are scoped to the authenticated user.
- Roster remains concise and links into creation/sheet flows.

## Decisions And Contracts

- JWT is the current auth contract; frontend localStorage is limited to
  `pdb-token`.
- Email owns API character scope; duplicate character names are rejected per
  owner.
- Cross-user isolation is server-enforced, not a UI filter.

## Non-Goals

- Social login, public profiles, password reset, roles/DM sharing, or production
  identity hardening beyond the current private module.

## Dependencies And Blockers

- Existing dndAPI/dndclient modules; no open blocker.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Create and authenticate sanitized users with hashed passwords and JWT | done | none | API auth/data-access tests pass in the 132-test suite |
| TK-002 | Reject missing, invalid, expired, and malformed authorization | done | TK-001 | middleware/API tests pass in the 132-test suite |
| TK-003 | List/open/update only owner-scoped characters | done | TK-002 | API ownership and unowned-id tests pass |
| TK-004 | Protect client routes and render the signed-in user's scannable roster | done | TK-003 | auth, route, and character-page tests pass in the 372-test suite |

## Acceptance Criteria

- [x] Credentials are validated and password hashes never leave the API.
- [x] Protected routes reject invalid authentication.
- [x] Character reads/writes are owner-scoped.
- [x] Roster renders safe summary fields and reaches character workflows.
- [x] Unit/integration suites cover the current contract.

## Testing Seams

- API auth/middleware/data-access tests and client auth/route/roster tests.
- Cross-user browser release proof remains S-016.

## Verification Procedure

```bash
cd dndAPI && npm test
cd ../dndclient && npm test -- --run
```

## Documentation Impact

- Durable capability truth moved here; nested API/client docs remain live
  implementation references.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | spec | Captured implemented auth/roster capability | API 132/132 and client 372/372 green; routes/source/docs inspected | S-011 and Blueprint matrix created | Browser cross-user proof belongs to S-016 |

## Completion Result

Auth, protected ownership, and roster behavior now have durable capability,
acceptance, and proof ownership. No product code changed during capture.

## Remaining Limitations Or Follow-Up Specs

- S-016 owns browser-level cross-user isolation and release proof.

## Supersession

- Supersedes: auth/roster truth scattered across nested Blueprints/Gameplans.
- Superseded by: none.
