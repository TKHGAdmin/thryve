# Thryve — Claude Code Memory

Persistent knowledge base that accumulates across all sessions. Claude Code reads this at the start of every session and updates it during /clear. This file is APPEND-ONLY for learnings and UPDATE-IN-PLACE for preferences and patterns.

---

## User Preferences

### Communication style:
- Wants to be interviewed before building — deep discovery before code
- Prefers interactive questions over long text
- Wants bulletproof, detailed prompts with zero room for interpretation
- Gets frustrated when Claude Code changes more than asked — scope discipline is critical
- Says "scope creep" when Claude Code touches files or elements not specified
- Prefers to confirm visually on phone before moving on
- Likes building incrementally — polish as you go, not all at the end
- Works prompt by prompt with a human-in-the-loop at every step

### Design sensibilities:
- Premium, Apple-native feel — uses the phrase "REAL APPLE GLASS"
- Hates generic AI aesthetics
- Neon lime green (#B9FF66) is the brand accent — uses it sparingly, not everywhere
- White/light backgrounds, not dark mode
- DoorDash/Uber Eats speed and transactional energy
- Floating island tab bar, not flush to edges
- When something looks off, prefers to fix it immediately before moving on
- Cares about the wordmark — "thryve." with green period is brand identity

### Development preferences:
- Tests on physical iPhone via Expo Go, not simulator
- Wants commands copy-paste ready in chat, not in files
- Runs multiple apps simultaneously (port conflicts are common — always say Y to alternate port)
- Commits after each working feature
- Uses regular terminal for git/expo commands, Claude Code for building
- Wants to understand what each prompt will do before pasting it
- Prefers Claude Code to show what it changed in a clear diff summary

### Decision-making style:
- Makes fast decisions when given clear options
- Prefers "recommend one" over open-ended choices
- Will push back immediately if something doesn't match his vision
- Thinks in terms of competitive differentiation (SweatPals is the benchmark)
- Revenue-minded — wants monetization path clear from the start

---

## Technical Patterns

### What works:
- Isolated ACCENT constant (#B9FF66) in theme.ts, imported only where needed — prevents color bleed
- expo-blur BlurView with intensity 20-40, tint "light", rgba overlay for glass effect
- Supabase CLI for running migrations (supabase db query --linked --file)
- Hardcoded data first, wire to Supabase second
- Building UI screens with hardcoded data, then swapping in real queries
- cat > filename << 'EOF' ... EOF pattern for creating files from terminal
- Pure-logic modules (no React/Supabase) for ranking/scoring — keep them testable and re-mountable (see src/lib/algorithm.ts)
- Mapper pattern (Supabase row → legacy EventItem) when wiring new data sources to existing components — preserves UI without diff churn
- Module-scoped cache inside a hook (e.g. useLocation) for slow read-mostly values shared across mounts

### What breaks:
- Changing global theme tokens propagates everywhere — always use isolated constants for accent overrides
- expo-router defaults to /app/ at project root, not /src/app/ — must configure
- Supabase built-in email SMTP: ~3 emails/hour rate limit — use Resend for dev
- npx expo install can hit peer dependency conflicts on SDK 54 — use --legacy-peer-deps as fallback
- BlurView may render black/empty on some iOS versions — fallback: rgba(255,255,255,0.72) solid

### Gotchas in this codebase:
- T.glow in theme.ts is the ORIGINAL lime (#C9F23C), ACCENT is the neon lime (#B9FF66) — they are different colors for different purposes
- Event cards use category palette colors from CAT in theme.ts — don't confuse with ACCENT
- Auth uses email OTP for now — will swap to phone+SMS (Twilio) before launch
- Seed data uses a dummy user (00000000-...-001) — RLS requires auth.uid() match, so seed data won't be writable from app until real auth
- Multiple Expo ports in use — thryve typically runs on 8082-8084

---

## Product Knowledge

### Competitive context:
- SweatPals is the primary competitor ($17M funded, 1M+ users)
- SweatPals weaknesses: buggy UX, no location filtering, ghost RSVPs (40 sign up, 5 show), no ride integration, no social planning, host-tools first / consumer second
- Thryve differentiators: speed (3 taps to RSVP), reliability (GPS check-in proves show-up rates), logistics (Uber/Lyft/Maps integration), Live Activities, consumer-first

### Product scope boundaries:
- This is NOT: a fitness tracker, workout logger, meditation app, dating app
- This IS: a consumer marketplace for real-world wellness events
- MVP includes: Live Activities, GPS auto-check-in, Instagram linking (deferred to post-launch)
- MVP excludes: host analytics, recurring events automation, in-app messaging, web app, Android, dark mode

### Revenue model:
- Free to list events
- Under 5% take rate on paid event tickets (undercuts SweatPals' 7.9%)
- Premium host tier (features TBD, pricing TBD, not in MVP)

---

## Session-to-Session Continuity Notes

- Rate limit on Supabase email will reset ~1 hour from last session end. Test login flow first thing next session.
- Resend SMTP setup was recommended but user chose to wait. If rate limit is still an issue, set up Resend (smtp.resend.com, port 465, username "resend", password = API key).
- The onboarding flow has been built but NOT tested end-to-end. First priority next session is to complete the login → onboarding → feed flow.
- After auth works, next build priority is wiring the feed to Supabase (replace hardcoded data).
- (Session 2, 2026-05-05) `/clear` protocol formalized at `.claude/commands/clear.md`. At the start of every session, read `.claude/memory.md` and `.claude/status.md` first — these are the source of truth for project state. The session-logs file is append-only history; latest.md is ephemeral and gitignored.
- (Session 2, 2026-05-05) Repo layout reminder: project root is `~/` and Thryve lives in `~/thryve/` subdir. Run `git add .` from `~/thryve` to scope correctly; running from `~/` will sweep up unrelated home-dir files.
- (Session 2, 2026-05-05) `.claude/commands/*.md` files are auto-registered as slash commands by Claude Code. `/clear` and `/design` are already discoverable.
- (Session 3, 2026-05-05) User runs `/clear` defensively even after no-op sessions (e.g. just `git push`). Treat `/clear` as a checkpoint mechanism, not just an end-of-session ritual. The protocol must produce honest output ("nothing built") rather than fabricate work on no-op runs.
- (Session 4, 2026-05-27) Feed algorithm shipped. `src/lib/algorithm.ts` is the pure scoring layer — keep it dependency-free; that constraint is intentional and testable. `src/lib/eventMapper.ts` is now the contract between Supabase row shape and the legacy `EventItem` shape — when wiring up event detail / crew profile to Supabase next, use the same mapper pattern instead of restructuring components.
- (Session 4, 2026-05-27) Discover feed now reads from Supabase via `useFeed`. RSVPs are still local context state — next sprint replaces `useRsvps` with Supabase writes and invalidates the feed memo on change.
- (Session 4, 2026-05-27) Vercel/Next.js plugin hooks fire false positives on `app/**` and `components/**` paths in this RN/Expo codebase ("use client" warnings, vercel-storage suggestions on supabase.ts). Ignore them.
- (Session 4, 2026-05-27) `git status` from Claude shows untracked home-dir junk because cwd is `~`, not `~/thryve`. Always use `git -C /Users/thomaskern/thryve <cmd>` with explicit file paths — never `git add .` from the home directory.
