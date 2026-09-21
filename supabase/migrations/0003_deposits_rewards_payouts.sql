-- The activity tables: deposits (the core event), rewards + redemptions, and
-- reciclador payouts. Everything the app "does" flows through these three.

create type deposit_status as enum ('pendiente', 'validado', 'rechazado');
create type redemption_status as enum ('pendiente', 'usado');
create type payout_status as enum ('pendiente', 'pagado');

create table deposits (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuario_profiles (id) on delete cascade,
  collection_point_id uuid not null references collection_points (id),
  material_id text not null references materials (id),
  kg numeric(10, 3) not null,
  points_awarded integer not null,
  status deposit_status not null default 'pendiente',
  -- Set once a reciclador confirms the real weight/material in the field.
  -- This is the field verification step the pitch promises and the old
  -- prototype never actually implemented.
  validated_by uuid references reciclador_profiles (id),
  validated_at timestamptz,
  created_at timestamptz not null default now()
);

create index deposits_usuario_id_idx on deposits (usuario_id);
create index deposits_collection_point_id_idx on deposits (collection_point_id);
create index deposits_created_at_idx on deposits (created_at);

create table rewards (
  id uuid primary key default gen_random_uuid(),
  nm text not null,
  partner text not null,
  cat text not null,
  pts integer not null,
  ic text,
  color text,
  stock integer, -- null = unlimited
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table redemptions (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuario_profiles (id) on delete cascade,
  reward_id uuid not null references rewards (id),
  code text not null unique,
  status redemption_status not null default 'pendiente',
  redeemed_at timestamptz not null default now(),
  used_at timestamptz
);

create index redemptions_usuario_id_idx on redemptions (usuario_id);

create table payouts (
  id uuid primary key default gen_random_uuid(),
  reciclador_id uuid not null references reciclador_profiles (id) on delete cascade,
  period text not null, -- '2026-07'
  kg_total numeric(10, 2) not null,
  amount_bs numeric(10, 2) not null,
  status payout_status not null default 'pendiente',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (reciclador_id, period)
);
