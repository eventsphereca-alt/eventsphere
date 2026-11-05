alter table public.admin_requests
  add column if not exists admin_note text not null default '',
  add column if not exists admin_reply text not null default '',
  add column if not exists activity jsonb not null default '[]'::jsonb;

