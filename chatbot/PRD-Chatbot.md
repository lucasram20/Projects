# Product Requirements Document (PRD): Chatbot

## Project Overview
- **Project codename**: `chatbot`
- **CLI bootstrap**: Use Better T-Stack
  ```bash
  pnpm create better-t-stack@latest chatbot --yes --frontend next --backend next --runtime node --database postgres --orm prisma --db-setup supabase --package-manager pnpm
  ```
- **Primary outcomes**: A full-stack Next.js chatbot app with secure auth, a modern chat UI, server-side streaming responses, and persisted chat history.

## Goals
- **Deliver a fast, secure chat experience** with streaming responses.
- **Provide frictionless auth** using Better Auth, with polished shadcn/ui login/registration pages.
- **Persist chat history** in Postgres (Supabase) via Prisma.
- **Offer a clean, accessible UI** that works great on mobile and desktop.

## Non‑Goals
- Fine-tuned model training.
- Multi-tenant billing or advanced admin dashboards.
- Complex role-based authorization beyond basic user/session.

## Personas
- **Anonymous Visitor**: Can view landing; prompted to sign up to use chat.
- **Authenticated User**: Can create chats, view history, continue conversations.
- **Admin (future)**: Out of scope now; reserved for observability and moderation later.

## Success Metrics
- **TTFT (time-to-first-token)**: ≤ 500 ms (p95) after prompt submit.
- **Chat response completion**: ≥ 99.5% succeed (non-5xx).
- **Auth conversion**: ≥ 60% registration completion from login/signup views.
- **CLS/LCP**: LCP ≤ 2.5s on 4G mid-tier; CLS < 0.1.

## Functional Requirements

### Authentication
- Email/password signup and login via Better Auth.
- OAuth providers (Google, GitHub) optional; feature-flagged.
- Session via secure httpOnly cookies; remember-me session extension.

### Chat
- Create a new conversation; send prompts; stream assistant replies.
- Persist messages and conversation metadata.
- List conversations; resume a prior conversation.
- Delete a conversation (soft delete).

### Settings (MVP)
- Toggle response streaming on/off.
- Opt-in/opt-out of analytics.

### Landing
- Public marketing/home page with CTA to login/sign up.

## Non‑Functional Requirements
- **Availability**: 99.9% for API.
- **Performance**: p95 request latency ≤ 300 ms for non-streaming endpoints.
- **Security**: OWASP Top 10 mitigations; CSRF protection; strict CSP.
- **Accessibility**: WCAG 2.2 AA for interactive flows.
- **Privacy**: No PII in logs; redact secrets; data retention policy (90 days for deleted chat content before hard delete).

## System Architecture
- **Frontend**: Next.js App Router (RSC where suitable), Tailwind v4, shadcn/ui for forms and auth pages, client-side chat UI with streaming.
- **Backend**: Next.js API routes (Node runtime), server actions for safe mutations, SSE/ReadableStream for streaming chat.
- **Database**: Supabase Postgres, connected via Prisma.
- **Auth**: Better Auth with Prisma adapter and session cookies.
- **Infra**: Supabase for DB; Vercel or similar for hosting (Node runtime). Environment split: dev, preview, prod.

