create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'viewer' check (role in ('admin', 'manager', 'viewer')),
  created_at timestamptz not null default now()
);

alter table public.profiles
add column if not exists email text,
add column if not exists avatar_url text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and role in ('admin', 'manager')
  );
$$;

create or replace function public.prevent_non_admin_role_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change user roles.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_non_admin_role_changes on public.profiles;
create trigger prevent_non_admin_role_changes
before update on public.profiles
for each row execute function public.prevent_non_admin_role_changes();

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_name text not null default 'AcoustiQ',
  primary_color text not null default '#4f46e5',
  accent_color text not null default '#10b981',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  name text not null,
  category text not null,
  price numeric(10, 2) not null,
  unit_label text not null,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  stock integer not null default 0,
  thumbnail_type text not null default 'wood',
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.products
add column if not exists image_url text;

delete from public.products
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by name
        order by created_at asc, id asc
      ) as duplicate_rank
    from public.products
  ) ranked_products
  where duplicate_rank > 1
);

create unique index if not exists products_name_unique
on public.products (name);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  company_name text,
  project_name text,
  project_type text not null,
  source text not null default 'Website',
  status text not null default 'New' check (status in ('New', 'Contacted', 'Quote Sent', 'Viewed', 'Declined')),
  marketing_consent boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  quote_number text not null unique,
  room_details jsonb not null,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null,
  tax numeric(10, 2) not null,
  total numeric(10, 2) not null,
  status text not null default 'Sent' check (status in ('Draft', 'Sent', 'Viewed', 'Accepted')),
  created_at timestamptz not null default now()
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  product_name text not null,
  variant text not null,
  placement text not null,
  placement_note text,
  quantity integer not null,
  unit_label text not null,
  unit_price numeric(10, 2) not null,
  line_total numeric(10, 2) not null
);

