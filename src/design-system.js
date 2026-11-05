export const designTokens = {
  colors: {
    ink: "#0a0a0a",
    muted: "#666666",
    surface: "#ffffff",
    page: "#f7f7f5",
    line: "#e5e5e5",
    success: "#16a34a",
    danger: "#dc2626"
  },
  radius: {
    button: "6px",
    field: "6px",
    card: "8px"
  },
  typography: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    button: "14px",
    body: "14px",
    label: "11px"
  },
  button: {
    height: "40px",
    paddingX: "14px",
    fontSize: "14px",
    radius: "6px"
  }
};

export const buttonClasses = {
  primary:
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-black px-3.5 text-[14px] leading-none font-medium tracking-normal text-white transition-colors hover:bg-neutral-800",
  secondary:
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-neutral-300 bg-white px-3.5 text-[14px] leading-none font-medium tracking-normal text-black transition-colors hover:bg-neutral-50",
  text:
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-[14px] leading-none font-medium tracking-normal text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black"
};

export const fieldClasses = {
  input: "h-11 w-full rounded-md border border-neutral-300 bg-white px-4 text-[14px] text-black outline-none",
  textarea: "min-h-28 w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-[14px] text-black outline-none",
  label: "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500"
};
