import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  loading: boolean;
  error: string | null;
  granted: boolean;
};

let cached: LocationState | null = null;

export const useLocation = (): LocationState => {
  const [state, setState] = useState<LocationState>(
    cached ?? {
      latitude: null,
      longitude: null,
      city: null,
      loading: true,
      error: null,
      granted: false,
    },
  );

  useEffect(() => {
    if (cached) return;
    let mounted = true;
    (async () => {
      try {
        const perm = await Location.getForegroundPermissionsAsync();
        if (!perm.granted) {
          const next: LocationState = {
            latitude: null,
            longitude: null,
            city: null,
            loading: false,
            error: null,
            granted: false,
          };
          cached = next;
          if (mounted) setState(next);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        let cityName: string | null = null;
        try {
          const [addr] = await Location.reverseGeocodeAsync({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          cityName = addr?.city ?? addr?.subregion ?? null;
        } catch {
          // ignore — geocoding can fail offline
        }
        const next: LocationState = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: cityName,
          loading: false,
          error: null,
          granted: true,
        };
        cached = next;
        if (mounted) setState(next);
      } catch (e) {
        const next: LocationState = {
          latitude: null,
          longitude: null,
          city: null,
          loading: false,
          error: e instanceof Error ? e.message : 'location error',
          granted: false,
        };
        cached = next;
        if (mounted) setState(next);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return state;
};
