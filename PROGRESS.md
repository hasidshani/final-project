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
│   │   ├── users.ts                 ← User schema (name, email, password, phone, favorites, refreshTokens, openToMatch, gender)
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
│   │   ├── authMiddleware.ts        ← JWT verify → sets req.userId; + optionalAuth (sets req.userId if a valid token is present, never rejects — used by the public lesson-detail route)
│   │   ├── errorHandler.ts          ← global 4-param error handler
│   │   ├── logger.ts                ← request logger
│   │   ├── validate.ts              ← JOI middleware wrapper (stripUnknown: true)
│   │   ├── upload.ts                ← dead code — old disk-storage Multer config from the pre-Cloudinary flow, not imported anywhere (file_routes.ts has its own inline memoryStorage config)
│   │   └── rateLimiter.ts           ← apiLimiter (300/15min) + authLimiter (10/15min, skipSuccessfulRequests — only failed attempts count)
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
| PATCH | `/match-preference` | ✅ | Toggle `openToMatch` — opts the user in/out of the match-request feature. Turning it on requires a `gender` ('זכר'\|'נקבה') to be known (passed in this call, or already saved from before) — 400 otherwise |
| POST | `/favorites/:lessonId` | ✅ | Add lesson to favorites |
| DELETE | `/favorites/:lessonId` | ✅ | Remove lesson from favorites |

### Lessons (`/api/lessons`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | ❌ | Get all lessons (creator populated) |
| POST | `/` | ✅ | Create lesson — JSON body (image is a URL string, not a file) |
| GET | `/:id` | ❌ | Get single lesson (creator populated, includes ratings array). Route is public but optionally authenticated (`optionalAuth` middleware) — only authenticated requests get participants populated (`name email openToMatch gender`); anonymous requests get `participants: []` plus an always-accurate `participantsCount` field, so anonymous visitors see the lesson details and how many registered but not who. Phone numbers are never sent here regardless of auth — only ever revealed via an accepted match request (see below) |
| POST | `/:id/join` | ✅ | Join lesson (checks capacity) |
| DELETE | `/:id/join` | ✅ | Cancel registration (leave lesson) — validates user is a participant |
| POST | `/:id/rate` | ✅ | Rate lesson 1-5 stars — participants only, only after lesson date has passed; updates or replaces existing rating, recomputes average |
| PATCH | `/:id` | ✅ | Update lesson (creator only) — JOI-validated, same schema as create |
| DELETE | `/:id` | ✅ | Delete lesson (creator only) — also cascades: deletes the lesson's comments, deletes any match requests tied to it, and pulls its ID from every user's `favorites` array |

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

### Match Requests (`/api/matchrequests`) — the "unique feature"
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/me` | ✅ | Get all match requests (sent or received) for the logged-in user. Phone numbers of `from`/`to` are stripped from the response unless `status === 'accepted'` |
| POST | `/:toUserId` | ✅ | Send a match request to another participant, scoped to a specific `lessonId` (in body, + optional `note` ≤200 chars). Requires: not self, both users have `openToMatch: true`, both have a `gender` set, both genders differ (400 `"ניתן ליצור קשר רק עם משתתפים מהמין השני"` otherwise), both are participants of that lesson, and no existing pending/accepted request already exists between the pair. Still allowed again after a previous request between the pair was declined |
| PATCH | `/:id` | ✅ | Accept or decline a request (`{ status: 'accepted' \| 'declined' }`) — recipient only |

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
{ name, email, password (bcrypt), phone?, openToMatch (default false), gender?: 'זכר' | 'נקבה', favorites: [ObjectId→Lesson], refreshTokens: [string], timestamps }
```
`gender` is required before `openToMatch` can be set to `true` (enforced in `updateMatchPreference`) — match requests are only ever offered between opposite genders.

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

### MatchRequest — new, 4th collection
```ts
{ from: ObjectId→User, to: ObjectId→User, lesson: ObjectId→Lesson, note (≤200 chars, optional), status: 'pending' | 'accepted' | 'declined', timestamps }
```
One request per ordered pair while pending/accepted (enforced in the controller, not a unique index — a new request can be created again after a decline).

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

### ✅ Everything Working (as of 2026-08-02 — lesson deletion now cascades)
- **Fixed: deleting a lesson left orphaned data behind** — `deleteLesson` (`server/controllers/lessonController.ts`) previously only removed the `Lesson` document itself. Any comments on it, match requests referencing it, or entries in other users' `favorites` arrays were left pointing at a lesson that no longer existed. Now, on delete, it also runs `Comment.deleteMany`, `MatchRequest.deleteMany`, and `User.updateMany` (`$pull` on `favorites`) scoped to that lesson's ID.
- **Verified locally against real DB data**: deleted the `דוגמא` lesson (created by הודיה קקון) via the actual authenticated `DELETE /api/lessons/:id` endpoint; confirmed its 1 comment was removed (1 → 0) and the lesson itself was gone afterward. `tsc --noEmit` clean. Not yet verified against a lesson with an active favorite or match request (none existed on the test lesson) — logic is the same pattern as the comment cleanup, but that path hasn't been proven against real data yet.
- ✅ **Committed and pushed** (commit `09ac346`, 2026-08-02) — confirmed 2026-08-03 that `main` is up to date with `origin/main`. Render redeploys from `main` automatically, so production should already be running this version (not independently re-verified live).

### ✅ Everything Working (as of 2026-07-30 — deployment complete, PrivateRoute white-screen fix)
- **Live and verified end-to-end**: frontend at `https://oraita.vercel.app` (Vercel), backend at `https://oraita-api.onrender.com` (Render), both confirmed deployed and in sync on the latest commit via their respective dashboards. Full detail in Session 15.
- **Vercel project renamed** from the auto-generated `final-project-nu-lime.vercel.app` to the custom domain `oraita.vercel.app` (old domain still works as an alias, no redirect needed).
- **Fixed: `vercel.json` SPA rewrite never actually shipped** — the commit adding it existed locally but was never pushed to `origin/main`, so Vercel had never built with it despite PROGRESS.md saying it was done. Pushed; direct navigation to `/login`/`/register` etc. now works.
- **Fixed: production 404 on every API call** — Vercel's `VITE_API_URL` env var was missing the `/api` suffix (`https://oraita-api.onrender.com` instead of `.../api`), so every request from `services/api.ts` 404'd, including plain email/password login and Google sign-in. Corrected + redeployed with a clean build (Vite bakes env vars in at build time, so the fix required a non-cached rebuild).
- **Fixed: Google Sign-In `origin_mismatch`** — the live Vercel domain wasn't yet in Google Cloud Console's Authorized JavaScript Origins (only `localhost` was). Added; also updated Render's `CLIENT_URL` to the real Vercel domain (confirmed via a live CORS preflight check returning the correct `Access-Control-Allow-Origin`).
- **Fixed: `PrivateRoute` blank/white screen on protected routes** — `PrivateRoute.tsx` rendered `null` while `AuthContext`'s auth check was in flight. Not an infinite-loading bug (`AuthContext`'s `.finally()` always resolves `loading`), but Render's free tier cold-starts after ~15 min idle (confirmed via Render's own dashboard warning: "can delay requests by 50 seconds or more"), so a returning user with a stale token could see a blank page for that whole window. Now shows a themed Bootstrap spinner instead.

