import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/dashboard/useDebounce";
import type { AliasCheckResult } from "../../types/alias/AliasCheckResult";
import { aliasService } from "../../services/aliasService";
import { APP_DOMAIN } from "../../config/app";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function AliasInput({ value, onChange }: Props) {
  const [state, setState] = useState<AliasCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");

  const debounced = useDebounce(value, 300);

  // =========================
  // PREVIEW LOAD
  // =========================
  useEffect(() => {
    const loadPreview = async () => {
      const p = await aliasService.getAliasPreview();
      setPreview(p);
    };

    loadPreview();
  }, []);

  // =========================
  // CHECK CUSTOM ALIAS
  // =========================
  useEffect(() => {
    if (!debounced) {
      setState(null);
      return;
    }

    const run = async () => {
      setLoading(true);

      const res = await aliasService.checkAlias(debounced);

      setState(res);
      setLoading(false);
    };

    run();
  }, [debounced]);

  const applySuggestion = (s: string) => {
    onChange(s);
  };

  const regeneratePreview = async () => {
        const fresh = await aliasService.getAliasPreview();
        setPreview(fresh);
  };

  const suggestions = state?.suggestions ?? [];

  const isReady =
    !!value &&
    !loading &&
    state?.isAvailable;

  return (
    <div className="w-full">

        {/* INPUT */}
      <div className="relative w-full">
    <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="your-link"
        className={`
            w-full px-3 py-2 pr-10 rounded-lg text-sm
            bg-white dark:bg-white/5
            border
            text-gray-900 dark:text-white
            outline-none transition

            ${
                state && !state.isAvailable
                ? "border-red-400/50 focus:border-red-400"
                : isReady
                ? "border-green-500/30 focus:border-green-500"
                : "border-gray-200 dark:border-white/10 focus:border-indigo-500/50"
            }
        `}
    />

    <span
        className={`
            absolute right-3 top-1/2 -translate-y-1/2 text-sm
            pointer-events-none
            ${
                !state
                ? "hidden"
                : state.isAvailable
                ? "text-green-400"
                : "text-red-500"
            }
        `}
    >
        {!state ? null : state.isAvailable ? "✓" : "✕"}
    </span>
</div>
        {/* LIVE URL PREVIEW */}
<div
  className={`
    mt-2 px-3 py-2 rounded-lg border
    text-sm font-mono transition-all duration-200

    ${
      state && !state.isAvailable
        ? "border-red-500/15 bg-red-500/5 text-red-400"
        : isReady
        ? "border-green-500/15 bg-green-500/5 text-green-400"
        : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40"
    }
  `}
>
  <span className="opacity-70">
    {APP_DOMAIN}/
  </span>

  <span>
    {value || preview || "your-link"}
  </span>
</div>
      {/* STATUS */}
      <div className="mt-2 min-h-4.5 text-xs">

        {!loading && state && (
          <>
            {!state.isAvailable && (
              <span className="text-red-400">
                {state.reason === "Reserved"
                  ? "Reserved short code"
                  : state.reason === "InvalidFormat"
                  ? "Invalid format"
                  : state.reason === "Taken"
                  ? "Short code already taken"
                  : state.reason === "TooShort"
                  ? "Short code must be at least 3 characters long"
                  : state.reason === "TooLong"
                  ? "Short code must be at most 20 characters long"
                  : "An error occurred."
                }
              </span>
            )}
          </>
        )}

        {/* PREVIEW STATE */}
        {!value && (
  <div className="flex items-center gap-2">
    <span className="text-gray-400 dark:text-white/30">
      Suggested:
    </span>

    <button
      type="button"
      onClick={() => onChange(preview)}
      className="
        px-2 py-1 rounded-md
        bg-indigo-500/10
        border border-indigo-500/15
        text-indigo-500 text-xs
        hover:bg-indigo-500/20
        transition
      "
    >
      {preview || "loading..."}
    </button>

    {/* 🔄 REGENERATE BUTTON */}
    <button
      type="button"
      onClick={regeneratePreview}
      className="
        p-1 rounded-md
        text-gray-400 dark:text-white/40
        hover:text-indigo-500
        hover:bg-indigo-500/10
        cursor-pointer transition
      "
      title="Generate new suggestion"
    >
      ⟳
    </button>
  </div>
)}
      </div>

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => applySuggestion(s)}
              className="
                text-xs px-2 py-1 rounded-md
                bg-amber-500/10
                border border-amber-500/15
                text-amber-500
                hover:bg-amber-500/20
                transition cursor-pointer
              "
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}