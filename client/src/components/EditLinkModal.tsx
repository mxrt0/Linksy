import { useState } from "react";
import { EXPIRY_OPTIONS, type Expiry } from "../types/link/Expiry";
import type { Link } from "../types/link/Link";
import type { UpdateLinkRequest } from "../types/link/UpdateLinkRequest";
import type { ServiceResult } from "../types/services/ServiceResult";
import { AliasInput } from "./alias/AliasInput";

type Props = {
  link: Link;
  onClose: () => void;
  onSave: (id: string, request: UpdateLinkRequest) => Promise<ServiceResult<Link>>;
};

function getExpiry(expiresAt?: string | null): Expiry {
  if (!expiresAt) return "never";

  const remainingHours = (new Date(expiresAt).getTime() - Date.now()) / 3_600_000;

  if (remainingHours <= 24) return "1day";
  if (remainingHours <= 24 * 7) return "7days";
  return "30days";
}

export function EditLinkModal({ link, onClose, onSave }: Props) {
  const [originalUrl, setOriginalUrl] = useState(link.originalUrl);
  const [shortCode, setShortCode] = useState(link.shortCode);
  const [expiry, setExpiry] = useState<Expiry>(getExpiry(link.expiresAt));
  const [isActive, setIsActive] = useState(link.isActive);
  const [passwordEnabled, setPasswordEnabled] = useState(link.isPasswordProtected);
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRequired = passwordEnabled && !link.isPasswordProtected;
  const isDisabled = !originalUrl.trim() || !shortCode.trim() || isSaving || (passwordRequired && password.length < 4);

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const result = await onSave(link.id, {
      originalUrl: originalUrl.trim(),
      shortCode: shortCode.trim(),
      password: passwordEnabled && password.trim() ? password : undefined,
      removePassword: link.isPasswordProtected && !passwordEnabled,
      expiry,
      isActive
    });

    setIsSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      <div onClick={!isSaving ? onClose : undefined} className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] p-6 shadow-2xl shadow-black/10 dark:shadow-black/50">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2 font-medium">Edit link</p>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Keep your link up to date.</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close edit link"
            className="w-8 h-8 shrink-0 rounded-lg text-gray-400 dark:text-white/35 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-gray-700 dark:hover:text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35 mb-2">Destination URL<span className="text-red-500 ml-1">*</span></label>
            <input
              type="url"
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm outline-none focus:border-indigo-500/60 focus:bg-indigo-500/5 transition"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-white/10 my-5" />

          <div className="mb-5">
            <label className="block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35 mb-2">Short code<span className="text-red-500 ml-1">*</span></label>
            <AliasInput value={shortCode} onChange={setShortCode} currentAlias={link.shortCode} />
          </div>

          <div className="mb-5">
            <button
              type="button"
              onClick={() => setPasswordEnabled((enabled) => !enabled)}
              className={`flex items-center gap-3 text-sm transition cursor-pointer ${passwordEnabled ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-white/40"}`}
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center transition ${passwordEnabled ? "bg-indigo-500 border-indigo-500" : "border-gray-300 dark:border-white/15"}`}>
                {passwordEnabled && <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              🔒 Protect with password
            </button>

            {passwordEnabled && (
              <div className="mt-3">
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={link.isPasswordProtected ? "Leave blank to keep the current password" : "Enter password"}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-indigo-500/60"
                />
                <p className="mt-1.5 text-[11px] text-gray-400 dark:text-white/30">
                  {link.isPasswordProtected ? "Enter a new password only if you want to replace the current one." : "Use at least 4 characters."}
                </p>
              </div>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35 mb-2">Link expiry</label>
            <div className="flex gap-2 flex-wrap">
              {EXPIRY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setExpiry(option.value)}
                  className={`px-4 py-1.5 rounded-full border text-xs cursor-pointer font-medium transition ${expiry === option.value ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400" : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-gray-300 dark:hover:border-white/15 hover:text-gray-700 dark:hover:text-white/70"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {expiry !== "never" && <p className="mt-2 text-[11px] text-gray-400 dark:text-white/30">Saving starts the selected expiry period from now.</p>}
          </div>

          <button
            type="button"
            onClick={() => setIsActive((active) => !active)}
            className={`mb-6 flex items-center gap-3 text-sm transition cursor-pointer ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-white/40"}`}
          >
            <span className={`w-4 h-4 rounded border flex items-center justify-center transition ${isActive ? "bg-indigo-500 border-indigo-500" : "border-gray-300 dark:border-white/15"}`}>
              {isActive && <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            Link is active
          </button>

          {error && <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-500 dark:text-red-400">{error}</div>}

          <div className="flex gap-2.5">
            <button type="button" onClick={onClose} disabled={isSaving} className="flex-1 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium cursor-pointer text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/10 transition disabled:opacity-40">Cancel</button>
            <button type="submit" disabled={isDisabled} className="flex-1 py-2.5 rounded-xl bg-indigo-600 not-disabled:hover:bg-indigo-500 text-white text-sm font-medium transition cursor-pointer shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSaving ? <><svg className="animate-spin" width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" strokeDasharray="8 8" /></svg>Saving...</> : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
