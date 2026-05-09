# Configuración Supabase

## 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto gratis
2. Guarda la **URL** y la **anon key** del proyecto (Settings → API)

## 2. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_...
```

La `SERVICE_ROLE_KEY` está en Settings → API → Service role secret (¡no la expongas al cliente!).

## 3. Crear las tablas (SQL)

Ve a **SQL Editor** en tu proyecto Supabase y ejecuta:

```sql
-- Tabla de calculadoras (una por empresa, puede haber N por usuario)
create table calculators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  nombre text not null default 'Mi Calculadora',
  slug text not null unique,
  config jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de leads
create table leads (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid references calculators,
  user_id uuid references auth.users not null,
  nombre text,
  email text,
  telefono text,
  servicio text,
  zona text,
  presupuesto_basico text,
  presupuesto_estandar text,
  presupuesto_premium text,
  mensaje text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table calculators enable row level security;
alter table leads enable row level security;

-- Políticas: cada usuario solo ve sus propios datos
create policy "Usuarios gestionan sus calculadoras"
  on calculators for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuarios gestionan sus leads"
  on leads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Lectura pública de calculadoras (para /calc/[slug] sin login)
create policy "Lectura pública de calculadoras"
  on calculators for select
  using (true);
```

## 4. Configurar Auth (email)

En Supabase → Authentication → Providers:
- **Email** ya viene activado por defecto
- Puedes desactivar "Confirm email" en Settings → Auth si quieres acceso inmediato sin verificación en desarrollo

## 5. Deploy en Vercel

Añade las variables de entorno en Vercel (Settings → Environment Variables):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

---

## Flujo de uso

1. El usuario va a `/admin` → middleware lo redirige a `/admin/login`
2. Se registra o inicia sesión con email + contraseña
3. Al entrar, se crea automáticamente su primera calculadora
4. Puede crear más desde `/admin/calculadoras`
5. Cada calculadora tiene su propia URL `/calc/[slug]`
6. Los leads se guardan en Supabase y aparecen en `/admin/leads`
