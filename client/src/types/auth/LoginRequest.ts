import type { RegisterRequest } from "./RegisterRequest";

export type LoginRequest = Omit<RegisterRequest, "username">