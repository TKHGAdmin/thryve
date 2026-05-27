import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useEvents, type EventWithCrew } from './useEvents';
import { useCrews } from './useCrews';
import { useLocation } from './useLocation';
import {
  partitionFeed,
  scoreEvents,
  type PartitionedFeed,
  type ScoringInput,
} from '../lib/algorithm';

export type FeedResult = PartitionedFeed & {
  events: EventWithCrew[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useFeed = (): FeedResult => {
  const { user, profile } = useAuth();
  const { events, loading: eventsLoading, error, refetch } = useEvents();
  const { userCrewIds, loading: crewsLoading } = useCrews();
  const { latitude, longitude } = useLocation();

  const [crewMemberRsvps, setCrewMemberRsvps] = useState<string[]>([]);
  const [userRsvpCount, setUserRsvpCount] = useState(0);

  // Pull RSVP context: which events have a fellow crew member already RSVP'd to,
  // and how many total RSVPs the current user has (cold-start signal).
  useEffect(() => {
    if (!user) {
      setCrewMemberRsvps([]);
      setUserRsvpCount(0);
      return;
    }
    let cancelled = false;
    (async () => {
      const ownRsvps = supabase
        .from('rsvps')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const fellowMembers =
        userCrewIds.length > 0
          ? supabase
              .from('crew_members')
              .select('user_id')
              .in('crew_id', userCrewIds)
              .neq('user_id', user.id)
          : Promise.resolve({ data: [] as { user_id: string }[], error: null });

      const [{ count }, { data: members }] = await Promise.all([
        ownRsvps,
        fellowMembers,
      ]);
      if (cancelled) return;
      setUserRsvpCount(count ?? 0);

      const memberIds = (members ?? []).map((m) => m.user_id);
      if (memberIds.length === 0) {
        setCrewMemberRsvps([]);
        return;
      }
      const { data: rsvpRows } = await supabase
        .from('rsvps')
        .select('event_id')
        .in('user_id', memberIds);
      if (cancelled) return;
      const ids = Array.from(new Set((rsvpRows ?? []).map((r) => r.event_id)));
      setCrewMemberRsvps(ids);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, userCrewIds]);

  const partitioned = useMemo<PartitionedFeed>(() => {
    if (events.length === 0) {
      return {
        happeningNow: [],
        forYou: [],
        popular: [],
        justDropped: [],
        explore: [],
      };
    }
    const maxGoing = events.reduce((m, e) => Math.max(m, e.going_count ?? 0), 0);
    const inputs: ScoringInput[] = events.map((e) => ({
      event: {
        id: e.id,
        category: e.category,
        date_time: e.date_time,
        latitude: e.latitude,
        longitude: e.longitude,
        going_count: e.going_count ?? 0,
        spots_remaining: e.spots_remaining,
        capacity: e.capacity,
        created_at: e.created_at,
        crew_id: e.crew_id,
        is_free: e.is_free,
        urgency_type: e.urgency_type,
        crew_verified: e.crews?.verified ?? false,
      },
      user: {
        interests: profile?.interests ?? [],
        crew_ids: userCrewIds,
        latitude,
        longitude,
        rsvp_count: userRsvpCount,
      },
      context: {
        max_going_count: maxGoing,
        crew_member_rsvps: crewMemberRsvps,
      },
    }));
    const scored = scoreEvents(inputs);
    return partitionFeed(scored, inputs);
  }, [
    events,
    profile?.interests,
    userCrewIds,
    latitude,
    longitude,
    userRsvpCount,
    crewMemberRsvps,
  ]);

  return {
    ...partitioned,
    events,
    loading: eventsLoading || crewsLoading,
    error,
    refetch,
  };
};
