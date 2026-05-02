export type Expiry = "never" | "1day" | "7days" | "30days";

export const EXPIRY_OPTIONS: { label: string; value: Expiry }[] = [
  { label: "Never", value: "never" },
  { label: "1 day", value: "1day" },
  { label: "7 days", value: "7days" },
  { label: "30 days", value: "30days" },
];