-- Reference data: materials (with their point/kg conversion), and physical
-- collection points. Both are small, admin-editable tables — not user data.

create type collection_point_type as enum ('contenedor', 'maquina', 'aliado', 'campus');

create table materials (
  id text primary key, -- 'pet', 'alu', 'cart', ...
  nm text not null,
  sub text,
  pts_per_unit integer not null,
  kg_per_unit numeric(10, 3) not null,
  ic text not null
);

create table collection_points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  meta text,
  type collection_point_type not null,
  lat double precision,
  lng double precision,
  reciclador_id uuid references reciclador_profiles (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index collection_points_reciclador_id_idx on collection_points (reciclador_id);

-- Seed with the same catalog packages/shared ships today, so the numbers on
-- screen don't change the day this table goes live.
insert into materials (id, nm, sub, pts_per_unit, kg_per_unit, ic) values
  ('pet',   'PET',      'Botella plástica', 50, 0.04,  'PET'),
  ('alu',   'Aluminio', 'Lata',             60, 0.015, 'AL'),
  ('cart',  'Cartón',   'Por kg',           80, 1.0,   'CRT'),
  ('vid',   'Vidrio',   'Botella',          40, 0.4,   'VID'),
  ('tetra', 'Tetra',    'Brik',             30, 0.03,  'TT'),
  ('mix',   'Mixto',    'Por kg',           35, 1.0,   'MX');
