create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'vendor')),
  full_name text,
  phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.profiles(id) on delete set null,
  slug text not null unique,
  business_name text not null,
  category text,
  city text,
  province text,
  price_from integer default 0,
  rating numeric(3,2) default 0,
  reviews_count integer default 0,
  verified boolean not null default false,
  featured boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'restricted')),
  review_status text not null default 'pending',
  description text,
  long_description text,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  event_types jsonb not null default '[]'::jsonb,
  service_packages jsonb not null default '[]'::jsonb,
  contact_email text,
  contact_phone text,
  contact_whatsapp text,
  contact_website text,
  instagram text,
  tiktok text,
  facebook text,
  years_in_business text,
  team_size text,
  travel_radius text,
  remote_planning text,
  service_style text,
  cultural_specialties jsonb not null default '[]'::jsonb,
  service_areas jsonb not null default '[]'::jsonb,
  availability jsonb not null default '{}'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  rejection_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  business_name text not null,
  category text,
  city text,
  province text,
  price_from integer default 0,
  rating numeric(3,2) default 0,
  reviews_count integer default 0,
  verified boolean not null default false,
  featured boolean not null default false,
  status text not null default 'pending',
  description text,
  long_description text,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  capacity text,
  availability jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  client_name text not null,
  client_phone text,
  client_email text,
  event_type text,
  city text,
  guests integer,
  budget text,
  quote_amount text,
  due_label text,
  event_date text,
  service_details text,
  vendor_notes text,
  status text not null default 'New inquiry',
  quote_id text,
  quote_sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_requests (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete set null,
  requester_user_id uuid references public.profiles(id) on delete set null,
  requester text not null,
  requester_slug text,
  subject text not null,
  type text not null,
  priority text not null default 'Normal',
  email text,
  message text not null,
  status text not null default 'pending',
  date_rank integer default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.review_requests (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  vendor_slug text not null,
  vendor_name text not null,
  client_name text not null,
  client_email text not null,
  event_type text,
  sent_at_label text,
  status text not null default 'sent',
  source text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  review_request_id uuid references public.review_requests(id) on delete set null,
  vendor_slug text not null,
  vendor_name text not null,
  reviewer_name text not null,
  reviewer_role text,
  event_type text,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  would_book_again boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'hidden', 'flagged')),
  reviewer_image_url text,
  submitted_at_label text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  target_email text not null,
  related_table text,
  related_id uuid,
  payload jsonb not null default '{}'::jsonb,
  delivery_status text not null default 'queued',
  provider_message_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
