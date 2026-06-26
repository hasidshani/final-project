# אורייתא — Torah Lessons Platform

A full-stack web application for browsing, creating, and registering for Torah lessons in the community.  
Built as a final project for the **Advanced Full Stack** course.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | _coming soon_ |
| Backend API | _coming soon_ |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| State management | Context API (auth) + Redux Toolkit (lessons) |
| HTTP client | Axios |
| Backend | Node.js + Express 5 + TypeScript |
| Database | MongoDB + Mongoose 9 |
| Authentication | JWT (access token 1h + refresh token 7d) + bcrypt |
| Validation | JOI |
| Security | Helmet + express-rate-limit |
| File upload | Multer (disk storage) |

---

## Features

- **Register / Login** — JWT authentication with refresh token rotation and session restore on page refresh
- **Browse lessons** — filter by category and city, all pages lazy-loaded for performance
- **Single lesson** — join a lesson, save to favorites, post comments
- **Create lesson** — validated form with optional image upload (multipart)
- **Dashboard** — personal view of joined lessons, created lessons, and saved favorites
- **Teacher profile** — public page showing all lessons by a specific creator
- **Protected routes** — redirect to login when unauthenticated, return to intended page after login
- **Rate limiting** — 100 req / 15 min globally, 10 req / 15 min on auth routes
- **Security headers** — Helmet middleware on all responses

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Clone the repo

```bash
git clone https://github.com/hasidshani/final-project.git
cd final-project
```

### 2. Backend

```bash
# Install backend dependencies
npm install

# Create environment file
cp server/.env.example server/.env
# Edit server/.env — fill in TOKEN_SECRET and DATABASE_URL at minimum

# Start backend in watch mode (port 3000)
npm run dev
```

### 3. Frontend

```bash
cd oraita-web

# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env
# .env already defaults to http://localhost:3000/api — no edit needed for local dev

# Start frontend (port 5173)
npm run dev
```

### 4. Open the app

```
http://localhost:5173
```

---

## Environment Variables

### Backend — `server/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost/oraita_db` |
| `TOKEN_SECRET` | JWT signing secret | `a_long_random_string` |
| `TOKEN_EXPIRATION` | Access token lifetime | `1h` |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token lifetime | `7d` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |
| `SERVER_URL` | Backend public URL (used to build image URLs) | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |

### Frontend — `oraita-web/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

---

## API Endpoints

Base URL: `http://localhost:3000/api`

Protected routes require the header:
```
Authorization: Bearer <accessToken>
```

### Users — `/api/users`

| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| `GET` | `/me` | ✅ | Get current logged-in user |
| `POST` | `/register` | ❌ | Register new user (JOI validated, rate limited) |
| `POST` | `/login` | ❌ | Login → returns `accessToken` + `refreshToken` |
| `POST` | `/logout` | ❌ | Invalidate refresh token |
| `POST` | `/refresh` | ❌ | Exchange refresh token for new token pair |
| `POST` | `/favorites/:lessonId` | ✅ | Add lesson to favorites |
| `DELETE` | `/favorites/:lessonId` | ✅ | Remove lesson from favorites |

### Lessons — `/api/lessons`

| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| `GET` | `/` | ❌ | Get all lessons (creator populated) |
| `POST` | `/` | ✅ | Create lesson — `multipart/form-data` (JOI validated) |
| `GET` | `/:id` | ❌ | Get single lesson (creator + participants populated) |
| `POST` | `/:id/join` | ✅ | Join lesson (checks capacity) |
| `DELETE` | `/:id` | ✅ | Delete lesson (creator only) |

### Comments — `/api/comments`

| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| `GET` | `/lesson/:lessonId` | ❌ | Get all comments for a lesson |
| `POST` | `/:lessonId` | ✅ | Add comment |
| `DELETE` | `/:id` | ✅ | Delete comment (owner only) |

---

## Data Models

### User
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required |
| `email` | String | required, unique |
| `password` | String | bcrypt hashed |
| `phone` | String | optional |
| `favorites` | ObjectId[] | refs to Lesson |
| `refreshTokens` | String[] | active refresh tokens |

### Lesson
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | required |
| `description` | String | required |
| `category` | Enum | `חסידות` `מוסר` `הלכה` `משנה` `גמרא` `פרשת שבוע` |
| `city` | Enum | `נתניה` `פרדס חנה` |
| `date` | String | required |
| `time` | String | required |
| `image` | String | full URL of uploaded file |
| `creator` | ObjectId | ref to User |
| `participants` | ObjectId[] | refs to User |
| `maxParticipants` | Number | default 50 |
| `rating` | Number | 0–5 |

### Comment
| Field | Type | Notes |
|-------|------|-------|
| `lesson` | ObjectId | ref to Lesson |
| `user` | ObjectId | ref to User |
| `text` | String | required |

---

## Project Structure

```
FinalProject/
├── server/                    ← Express backend (TypeScript)
│   ├── app.ts                 ← Express app + middleware stack
│   ├── server.ts              ← MongoDB connect + server start
│   ├── models/
│   │   ├── users.ts
│   │   ├── lessons.ts
│   │   └── comments.ts
│   ├── controllers/
│   │   ├── userController.ts
│   │   ├── lessonController.ts
│   │   └── commentController.ts
│   ├── routes/
│   │   ├── users_routes.ts
│   │   ├── lessons_routes.ts
│   │   └── comments_routes.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts  ← JWT verify → req.userId
│   │   ├── validate.ts        ← JOI wrapper
│   │   ├── upload.ts          ← Multer config
│   │   ├── rateLimiter.ts
│   │   ├── logger.ts
│   │   └── errorHandler.ts
│   └── validation/
│       ├── userValidation.ts
│       └── lessonValidation.ts
├── oraita-web/                ← React frontend (TypeScript + Vite)
│   └── src/
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── Dashboard.tsx
│       │   ├── AllLessons.tsx
│       │   ├── CreateLesson.tsx
│       │   ├── SingleLesson.tsx
│       │   └── TeacherProfile.tsx
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── Layout.tsx
│       │   ├── LessonCard.tsx
│       │   └── PrivateRoute.tsx
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── store/
│       │   ├── store.ts
│       │   └── lessonsSlice.ts
│       └── services/
│           └── api.ts         ← Axios instance + interceptors
└── uploads/                   ← Uploaded lesson images (local dev)
```

---

## Author

**Shani Hassid**  
Advanced Full Stack Development — Final Project, 2025–2026
