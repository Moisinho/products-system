# Products System — Gestión de Productos

Aplicación web para la **gestión de productos** con autenticación/autorización **JWT**, operaciones **CRUD** y generación de **reportes en PDF**.

- **Backend:** .NET 8 Web API · EF Core 8 · PostgreSQL · JWT · QuestPDF
- **Frontend:** Next.js 15 · TypeScript · Tailwind v4 · shadcn/ui · React Query
- **Infra:** Docker Compose (3 contenedores: `db`, `backend`, `frontend`)

---

## 🚀 Ejecutar (clonar y levantar)

Solo necesitas **Docker** (Docker Desktop o Engine + Compose v2). No hace falta instalar .NET, Node ni configurar nada.

```bash
git clone <url-del-repo> products-system
cd products-system
docker compose up --build
```

El proceso: construye las 3 imágenes → arranca PostgreSQL → espera a que esté sano → el backend **aplica migraciones y carga datos iniciales** automáticamente → arranca la API y el frontend. La primera vez tarda ~1–3 min.

### Abrir

| Servicio | URL |
|---|---|
| **Aplicación web** | http://localhost:3000 |
| API (base) | http://localhost:5080 |
| **Swagger** (probar la API) | http://localhost:5080/swagger |
| Health check | http://localhost:5080/health |

### Credenciales de demo (sembradas en la DB)

```
Correo:      admin@products.io
Contraseña:  Admin123!
```

> También puedes **registrar** un usuario nuevo desde la pantalla de registro.

---

## 🧩 Funcionalidad

**Backend (.NET 8 Web API)**
- Autenticación/Autorización con **JWT** (registro, login).
- **CRUD** de productos (`Id`, `Nombre`, `Descripción`, `Precio`, `Estado`, `UsuarioCreación`, `FechaCreación`, `UsuarioModificación`, `FechaModificación`).
- Endpoint de **reporte PDF** con **QuestPDF** (respeta los filtros activos).
- **Migraciones automáticas** + carga inicial de catálogos al arrancar.
- Listado con **filtros, búsqueda, paginación y orden** del lado del servidor.

**Frontend (Next.js 15)**
- Pantallas: **Inicio de sesión**, **Registro**, **Dashboard**, **Gestión de productos** (tabla con filtros + búsqueda instantánea + KPIs + paginación + acciones por fila + botón **Descargar PDF**) y **Formulario** de crear/editar.
- Diseño SaaS premium (paleta "slate", **light + dark mode**, fuente Geist), microinteracciones con Motion.

---

## 🗂️ Estructura

```
products-system/
├── docker-compose.yml      # 3 servicios + valores inline (cero config)
├── backend/                # .NET 8 Web API (EF Core, JWT, QuestPDF)
│   ├── Dockerfile
│   └── src/ProductsSystem.Api/
└── frontend/               # Next.js 15 (App Router, TS, Tailwind v4, shadcn)
    ├── Dockerfile
    └── src/
```

---

## 🔐 Seguridad

- **JWT** firmado con HS256, validando emisor/audiencia/expiración/firma; algoritmo **pinneado** (bloquea `alg=none`).
- **Autorización deny-by-default**: toda ruta de productos (incluido el **PDF**) exige token válido.
- Contraseñas con **BCrypt** (work factor 12); login sin enumeración de usuarios.
- **Cookie httpOnly** para el JWT en el frontend (patrón BFF): el token nunca es accesible por JavaScript → inmune a robo por XSS.
- DTOs que evitan *over-posting* (los campos de auditoría los pone el servidor); rate-limiting en login; CORS restringido; `pageSize` acotado.

> ⚠️ **Producción:** este proyecto incluye secretos de desarrollo **inline** en `docker-compose.yml` a propósito (para que `docker compose up` funcione sin pasos extra). En un entorno real, `Jwt__Secret` y las credenciales de la base de datos deben externalizarse y rotarse.

---

## 🛠️ Desarrollo con hot reload

### Opción A — Todo en Docker con hot reload (recomendada)

```bash
docker compose -f docker-compose.dev.yml up --build
```

`docker-compose.dev.yml` es **autónomo**: levanta db + backend + frontend igual que producción, pero con backend en `dotnet watch` y frontend en `next dev` (Turbopack). Editas el código en tu host y los cambios se reflejan en segundos, sin reconstruir imágenes. Comparte el mismo volumen de datos que producción, así que no se ejecutan ambos modos a la vez.

### Opción B — Apps fuera de Docker (solo la DB en contenedor)

```bash
# 1) Solo la base de datos
docker compose up -d db

# 2) Backend (requiere .NET 8 SDK — macOS Intel: build x64)
cd backend
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=productsdb;Username=products;Password=products_dev_pwd"
dotnet run --project src/ProductsSystem.Api      # http://localhost:5080

# 3) Frontend
cd frontend
echo "INTERNAL_API_URL=http://localhost:5080" > .env.local
pnpm install && pnpm dev                          # http://localhost:3000
```

---

## ⚙️ Comandos Docker útiles

```bash
docker compose logs -f backend     # ver migraciones / seed / errores
docker compose ps                  # estado de los 3 servicios
docker compose down                # parar (conserva la base de datos)
docker compose down -v             # parar y reiniciar la DB desde cero
```
