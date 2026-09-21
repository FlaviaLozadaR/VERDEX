-- Row Level Security — this is what actually enforces the 4-role model.
-- Without this, any authenticated client could read/write any row; the
-- frontend role checks (nav visibility, route guards) are UX, not security.

create function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- ---------- profiles ----------
alter table profiles enable row level security;

create policy "profiles: read own or admin"
  on profiles for select
  using (id = auth.uid() or is_admin());

create policy "profiles: update own or admin"
  on profiles for update
  using (id = auth.uid() or is_admin());

-- ---------- usuario_profiles ----------
alter table usuario_profiles enable row level security;

create policy "usuario_profiles: read own, own empresa, or admin"
  on usuario_profiles for select
  using (
    id = auth.uid()
    or is_admin()
    or empresa_id = auth.uid() -- empresa_profiles.id === the empresa's own profiles.id
  );

-- points/kg are earned via deposit validation, not edited directly by the
-- user — only admin (or a security-definer function called from a trigger)
-- may write here.
create policy "usuario_profiles: admin writes"
  on usuario_profiles for update
  using (is_admin());

-- ---------- empresa_profiles ----------
alter table empresa_profiles enable row level security;

create policy "empresa_profiles: read own, affiliated usuario, or admin"
  on empresa_profiles for select
  using (
    id = auth.uid()
    or is_admin()
    or id = (select empresa_id from usuario_profiles where id = auth.uid())
  );

create policy "empresa_profiles: update own or admin"
  on empresa_profiles for update
  using (id = auth.uid() or is_admin());

-- ---------- reciclador_profiles ----------
alter table reciclador_profiles enable row level security;

create policy "reciclador_profiles: read own or admin"
  on reciclador_profiles for select
  using (id = auth.uid() or is_admin());

create policy "reciclador_profiles: update own or admin"
  on reciclador_profiles for update
  using (id = auth.uid() or is_admin());

-- ---------- reference data (materials, collection_points, rewards) ----------
-- Public read — this is catalog/map data, not user data. Only admin mutates.
alter table materials enable row level security;
create policy "materials: public read" on materials for select using (true);
create policy "materials: admin writes" on materials for all using (is_admin());

alter table collection_points enable row level security;
create policy "collection_points: public read" on collection_points for select using (true);
create policy "collection_points: admin writes" on collection_points for all using (is_admin());

alter table rewards enable row level security;
create policy "rewards: public read" on rewards for select using (true);
create policy "rewards: admin writes" on rewards for all using (is_admin());

-- ---------- deposits ----------
alter table deposits enable row level security;

create policy "deposits: read own, assigned reciclador, empresa, or admin"
  on deposits for select
  using (
    usuario_id = auth.uid()
    or validated_by = auth.uid()
    or is_admin()
    or exists (
      select 1 from collection_points cp
      where cp.id = collection_point_id and cp.reciclador_id = auth.uid()
    )
    or exists (
      select 1 from usuario_profiles up
      where up.id = usuario_id and up.empresa_id = auth.uid()
    )
  );

create policy "deposits: usuario creates own"
  on deposits for insert
  with check (usuario_id = auth.uid());

-- Immutable once submitted, except for the reciclador assigned to that
-- point (who validates it) or admin — a usuario can't edit their own kg
-- after the fact.
create policy "deposits: assigned reciclador or admin validates"
  on deposits for update
  using (
    is_admin()
    or exists (
      select 1 from collection_points cp
      where cp.id = collection_point_id and cp.reciclador_id = auth.uid()
    )
  );

-- ---------- redemptions ----------
alter table redemptions enable row level security;

create policy "redemptions: read own or admin"
  on redemptions for select
  using (usuario_id = auth.uid() or is_admin());

create policy "redemptions: usuario creates own"
  on redemptions for insert
  with check (usuario_id = auth.uid());

-- Marking a code as "usado" happens at the partner's point of sale — until
-- there's a dedicated aliado role, only admin can flip this.
create policy "redemptions: admin updates"
  on redemptions for update
  using (is_admin());

-- ---------- payouts ----------
alter table payouts enable row level security;

create policy "payouts: read own or admin"
  on payouts for select
  using (reciclador_id = auth.uid() or is_admin());

create policy "payouts: admin writes"
  on payouts for all
  using (is_admin());
