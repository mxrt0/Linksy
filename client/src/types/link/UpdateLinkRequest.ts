import type { Expiry } from "./Expiry";

export interface UpdateLinkRequest {
  originalUrl: string;
  shortCode: string;
  password?: string;
  removePassword: boolean;
  expiry: Expiry;
  isActive: boolean;
}
