# The Nifemi Experience (TNE) 🎁✨
> **Premium Luxury Gifting, Custom Laser Engraving & Bespoke E-Commerce Platform**  
> 🌐 **Live Website**: [https://www.thenifemiexperience.com](https://www.thenifemiexperience.com)

---

## 🌟 Overview

**The Nifemi Experience (TNE)** is an ultra-luxurious, full-stack React e-commerce web application engineered for bespoke gift curation, custom laser-engraved jewelry & watches, luxury fashion collections, and seamless gifting experiences across Nigeria and worldwide.

Built with performance, mobile responsiveness, and high-end visual aesthetics in mind, TNE provides a state-of-the-art shopping journey — from interactive gift box customization to instant transfer receipt verification and automated Admin order dispatching.

---

## ✨ Key Features & Architecture

### 🎁 1. Bespoke Gift Atelier (`/atelier`)
* **Interactive 4-Step Gift Box Builder**:
  * **Step 1: Curation Tier**: Choose from *Starter Gift Box*, *Classic Luxury Box*, *Premium Grandeur Box*, or *Signature Executive Box*.
  * **Step 2: Curated Fillers**: Dynamic item picker with live item counters, included perks, and custom filler additions.
  * **Step 3: Card Theme & Message**: Personalize greeting card themes (*Floral Elegance*, *Gold Foil*, *Minimalist*) with custom personal notes.
  * **Step 4: Ribbon Finish**: Custom satin ribbon selection (*Champagne Gold*, *Emerald Green*, *Royal Navy*, *Ruby Red*).
* **Live Unboxing Preview**: Real-time visual box preview with dynamic total cost calculation.

### 🛍️ 2. Luxury Shop & Laser Engraving (`/shop`)
* **Product Catalog**: Custom laser-engraved watches, personalized nameplate necklaces, signature dual perfume sets, and luxury accessories.
* **Personalization Inputs**: Custom engraving text fields (e.g. initials, dates, or messages) directly attached to cart items.
* **Mobile Category Filter Bar**: Smooth touch-scrolling category pills (*Etched by TNE*, *TNE Gift Curation*, *TNE Collections*, *TNE Beauty*) with zero horizontal clipping.

### 💳 3. Direct Bank Transfer & Receipt Verification (`/checkout`)
* **Official Account Card**: Prominently features the official TNE OPay transfer details (**8133231667** — **Adepitan Oluwanifemi**) with 1-click account number copying.
* **Receipt Image Upload**: Required mobile banking transfer screenshot upload with live thumbnail preview.
* **Instant Admin WhatsApp Notification**: Automatically generates an instant order dispatch alert to Admin WhatsApp line (**+234 813 323 1667**) upon order placement.

### 🛡️ 4. Admin Management Console (`/admin`)
* **Staff Access Control**: Manage admin & staff accounts with instant **Revoke**, **Activate**, or **Delete** permissions.
* **Orders Monitor & Full Timestamping**: Live order book featuring exact Date & 12-hour Time stamps (e.g. `Aug 11, 2026 at 07:10 PM`).
* **Full-Screen Receipt Inspector**: Clickable modal inspector for admins to inspect uploaded transfer receipts.
* **1-Click WhatsApp Paid Receipt Dispatcher**: Instantly send verified paid receipt links to customers via WhatsApp.
* **Catalog & Atelier Manager**: Upload new products, set stock status, and adjust box tier pricing live.

### 🔍 5. Search Engine Optimization (SEO) & Indexing
* **Google Search Indexing**: Full JSON-LD Organization schema, canonical URLs, and Google Search Console verification.
* **Social Sharing**: Open Graph (`og:image`) and Twitter Card metadata for rich link previews on WhatsApp, Instagram, and Facebook.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 18, JavaScript (ES6+), HTML5 |
| **Build Tool & Bundler** | Vite 8 |
| **Styling & Design System** | Vanilla CSS (Tailored HSL Design Tokens, Micro-Animations, Glassmorphism) |
| **Iconography** | Lucide React |
| **Persistence & Database** | LocalStorage Engine & Firebase Firestore Sync Layer |
| **Deployment & Hosting** | Vercel (Continuous Deployment linked to GitHub) |

---

## 🚀 Quick Start & Local Development

### Prerequisites
* Node.js v18.0.0 or higher
* npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/tne-website.git
   cd tne-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔐 Credentials & Contact Information

* **Super Admin Login Route**: `/admin-login`
* **WhatsApp Inquiry Line**: `+234 813 323 1667`
* **Inquiry Call Line**: `+234 815 449 3101`
* **Official Email**: `hello@thenifemiexperience.com`

---

© 2026 **The Nifemi Experience**. All rights reserved. *Thoughtfully curated, beautifully yours.*
