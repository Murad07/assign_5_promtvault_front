# 🚀 PromptVault - Premium AI Prompt Marketplace

A state-of-the-art, high-performance marketplace for elite AI prompts, built with Next.js, TypeScript, and a Luxury UI/UX. PromptVault empowers creators and businesses to securely trade and manage advanced LLM prompts with complete confidence.

## 🌟 Advanced Professional Highlights

### 🧠 Dual AI Features
*   **Vaulty - AI Assistant**: An intelligent chatbot integrated across the site to guide users, answer FAQs, and provide instant support.
*   **Predictive Revenue AI**: Specialized for Sellers, this module analyzes market data to forecast quarterly sales and provide data-driven insights for prompt creation.

### 🔐 Real-World Authentication
*   **Google OAuth 2.0 Integrated**: Seamless "Login with Google" flow.
*   **Smart Selection**: New users can choose their mission—joining as a **Buyer** or a **Seller**—directly during the Google authentication process.
*   **RBAC Architecture**: Strong Role-Based Access Control protecting Admin, Seller, and Buyer routes.

### 📊 Admin Support Vault
*   **Full-Stack Messaging**: A custom-built, database-driven contact system.
*   **Real-time Badges**: Admin dashboard features a dynamic notification badge for unread support inquiries, ensuring 100% responsiveness.
*   **Professional Management**: Icons-based inbox management with one-click reply and read-tracking.

### 💳 Stripe & Luxury UX
*   **Payment Precision**: Full-flow Stripe integration for secure prompt acquisition.
*   **Design Excellence**: Deep dark mode support, glassmorphic card layouts, and premium Lucide-based iconography.
*   **Global Support Ecosystem**: Dedicated About, Help/FAQ, and Contact pages for a complete enterprise feel.

## ⚡ Tech Stack

- **Framework:** Next.js 14 (App Router) / React / TypeScript
- **Styling:** Tailwind CSS + Luxury Backdrop Filters
- **State Management:** `@tanstack/react-query`
- **Charts:** Recharts (Advanced Data Visualization & Prediction)
- **Payment Processing:** `@stripe/react-stripe-js`
- **Authentication:** `Auth.js` / Google OAuth 2.0 / JWT

## ⚙️ Role-Based Ecosystem

1.  **Admin Command Center**: Complete oversight of global users, prompts, and order streams. Manage payout transfers and respond to all platform support inquiries.
2.  **Seller Portfolio**: Intelligent dashboard with AI-powered sales forecasting, complete prompt CRUD management, and a dedicated revenue withdrawal pipeline (95% share).
3.  **Buyer Hub**: High-speed browsing, specialized "Vault" for secret prompt access after secure checkout, and intuitive order history.

## 🛠️ Local Environment & Setup

Clone the repository and install dependencies:

```bash
npm install
npm run dev
```

Required `.env` Parameters:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=... (Google OAuth Client ID)
```

## 🌐 Live URLs
- Live Frontend User Application: [https://assign-5-promtvault-front.vercel.app/](https://assign-5-promtvault-front.vercel.app/)

## 🛡️ Demo Access Credentials
For evaluation, you can use the following pre-configured demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@promptvault.com` | `admin123` |
| **Seller** | `roni@gmail.com` | `roni123` |
| **Buyer** | `araf@gmail.com` | `araf123` |

You can also use the **"Demo Login"** button on the sign-in page for instant access as a Seller.
