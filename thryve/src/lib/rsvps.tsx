import { createContext, useContext, useState, type ReactNode } from 'react';

type RsvpState = Record<string, boolean>;

type Ctx = {
  rsvps: RsvpState;
  toggle: (id: string) => void;
  isGoing: (id: string) => boolean;
  count: number;
};

const RsvpContext = createContext<Ctx | null>(null);

export const RsvpProvider = ({ children }: { children: ReactNode }) => {
  const [rsvps, setRsvps] = useState<RsvpState>({});
  const toggle = (id: string) => setRsvps((r) => ({ ...r, [id]: !r[id] }));
  const isGoing = (id: string) => !!rsvps[id];
  const count = Object.values(rsvps).filter(Boolean).length;
  return (
    <RsvpContext.Provider value={{ rsvps, toggle, isGoing, count }}>
      {children}
    </RsvpContext.Provider>
  );
};

export const useRsvps = (): Ctx => {
  const ctx = useContext(RsvpContext);
  if (!ctx) throw new Error('useRsvps must be used inside RsvpProvider');
  return ctx;
};
