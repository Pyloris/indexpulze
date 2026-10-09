---
name: Terminal Precision
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353943'
  surface-container-lowest: '#0a0e17'
  surface-container-low: '#181b25'
  surface-container: '#1c1f29'
  surface-container-high: '#262a34'
  surface-container-highest: '#31353f'
  on-surface: '#dfe2ef'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2ef'
  inverse-on-surface: '#2c303a'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#ff817a'
  on-tertiary-container: '#7e000f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0f131c'
  on-background: '#dfe2ef'
  surface-variant: '#31353f'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  metric-display:
    fontFamily: JetBrains Mono
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.03em
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  data-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  data-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1rem
  margin: 0.75rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for elite quantitative traders, retail derivative analysts, and institutional operators navigating Indian market indices (Nifty 50, Bank Nifty, FinNifty, and Sensex). The emotional target is calm control under market volatility: clinical speed, zero ambiguity, and non-fatiguing high-density scanning during prolonged trading sessions.

The aesthetic fuses **Modern Financial Terminal** with **Subtle High-Contrast Technical Brutalism**:
- Deep layered obsidian and charcoal foundations prevent chromatic aberration and screen burn-in.
- Information architecture prioritizes strict tabular alignment over expressive flourishes.
- Micro-surfaces rely on razor-thin borders (1px) and controlled luminosity shifts instead of diffuse drop shadows.
- Visual hierarchy separates static contextual metadata from hyperactive streaming ticks (prices, quantities, and order book depths).

## Colors

The palette operates on three functional layers: structural surfaces, semantic signals, and operational brand accents.

### Structural Surfaces (The Dark Field)
- **Canvas / Root Background**: `#0a0e17` (Deep Obsidian Void)
- **Panel / Sidebar Background**: `#111827` (Charcoal Slate)
- **Card / Cell Surface**: `#162032` (Luminous Navy Base)
- **Surface Highlight / Hover**: `#1e293b` (Elevated Layer)
- **Border Ghost Subdued**: `#1e293b`
- **Border Structural Active**: `#334155`

### Market Semantic Signals
Indian equities and F&O trading require absolute semantic fidelity:
- **Bullish / Call (CE) / Bid / Profit**: `#10b981` (Emerald Core)
  - Tinted Fill (Low Opacity): `rgba(16, 185, 129, 0.12)`
  - Active Glow / Flash: `rgba(16, 185, 129, 0.35)`
- **Bearish / Put (PE) / Ask / Loss**: `#ef4444` (Vibrant Crimson)
  - Tinted Fill (Low Opacity): `rgba(239, 68, 68, 0.12)`
  - Active Glow / Flash: `rgba(239, 68, 68, 0.35)`
- **Index Highlighting & System Accents**: `#06b6d4` (Electric Cyan)
- **Secondary Accent & Links**: `#3b82f6` (Cobalt Core)

### Text & Numerics
- **Text Primary (Headings, Ticks, Strikes)**: `#f8fafc`
- **Text Secondary (Sub-metrics, Labels, Lot Sizes)**: `#94a3b8`
- **Text Muted / Disabled (Expired contracts, Timestamps)**: `#64748b`

## Typography

The type system implements a dual-engine architecture:
1. **Interface Engine (`Inter`)**: Used for page navigation, modal structures, form labels, and systemic notifications where high-density readability and horizontal efficiency are critical.
2. **Numeric Precision Engine (`JetBrains Mono`)**: Mandated for all stock indices, spot rates, options strike ladders, Greek values (Delta, Gamma, Theta, Vega), timestamps, lot counts, and rupee (`₹`) denominations. 

### Tabular Figures & OpenType Features
All monospaced numeric applications must enable tabular figures (`tnum`) and slashed zero (`zero`) where applicable. Column data must align precisely to the decimal point across re-rendering cycles. No proportional jitter is tolerated during real-time WebSocket tick updates.

## Layout & Spacing

Trading execution demands maximal vertical screen efficiency (high information density) without cognitive clutter. 

### Grid & Density Hierarchy
- **Desktop (>= 1280px)**: 12-column or 24-column flexible grid system optimized for multi-pane layouts (3-column layout: Market Watchlist 25%, Primary Candlestick/Orderflow 50%, Option Chain/Depth 25%). Gutters stay compact at `0.75rem` or `1rem` to minimize eye movement.
- **Laptop / Tablet (768px - 1279px)**: Split-pane collapsible views with collapsible watchlists; gutters scale to `0.75rem`.
- **Mobile (< 768px)**: Tabbed single-module view with anchored bottom trading execution docks; outer margins set to `0.75rem`.

