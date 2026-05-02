import type { Expiry } from "./Expiry";

export interface CreateLinkRequest {
  originalUrl: string;
  shortCode?: string;
  expiry: Expiry;
}
