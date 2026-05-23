import { useParams } from "react-router-dom";
import { useState } from "react";
import { linkService } from "../../services/linkService";
import { API_URL } from "../../config/api";

export function LinkPasswordPage() {
  const { code } = useParams();
  if (!code) return null;

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    console.log('Submit hit');
    const res = await linkService.checkPassword(code, password);

    if (!res.success) {
        setError(res.error);
    }
    else {
      window.location.href = `${API_URL}/r/${code}`;
    }

    console.log('GFInishged')
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0f]">
      <div className="w-full max-w-sm p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">

        <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Protected Link
        </h1>

        <p className="text-sm text-gray-400 dark:text-white/40 mb-4">
          Enter password to continue
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white outline-none"
        />

        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 px-3 py-2 rounded-lg cursor-pointer
           bg-indigo-500 text-white text-sm
            font-medium hover:bg-indigo-600 transition"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </div>
    </div>
  );
}