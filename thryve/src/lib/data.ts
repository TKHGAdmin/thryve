import type { CategoryId } from './theme';

export type Relation = 'mutual' | 'follow' | 'follower';

export type Person = {
  name: string;
  hue: number;
  rel: Relation;
  verified: boolean;
};

export const PEOPLE: Record<string, Person> = {
  'maya.k':      { name: 'Maya K.',  hue: 12,  rel: 'mutual',   verified: false },
  'devontrains': { name: 'Devon',    hue: 200, rel: 'mutual',   verified: false },
  'riley_':      { name: 'Riley',    hue: 320, rel: 'mutual',   verified: true  },
  'sam.runs':    { name: 'Sam',      hue: 130, rel: 'mutual',   verified: false },
  'jordannn':    { name: 'Jordan',   hue: 90,  rel: 'mutual',   verified: false },
  'alex.flo':    { name: 'Alex',     hue: 270, rel: 'follow',   verified: false },
  'tay.h':       { name: 'Tay',      hue: 30,  rel: 'follow',   verified: false },
  'priyaa':      { name: 'Priya',    hue: 240, rel: 'follow',   verified: false },
  'mike.cold':   { name: 'Mike',     hue: 160, rel: 'follower', verified: false },
  'lena.b':      { name: 'Lena',     hue: 350, rel: 'follower', verified: false },
  'jess.run':    { name: 'Jess',     hue: 50,  rel: 'mutual',   verified: false },
  'kai.r':       { name: 'Kai',      hue: 180, rel: 'follow',   verified: true  },
};

export type EventItem = {
  id: string;
  title: string;
  crew: string;
  verified: boolean;
  cat: CategoryId;
  when: string;
  startsIn: number;
  durationMin: number;
  live: boolean;
  venue: string;
  neighborhood: string;
  distance: string;
  lat: number;
  lng: number;
  price: number;
  total: number;
  cap: number;
  going: string[];
  tags: string[];
  urgent?: string;
  hostHandle: string;
  hostFollowers: number;
  desc: string;
  vybe: string;
  repeats: string;
};

export const EVENTS: EventItem[] = [
  {
    id: 'e1', title: 'Ice Bath & Coffee', crew: 'Cold Plunge CHS', verified: true, cat: 'cold',
    when: 'Today, 7:00 AM', startsIn: 2 * 60, durationMin: 90, live: true,
    venue: 'Waterfront Park', neighborhood: 'Downtown', distance: '0.6 mi',
    lat: 32.7765, lng: -79.9263,
    price: 0, total: 24, cap: 32,
    going: ['maya.k', 'devontrains', 'riley_', 'jess.run', 'mike.cold'],
    tags: ['plunge', 'sunrise', 'coffee'],
    hostHandle: '@coldplungechs', hostFollowers: 4823,
    desc: 'Plunge into the harbor at sunrise, then warm up with single-origin pour-overs from our mobile cart. First-timers welcome — we have extra towels.',
    vybe: 'Pre-dawn harbor. 38°F water. Hot espresso. Strangers fast-becoming friends.',
    repeats: 'Every Sat & Sun · 8 mo running',
  },
  {
    id: 'e2', title: 'Saturday Morning 5K', crew: 'Charleston Run Club', verified: true, cat: 'run',
    when: 'Tomorrow, 6:30 AM', startsIn: 22 * 60, durationMin: 60, live: false,
    venue: 'Hampton Park', neighborhood: 'Westside', distance: '1.2 mi',
    lat: 32.7989, lng: -79.9569,
    price: 0, total: 67, cap: 200,
    going: ['sam.runs', 'jordannn', 'alex.flo', 'tay.h', 'priyaa', 'jess.run', 'kai.r'],
    tags: ['5k', 'all paces'],
    hostHandle: '@charlestonrunclub', hostFollowers: 12100,
    desc: '5k loop around Hampton Park. Pace groups: 7:00, 8:30, 10:00. Coffee at Second State after — first round on the captain.',
    vybe: 'Loud hugs at sunrise. Pace groups for everyone. Coffee that becomes brunch.',
    repeats: 'Every Sat · 4 yrs running',
  },
  {
    id: 'e3', title: 'Full Moon Breathwork Circle', crew: 'Breathe CHS', verified: false, cat: 'breath',
    when: 'Sat May 10, 8:00 PM', startsIn: 4 * 24 * 60, durationMin: 75, live: false,
    venue: 'White Point Garden', neighborhood: 'South of Broad', distance: '2.1 mi',
    lat: 32.7700, lng: -79.9300,
    price: 15, total: 18, cap: 30,
    going: ['maya.k', 'lena.b'],
    tags: ['holotropic', 'full moon'],
    urgent: '12 spots left',
    hostHandle: '@breathechs', hostFollowers: 1840,
    desc: 'Guided 9-round holotropic breathwork under the full moon. Bring a mat and an open mind.',
    vybe: 'Lavender mist. 9 rounds. Tears, laughter, the whole catalog.',
    repeats: 'Monthly · full-moon synced',
  },
  {
    id: 'e4', title: 'SWEAT Fest Charleston 2026', crew: 'SWEAT Festival', verified: true, cat: 'fest',
    when: 'Jun 14–15', startsIn: 6 * 7 * 24 * 60, durationMin: 2 * 24 * 60, live: false,
    venue: 'Riverfront Park', neighborhood: 'North Charleston', distance: '6.4 mi',
    lat: 32.8771, lng: -79.9706,
    price: 45, total: 312, cap: 1500,
    going: ['maya.k', 'devontrains', 'riley_', 'sam.runs', 'jordannn', 'alex.flo', 'tay.h', 'priyaa', 'kai.r', 'lena.b'],
    tags: ['festival', 'two-day'],
    urgent: 'Early bird ends soon',
    hostHandle: '@sweatfest', hostFollowers: 24300,
    desc: 'Two days of yoga, ice baths, sound healing, lifting, run clubs, and 80+ wellness vendors on the Cooper River.',
    vybe: '40 stages. 80 vendors. Last year: 2k people, sold out, weather perfect.',
    repeats: 'Annual · 4th edition',
  },
  {
    id: 'e5', title: 'Sunrise Flow + Sound Bath', crew: 'Lowcountry Yoga Co', verified: false, cat: 'yoga',
    when: 'Sun May 11, 6:45 AM', startsIn: 3 * 24 * 60, durationMin: 80, live: false,
    venue: 'Folly Beach', neighborhood: 'Folly', distance: '11 mi',
    lat: 32.6553, lng: -79.9405,
    price: 10, total: 15, cap: 35,
    going: ['lena.b', 'mike.cold'],
    tags: ['vinyasa', 'sound bath', 'beach'],
    hostHandle: '@lowcountryyogaco', hostFollowers: 920,
    desc: '60-min vinyasa as the sun comes up over the Atlantic, then a 20-min crystal bowl sound bath in the sand.',
    vybe: 'Sun cresting the ocean. Warm flow. Crystal bowls under blankets.',
    repeats: 'Every Sun · 1 yr running',
  },
  {
    id: 'e6', title: 'Coffee & Cold Plunge Social', crew: 'Cold Plunge CHS', verified: true, cat: 'social',
    when: 'Next Fri, 7:30 AM', startsIn: 7 * 24 * 60, durationMin: 120, live: false,
    venue: 'Second State Coffee', neighborhood: 'King Street', distance: '0.9 mi',
    lat: 32.7892, lng: -79.9405,
    price: 0, total: 9, cap: 20,
    going: ['maya.k', 'devontrains', 'jess.run'],
    tags: ['plunge', 'coffee', 'no pressure'],
    urgent: 'Just dropped',
    hostHandle: '@coldplungechs', hostFollowers: 4823,
    desc: 'Casual hang. Plunge tubs out front, oat milk lattes inside. Stop by 7:30–9:30.',
    vybe: 'Tubs on the patio. Lattes inside. No agenda, no pressure.',
    repeats: 'Every other Fri · 6 mo running',
  },
];

