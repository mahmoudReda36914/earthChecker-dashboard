# Auth System — Technical Reference

> **Stack**: Node.js + Express • MongoDB / Mongoose • JWT (jsonwebtoken) • bcryptjs • Nodemailer (Gmail)  
> **Frontend**: React + Axios + React Query

---

## Architecture Overview

```
Browser
  │
  ├─ localStorage        ← accessToken  (15 min, read by Axios interceptor)
  └─ httpOnly cookie     ← refreshToken (7 days, sent automatically by browser)

Vite dev proxy
  /api  →  http://localhost:5000

Backend
  /api/auth/*  →  authController.js
  Models: User, RefreshToken, PasswordResetToken
```

---

## 1. Registration — `POST /api/auth/register`

**Body:** `{ name, email, password, company: { name, ... } }`

```
Client ──► POST /api/auth/register
              │
              ├─ 1. Check if email already exists → 409 if yes
              ├─ 2. Company.create({ ...company })
              ├─ 3. User.create({ name, email, password, role:'ceo', company })
              │       └─ pre-save hook: bcrypt.hash(password, salt=12)
              ├─ 4. company.ceo = user._id → company.save()
              ├─ 5. issueVerificationEmail(user)
              │       └─ JWT signed with ACCESS_SECRET, expiresIn:'24h'
              │          payload: { id: user._id, purpose:'email_verify' }
              │          URL: CLIENT_ORIGIN/verify-email/<jwt>
              └─ 201 { message: 'Check your email...' }
```

No tokens are issued at registration. The user cannot log in until email is verified.

---

## 2. Email Verification — `GET /api/auth/verify-email/:token`

The `:token` is a **signed JWT** (not a random hash stored in DB).

```
Gmail → User clicks link → Browser opens
  http://localhost:5180/verify-email/<jwt>
        │
        └─ VerifyEmailPage (React)
              ├─ useEffect → GET /api/auth/verify-email/<jwt>  (via Axios + Vite proxy)
              │
              Backend:
              ├─ verifyVerificationToken(jwt)
              │    └─ jwt.verify(token, ACCESS_SECRET)
              │       ✗ expired / invalid → 400
              │       ✓ → decoded = { id, purpose:'email_verify' }
              ├─ User.findById(decoded.id)
              ├─ if user.isEmailVerified → 200 'already verified'
              ├─ user.isEmailVerified = true → user.save()
              └─ 200 'Email verified successfully'
```

> **Why JWT instead of random bytes + SHA-256?**  
> The old approach hashed the raw token and stored it in MongoDB. If anything changed the raw token bytes in transit (URL encoding, Gmail link rewriting), the hash comparison would fail. A JWT is **self-contained and self-verifiable** — the signature check is independent of any DB state.

### Frontend States (`VerifyEmailPage`)

| State              | Trigger          | UI                               |
| ------------------ | ---------------- | -------------------------------- |
| `loading`          | mount / fetching | Spinner                          |
| `success`          | 200 response     | "Email Verified" → Sign In       |
| `already_verified` | 200 + "already"  | "Already Verified" → Sign In     |
| `expired`          | 400 response     | "Link Expired" → Back to Sign Up |
| `error`            | 5xx / network    | "Verification Failed"            |

---

## 3. Login — `POST /api/auth/login`

**Body:** `{ email, password }`

```
Client ──► POST /api/auth/login
              │
              ├─ User.findOne({ email }).select('+password').populate('company')
              ├─ if !user → 401 'Invalid credentials'  (same msg — no enumeration)
              ├─ if !user.isActive → 403 'Account deactivated'
              ├─ bcrypt.compare(password, user.password) → 401 if false
              ├─ if !user.isEmailVerified → 403 { code:'EMAIL_NOT_VERIFIED' }
              ├─ user.lastLoginAt = Date.now() → save
              │
              ├─ accessToken  = jwt.sign({ id, role }, ACCESS_SECRET,  { expiresIn:'15m' })
              ├─ refreshToken = jwt.sign({ id },       REFRESH_SECRET, { expiresIn:'7d'  })
              │
              ├─ RefreshToken.create({ token: refreshToken, user, expiresAt, ip, userAgent })
              ├─ res.cookie('refreshToken', refreshToken, { httpOnly, sameSite:'strict', path:'/api/auth' })
              └─ 200 { accessToken, user: user.toPublic() }

Frontend (useLogin hook):
  onSuccess → localStorage.setItem('accessToken', data.accessToken)
            → queryClient.invalidateQueries(['me'])
            → navigate('/dashboard/overview')
```

### Token Design

| Token          | Storage                               | TTL    | Use                                                         |
| -------------- | ------------------------------------- | ------ | ----------------------------------------------------------- |
| `accessToken`  | `localStorage`                        | 15 min | `Authorization: Bearer <token>` header on every API request |
| `refreshToken` | `httpOnly cookie` (path: `/api/auth`) | 7 days | Sent automatically by browser to rotate access token        |

---

## 4. Protected Routes & Token Rotation

### Backend — `protect` middleware

```js
Authorization: Bearer <accessToken>
  → jwt.verify(token, ACCESS_SECRET)
  → User.findById(id)            // attach to req.user
  → next()  OR  401 Unauthorized
```

### Frontend — Axios Response Interceptor

