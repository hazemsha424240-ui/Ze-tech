# Ze tech — Lead Management System

Full-stack project: a public company website with a lead form, a REST API, and a protected admin dashboard for managing leads.

- **Frontend:** React 18 + Vite + React Router (JSX components, CSS in separate `.css` files, no inline styles)
- **Backend:** Node.js + Express REST API, SQLite (Node built-in `node:sqlite`, no native build tools needed), JWT login, bcrypt password hashing

## Project structure

```
ze-tech-lead-management/
├── README.md
├── frontend/                      React app (Vite)
│   ├── index.html                 Root page (only links the fonts and src/main.jsx)
│   ├── package.json · vite.config.js
│   └── src/
│       ├── main.jsx · App.jsx     Entry point + routes
│       ├── pages/                 Home.jsx · Login.jsx · Dashboard.jsx
│       ├── components/            Header · LeadForm · StatsCards · LeadsTable · LeadModal · ProtectedRoute
│       ├── services/api.js        All API calls + token storage
│       ├── utils/                 constants.js · csv.js
│       └── styles/                style.css (site) · dashboard.css (admin)
└── backend/                       Node.js + Express API
    ├── server.js · package.json · .env.example
    ├── config/                    env.js · db.js · constants.js
    ├── routes/                    URL -> controller mapping only
    ├── controllers/               Request handling / business logic
    ├── models/                    Database queries only
    ├── middleware/                auth · validateLead · rateLimit · errorHandler
    ├── utils/                     httpError.js
    └── database/                  schema.sql · migrations/ · migrate.js · seed.js
```

## Requirements

Node.js 22.13 or newer (tested on Node 24) (https://nodejs.org)

## Install and run (development)

Open two terminals.

**Terminal 1 — backend (API on port 5000)**
```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run setup               # creates the database, admin account and sample leads
npm start
```

**Terminal 2 — frontend (React on port 5173)**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Vite forwards `/api` requests to the backend automatically.

Default admin: `admin@techcraft.com` / `admin123` (set in `backend/.env`)

## Production build (single server)

```bash
cd frontend && npm run build        # creates frontend/dist
cd ../backend && npm start          # now serves the React app AND the API on http://localhost:5000
```

## API endpoints

Base URL: `http://localhost:5000/api`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/leads` | Public | Create a lead (name, email, phone, service, message required; company, budget optional) |
| GET | `/leads` | Admin | List leads. Query: `search`, `status`, `service`, `page`, `limit` |
| GET | `/leads/:id` | Admin | Get one lead |
| PUT | `/leads/:id` | Admin | Update lead fields and/or `status` |
| DELETE | `/leads/:id` | Admin | Delete a lead |
| POST | `/login` | Public | Body: `{ email, password }` -> `{ token, user }` |
| POST | `/logout` | Admin | Invalidates the current token |
| GET | `/dashboard/stats` | Admin | Counts: total, New, Contacted, Interested, In Progress, Won, Lost |

Errors return JSON: `{ "error": "message", "fields": { "email": "..." } }` with status 400, 401, 404, 422 or 500.

**Lead fields:** `id, name, email, phone, company, service, budget, message, status, created_at, updated_at`
**Status flow:** New → Contacted → Interested → In Progress → Won / Lost
**Services:** Web Development, Mobile App, E-Commerce, UI/UX, Digital Marketing, Other
**Budgets:** Less than 10k, 10-25k, 25-50k, 50k+, Not Sure

## Security notes

- Passwords are hashed with bcrypt; login is rate-limited (10 attempts / 15 min).
- All SQL uses prepared statements; input is validated in React and again in the backend.
- Error responses never expose stack traces; helmet adds security headers.
- Set a long random `JWT_SECRET` in `backend/.env` before deploying.
- Logged-out tokens are blocked in memory until they expire (cleared if the server restarts).