### ✅ Everything Working (as of 2026-07-28 — match-request fixes, gender restriction, deployment kickoff)
- **Anonymous visitors no longer see participant names** — `GET /api/lessons/:id` now optionally-authenticated; only logged-in requests get participant names/emails, anonymous ones get a `participantsCount` only. Full detail in Session 14.
- **Match requests only offered between opposite genders** — new required `gender` field, enforced both client-side (button visibility) and server-side (`createMatchRequest`). Existing accounts that opted in before this feature are prompted for gender automatically.
- **Fixed a real bug where a user's own name/phone showed instead of the other party's** in the Dashboard's accepted-contacts view — see Session 14 for the root cause.
- **Declined match requests are now visible to the sender** (previously silently vanished) — new "בקשות שנדחו" section + inline note, resend still allowed.
- **Login rate-limit false positives fixed** — successful logins no longer count toward the 10-per-15-min `authLimiter` cap.
- **Dashboard and All Lessons pages have a warm background treatment** instead of flat white/cream — visual-only, not yet confirmed in a live browser.
- **Deployment started** — MongoDB Atlas and Render (backend) are live; Vercel (frontend) and final wiring still pending. See "Deployment Guide" section for exact status.

### ✅ Everything Working (as of 2026-07-27 — visual design pass)
- **New public About page** (`/about`, reachable from Navbar + Footer, no login required) — Shani's personal introduction to the site, word-for-word, with a photo banner (her own uploaded photo, not stock) and a gold double-frame around the text card. Full detail in Session 13.
- **Homepage hero redesign** — large "אורייתא" wordmark, continuously scrolling background photo strip mixing real lesson photos with stock filler, dark-to-gold overlay for readability. Also fixed a pre-existing dead fallback-image URL (404) used across `LessonCard`/`SingleLesson`.
- **Nav order** — Navbar/Footer public links now read דף הבית → אודות → כל השיעורים.

### ✅ Everything Working (as of 2026-07-27 — "unique feature")
- **Match requests ("unique feature" for the lecturer)** — TeacherProfile now shows a teacher's past lessons too (see below), and participants of a shared lesson who are both opted in (`openToMatch`) can request to connect; the recipient accepts/declines from a new Dashboard tab; phone numbers are only ever revealed after acceptance. Full design context in Session 12.
- **Fixed a real privacy bug found while designing the above** — `GET /api/lessons/:id` (a public, unauthenticated route) used to return every participant's phone number to anyone who loaded the page, logged in or not. Participants are now populated with `name email openToMatch` only; phone numbers are exclusively delivered via `GET /api/matchrequests/me`, and only for accepted requests.
- **TeacherProfile now shows past lessons** — new "שיעורים קודמים" tab (alongside "שיעורים קרובים"), so a teacher's star ratings (which can only exist on past lessons) are actually visible somewhere. Previously the page filtered to upcoming-only, which meant the "⭐ דירוג ממוצע" badge could never have data.

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

### ⚠ Still To Do
1. **Add screenshots to README** — placeholder section added 2026-07-27; needs real screenshots of HomePage/AllLessons/SingleLesson/Dashboard/CreateLesson before submission.
2. **Mobile responsiveness** — never verified in an actual browser; do a manual check.
3. **Delete dead code** — `server/middleware/upload.ts` (old pre-Cloudinary disk-storage Multer config) is unused by any route; safe to delete.
4. Update README's "Live Demo" URLs now that the site is deployed (currently `_coming soon_`) — frontend `https://oraita.vercel.app`, backend `https://oraita-api.onrender.com`.
5. **Compress `oraita-web/src/assets/about-banner.jpg`** — ~2.3MB in the production bundle (flagged Session 13), worth shrinking before the lecturer loads the live site.
6. Consider rotating the MongoDB Atlas database password — it was pasted in plaintext into a chat session while setting up Render env vars (2026-07-28). Not a code issue, just a "the value has been typed somewhere outside the .env file" hygiene note.

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

**Status as of 2026-07-30: All phases (A–E) done. Live at `https://oraita.vercel.app` (frontend) and `https://oraita-api.onrender.com` (backend). Both dashboards confirmed deployed and in sync on the same commit. See Session 15 for the several rounds of post-launch fixes it took to get here (unpushed `vercel.json` commit, missing `/api` suffix on `VITE_API_URL`, Google origin_mismatch, stale `CLIENT_URL`).**

### A — MongoDB Atlas ✅ done
1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → free M0 cluster
2. Database Access → add user with password
3. Network Access → `0.0.0.0/0` (required — Render has no fixed IP to whitelist)
4. Connect → Drivers → Node.js → copy connection string → replace `<password>` → add db name (`/oraita_db`) before the `?`

### B — Render (backend) ✅ done
- Build command: `npm install && npm run build` — **not just `npm run build`.** Render does not automatically run `npm install` before a custom Build Command; whatever is in that field is the entire build step. The first deploy attempt used just `npm run build` and failed with `Cannot find module 'express'` / `'mongoose'` / `Cannot find name 'process'` — not a `dependencies`/`devDependencies` placement bug (verified all the `@types/*` packages are correctly in `devDependencies`), but `node_modules` never being installed at all. Fixed by prefixing `npm install &&`.
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
  `CLIENT_URL` is now the real production Vercel domain: `https://oraita.vercel.app` (confirmed 2026-07-30 via a live CORS preflight check — `Access-Control-Allow-Origin` echoes the correct domain).
