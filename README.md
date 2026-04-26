# EstateHub — React Frontend (Buyer POV)

## Quick Setup

```bash
cd real-estate-frontend
npm install
npm start
```

App runs at: http://localhost:3000  
Make sure backend is running at: http://localhost:8080

---

## Pages Included (Buyer Flow)

| Page | Route | Description |
|------|-------|-------------|
| Landing Page | `/` | Hero search, city browse, CTA |
| Login | `/login` | JWT-based sign in |
| Register | `/register` | Create account with role selector |
| Properties | `/properties` | Listing with search + filters |
| Property Detail | `/properties/:id` | Full detail + inquiry form |
| My Inquiries | `/my-inquiries` | Track all sent inquiries (buyer only) |

---

## Folder Structure

```
src/
├── context/
│   └── AuthContext.jsx      ← JWT + user state management
├── services/
│   └── api.js               ← All Axios API calls
├── components/
│   ├── Navbar.jsx
│   ├── PropertyCard.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── PropertiesPage.jsx
│   ├── PropertyDetailPage.jsx
│   └── MyInquiriesPage.jsx
├── App.jsx                  ← Routes
├── index.js
└── index.css                ← All design tokens + global styles
```

---

## Next Steps

- **Seller Dashboard** — View inquiries, manage listings
- **Admin Panel** — Manage all users and properties
- **Add Property** — Form for sellers/agents

---

## Design

- **Fonts**: Cormorant Garamond (display) + DM Sans (body)
- **Colors**: Charcoal dark theme + Gold accents + Warm whites
- **Style**: Luxury real estate — refined, minimal, editorial