## Tech Stack and Version Targets
- **Next.js**: 15.4 ([Next.js 15.4 blog](https://nextjs.org/blog/next-15-4))
- **Node.js**: v22 LTS ([endoflife.date Node.js](https://endoflife.date/nodejs))
- **pnpm**: 10.15.0 ([npm pnpm](https://www.npmjs.com/package/pnpm))
- **React**: 19.1.0 ([React versions](https://react.dev/versions))
- **TypeScript**: 5.9.2 ([npm typescript](https://www.npmjs.com/package/typescript))
- **Tailwind CSS**: 4.0 ([Tailwind v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4))
- **shadcn/ui**: shadcn@2.10.0 ([shadcn/ui releases](https://github.com/shadcn-ui/ui/releases))
- **Prisma**: 6.11.0 ([Prisma releases](https://github.com/prisma/prisma/releases))
- **Supabase JS**: 2.55.0 ([@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js))
- **PostgreSQL**: 17.x (current stable line) ([PostgreSQL release notes](https://www.postgresql.org/docs/release/))
- **Better Auth**: 1.3.7 ([npm better-auth](https://www.npmjs.com/package/better-auth))

> **Note**: Pin exact versions in `package.json` and Prisma engines; set Node to 22.x in `.nvmrc`/engines.

## Data Model (Prisma, conceptual)
- `User` (id, email, hashedPassword, createdAt)
- `Session` (id, userId, expiresAt, createdAt)
- `Conversation` (id, userId, title, createdAt, updatedAt, deletedAt?)
- `Message` (id, conversationId, role["user"|"assistant"|"system"], content, tokensIn, tokensOut, createdAt)

**Indexes**: userId+createdAt on conversations; conversationId+createdAt on messages.

## API Surface
- `POST /api/auth/*` — Better Auth routes (handled by library)
- `POST /api/chat` — Create/send a message request; returns stream
  - Request: { conversationId?, message: string, settings? }
  - Response: text/event-stream (chunks of tokens)
- `GET /api/conversations` — List user's conversations (paginated)
- `GET /api/conversations/:id` — Fetch conversation + messages
- `DELETE /api/conversations/:id` — Soft delete
- `GET /api/health` — Liveness/readiness checks

## Authentication and Authorization
- **Library**: Better Auth for TS ([Better Auth](https://www.better-auth.com/))
- **Session**: httpOnly, secure cookies; sameSite=lax; rotating session ID on login.
- **Storage**: Prisma-backed user, session, and keys.
- **Access Control**: Per-user ownership checks on conversation and message CRUD.
- **CSRF**: Double-submit cookie or same-site cookie strategy on non-GET endpoints.
- **OAuth**: Optional; Google and GitHub; minimal scopes; store provider id only.

## UI/UX Requirements

### Auth screens (shadcn/ui)
- **Components**: `Card`, `Input`, `Label`, `Button`, `Form`, `Tabs`, `Toaster`.
- **Pages**: `/login`, `/register`; error states; password rules; OAuth buttons.

### Chat screen
- Sticky composer with multiline input, submit via Enter, Shift+Enter newline.
- Streaming rendering with token-by-token updates.
- Message roles with avatars; time stamps; copy-to-clipboard.
- Sidebar: conversation list, new chat button, delete action.
- Empty state with CTA and keyboard hints.
- Loading skeletons; optimistic UI when sending.

### Accessibility
- Focus management, ARIA for live regions during streaming.
- Color contrast AA; prefers-reduced-motion honored.

## Observability and Analytics
- **Logging**: Server request logs (no PII), redaction of prompts if opted out.
- **Metrics**: Latency, error rates, token usage, completion length.
- **Tracing**: Minimal app-level spans around model calls and DB ops.
- **Analytics opt-in**: Store per-user preferences; default off in EU.

## Environments & Deployment
- **Envs**:
  - `DATABASE_URL` (Supabase Postgres, pooled)
  - `BETTER_AUTH_SECRET` / provider secrets
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if needed)
  - Model provider keys (if using Gemini/OpenAI/etc.)
- **Migrations**: Prisma migrate with CI gating.
- **CI/CD**: Lint, typecheck, test, migrate, deploy. Feature previews enabled.

## Security & Compliance
- CSP with strict `script-src` and nonce on inline RSC payloads.
- Rate limiting on auth and chat endpoints; IP + user-scoped buckets.
- Input validation and output encoding; HTML sanitization for message rendering.
- Backups: daily DB backups via Supabase; 7-day point-in-time recovery.

## Performance and Scalability
- Streaming via SSE/ReadableStream for low-latency responses.
- Connection pooling (pgBouncer/Supabase) for Prisma.
- Caching conversation lists per user (short TTL) where safe.
- Pagination and infinite scroll for histories.

## Risks and Mitigations
- **LLM latency variability** → stream early; fallback model tier.
- **Auth complexity** → adopt Better Auth defaults; minimal custom flows first.
- **Tailwind v4 migration** → start new with v4; avoid upgrading v3 artifacts.
- **React 19 changes** → adhere to compatible versions per shadcn/ui notes.

## Milestones
- **M1**: Bootstrap project, envs, DB, Prisma schema, Better Auth wired (1–2d)
- **M2**: Auth UI with shadcn/ui; sessions working e2e (1–2d)
- **M3**: Chat backend API with streaming; basic UI (2–3d)
- **M4**: Persistence of conversations/messages; list and detail (1–2d)
- **M5**: Polish: loading, a11y, rate limiting, telemetry, docs (2–3d)

## Acceptance Criteria
- Users can register/login via shadcn/ui forms powered by Better Auth.
- Authenticated users can create a conversation, send a prompt, and see streamed responses.
- Conversations persist; users can resume and delete them.
- All endpoints enforce auth; no cross-user access.
- Meets performance, accessibility, and security requirements above.

## Implementation Notes
- Prefer Node runtime (not Edge) to align with Prisma and Better Auth.
- Use server actions for mutations where ergonomic; otherwise API routes.
- Keep auth pages in `app/(auth)/{login,register}/page.tsx` with shadcn/ui.
- Token streaming: implement `ReadableStream` with backpressure; flush headers early.

---

*This PRD was created for the chatbot project using Better T-Stack with Next.js, Prisma, Supabase, and Better Auth integration.*
