import { useAuth } from './useAuth';

export const useProfile = () => {
  const { profile, loading, refetchProfile } = useAuth();
  return { profile, loading, refetch: refetchProfile };
};
