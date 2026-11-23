# 🏋️ FitU — API (gym-app)

API REST para una aplicación de fitness con **seguimiento de comidas, análisis de calorías con IA, rutinas de entrenamiento generadas por IA** y una **red social** (posts, stories, likes y comentarios).

[![CI](https://github.com/Diego0267523/gym-app/actions/workflows/ci.yml/badge.svg)](https://github.com/Diego0267523/gym-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-mysql2-4479A1?logo=mysql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-realtime-010101?logo=socket.io)
![Tests](https://img.shields.io/badge/tests-Jest-C21325?logo=jest&logoColor=white)

> El cliente web/móvil está en el repositorio [`frontend`](https://github.com/Diego0267523/frontend).

## ✨ Características

- **Autenticación** con JWT y contraseñas hasheadas con bcrypt.
- **Seguimiento de comidas** con totales diarios de calorías y macros.
- **Análisis de imágenes con IA** (Gemini / OpenAI) para estimar calorías de una foto.
- **Generación de rutinas** de ejercicio y chat con asistente de IA.
- **Red social**: posts, stories, likes, comentarios y notificaciones.
- **Tiempo real** con Socket.io.
- **Subida de imágenes** a Cloudinary (optimizadas con Sharp).

## 🛡️ Seguridad

| Capa | Implementación |
|---|---|
| Rate limiting | API general 100 req/15 min · login 5 intentos/15 min · IA 10 req/hora · uploads 20/hora |
| Validación | Esquemas Joi con sanitización y validación de tipos y rangos |
| Headers | Helmet con Content Security Policy |
| Auth | JWT con expiración + middleware en rutas protegidas |
| Logs | Winston estructurado (archivos separados para errores) |

## 🏗️ Arquitectura

```
src/
├── config/        # BD, logger, Cloudinary
├── controllers/   # Lógica de negocio
├── middlewares/   # Auth, upload, rate limiting, validación
├── models/        # Acceso a datos MySQL
├── routes/        # Definición de endpoints
├── migrations/    # Cambios de esquema SQL
└── app.js         # Punto de entrada
```

## 🚀 Puesta en marcha

```bash
git clone https://github.com/Diego0267523/gym-app.git
cd gym-app
npm install
cp .env.example .env   # completa tus valores
npm start
```

### Variables de entorno

```env
PORT=9090
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=gym_app
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:3000
```

### Tests

```bash
npm test
```

## 📝 Endpoints

🔒 = requiere `Authorization: Bearer <token>` · 🔓 = público · 🔓* = token opcional

Health checks: `GET /health` y `GET /status`.

### Autenticación — `/api/auth`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/register` | 🔓 | Registro de usuario |
| POST | `/login` | 🔓 | Inicio de sesión (devuelve JWT) |
| PUT | `/change-password` | 🔒 | Cambiar contraseña |
| GET | `/profile` | 🔒 | Perfil del usuario autenticado |
| PUT | `/profile/avatar` | 🔒 | Subir avatar (multipart, `avatar`) |
| GET | `/notifications` | 🔒 | Listar notificaciones |
| GET | `/notifications/unread` | 🔒 | Cantidad de no leídas |
| PUT | `/notifications/:id/read` | 🔒 | Marcar una como leída |
| PUT | `/notifications/read-all` | 🔒 | Marcar todas como leídas |

### Comidas — `/api/food`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/entries` | 🔒 | Crear entrada de comida (con imagen opcional) |
| GET | `/entries` | 🔒 | Entradas del día |
| GET | `/totals` | 🔒 | Totales diarios de calorías y macros |
| GET | `/weekly-totals` | 🔒 | Totales de la semana |
| DELETE | `/entries/:id` | 🔒 | Eliminar entrada |

### IA — `/api/ai`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/calories` | 🔒 | Estimar calorías desde una foto (multipart, `image`) |
| POST | `/routine` | 🔒 | Generar rutina de ejercicio |
| POST | `/chat` | 🔒 | Chat con el asistente |

### Posts — `/api/posts`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/` | 🔒 | Crear post (con imagen) |
| GET | `/` | 🔓* | Listar posts (paginado) |
| POST | `/:id/like` | 🔒 | Dar/quitar like |
| GET | `/:id/comments` | 🔓 | Listar comentarios |
| POST | `/:id/comments` | 🔒 | Comentar |
| DELETE | `/:id` | 🔒 | Eliminar post propio |

### Stories — `/api/stories`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/` | 🔒 | Crear story (con imagen) |
| GET | `/` | 🔓 | Stories activas |
| GET | `/user/:userId` | 🔓 | Stories de un usuario |
| DELETE | `/:id` | 🔒 | Eliminar story |

### Entrenamientos — `/api/training`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/create` | 🔒 | Crear entrenamiento |
| GET | `/` | 🔒 | Listar entrenamientos |

### Tiempo real (Socket.io)
Conexión autenticada con el JWT en `auth.token`. Eventos del cliente: `join_post`, `leave_post`, `like_post`, `comment_post` y `ask_ai`. Eventos del servidor: `post_like_updated`, `post_comment_added`, `ai_response` y `ai_error`.

## 📄 Licencia

[MIT](LICENSE)
