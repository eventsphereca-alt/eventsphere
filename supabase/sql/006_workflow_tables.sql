create table if not exists public.vendor_listings (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  slug text not null unique,
  business_name text not null,
  category text,
  city text,
  province text,
  price_from integer default 0,
  status text not null default 'approved' check (status in ('draft', 'pending', 'approved', 'deactivated', 'rejected')),
  featured boolean not null default false,
  description text,
  long_description text,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  cultural_specialties jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  event_types jsonb not null default '[]'::jsonb,
  availability jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vendor_packages (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  listing_id uuid references public.vendor_listings(id) on delete set null,
  name text not null,
  area text,
  price_from integer default 0,
  turnaround text,
  description text,
  status text not null default 'Active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vendor_policies (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  policy_type text not null check (policy_type in ('booking', 'cancellation', 'refund', 'health_safety', 'house_rules', 'custom')),
  title text not null,
  body text not null,
  is_default boolean not null default false,
  applies_to text not null default 'all_listings',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  name text not null,
  email text,
  phone text,
  city text,
  event_type text,
  event_date text,
  status text not null default 'active',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  quote_number text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  currency text not null default 'CAD',
  subtotal integer default 0,
  deposit integer default 0,
  balance integer default 0,
  expires_at timestamptz,
  sent_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (vendor_id, quote_number)
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete cascade,
  listing_id uuid references public.vendor_listings(id) on delete set null,
  event_type text not null,
  source text,
  city text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  listing_id uuid references public.vendor_listings(id) on delete cascade,
  date date not null,
  status text not null default 'blocked' check (status in ('available', 'limited', 'blocked')),
  slots jsonb not null default '[]'::jsonb,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (vendor_id, listing_id, date)
);

create index if not exists vendor_listings_vendor_id_idx on public.vendor_listings(vendor_id);
create index if not exists vendor_listings_status_idx on public.vendor_listings(status);
create index if not exists vendor_packages_vendor_id_idx on public.vendor_packages(vendor_id);
create index if not exists vendor_policies_vendor_id_idx on public.vendor_policies(vendor_id);
create index if not exists clients_vendor_id_idx on public.clients(vendor_id);
create index if not exists quotes_vendor_id_idx on public.quotes(vendor_id);
create index if not exists analytics_events_vendor_id_idx on public.analytics_events(vendor_id);
create index if not exists analytics_events_occurred_at_idx on public.analytics_events(occurred_at);
create index if not exists availability_blocks_vendor_id_idx on public.availability_blocks(vendor_id);
create index if not exists availability_blocks_date_idx on public.availability_blocks(date);

alter table public.vendor_listings enable row level security;
alter table public.vendor_packages enable row level security;
alter table public.vendor_policies enable row level security;
alter table public.clients enable row level security;
alter table public.quotes enable row level security;
alter table public.analytics_events enable row level security;
alter table public.availability_blocks enable row level security;

drop policy if exists "public read approved vendor listings" on public.vendor_listings;
create policy "public read approved vendor listings"
on public.vendor_listings
for select
using (
  status = 'approved'
  and exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_listings.vendor_id
      and public.vendors.status = 'approved'
  )
);

drop policy if exists "vendors manage own vendor listings" on public.vendor_listings;
create policy "vendors manage own vendor listings"
on public.vendor_listings
for all
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_listings.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_listings.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

drop policy if exists "vendors manage own vendor packages" on public.vendor_packages;
create policy "vendors manage own vendor packages"
on public.vendor_packages
for all
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_packages.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_packages.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

drop policy if exists "vendors manage own vendor policies" on public.vendor_policies;
create policy "vendors manage own vendor policies"
on public.vendor_policies
for all
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_policies.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_policies.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

drop policy if exists "vendors manage own clients" on public.clients;
create policy "vendors manage own clients"
on public.clients
for all
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.clients.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.clients.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

drop policy if exists "vendors manage own quotes" on public.quotes;
create policy "vendors manage own quotes"
on public.quotes
for all
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.quotes.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.quotes.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

drop policy if exists "admins manage analytics events" on public.analytics_events;
create policy "admins manage analytics events"
on public.analytics_events
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

drop policy if exists "vendors read own analytics events" on public.analytics_events;
create policy "vendors read own analytics events"
on public.analytics_events
for select
using (
  exists (
    select 1 from public.vendors
    where public.vendors.id = public.analytics_events.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

drop policy if exists "vendors manage own availability blocks" on public.availability_blocks;
create policy "vendors manage own availability blocks"
on public.availability_blocks
for all
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.availability_blocks.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.availability_blocks.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

drop trigger if exists vendor_listings_set_updated_at on public.vendor_listings;
create trigger vendor_listings_set_updated_at before update on public.vendor_listings
for each row execute function public.set_updated_at();

drop trigger if exists vendor_packages_set_updated_at on public.vendor_packages;
create trigger vendor_packages_set_updated_at before update on public.vendor_packages
for each row execute function public.set_updated_at();

drop trigger if exists vendor_policies_set_updated_at on public.vendor_policies;
create trigger vendor_policies_set_updated_at before update on public.vendor_policies
for each row execute function public.set_updated_at();

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at before update on public.quotes
for each row execute function public.set_updated_at();

drop trigger if exists availability_blocks_set_updated_at on public.availability_blocks;
create trigger availability_blocks_set_updated_at before update on public.availability_blocks
for each row execute function public.set_updated_at();
