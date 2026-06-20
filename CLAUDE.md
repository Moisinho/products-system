# CLAUDE.md

Guía para trabajar en este repositorio. Sistema de **gestión de productos**: autenticación JWT, CRUD de productos, reporte PDF y despliegue por Docker.

## Stack

- **Backend:** .NET 8 Web API + EF Core 8 (Npgsql) + JWT (HS256) + QuestPDF + FluentValidation + Swagger.
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (Radix) + React Query + react-hook-form/zod + nuqs + Motion + Geist.
- **DB:** PostgreSQL 16 (contenedor).
- **Orquestación:** Docker Compose — 3 servicios (`db`, `backend`, `frontend`).

## Arrancar todo (cero configuración)

```bash
docker compose up --build      # PRODUCCIÓN: db -> backend (migra + seed) -> frontend
```

### Modo desarrollo con hot reload

```bash
docker compose -f docker-compose.dev.yml up --build
```

`docker-compose.dev.yml` es AUTÓNOMO (define db + backend + frontend, igual que el de producción): levanta todo por sí solo. La diferencia es que backend usa `dotnet watch` y frontend `next dev` (Turbopack), con el código montado por bind-mount → cambios reflejados en ~segundos sin reconstruir imágenes (file-watching por polling para que funcione a través del bind-mount en macOS). Comparte `name: products-system` y el volumen `db_data` con producción, así que se ejecuta uno u otro modo, no ambos a la vez. El `docker compose up` normal sigue siendo producción.

| Servicio | URL |
|---|---|
| App web | http://localhost:3000 |
| API | http://localhost:5080 |
| Swagger | http://localhost:5080/swagger |
| Health | http://localhost:5080/health |

**Login de demo (seed):** `admin@products.io` / `Admin123!`

> No hay archivo `.env`: todos los valores de desarrollo van **inline** en `docker-compose.yml` para que `git clone && docker compose up` funcione sin pasos extra. En producción esos secretos (`Jwt__Secret`, credenciales de DB) deben externalizarse y rotarse.

## Comandos útiles

```bash
docker compose logs -f backend          # ver migraciones/seed/errores
docker compose down                     # parar (conserva el volumen)
docker compose down -v                  # parar y BORRAR la DB (re-migra+seed al subir)
docker compose up -d --build backend    # reconstruir solo el backend

# Frontend (dev local)
cd frontend && pnpm install && pnpm dev # http://localhost:3000  (usa INTERNAL_API_URL)
pnpm build && pnpm typecheck

# Backend: requiere .NET 8 SDK (macOS Intel → build x64).
#   brew install dotnet@8   |   o usar un contenedor SDK efímero:
dn() { docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/dotnet/sdk:8.0 "$@"; }
# Nueva migración (desde ./backend):
dn dotnet ef migrations add <Nombre> --project src/ProductsSystem.Api/ProductsSystem.Api.csproj --output-dir Migrations
```

> **Nota macOS Intel (x86_64):** instalar el **.NET 8 SDK x64** (no arm64). Para solo ejecutar el proyecto NO se necesita .NET local: el backend compila dentro de Docker.

## Arquitectura

### Backend (`backend/src/ProductsSystem.Api/`, proyecto único, capas por carpeta)
- `Entities/` `User`, `Product` · `Data/` `AppDbContext`, `DbSeeder`, `DesignTimeDbContextFactory`
- `DTOs/` request/response (distintos de las entidades) · `Services/` token, hasher, productos, PDF
- `Validators/` FluentValidation · `Controllers/` `AuthController`, `ProductsController` · `Middleware/` ProblemDetails
- `Program.cs`: EF + JWT + CORS + rate-limit + Swagger + migrate/seed con retry al arrancar.

### Frontend (`frontend/src/`)
- `app/(auth)/` login, register · `app/(dashboard)/` dashboard, products (list/new/[id]/edit)
- `app/api/` **BFF**: `auth/{login,register,logout,session}` + `backend/[...path]` (proxy con Bearer)
- `components/` (`ui/` shadcn, `layout/`, `products/`, `common/`) · `hooks/` · `lib/` (api, auth, utils) · `schemas/` zod

## Convenciones

- **Auth (BFF + cookie httpOnly):** el navegador solo llama a `/api/*` de Next (mismo origen). Las Route Handlers guardan el JWT en una cookie **httpOnly** y reenvían `Authorization: Bearer` al backend por `INTERNAL_API_URL` (`http://backend:8080`). El token nunca toca JavaScript del cliente. `middleware.ts` protege rutas (solo UX); **el backend es el guardián real**.
- **Auditoría server-side:** `UsuarioCreacion/Modificacion` y `Fecha*` SIEMPRE los setea el backend desde el claim `sub` del JWT y `DateTime.UtcNow`. Nunca desde el cliente (DTOs anti over-posting).
- **Fechas en UTC** (Npgsql exige `DateTimeKind.Utc`); el frontend formatea a local.
- **Seguridad por defecto:** política global `deny-by-default`; `[Authorize]` en todo `products` (incluido el PDF); `ValidAlgorithms = HS256` (mata `alg=none`); rate-limit en `auth`; `pageSize` ≤ 100; `sortBy` por allowlist.
- **Diseño:** paleta "slate" (`#06141B`…`#CCD0CF`) en tokens CSS (`globals.css`), light + dark, **sin colores default de shadcn**. Fuente Geist.

## Puertos

`3000` frontend · `5080` → `8080` backend · `5432` postgres (publicado solo para dev local).
