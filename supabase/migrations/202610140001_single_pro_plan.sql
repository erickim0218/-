-- Consolidate PRO membership into one 30-day product priced at KRW 100,000.
-- Existing transactions remain linked to their original products for history.

update public.revenue_products
set
  plan_name = 'REPOSITION PRO 30일',
  default_price = 100000,
  is_active = true,
  sort_order = 1,
  updated_at = now()
where product_group = 'pro_membership'
  and plan_code = 'pro_start_30';

insert into public.revenue_products (
  product_group,
  plan_code,
  plan_name,
  default_price,
  is_active,
  sort_order,
  created_at,
  updated_at
)
select
  'pro_membership',
  'pro_start_30',
  'REPOSITION PRO 30일',
  100000,
  true,
  1,
  now(),
  now()
where not exists (
  select 1
  from public.revenue_products
  where plan_code = 'pro_start_30'
);

update public.revenue_products
set
  is_active = false,
  updated_at = now()
where product_group = 'pro_membership'
  and plan_code <> 'pro_start_30';
