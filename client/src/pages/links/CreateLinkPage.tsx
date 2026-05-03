import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EXPIRY_OPTIONS, type Expiry } from "../../types/link/Expiry";
import { linkService } from "../../services/linkService";

export function CreateLinkPage() {
  const navigate = useNavigate();

  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [expiry, setExpiry] = useState<Expiry>("never");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const isDisabled = !originalUrl.trim() || isLoading;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setErrors([]);
    setIsLoading(true);

    try {
      await linkService.create({
        originalUrl: originalUrl.trim(),
        shortCode: shortCode.trim() || undefined,
        expiry,
      });

      navigate("/dashboard", { replace: true });

    } catch (err: unknown) {
      if (Array.isArray(err)) setErrors(err);
      else if (err instanceof Error) setErrors([err.message]);
      else setErrors(["Something went wrong. Please try again."]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090f] transition-colors px-4 md:px-6 py-8">
      <div className="max-w-xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="
            inline-flex items-center gap-1.5 mb-8
            text-sm text-gray-500 dark:text-white/40
            hover:text-gray-700 dark:hover:text-white/70
            cursor-pointer transition
          "
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          Back to links
        </button>

        {/* Hero */}
        <div className="mb-7">
          <p className="text-[11px] uppercase tracking-widest text-indigo-500 
          dark:text-indigo-400 mb-2 font-medium cursor-default">
            New link
          </p>

          <h1 className="text-3xl font-semibold cursor-default tracking-tight text-gray-900 dark:text-white leading-tight">
            Shorten a URL,{" "}
            <span className="text-gray-400 dark:text-white/35 cursor-default">
              make it yours.
            </span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6">

          <form onSubmit={handleSubmit}>

            {/* Destination URL */}
            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35 mb-2">
                Destination URL
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className="
                  w-full px-3 py-2.5 rounded-xl
                  bg-gray-50 dark:bg-white/5
                  border border-gray-200 dark:border-white/10
                  text-gray-900 dark:text-white
                  text-sm
                  placeholder:text-gray-400 dark:placeholder:text-white/20
                  outline-none
                  focus:border-indigo-500/60
                  focus:bg-indigo-500/5
                  transition
                "
              />
            </div>

            {/* Optional section */}
            <div className="border-t border-gray-200 dark:border-white/10 my-5" />

            <p className="text-[10px] uppercase cursor-default tracking-widest text-gray-400 dark:text-white/20 mb-4">
              Customise (optional)
            </p>

            {/* Custom short code */}
            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35 mb-2">
                Custom short code
              </label>

              <div
                className="
                  flex items-center overflow-hidden rounded-xl
                  border border-gray-200 dark:border-white/10
                  bg-gray-50 dark:bg-white/5
                  focus-within:border-indigo-500/60
                  focus-within:bg-indigo-500/5
                  transition
                "
              >
                <span
                  className="
                    px-3 py-2.5 whitespace-nowrap select-none
                    text-sm text-gray-400 dark:text-white/25
                    border-r border-gray-200 dark:border-white/10
                  "
                >
                  lnky.io /
                </span>

                <input
                  type="text"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  placeholder="my-link"
                  className="
                    flex-1 px-3 py-2.5 bg-transparent
                    text-sm font-mono
                    text-gray-900 dark:text-white
                    placeholder:text-gray-400 dark:placeholder:text-white/20
                    outline-none
                  "
                />
              </div>

              <p className="text-[11px] cursor-default text-gray-400 dark:text-white/20 mt-1.5">
                Leave empty to generate a random code
              </p>
            </div>

            {/* Expiry */}
            <div className="mb-6">
              <label className="block text-[11px] uppercase tracking-widest text-gray-500 dark:text-white/35 mb-2">
                Link expiry
              </label>

              <div className="flex gap-2 flex-wrap">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setExpiry(opt.value)}
                    className={`
                      px-4 py-1.5 rounded-full border
                      text-xs cursor-pointer font-medium transition
                      ${
                        expiry === opt.value
                          ? `
                            bg-indigo-500/15
                            border-indigo-500/30
                            text-indigo-600 dark:text-indigo-400
                          `
                          : `
                            bg-white dark:bg-white/5
                            border-gray-200 dark:border-white/10
                            text-gray-500 dark:text-white/40
                            hover:border-gray-300 dark:hover:border-white/15
                            hover:text-gray-700 dark:hover:text-white/70
                          `
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {errors.map((err, i) => (
                  <p
                    key={i}
                    className="text-sm text-red-500 dark:text-red-400"
                  >
                    {err}
                  </p>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2.5">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="
                  flex-1 py-2.5 rounded-xl
                  bg-white dark:bg-white/5
                  border border-gray-200 dark:border-white/10
                  text-sm font-medium cursor-pointer
                  text-gray-600 dark:text-white/50
                  hover:bg-gray-50 dark:hover:bg-white/10
                  hover:text-gray-800 dark:hover:text-white/75
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isDisabled}
                className="
                  flex-2 py-2.5 rounded-xl
                  bg-indigo-600 hover:bg-indigo-500
                  text-white text-sm font-medium
                  transition cursor-pointer
                  shadow-lg shadow-indigo-500/20
                  dark:shadow-indigo-500/15
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  disabled:shadow-none
                  flex items-center justify-center gap-2
                "
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="13"
                      height="13"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <circle
                        cx="7"
                        cy="7"
                        r="5.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeDasharray="8 8"
                      />
                    </svg>

                    Creating...
                  </>
                ) : (
                  <>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1v10M1 6h10"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    Create link
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}