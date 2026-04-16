# A paleta de cores, design e disposição do site deve seguir as instruções Abaixo:

# 

# Design System Strategy: The Architectural Vanguard

## 1\. Overview \& Creative North Star

**The Creative North Star: "The Sovereign Architect"**

This design system is not a utility; it is an environment. Moving away from the "neon-tech" tropes of the past, we are pivoting toward a visual language that balances industrial precision with editorial luxury. We define this through the **Sovereign Architect** philosophy—where every element feels structural, intentional, and authoritative.

We break the "template" look by eschewing symmetrical grids in favor of **Dynamic Offset Layouts**. By utilizing large-scale typography as a structural anchor and allowing elements to overlap across different surface depths, we create a sense of bespoke craftsmanship. The focus is on high-contrast tonal depth, where the rich navy foundation provides a vast canvas for the precision of the gold accents.

\---

## 2\. Colors

Our palette is rooted in the depth of the night sky and the precision of machined metal.

### Core Tones

* **Primary (`#b3c7f0`) \& Primary Container (`#0d2344`):** Our foundational logic. The deep navy is the "void" from which the interface is built.
* **Secondary (`#e9c176`) \& Tertiary (`#dfc389`):** These represent the Elegant Gold. Use these sparingly for "High-Impact" moments—CTAs, status indicators, or key data points.
* **Background (`#0e141d`):** A sophisticated, non-pure black that allows for layered depth.

### The "No-Line" Rule

**Explicit Instruction:** Do not use 1px solid borders to section off content. Traditional dividers are forbidden. Boundaries must be defined through **Background Color Shifts**. For example, a `surface-container-low` card sits on a `surface` background. If you need more definition, use a change in tonal value, not a line.

### Surface Hierarchy \& Nesting

Treat the UI as physical layers.

* **Base:** `surface` (`#0e141d`)
* **Lowest Level:** `surface-container-lowest` for deep backgrounds.
* **Highest Level:** `surface-container-highest` (`#2f353f`) for interactive components.
* **Nesting:** Place a `surface-container-high` card inside a `surface-container` section to create a natural, "milled" look.

### The Glass \& Gradient Rule

To achieve a "premium tech" feel, utilize **Glassmorphism** for floating menus or modals. Use `surface-variant` at 60% opacity with a `24px` backdrop blur.

* **Signature Textures:** Apply a subtle linear gradient from `primary` to `primary-container` (at a 45-degree angle) on hero buttons. This adds a "metallic sheen" that flat colors cannot replicate.

\---

## 3\. Typography

We utilize a dual-font strategy to balance architectural rigidity with humanistic readability.

* **Space Grotesk (Display \& Headlines):** This is our "Architectural" voice. Use it for `display-lg` through `headline-sm`. Its idiosyncratic letterforms provide the high-tech signature.

  * *Styling Tip:* For `display-lg` (3.5rem), use a slightly tighter letter-spacing (-0.02em) to increase authority.
* **Manrope (Body \& Titles):** This is our "Editorial" voice. Manrope provides a clean, modern contrast that ensures high legibility in complex data environments.

  * *Styling Tip:* In `body-md`, maintain a generous line height (1.6) to provide "breathing room" against the dark background.

\---

## 4\. Elevation \& Depth

In this system, light is a tool for focus, not just a shadow effect.

* **The Layering Principle:** Depth is achieved by "stacking" surface-containers. For example, a user profile card should be `surface-container-low`, while the dashboard it sits on is `surface`. The shift in hex code provides the lift.
* **Ambient Shadows:** If a floating element (like a popover) is required, use a shadow with a `48px` blur and `6%` opacity. The shadow color should be tinted with `on-surface` (`#dde2f0`) rather than black, creating a natural glow rather than a muddy smudge.
* **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` token at **15% opacity**. This creates a "glint" on the edge of the container rather than a hard enclosure.
* **Glassmorphism:** Use semi-transparent surface tokens for navigation rails. This allows the primary navy tones to "bleed" through, making the sidebar feel like it's part of the environment, not an afterthought.

\---

## 5\. Components

### Buttons

* **Primary:** Solid `secondary` (Gold) with `on-secondary` text. Roundedness: `sm` (0.125rem) for a sharp, architectural edge.
* **Secondary:** `surface-container-highest` background with a `ghost-border` (outline-variant at 20%).
* **Tertiary:** No background. Text in `primary` with a `label-md` weight.

### Input Fields

* **Style:** Minimalist. Use `surface-container-low` as the field background. No bottom border; instead, use a vertical "active" accent in `secondary` (Gold) on the left edge when focused.
* **Errors:** Use `error` (`#ffb4ab`) only for text; keep the field background consistent to maintain layout stability.

### Cards \& Lists

* **Forbid Dividers:** Use `1.5rem` to `2rem` of vertical whitespace to separate items.
* **Interaction:** On hover, a card should shift from `surface-container` to `surface-container-high` and scale by 1.01% for a subtle "breathing" effect.

### Chips

* **Filter Chips:** Use `surface-container-highest` with `Space Grotesk` at `label-sm`. When active, fill with `primary-container` and change text to `secondary` (Gold).

\---

## 6\. Do's and Don'ts

### Do:

* **Do** embrace negative space. If a layout feels "crowded," double the spacing scale.
* **Do** use asymmetrical text alignment. A left-aligned `display-lg` header paired with right-aligned `body-sm` metadata creates an editorial feel.
* **Do** use the Gold (`secondary`) only for 5-10% of the screen real estate to maintain its "premium" status.

### Don't:

* **Don't** use pure black (#000000). It kills the "navy" soul of the design system.
* **Don't** use standard "drop shadows." If it looks like a 2010 web app, the shadow is too heavy.
* **Don't** use icons without purpose. Every icon must be geometric and use the same stroke weight as the `outline` token.
* **Don't** use the neon cyan from the legacy brand. If a "success" state is needed, use a muted forest green that complements the navy, never a bright cyan.

