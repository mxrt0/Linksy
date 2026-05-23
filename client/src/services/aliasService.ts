import { apiFetch } from "../api/apiClient";
import type { AliasCheckResult } from "../types/alias/AliasCheckResult";

async function checkAlias(alias: string): Promise<AliasCheckResult> {
  const res = await apiFetch(`/api/links/alias/check?alias=${encodeURIComponent(alias)}`);

  if (!res.ok) {
    return { isAvailable: false, reason: "Unknown"};
  }

  return await res.json();
}

async function getAliasPreview(): Promise<string> {
  const res = await apiFetch("/api/links/alias/preview");

  if (!res.ok) {
    return "";
  }

  const content = await res.json() as { preview: string }
 
  return content.preview;
}

export const aliasService = {
    checkAlias,
    getAliasPreview
};
