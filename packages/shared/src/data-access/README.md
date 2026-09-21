# Data access

Every screen reads through `getDataSource()`, never straight from `../data/*`. Today `getDataSource()` returns `mockDataSource`, which just returns the same hardcoded arrays as before — same numbers on screen, nothing changes yet.

## Wiring up Supabase later

1. Add `@supabase/supabase-js` to `apps/web` and/or `apps/mobile` (not to this package).
2. In each app, build a `SupabaseDataSource` implementing `VerdexDataSource` (from `./types`) — one method per query, e.g. `getEmpresaMetrics` becomes a `select` against the `empresa_deposit_facts` view (see `supabase/migrations/0004_empresa_views.sql`) filtered by a `created_at` range for the requested period.
3. Call `setDataSource(supabaseDataSource)` once, near the app's root (e.g. a client provider in `apps/web/src/app/layout.tsx`, or the Expo Router root `_layout.tsx`), guarded by whether `NEXT_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL` is set — so a dev without Supabase env vars still gets the mock and the app keeps working.

Expected env vars once that happens: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (as `NEXT_PUBLIC_*` in `apps/web`, `EXPO_PUBLIC_*` in `apps/mobile`).
