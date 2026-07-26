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
| File upload | Multer (memory storage) → Cloudinary (`/api/file` route uploads buffer, returns Cloudinary `secure_url`) |
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
│   │   ├── userController.ts        ← register, login, logout, refresh, getMe, addFavorite, removeFavorite (auth error messages in Hebrew)
│   │   ├── lessonController.ts      ← createLesson reads image from req.body (URL string, not req.file); updateLesson (creator-only edit)
│   │   └── commentController.ts     ← createComment, getCommentsByLesson, deleteComment
│   ├── routes/
│   │   ├── users_routes.ts          ← /api/users/*
│   │   ├── lessons_routes.ts        ← /api/lessons/* (POST / is JSON — no multer here anymore; PATCH /:id for creator-only edit)
│   │   ├── comments_routes.ts       ← /api/comments/*
│   │   └── file_routes.ts           ← /api/file (POST / — multer buffers upload → Cloudinary → returns {url: secure_url}; ⚠ currently no auth middleware — open endpoint)
│   ├── middleware/
│   │   ├── authMiddleware.ts        ← JWT verify → sets req.userId
│   │   ├── errorHandler.ts          ← global 4-param error handler
│   │   ├── logger.ts                ← request logger
│   │   ├── validate.ts              ← JOI middleware wrapper (stripUnknown: true)
│   │   ├── upload.ts                ← dead code — old disk-storage Multer config from the pre-Cloudinary flow, not imported anywhere (file_routes.ts has its own inline memoryStorage config)
│   │   └── rateLimiter.ts           ← apiLimiter (100/15min) + authLimiter (10/15min)
│   └── validation/
│       ├── userValidation.ts        ← registerSchema, loginSchema, updatePhoneSchema (all messages in Hebrew)
│       └── lessonValidation.ts      ← createLessonSchema (includes optional image string, reused for updateLesson)
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
        │   ├── useLessons.ts        ← fetchLessons + filter by category/city/upcoming
        │   ├── useDashboard.ts      ← joined/created/favorites (upcoming only) + past lessons + leaveLesson/deleteLesson
        │   ├── useSingleLesson.ts   ← fetch lesson + join/leave + toggleFavorite + rateLesson
        │   ├── useComments.ts       ← fetch comments + addComment
        │   └── useTeacherProfile.ts ← fetch teacher's future lessons + avgRating + cities
        ├── utils/
        │   └── lessonDate.ts        ← shared isLessonUpcoming() helper (single source of truth for past/upcoming)
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
            ├── CreateLesson.tsx     ← hidden file input + image preview + upload-then-submit flow; dual-mode create/edit (edit via /editlesson/:id)
            ├── SingleLesson.tsx     ← useSingleLesson + useComments hooks + Bootstrap layout; edit button shown to creator; description rendered with white-space: pre-wrap
            ├── TeacherProfile.tsx   ← useTeacherProfile hook + LessonCard + statBadges.map(); empty-state message specifies "upcoming"
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
| POST | `/login` | ❌ | Login → returns accessToken + refreshToken + favorites |
| POST | `/logout` | ❌ | Invalidate refresh token |
| POST | `/refresh` | ❌ | Get new access token |
| POST | `/google` | ❌ | Google Sign-In — verifies credential, finds/creates user, returns tokens (+ phone + favorites) |
| PATCH | `/phone` | ✅ | Update logged-in user's phone number (used by the post-Google-login "add phone?" prompt) |
| POST | `/favorites/:lessonId` | ✅ | Add lesson to favorites |
| DELETE | `/favorites/:lessonId` | ✅ | Remove lesson from favorites |

### Lessons (`/api/lessons`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | ❌ | Get all lessons (creator populated) |
| POST | `/` | ✅ | Create lesson — JSON body (image is a URL string, not a file) |
| GET | `/:id` | ❌ | Get single lesson (creator + participants populated, includes ratings array) |
| POST | `/:id/join` | ✅ | Join lesson (checks capacity) |
| DELETE | `/:id/join` | ✅ | Cancel registration (leave lesson) — validates user is a participant |
| POST | `/:id/rate` | ✅ | Rate lesson 1-5 stars — participants only, only after lesson date has passed; updates or replaces existing rating, recomputes average |
| PATCH | `/:id` | ✅ | Update lesson (creator only) — JOI-validated, same schema as create |
| DELETE | `/:id` | ✅ | Delete lesson (creator only) |

### File Upload (`/api/file`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/` | ✅ | Upload image → Multer buffers in memory → streamed to Cloudinary → returns `{ url: "<cloudinary secure_url>" }` |

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
{ title, description, category (enum), city (enum), date, time, image (URL string), creator: ObjectId→User, participants: [ObjectId→User], maxParticipants (default 50), rating (0-5 avg), ratings: [{ user: ObjectId→User, value: number }], timestamps }
```
`rating` = recomputed average every time a user rates. `ratings` = individual entries (one per participant, updated in-place on re-rate).
Valid categories: `חסידות | מוסר | הלכה | משנה | גמרא | פרשת שבוע`
Valid cities: `נתניה | פרדס חנה`

### Comment
```ts
{ lesson: ObjectId→Lesson, user: ObjectId→User, text, timestamps }
```

---

## Image Upload Flow (Cloudinary)

> Superseded the original local-disk Multer approach (images saved to `FinalProject/public/`). Migrated to Cloudinary in the same session as Google OAuth (commit `9700e3e`), but this doc wasn't updated at the time — corrected on 2026-07-13.

1. User clicks 📷 button on CreateLesson form → hidden `<input type="file">` opens via `useRef`
2. `URL.createObjectURL(file)` shows local preview immediately (no network request yet)
3. On form submit:
   - **Step 1:** `POST /api/file` with `multipart/form-data` → Multer buffers the file in memory (`memoryStorage`, 5MB limit, image mimetypes/extensions only) → streamed to Cloudinary via `cloudinary.uploader.upload_stream` (folder: `oraita`) → returns `{ url: "<cloudinary secure_url>" }`
   - **Step 2:** `POST /api/lessons` with JSON body including `image: url`
4. Lesson stored in MongoDB with the Cloudinary `secure_url` in the `image` field
5. To verify: open MongoDB Compass → `lessons` collection → find lesson → `image` field shows the `res.cloudinary.com/...` URL
6. Frontend `<img src={lesson.image}>` loads directly from Cloudinary

**Gaps raised by lecturer — fixed 2026-07-26 (see "Lecturer feedback" above):**
- ~~`POST /api/file` has no auth middleware~~ → now requires `authMiddleware`
- ~~`image` field accepts any string~~ → now restricted to `res.cloudinary.com/<our cloud name>/...`

**Remaining note (unrelated to lecturer feedback):**
- The old `public/`/`uploads/` static-serving routes in `app.ts` are kept only for backwards compatibility with any lesson documents that still reference pre-migration local image paths; new uploads never write there anymore

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
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=<from cloudinary.com dashboard>
CLOUDINARY_API_KEY=<from cloudinary.com dashboard>
CLOUDINARY_API_SECRET=<from cloudinary.com dashboard>
GOOGLE_CLIENT_ID=<from console.cloud.google.com>
```
`SERVER_URL` is no longer used anywhere in the code (it was only needed to build local `/public/...` image URLs under the old Multer disk-storage flow — Cloudinary now returns absolute URLs directly).

### Frontend — `oraita-web/.env`
```
VITE_API_URL=http://localhost:3000/api
```

---

## Current State

### ✅ Everything Working (as of 2026-07-07)
- **Edit lesson (creator only)** — new `PATCH /api/lessons/:id` route + `updateLesson` controller (creator-only, same 403 pattern as delete); `CreateLesson.tsx` now doubles as an edit form at `/editlesson/:id` (fetches + prefills the lesson, redirects non-creators away, skips the past-date guard so a past/already-scheduled lesson can still be edited); "✏️ ערוך שיעור" button added to `SingleLesson.tsx`'s sidebar, visible only to the lesson's creator
- **Lesson description line breaks** — `SingleLesson.tsx` description `<p>` now has `white-space: pre-wrap`, so newlines the teacher types render as real line breaks instead of being collapsed
- **Hebrew auth error messages** — login (`"אימייל או סיסמה שגויים"` for wrong password / unknown email), registration (duplicate email, missing fields), and all JOI validation messages in `registerSchema`/`loginSchema`/`updatePhoneSchema` are now in Hebrew instead of English, matching the rest of the RTL UI
- **TeacherProfile empty state** — message now reads "לא נמצאו שיעורים עתידיים עבור מורה זה" (no *upcoming* lessons) instead of the ambiguous "no lessons", since the page only ever lists future lessons
- **DB cleanup** — found 3 duplicate "שני חסיד" user accounts (different emails, from earlier Google-login testing); confirmed none had lessons/comments/ratings attached, then deleted the 2 duplicates and kept only `hasidshani@gmail.com` (phone `0534567877`)
- **Google login phone-prompt re-verified** — confirmed (no code change needed) that the prompt only fires once per account: `Login.tsx` only shows it when `!user.phone`, and `googleSignin` never overwrites an existing phone on repeat logins

### ✅ Everything Working (as of 2026-07-06)
- **Google Login phone prompt** — no longer auto-assigns a phone; after a Google login with no phone on file, an inline "add a phone number?" prompt appears (optional, skippable), saved via `PATCH /api/users/phone`
- **Favorites toggle** — the favorite button on SingleLesson now toggles color (filled red when favorited, outline when not) and adds/removes on click instead of only adding
- **Cancel registration** — participants can cancel their registration from SingleLesson or from the Dashboard "joined" tab (inline Hebrew confirm, no browser dialog)
- **Past-lesson sync fix** — homepage city counts, All Lessons, Dashboard tabs, and Teacher Profile now all use one shared `isLessonUpcoming()` helper so they can no longer disagree about what counts as "past"; a new Dashboard "שיעורים שעברו" tab shows past lessons (created or joined) with manual delete for lessons the user created

### ✅ Everything Working (as of 2026-06-30)
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
- **Star Rating** — participants can rate a past lesson 1-5 stars; average updates live without page reload
- **Delete confirmation** — Hebrew inline confirm before deleting a lesson in Dashboard

### ⚠ Still To Do (manual steps only)
1. **Deploy** — MongoDB Atlas → Render (backend) → Vercel (frontend). See deployment guide below.
2. **Update README** — replace `_coming soon_` with real live URLs once deployed.
3. **Mobile responsiveness** — do a quick check on phone after deploy.

### ✅ Lecturer feedback — implemented (2026-07-26)

Lecturer's original note (paraphrased): Google auth architecture is sound, but must verify `email_verified` and confirm authentication via `GOOGLE_CLIENT_ID`. Cloudinary upload mechanism is not secure/authenticated (currently open) and the `image` field must be validated as an actual URL, or the app will have recurring image bugs.

Open sub-questions from 2026-07-13 were resolved directly with the user (not the lecturer) on 2026-07-26 so implementation could proceed: (a) upload auth → blanket `authMiddleware`, not scoped to lesson-creation; (b) Google auth → also add the fail-closed `GOOGLE_CLIENT_ID` guard.

**4. Google auth — `email_verified` + fail-closed `GOOGLE_CLIENT_ID` guard**
- File: `server/controllers/userController.ts`, `googleSignin`
- Added `if (!process.env.GOOGLE_CLIENT_ID) return res.status(500)...` before calling `verifyIdToken`, so a misconfigured server rejects Google logins instead of silently passing `audience: undefined`.
- Added `!payload.email_verified` to the existing `!payload?.email` check — unverified Google emails are now rejected with the same "Invalid Google token" 400.

**5. Cloudinary upload — auth required on `POST /api/file`**
- File: `server/routes/file_routes.ts`
- Added `authMiddleware` to the route: `router.post('/', authMiddleware, upload.single('file'), ...)`. Any logged-in user can upload; unauthenticated requests now get 401.

**6. Cloudinary upload — `image` restricted to our Cloudinary account**
- File: `server/validation/lessonValidation.ts`
- Replaced `image: Joi.string().allow('').optional()` with `Joi.string().uri({ scheme: ['https'] }).allow('').optional().custom(...)`: the `.uri()` call validates the value is a well-formed HTTPS URI (rejects malformed strings — stray spaces, control characters — even if they happen to share the right prefix), and the `.custom()` validator additionally checks it starts with `https://res.cloudinary.com/<CLOUDINARY_CLOUD_NAME>/` (cloud name read from `process.env` at request time, not baked in at module load — avoids a dotenv/import-order footgun). Both error paths (`string.uri`, `string.uriCustomScheme`, `any.invalid`) map to the Hebrew message `"כתובת התמונה אינה תקינה"`. Same schema is reused by both create and `PATCH /:id`, so one change covers both.
- Added 2026-07-26 after reviewing the lecturer's detailed written explanation (Level A vs. Level B tradeoff — he recommended Level B: `Joi.string().uri({scheme:['https']}).pattern(/^https:\/\/res\.cloudinary\.com\//)`). Our cloud-name-specific check is already stricter than his example (his only checks the bare domain); the one piece his example had that ours didn't was the `.uri()` structural check, now added.

**Verified live** (temporary QA account, deleted after): `POST /api/file` without token → 401; with token, no file → 400 (passes auth, fails at multer as expected); `POST /api/lessons` with a non-Cloudinary `image` URL → 400 validation error; with a `res.cloudinary.com/<real cloud name>/...` URL → 201 created. `tsc --noEmit` clean.

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
  NODE_ENV       = production
  PORT           = 3000
  CLOUDINARY_CLOUD_NAME = <from cloudinary.com dashboard>
  CLOUDINARY_API_KEY    = <from cloudinary.com dashboard>
  CLOUDINARY_API_SECRET = <from cloudinary.com dashboard>
  GOOGLE_CLIENT_ID       = <from console.cloud.google.com>
  ```
- Uploaded images go to Cloudinary, not the local filesystem, so Render's ephemeral disk is no longer a concern for images (see Known Issue #3, updated).

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

3. **Multer + ephemeral Render filesystem (RESOLVED via Cloudinary migration):** Originally uploaded images were stored on Render's ephemeral disk and lost on restart. Fixed by migrating `/api/file` to upload to Cloudinary instead (Multer now only buffers the file in memory before streaming it to Cloudinary — nothing is written to local disk anymore). The old `public/`/`uploads/` static routes remain in `app.ts` for backwards compatibility with any pre-migration image URLs already saved in the DB.

4. **`React.FormEvent<T>` deprecated in React 19:** Use `{ preventDefault(): void }` as the event type instead. Already applied everywhere.

5. **Past lesson filtering is client-side only (by design):** Backend still returns all lessons — deliberately not hard-deleted, since participants need past lessons to still exist in order to rate them. All frontend list views (`HomePage`, `AllLessons`, `TeacherProfile`, `Dashboard`) now share one `isLessonUpcoming()` helper (`oraita-web/src/utils/lessonDate.ts`) instead of each filtering independently — this was the root cause of a 2026-07-06 bug where the homepage showed stale city counts while All Lessons/Dashboard disagreed. Past lessons are still reachable via the Dashboard's "שיעורים שעברו" tab.

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
✅ POST /api/lessons/:id/rate as participant on past lesson → 200 + rating recomputed
✅ POST /api/lessons/:id/rate changing existing rating → updates in-place, ratings_count unchanged
✅ POST /api/lessons/:id/rate as non-participant → 403
✅ POST /api/lessons/:id/rate with value=0 → 400 validation error
✅ POST /api/lessons/:id/rate on future lesson (even as participant) → 400
✅ Delete button shows Hebrew confirmation before deleting
✅ POST /api/users/favorites/:id then DELETE same → added then removed, GET /users/me reflects both states
✅ POST /api/lessons/:id/join then DELETE /api/lessons/:id/join → joined then cancelled, participants count updates
✅ DELETE /api/lessons/:id/join when not a participant → 400 rejected
✅ PATCH /api/users/phone → 200, phone saved and returned in updated user object
✅ PATCH /api/lessons/:id as creator → 200, description with \n preserved, updatedAt bumped
✅ PATCH /api/lessons/:id as non-creator → 403 "Not authorized to edit this lesson"
✅ POST /api/users/login with wrong password / unknown email → 400 "אימייל או סיסמה שגויים"
✅ POST /api/users/register with duplicate email → 400 "קיים כבר משתמש עם כתובת אימייל זו"
✅ tsc --noEmit (backend) and tsc -b (frontend) both clean — zero errors, including the previously pre-existing CreateLesson.tsx warning (removed dead DEFAULT_IMG constant)
✅ POST /api/file without auth token → 401 (was open before Session 10)
✅ POST /api/file with token, no file → 400 (passes auth, correctly reaches multer)
✅ POST /api/users/google with GOOGLE_CLIENT_ID unset on server → 500 "Google login is not configured" (fail-closed guard)
✅ POST /api/users/google with GOOGLE_CLIENT_ID restored → back to normal 400 "Google authentication failed" for a fake token
✅ googleSignin() called directly with mocked email_verified: false → 400 "Invalid Google token", no user created in DB
✅ googleSignin() called directly with mocked email_verified: true → 200, user created normally
✅ POST /api/lessons with image from a non-Cloudinary domain → 400 "כתובת התמונה אינה תקינה"
✅ POST /api/lessons with image = "" (empty) → 201, allowed
✅ POST /api/lessons with a valid https://res.cloudinary.com/<our cloud name>/... URL → 201
✅ POST /api/lessons with a well-formed-prefix but malformed URI (embedded space/script tag) → 400, rejected by the added .uri() check
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

### Session 6 (2026-06-30) — Star Rating + Delete Confirmation

#### Star Rating (1-5 stars, past lessons only)
- ✅ `server/models/lessons.ts` — added `ratings: [{ user: ObjectId, value: number }]` array to schema + `ILesson` interface; `rating` field stays as the computed average
- ✅ `server/controllers/lessonController.ts` — new `rateLesson`:
  - Validates value is 1-5
  - Rejects if lesson date has not passed yet (400)
  - Rejects if user is not a participant (403)
  - Updates existing entry or appends new one (no duplicates per user)
  - Recomputes `rating` as average of all `ratings[].value` and saves
  - Returns `{ rating: newAverage }` to frontend
- ✅ `server/routes/lessons_routes.ts` — added `POST /:id/rate` (authMiddleware)
- ✅ `oraita-web/src/hooks/useSingleLesson.ts`:
  - Added `ratings: Array<{ user: string; value: number }>` to `SingleLessonData` interface
  - Added `rating` (submitting state), `rateLesson(value)` action
  - Added `isPast` — true when lesson date is strictly before today (uses `split('T')[0]` for safe date comparison)
  - Added `userRating` — current user's star value from `lesson.ratings`, 0 if not rated
  - `setLesson` updater updates `lesson.rating` + `lesson.ratings` immediately on success → live re-render, no page reload
  - Guard: `prev.ratings ?? []` in updater in case older DB docs return undefined
- ✅ `oraita-web/src/pages/SingleLesson.tsx` — star rating card shown only when `isPast && isParticipant`:
  - 5 clickable ★ symbols (gold `#D4A373` for rated stars, grey for unrated)
  - Disabled while submitting; shows success message via `actionMsg`
  - Users can re-click a different star to change their rating

#### Delete Confirmation (Hebrew)
- ✅ `oraita-web/src/pages/Dashboard.tsx` — `LessonRow` now has local `confirming` state:
  - First click on 🗑️ מחק shows: **"האם אתה בטוח שברצונך למחוק?"** + `כן, מחק` / `ביטול` buttons inline
  - `כן, מחק` proceeds with deletion; `ביטול` hides the confirmation with no action
  - No browser `confirm()` dialog — fully inline React state

#### Verified (live API tests)
- Rating saves and recomputes average correctly
- Changing a rating updates the existing entry (count stays constant)
- All guard cases rejected: non-participant, invalid value, future lesson

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

### Session 7 (2026-07-06) — Google Login Phone Prompt, Favorites Toggle, Cancel Registration, Past-Lesson Sync Fix

#### Google Login — optional phone prompt (no more fabricated numbers)
- Fixed bad data: removed an incorrect phone number from the `hasidshani@gmail.com` account — it had been typed manually through the regular registration form, not generated by Google login as first suspected. Confirmed via direct DB query that no account had ever actually signed in through Google (`password: 'google-signin'` matched zero users) before implementing the fix.
- `server/controllers/userController.ts` — `googleSignin` now returns `phone` + `favorites` on the user object; new `updatePhone` controller updates the logged-in user's phone
- `server/validation/userValidation.ts` — added `updatePhoneSchema`
- `server/routes/users_routes.ts` — added `PATCH /api/users/phone` (authMiddleware + validate)
- `oraita-web/src/context/AuthContext.tsx` — added `phone`/`favorites` to `AuthUser`, new `updateUser()` helper to patch the in-memory user after an action succeeds
- `oraita-web/src/pages/Login.tsx` — after a Google login where `user.phone` is empty, shows an inline "add a phone number?" prompt (Yes → input → `PATCH /users/phone`; No/Skip → continue). Reappears on every Google login until a phone is saved.

#### Favorites toggle (color change on save/unsave)
- `oraita-web/src/hooks/useSingleLesson.ts` — replaced the one-way `addFavorite` with `isFavorited` + `toggleFavorite` (adds or removes depending on current state)
- `oraita-web/src/pages/SingleLesson.tsx` — favorite button now toggles: filled red (`btn-danger`, 💔 "הסרה מהמועדפים") when favorited, outlined red (`btn-outline-danger`, ❤️ "שמירה במועדפים") when not
- Backend `login`/`googleSignin` responses now include `favorites` so the toggle state is correct immediately after login, not just after a refresh

#### Cancel class registration
- `server/controllers/lessonController.ts` — new `leaveLesson` (validates the user is actually a participant before removing them)
- `server/routes/lessons_routes.ts` — added `DELETE /api/lessons/:id/join`
- `oraita-web/src/pages/SingleLesson.tsx` — the "רשום לשיעור" state is now clickable and shows an inline Hebrew confirm before cancelling (no browser `confirm()`)
- `oraita-web/src/pages/Dashboard.tsx` — `LessonRow` generalized to take either `onDelete` (created lessons) or `onLeave` (joined lessons), same inline-confirm pattern as the existing delete flow
- `oraita-web/src/hooks/useDashboard.ts` — added `leaveLesson` action

#### Past-lesson sync bug fix
- Root cause: four different places independently decided whether a lesson was "past" — `useLessons.ts` and `useTeacherProfile.ts` filtered correctly (with duplicated logic each), but `HomePage.tsx` (city counts) and `useDashboard.ts` (joined/created/favorites tabs) didn't filter past lessons at all. That's why the homepage showed stale counts (2 for Netanya, 3 for Pardes Hanna) while All Lessons showed nothing, and why an expired class kept appearing on the Dashboard.
- New `oraita-web/src/utils/lessonDate.ts` — single shared `isLessonUpcoming(lesson)` helper
- Applied consistently in `HomePage.tsx`, `useLessons.ts`, `useTeacherProfile.ts` (deduping their previous inline copies), and `useDashboard.ts` (joined/created/favorites now correctly hide past lessons)
- Decision (confirmed with user): do **not** hard-delete past lessons — the star-rating feature requires a lesson to still exist and be past in order for participants to rate it. Instead added a **"שיעורים שעברו" (Past Lessons)** tab to Dashboard, listing every past lesson the user created or joined; rows for lessons they created get a 🗑️ delete button (creator-only, existing permission), joined-only rows are view-only since deleting someone else's lesson was never allowed server-side
- Confirmed against real DB data: all 5 existing sample lessons are dated before 2026-07-06, so with this fix the homepage and All Lessons now correctly show 0/empty until new future-dated lessons are created — expected, not a bug (sample data had simply aged past its dates)

#### Verified
- Backend, live via curl against a temporary QA account (deleted afterward): join → favorite → unfavorite → cancel registration → re-cancel (correctly rejected with 400)
- `PATCH /api/users/phone` saves and returns the updated phone
- `tsc --noEmit` (backend) and `tsc -b` (frontend) both clean — only a pre-existing, unrelated `CreateLesson.tsx` warning remains (fixed in Session 8)

### Session 8 (2026-07-07) — Edit Lesson, Line-Break Fix, Hebrew Auth Errors, DB Cleanup

#### TeacherProfile empty-state wording
- `oraita-web/src/pages/TeacherProfile.tsx` — "לא נמצאו שיעורים עבור מורה זה" → "לא נמצאו שיעורים **עתידיים** עבור מורה זה", since the page only ever lists a teacher's future lessons

#### Database cleanup — duplicate "שני חסיד" accounts
- Found 3 user documents with `name: "שני חסיד"` under different emails (`hasidshani@gmail.com` / phone `0534567877`, `gaya@gmail.com` / phone `0543346768`, `or@gmail.com` / phone `056778654`) — leftover from earlier manual testing of different Google accounts, not a dedup bug (Google sign-in matches by email, so different emails correctly create different users)
- Verified via direct DB queries that neither duplicate had created/joined any lesson, posted a comment, or rated a lesson before deleting
- Deleted the `gaya@gmail.com` and `or@gmail.com` documents; `hasidshani@gmail.com` (phone `0534567877`) is now the only "שני חסיד" account

#### Google login phone-prompt — re-verified, no change needed
- Re-read `Login.tsx`'s `handleGoogleSuccess` and `userController.ts`'s `googleSignin`: the prompt already only appears when `!user.phone`, and `googleSignin` never resets `phone` on an existing user, so a saved phone correctly suppresses the prompt on every later login (Google or password). Confirmed this was already correct — the duplicate accounts above were the actual issue, not this logic.

#### Line-break rendering in lesson description
- `oraita-web/src/pages/SingleLesson.tsx` — description `<p>` now has `style={{ whiteSpace: 'pre-wrap' }}`, so a teacher's typed line breaks render as real line breaks instead of being collapsed by default HTML whitespace handling
- Verified via a live API round-trip: created a lesson with `\n` in the description, confirmed it's stored and returned intact by the backend (the fix is purely a frontend rendering concern — the data was never the problem)

#### Edit lesson (creator only)
- `server/controllers/lessonController.ts` — new `updateLesson`: loads the lesson, 403s if `lesson.creator` isn't the requesting user (same pattern as `deleteLesson`), otherwise overwrites `title`/`description`/`category`/`city`/`date`/`time`/`image` and saves
- `server/routes/lessons_routes.ts` — added `PATCH /:id` (authMiddleware + `validate(createLessonSchema)`, reusing the same schema as lesson creation)
- `oraita-web/src/pages/CreateLesson.tsx` — converted to dual-mode create/edit:
  - Reads an optional `:id` route param; when present (`/editlesson/:id`), fetches the lesson on mount and prefills every field, redirecting away if the logged-in user isn't the creator
  - Submits via `PATCH /lessons/:id` (→ navigates back to `/lesson/:id`) instead of `POST /lessons` (→ `/alllessons`) when in edit mode
  - Skips the "can't schedule a lesson in the past" guard in edit mode, so a teacher can add to the description of a lesson that's already past or already scheduled
  - Removed the pre-existing unused `DEFAULT_IMG` constant while rewriting the file (was flagged by `tsc -b` before this session)
- `oraita-web/src/App.tsx` — added `PrivateRoute`-wrapped `/editlesson/:id` route
- `oraita-web/src/pages/SingleLesson.tsx` — "✏️ ערוך שיעור" button in the sidebar, shown only when `user?._id === lesson.creator._id`
- Verified live via curl against temporary QA accounts (both deleted afterward): non-creator PATCH → 403; creator PATCH → 200 with the multi-line description update persisted and returned correctly on a follow-up GET

### Session 9 (2026-07-13) — Lecturer Feedback Review + Docs Correction

#### Lecturer feedback received
Two points on the current implementation:
1. **Google auth** — architecture sound, but needs an `email_verified` check on the Google token payload, plus confirmation the token is authenticated against `GOOGLE_CLIENT_ID`.
2. **Cloudinary upload** — the upload mechanism isn't secure/authenticated (currently open), and the `image` field needs to be validated as an actual URL.

#### Investigation (no code changes made yet)
- Confirmed `googleSignin` (`server/controllers/userController.ts`) already passes `audience: process.env.GOOGLE_CLIENT_ID` to `verifyIdToken` — that half of the lecturer's Google-auth ask is already satisfied. The real gap is `payload?.email_verified`, which is never checked.
- Confirmed `POST /api/file` (`server/routes/file_routes.ts`) has no auth middleware — open to unauthenticated requests, matching the lecturer's note exactly.
- Confirmed `image` field in `server/validation/lessonValidation.ts` is `Joi.string().allow('').optional()` — accepts any string, not validated as a URL.
- Sent the lecturer clarifying questions before implementing (scope of the `GOOGLE_CLIENT_ID` fail-closed check; whether upload auth should be general-login-gated or narrower; whether URL validation should be generic `Joi.string().uri()` or restricted to the Cloudinary domain specifically, since images are only ever supposed to originate from our own Cloudinary account). Awaiting reply.

#### Docs correction (unrelated to the lecturer's note, found while investigating)
- Discovered `PROGRESS.md` still documented the original local-disk Multer upload flow (images saved to `FinalProject/public/`), but the codebase had already migrated to Cloudinary (`server/routes/file_routes.ts` uses `cloudinary.uploader.upload_stream`, `cloudinary` is in `package.json`, `CLOUDINARY_*` env vars are in `.env.example`). Confirmed via `git log` that this migration is already committed (part of commit `9700e3e`, "Add content image and Google OAuth login") — not in-progress work, just a docs gap from that session.
- Also found `middleware/upload.ts` (the old disk-storage Multer config) is now fully dead code — not imported anywhere, since `file_routes.ts` has its own inline `memoryStorage` config.
- Also found `SERVER_URL` env var is no longer referenced anywhere in the code (was only needed to build local `/public/...` URLs under the old flow; Cloudinary returns absolute URLs directly).
- Updated: Tech Stack table, folder structure comments, API endpoint table, "Image Upload Flow" section (rewritten for Cloudinary), Environment Variables section, Deployment Guide (Render env vars + ephemeral-disk note), Known Issue #3 (marked resolved), and added the two lecturer-flagged gaps to a new "Still To Do" entry so they don't get lost before the lecturer replies.

#### Lecturer reply received (image URL validation question only)
- Lecturer confirmed: images should always come from Cloudinary (upload → `secure_url` → passed to lesson creation), but nothing on the server currently enforces that link — `POST /api/lessons` / `PATCH /api/lessons/:id` accept `image` as a free JSON string, so right now any string is accepted, including an arbitrary external URL.
- His answer: use the **Cloudinary-domain-restricted** validation (`res.cloudinary.com/<cloud_name>/...`), not a generic `Joi.string().uri()` check — the generic check would still let through non-Cloudinary URLs, which is weaker than the app's actual intended design.
- This resolves the URL-validation half of the original Cloudinary question. Recorded as item 6 in "Still To Do" above, marked ready to implement.
- **Still waiting on:** (a) whether `POST /api/file` auth should be a blanket login check or scoped narrower to lesson creation, (b) whether the Google auth fix needs an added fail-closed guard for a missing `GOOGLE_CLIENT_ID`. Nothing should be implemented for those two until he replies.

#### Hebrew auth error messages
- `server/controllers/userController.ts` — translated the messages users actually see: login wrong-password/unknown-email (`"אימייל או סיסמה שגויים"`), login missing-fields fallback, login token-generation failure, register duplicate-email (`"קיים כבר משתמש עם כתובת אימייל זו"`), register missing-fields fallback
- `server/validation/userValidation.ts` — added Hebrew `.messages()` overrides to every field in `registerSchema`, `loginSchema`, and `updatePhoneSchema` (empty/required/min-length/invalid-email cases), since `Login.tsx`/`Register.tsx` render the JOI `errors` array directly
- Deliberately left 401/token-refresh error text in English — `oraita-web/src/services/api.ts`'s response interceptor handles those silently (clears tokens, redirects to `/login`) and never renders the message as text, so there's no user-facing benefit to translating them
- Verified live: wrong password, unknown email, missing password, register with a too-short password, and register with a duplicate email all now return Hebrew messages

#### Rate limiter — explained, not a bug
- User hit `"Too many requests, please try again after 15 minutes."` on the All Lessons page — traced to `apiLimiter` in `server/middleware/rateLimiter.ts` (100 requests/15min per IP, applied to all of `/api/*` in `app.ts:46`), tripped by the volume of curl requests used to verify the fixes above against the local dev server. Not a code issue; resets automatically after the time window. Offered to raise the local limit or exempt development mode if it becomes disruptive during testing — no decision made yet.

### Session 10 (2026-07-26 – 2026-07-27) — Lecturer Feedback Items 4-6 Implemented + Verified + Refined

#### Implementation
The two open sub-questions from Session 9 (blanket vs. scoped upload auth; whether to add the `GOOGLE_CLIENT_ID` fail-closed guard) were still unanswered by the lecturer, so they were put to Shani directly to decide rather than blocking further — she chose blanket `authMiddleware` for uploads and confirmed the fail-closed guard should be added.

- `server/controllers/userController.ts` (`googleSignin`) — added a 500 guard when `GOOGLE_CLIENT_ID` is unset before calling `verifyIdToken`, and added `!payload.email_verified` to the existing email check
- `server/routes/file_routes.ts` — added `authMiddleware` to `POST /api/file`; unauthenticated uploads now 401
- `server/validation/lessonValidation.ts` — `image` field now uses a `.custom()` Joi validator requiring the value start with `https://res.cloudinary.com/<CLOUDINARY_CLOUD_NAME>/`, read from `process.env` at request time (not baked in at module load, which would have raced `dotenv.config()` in `server.ts`)
- Verified live end-to-end with a temporary QA account (deleted after, along with its test lesson): unauthenticated upload → 401; authenticated upload with no file → 400 (correctly reaches multer); non-Cloudinary `image` URL on lesson create → 400; real Cloudinary-shaped URL → 201. `tsc --noEmit` clean.

#### MongoDB inspection (how images are actually stored)
- Queried the `lessons` collection directly: 15 lessons total, 13 with a real `https://res.cloudinary.com/dm0dy48um/image/upload/v<timestamp>/oraita/<public_id>.<ext>` URL, 2 with `image: ""` (created before an image was attached — allowed since the field is optional). Confirmed this matches exactly what the new validator now enforces going forward.

#### Deeper verification of the two Google-auth checks
Shani asked how to actually *check* (not just read) that the `email_verified` and `GOOGLE_CLIENT_ID` fixes work, since real Google logins essentially always carry `email_verified: true` and can't be used to trigger the rejection path through the UI.
- **`email_verified`** — wrote a throwaway script (`qa_test_email_verified.ts`, deleted after) that monkey-patches `OAuth2Client.prototype.verifyIdToken` and calls the real `googleSignin` function directly with a mocked payload: `email_verified: false` → `400 "Invalid Google token"`, no user created in DB; `email_verified: true` → `200`, user created normally. Both test users deleted afterward.
- **`GOOGLE_CLIENT_ID`** — live-tested against the actual running dev server: temporarily commented out `GOOGLE_CLIENT_ID` in `server/.env`, killed and restarted the backend (`ts-node-dev`, PID captured via `netstat`/`taskkill`), confirmed a Google login attempt now returns `500 "Google login is not configured"`. Restored the env var, restarted again, confirmed normal behavior (`400 "Google authentication failed"` for a fake token — Google's own verification failing, not the config guard).

#### Image validation refined after lecturer's detailed written explanation
Lecturer sent a fuller explanation of Level A (`Joi.string().uri()` only) vs. Level B (Cloudinary-domain-restricted), with his own example code including `Joi.string().uri({ scheme: ['https'] }).pattern(/^https:\/\/res\.cloudinary\.com\//)`. Compared against our implementation:
- Our cloud-name-specific check (`.../dm0dy48um/...`) is already *stricter* than his example, which only checks the bare `res.cloudinary.com` domain — no change needed there.
- We were missing his `.uri({ scheme: ['https'] })` structural check, which rejects malformed strings (stray spaces, control characters) even if they happen to share the right domain prefix. Discussed the tradeoff (cheap to add, no legitimate case it would break) and added it.
- A separate suggestion (from another AI tool Shani consulted) to duplicate the Cloudinary check inside `lessonController.ts`'s `createLesson`/`updateLesson` was evaluated and rejected: both routes already run `validate(createLessonSchema)` before the controller executes, so the duplicate check could never fire (dead code), and its proposed regex (domain-only, no cloud name) was weaker than what's already enforced.
- `server/validation/lessonValidation.ts` — added `.uri({ scheme: ['https'] })` ahead of the existing `.custom()` cloud-name check; discovered the scheme-mismatch error uses Joi's `string.uriCustomScheme` code (not `string.uri`) and added that message mapping too, otherwise it silently fell back to Joi's default English text.
- Verified live with 4 cases via a temporary QA account (deleted after, along with its 2 successfully-created test lessons): empty image → 201; valid Cloudinary URL → 201; well-formed-prefix-but-malformed URI (embedded space + `<script>`) → 400 Hebrew message; other domain → 400 Hebrew message. `tsc --noEmit` clean.

#### Docs
Updated PROGRESS.md: API endpoint table, "Image Upload Flow" known-gaps section, "Still To Do" list (moved items 4-6 from pending to done), and item 6's description to reflect the `.uri()` refinement.