```
Any API call → 401 received
  │
  ├─ isRefreshing? → queue this request
  │
  └─ POST /api/auth/refresh-token  (httpOnly cookie sent automatically)
        ├─ Backend: find RefreshToken doc, verify JWT, detect reuse
        │
        │  ┌─ Reuse detected (token already rotated):
        │  │   RefreshToken.deleteMany({ user })  ← revoke ALL sessions
        │  │   res.clearCookie('refreshToken')
        │  │   401 → Axios → window.location = '/login'
        │  │
        │  └─ Valid:
        │      new accessToken + new refreshToken issued
        │      old RefreshToken doc deleted (rotation)
        │      new RefreshToken doc created
        │      new httpOnly cookie set
        │      200 { accessToken }
        │
        ├─ localStorage.setItem('accessToken', newToken)
        ├─ Retry all queued requests with new token
        └─ Retry original failed request
```

---

## 5. `GET /api/auth/me`

Used by `ProtectedRoute` and `useMe` hook to check session on every app load.

```
GET /api/auth/me
  → protect middleware (verifies accessToken)
  → 200 { user: req.user.populate('company') }
  OR
  → 401 → Axios interceptor → refresh-token → retry
  OR
  → refresh also fails → /login
```

`ProtectedRoute` renders a spinner while `useMe` is loading, redirects to `/login` if unauthenticated, or renders `<Outlet />` if authenticated.

---

## 6. Token Refresh — `POST /api/auth/refresh-token`

```
httpOnly cookie: refreshToken=<jwt>
  │
  ├─ jwt.verify(token, REFRESH_SECRET)  →  { id }
  ├─ RefreshToken.findOne({ token })
  │
  ├─ Not found (already rotated = possible reuse attack):
  │   └─ RefreshToken.deleteMany({ user: id })   ← nuke all sessions
  │      res.clearCookie → 401
  │
  └─ Found → rotate:
      newAccessToken  = jwt.sign({ id, role }, ACCESS_SECRET,  '15m')
      newRefreshToken = jwt.sign({ id },       REFRESH_SECRET, '7d')
      delete old RefreshToken doc
      create new RefreshToken doc
      set new httpOnly cookie
      200 { accessToken: newAccessToken }
```

---

## 7. Logout

### `POST /api/auth/logout` — current device

```
cookie → find + delete RefreshToken doc
res.clearCookie('refreshToken')
Frontend: localStorage.removeItem('accessToken')
          queryClient.clear()
          navigate('/login')
```

### `POST /api/auth/logout-all` — all devices _(requires valid accessToken)_

```
RefreshToken.deleteMany({ user: req.user._id })
res.clearCookie('refreshToken')
200 'Logged out from all devices'
```

---

## 8. Forgot Password — `POST /api/auth/forgot-password`

**Body:** `{ email }`  
Always returns `200` regardless of whether the email exists (anti-enumeration).

```
User.findOne({ email })
  │
  ├─ Not found / already has pending token → silently 200
  │
  └─ Found:
      PasswordResetToken.deleteMany({ user })   ← clear old tokens
      rawToken = crypto.randomBytes(32).toString('hex')
      hashedToken = SHA-256(rawToken)
      PasswordResetToken.create({ token: hashedToken, user, expiresAt: +15min })
      sendPasswordResetEmail({ resetUrl: CLIENT_ORIGIN/reset-password/<rawToken> })
      200 (anti-enumeration message)
```

---

## 9. Reset Password — `POST /api/auth/reset-password/:token`

**Body:** `{ password }`

```
:token = rawToken from email URL
  │
  ├─ SHA-256(:token) → hashedToken
  ├─ PasswordResetToken.findOne({ token: hashedToken })
  ├─ Manual expiry check: record.expiresAt < Date.now() → 400
  ├─ User.findById(record.user)
  ├─ user.password = password (pre-save bcrypt hook re-hashes)
  ├─ user.save()
  ├─ PasswordResetToken.deleteOne (single-use)
  ├─ RefreshToken.deleteMany({ user })  ← revoke all sessions for security
  ├─ res.clearCookie('refreshToken')
  └─ 200 'Password reset successfully'
```

---

## 10. Data Models

### `User`

| Field             | Type               | Notes                                  |
| ----------------- | ------------------ | -------------------------------------- |
| `name`            | String             | max 80 chars                           |
| `email`           | String             | unique, lowercase                      |
| `password`        | String             | bcrypt, `select:false`                 |
| `role`            | Enum               | `ceo \| admin \| supervisor \| worker` |
| `company`         | ObjectId → Company |                                        |
| `isEmailVerified` | Boolean            | default `false`                        |
| `isActive`        | Boolean            | default `true`                         |
| `lastLoginAt`     | Date               |                                        |

### `RefreshToken`

| Field             | Notes                  |
| ----------------- | ---------------------- |
| `token`           | raw JWT string         |
| `user`            | ObjectId               |
| `expiresAt`       | TTL index auto-deletes |
| `ip`, `userAgent` | session fingerprint    |

### `PasswordResetToken`

| Field       | Notes                    |
| ----------- | ------------------------ |
| `token`     | SHA-256 hash of rawToken |
| `user`      | ObjectId                 |
| `expiresAt` | 15 min, TTL index        |

---

## 11. Security Summary

| Concern               | Mitigation                                                        |
| --------------------- | ----------------------------------------------------------------- |
| Password storage      | bcrypt, saltRounds=12                                             |
| Access token exposure | Short TTL (15m), stored in `localStorage`                         |
| Refresh token theft   | `httpOnly` + `sameSite:strict` cookie, path-locked to `/api/auth` |
| Token reuse attack    | Rotation: any reuse → all sessions revoked                        |
| Email enumeration     | Login, forgot-password return identical messages                  |
| Brute force           | `express-rate-limit` on `/api/auth` (when enabled)                |
| Password reset token  | SHA-256 stored in DB, raw token only in email                     |
| Email verification    | JWT signed with server secret — tamper-proof, no DB lookup        |
| CORS                  | Strict origin allow-list (`CLIENT_ORIGIN`) + `credentials:true`   |
