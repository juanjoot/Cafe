## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
# Cafe: backend de cafetería

Backend en NestJS organizado como monorepo. El API Gateway expone HTTP y delega las operaciones de autenticación, productos y pedidos a servicios mediante RabbitMQ. Auth, productos, pedidos e inventario guardan sus datos en MongoDB.

## Servicios

| Aplicación | Responsabilidad | Transporte y dependencias |
| --- | --- | --- |
| `api-gateway` | API pública: registro/login, productos y pedidos. Protege con JWT las operaciones de productos y pedidos. | HTTP, por defecto en `3000`; publica solicitudes por RabbitMQ. |
| `auth-service` | Registro e inicio de sesión; usuarios y tokens JWT. | RabbitMQ, cola `auth-service.q`; MongoDB y `JWT_SECRET`. |
| `product-service` | Crear, consultar, actualizar y eliminar productos de café. | RabbitMQ, cola `product-service.q`; MongoDB. |
| `order-service` | Crear y consultar pedidos; solicita la reserva de inventario y procesa el resultado. | RabbitMQ, cola `order-service.q`; MongoDB. |
| `inventory-service` | Reservar existencias y comunicar al servicio de pedidos si la reserva se completó. | RabbitMQ, cola `inventory-service.q`; MongoDB. |
| `payment-service` | Servicio HTTP inicial; expone su controlador propio. | HTTP; sin dependencias externas configuradas. |
| `shipping-service` | Servicio HTTP inicial; expone su controlador propio. | HTTP; sin dependencias externas configuradas. |
| `notification-service` | Servicio HTTP inicial; expone su controlador propio. | HTTP; sin dependencias externas configuradas. |

Payment, shipping y notification aún no están conectados al flujo de pedidos por RabbitMQ. Sus controladores HTTP son independientes de las operaciones del gateway.

## Preparación local

Requisitos: Node.js/npm y Docker Compose.

```bash
npm install
docker compose up -d mongo rabbitmq
```

Crea un archivo `.env` en la raíz del repositorio con las variables que esperan las aplicaciones:

```dotenv
RABBITMQ_URL=amqp://guest:guest@localhost:5672
AUTH_MONGO_URI=mongodb://localhost:27017/cafe_auth
ORDER_MONGO_URI=mongodb://localhost:27017/cafe_orders
PRODUCT_MONGO_URI=mongodb://localhost:27017/cafe_products
INVENTORY_MONGO_URI=mongodb://localhost:27017/cafe_inventory
JWT_SECRET=cambia-esto-por-un-secreto-local
JWT_EXPIRES_IN=3600
```

RabbitMQ y MongoDB se ejecutan en los puertos `5672` y `27017`. La consola de administración de RabbitMQ queda en <http://localhost:15672> (usuario `guest`, contraseña `guest`).

## Arranque en desarrollo

Ejecuta cada comando en una terminal distinta, desde la raíz del repositorio. Primero inicia la infraestructura; luego los consumidores RabbitMQ y, al final, el gateway.

```bash
npx nest start auth-service --watch
npx nest start product-service --watch
npx nest start inventory-service --watch
npx nest start order-service --watch
npx nest start api-gateway --watch
```

El gateway queda disponible en <http://localhost:3000>. Puede cambiarse con `PORT`, por ejemplo `PORT=3100 npx nest start api-gateway --watch`.

Los servicios HTTP iniciales se inician también en terminales separadas:

```bash
port=3001 npx nest start payment-service --watch
port=3002 npx nest start shipping-service --watch
port=3003 npx nest start notification-service --watch
```

En estos tres puntos de entrada, el código actualmente lee `process.env.port` (minúsculas) y usa `3000` si no se define. Por eso los ejemplos usan `port` en minúsculas y puertos distintos para evitar conflictos con el gateway y entre sí.

## API del gateway

| Método | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/auth/register` | Público |
| `POST` | `/auth/login` | Público |
| `POST` | `/products` | JWT |
| `GET` | `/products` | JWT |
| `GET` | `/products/:id` | JWT |
| `PATCH` | `/products/:id` | JWT |
| `DELETE` | `/products/:id` | JWT |
| `POST` | `/orders` | JWT |
| `GET` | `/orders/:id` | JWT |

El flujo de pedidos guarda el pedido inicialmente como pendiente de inventario. Inventory emite un evento de reserva y order actualiza su estado según el resultado.

## Compilación y pruebas

```bash
npx nest build api-gateway
npm test -- --runInBand
```

El CLI de Nest permite compilar otra aplicación sustituyendo `api-gateway` por el nombre registrado en `nest-cli.json`. Los scripts de prueba e2e del `package.json` todavía apuntan a una aplicación `coffee-shop-backend` que no está presente en el árbol actual; por eso no se documenta `npm run test:e2e` como comando listo para usar.
