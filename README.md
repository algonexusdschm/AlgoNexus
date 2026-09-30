# ⚡ AlgoNexus 2026 — College Tech Fest Website & Organizer Admin Console

> A national-level college technical conclave & hackathon web portal with **Dedicated Organizer Admin Console (`/admin`)**, **Custom GPay/PhonePe QR & Bank Account Management**, **Multi-Tier Registrations**, **Payment Verification (UPI, Net Banking, Cards, Razorpay)**, **Digital QR Gate Passes**, and **1-Click Vercel Deployment**.

---

## 🌟 What's Included

### 1. 🛡️ Dedicated Organizer Admin Website (`/admin`)
- Accessible directly at **`/admin`** (or by clicking **"Admin Portal"** in the navigation bar).
- **Passcode Protected**: Default password: `admin123` (or `algonexus2026`).
- **Tab 1: College GPay QR & Bank Account Details**:
  - **Upload GPay / PhonePe / Paytm QR Code Image** (PNG, JPG, JPEG up to 8MB).
  - **Set College UPI ID** (e.g. `algonexus.fest@oksbi` or `yourfest@upi`).
  - **Set Official Bank Account Details** (Bank Name, Account Number, IFSC Code, Account Holder Name, Account Type, Branch).
  - **Live Preview Card**: Shows exactly how attendees will see the QR code and bank details during checkout.
  - **"Save & Publish to Live Website"**: Instantly publishes changes to the public event website.
- **Tab 2: Event Announcements, Dates & Pass Pricing**:
  - Change Event Name, Tagline, Dates, Venue, and Countdown target date.
  - Change Pass Prices (Solo Pass, Squad Pass, VIP Delegate Pass).
- **Tab 3: Registrations & Gate Desk Verification**:
  - Live count of registrations and total revenue collected (₹).
  - Searchable table with Attendee info, Pass type, 12-digit UPI UTR / Bank Reference number.
  - **View Payment Screenshot Modal**: Click *"Receipt"* to inspect the participant's payment receipt screenshot.
  - **Gate Desk Scanner Simulator**: Check in attendees via Ticket ID or QR code.
  - **1-Click Export to CSV** for printing attendance sheets and certificates.

---

### 2. 🌐 Public Event Website (`/`)
- **Cyberpunk Dark UI**: Hero banner, live countdown timer to the event, metrics counter (₹2.5L+ Cash Prizes, 36-Hr Hackathon, 2,000+ Innovators).
- **Official 2026 Announcement**: Reveal of dates, 3-day schedule roadmap, and 5 competition tracks (AI/ML, Web3, Speed Coding, CyberSec CTF, IoT Robotics).
- **Photo Gallery of Last Year's Event**: 2025 retrospective gallery with category filter chips and interactive Lightbox modal.
- **Passes & Pricing Tiers**: Solo Pass, Squad Pass (Team 2-4), and VIP Delegate Pass.
- **Payment Gateway Modal with 3 Clear Tabs**:
  1. 📱 **UPI & GPay / PhonePe QR Code**: Shows the organizer's uploaded GPay QR code, College UPI ID with 1-click Copy, direct mobile GPay/PhonePe intent links, 12-digit UTR input, and screenshot upload.
  2. 🏦 **Net Banking & Direct Bank Transfer**: Displays the organizer's official College Bank details (Bank Name, Account Number with Copy button, IFSC Code with Copy button, Account Holder, Branch), plus IMPS/NEFT UTR reference input and receipt upload.
  3. 💳 **Cards**: Card payment form supporting Visa, MasterCard, and RuPay.
  4. ⚡ **Razorpay Popup**: Direct link if live Razorpay keys are configured.
- **Holographic Digital E-Ticket**: Instant pass generation with unique Ticket ID (`ALGO26-XXXXX`), scannable QR code, and print button.

---

## 🚀 How to Run Locally

### Option A: 1-Click Launch (Windows)
Double-click [`start.bat`](start.bat) in the root folder.
It automatically launches both the backend and frontend at **[http://localhost:5000](http://localhost:5000)**!

### Option B: Terminal Command
```bash
# Start backend (serves both API and frontend build on port 5000)
cd backend
node server.js
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

### Option C: Development Mode (with Hot-Reloading)
```bash
# Terminal 1: Backend Server
cd backend
node --watch server.js

# Terminal 2: Vite Dev Server
cd frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** for live editing.

---

## ⚡ How to Deploy to Vercel (Step-by-Step)

The project includes `vercel.json` and serverless API handlers in `api/` configured specifically for Vercel.

### Method 1: Deploy via Vercel CLI (Recommended & Fastest)
1. Install Vercel CLI globally (if not installed):
   ```bash
   npm install -g vercel
   ```
2. In the project root directory (`algonexus`):
   ```bash
   vercel
   ```
3. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Select your account**
   - Link to existing project? **No**
   - What's your project's name? **algonexus** (or press Enter)
   - In which directory is your code located? **`./`** (press Enter)
4. For production deployment:
   ```bash
   vercel --prod
   ```
Your website will be live at `https://algonexus.vercel.app`!

### Method 2: Deploy via GitHub + Vercel Web Dashboard
1. Initialize git and push the repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AlgoNexus"
   git remote add origin https://github.com/YOUR_USERNAME/algonexus.git
   git branch -M main
   git push -u origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Import your `algonexus` repository.
4. Leave the default settings (Vercel automatically detects `vercel.json`):
   - **Framework Preset**: Other / Vite
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
5. *(Optional)* Add Environment Variables if using live Razorpay keys:
   - `RAZORPAY_KEY_ID`: `rzp_live_...`
   - `RAZORPAY_KEY_SECRET`: `...`
6. Click **Deploy**!

---

## 🔐 Admin Access Credentials

- **Admin URL**: `http://localhost:5000/admin` (or `https://your-vercel-site.vercel.app/admin`)
- **Default Passcode**: `admin123` (or `algonexus2026`)
