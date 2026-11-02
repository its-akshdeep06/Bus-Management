# 🚌 Safar — Modern Intercity Bus Reservation Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-17+-f89820?logo=openjdk&style=flat-square)](https://openjdk.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**Safar** is a modern, high-performance intercity bus booking platform designed with a **Premium + Playful + Travel-focused** visual identity. Built with Next.js 14 App Router, TypeScript, and clean custom SVG animations, Safar offers real-time bus searches, seat selection, transparent pricing breakdowns, ticket management, and an ultra-simple Java Object-Oriented Programming (OOP) companion module.

---

## ✨ Key Features

### 🚍 1. Smart Route Search & Instant City Swap
- Search across verified intercity bus routes connecting major hubs (Delhi, Jaipur, Mumbai, Pune, Bangalore, Chennai, Manali, etc.).
- **One-Click Swap**: Instant animated source $\rightleftarrows$ destination swap with automatic query re-fetch.
- **Quick Date Selectors**: One-click "Today" and "Tomorrow" quick filters.
- **Recent Searches**: Automatically saves past searches in LocalStorage for 1-click re-selection.

### 🧭 2. Visual Journey Stepper
- 5-step breadcrumb progress tracker guiding users through their booking journey:
  `Search Routes` ➔ `Select Fleet` ➔ `Choose Seat` ➔ `Passenger Details` ➔ `Confirmed Pass`.

### 💺 3. Interactive Cabin Drawer & Seat Selection
- Real-time 36-seat bus chassis layout featuring front driver cabin and steering wheel illustration.
- **Seat Filters**: Filter seats by "Window" or "Aisle" preference.
- **Boarding & Dropping Point Selectors**: Choose from verified terminal stops and scheduled arrival times.
- Clear seat status distinction: *Available*, *Selected*, and *Booked*.

### 🏷️ 4. Dynamic Pricing & Instant Promo Codes
- Live fare computation showing Base Fare, 5% GST, Convenience Fee, and Promo Discounts.
- Built-in coupon verification (e.g., `SAFARFIRST`, `WEEKEND`, `CHALO100`) with instant savings feedback.

### ⚖️ 5. Side-by-Side Bus Comparison
- Compare up to 3 bus operators simultaneously in a dedicated comparison modal.
- Evaluates pricing, departure times, trip durations, passenger ratings, seat availability, and onboard amenities.

### 🗺️ 6. Route Stops & Timeline Modal
- Visual interactive journey roadmap showing boarding terminals, waypoints, scheduled times, and landmarks.

### 📤 7. Native Trip Sharing
- Native Web Share API integration with an automatic 1-click clipboard fallback to share bus itineraries or confirmed PNR tickets with friends and family.

### 🎟️ 8. Digital Pass & PNR Management
- Full booking history with live PNR tracking.
- Instant ticket cancellation with dynamic seat restoration back into fleet inventory.
- Print/Save digital ticket directly from browser.

### 🎬 9. Intentional 3-Second Animation System & Auto-Scroll
- Built-in 3000ms animation display timers on key SVG loaders (`bus-driving.svg`, `route-dots.svg`, `wheel-spinner.svg`, `booking-confirmed.svg`) ensuring users can visibly appreciate animations without instantaneous skipping.
- Smooth automated viewport scrolling that auto-focuses on the active section (search results, seat drawer, confirmation modal, cancelled card).

### 🌓 10. Dark & Light Theme Mode
- Complete custom design system with warm ivory surfaces and dark charcoal palettes.
- Persisted across user sessions via LocalStorage.

### ☕ 11. Ultra-Simple Java OOP Companion Module
- Standalone single-file Java implementation located in `legacy/BusSystem.java`.
- Demonstrates fundamental Object-Oriented Programming (OOP) concepts with zero external dependencies.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 14.2 (App Router) | Server components, API Route Handlers, SSR & static generation |
| **Frontend Library** | React 18.3 | Hooks, Context, custom SVG state animations |
| **Language** | TypeScript 5.5 | Strictly typed interfaces, data contracts, and props |
| **Styling** | Vanilla CSS3 | Custom tokens, CSS Grid/Flexbox, responsive media queries |
| **Icons & Art** | 100% SVG | Lucide React + custom animated travel SVGs & hand-drawn doodles |
| **Fonts** | Self-Hosted Variable Fonts | Plus Jakarta Sans (Primary UI), DM Sans (Body), Caveat (Doodles) |
| **Storage** | In-Memory & LocalStorage | Session persistence, recent routes, favorites, and PNRs |
| **OOP Companion** | Pure Java 17+ | Single-class console implementation (`legacy/BusSystem.java`) |

---

## 📂 Project Architecture

