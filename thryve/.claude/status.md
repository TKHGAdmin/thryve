# Thryve — Project Status
## Build phase: MVP — Sprint 1: Backend + Auth
## Last session: 2026-05-05 (Session 3)
## Next priority: End-to-end test login → onboarding → feed, then wire feed to Supabase.

| Feature | Status | Notes |
|---|---|---|
| Expo project setup (SDK 54, TypeScript) | ✅ Done | RN 0.81, expo-router 6 |
| GitHub repo connected | ✅ Done | TKHGAdmin/thryve, branch feat/v5-design-charleston-mvp |
| CLAUDE.md product scope | ✅ Done | Charleston launch city, 9 categories, MVP boundaries |
| /design slash command | ✅ Done | .claude/commands/design.md |
| /clear handoff protocol | ✅ Done | .claude/commands/clear.md |
| Design system tokens (theme.ts) | ✅ Done | T palette + ACCENT (#B9FF66) isolated |
| 9 event categories | ✅ Done | cold, run, breath, fest, yoga, social, hike, pkl, sauna |
| Charleston seed data | ✅ Done | 5 crews + 6 events with real lat/lng |
| Discover feed (home tab) | 🔄 In Progress | UI built; reads from hardcoded src/lib/data.ts (not Supabase) |
| Pulse hero "Live in Charleston" | ✅ Done | components/PulseHero.tsx |
| Walkup live drop card | ✅ Done | components/WalkupDrop.tsx |
| Category rail (9 chips) | ✅ Done | Glass inactive, neon active |
| Big hero card | ✅ Done | components/HeroCard.tsx |
| Live Now / Today timeline | ✅ Done | Dark ink card matching WalkupDrop |
| Feed list cards | ✅ Done | components/EventCard.tsx |
| Event detail screen | 🔄 In Progress | UI built; reads hardcoded data; ride links live |
| 3 ride options (Uber/Lyft/Apple Maps) | ✅ Done | Linking deep links + web fallbacks |
| Crew profile screen | 🔄 In Progress | Placeholder UI, hardcoded data |
| Crews tab | 🔄 In Progress | Placeholder grid |
| Calendar tab | 🔄 In Progress | Reads from local RsvpProvider context |
| Profile/You tab | 🔄 In Progress | Placeholder stats |
| Create event flow | ❌ Not Started | 4-step stepper placeholder only, no form |
| Bottom tab bar (floating glass island) | ✅ Done | BlurView, neon active, lime "+" |
| "thryve." wordmark | ✅ Done | 19px / 600 / -0.7 with neon period |
| Header: location pill + map + bell | ✅ Done | 3-column layout |
| Apple glass treatment | ✅ Done | Tab bar, chips, Live Now cards |
| Supabase client (with AsyncStorage + URL polyfill) | ✅ Done | src/lib/supabase.ts |
| Supabase schema migration (001) | ✅ Done | 9 tables, PostGIS, triggers, RLS, indexes — applied |
| Charleston seed migration (002) | ✅ Done | Applied to remote DB |
| Supabase CLI linked | ✅ Done | xryzvnqtqhmwugumpxpb |
| Email OTP auth | 🔄 In Progress | Implemented, NOT tested end-to-end |
| Login screen | ✅ Done | src/app/login.tsx |
| 8-digit OTP verify screen | ✅ Done | src/app/verify.tsx |
| Onboarding: name + avatar | ✅ Done | src/app/onboarding/name.tsx |
| Onboarding: pick interests | ✅ Done | src/app/onboarding/interests.tsx |
| Onboarding: pick city | ✅ Done | src/app/onboarding/city.tsx, expo-location reverse geocode |
| AuthProvider + auth gating | ✅ Done | useAuth hook, route protection in _layout.tsx |
| Phone OTP / SMS auth | ❌ Not Started | Deferred — needs Twilio |
| Instagram linking | ❌ Not Started | Deferred to post-launch |
| Feed connected to Supabase | ❌ Not Started | Currently hardcoded |
| RSVP writes to Supabase | ❌ Not Started | Local context only |
| Avatar upload to Storage bucket | 🔄 In Progress | Code exists; bucket "avatars" must be created in dashboard |
| Live Activities / Dynamic Island | ❌ Not Started | iOS ActivityKit native module needed |
| GPS auto-check-in | ❌ Not Started | Needs expo-task-manager + background location |
| Day-of confirmation push | ❌ Not Started | expo-notifications not wired |
| Native share sheet + deep links | ❌ Not Started | thryve:// scheme registered in app.json |
| Multiple event photos (swipeable) | ❌ Not Started | Single photo placeholder only |
| Map on event detail | ❌ Not Started | react-native-maps installed, not rendered |
| Weather forecast on outdoor events | ❌ Not Started | |
| Host past events / similar events nearby | ❌ Not Started | |
| Crew create flow | ❌ Not Started | |
| Report event button | ❌ Not Started | |
| Analytics (Mixpanel/PostHog) | ❌ Not Started | |
| Stripe Connect (paid tickets) | ❌ Not Started | |
| Resend SMTP for dev email | ❌ Not Started | Built-in SMTP rate-limiting, deferred |
