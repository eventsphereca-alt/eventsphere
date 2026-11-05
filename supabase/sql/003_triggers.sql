create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists vendors_set_updated_at on public.vendors;
create trigger vendors_set_updated_at before update on public.vendors
for each row execute function public.set_updated_at();

drop trigger if exists venues_set_updated_at on public.venues;
create trigger venues_set_updated_at before update on public.venues
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists admin_requests_set_updated_at on public.admin_requests;
create trigger admin_requests_set_updated_at before update on public.admin_requests
for each row execute function public.set_updated_at();

drop trigger if exists review_requests_set_updated_at on public.review_requests;
create trigger review_requests_set_updated_at before update on public.review_requests
for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at before update on public.reviews
for each row execute function public.set_updated_at();

drop trigger if exists email_events_set_updated_at on public.email_events;
create trigger email_events_set_updated_at before update on public.email_events
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'app_role', 'vendor'),
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do update
    set role = excluded.role,
        full_name = excluded.full_name,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
