# Catálogo de Productos y Favoritos — API REST + JWT + React

API REST con Node.js/Express, PostgreSQL, autenticación JWT, autorización por roles y un
frontend React + Vite con diseño *bento grid*. Proyecto académico con datos ficticios.

## Integrantes

| Integrante | GitHub | Aportes principales |
|---|---|---|
| Jackson Enrique Reyes Ibarra | `@Jreyesi` | Arranque del repositorio, middleware JWT y de roles, registro/login, script del administrador, colección Postman y ejecución con Newman. |
| Miguel Angel Peñafiel Cadena | `@mpenafielc5` | Esquema SQL y semilla, capa de datos y CRUD de productos, favoritos con aislamiento por usuario, componentes React y estilos *bento grid*. |

## Propósito

Gestionar un catálogo de suplementos de gimnasio y una lista personal de favoritos. El
catálogo es público; las modificaciones requieren rol de administrador; los favoritos
son privados por usuario y se identifican desde el JWT verificado, nunca desde el cuerpo
de la petición.

## Elección de base de datos

**PostgreSQL 16** (imagen `postgres:16-alpine` en Docker). El modelo es relacional: un
usuario tiene muchos favoritos, un producto aparece en muchos favoritos y el par
`(usuario, producto)` es único. PostgreSQL permite declarar eso en SQL con
`FOREIGN KEY`, `UNIQUE` y `ON DELETE CASCADE`, en lugar de replicar la integridad en
código. Todas las consultas usan placeholders `$1, $2, ...` (consultas parametrizadas).

MongoDB también era válido según la consigna, pero habría exigido validar duplicados,
existencia de referencias y limpieza manual al borrar un producto; además de limitar
explícitamente los campos aceptados para evitar *mass assignment*.

## Requisitos

- Node.js 20 o superior (probado con v24.16.0) y npm.
- Docker Desktop en ejecución.
- Git y, opcionalmente, Postman de escritorio.
- No se necesita `psql` en el host: los scripts usan el driver `pg`.

## Instalación

```powershell
git clone https://github.com/Jreyesi/catalogo-productos-favoritos-api-jwt.git
cd catalogo-productos-favoritos-api-jwt
npm ci
Copy-Item .env.example .env
cd frontend
npm ci
cd ..
```

Edita `.env` con tus valores locales. **Nunca subas `.env`**: está en `.gitignore`.

> En el equipo de desarrollo había un PostgreSQL nativo escuchando en el puerto 5432,
> por lo que el `.env` local usa `PGPORT=5433`. En una máquina libre, `5432` funciona.

## Variables de entorno

| Variable | Uso |
|---|---|
| `PORT` | Puerto de la API (3000 por defecto). |
| `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | Conexión a PostgreSQL. |
| `JWT_SECRET` | Secreto para firmar y verificar tokens. Cambiar en local. |
| `JWT_EXPIRES_IN` | Vigencia del token (`1h`). Para probar expiración se puede usar `1s`. |
| `ADMIN_NOMBRE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Datos del administrador creado por script. |

## Inicialización de datos y del administrador

```powershell
docker compose up -d
npm run db:init
npm run db:admin
```

- `db:init` aplica `db/schema.sql` y `db/seed.sql` (idempotentes): 5 suplementos ficticios.
- `db:admin` crea (o actualiza) un usuario con rol `admin` usando las variables `ADMIN_*`.
- El registro público **siempre** crea usuarios con rol `usuario`: el campo `rol` del
  cuerpo se ignora. No existe ruta para autoasignarse `admin`.

## Ejecución

```powershell
npm run dev                       # API en http://localhost:3000
cd frontend; npm run dev          # UI en http://localhost:5173 (proxy /api)
```

Para servir el frontend desde Express:

```powershell
cd frontend
npm run build
cd ..
npm start                         # http://localhost:3000 sirve la API y la UI
```

## Rutas

Prefijo `/api`. Todas las respuestas son JSON, salvo el `204` (sin cuerpo).

