alter table public.book_orders
  add column if not exists shipping_carrier text,
  add column if not exists internal_notes text,
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz;
