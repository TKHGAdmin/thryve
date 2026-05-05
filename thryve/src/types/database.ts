// Hand-written types matching the schema in supabase/migrations/001_initial_schema.sql.
// Regenerate via `supabase gen types typescript` once the project is linked.

export type EventStatus = 'active' | 'draft' | 'cancelled' | 'completed';
export type UrgencyType = 'live' | 'soon' | 'just_dropped' | 'early_bird' | 'almost_full';
export type RsvpStatus = 'confirmed' | 'day_confirmed' | 'unconfirmed' | 'waitlisted' | 'cancelled';
export type CrewRole = 'admin' | 'member';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export type User = {
  id: string;
  phone: string;
  name: string | null;
  avatar_url: string | null;
  ig_handle: string | null;
  ig_linked: boolean;
  city: string | null;
  interests: string[] | null;
  push_token: string | null;
  events_attended_count: number;
  created_at: string;
  updated_at: string;
};

export type Crew = {
  id: string;
  name: string;
  handle: string;
  category: string;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  verified: boolean;
  member_count: number;
  created_by: string | null;
  created_at: string;
};

export type CrewMember = {
  id: string;
  crew_id: string;
  user_id: string;
  role: CrewRole;
  joined_at: string;
};

export type Event = {
  id: string;
  crew_id: string | null;
  created_by: string;
  title: string;
  description: string | null;
  category: string;
  location_name: string;
  latitude: number;
  longitude: number;
  /** PostGIS geography(POINT,4326). WKB hex from PostgREST; treat as opaque from JS. */
  location_point: string | null;
  date_time: string;
  end_time: string | null;
  price: number;
  is_free: boolean;
  capacity: number | null;
  spots_remaining: number | null;
  going_count: number;
  tags: string[] | null;
  status: EventStatus;
  urgency_type: UrgencyType | null;
  created_at: string;
  updated_at: string;
};

export type EventPhoto = {
  id: string;
  event_id: string;
  photo_url: string;
  sort_order: number;
  created_at: string;
};

export type Rsvp = {
  id: string;
  event_id: string;
  user_id: string;
  status: RsvpStatus;
  confirmed_at: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};

export type Share = {
  id: string;
  event_id: string;
  shared_by: string;
  created_at: string;
};

export type Checkin = {
  id: string;
  event_id: string;
  user_id: string;
  latitude: number | null;
  longitude: number | null;
  checked_in_at: string;
};

export type Report = {
  id: string;
  event_id: string;
  reported_by: string;
  reason: string | null;
  status: ReportStatus;
  created_at: string;
};

// Insert/Update helpers — PK + DB-defaulted columns become optional.
type Defaulted = 'id' | 'created_at' | 'updated_at' | 'joined_at' | 'checked_in_at';
export type Insert<T> = Omit<T, Defaulted & keyof T> & Partial<Pick<T, Extract<Defaulted, keyof T>>>;
export type Update<T> = Partial<T>;

// supabase-js generic. Minimal shape — extend as needed.
export type Database = {
  public: {
    Tables: {
      users:        { Row: User;        Insert: Insert<User>;        Update: Update<User> };
      crews:        { Row: Crew;        Insert: Insert<Crew>;        Update: Update<Crew> };
      crew_members: { Row: CrewMember;  Insert: Insert<CrewMember>;  Update: Update<CrewMember> };
      events:       { Row: Event;       Insert: Insert<Event>;       Update: Update<Event> };
      event_photos: { Row: EventPhoto;  Insert: Insert<EventPhoto>;  Update: Update<EventPhoto> };
      rsvps:        { Row: Rsvp;        Insert: Insert<Rsvp>;        Update: Update<Rsvp> };
      shares:       { Row: Share;       Insert: Insert<Share>;       Update: Update<Share> };
      checkins:     { Row: Checkin;     Insert: Insert<Checkin>;     Update: Update<Checkin> };
      reports:      { Row: Report;      Insert: Insert<Report>;      Update: Update<Report> };
    };
    Functions: {
      nearby_events: {
        Args: { user_lat: number; user_lng: number; radius_miles?: number };
        Returns: Event[];
      };
    };
  };
};