| Método | Ruta | Acceso | Cuerpo / resultado |
|---|---|---|---|
| POST | `/auth/registro` | Público | `{nombre, email, password}` → 201 con usuario (sin contraseña). |
| POST | `/auth/login` | Público | `{email, password}` → 200 con `token`, `tipo` y usuario. |
| GET | `/productos` | Público | 200 con lista; filtro opcional `?categoria=Hipertrofia`. |
| GET | `/productos/:id` | Público | 200 con producto o 404. |
| POST | `/productos` | Admin | `{nombre, descripcion, categoria, precio}` → 201. |
| PUT | `/productos/:id` | Admin | Mismos campos → 200 o 404. |
| DELETE | `/productos/:id` | Admin | 204 o 404. |
| GET | `/favoritos` | Autenticado | 200 con los productos favoritos del usuario del token. |
| POST | `/favoritos` | Autenticado | `{productoId}` → 201; 409 si ya existe; 404 si el producto no existe. |
| DELETE | `/favoritos/:productoId` | Autenticado | 204; 404 si ese usuario no lo tiene. |

Ejemplo de error: `{ "error": "El correo ya está registrado" }`.

### Criterio de códigos de error

| Código | Significado |
|---|---|
| 400 | Formato inválido: campo ausente/vacío, correo mal formado, `precio` no numérico, identificador no entero positivo. |
| 422 | Regla de negocio incumplida con formato válido: `precio <= 0` o contraseña menor a 8 caracteres. |
| 401 | Sin token, token malformado, con firma inválida o vencido; también credenciales incorrectas. |
| 403 | Token válido pero rol insuficiente. |
| 404 | Recurso inexistente o favorito ajeno. |
| 409 | Conflicto: correo duplicado o favorito duplicado. |
| 500 | Error interno; el mensaje no expone detalles ni secretos. |

### Favoritos al eliminar un producto

`favoritos.producto_id` referencia `productos.id` con `ON DELETE CASCADE`. Al borrar un
producto se eliminan automáticamente todos sus favoritos, de todos los usuarios. La
tupla `(usuario_id, producto_id)` es única, por lo que no hay duplicados.

## Pruebas

### Postman

1. Importar `postman/Catalogo_API.postman_collection.json` y
   `postman/Entorno.postman_environment.json`.
2. Completar `adminPassword` y `jwtSecret` en el entorno con los valores locales de `ADMIN_PASSWORD` y `JWT_SECRET` de `.env`.
3. Ejecutar la colección completa (29 peticiones, 30 aserciones). Cubre registro,
   duplicados, login correcto/incorrecto, token vencido, sin token, 403 por rol, CRUD,
   filtros, validaciones, favoritos, aislamiento A/B y persistencia.

### Newman (reproducible por terminal)

Con la API en ejecución:

```powershell
npm run test:postman
```

El script `postman/run-tests.ps1` lee `.env` e inyecta las credenciales como variables
de entorno de Newman, por lo que el entorno versionado no contiene secretos.

### Persistencia

Detén Node (`Ctrl+C`), vuelve a `npm start` y repite `GET /api/productos`: los 5
productos siguen ahí porque están en el volumen de PostgreSQL, no en memoria.

## Estructura

```text
db/            esquema y semilla SQL
scripts/       inicialización de BD y administrador
src/config/    pool de PostgreSQL
src/data/      acceso a datos (consultas parametrizadas)
src/controllers/  lógica de peticiones y respuestas
src/middlewares/  verificación de JWT y rol
src/routes/    definición de rutas
postman/       colección, entorno de ejemplo y runner
frontend/      aplicación React + Vite
```

## Historial colaborativo

Cada funcionalidad se desarrolló en su propia rama, con un commit firmado por su autor
real y un PR fusionado en `main`: catálogo (Miguel), autenticación (Jackson), favoritos
(Miguel), pruebas (Jackson) y frontend (dos commits, uno por integrante).

## Recursos

- Documentación oficial de Node.js, Express, PostgreSQL, `pg`, `jsonwebtoken`,
  `bcryptjs`, Postman/Newman, React y Vite.
- Guía de JWT (RFC 7519) para el diseño del payload y la verificación de `exp`.
