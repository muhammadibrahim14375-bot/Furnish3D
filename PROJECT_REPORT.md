# Furnish3D — Project Report

**Interactive 3D Furniture Store**

| Field | Details |
|--------|---------|
| **Student** | Muhammad Ibrahim |
| **Course** | LLM Driven Web Mastery |
| **Company** | Glaxit |
| **Project** | Furnish3D – Interactive 3D Furniture Store |
| **Submission date** | August 27, 2026 |

---

## 1. Quick links (for instructor)

| Resource | URL |
|----------|-----|
| **Live website** | https://frontend-ten-iota-75.vercel.app |
| **Live API** | https://furnish3d-api-production.up.railway.app |
| **API health check** | https://furnish3d-api-production.up.railway.app/api/health |
| **GitHub repository** | https://github.com/muhammadibrahim14375-bot/Furnish3D |

### Demo accounts (password for all: `password123`)

| Email | Role | What to try |
|--------|------|-------------|
| `customer@furnish3d.com` | Customer | Browse, 3D viewer, cart, orders, reviews |
| `mod@furnish3d.com` | Moderator | Approve reviews, edit products |
| `admin@furnish3d.com` | Admin | Full product/user/order management |

---

## 2. Project overview

Furnish3D is a full-stack furniture e-commerce web application. Unlike traditional stores that only show static photos, customers can **rotate and inspect furniture in interactive 3D** before purchasing.

The platform also includes secure authentication, role-based access (customer / moderator / admin), shopping cart, orders, product reviews, search/filtering, and a responsive dark/light theme UI.

---

## 3. Problem statement

Online furniture shopping usually depends on 2D images and text descriptions. Size, shape, and appearance from different angles are hard to judge that way. Furnish3D improves this by combining standard e-commerce features with an interactive 3D product viewer.

---

## 4. Objectives achieved

- [x] Modern furniture e-commerce platform  
- [x] Interactive, rotatable 3D product previews  
- [x] Secure authentication with JWT and bcrypt  
- [x] Role-based access control (customer, moderator, admin)  
- [x] Product browsing, search, cart, orders, and reviews  
- [x] Moderator and administrator management panels  
- [x] Responsive UI with dark/light themes  
- [x] Frontend and backend deployed online  

---

## 5. Technology stack

| Layer | Technologies |
|--------|----------------|
| **Frontend** | React, TypeScript, Vite, React Router, Three.js, React Three Fiber, Drei |
| **Backend** | Node.js, Express.js (MVC architecture) |
| **Auth** | JWT, bcrypt, RBAC middleware |
| **Database** | File-based store for live demo + PostgreSQL/Supabase schema (`backend/sql/schema.sql`) |
| **Deployment** | Frontend on **Vercel**, Backend on **Railway** |

---

## 6. Main features

### Customer
- Register / login  
- Browse and search products by category  
- Product detail page with **interactive 3D viewer** (drag to rotate, scroll to zoom)  
- Add to cart, checkout, view order history  
- Submit product reviews  
- Toggle dark / light theme (preference saved)

### Moderator
- Approve or reject pending reviews  
- Edit product listings  
- No user-management privileges  

### Admin
- Full product CRUD  
- User list, role assignment, user deletion  
- Order list and status updates  
- Complete administrative control  

---

## 7. 3D product visualization

The main differentiator is the 3D viewer on each product page, built with **Three.js**, **React Three Fiber**, and **Drei**.

- Users can orbit and zoom around the furniture model  
- Category-based procedural 3D models are used for reliable performance in the demo  
- Product records also support GLB/GLTF `modelUrl` for real mesh assets later  

---

## 8. System architecture

```
Browser (React + Three.js)
        │
        ▼
   Vercel (Frontend)
        │  REST / JSON
        ▼
   Railway (Express API – MVC)
        │
        ▼
   Data store (seeded demo DB)
   + SQL schema ready for Supabase/PostgreSQL
```

### Backend modules (MVC)
- **Auth** — register, login, `/me`  
- **Users** — admin user/role management  
- **Products & categories** — browse, CRUD  
- **Cart** — add / update / remove  
- **Orders** — checkout, history, status  
- **Reviews** — create, moderate, delete  

---

## 9. How to run locally

```bash
# Backend
cd backend
npm install
npm run seed
npm run dev
# → http://localhost:5001

# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 10. Deployment summary

| Part | Platform | Live URL |
|------|----------|----------|
| Frontend | Vercel | https://frontend-ten-iota-75.vercel.app |
| Backend | Railway | https://furnish3d-api-production.up.railway.app |
| Source code | GitHub | https://github.com/muhammadibrahim14375-bot/Furnish3D |

---

## 11. Suggested instructor walkthrough

1. Open the **live website** link.  
2. Browse **Shop** and open any product → try the **3D viewer**.  
3. Log in as `customer@furnish3d.com` / `password123` → add to cart → place an order.  
4. Log in as `mod@furnish3d.com` → open **Moderate** → review moderation / product edit.  
5. Log in as `admin@furnish3d.com` → open **Admin** → products, users, orders.  
6. Review source code on **GitHub**.  

---

## 12. Conclusion

Furnish3D delivers a complete full-stack e-commerce experience with a practical 3D viewing feature where it adds real value for furniture shoppers. It demonstrates skills in React, TypeScript, REST APIs, Express MVC, authentication, RBAC, and Three.js, and is deployed for live evaluation.

---

**Submitted by:** Muhammad Ibrahim  
**Course:** LLM Driven Web Mastery  
**Company:** Glaxit  
