# 🕯️ Noir & Brew — Luxury Café & Bar

A high-end, full-stack digital experience for **Noir & Brew**, a luxury dual-identity destination: an artisanal specialty coffee house by day, and an intimate, candlelit mixology lounge by night.

Designed with ** obsidian-gold rich aesthetics**, smooth micro-animations, fluid sliding cart drawers, and a powerful, dual-payment real-time administrative concierge.

---

## 🏗️ Project Architecture

```mermaid
graph TD
  Client[React + Vite Frontend] -->|REST APIs / Axios| Server[Node.js + Express Backend]
  Server -->|Primary DB| MongoDB[Mongoose MongoDB Atlas]
  Server -->|Automatic Offline Fallback| LocalDB[Resilient JSON Database File System]
  
  subgraph Local JSON Database
    orders[(orders.json)]
    reservations[(reservations.json)]
    contacts[(contacts.json)]
  end
```

---

## 💎 Premium Features

### 1. 🌓 Dual-Identity Fluid Menu
* High-fidelity, animated transition switcher to toggle between **Daytime Specialty Coffee & Savory Snacks** and **Nighttime Artisanal Cocktails & Decadent Desserts**.
* curate-designed card layout with beautiful hover scale visual effects and detailed descriptors.

### 2. 🪑 Seating Identity Checkout & Dual Payments
* **💵 Bill to Table (Default)**: Adds items to the guest's physical table seating tab, to be settled upon departure.
* **💳 Direct Pay**: Slides open a premium **glassmorphic credit card simulation panel** featuring:
  * Automatic input formatting (automatic 4-digit spaces as you type your card).
  * Expiry date mask and secure CVC code hiding.

### 3. 🧾 Interactive Dispatch Receipt
* Post-checkout sliding drawer showing a high-contrast guest receipt.
* Features **Order Reference ID**, **Customer Name**, **Table Seating Location**, **Artisanal Itemized Selections**, **Real-Time Prep Status**, and **Payment Method indicator**.

### 4. 🎛️ Concierge Admin Dashboard
* Secure admin passcode prompt (`passcode: noir`).
* **Developer Bypass Mode**: Allows direct access from the receipt checkout screen straight into the prep logs page (`/admin?bypass=noir`).
* **Real-time Order Preparation Tracking**: color-coded badges to progress orders from `Pending` ➔ `Preparing` ➔ `Served` ➔ `Completed`.
* **Billing Indicators**: Distinct glowing badges (`💳 Paid (Direct)` in emerald green or `💵 Bill to Table` in gold amber) so concierge staff know exactly which tables have settled!
* **Reservations Log & Contact Inquiries Manager**: Live lists with quick actions to confirm, delete, or flag reservation entries.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, TailwindCSS (for structure), Vanilla HSL Hues & custom CSS (for maximum flex and elite premium glossmorphism), Framer Motion (for layout-animations).
* **Backend**: Node.js, Express, Mongoose, CORS, Dotenv, FileSystem (fs).
* **Databases**: MongoDB Atlas (Primary) & local robust JSON files (Resilient Offline Fallback).

---

## 🎛️ Concierge Admin Dashboard Guide

The **Concierge Admin Dashboard** acts as the central operation hub for café and lounge staff to track incoming orders, monitor seating tables, and manage reservations.

### 🔑 Authentication & Quick Access
* **Direct URL**: Navigate to `/admin` (e.g. `http://localhost:5173/admin` or `https://cafe-brew-two.vercel.app/admin`).
* **Visual Passcode Protection**: Locked behind an elegant, dark obsidian numeric/text passcode gateway.
  * **Standard Passcode**: `noir` (case-sensitive).
* **⚡ Developer / Testing Auto-Bypass Mode**:
  * You can instantly skip the passcode screen during development and testing by appending `?bypass=noir` to your URL!
  * **URL Example**: `http://localhost:5173/admin?bypass=noir`

### 📋 Main Operational Modules

#### 1. 📦 Orders Management (Active preparation queue)
* Displays every guest order sorted chronologically with **newest orders appearing first**.
* **Identity Indicators**: Shows the Guest's Name, Phone Number, and their physical location (**Table Number / Seat location**).
* **Live Billing Status**:
  * `💳 Paid (Direct)` *(Emerald Green Badge)*: Order paid immediately online during checkout.
  * `💵 Bill to Table` *(Warm Gold Badge)*: Order placed on the customer's active tab to be settled later.
* **Order Action Pipeline**: Progress tickets in real-time through the kitchen queue:
  * Click **`Start Prep`**: Moves status from `Pending` ➔ `Preparing`.
  * Click **`Mark Served`**: Moves status from `Preparing` ➔ `Served`.
  * Click **`Delete`**: Voids/removes the order card instantly from the live screen.

#### 2. 🪑 Reservation Log
* Tracks all seat bookings and special occasion reservations submitted via the site.
* Displays Guest name, Contact info, Date & Time, Size of party, and Custom notes.
* Quick clear button to resolve or delete reservations.

#### 3. 📨 Contact Feedback Panel
* Aggregates all contact feedback and inquiry submissions.
* Review guest names, email, subjects, and text messages instantly.

## 🚀 Setup & Launch Instructions

### 1. Clone & Install Dependencies
First, install package dependencies for both the frontend client and the backend server:

```bash
# Install server dependencies
cd backend
npm install

# Install client dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Files
Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/noir_db
NODE_ENV=development
```

*(Note: If `MONGO_URI` is omitted or MongoDB is offline, the backend server will automatically fallback to the resilient local JSON file system!)*

### 3. Start the Application

Open two separate terminals:

#### Terminal A: Start the Backend API Server
```bash
cd backend
npm run dev
```

#### Terminal B: Start the Vite React Client
```bash
cd frontend
npm run dev
```

Your browser will automatically load the luxury cafe portal at `http://localhost:5173`. Let the experience begin! 🕯️☕✨
