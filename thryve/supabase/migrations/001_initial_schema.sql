-- ─────────────────────────────────────────────────────────────────────────────
-- Thryve — initial schema
-- Run this in the Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists postgis;
create extension if not exists "pgcrypto";

-- ─────────────────── tables ───────────────────

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  avatar_url text,
  ig_handle text,
  ig_linked boolean default false,
  city text,
  interests text[],
  push_token text,
  events_attended_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists crews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  handle text unique not null,
  category text not null,
  bio text,
  avatar_url text,
  banner_url text,
  verified boolean default false,
  member_count integer default 0,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists crew_members (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid references crews(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role text default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz default now(),
  unique (crew_id, user_id)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid references crews(id) on delete set null,
  created_by uuid not null references users(id),
  title text not null,
  description text,
  category text not null,
  location_name text not null,
  latitude double precision not null,
  longitude double precision not null,
  location_point geography(point, 4326),
  date_time timestamptz not null,
  end_time timestamptz,
  price decimal(10,2) default 0,
  is_free boolean default true,
  capacity integer,
  spots_remaining integer,
  going_count integer default 0,
  tags text[],
  status text default 'active' check (status in ('active', 'draft', 'cancelled', 'completed')),
  urgency_type text check (urgency_type in ('live', 'soon', 'just_dropped', 'early_bird', 'almost_full')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists event_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  photo_url text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  status text default 'confirmed' check (status in ('confirmed', 'day_confirmed', 'unconfirmed', 'waitlisted', 'cancelled')),
  confirmed_at timestamptz,
  checked_in boolean default false,
  checked_in_at timestamptz,
  created_at timestamptz default now(),
  unique (event_id, user_id)
);

create table if not exists shares (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  shared_by uuid references users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  latitude double precision,
  longitude double precision,
  checked_in_at timestamptz default now(),
  unique (event_id, user_id)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  reported_by uuid references users(id) on delete cascade,
  reason text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz default now()
);

-- ─────────────────── triggers ───────────────────

create or replace function update_location_point()
returns trigger as $$
begin
  new.location_point = st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_location_point on events;
create trigger set_location_point
before insert or update on events
for each row execute function update_location_point();

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on users;
create trigger users_updated_at
before update on users
for each row execute function set_updated_at();

drop trigger if exists events_updated_at on events;
create trigger events_updated_at
before update on events
for each row execute function set_updated_at();

-- ─────────────────── nearby_events ───────────────────

create or replace function nearby_events(
  user_lat double precision,
  user_lng double precision,
  radius_miles double precision default 10
)
returns setof events as $$
  select *
  from events
  where status = 'active'
    and date_time > now()
    and st_dwithin(
      location_point,
      st_setsrid(st_makepoint(user_lng, user_lat), 4326)::geography,
      radius_miles * 1609.34
    )
  order by date_time asc;
$$ language sql;

-- ─────────────────── indexes ───────────────────

create index if not exists events_date_time_idx     on events (date_time);
create index if not exists events_category_idx      on events (category);
create index if not exists events_crew_id_idx       on events (crew_id);
create index if not exists events_created_by_idx    on events (created_by);
create index if not exists events_status_idx        on events (status);
create index if not exists events_location_gix      on events using gist (location_point);

create index if not exists rsvps_event_id_idx       on rsvps (event_id);
create index if not exists rsvps_user_id_idx        on rsvps (user_id);

create index if not exists crew_members_crew_id_idx on crew_members (crew_id);
create index if not exists crew_members_user_id_idx on crew_members (user_id);

create index if not exists checkins_event_id_idx    on checkins (event_id);

-- ─────────────────── row level security ───────────────────
-- Note: public.users.id is expected to equal auth.uid() — set users.id = auth.uid()
-- when inserting the profile row after phone-OTP signup.

alter table users         enable row level security;
alter table crews         enable row level security;
alter table crew_members  enable row level security;
alter table events        enable row level security;
alter table event_photos  enable row level security;
alter table rsvps         enable row level security;
alter table shares        enable row level security;
alter table checkins      enable row level security;
alter table reports       enable row level security;

-- users
drop policy if exists users_select_all       on users;
drop policy if exists users_insert_self      on users;
drop policy if exists users_update_self      on users;
create policy users_select_all   on users for select using (true);
create policy users_insert_self  on users for insert with check (auth.uid() = id);
create policy users_update_self  on users for update using (auth.uid() = id) with check (auth.uid() = id);

-- crews
drop policy if exists crews_select_all       on crews;
drop policy if exists crews_insert_creator   on crews;
drop policy if exists crews_update_creator   on crews;
drop policy if exists crews_delete_creator   on crews;
create policy crews_select_all     on crews for select using (true);
create policy crews_insert_creator on crews for insert with check (auth.uid() = created_by);
create policy crews_update_creator on crews for update using (auth.uid() = created_by) with check (auth.uid() = created_by);
create policy crews_delete_creator on crews for delete using (auth.uid() = created_by);

-- crew_members
drop policy if exists crew_members_select_all   on crew_members;
drop policy if exists crew_members_insert_self  on crew_members;
drop policy if exists crew_members_delete_self  on crew_members;
drop policy if exists crew_members_admin_manage on crew_members;
create policy crew_members_select_all   on crew_members for select using (true);
create policy crew_members_insert_self  on crew_members for insert with check (auth.uid() = user_id);
create policy crew_members_delete_self  on crew_members for delete using (auth.uid() = user_id);
create policy crew_members_admin_manage on crew_members for all
  using (
    exists (
      select 1 from crew_members admin
      where admin.crew_id = crew_members.crew_id
        and admin.user_id = auth.uid()
        and admin.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from crew_members admin
      where admin.crew_id = crew_members.crew_id
        and admin.user_id = auth.uid()
        and admin.role = 'admin'
    )
  );

-- events
drop policy if exists events_select_active   on events;
drop policy if exists events_insert_creator  on events;
drop policy if exists events_update_creator  on events;
drop policy if exists events_delete_creator  on events;
create policy events_select_active  on events for select using (status = 'active' or auth.uid() = created_by);
create policy events_insert_creator on events for insert with check (auth.uid() = created_by);
create policy events_update_creator on events for update using (auth.uid() = created_by) with check (auth.uid() = created_by);
create policy events_delete_creator on events for delete using (auth.uid() = created_by);

-- event_photos
drop policy if exists event_photos_select_all      on event_photos;
drop policy if exists event_photos_insert_creator  on event_photos;
drop policy if exists event_photos_delete_creator  on event_photos;
create policy event_photos_select_all     on event_photos for select using (true);
create policy event_photos_insert_creator on event_photos for insert with check (
  exists (select 1 from events e where e.id = event_photos.event_id and e.created_by = auth.uid())
);
create policy event_photos_delete_creator on event_photos for delete using (
  exists (select 1 from events e where e.id = event_photos.event_id and e.created_by = auth.uid())
);

-- rsvps
drop policy if exists rsvps_select_all   on rsvps;
drop policy if exists rsvps_insert_self  on rsvps;
drop policy if exists rsvps_update_self  on rsvps;
drop policy if exists rsvps_delete_self  on rsvps;
create policy rsvps_select_all  on rsvps for select using (true);
create policy rsvps_insert_self on rsvps for insert with check (auth.uid() = user_id);
create policy rsvps_update_self on rsvps for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy rsvps_delete_self on rsvps for delete using (auth.uid() = user_id);

-- shares
drop policy if exists shares_select_all  on shares;
drop policy if exists shares_insert_self on shares;
create policy shares_select_all  on shares for select using (true);
create policy shares_insert_self on shares for insert with check (auth.uid() = shared_by);

-- checkins
drop policy if exists checkins_select_self_or_creator on checkins;
drop policy if exists checkins_insert_self            on checkins;
create policy checkins_select_self_or_creator on checkins for select using (
  auth.uid() = user_id
  or exists (select 1 from events e where e.id = checkins.event_id and e.created_by = auth.uid())
);
create policy checkins_insert_self on checkins for insert with check (auth.uid() = user_id);

-- reports
drop policy if exists reports_select_self on reports;
drop policy if exists reports_insert_self on reports;
create policy reports_select_self on reports for select using (auth.uid() = reported_by);
create policy reports_insert_self on reports for insert with check (auth.uid() = reported_by);