- Uploaded images go to Cloudinary, not the local filesystem, so Render's ephemeral disk is no longer a concern for images (see Known Issue #3, updated).
- **Free tier note**: the instance spins down after ~15 min idle; Render's own dashboard warns this "can delay requests by 50 seconds or more" on the next request. See Known Issue #9 and Session 15's `PrivateRoute` fix.

### C — Vercel (frontend) ✅ done
- Root directory: `oraita-web`
- Framework: Vite (auto-detected)
- Output directory: `dist`
- Custom domain: `https://oraita.vercel.app` (renamed from the auto-generated `final-project-nu-lime.vercel.app`, which still works as an alias)
- Environment variables (both confirmed set):
  ```
  VITE_API_URL          = https://oraita-api.onrender.com/api
  VITE_GOOGLE_CLIENT_ID = <same value as oraita-web/.env — Google client IDs are public/client-side by design>
  ```
  **Footgun hit in Session 15**: `VITE_API_URL` was initially saved *without* the `/api` suffix, which 404'd every single API call in production (login, register, Google sign-in — everything). Vite bakes env vars in at build time, so fixing the dashboard value alone wasn't enough — it needed a rebuild with the build cache cleared, not just a redeploy.
- **First deploy failed:** `[vite]: Rolldown failed to resolve import "bootstrap/dist/css/bootstrap.min.css"`. Root cause: `bootstrap` was only ever declared as a dependency in the **root** `package.json` (used by the backend), not in `oraita-web/package.json`, even though `oraita-web/src/main.tsx` imports it directly. Locally this worked because Vite falls back to the parent `node_modules`; Vercel only installs within the configured Root Directory (`oraita-web`), so the import had nothing to resolve. Fixed 2026-07-29 by adding `"bootstrap": "^5.3.8"` as a real dependency in `oraita-web/package.json`.
- **Direct navigation to any non-root route (e.g. `/login`) 404'd** (`404: NOT_FOUND`) even after `oraita-web/vercel.json`'s catch-all rewrite was committed — turned out the commit adding it had never been pushed to `origin/main` (`git log` showed local `main` was 1 commit ahead of `origin/main`). Vercel builds from GitHub, so it had simply never seen the file. Fixed 2026-07-30 by pushing the commit; confirmed working on redeploy.

### D — After both are live ✅ done
- Render `CLIENT_URL` → updated to `https://oraita.vercel.app`, confirmed via live CORS preflight.
- Google Cloud Console → OAuth 2.0 Client ID → Authorized JavaScript Origins → added `https://oraita.vercel.app` (was only `localhost`, which caused a live `origin_mismatch: 400` error on the Google sign-in screen — fixed 2026-07-30).

### E — Verify ✅ done
- Confirmed via both platforms' dashboards (2026-07-30): Vercel shows **Ready**, Render shows **Deployed**, both on the same latest commit (`a2e2b7f`).
- Manually verified on the live site: register, login (email/password), create lesson, add comment — all working with no console errors referencing the old domain or CORS. Google sign-in and the match-request flow were verified earlier in the session by Shani directly (not re-run via automation this pass).

---

## Known Issues / Notes

1. **Express 5 + req.query bug (FIXED):** Express 5 re-parses `req.query` on every access so `req.query.userId = value` in middleware is silently lost. Fixed via `server/types/express.d.ts` and `req.userId` everywhere.

2. **Bootstrap location:** Bootstrap is in root `node_modules/` (root `package.json`), not `oraita-web/package.json`. Vite resolves it from the parent. Works fine.

3. **Multer + ephemeral Render filesystem (RESOLVED via Cloudinary migration):** Originally uploaded images were stored on Render's ephemeral disk and lost on restart. Fixed by migrating `/api/file` to upload to Cloudinary instead (Multer now only buffers the file in memory before streaming it to Cloudinary — nothing is written to local disk anymore). The old `public/`/`uploads/` static routes remain in `app.ts` for backwards compatibility with any pre-migration image URLs already saved in the DB.

4. **`React.FormEvent<T>` deprecated in React 19:** Use `{ preventDefault(): void }` as the event type instead. Already applied everywhere.

5. **Past lesson filtering is client-side only (by design):** Backend still returns all lessons — deliberately not hard-deleted, since participants need past lessons to still exist in order to rate them. All frontend list views (`HomePage`, `AllLessons`, `TeacherProfile`, `Dashboard`) now share one `isLessonUpcoming()` helper (`oraita-web/src/utils/lessonDate.ts`) instead of each filtering independently — this was the root cause of a 2026-07-06 bug where the homepage showed stale city counts while All Lessons/Dashboard disagreed. Past lessons are still reachable via the Dashboard's "שיעורים שעברו" tab.

6. **Helmet CORP header (FIXED):** Helmet adds `Cross-Origin-Resource-Policy: same-origin` to all responses by default. This blocked the React frontend (port 5173) from loading images served by the backend (port 3000) since they are different origins. Fixed by overriding the header to `cross-origin` specifically on the `/public` and `/uploads` static routes.

7. **Image URL stored in MongoDB:** The `image` field in the `lessons` collection stores the full URL string (e.g. `http://localhost:3000/public/1234567890.jpg`). Visible in MongoDB Compass under the `lessons` collection.

8. **Render Build Command must include `npm install` explicitly (FIXED 2026-07-28):** Unlike some other Node hosts, Render does not automatically run `npm install` before a custom Build Command — whatever's in that field is the entire build step. Setting it to just `npm run build` left `node_modules` completely empty, causing `tsc` to fail with `Cannot find module 'express'`/`'mongoose'`/`Cannot find name 'process'` (looked like a `dependencies`/`devDependencies` placement bug at first, but all the `@types/*` packages were already correctly placed — nothing had been installed at all). Fixed by setting the Build Command to `npm install && npm run build`.

