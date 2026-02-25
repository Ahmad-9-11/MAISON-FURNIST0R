# Furnistør – Luxury Furniture E-Commerce

Full-stack React (Vite) + Node.js (Express) + MongoDB application, converted from the static HTML/CSS homepage. The look and feel (colors, typography, layout) match the original design.

## Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express, Mongoose, JWT auth, (Stripe/COD planned)
- **Database:** MongoDB

## Project structure

```
Furnistor/
├── frontend/          # Vite + React app
├── backend/           # Express API
├── index.html         # Original static homepage (reference)
├── Styles/style.css  # Original styles (reference)
└── Public/            # Original assets (e.g. backgroundVideo.mp4)
```

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, etc.
npm install
npm run dev
```

Seed products (optional):

```bash
npm run seed
```

Make a user an admin (run after they have registered):

```bash
npm run promote-admin your@email.com
```

API: `http://localhost:5000`  
Health: `GET /api/health`  
Products: `GET /api/products`

### 2. Frontend

```bash
cd frontend
npm install
# Optional: echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

App: `http://localhost:5173`  
Vite proxy forwards `/api` to the backend when `VITE_API_URL` is not set (proxy target localhost:5000).

### 3. Hero video

To keep the hero video, copy your file into the frontend public folder:

```bash
cp "Public/backgroundVideo.mp4" frontend/public/
```

## Theme (from original CSS)

- **Background:** `#e9e6e3`
- **Primary / accent:** `#b87f53`, hover `#cf5600`, tag orange `#fc6b00`
- **Fonts:** Inter Tight (body), Fraunces (headings)
- **Layout:** max-width 1600px, padding 64px

## Implemented so far

- **Backend:** Express server, MongoDB connection, Product / User / Order models, Auth (register, login, JWT, protect), Products API (list, pagination, category/price filters, single product, related), Orders & User profile & Favorites, Admin (analytics, product CRUD, order status)
- **Frontend:** UpperNav, Navbar (desktop + mobile), Hero, Shop by room, Product grid with ProductCard, Cart (Context + drawer, localStorage), Footer, Auth context, React Router, Tailwind + legacy CSS, Framer Motion on Hero and Cart

## Next steps (from your plan)

1. **Auth UI:** Login/Register pages, email verification (Nodemailer), role-based redirects
2. **Product detail:** Image zoom, swatches, related products, review system (stars + verified purchase)
3. **Cart & checkout:** Cart page, Stripe integration, COD flow
4. **User profile:** Order history, wishlist page, profile edit
5. **Admin dashboard:** Analytics charts, Product CRUD with Cloudinary, Order management UI
6. **Extras:** Fixed bottom music player, Framer Motion page transitions

## Environment (backend .env)

- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for JWT signing
- `FRONTEND_URL` – CORS origin (e.g. http://localhost:5173)
- Later: `CLOUDINARY_*`, `STRIPE_*`, `EMAIL_*` for Cloudinary, Stripe, and Nodemailer
