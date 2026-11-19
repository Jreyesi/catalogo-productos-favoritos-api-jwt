# Guion de video a dos voces

Catálogo de Productos y Favoritos · Miguel Peñafiel y Jackson Reyes

Duración total: 12:00

## Regla de ritmo

- Hablar a 120-130 palabras por minuto y dejar pausas de 2 a 3 segundos al cambiar de pantalla.
- Miguel explica base de datos, CRUD, frontend y evidencia visual; Jackson explica autenticación, roles, favoritos y pruebas.
- Si la grabación queda corta, extiende el segmento 8; si queda larga, recorta el segmento 10.

## 00:00 - 00:45 · Introducción

- Miguel (00:00 - 00:22): "Hola, somos Miguel Angel Peñafiel y Jackson Enrique Reyes. Hoy presentamos el proyecto Catálogo de Productos y Favoritos: una API REST con PostgreSQL, autenticación JWT, roles, favoritos privados y un frontend React. Todo está en un repositorio público y se puede reproducir paso a paso desde el README."
- Jackson (00:22 - 00:45): "Gracias, Miguel. El objetivo es mostrar una entrega completa y verificable: base de datos, endpoints, reglas de error, pruebas automatizadas y evidencia visual. Vamos a alternar la explicación para que se vea tanto la parte del servidor como la experiencia final en el navegador. Empezamos por el punto de partida."
- Mostrar: diapositiva inicial con título, integrantes y repositorio; después abrir `https://github.com/Jreyesi/catalogo-productos-favoritos-api-jwt` y dejar visible el README.

## 00:45 - 01:45 · Stack y reproducción

- Miguel (00:45 - 01:15): "La aplicación usa Node.js con Express en el servidor y PostgreSQL como base de datos. El acceso a datos se hace con consultas parametrizadas, las contraseñas se guardan con bcrypt y las sesiones son tokens JWT firmados con expiración. El frontend está hecho con React y Vite; al compilarlo, Express lo sirve como contenido estático y aplica un respaldo para las rutas de la aplicación."
- Jackson (01:15 - 01:45): "Para reproducir el proyecto se clona el repositorio, se ejecuta `npm ci`, se compila el frontend y se copia `.env.example` a `.env`. Luego se levanta Docker, se aplican el esquema y la semilla, se crea el usuario administrador y se inicia el servidor. La dificultad que encontramos fue que el PostgreSQL nativo ocupa el puerto 5432; la resolvimos usando `PGPORT=5433` en el `.env` local y dejando 5432 en el ejemplo."
- Mostrar: README, `.env.example`, `docker-compose.yml` y una terminal con `docker compose ps` y `npm start`.

## 01:45 - 03:00 · Base de datos y semilla

- Miguel (01:45 - 02:20): "La base de datos define tres tablas. `usuarios` guarda correo único, nombre, rol y el hash de la contraseña. `productos` guarda nombre, descripción, categoría y precio, con una restricción que exige precios mayores que cero. `favoritos` relaciona usuarios con productos y declara única la tupla usuario y producto, de modo que no existen duplicados."
- Jackson (02:20 - 02:45): "La semilla carga cinco suplementos ficticios: creatina, proteína, BCAA, quemador y pre entreno. Cada producto tiene categoría y precio, y sirve para probar listado, filtros, favoritos y escrituras administrativas sin depender de datos externos ni de servicios de terceros."
- Miguel (02:45 - 03:00): "Los scripts `db:init` y `db:admin` son idempotentes, así que se pueden ejecutar varias veces sin duplicar información. Ahora vemos el resultado en la API pública."
- Mostrar: `db/schema.sql`, `db/seed.sql`, `src/data/productos.js:5-14` para señalar las consultas parametrizadas, `docker compose up -d`, `npm run db:init` y `GET http://localhost:3000/api/productos`.

## 03:00 - 04:15 · CRUD de productos

