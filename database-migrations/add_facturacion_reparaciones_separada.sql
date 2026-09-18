-- Facturacion independiente para reparaciones.
-- Ejecutar en Supabase. No depende de la tabla facturas de ventas.

create table if not exists factura_reparacion_secuencias (
  tienda_id uuid not null references tiendas(id) on delete cascade,
  serie varchar(10) not null default 'R',
  ultimo_numero bigint not null default 0,
  primary key (tienda_id, serie)
);

create table if not exists facturas_reparaciones (
  id uuid primary key default gen_random_uuid(),
  tienda_id uuid not null references tiendas(id) on delete restrict,
  reparacion_id uuid not null unique references reparaciones(id) on delete restrict,
  serie varchar(10) not null default 'R',
  numero bigint not null,
  cliente_id uuid not null references clientes(id) on delete restrict,
  subtotal numeric(12,2) not null,
  impuesto numeric(12,2) not null default 0,
  descuento numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  moneda varchar(10) not null default 'USD',
  metodo_pago varchar(30),
  estado varchar(20) not null default 'emitida',
  observaciones text,
  created_at timestamptz not null default now(),
  unique (tienda_id, serie, numero)
);

create table if not exists factura_reparacion_detalles (
  id uuid primary key default gen_random_uuid(),
  factura_id uuid not null references facturas_reparaciones(id) on delete cascade,
  repuesto_id uuid references stock_repuestos(id) on delete restrict,
  tipo varchar(20) not null default 'repuesto' check (tipo in ('repuesto', 'servicio')),
  descripcion text not null,
  cantidad numeric(12,2) not null check (cantidad > 0),
  precio_unitario numeric(12,2) not null check (precio_unitario >= 0),
  subtotal numeric(12,2) not null check (subtotal >= 0)
);

create index if not exists facturas_reparaciones_tienda_created_at_idx
  on facturas_reparaciones (tienda_id, created_at desc);

create or replace function siguiente_numero_factura_reparacion(p_tienda_id uuid, p_serie varchar)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare siguiente bigint;
begin
  insert into factura_reparacion_secuencias (tienda_id, serie, ultimo_numero)
  values (p_tienda_id, p_serie, 1)
  on conflict (tienda_id, serie)
  do update set ultimo_numero = factura_reparacion_secuencias.ultimo_numero + 1
  returning ultimo_numero into siguiente;

  return siguiente;
end;
$$;

revoke all on function siguiente_numero_factura_reparacion(uuid, varchar) from public;
grant execute on function siguiente_numero_factura_reparacion(uuid, varchar) to service_role;

alter table facturas_reparaciones enable row level security;
alter table factura_reparacion_detalles enable row level security;
alter table factura_reparacion_secuencias enable row level security;