9. **Render free tier cold starts (MITIGATED 2026-07-30):** The backend spins down after ~15 min of inactivity; Render's own dashboard warns the next request "can delay requests by 50 seconds or more." This isn't fixable without a paid plan, but its main user-facing symptom — a blank white screen on protected routes while the auth check waits on a sleeping backend — is mitigated: `PrivateRoute.tsx` now shows a spinner during that wait instead of rendering nothing. See Session 15.

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
✅ DELETE /api/lessons/:id as creator → 200, lesson gone AND its comments deleted (verified against real data: 1 comment → 0). Favorites/match-request cleanup paths exercised in code but not yet verified against a lesson with real favorites/match-request data attached.
```

---

## Grading Checklist (from rubric)

| Category | Points | Status |
|----------|--------|--------|
| Backend Architecture | 25 pts | ✅ MVC structure, error handler, middleware chain, no logic in routes |
| Database Design | 15 pts | ✅ 4 collections (Users, Lessons, Comments, MatchRequests), ObjectId refs, required fields, timestamps |
| Authentication & Security | 20 pts | ✅ bcrypt, JWT + refresh tokens, protected routes, rate limiting, Helmet |
| Frontend — React & State | 20 pts | ✅ Context API + Redux, custom hooks (`src/hooks/`), components, lazy loading, React.memo, `.map()` lists |
| UI/UX & Responsiveness | 10 pts | ⚠ Loading/error states ✅ — mobile responsiveness needs manual check |
| Deployment | 5 pts | ⚠ In progress — Atlas ✅ + Render ✅ live, Vercel + final wiring (Phase D) pending (see guide above) |
| Git Workflow & README | 5 pts | ✅ README.md complete + .env.example committed |

---

## Session Log

### Session 16 (2026-08-02) — Lecturer Q&A Prep + Lesson-Deletion Cascade Fix

#### Context
Shani is preparing to explain the codebase to her lecturer and worked through a series of "where is X and how do I explain it" questions: where `VITE_API_URL` is set (local `.env` vs. Vercel dashboard, and why the Vercel Sensitive-value field shows blank/placeholder — expected behavior, not a bug), where the API base URL is configured in code (`oraita-web/src/services/api.ts`), what `StrictMode`/`GoogleOAuthProvider`/Redux are and where they live (`main.tsx`, `store/`), where the MongoDB connection happens (`server/server.ts`), the Vercel/Render/Atlas three-tier architecture (frontend host vs. backend server vs. database — clarified that "the server" specifically means Render, not Atlas), and how to actually retrieve the real Atlas connection string (not stored anywhere in the repo — only in Render's env vars and Atlas itself).

#### Real gap found and fixed: lesson deletion didn't cascade
While explaining what `DELETE /api/lessons/:id` does, reviewed `deleteLesson` and found it only ran `Lesson.findByIdAndDelete` — comments, match requests, and favorites referencing that lesson were never cleaned up, leaving orphaned data behind (dangling `favorites` entries, comments/match-requests pointing at a nonexistent lesson). Shani wanted this fixed before demonstrating a delete to her lecturer.
- `server/controllers/lessonController.ts` (`deleteLesson`) — after deleting the lesson, now also runs `Comment.deleteMany({ lesson })`, `MatchRequest.deleteMany({ lesson })`, and `User.updateMany({ favorites: lesson }, { $pull: { favorites: lesson } })`, all scoped to the deleted lesson's ObjectId.
- Verified live against the real local dev DB: started the backend locally, found the `דוגמא` ("Example") lesson (creator: הודיה קקון), snapshotted related data first (1 comment, 0 match requests, 0 favorites referencing it), minted a short-lived JWT for the creator using the local `TOKEN_SECRET` (same payload shape `authMiddleware` expects) to call the real authenticated endpoint without needing her password, deleted it via `DELETE /api/lessons/:id`, then re-ran the snapshot: lesson gone, comment count 1 → 0. `tsc --noEmit` clean.
- **Caveat**: the favorites/match-request cleanup paths weren't exercised against real data (this particular test lesson had none in those two categories) — same code pattern as the verified comment cleanup, but not independently proven yet.
- **Not committed yet** — change exists only in the local working tree as of this session; see `git status`. Suggested commit message: `Fix deleteLesson to also remove its comments, match requests, and favorites` (kept separate from two unrelated pre-existing uncommitted tweaks in `oraita-web/src/services/api.ts` and `server/controllers/userController.ts`).
- Also note: the `דוגמא` lesson used for verification is now actually gone from the local dev DB — recreate a similar lesson (ideally with a favorite + comment + match request attached) before demoing this live to the lecturer, to prove all three cleanup paths at once.

### Session 15 (2026-07-30) — Deployment Debugging Marathon: Domain Rename, Google Auth, SPA Routing, PrivateRoute White Screen

#### Context
Continuing Session 14's deployment kickoff. Shani opened the live site and hit a string of production-only bugs, each investigated and fixed in turn over the course of the day, ending with a full verification pass confirming both platforms live and in sync.

#### Google OAuth `origin_mismatch` + CORS on plain login
First report: Google sign-in showed `origin_mismatch: 400` on Google's own screen, and plain email/password login showed a generic "שגיאה בשרת" server error. Root cause for both: Render's `CLIENT_URL` was still the placeholder from Session 14, and Google Cloud Console's Authorized JavaScript Origins only listed `localhost` — neither had been pointed at the real Vercel URL yet. Walked Shani through both dashboard fixes manually (no code changes — these are external dashboard settings, not something editable from the repo).

#### Production 404 on every API call — `VITE_API_URL` missing `/api`
A second, deeper report ("Google route returns 404") turned out to share one root cause with the CORS issue above: Vercel's `VITE_API_URL` env var was set to `https://oraita-api.onrender.com` — missing the `/api` suffix that `services/api.ts`'s fallback (`'http://localhost:3000/api'`) has. Every single request was hitting the wrong path. Fixed the env var; first attempt still failed because Vite bakes env vars in at build time and a plain Vercel "Redeploy" reuses the build cache — needed a rebuild with the cache cleared.

#### Vercel SPA rewrite — committed but never pushed
Direct navigation to `/login`/`/register` kept 404ing even though `oraita-web/vercel.json`'s catch-all rewrite had supposedly been added the day before. Investigation (`git branch -vv`) found local `main` was 1 commit ahead of `origin/main` — the commit existed only locally, so Vercel (which builds from GitHub) had never seen the file. Fixed by pushing; confirmed on redeploy.

#### `PrivateRoute` white-screen bug
Shani reported a blank/white screen when an unlogged-in user hits a protected route, and asked for a full audit + fix, suspecting a race in `AuthContext`'s `loading` state. Investigated thoroughly (including live browser reproduction of several scenarios: fresh load with no token, logout-while-on-a-protected-page, hard reload with a valid token) — `AuthContext.tsx`'s `.finally(() => setLoading(false))` genuinely always resolves `loading`; there's no infinite-hang bug. The real issue: `PrivateRoute.tsx` rendered `null` (nothing) during that check, and Render's free tier can take 30–50+ seconds to wake from a cold start, which is what actually made it read as "stuck" in production. Fixed by rendering a themed Bootstrap spinner instead of `null` while `loading` is true (`oraita-web/src/components/PrivateRoute.tsx`, commit `a2e2b7f`).