create table if not exists public.quote_email_events (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  event_type text not null default 'quote_created',
  recipient_email text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.quotes(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  total numeric(10, 2) not null,
  payment_status text not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Failed', 'Refunded')),
  fulfillment_status text not null default 'New' check (fulfillment_status in ('New', 'Processing', 'Completed', 'Cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.quotes(id) on delete cascade,
  provider text not null default 'manual',
  provider_session_id text,
  status text not null default 'created' check (status in ('created', 'paid', 'expired', 'failed')),
  amount numeric(10, 2) not null,
  currency text not null default 'MYR',
  checkout_url text,
  created_at timestamptz not null default now()
);

create or replace function public.queue_quote_email_event()
returns trigger
language plpgsql
security definer
as $$
declare
  recipient text;
begin
  select email into recipient
  from public.leads
  where id = new.lead_id;

  if recipient is not null then
    insert into public.quote_email_events (quote_id, recipient_email)
    values (new.id, recipient);
  end if;

  return new;
end;
$$;

drop trigger if exists on_quote_created_queue_email on public.quotes;
create trigger on_quote_created_queue_email
after insert on public.quotes
for each row
execute function public.queue_quote_email_event();

create or replace view public.lead_quote_overview as
select
  leads.*,
  quotes.total as quote_value,
  quotes.quote_number
from public.leads
left join public.quotes on quotes.lead_id = leads.id;

alter table public.companies enable row level security;
alter table public.products enable row level security;
alter table public.leads enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.quote_email_events enable row level security;
alter table public.orders enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Admins can read companies" on public.companies;
create policy "Admins can read companies"
on public.companies for select
using (public.is_admin());

drop policy if exists "Admins can update companies" on public.companies;
create policy "Admins can update companies"
on public.companies for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read products" on public.products;
drop policy if exists "Public can read products" on public.products;
drop policy if exists "Public can read active products" on public.products;
create policy "Admins can read products"
on public.products for select
using (public.is_staff());

create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (status = 'Active');

drop policy if exists "Admins can create products" on public.products;
drop policy if exists "Public can create products" on public.products;
create policy "Admins can create products"
on public.products for insert
with check (public.is_staff());

drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Public can update products" on public.products;
create policy "Admins can update products"
on public.products for update
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Admins can delete products" on public.products;
drop policy if exists "Public can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
using (public.is_staff());

drop policy if exists "Public can create leads" on public.leads;
create policy "Public can create leads"
on public.leads for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can create quotes" on public.quotes;
create policy "Public can create quotes"
on public.quotes for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can create quote items" on public.quote_items;
create policy "Public can create quote items"
on public.quote_items for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read leads" on public.leads;
drop policy if exists "Public can read lead overview" on public.leads;
create policy "Admins can read leads"
on public.leads for select
using (public.is_staff());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
on public.leads for update
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
on public.leads for delete
using (public.is_staff());

drop policy if exists "Admins can read quotes" on public.quotes;
drop policy if exists "Public can read quotes" on public.quotes;
create policy "Admins can read quotes"
on public.quotes for select
using (public.is_staff());

drop policy if exists "Admins can read quote email events" on public.quote_email_events;
drop policy if exists "Public can read quote email events" on public.quote_email_events;
create policy "Admins can read quote email events"
on public.quote_email_events for select
using (public.is_staff());

drop policy if exists "Admins can read quote items" on public.quote_items;
create policy "Admins can read quote items"
on public.quote_items for select
using (public.is_staff());

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
on public.orders for select
using (public.is_staff());

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
on public.orders for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Admins can read checkout sessions" on public.checkout_sessions;
create policy "Admins can read checkout sessions"
on public.checkout_sessions for select
using (public.is_staff());

drop policy if exists "Public can create checkout sessions" on public.checkout_sessions;
create policy "Public can create checkout sessions"
on public.checkout_sessions for insert
to anon, authenticated
with check (true);

grant usage on schema public to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant update, delete on public.leads to authenticated;
grant insert on public.quotes to anon, authenticated;
grant insert on public.quote_items to anon, authenticated;
grant insert on public.checkout_sessions to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select, update on public.profiles to authenticated;

update public.profiles
set email = auth.users.email
from auth.users
where public.profiles.id = auth.users.id
and public.profiles.email is null;

insert into public.companies (id, name, brand_name)
values ('11111111-1111-1111-1111-111111111111', 'Demo Acoustic Company', 'AcoustiQ')
on conflict (id) do nothing;

alter table public.companies
add column if not exists quote_prefix text not null default 'AQ',
add column if not exists support_email text;

insert into public.products (company_id, name, category, price, unit_label, status, stock, thumbnail_type)
values
  ('11111111-1111-1111-1111-111111111111', 'Acoustic Wall Panel - Wave Wood', 'Wall Panels', 89.00, 'per panel', 'Active', 152, 'wood'),
  ('11111111-1111-1111-1111-111111111111', 'Acoustic Wall Panel - Linear Oak', 'Wall Panels', 92.00, 'per panel', 'Active', 98, 'oak'),
  ('11111111-1111-1111-1111-111111111111', 'Acoustic Ceiling Panel - Cloud 1200', 'Ceiling Panels', 119.00, 'per panel', 'Active', 76, 'cloud'),
  ('11111111-1111-1111-1111-111111111111', 'Acoustic Ceiling Panel - Baffle', 'Ceiling Panels', 109.00, 'per panel', 'Active', 64, 'baffle'),
  ('11111111-1111-1111-1111-111111111111', 'Bass Trap Corner - Pro Series', 'Bass Traps', 99.00, 'per unit', 'Active', 120, 'corner'),
  ('11111111-1111-1111-1111-111111111111', 'Bass Trap Panel - Pro Series', 'Bass Traps', 89.00, 'per unit', 'Inactive', 0, 'bass')
on conflict (name) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', true)
on conflict (id) do nothing;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Public can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_staff());

drop policy if exists "Public can read profile avatars" on storage.objects;
create policy "Public can read profile avatars"
on storage.objects for select
using (bucket_id = 'profile-avatars');

drop policy if exists "Users can upload own profile avatars" on storage.objects;
create policy "Users can upload own profile avatars"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update own profile avatars" on storage.objects;
create policy "Users can update own profile avatars"
on storage.objects for update
to authenticated
using (
  bucket_id = 'profile-avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'profile-avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- After creating your first admin user, promote it with:
-- update public.profiles set role = 'admin' where id = '<auth-user-id>';
