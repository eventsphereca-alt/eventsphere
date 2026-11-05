create table if not exists public.app_settings (
  key text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vendor_workspace_settings (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null unique references public.vendors(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.app_settings enable row level security;
alter table public.vendor_workspace_settings enable row level security;

create policy "admins manage app settings"
on public.app_settings
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admins manage vendor workspace settings"
on public.vendor_workspace_settings
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "vendors read own workspace settings"
on public.vendor_workspace_settings
for select
using (
  exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_workspace_settings.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

create policy "vendors update own workspace settings"
on public.vendor_workspace_settings
for update
using (
  exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_workspace_settings.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_workspace_settings.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

create policy "vendors insert own workspace settings"
on public.vendor_workspace_settings
for insert
with check (
  exists (
    select 1 from public.vendors
    where public.vendors.id = public.vendor_workspace_settings.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

insert into public.app_settings (key, payload)
values ('platform', '{}'::jsonb)
on conflict (key) do nothing;

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at before update on public.app_settings
for each row execute function public.set_updated_at();

drop trigger if exists vendor_workspace_settings_set_updated_at on public.vendor_workspace_settings;
create trigger vendor_workspace_settings_set_updated_at before update on public.vendor_workspace_settings
for each row execute function public.set_updated_at();