```plaintext
bus-reservation-system/
├── public/
│   └── assets/
│       ├── animations/          # Animated SVGs (bus-driving, route-dots, wheel-spinner)
│       ├── brand/               # Safar brand mark and favicon
│       ├── fonts/               # Self-hosted Plus Jakarta Sans, DM Sans, Caveat
│       ├── icons/               # 50 stroke-based Lucide SVG icons
│       └── illustrations/       # Buses, empty states, doodles, roads
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/route.ts       # Sign in & registration endpoint
│   │   │   ├── bookings/route.ts   # PNR reservation & ticket cancellation endpoint
│   │   │   └── buses/route.ts      # Real-time bus catalog & filtering endpoint
│   │   ├── globals.css             # Theme tokens, variables, typography, keyframes
│   │   ├── layout.tsx              # Root HTML shell & metadata
│   │   └── page.tsx                # Main single-page interactive application
│   ├── components/                 # 15 modular, decoupled React components
│   │   ├── AuthModal.tsx
│   │   ├── BookingModal.tsx
│   │   ├── BookingSuccessModal.tsx
│   │   ├── BusCard.tsx
│   │   ├── BusComparisonModal.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSearch.tsx
│   │   ├── JourneyStepper.tsx
│   │   ├── MyBookingsModal.tsx
│   │   ├── OffersSection.tsx
│   │   ├── RouteMapModal.tsx
│   │   ├── SeatDrawer.tsx
│   │   ├── Toast.tsx
│   │   ├── TripShareModal.tsx
│   │   └── WhyChooseSafar.tsx
│   ├── lib/
│   │   └── data.ts                 # 19 verified bus fleet routes, promo codes, stops
│   └── types/
│       └── index.ts                # TypeScript interfaces (Bus, Booking, Seat, etc.)
├── legacy/
│   ├── BusSystem.java              # Minimal, single-class Java OOP implementation
│   └── BusSystem.class             # Compiled Java bytecode
├── agent.md                        # Complete AI audit log & minute change history
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher
- **Java JDK** *(optional, for Java companion)*: `v17` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/bus-reservation-system.git
   cd bus-reservation-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗️ Production Build

To build and test the optimized production distribution:

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## ☕ Running the Java OOP Module

The project includes an ultra-simplified, single-file Java companion demonstrating core Object-Oriented principles (encapsulation, state management, methods) with zero dependencies.

```bash
# Navigate to repository root
cd bus-reservation-system

# Compile Java source
javac legacy/BusSystem.java

# Run console application
java -cp legacy BusSystem
```

### Sample Output:
```text
=================================
     SAFAR BUS RESERVATION       
=================================

--- AVAILABLE BUSES ---
1. Delhi Express (Delhi to Jaipur) | Fare: Rs.800 | Seats Left: 36
2. Mumbai Cruiser (Mumbai to Pune) | Fare: Rs.450 | Seats Left: 40
3. Bangalore Star (Bangalore to Chennai) | Fare: Rs.750 | Seats Left: 40

--- BOOKING CONFIRMED ---
Passenger : Aman Sharma
Bus       : Delhi Express (Delhi to Jaipur)
Seat No   : 12
Fare      : Rs.800
Remaining Seats: 35
-------------------------

--- TICKET CANCELLED ---
Bus       : Delhi Express
Seat 12 is now free.
Remaining Seats: 36
-------------------------
```

---

## 📡 REST API Documentation

Safar exposes clean JSON API route handlers built on Next.js App Router:

| Method | Endpoint | Parameters / Body | Description |
|---|---|---|---|
| `GET` | `/api/buses` | `from`, `to`, `date`, `types`, `amenities`, `maxPrice`, `sortBy` | Retrieves filtered bus catalog |
| `POST` | `/api/auth` | `{ action, username, password, name, phone }` | User login or registration |
| `GET` | `/api/bookings` | `username` (query param) | Retrieves all user reservations |
| `POST` | `/api/bookings` | `{ busId, seatNumber, username, passengerName, ... }` | Creates confirmed booking & PNR |
| `DELETE` | `/api/bookings` | `bookingId` (query param) | Cancels ticket and restores seat |

---

## 🎨 Color Palette & Design Tokens

Safar utilizes an expressive, restrained travel palette:

- **Primary / Warm Coral**: `#E47C69`
- **Secondary / Soft Orange**: `#F2A65A`
- **Accent / Muted Teal**: `#5B9DAD`
- **Surface / Warm Ivory**: `#F5F2E9`
- **Dark Neutral / Charcoal**: `#263B40`
- **Success / Olive Green**: `#60B246`
- **Alert**: `#D84E55`

---

## 📝 Change Log & Audit History

Every modification, optimization, and bug fix made to this codebase is meticulously recorded with timestamps, purposes, file diffs, and verification steps in [**`agent.md`**](agent.md).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
