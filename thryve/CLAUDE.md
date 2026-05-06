# Thryve

## What
Thryve is a realtime wellness social events marketplace — the DoorDash of wellness events with Uber-style Live Activities. Users discover, RSVP, share, book rides to, and auto-check-in at local wellness events like ice bath & coffee meetups, run clubs, breathwork circles, fitness festivals, and sunrise yoga.

This is NOT a fitness tracker, workout logger, or meditation app. It's a consumer marketplace for real-world wellness experiences.

## Launch
- City: Charleston, SC
- Target: All ages, iOS only, English only
- Founder: Solo, part-time, revenue target in 90 days
- Revenue: Free to list. Under 5% take rate on paid event tickets. Premium host tier (pricing TBD, not in MVP).

## Stack
- Framework: React Native with Expo (SDK 54), TypeScript
- Backend: Supabase (Postgres + Auth + Realtime + Storage)
- Payments: Stripe Connect (marketplace model — under 5% take rate, if included in MVP)
- Navigation: Expo Router (file-based routing)
- Maps/Location: expo-location + react-native-maps
- Notifications: expo-notifications
- Live Activities: iOS ActivityKit (Dynamic Island + Lock Screen)
- Analytics: Mixpanel or PostHog (full tracking from day one)
- Instagram: Instagram Basic Display API or Graph API for profile linking
- Target: iOS only

## Project Structure
src/
  app/                # Expo Router screens (file-based routing)
    (tabs)/           # Tab navigator screens
      index.tsx       # Discover feed (home)
      calendar.tsx    # Your upcoming RSVPs
      create.tsx      # Create event flow
      crews.tsx       # Crews tab
      profile.tsx     # Your profile
    event/[id].tsx    # Event detail screen
    crew/[id].tsx     # Crew profile screen
    crew/create.tsx   # Create crew flow
    login.tsx         # Phone number input
    verify.tsx        # OTP verification
    onboarding/       # Onboarding flow screens
      name.tsx        # Name + profile setup
      instagram.tsx   # Instagram linking (skippable)
      interests.tsx   # Pick categories
      city.tsx        # Pick city
  components/         # Reusable UI components
  lib/                # Supabase client, helpers, constants, analytics
  hooks/              # Custom React hooks
  types/              # TypeScript type definitions
  assets/             # Images, fonts

## Onboarding Flow (6 screens)
1. Phone number input
2. OTP verification (6-digit, auto-submit)
3. Name + profile setup
4. Instagram linking (strongly encouraged, skippable) — pulls: profile photo, mutual followers on Thryve, IG handle, follower/following graph, identity verification
5. Pick interests (9 categories)
6. Pick city → land on Discover feed

## Event Categories (9)
Cold Plunge / Ice Bath, Run Clubs, Yoga / Sound Bath, Breathwork, Fitness Festivals, Hiking / Outdoor, Coffee + Wellness Socials, Pickleball / Sports, Sauna / Recovery

## Key Concepts

### Events
- Wellness experiences with date, location, price (free or paid), capacity, crew owner
- Anyone can post — individuals post one-offs, crews post recurring
- Goes live immediately, no approval needed
- Hosts can upload multiple photos
- Cancellation: free cancel up to 24 hours before, after that spot is locked

### Crews
- Run clubs, wellness brands, studios, hosts — the identity layer
- Events can belong to crews or be posted by individuals
- Users join/leave crews (not follow individual users — app is event-centric)
- Crew profiles show upcoming events, past events, members

### RSVPs
- One-tap RSVP per event
- Day-of confirmation push notification 2 hours before: "Still going?"
- Confirm or cancel from the notification
- Unconfirmed RSVPs release spots
- Waitlist when capacity is hit

### Live Activities / Dynamic Island (MVP — critical differentiator)
- Activates day-of only (like airlines at airport)
- States: countdown → "2 hours away" → "Starting now" → "Happening" → "Ended"
- Uber-style live updating with context changes
- Tap to open event detail or get directions
- Uses iOS ActivityKit

### GPS Auto-Check-in (MVP)
- When user arrives within proximity of event location, auto-marks checked in
- Powers real show-up rate tracking
- Adds "You attended" badge to user profile
- No manual check-in needed

### Ride Integration (3 options on event detail)
- Uber deep link with destination pre-filled
- Lyft deep link with destination pre-filled
- Apple Maps directions
- All three shown as options in the sticky bottom bar