Also searched the whole codebase for hardcoded references to the old Vercel domain (`final-project-nu-lime.vercel.app`) after Shani renamed the project to `oraita.vercel.app` — none found; the only "final-project" hits are the unrelated GitHub repo name.

#### Final verification
Confirmed directly via both platforms' dashboards: Vercel shows the production deployment **Ready** on commit `a2e2b7f` with both domains (`oraita.vercel.app` and the old `final-project-nu-lime.vercel.app` alias) attached; Render shows `oraita-api` **Deployed**, "Deploy live for a2e2b7f". Cross-checked `CLIENT_URL`/CORS by hitting the live backend directly with an `OPTIONS` preflight from the new origin — `Access-Control-Allow-Origin` correctly echoed `https://oraita.vercel.app`. Manually re-verified register → login → create lesson → add comment on the live site with zero console errors referencing the old domain or CORS.

Side note: flagged a `vestauth` string in `dotenv`'s console output mid-session as a possible prompt-injection/supply-chain concern — traced to `node_modules/dotenv/lib/main.js` and its own CHANGELOG, confirmed as a genuine (if inappropriate) self-promotional "tip" shipped by the real `dotenv` package, not a compromise.

### Session 14 (2026-07-28) — Match-Request Bug Fixes, Gender-Restricted Matching, Visual Polish, Deployment Kickoff

#### Context
Continuing from Session 12/13's match-request feature. Shani had tested it live with real family accounts (Uri, Michal, Shani herself) and reported several bugs across two rounds of feedback, then asked for a visual polish pass on the Dashboard/All Lessons pages, then moved on to starting deployment (Atlas → Render → Vercel).

#### Bug fixes — match requests
- **Participant privacy for anonymous visitors** — `GET /api/lessons/:id` is public but previously always populated full participant names/emails regardless of login state. Added `optionalAuth` middleware (`server/middleware/authMiddleware.ts`) — sets `req.userId` when a valid token is present but never rejects the request (missing/invalid token just means "anonymous"). `getLessonById` now only populates participant `name/email/openToMatch/gender` when authenticated; anonymous requests get `participants: []` plus a new always-accurate `participantsCount` field. Frontend (`useSingleLesson.ts`, `SingleLesson.tsx`) updated to use `participantsCount` for the "👥 משתתפים (X/Y)" counter and capacity checks, and to only render the actual participant list to logged-in users (anonymous visitors see "התחברו כדי לראות את רשימת המשתתפים" instead).
- **Wrong name/phone shown in "אנשי קשר" (accepted contacts)** — real bug found while investigating Shani's report that her own contacts tab showed "Shani" instead of "Uri". `Dashboard.tsx`'s `MatchRequestRow` computed the displayed "other party" as `mode === 'incoming' ? request.from : request.to` — for the accepted/contacts view this always resolved to `request.to`. Since the real Uri→Shani request has `to: Shani`, her own contacts tab showed her own name and phone number instead of Uri's. Fixed by deriving the other party from whichever side isn't the current viewer (`request.from._id === user?._id ? request.to : request.from`); verified directly against the real DB record (`from: אורי יעקב`, `to: שני חסיד`, `status: accepted`) that the fix produces the correct name/phone for each side.
- **"Both see 0 instead of 1"** — investigated as a suspected pending-count bug (reproduced with temp QA accounts, confirmed `GET /api/matchrequests/me` is correct and consistent across repeated fetches for both sender and recipient). Turned out to be a side-effect of the bug above, not a separate count bug: the real Uri↔Shani request was already `status: accepted` from earlier testing, so 0 pending is correct — the accepted contact just looked broken due to the name mix-up.
- **Declined requests were invisible** — a decline just silently reverted the sender's view back to "🤝 בקש ליצור קשר" with no acknowledgment anything happened, and a new request could be silently sent again. Not changed: resending after a decline is still allowed (unchanged design from Session 12). Changed: the sender now sees "הבקשה הקודמת נדחתה" next to the resend button on `SingleLesson`'s participant row, and a new "בקשות שנדחו" section on the Dashboard's "בקשות היכרות" tab lists declined outgoing requests with a "נדחתה" badge. New `declined` filtered array added to `useMatchRequests.ts` (`requests.filter(r => r.from._id === user._id && r.status === 'declined')`).
- **Login rate limiter false positives** — `"Too many login attempts, please try again later"` was tripping from normal use, not abuse (real family members testing from the same IP/router share one 10-request budget in `authLimiter`, and every successful login/register counted against it same as a failed one). `authLimiter` (`server/middleware/rateLimiter.ts`) now sets `skipSuccessfulRequests: true` — only failed login/register attempts count toward the 10-per-15-min limit; successful logins never trip it. Security posture against actual brute-forcing is unchanged (repeated wrong-password guessing still gets throttled).

#### Gender-restricted matching (new)
Shani asked that match requests only ever be offered between opposite genders — previously any two opted-in participants could request each other regardless of gender, which she flagged as wrong for the feature's intent (a shidduch-style introduction feature, not a general social one).
- `server/models/users.ts` — new optional `gender: 'זכר' | 'נקבה'` field (Hebrew enum values, matching the existing convention used for `category`/`city` on the Lesson model).
- `server/validation/userValidation.ts` — `updateMatchPreferenceSchema` accepts an optional `gender`, validated against the same enum.
- `server/controllers/userController.ts` (`updateMatchPreference`) — turning `openToMatch` on now requires a gender to be known (passed in this call, or already saved) — 400 with a Hebrew message otherwise. `gender` also added to the `loginUser`/`googleSignin` response payloads so the frontend has it immediately after login.
- `server/controllers/matchRequestController.ts` (`createMatchRequest`) — new checks: both users must have a `gender` set (guards accounts that opted into matching before this field existed — e.g. the real Uri/Shani accounts — rather than silently letting them bypass the restriction), and rejects with `"ניתן ליצור קשר רק עם משתתפים מהמין השני"` if both share the same gender.
- `server/controllers/lessonController.ts` — participant populate string extended to include `gender` (needed client-side to gate the request button per participant).
- Frontend: `Dashboard.tsx`'s `MatchPreferenceCard` now prompts for בן/בת (with copy "כדי לדעת אילו הצעות להציג — האם הנך:") the first time a user activates `openToMatch`, and automatically re-prompts existing users who were already active from before this feature existed (detected via `openToMatch === true && !gender`). `SingleLesson.tsx`'s `canRequest` now also requires both sides to have a gender set and for them to differ.
- Verified live end-to-end with temporary QA accounts (registered, tested, then deleted from the DB afterward): enabling match without gender → 400; same-gender request → rejected; opposite-gender request → succeeds; decline → sender sees the declined state and resend still works and succeeds afterward.

