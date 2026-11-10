-- Auto Lab Shop Management – phase 1 foundation
-- Run in the Supabase SQL editor (same project as Auto Lab Books).
-- All new tables are prefixed/named so they do not touch Books' tables.

-- 1. Staff and roles -------------------------------------------------------
create table if not exists public.staff (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  tech_number text,
  role        text not null check (role in ('owner','office','technician')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create or replace function public.app_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.staff where id = auth.uid() and active
$$;

alter table public.staff enable row level security;
create policy staff_read_self  on public.staff for select using (id = auth.uid() or public.app_role() = 'owner');
create policy staff_owner_all  on public.staff for all    using (public.app_role() = 'owner') with check (public.app_role() = 'owner');

-- 2. Customers and vehicles ------------------------------------------------
create table if not exists public.customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text,
  whatsapp   text,
  email      text,
  notes      text,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  plate       text,
  vin         text,
  make        text,
  model       text,
  year        int,
  mileage     int,
  notes       text,
  created_at  timestamptz not null default now()
);

alter table public.customers enable row level security;
alter table public.vehicles  enable row level security;

-- Owner and office: full access. Technicians: vehicles only (no customer contact data, no prices anywhere).
create policy customers_staff_all on public.customers for all
  using (public.app_role() in ('owner','office')) with check (public.app_role() in ('owner','office'));
create policy vehicles_office_all on public.vehicles for all
  using (public.app_role() in ('owner','office')) with check (public.app_role() in ('owner','office'));
create policy vehicles_tech_read  on public.vehicles for select
  using (public.app_role() = 'technician');

-- 3. Invoice numbers: AL-0001, AL-0002, ... --------------------------------
create table if not exists public.invoice_counter (
  series      text primary key,
  last_number int not null default 0
);
alter table public.invoice_counter enable row level security;  -- no policies: only the function below touches it

create or replace function public.next_invoice_number(p_series text default 'AL')
returns text language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if public.app_role() not in ('owner','office') then
    raise exception 'not allowed';
  end if;
  insert into public.invoice_counter(series, last_number) values (p_series, 1)
  on conflict (series) do update set last_number = public.invoice_counter.last_number + 1
  returning last_number into n;
  return p_series || '-' || lpad(n::text, 4, '0');
end $$;