- Miguel (03:00 - 03:35): "El catálogo expone listado y detalle públicos. El listado admite filtros opcionales por categoría; la creación responde 201 con el producto creado, la edición responde 200 con el producto actualizado y el borrado responde 204 sin cuerpo. Si el identificador no existe, la respuesta es 404."
- Jackson (03:35 - 04:00): "Las escrituras requieren token JWT y rol de administrador. Usamos el usuario creado por `npm run db:admin` para obtener el token y abrimos la petición de Postman. Fíjense en que el cuerpo no incluye el rol: el servidor lo toma de la base de datos, no de lo que envíe el cliente."
- Miguel (04:00 - 04:15): "Seguimos una petición completa: Postman envía el cuerpo, la ruta aplica los middleware, el controlador valida, la capa de datos ejecuta la consulta parametrizada y llega el JSON. Después de crear, editamos el precio y borramos el producto temporal."
- Mostrar: en Postman `GET /api/productos`, `POST /api/productos`, `PUT /api/productos/:id` y `DELETE /api/productos/:id`; abrir `src/routes/productos.js:7-11`, `src/controllers/productos.js:29-39` y `src/data/productos.js:22-28`; seguir el orden Postman → ruta → controlador → base de datos → JSON; resaltar 201, 200 y 204.

## 04:15 - 05:30 · Autenticación y roles

- Jackson (04:15 - 04:50): "El registro permite crear cuentas nuevas con rol usuario, sin importar los campos que lleguen en el cuerpo, porque el servidor asigna el rol. El login compara la contraseña con el hash almacenado y, si coincide, devuelve un token JWT firmado con una clave privada y una expiración configurable. El middleware lee la cabecera Bearer, verifica la firma y coloca el usuario en la petición."
- Miguel (04:50 - 05:10): "Nunca guardamos contraseñas en texto plano. En la tabla solo aparece `password_hash`, y las respuestas de registro y login devuelven datos públicos del usuario sin ese campo."
- Jackson (05:10 - 05:30): "El middleware de administrador se aplica solo a las rutas de escritura del catálogo. Por eso una petición sin token responde 401, y un usuario normal que intenta crear productos responde 403. Con el token de administrador, la misma petición responde 201."
- Mostrar: `POST /api/auth/registro`, `POST /api/auth/login`, payload del JWT en jwt.io o decodificado, `src/utils/token.js:4-8`, `src/controllers/auth.js:44-49`, `src/middlewares/auth.js:11-20` y `src/routes/productos.js:9-11`; terminar con la comparación 403 con usuario y 201 con admin.

## 05:30 - 06:45 · Favoritos

- Jackson (05:30 - 06:00): "Los favoritos son una relación entre el usuario del token y un producto. No se acepta un identificador de usuario en el cuerpo, porque la identidad se toma siempre del token verificado. El alta responde 201; repetir el mismo producto responde 409; intentar marcar un producto inexistente responde 404."
- Miguel (06:00 - 06:25): "El listado devuelve solo los productos del usuario autenticado y el borrado responde 204. En la base de datos se ve la fila de `favoritos` con `usuario_id` y `producto_id`; al quitar el favorito, esa fila desaparece."
- Jackson (06:25 - 06:45): "La colección de pruebas usa dos usuarios distintos para demostrar que lo que guarda uno no aparece en el otro. Además, si eliminamos un producto con favoritos asociados, la restricción en cascada limpia todas las referencias automáticamente."
- Mostrar: `POST /api/favoritos` con `{ "productoId": 1 }`, `GET /api/favoritos`, `DELETE /api/favoritos/1`, la respuesta 409 repetida, `src/data/favoritos.js:3-13`, `src/data/favoritos.js:25-30` y `db/schema.sql:19-25`.

## 06:45 - 08:00 · Pruebas automatizadas

