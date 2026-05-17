# Project Introduction: Urban Leaf Animated E-Commerce Site

## 1. Project Overview
**Mission:** Build a high-performance, viral-worthy, highly animated e-commerce website for "Urban Leaf," a premium indoor plant shop in Sri Lanka.
**Goal:** Create an immersive, 3D-like browsing experience with smooth animations, a seamless slide-out cart, and high conversion rates using Google Antigravity agents.

## 2. Tech Stack Requirements
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Animations:** Framer Motion (essential for scroll, hover, and page transition effects), GSAP (for complex staggered animations if needed)
- **Backend/Database:** Firebase (Firestore for plants inventory management)
- **Hosting Target:** Vercel

## 3. Core Features & Architecture
- **Animated Hero Section:** A highly engaging landing page with floating plant elements, parallax scrolling, and a strong "Bring Nature Home" call-to-action.
- **Dynamic Plant Grid:** A product listing page with smart filtering (e.g., Low Maintenance, Indoor Spaces, Office). Cards should feature smooth hover-reveal details and subtle floating animations.
- **Slide-Out Drawer Cart:** A responsive side-cart allowing users to add/remove items without leaving the current page. Includes real-time total price calculation.
- **Optimized Checkout (WhatsApp Integration):** A streamlined checkout form that collects user details and delivery address, formatting the final order directly into a WhatsApp message link for the business owner.
- **Plant Care Information:** Icon-based care instructions (Sunlight, Watering, Environment) clearly displayed on each product's detailed view.
- **Responsive Design:** 100% mobile-first approach. Animations must remain smooth on mobile browsers without lag.

## 4. Design & UI Guidelines
- **Color Palette:** - Primary Dark Green: `#1a4a28`
  - Secondary Light Green: `#3b8554`
  - Accent/Price Tags: Deep Green `#153b20`
  - Background: Soft off-white/beige `#f4f7f4` for a natural, organic feel.
- **Typography:** Modern, clean sans-serif for UI elements, paired with elegant, organic-looking serif or script fonts for specific headings.
- **Vibe:** Fresh, luxurious, natural, and minimalist.

## 5. Instructions for Antigravity Agents
- **Code Analysis Agent:** Review this document as the primary source of truth. Set up the foundational Next.js and Tailwind architecture.
- **Terminal Agent:** Install necessary dependencies (`framer-motion`, `firebase`, `lucide-react` for icons).
- **File Agent (Frontend):** Implement the UI components starting with the Hero Section, adhering to the specified color palette and Framer Motion rules. Build the Slide-Out Cart component early in the process. Ensure all micro-interactions feel premium.
- **File Agent (Backend/Logic):** Mock the initial plant data (e.g., "Green Flash", "Bambino Red") in a JSON structure.
- **Browser Agent:** Continuously test the scroll animations, responsive breakpoints, and cart state management. Verify that the WhatsApp order link generates correctly.

**Execute Mission:** Please initialize the workspace, read the specifications above, and begin the chain reaction to build the complete Urban Leaf platform.