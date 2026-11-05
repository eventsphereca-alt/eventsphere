# Supabase Setup

This project now has the Supabase scaffold required for the real backend phase.

## Environment

Copy [.env.example](/Users/macbook/Downloads/Event Sphere/.env.example) to `.env.local` and fill in:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ENABLED=true`
- `RESEND_API_KEY` for email delivery
- `MAIL_FROM=Event Sphere <onboarding@resend.dev>` for staging, then switch to the verified production domain sender
- `ADMIN_ALERT_EMAIL` for temporary admin/team notifications during staging

## Frontend

Frontend client files:

- [src/lib/supabase/client.js](/Users/macbook/Downloads/Event Sphere/src/lib/supabase/client.js)
- [src/lib/supabase/auth.js](/Users/macbook/Downloads/Event Sphere/src/lib/supabase/auth.js)

These are intended to replace the current local auth/session flow once the login screens are switched over.

## Backend

Backend env and admin client:

- [backend/env.js](/Users/macbook/Downloads/Event Sphere/backend/env.js)
- [backend/supabase.js](/Users/macbook/Downloads/Event Sphere/backend/supabase.js)

These are the server-side entry points for:

- service-role access
- future auth verification
- email job processing
- replacing JSON persistence with Supabase-backed repositories
- seeding local marketplace demo data into Supabase once the schema exists

## SQL Order

Run these SQL files in order:

1. [supabase/sql/001_schema.sql](/Users/macbook/Downloads/Event Sphere/supabase/sql/001_schema.sql)
2. [supabase/sql/002_rls_policies.sql](/Users/macbook/Downloads/Event Sphere/supabase/sql/002_rls_policies.sql)
3. [supabase/sql/003_triggers.sql](/Users/macbook/Downloads/Event Sphere/supabase/sql/003_triggers.sql)
4. [supabase/sql/004_email_workflows.sql](/Users/macbook/Downloads/Event Sphere/supabase/sql/004_email_workflows.sql)
5. [supabase/sql/005_settings.sql](/Users/macbook/Downloads/Event Sphere/supabase/sql/005_settings.sql)
6. [supabase/sql/006_workflow_tables.sql](/Users/macbook/Downloads/Event Sphere/supabase/sql/006_workflow_tables.sql)

After the schema is applied, seed the current local demo content:

`npm run supabase:sync-auth`

`npm run supabase:seed-data`

This will:

- sync the current seeded admin/vendor login accounts into Supabase Auth
- create matching `profiles`
- import vendors, venues, leads, support requests, review requests, and reviews from [data/db.json](/Users/macbook/Downloads/Event Sphere/data/db.json)
- use normalized workflow tables for listings, packages, policies, clients, quotes, analytics events, and availability blocks as each UI area is connected

## Planned Live Wiring

The intended order for the live cutover is:

1. Replace login/register with Supabase Auth
2. Apply the marketplace schema in Supabase
3. Seed the current local demo dataset into Supabase
4. Create vendor records from auth sign-up metadata
5. Swap vendor/admin dashboard reads from `data/db.json` to Supabase queries
6. Move lead/support/review write actions to Supabase
7. Verify email delivery for vendor approval, rejection, review requests, and support updates

## Email Workflow

The app currently sends branded staging emails through [backend/email.js](/Users/macbook/Downloads/Event Sphere/backend/email.js).

Current email flows:

- vendor approval with portal access details
- vendor rejection/update required notices
- client review request invites
- admin support request alerts
- vendor support request status updates

Every send is recorded in `email_events` with `queued`, `processing`, `sent`, or `failed` status.

For staging, use Resend's verified sender or another verified sender configured in `MAIL_FROM`. For production, verify the real client domain in Resend, update DNS records, then switch `MAIL_FROM` to the branded domain email.
