---
name: Urban Botanical Sanctuary
colors:
  surface: '#f7faf7'
  surface-dim: '#d8dbd8'
  surface-bright: '#f7faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f1'
  surface-container: '#ecefec'
  surface-container-high: '#e6e9e6'
  surface-container-highest: '#e0e3e0'
  on-surface: '#181c1b'
  on-surface-variant: '#414941'
  inverse-surface: '#2d3130'
  inverse-on-surface: '#eef1ee'
  outline: '#717970'
  outline-variant: '#c1c9be'
  surface-tint: '#396843'
  primary: '#003314'
  on-primary: '#ffffff'
  primary-container: '#1a4a28'
  on-primary-container: '#86b98d'
  inverse-primary: '#9fd3a6'
  secondary: '#1f6c3d'
  on-secondary: '#ffffff'
  secondary-container: '#a6f4b9'
  on-secondary-container: '#267243'
  tertiary: '#0b3218'
  on-tertiary: '#ffffff'
  tertiary-container: '#23492d'
  on-tertiary-container: '#8eb893'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#baefc0'
  primary-fixed-dim: '#9fd3a6'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#20502d'
  secondary-fixed: '#a6f4b9'
  secondary-fixed-dim: '#8bd79f'
  on-secondary-fixed: '#00210d'
  on-secondary-fixed-variant: '#005229'
  tertiary-fixed: '#c2edc6'
  tertiary-fixed-dim: '#a6d1ab'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#294f32'
  background: '#f7faf7'
  on-background: '#181c1b'
  surface-variant: '#e0e3e0'
  sunlight-gold: '#ca8a04'
  watering-blue: '#2563eb'
  environment-orange: '#ea580c'
  obsidian: '#000000'
  earth-gray: '#4b5563'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  card-title:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 32px
  margin-mobile: 20px
  margin-desktop: 40px
  section-gap: 96px
  container-max: 1280px
  container-narrow: 1024px
---

## Brand & Style

The design system is rooted in the "slow-retail" philosophy, transforming the digital shopping experience into a premium, misted garden boutique. The target audience consists of urban dwellers seeking to curate high-end botanical sanctuaries in modern environments. 

The aesthetic is **Minimalist / Luxury-Organic**, characterized by:
- **Breathable Sage Canvases:** Utilizing soft, natural tints instead of sterile whites to reduce eye strain and evoke a sense of calm.
- **Cinematic Transitions:** High-contrast entries (obsidian backdrops) that fade into airy, light-filled storefronts.
- **Tactile Organicism:** Exaggerated "pebble-like" curvatures that mirror the soft lines of nature.
- **Botanical Harmony:** A monochromatic depth where even typography is rendered in shades of forest and moss, linking every element back to the plant life it showcases.

## Colors

This design system utilizes a premium monochromatic green foundation supported by organic neutrals.

- **Primary (Forest Green):** Used for core brand identity, primary typography, and significant call-to-action fills.
- **Secondary (Leaf Green):** Dedicated to active growth states, hover interactions, and vibrant sub-headings.
- **Tertiary (Deep Moss):** A grounding soil-tone used for pricing tags, footer backgrounds, and structural anchors.
- **Neutral (Sage Wash):** The default "canvas" color. It provides a soft, desaturated mint-cream floor for all content.
- **Obsidian Black:** Reserved specifically for cinematic hero sections and backdrop filters to create a studio-lighting effect.
- **Functional Accents:** Sunlight Gold, Watering Blue, and Environment Orange are used strictly for plant care metadata, providing semantic clarity without breaking the botanical theme.

## Typography

The typography system pairs the editorial elegance of **Playfair Display** with the functional clarity of **Inter**.

- **Luxury Headings:** Use Playfair Display for all major titles. Hero statements should have slightly tighter tracking to feel like a high-end magazine masthead.
- **Readable Descriptions:** Body copy uses Inter with a "relaxed" line height (1.6x) to ensure comfortable reading of plant care instructions and descriptions.
- **Micro-Copy:** All labels, category tags, and tabs use bold, uppercase Inter with increased letter spacing (0.05em) to maintain a premium, structured feel even at small sizes.
- **Scientific Names:** When displaying botanical Latin names, use italicized body-base weights.

## Layout & Spacing

The layout model is a **Fluid Grid** with generous whitespace to ensure a "breathable" atmosphere.

- **Grid System:** A 12-column grid is used for desktop. For the product catalog, use a responsive grid scaling from 1 column (mobile) to 3 columns (desktop) with a consistent 32px (8 units) gutter.
- **Whitespace Strategy:** Sections are separated by large 96px vertical gaps to emphasize an editorial, non-cluttered feel.
- **Container Constraints:** Use `1280px` for standard landing content. Narrower `1024px` constraints should be used for detailed plant descriptions or split-screen modals to keep line lengths readable.
- **Mobile Adjustments:** Margins compress to 20px on mobile, and multi-column layouts (like side-by-side modal views) stack vertically.

## Elevation & Depth

Visual hierarchy is achieved through a mix of **Glassmorphism** and **Tonal Layers**.

- **Elevated Surfaces:** Use pure White for active cards, modals, and navigation menus to lift them off the neutral Sage Wash background.
- **Ambient Shadows:** Shadows should be extra-diffused and low-opacity. For cards, a `shadow-sm` is the default, which transitions to a "floating" `shadow-xl` (and a -10px Y-axis shift) on hover.
- **Misted Overlays:** Use backdrop blurs (`backdrop-blur-md`) for floating cart buttons, navigation bars, and card hover states. Card hover states should feature a semi-transparent dark green curtain (`bg-black/40`) to reveal icons.
- **Glow Effects:** Primary CTA buttons in dark hero zones should feature a soft white glow aura (`shadow-[0_0_40px_rgba(255,255,255,0.2)]`) to simulate high-end studio lighting.

## Shapes

The shape language is organic and soft, avoiding sharp corners to maintain a friendly, natural aesthetic.

- **Base Components:** Input fields and standard buttons use `rounded-xl` (0.75rem).
- **Product Cards:** Use `rounded-3xl` (1.5rem) to create a distinct pebble-like appearance.
- **Primary Actions:** Main "Shop" buttons and floating actions use `rounded-full` (pill-shape) for a tactile, friendly feel.
- **Feature Modals:** Large containers like detail modals should use exaggerated `rounded-[2rem]` corners to soften the large screen footprint.

## Components

- **Buttons:**
  - *Primary:* Pill-shaped, Forest Green background, White text. Hover transitions to Leaf Green.
  - *Floating Cart:* Circular, white frosted-glass backdrop with a Forest Green icon.
- **Cards:** Product cards must have hidden overflow to contain the `scale-105` image hover animation. Each card includes a subtle bottom-right floating "Add" action.
- **Inputs:** Highly rounded `rounded-xl` with light gray borders. On focus, apply a 2px Leaf Green (`#3b8554`) ring.
- **Navigation:** A dynamic bar that is transparent with white text at the top of the page, morphing into a white frosted-glass (`bg-white/95 backdrop-blur`) bar with Forest Green text upon scrolling.
- **Care Accents:** Small circular chips using the functional state colors (Gold, Blue, Orange) to denote sunlight, water, and temperature requirements.
- **Dividers:** Use a centered 96px width, 4px height Leaf Green line with rounded ends to separate major section headers from content.