# Design System: Second Brain

## Design Tokens
```json
{
  "colors": {
    "light": {
      "primary": "#8a6a1f",
      "primaryHover": "#6f5517",
      "secondary": "#5b6475",
      "accent": "#6a5acd",
      "background": "#f7f5f0",
      "surface": "#ffffff",
      "surfaceAlt": "#efebe2",
      "text": "#1c1f26",
      "textSecondary": "#5e6572",
      "border": "#ddd8cd",
      "success": "#2f7d4f",
      "warning": "#9a6a00",
      "error": "#b23b3b",
      "info": "#356a8a"
    },
    "dark": {
      "primary": "#d4b06a",
      "primaryHover": "#e3c485",
      "secondary": "#8f9bb3",
      "accent": "#9d8cff",
      "background": "#0e1116",
      "surface": "#171b23",
      "surfaceAlt": "#1d222c",
      "text": "#e8e5de",
      "textSecondary": "#a2a8b4",
      "border": "#2a303b",
      "success": "#7fb08a",
      "warning": "#d9a441",
      "error": "#d97b7b",
      "info": "#7ea6c9"
    }
  },
  "typography": {
    "fontFamily": "\"Inter\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif",
    "fontFamilyDisplay": "\"Source Serif 4\", \"Iowan Old Style\", \"Palatino Linotype\", Georgia, serif",
    "fontFamilyMono": "\"JetBrains Mono\", ui-monospace, SFMono-Regular, Consolas, monospace",
    "scale": [11, 12, 13, 14, 16, 17, 19, 22, 28, 34, 44],
    "weights": { "regular": 400, "medium": 500, "semibold": 600, "bold": 700 },
    "lineHeights": { "tight": 1.2, "normal": 1.55, "relaxed": 1.75 }
  },
  "spacing": { "xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 32, "xxl": 48, "xxxl": 64 },
  "borderRadius": { "none": 0, "sm": 6, "md": 9, "lg": 12, "xl": 18, "full": 9999 },
  "borderWidth": { "none": 0, "thin": 1, "default": 2 },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.28)",
    "md": "0 8px 24px rgba(0,0,0,0.28)",
    "lg": "0 18px 48px rgba(0,0,0,0.38)"
  },
  "opacity": { "disabled": 0.45, "hover": 0.9, "muted": 0.7 },
  "transition": { "default": "140ms ease", "slow": "280ms ease" }
}
```

## 1. Brand Identity
Second Brain is a private reading room for one person's collected knowledge. The interface should disappear behind the notes: calm, dark, editorial, and low-chrome. Gold is the librarian's lamp (selection and emphasis). Violet marks connections (tags and the graph). Red is reserved for broken things. There is no marketing voice, no gamification, and no decorative illustration. The product feels like a well-kept index-card catalog that happens to be a web app.

## 2. Color Palette
Dark is the primary theme. Background `#0e1116` is a blue-black paper; surfaces step up through `#171b23` and `#1d222c`. Primary `#d4b06a` is a muted brass used for active navigation, focus rings, and links on hover. Accent `#9d8cff` is a dusty violet used for tags and graph nodes. Text is warm off-white `#e8e5de`, never pure white. Secondary text `#a2a8b4`; borders `#2a303b`. Warning `#d9a441` for missing metadata; error `#d97b7b` for broken links; success `#7fb08a`. The light palette exists for print/export only and is not exposed in the app yet.

## 3. Typography
UI text uses Inter (system fallback). Note titles and article bodies use Source Serif 4 (Iowan Old Style / Georgia fallback) to make reading feel like a book rather than a dashboard. Metadata and code use JetBrains Mono. Scale: 11px labels, 12–13px metadata, 14–16px UI, 17px reading body, 19–22px section headings, 28–34px page and note titles. Line height 1.55 for UI, 1.75 for reading. Headings are sentence case, never all caps except 11px sidebar labels with letter-spacing.

