# Project Architecture

## Overview

`NAVODHAYAM VAYANASHALA AMARAKUNI` is structured as a monorepo with a React client and an Express API server. The UI is mobile-first and uses reusable sections for the public community experience, while the backend exposes REST resources for authenticated member and admin workflows.

## Folder Structure

```text
.
├── client
│   ├── public
│   └── src
│       ├── components
│       ├── context
│       ├── data
│       ├── lib
│       └── pages
├── server
│   └── src
│       ├── config
│       ├── middleware
│       ├── models
│       ├── routes
│       ├── seed
│       └── utils
└── docs
```

## Frontend Design System

- Warm community colors with emerald, amber, blue, and rose accents.
- Glassmorphism panels for hero and dashboard summaries.
- Dense dashboard layouts for admin and member operations.
- Dark/light mode with persisted preference.
- Responsive navigation with mobile drawer.
- Motion through CSS transitions and lightweight entrance animations.

## Backend Layers

- `models`: Mongoose schemas and indexes.
- `routes`: REST API endpoints grouped by domain with focused route handlers.
- `middleware`: auth, role checks, validation, error handling, uploads.
- `config`: MongoDB connection.
- `seed`: development seed data.

## Core Domains

- Library management: books, reservations, borrow history.
- Sports and events: events, registrations, match schedules, gallery links, sports news.
- Charity and medical support: equipment inventory, emergency requests, availability tracking.
- Notifications: announcements and member-specific updates.
- Admin analytics: counts, pending requests, active reservations, upcoming events.
