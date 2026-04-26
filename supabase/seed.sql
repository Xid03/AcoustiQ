create extension if not exists "pgcrypto";

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

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
using (true);

drop policy if exists "Public can create products" on public.products;
create policy "Public can create products"
on public.products for insert
with check (true);

drop policy if exists "Public can update products" on public.products;
create policy "Public can update products"
on public.products for update
using (true)
with check (true);

drop policy if exists "Public can create leads" on public.leads;
create policy "Public can create leads"
on public.leads for insert
with check (true);

drop policy if exists "Public can create quotes" on public.quotes;
create policy "Public can create quotes"
on public.quotes for insert
with check (true);

drop policy if exists "Public can create quote items" on public.quote_items;
create policy "Public can create quote items"
on public.quote_items for insert
with check (true);

drop policy if exists "Public can read lead overview" on public.leads;
create policy "Public can read lead overview"
on public.leads for select
using (true);

drop policy if exists "Public can read quotes" on public.quotes;
create policy "Public can read quotes"
on public.quotes for select
using (true);

drop policy if exists "Public can read quote email events" on public.quote_email_events;
create policy "Public can read quote email events"
on public.quote_email_events for select
using (true);

insert into public.companies (id, name, brand_name)
values ('11111111-1111-1111-1111-111111111111', 'Demo Acoustic Company', 'AcoustiQ')
on conflict (id) do nothing;

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

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Public can upload product images" on storage.objects;
create policy "Public can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images');
