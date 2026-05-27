import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Event, Crew } from '../types/database';

export type EventWithCrew = Event & {
  crews: Pick<Crew, 'id' | 'name' | 'handle' | 'verified' | 'avatar_url'> | null;
};

export const useEvents = () => {
  const [events, setEvents] = useState<EventWithCrew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setError(null);
    const { data, error: err } = await supabase
      .from('events')
      .select('*, crews(id, name, handle, verified, avatar_url)')
      .eq('status', 'active')
      .gt('date_time', new Date().toISOString())
      .order('date_time', { ascending: true });
    if (err) {
      setError(err.message);
      setEvents([]);
    } else {
      setEvents((data ?? []) as unknown as EventWithCrew[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
    const channel = supabase
      .channel('events-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          fetch();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetch]);

  return { events, loading, error, refetch: fetch };
};
