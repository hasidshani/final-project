# Oraita (אורייתא) — Project Progress

## What This Project Is
A Torah lessons platform called **אורייתא**. Users can browse, register for, create, and review Jewish Torah lessons.
- **Solo project** by Shani Hassid
- **Course:** Advanced Full Stack — Final Project
- **Grade rubric:** See `Adv. FullStack - Final Project Guide.pdf`

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite (in `oraita-web/`) |
| Backend | Node.js + Express 5 + TypeScript (in `server/`) |
| Database | MongoDB (local via Compass) + Mongoose 9 |
| Auth | JWT (access token 1h + refresh token 7d) + bcrypt |
| State | Context API (auth) + Redux Toolkit (lessons) |
| HTTP client | Axios |
| Security | Helmet + express-rate-limit + JOI validation |

---

## How to Run

### Backend (port 3000)
```bash
# From project root
npm run dev
```
Reads env from `server/.env`.

### Frontend (port 5173)
```bash
cd oraita-web
npm run dev
```

### MongoDB
Must be running locally (MongoDB Compass). Connection: `mongodb://localhost/oraita_db`

---

## Project Folder Structure

```
FinalProject/
├── CLAUDE.md                        ← tells Claude to read this file
├── PROGRESS.md                      ← this file
├── package.json                     ← backend scripts + dependencies
├── tsconfig.json                    ← backend TypeScript config
├── server/
│   ├── .env                         ← secrets (never commit)
│   ├── .env.example                 ← committed placeholder
│   ├── app.ts                       ← Express app + all middleware
│   ├── server.ts                    ← MongoDB connect + server start
│   ├── types/
│   │   └── express.d.ts             ← extends Request with userId?: string
│   ├── models/
│   │   ├── users.ts                 ← User schema (name, email, password, phone, favorites, refreshTokens)
│   │   ├── lessons.ts               ← Lesson schema (title, description, category, city, date, time, image, creator, participants, maxParticipants, rating)
│   │   └── comments.ts              ← Comment schema (lesson, user, text)
│   ├── controllers/
│   │   ├── userController.ts        ← register, login, logout, refresh, getMe, addFavorite, removeFavorite
│   │   ├── lessonController.ts      ← createLesson, getAllLessons, getLessonById, joinLesson, deleteLesson
│   │   └── commentController.ts     ← createComment, getCommentsByLesson, deleteComment
│   ├── routes/
│   │   ├── users_routes.ts          ← /api/users/*
│   │   ├── lessons_routes.ts        ← /api/lessons/*
│   │   └── comments_routes.ts       ← /api/comments/*
│   ├── middleware/
│   │   ├── authMiddleware.ts        ← JWT verify → sets req.userId
│   │   ├── errorHandler.ts          ← global 4-param error handler
│   │   ├── logger.ts                ← request logger
│   │   ├── validate.ts              ← JOI middleware wrapper
│   │   └── rateLimiter.ts           ← apiLimiter (100/15min) + authLimiter (10/15min)
│   └── validation/
│       ├── userValidation.ts        ← registerSchema, loginSchema
│       └── lessonValidation.ts      ← createLessonSchema
└── oraita-web/
    ├── package.json                 ← frontend dependencies
    ├── src/
    │   ├── main.tsx                 ← Redux Provider + AuthProvider + App
    │   ├── App.tsx                  ← Routes (lazy loaded) + PrivateRoute
    │   ├── index.css                ← all custom styles (RTL, Hebrew UI)
    │   ├── services/
    │   │   └── api.ts               ← Axios instance (baseURL + token interceptor + 401 redirect)
    │   ├── context/
    │   │   └── AuthContext.tsx      ← AuthProvider + useAuth hook (login/logout/loading/user)
    │   ├── store/
    │   │   ├── store.ts             ← Redux configureStore (lessons reducer)
    │   │   └── lessonsSlice.ts      ← fetchLessons thunk + setCategoryFilter + setCityFilter
    │   ├── components/
    │   │   ├── Navbar.tsx           ← navigation bar (⚠ STILL HARDCODED — needs logout + user name)
    │   │   ├── Footer.tsx           ← footer
    │   │   ├── Layout.tsx           ← wraps pages with Navbar + Footer
    │   │   ├── LessonCard.tsx       ← React.memo + date formatting + image fallback
    │   │   └── PrivateRoute.tsx     ← redirects to /login if not authenticated
    │   └── pages/
    │       ├── HomePage.tsx         ← landing page (static, not connected)
    │       ├── Login.tsx            ← ✅ Axios + AuthContext + useNavigate + inline errors
    │       ├── Register.tsx         ← ✅ Axios + useNavigate + inline errors
    │       ├── Dashboard.tsx        ← ⚠ hardcoded data — needs real API data
    │       ├── AllLessons.tsx       ← ✅ Redux + real API + category/city filters
    │       ├── CreateLesson.tsx     ← ✅ Axios + fixed category bug + error handling
    │       ├── SingleLesson.tsx     ← ✅ real data + join + favorites + comments
    │       ├── TeacherProfile.tsx   ← ⚠ static placeholder — needs real data
    │       └── NotFound.tsx         ← 404 page
```

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Users (`/api/users`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/me` | ✅ | Get current logged-in user |
| POST | `/register` | ❌ | Register (JOI + rate limited) |
| POST | `/login` | ❌ | Login → returns accessToken + refreshToken |
| POST | `/logout` | ❌ | Invalidate refresh token |
| POST | `/refresh` | ❌ | Get new access token |
| POST | `/favorites/:lessonId` | ✅ | Add lesson to favorites |
| DELETE | `/favorites/:lessonId` | ✅ | Remove lesson from favorites |

### Lessons (`/api/lessons`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | ❌ | Get all lessons (populated with creator) |
| POST | `/` | ✅ | Create lesson (JOI validated) |
| GET | `/:id` | ❌ | Get single lesson (populated creator + participants) |
| POST | `/:id/join` | ✅ | Join lesson (checks capacity) |
| DELETE | `/:id` | ✅ | Delete lesson (creator only) |

### Comments (`/api/comments`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/lesson/:lessonId` | ❌ | Get comments for a lesson |
| POST | `/:lessonId` | ✅ | Add comment |
| DELETE | `/:id` | ✅ | Delete comment (owner only) |

### Auth header format
```
Authorization: Bearer <accessToken>
```

---

## Data Models

### User
```ts
{ name, email, password (bcrypt), phone?, favorites: [ObjectId→Lesson], refreshTokens: [string], timestamps }
```

### Lesson
```ts
{ title, description, category (enum), city (enum), date, time, image, creator: ObjectId→User, participants: [ObjectId→User], maxParticipants (default 50), rating (0-5), timestamps }
```
Valid categories: `חסידות | מוסר | הלכה | משנה | גמרא | פרשת שבוע`  
Valid cities: `נתניה | פרדס חנה`

### Comment
```ts
{ lesson: ObjectId→Lesson, user: ObjectId→User, text, timestamps }
```

---

## Environment Variables (`server/.env`)
```
PORT=3000
DATABASE_URL=mongodb://localhost/oraita_db
TOKEN_SECRET=mySuperSecretKey123
TOKEN_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## What Was Done (Session Log)

### Backend fixes & features added
- ✅ Fixed duplicate `express.json()` in `app.ts`
- ✅ Added global error handler (`middleware/errorHandler.ts`) — 4-param signature
- ✅ Added request logger (`middleware/logger.ts`)
- ✅ Added Helmet security headers
- ✅ Added rate limiting — `apiLimiter` (all /api routes) + `authLimiter` (login/register)
- ✅ Added JOI validation — `userValidation.ts` + `lessonValidation.ts` + `validate.ts` middleware
- ✅ Added `/api/users/me` route — restores session on page refresh
- ✅ Added `server/types/express.d.ts` — extends Express `Request` with `userId?: string`
- ✅ **Fixed critical Express 5 bug:** `req.query.userId` was silently lost between middleware in Express 5 (re-parses query from URL on each access). Fixed by using `req.userId` throughout all controllers and authMiddleware
- ✅ Added `server/.env.example`
- ✅ Installed: `helmet`, `express-rate-limit`, `joi`, `@types/joi`

### Frontend fixes & features added
- ✅ Installed: `axios`, `@reduxjs/toolkit`, `react-redux`
- ✅ Created `services/api.ts` — Axios instance with base URL + request interceptor (auto-attach token) + response interceptor (redirect to /login on 401)
- ✅ Created `context/AuthContext.tsx` — `useAuth` hook, session restore on mount via `/api/users/me`, login/logout functions
- ✅ Created `store/lessonsSlice.ts` — `fetchLessons` async thunk + `setCategoryFilter` + `setCityFilter`
- ✅ Created `store/store.ts` — Redux store
- ✅ Created `components/PrivateRoute.tsx` — redirects to /login if not authenticated, preserves intended destination
- ✅ Updated `main.tsx` — wrapped with `<Provider store>` + `<AuthProvider>`
- ✅ Updated `App.tsx` — all pages lazy loaded (`React.lazy` + `Suspense`), Dashboard + CreateLesson protected via `PrivateRoute`
- ✅ Updated `Login.tsx` — Axios, AuthContext.login(), useNavigate, inline error state, loading state, redirects to intended page after login
- ✅ Updated `Register.tsx` — Axios, useNavigate, inline error state (shows all JOI errors), loading state
- ✅ Updated `CreateLesson.tsx` — Axios, fixed category bug (`"פרשת השבוע"` → `"פרשת שבוע"`), error/loading state, navigates to /alllessons on success
- ✅ Updated `LessonCard.tsx` — wrapped with `React.memo`, `id` changed from `number` to `string`, date formatted to Hebrew locale, image fallback
- ✅ Updated `AllLessons.tsx` — uses Redux (useDispatch + useSelector), fetches real lessons from API, category filter buttons dispatch `setCategoryFilter`, city dropdown dispatches `setCityFilter`, filtered with `useMemo`, loading/error/empty states
- ✅ Updated `SingleLesson.tsx` — fetches real lesson by ID, fetches comments, join lesson button, add to favorites button, post comment form, proper loading/error states, shows real participants list

---

## Current State

### ✅ Working
- Register → Login → Dashboard flow (auth persists on refresh)
- Protected routes redirect to /login
- Create lesson (category bug fixed)
- All lessons page with real data + working category/city filters
- Single lesson page with join, favorites, comments
- JWT access + refresh token rotation
- JOI validation with inline errors on frontend
- Helmet security headers
- Rate limiting
- React.memo on LessonCard
- Lazy loading on all pages (separate JS chunks per route)
- Global error handler

### ⚠ Still Needs Work
1. **Dashboard** — shows hardcoded data. Needs real data: user's name from AuthContext, joined lessons from API
2. **Navbar** — shows static links. Needs: show user name when logged in, logout button, hide "login" link when logged in
3. **TeacherProfile** — static placeholder. Needs: fetch lessons by creator ID
4. **Multer file upload** — UI exists in CreateLesson but image field is not sent to backend. Needs: multer middleware on backend + FormData on frontend
5. **Deployment** — not yet deployed. Target: Vercel (frontend) + Render/Railway (backend)
6. **README.md** — required for grading (tech stack, setup instructions, API table, screenshots, live URL)

---

## Remaining Steps

### Step 10 — Dashboard with real data
- Read user from `useAuth()` → show real name in header
- Fetch `/api/lessons` → filter by `lesson.participants.includes(user._id)` for joined lessons
- Fetch `/api/lessons` → filter by `lesson.creator._id === user._id` for created lessons
- Show real counts in stat cards

### Step 11 — Navbar connected to AuthContext
- `const { user, logout } = useAuth()`
- If `user`: show user name + logout button (calls `logout()` + navigate to `/`)
- If not `user`: show login link
- `useNavigate` for logout redirect

### Step 12 — TeacherProfile
- Route is `/teacherprofile/:id` (already set in App.tsx)
- Fetch lessons where `creator._id === id`
- Show creator info + their lessons grid

### Step 13 — Multer image upload
- Backend: `npm install multer @types/multer`
- Add `uploads/` folder + serve static files in `app.ts`
- Add `upload.single('image')` middleware to POST `/api/lessons`
- Frontend: use `FormData` instead of JSON in CreateLesson

### Step 14 — Deployment
- Frontend → Vercel (set `VITE_API_URL` env var)
- Backend → Render or Railway (set all env vars)
- MongoDB Atlas for production database

### Step 15 — README.md
Required sections: project description, tech stack, setup instructions, API endpoints table, screenshots, team/author, live URL

---

## Known Issues / Important Notes

1. **Express 5 + req.query bug (FIXED):** Express 5 re-parses `req.query` from the URL on every access so `req.query.userId = value` in middleware was silently lost. Fixed via `server/types/express.d.ts` extending `Request` with `userId?: string` and using `req.userId` everywhere.

2. **Bootstrap location:** Bootstrap is in the root `node_modules/` (listed under root `package.json`), not in `oraita-web/package.json`. Vite resolves it from the parent directory. Works fine but should ideally be added to `oraita-web/package.json` too.

3. **TeacherProfile route:** Changed from `/teacherprofile` to `/teacherprofile/:id` in `App.tsx`. Any existing links to `/teacherprofile` without an ID will 404.

4. **`React.FormEvent<T>` deprecated in React 19:** Use `{ preventDefault(): void }` as the event type instead. Already fixed in Login, Register, CreateLesson, SingleLesson.

5. **Category enum mismatch (FIXED):** CreateLesson had `value="פרשת השבוע"` but model/JOI expect `"פרשת שבוע"`. Fixed.

---

## Tests Run & Passed

```
✅ POST /api/users/register with bad data → 400 + JOI errors
✅ POST /api/users/register with valid data → 201 + user created
✅ POST /api/users/login → 200 + accessToken + refreshToken
✅ GET /api/users/me with token → 200 + user data
✅ GET /api/users/me without token → 401
✅ POST /api/users/refresh → 200 + new tokens
✅ GET /api/lessons → 200 (public)
✅ POST /api/lessons without token → 401
✅ GET /api/lessons/:id → 200 + populated creator + participants
✅ Helmet headers present (X-Frame-Options, Content-Security-Policy, etc.)
✅ Rate limit headers present (RateLimit-Limit, RateLimit-Remaining)
✅ Frontend builds with zero TypeScript errors
✅ Lazy loading: separate JS chunk per page in dist/assets/
✅ PrivateRoute: /dashboard without login → redirects to /login
```

---

## Grading Checklist (from rubric)

| Category | Points | Status |
|----------|--------|--------|
| Backend Architecture | 25 pts | ✅ MVC structure, error handler, middleware, no logic in routes |
| Database Design | 15 pts | ✅ 3 collections, ObjectId refs, required fields, timestamps |
| Authentication & Security | 20 pts | ✅ bcrypt, JWT, protected routes, rate limiting, Helmet |
| Frontend — React & State | 20 pts | ✅ Context API + Redux, custom hooks, lazy loading, React.memo |
| UI/UX & Responsiveness | 10 pts | ⚠ Loading/error states done, mobile responsiveness needs check |
| Deployment | 5 pts | ❌ Not yet deployed |
| Git Workflow & README | 5 pts | ❌ README missing, commit history needs improvement |

**Easy wins still to grab:**
- `.env.example` ✅ already committed
- Postman collection — export and add to repo
- README.md — write it
- Deploy to Vercel + Render
