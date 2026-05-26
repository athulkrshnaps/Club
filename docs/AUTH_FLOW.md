# Authentication Flow

## Member Login

1. Member enters phone number and password.
2. API validates the active member account.
3. API returns a JWT and user profile.
4. Client stores the token in local storage and attaches `Authorization: Bearer <token>` to future requests.

## Admin Login

1. Admin enters email or phone plus password.
2. API validates credentials.
3. Protected admin routes require `role=admin`.
4. Unauthorized member access returns `403 Forbidden`.

## JWT Claims

- `id`
- `role`

## Recommended Production Hardening

- Use HTTPS only.
- Store JWT in secure HTTP-only cookies if deploying under one domain.
- Add refresh tokens for longer sessions.
- Enforce rate limits on auth routes.
- Use strong password policies.
- Add audit logs for admin operations.
