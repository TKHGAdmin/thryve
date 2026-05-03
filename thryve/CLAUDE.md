# Thryve

## What
Thryve is a realtime wellness social events marketplace — the DoorDash of wellness events. Users discover, RSVP, share, and get rides to local wellness events like ice bath & coffee meetups, run clubs, breathwork circles, fitness festivals, and sunrise yoga.

This is NOT a fitness tracker, workout logger, or meditation app. It's a consumer marketplace for real-world wellness experiences.

## Stack
- **Framework**: React Native with Expo (SDK 54), TypeScript
- **Backend**: Supabase (Postgres + Auth + Realtime + Storage)
- **Payments**: Stripe Connect (marketplace model — hosts receive payouts)
- **Navigation**: Expo Router (file-based routing)
- **Maps/Location**: expo-location + react-native-maps
- **Notifications**: expo-notifications
- **Target**: iOS only (for now)

## Project Structure
src/
  app/             # Expo Router screens (file-based routing)
    (tabs)/        # Tab navigator screens
      index.tsx    # Discover feed (home)
      calendar.tsx # Your upcoming RSVPs
      create.tsx   # Create event flow
      crews.tsx    # Crews tab
      profile.tsx  # Your profile
    event/[id].tsx # Event detail screen
    crew/[id].tsx  # Crew profile screen
  components/      # Reusable UI components
  lib/             # Supabase client, helpers, constants
  hooks/           # Custom React hooks
  types/           # TypeScript type definitions
  assets/          # Images, fonts

## Key Concepts
- **Crews**: Run clubs, wellness brands, studios, hosts — the identity layer. Events belong to crews.
- **Events**: Wellness experiences with date, location, price (free or paid), capacity, crew owner.
- **RSVPs**: One-tap RSVP per event. Day-of confirmation system to prevent ghost RSVPs.
- **Urgency**: "Happening Now" section, countdown timers, spot limits, "Just dropped" badges.
- **Ride integration**: Uber deep links with destination pre-filled (no API needed).
- **Share**: Native share sheet with rich preview cards for sending events to friends.

## Design
- Light/white background (#FFFFFF cards on #F8F9FA page), NOT dark mode
- Typography: bold geometric sans (Plus Jakarta Sans or similar)
- Near-black (#111827) for headlines, warm gray (#6B7280) for secondary text
- Event cards have soft pastel category-colored headers
- Bottom nav: dark (#111827) bar with white icons — the one dark element
- Speed is the UX principle — three taps max from open to RSVP
- Full design spec: @docs/DESIGN.md

## Supabase
- Project is already set up
- Tables: users, crews, crew_members, events, rsvps, shares
- Use Supabase client from src/lib/supabase.ts
- Auth: phone number + OTP (no email, no social login)
- Enable Row Level Security on all tables
- Use PostGIS for location-based event queries

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
- Always use Expo SDK modules over bare React Native packages
- Always commit to feature branches, never directly to main
- Test on physical iPhone via Expo Go before committing
