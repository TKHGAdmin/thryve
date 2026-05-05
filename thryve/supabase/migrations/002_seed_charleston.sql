-- ─────────────────────────────────────────────────────────────────────────────
-- Thryve — Charleston seed data
-- Run AFTER 001_initial_schema.sql.
-- ─────────────────────────────────────────────────────────────────────────────

-- Dummy seed user. Replace with real auth user later.
insert into users (id, phone, name, ig_handle, ig_linked, city, interests)
values (
  '00000000-0000-0000-0000-000000000001',
  '+18435550000',
  'Thryve Seed',
  '@thryveseed',
  true,
  'Charleston, SC',
  array['cold', 'run', 'breath', 'fest', 'yoga', 'social', 'hike', 'pkl', 'sauna']
)
on conflict (phone) do nothing;

-- Crews
insert into crews (id, name, handle, category, bio, verified, member_count, created_by) values
  ('11111111-0000-0000-0000-000000000001', 'Cold Plunge CHS',     'coldplungechs',     'cold',  'Cold plunges, hot coffee, every weekend in the Lowcountry.', true,  342,  '00000000-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000002', 'Charleston Run Club', 'charlestonrunclub', 'run',   'Free fitness on Charleston streets. Just show up.',          true,  1203, '00000000-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000003', 'Breathe CHS',         'breathechs',        'breath','Holotropic breathwork, full-moon synced.',                   false, 187,  '00000000-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000004', 'SWEAT Festival',      'sweatfest',         'fest',  'Two days of wellness on the Cooper River.',                  true,  5021, '00000000-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000005', 'Lowcountry Yoga Co',  'lowcountryyogaco',  'yoga',  'Vinyasa as the sun comes up over the Atlantic.',             false, 415,  '00000000-0000-0000-0000-000000000001')
on conflict (handle) do nothing;

-- Seed user is a member (admin) of every crew.
insert into crew_members (crew_id, user_id, role) values
  ('11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin'),
  ('11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'admin'),
  ('11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'admin'),
  ('11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'admin'),
  ('11111111-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'admin')
on conflict (crew_id, user_id) do nothing;

-- Events. Dates are relative to now() so they stay fresh.
-- e1 — Today, ~2 hrs from now
insert into events (
  id, crew_id, created_by, title, description, category, location_name,
  latitude, longitude, date_time, end_time, price, is_free, capacity,
  spots_remaining, going_count, tags, urgency_type
) values (
  '22222222-0000-0000-0000-000000000001',
  '11111111-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Ice Bath & Coffee',
  'Plunge into the harbor at sunrise, then warm up with single-origin pour-overs from our mobile cart. First-timers welcome — we have extra towels.',
  'cold',
  'Waterfront Park',
  32.7764, -79.9253,
  now() + interval '2 hours',
  now() + interval '3 hours 30 minutes',
  0, true, 32, 8, 24,
  array['plunge', 'sunrise', 'coffee'],
  'live'
) on conflict (id) do nothing;

-- e2 — Tomorrow morning
insert into events (
  id, crew_id, created_by, title, description, category, location_name,
  latitude, longitude, date_time, end_time, price, is_free, capacity,
  spots_remaining, going_count, tags
) values (
  '22222222-0000-0000-0000-000000000002',
  '11111111-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Saturday Morning 5K',
  '5k loop around Hampton Park. Pace groups: 7:00, 8:30, 10:00. Coffee at Second State after — first round on the captain.',
  'run',
  'Hampton Park',
  32.7980, -79.9530,
  now() + interval '22 hours',
  now() + interval '23 hours',
  0, true, 200, 133, 67,
  array['5k', 'all paces']
) on conflict (id) do nothing;

-- e3 — 4 days out, paid, almost full message
insert into events (
  id, crew_id, created_by, title, description, category, location_name,
  latitude, longitude, date_time, end_time, price, is_free, capacity,
  spots_remaining, going_count, tags, urgency_type
) values (
  '22222222-0000-0000-0000-000000000003',
  '11111111-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'Full Moon Breathwork Circle',
  'Guided 9-round holotropic breathwork under the full moon. Bring a mat and an open mind.',
  'breath',
  'White Point Garden',
  32.7697, -79.9311,
  now() + interval '4 days',
  now() + interval '4 days 1 hour 15 minutes',
  15, false, 30, 12, 18,
  array['holotropic', 'full moon'],
  'almost_full'
) on conflict (id) do nothing;

-- e4 — 6 weeks out, festival, early bird
insert into events (
  id, crew_id, created_by, title, description, category, location_name,
  latitude, longitude, date_time, end_time, price, is_free, capacity,
  spots_remaining, going_count, tags, urgency_type
) values (
  '22222222-0000-0000-0000-000000000004',
  '11111111-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'SWEAT Fest Charleston 2026',
  'Two days of yoga, ice baths, sound healing, lifting, run clubs, and 80+ wellness vendors on the Cooper River.',
  'fest',
  'Riverfront Park',
  32.8546, -79.9748,
  now() + interval '42 days',
  now() + interval '44 days',
  45, false, 1500, 1188, 312,
  array['festival', 'two-day'],
  'early_bird'
) on conflict (id) do nothing;

-- e5 — 3 days, beach yoga
insert into events (
  id, crew_id, created_by, title, description, category, location_name,
  latitude, longitude, date_time, end_time, price, is_free, capacity,
  spots_remaining, going_count, tags
) values (
  '22222222-0000-0000-0000-000000000005',
  '11111111-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'Sunrise Flow + Sound Bath',
  '60-min vinyasa as the sun comes up over the Atlantic, then a 20-min crystal bowl sound bath in the sand.',
  'yoga',
  'Folly Beach',
  32.6552, -79.9404,
  now() + interval '3 days',
  now() + interval '3 days 1 hour 20 minutes',
  10, false, 35, 20, 15,
  array['vinyasa', 'sound bath', 'beach']
) on conflict (id) do nothing;

-- e6 — 7 days, just dropped
insert into events (
  id, crew_id, created_by, title, description, category, location_name,
  latitude, longitude, date_time, end_time, price, is_free, capacity,
  spots_remaining, going_count, tags, urgency_type
) values (
  '22222222-0000-0000-0000-000000000006',
  '11111111-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Coffee & Cold Plunge Social',
  'Casual hang. Plunge tubs out front, oat milk lattes inside. Stop by 7:30–9:30.',
  'social',
  'Second State Coffee',
  32.7876, -79.9371,
  now() + interval '7 days',
  now() + interval '7 days 2 hours',
  0, true, 20, 11, 9,
  array['plunge', 'coffee', 'no pressure'],
  'just_dropped'
) on conflict (id) do nothing;
