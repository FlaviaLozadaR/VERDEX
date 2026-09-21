# Verdex — schema

Versioned SQL, applied in filename order. No live project is connected yet — this is schema-as-code, ready for whenever a Supabase project exists.

## Apply to a real project

1. Create a project at supabase.com, grab its project ref.
2. `npx supabase login`
3. `npx supabase link --project-ref <ref>` (run from `Verdex-Platform/`)
4. `npx supabase db push` — applies all 5 migrations in order.
5. Copy the project URL + anon key into `apps/web/.env.local` and `apps/mobile/.env` (see `packages/shared/src/data-access/README.md` for which env vars).

## Files

| File | What it adds |
|---|---|
| `0001_profiles_and_roles.sql` | `profiles` + one extension table per role (`usuario_profiles`, `empresa_profiles`, `reciclador_profiles`) |
| `0002_catalog_and_collection_points.sql` | `materials`, `collection_points` (seeded with today's hardcoded catalog) |
| `0003_deposits_rewards_payouts.sql` | `deposits`, `rewards`, `redemptions`, `payouts` — the activity tables |
| `0004_empresa_views.sql` | Read views the empresa dashboard queries (`empresa_deposit_facts`, `empresa_monthly_kg`, `empresa_ranking_by_point`) |
| `0005_row_level_security.sql` | RLS policies for all 4 roles — the actual security boundary, not just UI gating |

No `admin` extension table on purpose — `profiles.role = 'admin'` is enough for now. Add a `team_permissions` table later if internal access needs finer levels (super_admin / ops / soporte).
