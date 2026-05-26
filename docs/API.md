# API Structure

Base URL: `/api`

## Auth

- `POST /auth/login`
- `POST /auth/register-member`
- `GET /auth/me`

## Books

- `GET /books?search=&category=&available=`
- `POST /books` admin
- `PUT /books/:id` admin
- `DELETE /books/:id` admin
- `POST /books/:id/reserve` member/admin
- `GET /books/member/history` member/admin

## Events

- `GET /events?type=&upcoming=`
- `POST /events` admin
- `PUT /events/:id` admin
- `DELETE /events/:id` admin
- `POST /events/:id/register` member/admin

## Sports

- `GET /sports`
- `POST /sports` admin
- `PUT /sports/:id` admin
- `DELETE /sports/:id` admin

## Medical Equipment

- `GET /equipment?type=&available=`
- `POST /equipment` admin
- `PUT /equipment/:id` admin
- `DELETE /equipment/:id` admin
- `POST /equipment/:id/request` member/admin
- `GET /equipment/requests/mine` member/admin
- `GET /equipment/requests` admin
- `PATCH /equipment/requests/:requestId` admin

## Notifications

- `GET /notifications`
- `POST /notifications` admin
- `PATCH /notifications/:id/read`

## Admin

- `GET /admin/analytics` admin
- `GET /admin/members` admin

## Uploads

- `POST /uploads/image` admin
