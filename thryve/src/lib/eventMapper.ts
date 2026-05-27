// Adapts a Supabase events row (with joined crew) to the legacy EventItem shape
// the existing UI components (EventCard, HeroCard, TodayTimeline) consume.
// Cards stay untouched; only the data shape is translated.

import { fmtCountdown, type CategoryId } from './theme';
import type { EventItem } from './data';
import type { EventWithCrew } from '../hooks/useEvents';
import { haversineDistance } from './algorithm';

const VALID_CATS: ReadonlyArray<CategoryId> = [
  'cold', 'run', 'breath', 'fest', 'yoga', 'social', 'hike', 'pkl', 'sauna',
];

const toCat = (raw: string): CategoryId =>
  (VALID_CATS as readonly string[]).includes(raw) ? (raw as CategoryId) : 'social';

const fmtWhen = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
  const sameTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (sameDay) return `Today, ${time}`;
  if (sameTomorrow) return `Tomorrow, ${time}`;
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${day}, ${time}`;
};

const fmtDistance = (
  userLat: number | null,
  userLng: number | null,
  evLat: number,
  evLng: number,
): string => {
  if (userLat == null || userLng == null) return '—';
  const mi = haversineDistance(userLat, userLng, evLat, evLng);
  return mi < 0.1 ? '<0.1 mi' : `${mi.toFixed(1)} mi`;
};

const urgentLabel = (e: EventWithCrew, scarcity: boolean): string | undefined => {
  if (e.urgency_type === 'just_dropped') return 'Just dropped';
  if (e.urgency_type === 'early_bird') return 'Early bird ends soon';
  if (scarcity && e.spots_remaining != null) return `${e.spots_remaining} spots left`;
  if (e.urgency_type === 'almost_full' && e.spots_remaining != null) {
    return `${e.spots_remaining} spots left`;
  }
  return undefined;
};

export const toEventItem = (
  e: EventWithCrew,
  opts: {
    userLat: number | null;
    userLng: number | null;
    scarcity?: boolean;
    freshness?: boolean;
  },
): EventItem => {
  const start = new Date(e.date_time).getTime();
  const end = e.end_time ? new Date(e.end_time).getTime() : start + 60 * 60 * 1000;
  const startsIn = Math.max(0, Math.round((start - Date.now()) / 60000));
  const durationMin = Math.max(0, Math.round((end - start) / 60000));
  const urgent =
    opts.freshness ? 'Just dropped' : urgentLabel(e, opts.scarcity ?? false);

  return {
    id: e.id,
    title: e.title,
    crew: e.crews?.name ?? 'Solo host',
    verified: e.crews?.verified ?? false,
    cat: toCat(e.category),
    when: fmtWhen(e.date_time),
    startsIn,
    durationMin,
    live: e.urgency_type === 'live' || startsIn <= 30,
    venue: e.location_name,
    neighborhood: e.location_name,
    distance: fmtDistance(opts.userLat, opts.userLng, e.latitude, e.longitude),
    lat: e.latitude,
    lng: e.longitude,
    price: Number(e.price ?? 0),
    total: e.going_count ?? 0,
    cap: e.capacity ?? (e.going_count ?? 0),
    going: [],
    tags: e.tags ?? [],
    urgent,
    hostHandle: e.crews?.handle ? `@${e.crews.handle}` : '',
    hostFollowers: 0,
    desc: e.description ?? '',
    vybe: '',
    repeats: '',
  };
};

// Used in TodayTimeline-like horizontal cards. Reuses fmtCountdown for nicer "starts in" labels.
export const formatStartsIn = (iso: string): string => {
  const mins = Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 60000));
  return fmtCountdown(mins);
};