- Jackson (06:45 - 07:20): "La colección Postman tiene 29 peticiones y 30 aserciones. Cubre registro, login, token vencido, sin token, roles, CRUD, filtros, validaciones y favoritos. El entorno versionado es solo de ejemplo y no contiene credenciales reales."
- Miguel (07:20 - 07:45): "El runner `run-tests.ps1` lee el archivo local `.env`, inyecta las credenciales como variables de entorno y ejecuta Newman contra la API en `http://localhost:3000/api`. Así podemos repetir la misma batería en una copia limpia del repositorio sin editar la colección."
- Jackson (07:45 - 08:00): "El resultado es 29 de 29 y 30 de 30 con cero fallos. Ahora reiniciamos Node y repetimos la consulta: los productos siguen en PostgreSQL."
- Mostrar: terminal con `npm run test:postman`; en Postman abrir `Precio invalido` para el 422 y `Campos vacios` para el 400; archivo `entrega/resultado-newman.txt`; luego `Ctrl+C`, `npm start` y `GET /api/productos` otra vez.

## 08:00 - 09:30 · Frontend bento

- Miguel (08:00 - 08:40): "El frontend sigue una composición tipo bento grid con marco negro y separaciones gruesas. La columna izquierda es el panel gris de marca con título, filtros y llamada a la acción. La columna derecha se divide en una cabecera lila, una fila con tarjeta blanca, burbuja gris y tarjeta violeta, y una fila inferior naranja y malva."
- Jackson (08:40 - 09:10): "Las imágenes son envases ilustrados de los cinco productos: creatina, proteína, BCAA, quemador y pre entreno. Se sirven desde `frontend/public/productos` como archivos SVG locales, así que no dependemos de enlaces externos y el proyecto funciona sin conexión una vez compilado."
- Miguel (09:10 - 09:30): "Los filtros por categoría, el botón de favorito en cada bloque y el panel lateral siguen funcionando dentro de esta composición. Ahora vemos el flujo real desde el navegador."
- Mostrar: `http://localhost:3000`; hacer scroll desde el marco negro hasta las utilidades; señalar el panel gris, la cabecera lila, la tarjeta violeta y la tarjeta malva.

## 09:30 - 10:45 · Flujo completo de usuario

- Jackson (09:30 - 10:00): "Primero creamos una cuenta desde el formulario de acceso. Después iniciamos sesión con ese correo y contraseña. El frontend guarda el token en `localStorage` y muestra el nombre del usuario en la cabecera; a partir de ese momento las peticiones de favoritos viajan con la cabecera Bearer."
- Miguel (10:00 - 10:25): "Ahora marcamos un producto como favorito desde una de las tarjetas del bento. El botón cambia a Guardado y el producto aparece en el panel Mis favoritos con su imagen. Si repetimos la acción, la petición respondería 409 y el frontal mantiene el estado coherente."
- Jackson (10:25 - 10:45): "También podemos filtrar por categoría, quitar un favorito y verificar que la lista baja a cero. Con esto se cierra el recorrido completo: registro, login, catálogo, filtro y favoritos."
- Mostrar: navegador en vivo; formulario de registro, login, botón Favorito, panel Mis favoritos, filtro Hipertrofia y botón Quitar.

## 10:45 - 11:40 · Evidencias y entrega

- Miguel (10:45 - 11:10): "La carpeta `entrega` concentra la documentación y las pruebas: `entrega.html`, el PDF con resumen, endpoints, errores y resultados, el archivo de Newman y las capturas del frontend y de la API pública."
- Jackson (11:10 - 11:30): "También está el guion de este video en `entrega/guion-video.md`, escrito para dos voces con tiempos, texto y lo que se muestra en pantalla. El video se graba siguiendo ese guion, sin pistas de audio generadas automáticamente."
- Miguel (11:30 - 11:40): "El historial conserva un pull request por funcionalidad con la autoría real de cada integrante y el commit final de la entrega en `main`."
- Mostrar: carpeta `entrega`, PDF abierto, capturas y pestaña de GitHub con la lista de commits o pull requests.

## 11:40 - 12:00 · Cierre

- Jackson (11:40 - 11:52): "Con esto damos por terminada la entrega: una API reproducible, probada y documentada, con un frontend que aplica la composición de referencia y usa imágenes acordes a los suplementos."
- Miguel (11:52 - 12:00): "Gracias por ver la demostración. El repositorio público queda disponible para revisar cada paso."
- Mostrar: diapositiva final con título, integrantes, repositorio y el identificador del commit que aparece en el PDF de entrega; mantener visible hasta el segundo 12:00.
