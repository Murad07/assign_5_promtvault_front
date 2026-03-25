# 🚀 PromptVault - Frontend Server

The completely responsive, lightning-fast Next.js frontend application powering the PromptVault marketplace. Buyers can seamlessly browse generated AI architectures while Sellers explicitly control their portfolio pipelines natively connected to Stripe processing!

## ⚡ Tech Stack

- **Framework:** Next.js 14 / React
- **Styling:** Tailwind CSS + Shadcn UI
- **State & Data Mutations:** `@tanstack/react-query`
- **Charts & Statistics:** Recharts (Pie Chart Data Visualization)
- **Payment Processing:** `@stripe/react-stripe-js`

## ⚙️ Core Modules (Role Based Dashboards)

1. **Admin Hierarchy Dashboard**: Total control over the marketplace ecosystem. Map out live Sales metrics across dynamic Recharts modules, permanently block rogue prompts, or instantly suspend/modify Users!
2. **Seller Marketplace Dashboard**: Seamless CRUD pipelines allowing designers to instantly publish Midjourney or ChatGPT generated frameworks mapping natively into real Stripe checkpoints.
3. **Buyer Acquisition Dashboard**: Specialized history states unlocking secret prompt arrays exclusively granted natively after Stripe verification checkouts. 

## 🛠️ Local Environment & Setup

Clone the repository and install all native Node wrappers:

```bash
npm install
npm run dev
```

You must explicitly define the following parameters intrinsically mapped in `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (Stripe Public Test Key)
```

## 🌐 Deployed Application
- Live Vercel App: Available securely via GitHub deployment links!

## 🛡️ Super Admin Default Credentials
When evaluating the internal UI platform structure, use the following credentials:
- **Email:** `admin@promptvault.com`
- **Password:** `admin123`
