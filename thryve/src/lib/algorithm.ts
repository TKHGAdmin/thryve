// Pure scoring + partitioning logic for the Discover feed.
// No React, no Supabase, no I/O. Easy to unit-test.

export interface ScoringInput {
  event: {
    id: string;
    category: string;
    date_time: string;
    latitude: number;
    longitude: number;
    going_count: number;
    spots_remaining: number | null;
    capacity: number | null;
    created_at: string;
    crew_id: string | null;
    is_free: boolean;
    urgency_type: string | null;
    crew_verified: boolean;
  };
  user: {
    interests: string[];
    crew_ids: string[];
    latitude: number | null;
    longitude: number | null;
    rsvp_count: number;
  };
  context: {
    max_going_count: number;
    crew_member_rsvps: string[];
  };
}

export type FeedSection =
  | 'happening_now'
  | 'for_you'
  | 'popular'
  | 'just_dropped'
  | 'explore';

export interface ScoredEvent {
  event_id: string;
  score: number;
  signals: {
    time: number;
    interest: number;
    social: number;
    distance: number;
    popularity: number;
  };
  boosts: {
    freshness: boolean;
    scarcity: boolean;
    crew_pin: boolean;
  };
  section: FeedSection;
}

const HOUR_MS = 60 * 60 * 1000;
const COLD_START_THRESHOLD = 3;
const FRESHNESS_WINDOW_HOURS = 2;
const HAPPENING_NOW_WINDOW_HOURS = 3;
const SCARCITY_RATIO = 0.2;

export const haversineDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
};

const timeScore = (hoursUntil: number): number => {
  if (hoursUntil < 0) return 0;
  return Math.max(0.1, Math.exp((-0.15 * hoursUntil) / 24));
};

const interestScore = (userInterests: string[], category: string): number =>
  userInterests.includes(category) ? 1.0 : 0.2;

const socialScore = (input: ScoringInput): number => {
  const { event, user, context } = input;
  if (!event.crew_id) return 0;
  let s = 0;
  if (user.crew_ids.includes(event.crew_id)) s += 0.4;
  if (context.crew_member_rsvps.includes(event.id)) s += 0.3;
  if (event.crew_verified) s += 0.1;
  return Math.min(1.0, s);
};

const distanceScore = (input: ScoringInput): { score: number; miles: number | null } => {
  const { event, user } = input;
  if (user.latitude == null || user.longitude == null) {
    return { score: 0.5, miles: null };
  }
  const miles = haversineDistance(
    user.latitude,
    user.longitude,
    event.latitude,
    event.longitude,
  );
  return { score: Math.max(0.1, 1.0 - miles * 0.1), miles };
};

const popularityScore = (going: number, max: number): number =>
  max > 0 ? going / max : 0.5;

export const scoreEvents = (inputs: ScoringInput[]): ScoredEvent[] => {
  const now = Date.now();
  return inputs
    .filter((i) => new Date(i.event.date_time).getTime() > now)
    .map((input) => {
      const { event, user } = input;
      const eventStart = new Date(event.date_time).getTime();
      const hoursUntil = (eventStart - now) / HOUR_MS;
      const ageHours = (now - new Date(event.created_at).getTime()) / HOUR_MS;

      const time = timeScore(hoursUntil);
      const interest = interestScore(user.interests, event.category);
      const social = socialScore(input);
      const dist = distanceScore(input);
      const popularity = popularityScore(event.going_count, input.context.max_going_count);

      const isColdStart = user.rsvp_count < COLD_START_THRESHOLD;

      let score = isColdStart
        ? time * 0.30 + interest * 0.40 + dist.score * 0.15 + popularity * 0.15
        : time * 0.30 + interest * 0.25 + social * 0.20 + dist.score * 0.15 + popularity * 0.10;

      const interestMatch = user.interests.includes(event.category);
      const freshness = ageHours <= FRESHNESS_WINDOW_HOURS && interestMatch;
      const scarcity =
        event.spots_remaining != null &&
        event.capacity != null &&
        event.capacity > 0 &&
        event.spots_remaining / event.capacity < SCARCITY_RATIO;
      const crewPin = !!event.crew_id && user.crew_ids.includes(event.crew_id);

      if (freshness) score += 0.15;
      if (scarcity) score += 0.10;

      let section: FeedSection;
      if (hoursUntil <= HAPPENING_NOW_WINDOW_HOURS) section = 'happening_now';
      else if (freshness) section = 'just_dropped';
      else section = 'for_you';

      return {
        event_id: event.id,
        score,
        signals: {
          time,
          interest,
          social,
          distance: dist.score,
          popularity,
        },
        boosts: { freshness, scarcity, crew_pin: crewPin },
        section,
      };
    });
};

export interface PartitionedFeed {
  happeningNow: ScoredEvent[];
  forYou: ScoredEvent[];
  popular: ScoredEvent[];
  justDropped: ScoredEvent[];
  explore: ScoredEvent[];
}

const POPULAR_LIMIT = 5;

export const partitionFeed = (
  scored: ScoredEvent[],
  events: ScoringInput[],
): PartitionedFeed => {
  const happeningNow = scored
    .filter((s) => s.section === 'happening_now')
    .sort((a, b) => {
      const ai = events.find((e) => e.event.id === a.event_id)!;
      const bi = events.find((e) => e.event.id === b.event_id)!;
      return new Date(ai.event.date_time).getTime() - new Date(bi.event.date_time).getTime();
    });

  const justDropped = scored
    .filter((s) => s.section === 'just_dropped')
    .sort((a, b) => b.score - a.score);

  const popularPool = [...scored]
    .filter((s) => s.section !== 'happening_now')
    .sort((a, b) => {
      const ai = events.find((e) => e.event.id === a.event_id)!;
      const bi = events.find((e) => e.event.id === b.event_id)!;
      return bi.event.going_count - ai.event.going_count;
    })
    .slice(0, POPULAR_LIMIT);
  const popularIds = new Set(popularPool.map((s) => s.event_id));

  const forYouPool = scored
    .filter((s) => s.section === 'for_you' && !popularIds.has(s.event_id))
    .sort((a, b) => {
      if (a.boosts.crew_pin !== b.boosts.crew_pin) return a.boosts.crew_pin ? -1 : 1;
      return b.score - a.score;
    });

  // Top half goes to "for_you" surface; the long tail spills into "explore".
  const FOR_YOU_LIMIT = 10;
  const forYou = forYouPool.slice(0, FOR_YOU_LIMIT);
  const explore = forYouPool.slice(FOR_YOU_LIMIT);

  return { happeningNow, forYou, popular: popularPool, justDropped, explore };
};