#### Visual polish
Shani felt the Dashboard ("לוח בקרה") and All Lessons ("כל השיעורים") pages were "too white."
- New `.page-warm-bg` class (`oraita-web/src/index.css`) — soft gold-tinted radial glows (top and bottom corners) plus a faint dot texture, layered over the existing `--bg-creme` background, using the same `--gold` (#D4A373) token already used everywhere else in the site rather than introducing a new color.
- Applied to a full-width wrapper behind both pages' header+main content (not directly on the Bootstrap `.container`, which would have clipped the gradient to the centered column width instead of spanning the full viewport).
- Not yet visually confirmed in a real browser — the Claude-in-Chrome extension wasn't connected this session. Shani to review live and give feedback; explicitly told this is a first attempt to iterate on, not a final answer.

#### Deployment — started (Atlas ✅, Render ✅, Vercel not yet started)
Walked through the deployment guide interactively, one phase at a time, at Shani's request (to also be able to explain the process to the lecturer afterward).
- **MongoDB Atlas** — free M0 cluster created, database user created, Network Access opened to `0.0.0.0/0` (required since Render has no fixed IP to whitelist), connection string built (`mongodb+srv://.../oraita_db?retryWrites=true&w=majority`).
- **Render (backend)** — Web Service created from the `final-project` GitHub repo (root directory left blank, since the backend lives at the repo root, not a subfolder). All env vars copied from `server/.env`, plus `CLIENT_URL` set to a temporary `http://localhost:5173` placeholder (to be updated once Vercel exists) and `NODE_ENV=production`.
  - **Build failure, real root cause found and fixed**: first deploy failed with `Cannot find module 'express'` / `'mongoose'` / `Cannot find name 'process'`. Verified this was **not** a `dependencies`/`devDependencies` placement issue (`@types/node`, `@types/express`, `@types/jsonwebtoken`, `@types/cors`, `@types/bcrypt` are all correctly in `devDependencies`) — the actual cause was that the Build Command was set to just `npm run build` (per the original deployment guide), and Render does **not** automatically run `npm install` before a custom Build Command. Fixed by changing the Build Command to `npm install && npm run build`; build succeeded. Deployment guide above and Known Issue #8 updated so this doesn't repeat.
- **Stopped here for the day** — Vercel (frontend) setup, then Phase D (pointing Render's `CLIENT_URL` at the real Vercel URL + adding the Vercel URL to Google Cloud Console's authorized JavaScript origins), then full end-to-end verification against the live URLs, are still pending — continuing next session.
- Note: Shani pasted real secrets (Atlas database password, `TOKEN_SECRET`, Cloudinary API secret) directly into the chat while setting up Render's env vars. Flagged to her at the time; she can rotate the Atlas database password if she wants extra caution (highest-value one to rotate, since it grants direct DB access) — not done as of this session, logged as "Still To Do" item 7.

### Session 12 (2026-07-27) — TeacherProfile Past Lessons + Match Requests ("Unique Feature")

#### Context
Lecturer asked for something unique on the project, beyond standard CRUD. Brainstormed with Shani around the site's mixed-gender lesson registration and landed on a lightweight, consent-gated "match request" feature between participants who share a lesson — scoped deliberately small (no bios/photos/profile pages) so it doesn't compete with the lesson platform for focus.

#### TeacherProfile — past lessons now visible
- While investigating, found that `useTeacherProfile.ts` filtered to upcoming lessons only, and since ratings can only exist on *past* lessons, the "⭐ דירוג ממוצע" badge on a teacher's profile could never actually have data — a real gap between two individually-correct features.
- `useTeacherProfile.ts` — now fetches all of a teacher's lessons, splits into `upcomingLessons`/`pastLessons`, computes `avgRating` across all lessons (not just what's displayed)
- `TeacherProfile.tsx` — added a two-tab UI ("שיעורים קרובים" / "שיעורים קודמים"), same pattern as Dashboard's existing tabs

#### Match requests — design
Considered three options (opt-in visibility only / consent-gated request flow / passive badge only); chose the consent-gated request flow. Resolved the "how do they know anything about each other to decide" question by using data already on hand — name + the specific shared lesson — rather than building new profile fields; added one optional short note (≤200 chars) on the request itself as the only extra surface.