### Spacing Principles
- Compact vertical table padding (`0.375rem` to `0.5rem`) maximizes visible data rows above the fold.
- Fixed 4px baseline rhythm controls all layout offsets.

## Elevation & Depth

This system avoids heavy, diffused drop shadows. Depth is achieved via **Surface Tiers** and **Subtle Structural Borders**:

1. **Level 0 (Floor)**: `#0a0e17` — Main dashboard background and chart canvas areas.
2. **Level 1 (Card/Container)**: `#111827` bordered with `1px solid #1e293b`.
3. **Level 2 (Interactive Modules & Table Rows)**: `#162032` on hover or selection, outlined with `1px solid #334155`.
4. **Level 3 (Modals & Slide-out Drawers)**: `#1a2436` with a crisp outer edge: `border: 1px solid rgba(6, 182, 212, 0.25)`, complemented by a focused glow `box-shadow: 0 0 24px rgba(6, 182, 212, 0.08)`.

### Flash Animations on Data Updates
- When a price ticks upward: brief `0.3s` background burst with `rgba(16, 185, 129, 0.2)`.
- When a price ticks downward: brief `0.3s` background burst with `rgba(239, 68, 68, 0.2)`.

## Shapes

The design system employs a **Soft Technical Precision (Level 1)** geometry:
- Standard UI containers, buttons, inputs, and chart cards use `0.25rem` (4px) corner radii.
- Badges, pill selectors, and status chips expand to `0.375rem` (6px) or full capsule pills (`9999px`) for quick tactile identification without clashing with the tabular grid.
- Tables, cells, and heatmap segments maintain sharp right angles (`0px`) internally to avoid visual drift in contiguous multi-cell datasets.

## Components

### 1. High-Density Market Watchlist & Option Tables
- **Header**: Height `32px`, uppercase JetBrains Mono `10px`, text color `#64748b`, right-aligned for numeric data.
- **Row**: Height `36px`, border-bottom `1px solid #1e293b`. Alternating hover background `#162032`.
- **Strike Row Indicator**: In-the-money (ITM) options feature a subtle left-border ribbon (Cyan for Nifty, Emerald for CE ITM, Crimson for PE ITM) and a translucent background tint (`rgba(6, 182, 212, 0.04)`).

### 2. Timeframe & Index Pill Selectors
- **Container**: Compact segmented control with `#0a0e17` fill and `1px solid #1e293b` perimeter.
- **Unselected Pill**: Color `#94a3b8`, padding `2px 8px`, transparent background.
- **Selected Pill**: Background `#1e293b`, text color `#06b6d4`, border `1px solid #06b6d4`, subtle cyan underglow.

### 3. Market Heatmap Tiles (Treemap)
- Sized relative to Open Interest (OI) or Volume traded.
- Filled with dynamic semantic gradients:
  - Strong Bullish (> +2%): `#10b981` (Solid with white monospace text).
  - Mild Bullish (0% to +2%): `rgba(16, 185, 129, 0.25)` with `#10b981` text.
  - Mild Bearish (0% to -2%): `rgba(239, 68, 68, 0.25)` with `#ef4444` text.
  - Strong Bearish (< -2%): `#ef4444` (Solid with white monospace text).
- Tile internal spacing: `2px` gap between assets.

### 4. Candlestick/Area Chart UI Container
- Dark header housing index spot price, Net Change (`+214.30 (+0.98%)`), 52W High/Low tags, and quick order triggers.
- Crosshair display: Monospaced numeric readout HUD in the top-left chart corner updating on pointer coordinates.
- Chart canvas: Native dark canvas (`#0a0e17`) with ultra-fine gridlines (`#141c2b`).

### 5. Order Action Buttons (Buy / Sell)
- **Buy Button**: Fill `#10b981`, text `#0a0e17`, bold typography. Hover state shifts to `#059669`.
- **Sell Button**: Fill `#ef4444`, text `#ffffff`, bold typography. Hover state shifts to `#dc2626`.
- **Secondary / Utility**: Fill `transparent`, border `1px solid #334155`, text `#94a3b8`. Hover `#1e293b`.

### 6. Trading Login & Credential Cards
- Dark elevated surface (`#111827`) with a 1px border (`#1e293b`).
- Numeric inputs (TOTP / MPIN) use `JetBrains Mono` centered characters with focus rings in `#06b6d4`.
- Broker selection pill switches (Zerodha, AngelOne, Groww, Dhan) integrated into the authentication header.