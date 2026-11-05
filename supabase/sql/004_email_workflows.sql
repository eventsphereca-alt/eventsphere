create or replace view public.pending_review_email_jobs as
select
  rr.id as review_request_id,
  rr.client_email,
  rr.client_name,
  rr.vendor_name,
  rr.event_type,
  rr.status,
  rr.created_at
from public.review_requests rr
where rr.status = 'sent';

create or replace view public.pending_admin_notification_jobs as
select
  ar.id as admin_request_id,
  ar.subject,
  ar.priority,
  ar.email,
  ar.status,
  ar.created_at
from public.admin_requests ar
where ar.status in ('pending', 'flagged');

comment on view public.pending_review_email_jobs is
'Use this view from an Edge Function or background worker to send review invitation emails.';

comment on view public.pending_admin_notification_jobs is
'Use this view from an Edge Function or background worker to send support queue and escalation emails.';