### Share
- Native share sheet with rich preview card
- Deep link (thryve://event/[id]) opens event in-app
- Track shares in database for analytics

### Post-Event
- Prompt to follow the crew if user hasn't
- "You attended" badge on profile
- No reviews, ratings, or photo recaps in MVP

## Screens

### Discover Feed (home tab)
- Sticky top bar: "thryve" wordmark, location pill (city), search icon, notification bell
- Category filter chips (9 categories, horizontal scroll)
- "Happening Now" urgency section with pulsing dots and countdown timers
- Event cards: photos, title, crew + verified badge, date/time, location, price (Free in green), social proof faces, one-tap RSVP
- Individual and crew events in same feed

### Event Detail
- Multiple photos (swipeable)
- Title, crew name (tappable → crew profile), verified badge
- Quick info: date/time, location, price
- Map showing exact location
- Weather forecast for outdoor events
- Host's past events and ratings
- Similar events nearby
- Attendee faces + count
- Sticky bottom bar: RSVP/Get Ticket + Book a Ride (Uber/Lyft/Maps) + Share

### Create Event (3 steps)
- Step 1: Name, category, description
- Step 2: Date, time, location (map picker)
- Step 3: Free/paid (price), capacity, tags, multiple photo upload
- Submit → goes live immediately with "Just dropped" badge

### Crews Tab
- Your crews (grid)
- Discover crews nearby
- Create a Crew CTA

### Crew Profile
- Banner, avatar, name, verified badge, member count, bio
- Join/Leave button
- Upcoming events list
- Past events
- Members preview

### Calendar Tab
- Upcoming RSVPs sorted by date
- Grouped by day

### Profile
- Avatar (from IG or uploaded), name, IG handle
- Events attended count + badges
- Crews joined
- Edit profile, sign out

## Moderation
- Report button on events
- Solo founder reviews manually
- No automated moderation for MVP

## Analytics
- Full event tracking from day one
- Track: signups, RSVPs, show-up rates (via GPS check-in), shares, crew follows, category popularity, retention

## Design
- Light/white background (#FFFFFF cards on #F8F9FA page), NOT dark mode
- Typography: bold geometric sans (Plus Jakarta Sans or similar)
- Near-black (#111827) for headlines, warm gray (#6B7280) for secondary text
- Event cards have soft pastel category-colored headers
- Bottom nav: dark (#111827) bar with white icons — the one dark element
- Speed is the UX principle — three taps max from open to RSVP
- DoorDash/Uber Eats transactional energy on a clean white canvas
- Full design spec: @docs/DESIGN.md

## Supabase
- Tables: users, crews, crew_members, events, event_photos, rsvps, shares, reports, checkins
- Auth: phone number + OTP
- Enable Row Level Security on all tables
- PostGIS for location-based event queries
- Realtime subscriptions for live RSVP counts
- Storage for event photos and crew avatars

## Commands
- npx expo start — start dev server
- npx expo start --ios — start with iOS simulator
- npm run lint — lint check
- npx eas build --platform ios — build for iOS
- npx eas submit --platform ios — submit to App Store

## Code Style
- TypeScript strict mode
- Functional components with hooks only
- Named exports for components, default exports for screens
- Use const over let, never var
- Destructure props and imports
- One component per file
- Co-locate styles with components (StyleSheet.create)

## Rules
- Never add dark mode or theme switching
- Never add workout tracking, calorie counting, step counters, or heart rate features
- Never add dating or swipe features
- Never add in-app messaging or group chat (not in MVP)
- Always use Expo SDK modules over bare React Native packages
- Always commit to feature branches, never directly to main
- Test on physical iPhone via Expo Go before committing
- Charleston SC is the launch city — use Charleston locations in all sample data
- All sample data should reference real Charleston locations and realistic wellness events
- When the user says /clear, execute the session handoff protocol at .claude/commands/clear.md — this is mandatory, never skip it
- At the start of every session, read .claude/memory.md and .claude/status.md before doing anything else
- These files contain accumulated knowledge about user preferences, technical patterns, product decisions, and project state
- Follow the patterns and preferences documented in memory.md — they represent how the user wants to work

## Not in MVP
- Premium host subscription (pricing TBD)
- Host analytics dashboard
- Recurring/series event automation
- Custom crew branding
- SMS/email blasts to community
- Priority feed placement
- In-app messaging / group chat
- Web app
- Android
- Dark mode
- Reviews / ratings
- Photo recaps after events
