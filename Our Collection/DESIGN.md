---
name: Botanical Excellence
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1c'
  on-surface-variant: '#414944'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3b6756'
  primary: '#00261a'
  on-primary: '#ffffff'
  primary-container: '#0f3d2e'
  on-primary-container: '#7ba894'
  inverse-primary: '#a2d1bb'
  secondary: '#566342'
  on-secondary: '#ffffff'
  secondary-container: '#d7e5bb'
  on-secondary-container: '#5a6745'
  tertiary: '#20211f'
  on-tertiary: '#ffffff'
  tertiary-container: '#353634'
  on-tertiary-container: '#9f9e9c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beedd7'
  primary-fixed-dim: '#a2d1bb'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#234f3f'
  secondary-fixed: '#dae8be'
  secondary-fixed-dim: '#becca3'
  on-secondary-fixed: '#141f05'
  on-secondary-fixed-variant: '#3f4b2c'
  tertiary-fixed: '#e4e2df'
  tertiary-fixed-dim: '#c8c6c4'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474745'
  background: '#fcf9f8'
  on-background: '#1b1b1c'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 80px
---

## Brand & Style

This design system embodies a premium, high-end botanical lifestyle. It targets an affluent urban demographic that seeks tranquility and curated nature within a modern architectural context. The visual language is deeply inspired by editorial luxury and contemporary tech aesthetics, blending the organic warmth of nature with the precision of high-end software.

The design style is a sophisticated hybrid of **Modern Minimalism** and **Glassmorphism**. It prioritizes generous whitespace, intentional breathing room, and a sense of calm. Tactile depth is achieved through translucent layers and subtle light-refracting borders, evoking the feeling of a glass-walled conservatory. The emotional response should be one of "effortless luxury"—serene, exclusive, and meticulously organized.

## Colors

The palette is rooted in a "Forest-to-Gallery" concept. The **Deep Forest Green** serves as the anchor, used for primary actions and high-contrast branding elements to convey stability and growth. **Sage Green** acts as a soft accent, providing a bridge between the dark primary and light surfaces. 

**Soft Cream** is the foundational surface color, replacing pure white to provide a warmer, more sophisticated "gallery" feel. **Charcoal** is reserved for typography to ensure maximum readability without the harshness of pure black. Pure **White** is used sparingly as a highlight or within glassmorphic layers to create a sense of luminosity and "bright light" reflection.

## Typography

The typographic hierarchy utilizes a classic serif/sans-serif pairing to communicate both heritage and modernity. **Playfair Display** is used for all headings to provide an editorial, high-fashion character. Its high-contrast strokes reflect the elegance of botanical forms.

**Inter** provides a functional, neutral counterpoint for body copy and UI labels. It ensures clarity and a modern "Apple-inspired" technical precision. For labels and metadata, a slightly increased letter spacing and uppercase styling should be applied to maintain a structured, premium feel. Line heights are generous to prevent visual clutter and maintain the minimalist aesthetic.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop to ensure content remains centered and curated, like a gallery display. On desktop, use a 12-column grid with a maximum container width of 1280px. 

Spacing follows a strict 8px base unit. Wide margins (64px+) are encouraged to create "luxury breathing room." Sections should be separated by significant vertical gaps (80px+) to allow the user to digest one concept at a time. On mobile, the grid transitions to a 4-column fluid layout with 20px side margins. Elements should feel intentionally placed rather than packed, emphasizing quality over quantity.

## Elevation & Depth

Depth is communicated through **Glassmorphism** and **Ambient Shadows**. Instead of traditional solid shadows, this system uses "Atmospheric Shadows"—very low opacity (4-8%), large blur radii (20px-40px), and a slight tint of the primary Forest Green to ground the elements.

Surfaces use a tiered approach:
1. **Base:** Soft Cream (#F7F5F2).
2. **Elevated (Glass):** White (#FFFFFF) with 60-80% opacity and a 12px-20px backdrop blur. These layers must include a 1px subtle white "inner glow" border to simulate the edge of a glass pane.
3. **Floating:** Distinct components like modals or primary action cards use a slightly deeper shadow to appear closer to the user.

## Shapes

The shape language is defined by **Rounded** geometry (level 2). This choice balances the professional rigor of luxury branding with the organic, approachable nature of botany. 

- Standard components (Buttons, Inputs): 0.5rem (8px).
- Large components (Cards, Modals): 1rem (16px).
- Decorative elements (Image containers): 1.5rem (24px).

Avoid sharp 90-degree angles to maintain the "friendly but upscale" mandate. However, do not use pill shapes for primary buttons; keep them subtly rounded to retain a sense of architectural structure.

## Components

### Buttons
Primary buttons use a solid **Deep Forest Green** background with White text, using the 8px corner radius. Secondary buttons should use a "Ghost" style with a 1px Forest Green border. All button interactions should have a subtle scale-down effect (98%) on press to feel "squishy" and high-quality.

### Cards
Cards are the primary vehicle for glassmorphism. They should feature a backdrop blur of at least 12px, a semi-transparent white background, and the 16px corner radius. Padding inside cards should be generous (24px-32px).

### Input Fields
Inputs should be minimalist: a Soft Cream background that is slightly darker than the main surface, or a 1px Sage Green border. Focus states should transition the border to Deep Forest Green with a soft outer glow.

### Chips & Tags
Used for botanical categories. These should be Sage Green with a 50% opacity background and Forest Green text, using a fully rounded (pill) shape to differentiate them from functional buttons.

### Lists & Navigation
Navigation links should use **Inter** in uppercase with wide letter spacing. Active states are indicated by a small, centered dot in Deep Forest Green below the text, rather than a heavy underline.