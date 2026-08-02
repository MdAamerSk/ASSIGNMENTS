# ⚡ SkyMart — Modern E-Commerce Platform

SkyMart is a high-performance, responsive e-commerce web application featuring a stunning dark aesthetic, customized grid pattern backgrounds, dynamic live dashboard metrics, and persistent user sessions.

Built with **React**, **Vite**, **Tailwind CSS (v4)**, and **React Router**.

---

## 🚀 Live Demo & Deployment
- **Platform**: Hosted on **Vercel**  https://skymart-shopping.vercel.app
- **Refresh Support**: Enabled via custom `vercel.json` rewrite routing to prevent SPA client-side 404 errors.

---

## ✨ Features

### 1. 🔐 Persistent Authentication & Validation
- **Local Database**: Simulates database operations using `localStorage` (`skymart_users` database key).
- **Session Persistence**: Saves active login sessions (`skymart_current_user` key) so refreshing the tab won't sign you out.
- **Demo Account**: Autoseeds a default testing user on first load:
  - **Email**: `demo@skymart.com`
  - **Password**: `password`
- **Validation**: Enforces email duplication checks, matching passwords, and minimum character counts.
- **Polished UI Alerting**: Inline animated error alerts (red-tinted boxes) that clear dynamically when inputs change.

### 2. 📊 Dynamic Home Dashboard
- **Greeting Banner**: Welcomes users dynamically with their initials (avatar) and customized greeting names in the hero section.
- **Grid Mesh Design**: Styled using a custom css gradient grid backdrop.
- **Dynamic Metrics Grid**: 4 stats cards linked directly to cart states:
  - **Cart Items**: Displays total quantity of products in the cart.
  - **Cart Value**: Calculates total cart cost.
  - **Top Products**: Displays count of highly rated catalog items.
  - **Categories**: Displays category counts.
- **Categories Directory**: High-contrast white category blocks with translate animations.

### 3. 🛍️ Interactive Store Catalog (Shop Page)
- **API Fetching**: Fetches live merchandise from the `Fake Store API`.
- **Search & Filtering**: Search products by text query, filter by categories, or sort by pricing and ratings.
- **Interactive Add/Remove**: Add items directly to the cart. Toggles state indicators between "Add" and "Added".

### 4. 🛒 Slide-out Shopping Cart Drawer
- **Overlay**: Blurs and darkens background elements (`backdrop-blur-xs`).
- **Cart Management**: Modify quantities (`+`/`-`), calculate unit prices, delete items directly, or trigger a full cart clear.
- **Cart Sessioning**: Syncs items to `localStorage` and wipes items on user log out.

### 5. 🏷️ Navigation & Layout
- **Sticky Navbar**: Manages navigation routing and profiles.
- **Sticky Footer**: Responsive 4-column footer featuring brand summaries, quick category links, support contacts, custom SVG social buttons, and newsletter subscription forms.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Assignment10
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Building for Production
To generate a production bundle inside the `dist/` directory:
```bash
npm run build
```

---

## 📂 Project Structure

```
src/
├── assets/         # Project images and graphics
├── components/     # Reusable UI blocks
│   ├── Navbar.jsx      # Navigation header & profile sessions
│   ├── ProductCard.jsx # Grid card with catalog add triggers
│   ├── CartDrawer.jsx  # Slide-out shopping cart sidebar
│   └── Footer.jsx      # 4-column e-commerce footer
├── pages/          # Layout views
│   ├── Home.jsx        # Landing dashboard
│   ├── Shop.jsx        # Product listing page
│   ├── Login.jsx       # Auth Sign In panel
│   ├── Signup.jsx      # Auth Create Account panel
│   └── About.jsx       # Blank placeholder template
├── App.jsx         # App routing & localStorage states
└── main.jsx        # React root initializer
```
