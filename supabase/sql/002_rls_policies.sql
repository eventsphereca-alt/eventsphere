alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.venues enable row level security;
alter table public.leads enable row level security;
alter table public.admin_requests enable row level security;
alter table public.review_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.email_events enable row level security;

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    auth.jwt() ->> 'app_role',
    ''
  );
$$;

create policy "profiles self select"
on public.profiles
for select
using (id = auth.uid() or public.current_app_role() = 'admin');

create policy "profiles self update"
on public.profiles
for update
using (id = auth.uid() or public.current_app_role() = 'admin')
with check (id = auth.uid() or public.current_app_role() = 'admin');

create policy "admins manage vendors"
on public.vendors
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "vendors read own vendor record"
on public.vendors
for select
using (owner_user_id = auth.uid() or public.current_app_role() = 'admin');

create policy "vendors update own vendor record"
on public.vendors
for update
using (owner_user_id = auth.uid() or public.current_app_role() = 'admin')
with check (owner_user_id = auth.uid() or public.current_app_role() = 'admin');

create policy "public can browse approved vendors"
on public.vendors
for select
using (status = 'approved');

create policy "public can browse approved venues"
on public.venues
for select
using (status = 'approved');

create policy "admins manage venues"
on public.venues
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "vendors manage own leads"
on public.leads
for all
using (
  exists (
    select 1 from public.vendors
    where public.vendors.id = public.leads.vendor_id
      and (public.vendors.owner_user_id = auth.uid() or public.current_app_role() = 'admin')
  )
)
with check (
  exists (
    select 1 from public.vendors
    where public.vendors.id = public.leads.vendor_id
      and (public.vendors.owner_user_id = auth.uid() or public.current_app_role() = 'admin')
  )
);

create policy "vendors manage own requests"
on public.admin_requests
for all
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.admin_requests.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.admin_requests.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

create policy "vendors manage own review requests"
on public.review_requests
for all
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.review_requests.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.vendors
    where public.vendors.id = public.review_requests.vendor_id
      and public.vendors.owner_user_id = auth.uid()
  )
);

create policy "admins manage all reviews"
on public.reviews
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "vendors read own reviews"
on public.reviews
for select
using (
  exists (
    select 1 from public.vendors
    where public.vendors.id = public.reviews.vendor_id
      and (public.vendors.owner_user_id = auth.uid() or public.current_app_role() = 'admin')
  )
);

create policy "public can read approved reviews"
on public.reviews
for select
using (status = 'approved');

create policy "admins manage email events"
on public.email_events
for all
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');
