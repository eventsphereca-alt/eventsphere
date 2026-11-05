# Event Sphere Design System

## Tokens

```js
colors.ink = "#0a0a0a"
colors.muted = "#666666"
colors.surface = "#ffffff"
colors.page = "#f7f7f5"
colors.line = "#e5e5e5"

radius.button = "6px"
radius.field = "6px"
radius.card = "8px"

button.height = "40px"
button.fontSize = "14px"
button.paddingX = "14px"
```

## Buttons

All dashboard and app action buttons should use a subtle 6px radius, 14px text, 40px height, and no uppercase letter spacing.

```js
primary =
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-3.5 text-[14px] leading-none font-medium tracking-normal text-white transition-colors hover:bg-neutral-800"

secondary =
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-neutral-300 bg-white px-3.5 text-[14px] leading-none font-medium tracking-normal text-black transition-colors hover:bg-neutral-50"

text =
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[14px] leading-none font-medium tracking-normal text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black"
```

## Typography

```js
pageTitle = "text-[32px] font-semibold tracking-tight text-neutral-950"
sectionTitle = "text-base font-semibold text-neutral-950"
body = "text-sm leading-6 text-neutral-500"
label = "text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500"
```

## Fields

```js
input =
  "h-11 w-full rounded-md border border-neutral-300 bg-white px-4 text-[14px] text-black outline-none"

textarea =
  "min-h-28 w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-[14px] text-black outline-none"
```

## Source

Reusable React class strings live in `src/design-system.js`. Global CSS variables live in `src/index.css` and `public/styles.css`.