#### Implementation
- **New 4th collection** `server/models/matchRequests.ts` — `{ from, to, lesson, note, status: pending|accepted|declined, timestamps }`
- `server/models/users.ts` — new `openToMatch` boolean field (default `false`)
- `server/controllers/matchRequestController.ts` — `createMatchRequest` (validates: not self, both opted in, both are participants of the given lesson, no existing pending/accepted request between the pair), `respondToMatchRequest` (recipient-only accept/decline), `getMyMatchRequests` (strips phone numbers from the response for any request that isn't `accepted` — this is the only place phone numbers are ever exposed)
- `server/routes/matchRequests_routes.ts` — `GET /me`, `POST /:toUserId`, `PATCH /:id`, registered at `/api/matchrequests` in `app.ts`
- `server/controllers/userController.ts` — new `updateMatchPreference`; `openToMatch` (and, incidentally, `phone`, which was missing before) added to the `loginUser`/`googleSignin` response payloads so the Dashboard toggle reflects the right state immediately after login without a refetch
- `server/routes/users_routes.ts` — new `PATCH /match-preference`

- **Fixed a pre-existing privacy bug found along the way**: `getLessonById`'s participants populate was `'name email phone'` on a fully public, unauthenticated route (`GET /api/lessons/:id`) — meaning any visitor, logged in or not, could see every participant's phone number just by opening a lesson page. Changed to `'name email openToMatch'`; phone numbers now only ever travel through `GET /api/matchrequests/me`, and only for accepted requests.

- `oraita-web/src/hooks/useMatchRequests.ts` (new) — fetches `/matchrequests/me`, exposes `incoming`/`outgoing`/`accepted` + `sendRequest`/`respond`. Explicitly guards against firing for anonymous visitors (`if (!user) return`) — `SingleLesson` is a public page, and the app's Axios response interceptor redirects to `/login` on *any* 401, so an unguarded call here would have silently kicked out logged-out visitors browsing a lesson.
- `oraita-web/src/pages/SingleLesson.tsx` — new `ParticipantRow` component per participant: shows a "🤝 בקש ליצור קשר" button (with inline optional note) when both sides are opted in and no active request exists; shows accept/decline inline if *they* sent *you* a request; shows "ממתין/ה לתשובה" if you're waiting; shows the phone number only once accepted.
- `oraita-web/src/pages/Dashboard.tsx` — new `MatchPreferenceCard` (the opt-in toggle, placed here since there's no dedicated profile/settings page) and a new "בקשות היכרות" tab showing incoming (respond), outgoing (pending), and accepted (contacts, with phone) requests
- `oraita-web/src/context/AuthContext.tsx` — `AuthUser` gets `openToMatch?: boolean`

#### Verified
`tsc --noEmit` (backend) and `tsc -b` (frontend) both clean. Ran a full scripted end-to-end test against the live dev server with 3 temporary QA accounts (teacher + two participants, all deleted after): lesson participants no longer expose phone in the public lesson fetch ✅; request blocked before opting in ✅; request succeeds once both opted in and sharing a lesson ✅; duplicate pending request rejected ✅; phone hidden while pending ✅; only the recipient can accept/decline (sender attempting to respond → 403) ✅; phone revealed to both sides only after acceptance ✅; request rejected when the two users don't actually share that lesson ✅ (16/16 checks passed).

#### Refinements after Shani tried it live
Shani tested with her own real accounts (אורי יעקב → שני חסיד) rather than QA throwaways. The request itself worked correctly (confirmed by reading the DB directly — status `pending`, note text intact), but she didn't see it: the feature was always a pull model (check the Dashboard tab), never a chat or SMS, and that wasn't discoverable enough. Discussed the options (real chat, SMS, or a lightweight badge) and deliberately chose the smallest one to avoid the feature growing its own messaging infrastructure.
- `oraita-web/src/pages/Dashboard.tsx` — `MatchPreferenceCard` copy updated to the exact wording Shani wanted: *"כשאתה לחוץ על מופעל, משתתפים אחרים ששותפים איתך לשיעורים (שגם פתוחים להיכרויות) יוכלו לבקש ליצור איתך קשר ותוכלו להכיר."*
- `oraita-web/src/pages/SingleLesson.tsx` — the note field on the "בקש ליצור קשר" compose box was a single-line `<input>` that was too small to see what was typed; changed to a 3-row `<textarea>` with a live `x/200` character counter
- `oraita-web/src/components/Navbar.tsx` — new: the "לוח בקרה" nav link now shows a small red badge with the count of pending *incoming* match requests (via `useMatchRequests()`), visible on every page while logged in. Still no push notifications/chat/SMS — this is just a visible cue to go check the Dashboard, which is the actual gap that caused the confusion (not a bug in the request flow itself)
- Shani's real pending request (אורי יעקב → שני חסיד, lesson "על תפילה – איך להתחבר באמת") was left as-is in the DB since it's her own real test data, not throwaway QA data

#### Rate limiter tripped again — real regression this time, fixed
Shani got locked out with `"Too many requests, please try again after 15 minutes."` a second time, from normal browsing (not curl testing). Root cause: the Navbar badge (added earlier this session) called `useMatchRequests()` directly inside `Navbar`, and `Navbar` lives inside `Layout`, which every page mounts fresh — React Router unmounts/remounts the whole tree on each navigation, so the badge was re-fetching `/matchrequests/me` on *every single page click*, on top of React StrictMode's dev-mode double-invoke doubling that again. This was a genuine new source of request volume that didn't exist before the badge.
- `oraita-web/src/context/AuthContext.tsx` — moved the pending-incoming-count logic here instead: new `pendingMatchCount` state + `refreshMatchCount()`, fetched once per session (effect keyed on `user?._id`, not on every render/mount) since `AuthProvider` wraps the app once, outside the route tree
- `oraita-web/src/components/Navbar.tsx` — reads `pendingMatchCount` from `useAuth()` instead of calling `useMatchRequests()` itself; zero extra network cost per navigation again, same as before the badge existed
- `oraita-web/src/hooks/useMatchRequests.ts` — `respond()` now also calls `refreshMatchCount()` from context after a successful accept/decline, so the badge updates immediately without a full reload
- `server/middleware/rateLimiter.ts` — `apiLimiter.max` raised from 100 → 300 per 15min. Rate limiting itself stays in place (still required by the rubric); 100 was simply too tight for a real user clicking through several pages, each of which independently fires a few authenticated fetches on mount
- Restarted the local dev server to reset the in-memory limiter counter and unblock the account immediately

#### About page (`/about`) — new public page
- `oraita-web/src/pages/AboutPage.tsx` (new) — fully public, no `PrivateRoute` wrapper, same tier as the homepage. Renders Shani's personal introduction to the site, word-for-word as she provided it, including the explanation of the match-request feature.
- `oraita-web/src/App.tsx` — new `/about` route, public
- `oraita-web/src/components/Navbar.tsx` and `Footer.tsx` — "אודות" link added alongside the other public nav links so the page is actually reachable

### Session 13 (2026-07-27) — Homepage Hero Redesign + About Page Visual Polish

Pure frontend/visual-design session, no backend changes. All changes verified with `tsc -b` (clean throughout) and by confirming both dev servers kept responding 200 after each edit — actual visual review is still pending since the Claude-in-Chrome browser extension has not been connected this session; Shani reviewed everything herself in the browser and gave feedback that drove several of the iterations below.

#### Dashboard copy — final wording
- `oraita-web/src/pages/Dashboard.tsx` — `MatchPreferenceCard` description corrected twice more (typo, then a wording change) to its final text: *"כשאתה לוחץ על פעיל, משתתפים אחרים ששותפים איתך לשיעורים (שגם פתוחים להיכרויות) יוכלו לבקש ליצור איתך קשר ותוכלו להכיר."*

#### Homepage hero redesign
Shani asked for the "אורייתא" wordmark to be much larger (it was a small pill badge) and for scrolling background images, "beautiful and high standard" — ideally from real lesson photos rather than generic stock, so the homepage feels like an active platform. Confirmed with her that real photos (13 already exist in Cloudinary) blended with a few stock images as filler was the right call before building it.
- `oraita-web/src/index.css` — new `.hero-section`/`.hero-marquee`/`.hero-marquee-track`/`.hero-overlay`/`.hero-content`/`.hero-wordmark` classes: a continuously scrolling (70s linear loop, `@keyframes hero-scroll`) horizontal photo strip behind the hero content, dark-to-gold gradient overlay for text contrast, `prefers-reduced-motion` support (disables the animation)
- `oraita-web/src/pages/HomePage.tsx` — `STOCK_HERO_IMAGES` (5 verified-working Unsplash URLs) mixed with real `lesson.image` values pulled from the already-fetched Redux lessons list, deduplicated, padded to at least 8 images, then duplicated once (`[...trimmed, ...trimmed]`) so the CSS marquee loops seamlessly with no visible seam. "אורייתא ✡" is now a large `h1.hero-wordmark` (`clamp(3.5rem, 9vw, 6.5rem)`) instead of the old small badge; hero text switched to white/light colors and `btn-outline-light`/`btn-gold` buttons since it now sits on a photo background
- **Bonus bug found and fixed while picking stock image URLs**: the app's existing fallback lesson image (shown whenever a lesson has no uploaded photo) was pointing at a dead Unsplash ID — verified via `curl -I`, it 404s. Was used in `LessonCard.tsx` and `SingleLesson.tsx`. Swapped both to a verified-working URL (same domain/pattern, just a different photo ID).

#### About page — banner, image, and copy polish
- The "❤️ הרבה מעבר לשיעור תורה..." line was pulled out of the features bullet list into its own larger (`1.35rem`), bold lead-in line directly above "אחד הרעיונות שהיו חשובים לי..." so the two read as one connected thought
- Removed a comma per Shani's request: "שמי שני, בת 24 והאהבה שלי..." (was "בת 24, והאהבה")
- Added a static full-width photo banner (`.page-banner`/`.page-banner-content`, reusing the hero's overlay gradient) at the top of the page with the "שלום וברוכים הבאים לאורייתא!" greeting on it in large white text; the letter's text card overlaps the banner slightly (`marginTop: -48px`), mirroring the existing avatar-overlap pattern already used on Teacher Profile
- Banner image swapped from a generic stock photo to one of Shani's own curated photos: copied `photo-1509021436665-8f07dbf5bf1d.jpg` from her local `תמונות לאתר` folder into `oraita-web/src/assets/about-banner.jpg` and imported it properly through Vite (not an absolute local path, which wouldn't resolve in a browser). Noted but not yet acted on: the source file is ~2.3MB, worth compressing before deployment.
- Added, then removed per feedback, a decorative frame around the banner title text (`.page-banner-frame` — added and later deleted entirely, both the CSS and the JSX wrapper, once Shani said she didn't want it there)
- Correctly understood the actual ask — a frame around the **body text card**, not the banner title — and added `.about-card-frame` (thin gold border + a lighter gold outline set outside it, double-frame look) to the card holding the full letter

#### Navigation order
- `oraita-web/src/components/Navbar.tsx` and `Footer.tsx` — public nav links reordered per Shani's explicit choice to: דף הבית → אודות → כל השיעורים (was Home → All Lessons → About)

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

### Session 11 (2026-07-27) — Full Rubric Audit + README Rewrite

Shani asked for a full pass against the instructor's official grading guide (`Adv. FullStack - Final Project Guide.pdf`, found alongside the other course PDFs) before continuing to add real content to the live site — not lecturer feedback this time, a self-directed readiness check.

#### Audit findings
- Cross-checked the actual grading rubric (Backend 25 / DB 15 / Auth 20 / Frontend 20 / UI-UX 10 / Deployment 5 / Git+README 5) against real code and docs, not just PROGRESS.md's own claims.
- Confirmed live in code: `authLimiter` is genuinely wired to `/register` and `/login` (`server/routes/users_routes.ts`), no `.env` ever committed (`git ls-files` clean), `.env.example` present for both root and frontend, 23 commits with descriptive messages (no single bulk commit).
- Found `README.md` was significantly stale relative to the actual app: still documented the pre-Cloudinary local-disk Multer upload flow, was missing the Google auth / phone / rating / edit-lesson / leave-lesson / file-upload endpoints, was missing `CLOUDINARY_*` and `GOOGLE_CLIENT_ID` env vars, had no Screenshots section (required by the rubric), and "Live Demo" URLs were still placeholders.
- Confirmed the two real rubric-scored gaps are: (1) deployment — the rubric explicitly requires submission as a live, functional URL, not local-only — and (2) the README currency gap above. Mobile responsiveness also remains unverified (never checked in a real browser).
- Also noticed `server/middleware/upload.ts` (old pre-Cloudinary disk-storage Multer config) is dead code, unused by any route — logged as a cleanup item, not yet deleted.

#### README rewrite
- Rewrote `README.md` end-to-end to match current reality: tech stack now lists Cloudinary (not Multer disk storage) and Google Sign-In; full API endpoint table now includes all 15 routes actually implemented; env var tables include `CLOUDINARY_*` and `GOOGLE_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID`; data models include the `ratings` array; project structure includes `hooks/`, `utils/`, and all current pages/components.
- Added a "Screenshots" section (currently a placeholder — real screenshots still need to be captured) and a "Team" section (solo project, matches rubric's "Team Members & Roles" requirement).
- Left "Live Demo" URLs as `_coming soon_` since deployment hasn't happened yet — will need a follow-up edit once Atlas/Render/Vercel are live.

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

#### Rate limiter — explained, not a bug (revisited and fixed in Session 12)
- User hit `"Too many requests, please try again after 15 minutes."` on the All Lessons page — traced to `apiLimiter` in `server/middleware/rateLimiter.ts` (100 requests/15min per IP, applied to all of `/api/*` in `app.ts:46`), tripped by the volume of curl requests used to verify the fixes above against the local dev server. Not a code issue; resets automatically after the time window. Offered to raise the local limit or exempt development mode if it becomes disruptive during testing — no decision made yet.
- **It happened again from real (non-curl) usage in Session 12** — see that section for the actual fix: `apiLimiter.max` raised to 300, and a genuine bug fixed where `Navbar`'s match-request badge was re-fetching on every single page navigation.

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