export type Walkup = {
  id: string;
  title: string;
  crew: string;
  cat: CategoryId;
  droppedAgo: number;
  here: number;
  capacity: number;
  walkupVenue: string;
  distance: string;
};

export const WALKUP: Walkup = {
  id: 'w1',
  title: 'Pop-up plunge · live now',
  crew: 'Cold Plunge CHS',
  cat: 'cold',
  droppedAgo: 12,
  here: 7,
  capacity: 15,
  walkupVenue: 'Brittlebank Park',
  distance: '0.4 mi',
};

export const partitionGoing = (handles: string[]) => {
  const mutual: string[] = [];
  const follow: string[] = [];
  const follower: string[] = [];
  const stranger: string[] = [];
  handles.forEach((h) => {
    const p = PEOPLE[h];
    if (!p) return stranger.push(h);
    if (p.rel === 'mutual') mutual.push(h);
    else if (p.rel === 'follow') follow.push(h);
    else if (p.rel === 'follower') follower.push(h);
  });
  const youKnow = [...mutual, ...follow, ...follower];
  return { mutual, follow, follower, stranger, youKnow, network: youKnow.length };
};

export const trybeBanner = (handles: string[]):
  | { kind: 'hot' | 'warm' | 'soft'; text: string }
  | null => {
  const part = partitionGoing(handles);
  if (part.mutual.length >= 3) return { kind: 'hot', text: `${part.mutual.length} mutuals going` };
  if (part.network >= 3) return { kind: 'warm', text: `${part.network} from your IG going` };
  if (part.network >= 1) return { kind: 'soft', text: `${part.network} you follow going` };
  return null;
};

export const fmtTrybe = (handles: string[], total: number): string => {
  const part = partitionGoing(handles);
  const known = part.youKnow;
  if (known.length === 0) return `${total} going`;
  const first = PEOPLE[known[0]]?.name?.split(' ')[0] ?? known[0];
  if (known.length === 1) return `${first} + ${total - 1} going`;
  const second = PEOPLE[known[1]]?.name?.split(' ')[0] ?? known[1];
  if (known.length === 2) return `${first}, ${second} + ${total - 2} going`;
  return `${first}, ${second} +${known.length - 2} you follow · ${total} going`;
};
