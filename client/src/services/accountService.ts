import { apiFetch } from "../api/apiClient";
import { ApiError } from "../types/auth/ApiError";
import type { ChangePasswordRequest, ProfileSettings, UpdateProfileRequest } from "../types/auth/ProfileSettings";

async function getProfile(): Promise<ProfileSettings> {
  const res = await apiFetch("/api/account/profile");

  if (!res.ok) {
    const content = await res.json().catch(() => ({})) as { errors?: string[]; error?: string };
    throw new ApiError("Failed to load profile", content.errors ?? [content.error ?? "Unable to load profile"]);
  }

  return await res.json();
}

async function updateProfile(request: UpdateProfileRequest): Promise<ProfileSettings> {
  const res = await apiFetch("/api/account/profile", {
    method: "PUT",
    body: JSON.stringify(request)
  });

  if (!res.ok) {
    const content = await res.json().catch(() => ({}));

    // ModelState validation returns a ProblemDetails-like object with errors: { Field: ["msg"] }
    // ServiceResult failures return { error: string, suggestions: string[] }
    const errors: string[] = [];

    if (content?.errors && typeof content.errors === "object" && !Array.isArray(content.errors)) {
      for (const key of Object.keys(content.errors)) {
        const vals = content.errors[key];
        if (Array.isArray(vals)) {
          for (const v of vals) {
            errors.push(`${key}:${v}`);
          }
        } else if (typeof vals === "string") {
          errors.push(`${key}:${vals}`);
        }
      }
    }

    if (content?.suggestions && Array.isArray(content.suggestions)) {
      for (const s of content.suggestions) {
        errors.push(s);
      }
    }

    if (errors.length === 0) {
      if (content?.error && typeof content.error === "string") errors.push(content.error);
      else errors.push("Unable to update profile");
    }

    throw new ApiError("Failed to update profile", errors);
  }

  return await res.json();
}

async function changePassword(request: ChangePasswordRequest): Promise<void> {
  const res = await apiFetch("/api/account/password", {
    method: "PUT",
    body: JSON.stringify(request)
  });

  if (!res.ok) {
    const content = await res.json().catch(() => ({}));
    const errors: string[] = [];

    if (content?.errors && typeof content.errors === "object" && !Array.isArray(content.errors)) {
      for (const key of Object.keys(content.errors)) {
        const vals = content.errors[key];
        if (Array.isArray(vals)) {
          for (const v of vals) {
            errors.push(`${key}:${v}`);
          }
        } else if (typeof vals === "string") {
          errors.push(`${key}:${vals}`);
        }
      }
    }

    if (content?.suggestions && Array.isArray(content.suggestions)) {
      for (const s of content.suggestions) {
        errors.push(s);
      }
    }

    if (errors.length === 0) {
      if (content?.error && typeof content.error === "string") errors.push(content.error);
      else errors.push("Unable to change password");
    }

    throw new ApiError("Failed to change password", errors);
  }
}

export const accountService = {
  getProfile,
  updateProfile,
  changePassword
};
