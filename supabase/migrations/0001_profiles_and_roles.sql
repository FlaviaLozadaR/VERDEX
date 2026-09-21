-- Verdex — core identity: one `profiles` row per person (1:1 with auth.users),
-- plus a role-specific extension table per role. A profile only ever has a row
-- in the ONE extension table matching its role.

create type role as enum ('usuario', 'empresa', 'reciclador', 'admin');
create type plan_tier as enum ('starter', 'crecimiento', 'enterprise');
create type esg_level as enum ('bronce', 'plata', 'oro');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role role not null default 'usuario',
  name text not null,
  email text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table empresa_profiles (
  id uuid primary key references profiles (id) on delete cascade,
  company_name text not null,
  industry text,
  plan_tier plan_tier not null default 'starter',
  esg_level esg_level not null default 'bronce',
  created_at timestamptz not null default now()
);

create table reciclador_profiles (
  id uuid primary key references profiles (id) on delete cascade,
  operator_name text not null,
  zone text,
  payout_rate_bs_kg numeric(10, 2) not null default 2.0,
  created_at timestamptz not null default now()
);

create table usuario_profiles (
  id uuid primary key references profiles (id) on delete cascade,
  uni text,
  -- Which company this user's recycling counts toward for ESG rollups, if any.
  -- One company per user is enough for now — revisit as a join table if a user
  -- ever needs to belong to more than one company at once.
  empresa_id uuid references empresa_profiles (id) on delete set null,
  points integer not null default 0,
  total_earned integer not null default 0,
  kg numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index usuario_profiles_empresa_id_idx on usuario_profiles (empresa_id);

-- Keep `updated_at` honest on every profile edit.
create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();
