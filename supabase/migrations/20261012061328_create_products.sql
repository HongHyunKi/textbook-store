create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('pass', 'single')),
  image_url text not null,
  price integer not null check (price >= 0),
  original_price integer check (original_price >= 0),
  discount_rate integer check (discount_rate between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;

drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products for select to anon, authenticated using (true);
