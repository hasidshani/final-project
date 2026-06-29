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
| File upload | Multer (disk storage → `public/`) + separate `/api/file` route |
| Design | Bootstrap 5 + custom CSS variables (gold theme, RTL) |
| React patterns | Custom hooks (`src/hooks/`), reusable components, `.map()` lists |

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
├── README.md                        ← project documentation for grading
├── .gitignore                       ← excludes dist/, uploads/*, public/*, server/.env, oraita-web/.env
├── package.json                     ← backend scripts + dependencies
├── tsconfig.json                    ← backend TypeScript config
├── public/                          ← uploaded lesson images (served at /public/*)
│   └── .gitkeep
├── uploads/                         ← legacy folder (kept for backwards compatibility)
│   └── .gitkeep
├── server/
│   ├── .env                         ← secrets (never commit)
│   ├── .env.example                 ← committed placeholder (includes SERVER_URL)
│   ├── app.ts                       ← Express app + middleware + serves /public + /uploads static
│   ├── server.ts                    ← MongoDB connect + server start
│   ├── types/
│   │   └── express.d.ts             ← extends Request with userId?: string
│   ├── models/
│   │   ├── users.ts                 ← User schema (name, email, password, phone, favorites, refreshTokens)
│   │   ├── lessons.ts               ← Lesson schema (title, description, category, city, date, time, image, creator, participants, maxParticipants, rating)
│   │   └── comments.ts              ← Comment schema (lesson, user, text)
│   ├── controllers/
│   │   ├── userController.ts        ← register, login, logout, refresh, getMe, addFavorite, removeFavorite
│   │   ├── lessonController.ts      ← createLesson reads image from req.body (URL string, not req.file)
│   │   └── commentController.ts     ← createComment, getCommentsByLesson, deleteComment
│   ├── routes/
│   │   ├── users_routes.ts          ← /api/users/*
│   │   ├── lessons_routes.ts        ← /api/lessons/* (POST / is JSON — no multer here anymore)
│   │   ├── comments_routes.ts       ← /api/comments/*
│   │   └── file_routes.ts           ← /api/file (POST / — multer saves to public/, returns {url})
│   ├── middleware/
│   │   ├── authMiddleware.ts        ← JWT verify → sets req.userId
│   │   ├── errorHandler.ts          ← global 4-param error handler
│   │   ├── logger.ts                ← request logger
│   │   ├── validate.ts              ← JOI middleware wrapper (stripUnknown: true)
│   │   ├── upload.ts                ← legacy Multer config (kept, no longer used in lesson creation)
│   │   └── rateLimiter.ts           ← apiLimiter (100/15min) + authLimiter (10/15min)
│   └── validation/
│       ├── userValidation.ts        ← registerSchema, loginSchema
│       └── lessonValidation.ts      ← createLessonSchema (includes optional image string)
└── oraita-web/
    ├── package.json                 ← frontend dependencies
    ├── .env                         ← VITE_API_URL=http://localhost:3000/api (gitignored)
    ├── .env.example                 ← committed placeholder
    └── src/
        ├── main.tsx                 ← Redux Provider + AuthProvider + App
        ├── App.tsx                  ← Routes (lazy loaded) + PrivateRoute
        ├── index.css                ← ~90 lines: CSS vars, gold theme, Bootstrap overrides only
        ├── services/
        │   └── api.ts               ← Axios instance (VITE_API_URL + token interceptor + 401 redirect)
        ├── context/
        │   └── AuthContext.tsx      ← AuthProvider + useAuth hook (login/logout/loading/user)
        ├── store/
        │   ├── store.ts             ← Redux configureStore (lessons reducer)
        │   └── lessonsSlice.ts      ← fetchLessons thunk + setCategoryFilter + setCityFilter
        ├── hooks/                   ← custom React hooks (logic separated from pages)
        │   ├── useLessons.ts        ← fetchLessons + filter by category/city/past
        │   ├── useDashboard.ts      ← fetch joined/created/favorites for logged-in user
        │   ├── useSingleLesson.ts   ← fetch lesson + join + addFavorite actions
        │   ├── useComments.ts       ← fetch comments + addComment
        │   └── useTeacherProfile.ts ← fetch teacher's future lessons + avgRating + cities
        ├── components/
        │   ├── Navbar.tsx           ← Bootstrap navbar + navLinks.map() + AuthContext
        │   ├── Footer.tsx           ← Bootstrap footer + FOOTER_LINKS.map()
        │   ├── Layout.tsx           ← wraps pages with Navbar + Footer
        │   ├── LessonCard.tsx       ← Bootstrap card + image fallback (Unsplash)
        │   ├── StatCard.tsx         ← reusable stat card (icon, count, label, iconBg prop)
        │   ├── CommentCard.tsx      ← reusable comment card (authorName, date, text props)
        │   └── PrivateRoute.tsx     ← redirects to /login if not authenticated
        └── pages/
            ├── HomePage.tsx         ← CITIES.map() + CATEGORIES.map() + Bootstrap sections
            ├── Login.tsx            ← Bootstrap card + form-control
            ├── Register.tsx         ← FIELDS.map() replaces 4 copy-pasted form groups
            ├── Dashboard.tsx        ← useDashboard hook + StatCard + TABS.map() + LessonRow
            ├── AllLessons.tsx       ← useLessons hook + CATEGORIES.map() + Bootstrap grid
            ├── CreateLesson.tsx     ← hidden file input + image preview + upload-then-submit flow
            ├── SingleLesson.tsx     ← useSingleLesson + useComments hooks + Bootstrap layout
            ├── TeacherProfile.tsx   ← useTeacherProfile hook + LessonCard + statBadges.map()
            └── NotFound.tsx         ← Bootstrap centered 404 page
```

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Users (`/api/users`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/me` | ✅ | Get current logged-in user (with favorites array) |
| POST | `/register` | ❌ | Register (JOI + rate limited) |
| POST | `/login` | ❌ | Login → returns accessToken + refreshToken |
| POST | `/logout` | ❌ | Invalidate refresh token |
| POST | `/refresh` | ❌ | Get new access token |
| POST | `/google` | ❌ | Google Sign-In — verifies credential, finds/creates user, returns tokens |
| POST | `/favorites/:lessonId` | ✅ | Add lesson to favorites |
| DELETE | `/favorites/:lessonId` | ✅ | Remove lesson from favorites |

### Lessons (`/api/lessons`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | ❌ | Get all lessons (creator populated) |
| POST | `/` | ✅ | Create lesson — JSON body (image is a URL string, not a file) |
| GET | `/:id` | ❌ | Get single lesson (creator + participants populated) |
| POST | `/:id/join` | ✅ | Join lesson (checks capacity) |
| DELETE | `/:id` | ✅ | Delete lesson (creator only) |

### File Upload (`/api/file`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/` | ❌ | Upload image → saved to `public/` → returns `{ url: "http://localhost:3000/public/filename.jpg" }` |

### Comments (`/api/comments`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/lesson/:lessonId` | ❌ | Get comments for a lesson |
| POST | `/:lessonId` | ✅ | Add comment |
| DELETE | `/:id` | ✅ | Delete comment (owner only) |

### Static files
| Path | Description |
|------|-------------|
| `GET /public/:filename` | Serves uploaded images (Cross-Origin-Resource-Policy: cross-origin) |
| `GET /uploads/:filename` | Legacy path — kept for backwards compatibility |

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
{ title, description, category (enum), city (enum), date, time, image (URL string), creator: ObjectId→User, participants: [ObjectId→User], maxParticipants (default 50), rating (0-5), timestamps }
```
Valid categories: `חסידות | מוסר | הלכה | משנה | גמרא | פרשת שבוע`
Valid cities: `נתניה | פרדס חנה`

### Comment
```ts
{ lesson: ObjectId→Lesson, user: ObjectId→User, text, timestamps }
```

---

## Image Upload Flow (Lecturer's Approach)

1. User clicks 📷 button on CreateLesson form → hidden `<input type="file">` opens via `useRef`
2. `URL.createObjectURL(file)` shows local preview immediately (no network request yet)
3. On form submit:
   - **Step 1:** `POST /api/file` with `multipart/form-data` → Multer saves to `FinalProject/public/filename.jpg` → returns `{ url: "http://localhost:3000/public/filename.jpg" }`
   - **Step 2:** `POST /api/lessons` with JSON body including `image: url`
4. Lesson stored in MongoDB with image URL in the `image` field
5. To verify: open MongoDB Compass → `lessons` collection → find lesson → `image` field shows full URL
6. Frontend `<img src={lesson.image}>` loads from that URL

---

## Environment Variables

### Backend — `server/.env`
```
PORT=3000
DATABASE_URL=mongodb://localhost/oraita_db
TOKEN_SECRET=mySuperSecretKey123
TOKEN_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend — `oraita-web/.env`
```
VITE_API_URL=http://localhost:3000/api
```

---

## Current State

### ✅ Everything Working (as of 2026-06-29)
- Register → Login → Dashboard flow (auth persists on refresh via `/api/users/me`)
- Protected routes redirect to /login, return to intended page after login
- Navbar: shows user name + logout when logged in, login link when logged out
- Dashboard: real data — joined lessons / created lessons / favorites tabs with live counts
- All Lessons: real API data + category/city filters + **past lessons hidden**
- Create Lesson: image picker (hidden input + preview) → uploads to `/api/file` → lesson created with image URL
- Single Lesson: join, favorites, comments, teacher name links to TeacherProfile, lesson image displayed
- Teacher Profile: real lessons by creator (future only), lesson count, avg rating, city list
- JWT access + refresh token rotation
- JOI validation with inline errors on frontend
- Helmet security headers + Rate limiting
- React.memo on LessonCard + lazy loading on all pages
- Global error handler
- Bootstrap 5 design + RTL Hebrew UI + gold theme
- Custom hooks folder (`src/hooks/`) — all logic separated from pages
- Reusable components: `StatCard`, `CommentCard`, `LessonCard`
- `.map()` used throughout for all lists (categories, cities, tabs, lessons, comments, fields)
- Image upload working: `public/` folder served with correct CORP headers
- README.md written with all required sections
- **Google Login** — `POST /api/users/google`, `<GoogleLogin>` button on Login page, find-or-create user flow
- Homepage city counts are live from DB (no longer hardcoded)
- Date parsing bug fixed in `useLessons` + `useTeacherProfile` (MongoDB ISO date → `split('T')[0]`)

### ⚠ Still To Do (manual steps only)
1. **Deploy** — MongoDB Atlas → Render (backend) → Vercel (frontend). See deployment guide below.
2. **Update README** — replace `_coming soon_` with real live URLs once deployed.
3. **Mobile responsiveness** — do a quick check on phone after deploy.

---

## Deployment Guide (manual steps)

### A — MongoDB Atlas
1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → free M0 cluster
2. Database Access → add user with password
3. Network Access → `0.0.0.0/0`
4. Connect → Drivers → copy connection string → replace `<password>`

### B — Render (backend)
- Build command: `npm run build`
- Start command: `npm run start`
- Root directory: *(project root)*
- Environment variables:
  ```
  DATABASE_URL   = <Atlas connection string>
  TOKEN_SECRET   = <long random string>
  TOKEN_EXPIRATION        = 1h
  REFRESH_TOKEN_EXPIRATION = 7d
  CLIENT_URL     = https://<your-vercel-url>.vercel.app
  SERVER_URL     = https://<your-render-url>.onrender.com
  NODE_ENV       = production
  PORT           = 3000
  ```
- ⚠️ Note: Render's filesystem is ephemeral — uploaded images in `public/` are lost on restart. For production use Cloudinary/S3.

### C — Vercel (frontend)
- Root directory: `oraita-web`
- Framework: Vite (auto-detected)
- Output directory: `dist`
- Environment variables:
  ```
  VITE_API_URL = https://<your-render-url>.onrender.com/api
  ```

### D — After both are live
- Go back to Render → update `CLIENT_URL` to the real Vercel URL → redeploy

---

## Known Issues / Notes

1. **Express 5 + req.query bug (FIXED):** Express 5 re-parses `req.query` on every access so `req.query.userId = value` in middleware is silently lost. Fixed via `server/types/express.d.ts` and `req.userId` everywhere.

2. **Bootstrap location:** Bootstrap is in root `node_modules/` (root `package.json`), not `oraita-web/package.json`. Vite resolves it from the parent. Works fine.

3. **Multer + ephemeral Render filesystem:** Uploaded images are stored on Render's ephemeral disk and are lost on restart. Acceptable for a student project; production would use Cloudinary/S3.

4. **`React.FormEvent<T>` deprecated in React 19:** Use `{ preventDefault(): void }` as the event type instead. Already applied everywhere.

5. **Past lesson filtering is client-side only:** Backend still returns all lessons. The `AllLessons`, `TeacherProfile`, and `Dashboard` pages filter on the frontend.

6. **Helmet CORP header (FIXED):** Helmet adds `Cross-Origin-Resource-Policy: same-origin` to all responses by default. This blocked the React frontend (port 5173) from loading images served by the backend (port 3000) since they are different origins. Fixed by overriding the header to `cross-origin` specifically on the `/public` and `/uploads` static routes.

7. **Image URL stored in MongoDB:** The `image` field in the `lessons` collection stores the full URL string (e.g. `http://localhost:3000/public/1234567890.jpg`). Visible in MongoDB Compass under the `lessons` collection.

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
✅ Frontend builds with zero TypeScript errors (backend + frontend)
✅ Lazy loading: separate JS chunk per page in dist/assets/
✅ PrivateRoute: /dashboard without login → redirects to /login
✅ POST /api/file with image → 200 + { url } saved to public/
✅ Image URL stored in MongoDB lessons.image field
✅ Image visible in SingleLesson page after upload
```

---

## Grading Checklist (from rubric)

| Category | Points | Status |
|----------|--------|--------|
| Backend Architecture | 25 pts | ✅ MVC structure, error handler, middleware chain, no logic in routes |
| Database Design | 15 pts | ✅ 3 collections, ObjectId refs, required fields, timestamps |
| Authentication & Security | 20 pts | ✅ bcrypt, JWT + refresh tokens, protected routes, rate limiting, Helmet |
| Frontend — React & State | 20 pts | ✅ Context API + Redux, custom hooks (`src/hooks/`), components, lazy loading, React.memo, `.map()` lists |
| UI/UX & Responsiveness | 10 pts | ⚠ Loading/error states ✅ — mobile responsiveness needs manual check |
| Deployment | 5 pts | ⚠ Code prepped — needs Atlas + Render + Vercel accounts (see guide above) |
| Git Workflow & README | 5 pts | ✅ README.md complete + .env.example committed |

---

## Session Log

### Session 1
- Full backend setup: MVC structure, JWT auth, JOI validation, Helmet, rate limiting, global error handler
- Full frontend setup: Axios, AuthContext, Redux, PrivateRoute, Login, Register, AllLessons, CreateLesson, SingleLesson

### Session 2
- Dashboard connected to real API (joined/created/favorites tabs, live counts)
- Navbar connected to AuthContext (conditional links, logout)
- TeacherProfile — real data from API, creator link from SingleLesson
- Multer image upload (backend middleware + frontend FormData)
- Deployment code prep (VITE_API_URL env var, .gitignore, .env.example files)
- README.md written
- Past lesson filtering in AllLessons + TeacherProfile; past date/time blocked in CreateLesson

### Session 3 (2026-06-26) — CSS → React Design Patterns
- ✅ Slimmed `index.css` from 1464 → ~90 lines (Bootstrap handles layout)
- ✅ Created `StatCard` component (props: icon, count, label, iconBg)
- ✅ Created `CommentCard` component (props: authorName, date, text)
- ✅ `LessonCard` — Bootstrap card classes + custom CSS for image/badge only
- ✅ `Navbar` — Bootstrap navbar + `navLinks.map()` for link list
- ✅ `Footer` — `FOOTER_LINKS.map()` per column
- ✅ `AllLessons` — Bootstrap `row row-cols-*` grid + `CATEGORIES.map()` filter buttons
- ✅ `Dashboard` — `StatCard` + `TABS.map()` for nav-tabs + local `LessonRow` component
- ✅ `SingleLesson` — Bootstrap `row col-lg-8/col-lg-4` + `CommentCard` + `comments.map()`
- ✅ `TeacherProfile` — reuses `LessonCard` component + `statBadges.map()`
- ✅ `Login` / `Register` — Bootstrap card layout; `Register` uses `FIELDS.map()`
- ✅ `CreateLesson` — `CATEGORIES.map()` / `CITIES.map()` for selects
- ✅ `HomePage` — `CITIES.map()` + `CATEGORIES.map()` + Bootstrap hero/grid sections
- ✅ `NotFound` — Bootstrap centered layout
- ✅ Created `src/hooks/` folder with 5 custom hooks:
  - `useLessons` — Redux dispatch + filter logic (category, city, past)
  - `useDashboard` — fetches user's joined/created/favorites
  - `useSingleLesson` — lesson data + join + addFavorite
  - `useComments` — comments list + addComment
  - `useTeacherProfile` — teacher's future lessons + avgRating + cities
- ✅ All pages refactored: pages contain only JSX, all logic lives in hooks

### Session 5 (2026-06-29) — Cleanup + Live City Counts + Google Login

#### Cleanup
- ✅ Deleted `client/` folder (old HTML prototype, fully replaced by `oraita-web/`)

#### Live City Counts (HomePage)
- ✅ `HomePage.tsx` — city lesson counts are now live from the Redux store (were hardcoded: 45 / 18)
  - `fetchLessons()` dispatched on mount, `useSelector` reads `state.lessons.list`
  - Counts reflect all lessons per city, recomputed via `useMemo` when lessons change
  - Now correctly shows real counts (e.g. Netanya: 1, Pardes Hanna: 2)

#### Date Parsing Bug Fix
- ✅ Found root cause: MongoDB returns dates as full ISO strings (`"2026-06-25T00:00:00.000Z"`)
  - Concatenating with time produced invalid date `"2026-06-25T00:00:00.000ZT21:00"`
  - `Invalid Date > now` is always `false` → all lessons were being filtered out silently
- ✅ Fixed in `hooks/useLessons.ts` — `lesson.date.split('T')[0]` extracts `YYYY-MM-DD` before combining with time → past-lesson filter now actually works in AllLessons
- ✅ Fixed in `hooks/useTeacherProfile.ts` — same fix → TeacherProfile now correctly shows future lessons only

#### Google Login (Lecturer's Approach)
- ✅ Installed `google-auth-library` (backend) and `@react-oauth/google` (frontend)
- ✅ Created Google Cloud project + OAuth 2.0 Client ID (authorized origins: `http://localhost:5173`, `http://localhost`)
- ✅ `server/controllers/userController.ts` — added `googleSignin`:
  - Verifies Google credential with `OAuth2Client.verifyIdToken()`
  - Finds existing user by email OR creates new user (`name` from payload, `password: 'google-signin'`)
  - Generates app's own access + refresh tokens (same `generateTokens` used by regular login)
  - Returns `{ accessToken, refreshToken, user }` — same shape as regular login
- ✅ `server/routes/users_routes.ts` — added `POST /api/users/google`
- ✅ `oraita-web/src/main.tsx` — wrapped app with `<GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>`
- ✅ `oraita-web/src/pages/Login.tsx` — added `handleGoogleSuccess` + `<GoogleLogin>` button (below form, separated by "או" divider)
- ✅ `server/.env` — added `GOOGLE_CLIENT_ID`
- ✅ `oraita-web/.env` — added `VITE_GOOGLE_CLIENT_ID`
- ✅ Both `.env.example` files updated with placeholder keys
- ✅ API verified: `POST /api/users/google` with empty body → 400 `Missing credential`; with fake token → 400 `Google authentication failed`

### Session 4 (2026-06-26) — Image Upload (Lecturer's Approach)
- ✅ Created `server/routes/file_routes.ts` — dedicated upload endpoint
  - Multer saves to `public/` folder (relative to CWD = project root)
  - Returns `{ url: "http://localhost:3000/public/filename.jpg" }`
- ✅ Created `FinalProject/public/` folder (at project root where server CWD is)
- ✅ Updated `server/app.ts`:
  - Serves `public/` at `/public` with `Cross-Origin-Resource-Policy: cross-origin`
  - Registered `app.use('/api/file', fileRoutes)`
- ✅ Updated `server/routes/lessons_routes.ts` — removed Multer from lesson POST (image is now JSON)
- ✅ Updated `server/controllers/lessonController.ts` — reads `image` from `req.body` (URL string)
- ✅ Updated `server/validation/lessonValidation.ts` — added `image: Joi.string().allow('').optional()`
- ✅ Updated `oraita-web/src/pages/CreateLesson.tsx`:
  - Hidden `<input type="file">` triggered via `useRef` + 📷 icon button
  - `URL.createObjectURL()` for instant local preview
  - Upload-then-submit: image uploaded to `/api/file` first, URL passed to lesson creation
- ✅ Fixed Helmet CORP bug: `Cross-Origin-Resource-Policy: same-origin` blocked images loading from port 3000 in the frontend on port 5173
- ✅ Updated `.gitignore`: `public/*` / `!public/.gitkeep`
.