## 4. Iconography
Lucide outline icons at 16px (inline), 18px (navigation), and 20px (toolbar). Stroke 1.75, currentColor. Icons are optional decoration, never the only label. The brand mark is a small brass-outlined square containing three connected dots, drawn inline as SVG.

## 5. Spacing & Layout
A 248px fixed sidebar on desktop (>=900px) and a compact horizontal nav on mobile. Top bar 56px. Main content max-width 1080px, reading column 720px. Page padding 32px desktop / 18px mobile. Cards use 16px padding and 12px gaps. The graph page is the only full-bleed main area. Breakpoint: 900px. Respect `prefers-reduced-motion`.

## 6. Borders, Corners & Elevation
Everything sits on 1px borders; shadows are used only for floating tooltips and the graph hover card. Radius: 6px for small controls, 9px for inputs and rows, 12px for cards, 9999px for chips. No glassmorphism, no gradients on surfaces, no drop shadows on static cards.

## 7. Component Rules
Links are brass on hover, never underlined by default in navigation. Interactive cards lift by border color, not by scaling. Tags are violet-tinted pills and always link to a tag view. Broken-link text is red but still readable (4.5:1). Buttons use sentence case, 13px medium. Destructive actions require a confirmation and state exactly what file will change.

## 8. Content & Tone
Labels are short and concrete: Library, Tags, Issues, Graph. Dates are YYYY-MM-DD. Counts use thin spaces or commas. Empty states say what will appear there, not jokes. Copy explains the fix in one sentence before offering an action. No exclamation marks.

## Components

### Sidebar
- **Width**: 248px desktop; horizontal bar on mobile
- **Background**: surface
- **Border**: 1px border on the right
- **Brand**: 24px brass dot icon + wordmark
- **Nav item**: 8px 10px padding, 8px radius, 14px text; active uses primary-soft background and primary text
- **Category row**: 13px, count right-aligned in textSecondary
- **States**: *Default*: textSecondary. *Hover*: text. *Active*: primary on primary-soft.

### Stat Card
- **Background**: surface
- **Border**: 1px border
- **Radius**: 12px
- **Padding**: 16px
- **Number**: 28px semibold, tight line height
- **Label**: 11px uppercase, textSecondary, 0.06em tracking
- **Interactive**: whole card is a link when it has a destination
- **States**: *Hover*: border becomes primary, number shifts to primary. No transform.

### Note Row
- **Layout**: 1fr 160px 110px 90px grid
- **Padding**: 11px 4px
- **Border**: bottom 1px border
- **Title**: 15px medium; legacy badge 11px
- **Meta**: 12.5px textSecondary
- **States**: *Hover*: surface background, title becomes primary. *Hidden*: `display:none` (search filter).

### Tag Chip
- **Background**: accent at 10% opacity
- **Border**: 1px accent at 25% opacity
- **Text**: accent, 12px
- **Padding**: 2px 9px
- **Radius**: full
- **States**: *Hover*: border accent, text primary. Always links to `/?tag=...`.

### Issue Row
- **Layout**: source note + broken target + suggestions
- **Border**: bottom 1px border
- **Target**: mono 13px, error color
- **Suggestion**: 13px primary link with a small arrow
- **Fix hint**: 12px textSecondary
- **States**: *Hover*: row background surface.

### Graph Canvas
- **Background**: background with a subtle 1px grid
- **Links**: textSecondary at 12% opacity, 0.7px
- **Nodes**: category color, 3–9px radius; MOCs get a 2px brass ring
- **Labels**: 10px Inter, only for nodes with degree >= 4 or on hover
- **Tooltip**: surfaceAlt, 1px border, 12px radius, shadow md
- **Controls**: 28px buttons, border, radius 6, textSecondary; active primary

## 9. Update Log
- Initial system created for the Phase 1 reader, sidebar, tags, issues, and graph.
