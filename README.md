# Furnish3D

Interactive 3D furniture e-commerce app for **Muhammad Ibrahim** (Glaxit — LLM Driven Web Mastery).

Customers can browse furniture, rotate procedural 3D previews, manage a cart, place orders, and leave reviews. Moderators and admins manage listings, reviews, users, and order status.

## Stack

| Layer | Tech |
|--------|------|
| Frontend | React, TypeScript, Vite, React Router, Three.js, React Three Fiber, Drei |
| Backend | Node.js, Express (MVC), JWT, bcrypt |
| Data | JSON store for local demo + Supabase/PostgreSQL schema in `backend/sql/schema.sql` |
| Themes | Light / dark (persisted) |

## Live demo

- App: https://frontend-ten-iota-75.vercel.app  
- API: https://furnish3d-api-production.up.railway.app  
- GitHub: https://github.com/muhammadibrahim14375-bot/Furnish3D  

Demo logins use password `password123` (see accounts below).

## Quick start

```bash
# Terminal 1 — API
cd backend
npm install
npm run seed
npm run dev

# Terminal 2 — UI
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5001  

### Demo accounts

Password for all: `password123`

| Email | Role |
|--------|------|
| admin@furnish3d.com | admin |
| mod@furnish3d.com | moderator |
| customer@furnish3d.com | customer |

## Features

- Auth: register / login with JWT + bcrypt  
- RBAC: customer, moderator, admin  
- Products: browse, search, filter, detail pages  
- Interactive 3D viewer (category-based procedural models; swap in GLB/GLTF via `modelUrl`)  
- Cart, checkout, order history  
- Reviews with moderator approval  
- Admin: product CRUD, user roles, order status  
- Responsive UI + dark/light theme  

## Supabase (optional)

1. Create a Supabase project and run `backend/sql/schema.sql` in the SQL editor.  
2. Point the backend at Postgres when you are ready to replace the JSON store (see `.env.example`).  

## Deploy

- Frontend → Vercel  
- Backend → Render  

Set `CLIENT_URL`, `JWT_SECRET`, and `VITE_API_URL` for production.
