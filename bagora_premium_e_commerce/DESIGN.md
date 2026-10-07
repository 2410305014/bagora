---
name: Bagora Premium E-commerce
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system embodies "Quiet Luxury"—a philosophy of restraint, precision, and high-caliber materiality. It is designed for a discerning audience that values craftsmanship over loud branding. The aesthetic is **Minimalist and Sophisticated**, utilizing expansive whitespace to allow product photography to serve as the primary visual anchor.

The interface leverages high-contrast transitions, generous breathing room, and a structured editorial layout to evoke the feeling of a physical luxury boutique. Interaction patterns are intentional and smooth, avoiding unnecessary clutter to maintain a focused, premium shopping experience.

## Colors
The palette is rooted in a monochromatic foundation with a singular metallic accent to signify prestige.

- **Primary (Charcoal):** Used for core branding, primary actions, and high-level navigation to provide a grounded, authoritative presence.
- **Accent (Warm Gold):** Reserved for "Value Indicators" such as price points, active states, and specific call-to-actions like "Add to Cart" to draw the eye with elegance.
- **Backgrounds:** A tiered system using Off-White (#FAFAFA) for the global canvas and Pure White (#FFFFFF) for interactive surfaces and product cards to create subtle depth.
- **Typography:** Deep Grey (#333333) is used for body copy to reduce eye strain compared to pure black, while Slate (#757575) handles metadata and captions.

## Typography
The typographic strategy uses a "Serif-on-Sans" pairing to balance modern efficiency with traditional luxury.

- **Headlines:** Playfair Display is used for hero sections, product names, and editorial storytelling. It should be set with slightly tighter letter-spacing in larger sizes.
- **Body & UI:** Inter provides a highly legible, neutral foundation for descriptions, menus, and forms.
- **Utility:** Use the `label-caps` style for category tags, small badges, and navigation links to create a clear visual distinction from narrative text.

## Layout & Spacing
This design system utilizes a **Fixed Grid** philosophy for desktop to maintain an editorial, magazine-like feel, and a **Fluid Grid** for mobile devices.

- **Desktop (1440px+):** 12-column grid, 1280px max-width container, 24px gutters, and 64px side margins.
- **Tablet (768px - 1024px):** 8-column grid, 24px gutters, 32px side margins.
- **Mobile (<768px):** 4-column grid, 16px gutters, 16px side margins.

Spacing follows a strict 8px scale. Generous vertical padding (`section-gap`) is encouraged between distinct content blocks to prevent visual fatigue and reinforce the premium positioning.

## Elevation & Depth
Elevation is achieved through **Ambient Shadows** and **Tonal Layering** rather than aggressive borders.

- **Level 1 (Product Cards):** A very soft, diffused shadow with a large blur radius (e.g., `0px 10px 30px rgba(0,0,0,0.04)`) to make products feel slightly lifted from the background.
- **Level 2 (Dropdowns/Modals):** A more defined shadow to indicate temporary interaction layers (e.g., `0px 15px 45px rgba(0,0,0,0.08)`).
- **Depth Cues:** Use the Off-White background (#FAFAFA) to represent the "ground" and White (#FFFFFF) to represent "interactive elements."

## Shapes
The shape language is refined and consistent, leaning toward a "Soft-Geometric" approach. 

- **Cards & Containers:** Use a 12px (`rounded-lg`) radius to soften the high-contrast color palette.
- **Small Elements:** Buttons and input fields should maintain an 8px (`default`) radius.
- **Iconography:** Use 1.5pt thin-line icons with square ends to mirror the structural precision of the leather goods.

## Components
- **Buttons:** 
  - *Primary:* Charcoal (#1A1A1A) fill, white text, no border. Transitions to Gold (#C5A059) on hover.
  - *Secondary:* Transparent fill, 1px Charcoal border.
  - *Ghost:* No border or fill, underlined text for low-priority actions.
- **Cards:** White surfaces with a 12px radius. Images should fill the top section with a subtle grey-scale overlay on hover to reveal the price or "Quick Add" options.
- **Input Fields:** Bottom-border only (2px) in Charcoal for a "signature" look, or light 1px borders (#EEEEEE). Focus state should transition the border color to Gold.
- **Badges:** Small, high-kerning uppercase text. "New" uses a Gold background; "Sale" uses a Charcoal background.
- **Navigation:** Top-tier navigation should be centered with ample letter spacing. Use a sticky header that transitions from transparent to solid White on scroll.
- **Chips/Filters:** Rounded-pill shapes with a thin light-grey border that fills Charcoal when selected.