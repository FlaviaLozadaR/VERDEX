-- Read-side views for the empresa ESG dashboard. Kept as plain views for now
-- (not materialized) — revisit as a materialized view refreshed on a cron
-- once `deposits` is large enough that these joins get slow.
--
-- Period aggregation (mes/trimestre/año) is intentionally NOT baked into SQL
-- here — the app queries these with a `created_at` range filter, so the same
-- view serves every period without three near-duplicate views to maintain.

-- One row per validated deposit, already joined up to the empresa it counts
-- toward. This is the single source of truth every empresa metric derives
-- from — kg, CO2 and water are approximations, not measured values.
create view empresa_deposit_facts
with (security_invoker = true) as
select
  d.id as deposit_id,
  up.empresa_id,
  d.usuario_id,
  d.collection_point_id,
  cp.name as collection_point_name,
  d.kg,
  d.points_awarded,
  d.created_at,
  -- placeholder conversion factors, ported from the old app's estimate
  -- (co2 = kg * 0.5) — validate against real sustainability data before
  -- this ships in a certificate a company hands to auditors.
  round(d.kg * 0.5, 2) as co2_kg,
  round(d.kg * 15, 1) as agua_litros
from deposits d
join usuario_profiles up on up.id = d.usuario_id
join collection_points cp on cp.id = d.collection_point_id
where d.status = 'validado'
  and up.empresa_id is not null;

-- "Tendencia mensual" chart: kg per calendar month per empresa.
create view empresa_monthly_kg
with (security_invoker = true) as
select
  empresa_id,
  date_trunc('month', created_at)::date as month,
  sum(kg) as kg
from empresa_deposit_facts
group by empresa_id, date_trunc('month', created_at);

-- "Ranking por sede" card: kg per collection point per empresa.
create view empresa_ranking_by_point
with (security_invoker = true) as
select
  empresa_id,
  collection_point_id,
  collection_point_name,
  sum(kg) as kg
from empresa_deposit_facts
group by empresa_id, collection_point_id, collection_point_name;
