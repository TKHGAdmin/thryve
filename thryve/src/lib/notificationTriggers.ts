// Client-side trigger logic. Server-side push fan-out comes later;
// for now we use this to decide which "Just dropped" events would warrant a push.

import { haversineDistance } from './algorithm';

type EventLike = {
  category: string;
  crew_id: string | null;
  latitude: number;
  longitude: number;
};

const MULTI_INTEREST_THRESHOLD = 2;
const NEARBY_RADIUS_MILES = 3;

export const shouldNotifyNewEvent = (
  event: EventLike,
  userInterests: string[],
  userCrewIds: string[],
  userLat: number | null = null,
  userLng: number | null = null,
  eventTags: string[] = [],
): boolean => {
  if (event.crew_id && userCrewIds.includes(event.crew_id)) return true;

  const interestSignals = new Set<string>();
  if (userInterests.includes(event.category)) interestSignals.add(event.category);
  for (const tag of eventTags) {
    if (userInterests.includes(tag)) interestSignals.add(tag);
  }
  if (interestSignals.size < MULTI_INTEREST_THRESHOLD) return false;

  if (userLat == null || userLng == null) return false;
  const miles = haversineDistance(userLat, userLng, event.latitude, event.longitude);
  return miles <= NEARBY_RADIUS_MILES;
};
