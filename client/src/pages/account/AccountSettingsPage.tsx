import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { useToast } from "../../hooks/toast/useToast";
import { accountService } from "../../services/accountService";
import type { ChangePasswordRequest, UpdateProfileRequest } from "../../types/auth/ProfileSettings";

const ANALYTICS_OPTIONS = [
  { value: 0, label: "Last 7 days" },
  { value: 1, label: "Last 30 days" },
  { value: 2, label: "Last 90 days" }
];

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [defaultRange, setDefaultRange] = useState(1);
  const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(false);
  const [expiryReminderEnabled, setExpiryReminderEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoadingProfile(true);
        await refreshProfile();
        if (!cancelled) {
          setErrors([]);
        }
      } catch {
        if (!cancelled) {
          setErrors(["Unable to load your profile settings right now."]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [refreshProfile]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      setDefaultRange(profile.defaultAnalyticsRange ?? 1);
      setWeeklySummaryEnabled(profile.weeklySummaryEnabled ?? false);
      setExpiryReminderEnabled(profile.expiryReminderEnabled ?? false);
    }
  }, [profile]);

  const initialState = useMemo(() => ({
    displayName: profile?.displayName ?? "",
    defaultRange: profile?.defaultAnalyticsRange ?? 1,
    weeklySummaryEnabled: profile?.weeklySummaryEnabled ?? false,
    expiryReminderEnabled: profile?.expiryReminderEnabled ?? false
  }), [profile]);

  const hasChanges = useMemo(() => {
    return (
      displayName !== initialState.displayName ||
      defaultRange !== initialState.defaultRange ||
      weeklySummaryEnabled !== initialState.weeklySummaryEnabled ||
      expiryReminderEnabled !== initialState.expiryReminderEnabled
    );
  }, [displayName, defaultRange, weeklySummaryEnabled, expiryReminderEnabled, initialState]);

  const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setDisplayNameError(null);
    setIsSaving(true);

    try {
      const request: UpdateProfileRequest = {
        displayName: displayName.trim(),
        defaultAnalyticsRange: defaultRange,
        weeklySummaryEnabled,
        expiryReminderEnabled
      };

      await updateProfile(request);
      showToast("Profile updated", "success");
    } catch (err: unknown) {
      const eObj: any = err as any;
      const apiErrors = eObj?.errors;
      const generalErrors: string[] = [];

      if (Array.isArray(apiErrors)) {
        apiErrors.forEach((errStr) => {
          if (typeof errStr === "string" && errStr.includes(":")) {
            const [field, message] = errStr.split(":", 2);
            const fieldLower = field.toLowerCase().trim();
            if (fieldLower === "displayname") {
              // Only set display name error, don't add to general errors
              setDisplayNameError(message.trim());
            } else {
              // All other errors go to general errors
              generalErrors.push(message.trim());
            }
          } else if (errStr) {
            // Non-field-specific errors
            generalErrors.push(errStr);
          }
        });
      } else if (eObj?.message) {
        // Unexpected error format
        generalErrors.push(eObj.message);
      } else if (err instanceof Error) {
        generalErrors.push(err.message);
      } else {
        generalErrors.push("Something went wrong");
      }

      // Only set errors if there are general (non-display-name) errors
      if (generalErrors.length > 0) {
        setErrors(generalErrors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setIsChangingPassword(true);

    try {
      await accountService.changePassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      showToast("Password changed", "success");
    } catch (err: unknown) {
      // Always clear the current password input on failure for safety/usability
      setPasswordForm((prev) => ({ ...prev, currentPassword: "" }));

      const eObj: any = err as any;
      const apiErrors = eObj?.errors;
      const generalErrors: string[] = [];

      if (Array.isArray(apiErrors)) {
        apiErrors.forEach((errStr) => {
          if (typeof errStr === "string" && errStr.includes(":")) {
            const [field, message] = errStr.split(":", 2);
            const fieldLower = field.toLowerCase().trim();
            if (fieldLower === "currentpassword") {
              // Only set current password error, don't add to general errors
              setCurrentPasswordError(message.trim());
            } else if (fieldLower === "newpassword") {
              // Only set new password error, don't add to general errors
              setNewPasswordError(message.trim());
            } else {
              // All other errors go to general errors
              generalErrors.push(message.trim());
            }
          } else if (errStr) {
            // Non-field-specific errors
            generalErrors.push(errStr);
          }
        });
      } else if (eObj?.message) {
        // Unexpected error format
        generalErrors.push(eObj.message);
      } else if (err instanceof Error) {
        generalErrors.push(err.message);
      } else {
        generalErrors.push("Something went wrong");
      }

      // Only set errors if there are general (non-password-field) errors
      if (generalErrors.length > 0) {
        setErrors(generalErrors);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090f] transition-colors px-4 md:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 mb-8 text-sm text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 cursor-pointer transition"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to links
        </button>

        <div className="mb-7">
          <p className="text-[11px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2 font-medium cursor-default">
            Account settings
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white leading-tight cursor-default">
            Manage your profile,
            <span className="text-gray-400 dark:text-white/35 cursor-default">
              {" "}fine-tune your experience.
            </span>
          </h1>
        </div>

        {errors.length > 0 && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            ))}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleSave} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm">
            <div className="mb-5">
              <label className="mb-2 block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35">
                Display name
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500/60 focus:bg-indigo-500/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              {displayNameError && (
                <span className="mt-2 text-sm text-red-500 block">{displayNameError}</span>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35">
                Username
              </label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                {user?.username ?? "—"}
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35">
                Email
              </label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                {profile?.email ?? "—"}
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35">
                Default analytics view
              </label>
              <div className="flex flex-wrap gap-2">
                {ANALYTICS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDefaultRange(option.value)}
                    className={`rounded-full cursor-pointer border px-4 py-1.5 text-xs font-medium transition ${
                      defaultRange === option.value
                        ? "border-indigo-500/30 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white/40 dark:hover:text-white/70"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                <span>Weekly summary emails</span>
                <button
                  type="button"
                  onClick={() => setWeeklySummaryEnabled((value) => !value)}
                  className={`relative cursor-pointer h-6 w-11 rounded-full transition ${weeklySummaryEnabled ? "bg-indigo-500" : "bg-gray-300 dark:bg-white/20"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${weeklySummaryEnabled ? "left-5" : "left-0.5"}`} />
                </button>
              </label>

              <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                <span>Expiry reminder notifications</span>
                <button
                  type="button"
                  onClick={() => setExpiryReminderEnabled((value) => !value)}
                  className={`relative cursor-pointer h-6 w-11 rounded-full transition ${expiryReminderEnabled ? "bg-indigo-500" : "bg-gray-300 dark:bg-white/20"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${expiryReminderEnabled ? "left-5" : "left-0.5"}`} />
                </button>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="text-sm text-gray-500 dark:text-white/40">
                {isLoadingProfile ? "Loading profile..." : "Changes appear instantly after saving."}
              </div>
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="rounded-xl cursor-pointer bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>

          <form onSubmit={handlePasswordChange} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change password
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
              Update your password securely.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35">
                  Current password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500/60 focus:bg-indigo-500/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                {currentPasswordError && (
                  <span className="mt-2 text-sm text-red-500 block">{currentPasswordError}</span>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35">
                  New password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500/60 focus:bg-indigo-500/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                {newPasswordError && (
                  <span className="mt-2 text-sm text-red-500 block">{newPasswordError}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword}
              className="mt-6 rounded-xl border cursor-pointer border-gray-200
               bg-white px-4 py-2.5 text-sm font-medium
                text-gray-700 transition hover:bg-gray-50
                 disabled:cursor-not-allowed disabled:opacity-40
                  dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
            >
              {isChangingPassword ? "Updating..." : "Change password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}