import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Crew } from '../types/database';

export const useCrews = () => {
  const { user } = useAuth();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [userCrewIds, setUserCrewIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setError(null);
    const crewsPromise = supabase
      .from('crews')
      .select('*')
      .order('member_count', { ascending: false });

    const membershipsPromise = user
      ? supabase.from('crew_members').select('crew_id').eq('user_id', user.id)
      : Promise.resolve({ data: [], error: null });

    const [{ data: crewsData, error: crewsErr }, membershipsRes] = await Promise.all([
      crewsPromise,
      membershipsPromise,
    ]);

    if (crewsErr) setError(crewsErr.message);
    setCrews((crewsData ?? []) as Crew[]);
    setUserCrewIds(
      ((membershipsRes.data ?? []) as { crew_id: string }[]).map((m) => m.crew_id),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { crews, userCrewIds, loading, error, refetch: fetch };
};
