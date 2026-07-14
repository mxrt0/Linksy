import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";

export function LinkNotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0f] px-6">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-7 text-center">

        <div className="text-5xl mb-5">🔍</div>

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Link not found
        </h1>

        <p className="mt-3 text-sm text-gray-500 dark:text-white/50">
          This short link doesn't exist or may have been deleted.
        </p>

        <button
          onClick={() => user ? navigate("/") : navigate("/dashboard")}
          className="mt-5
            px-3 py-1.5 rounded-lg
            bg-indigo-600 hover:bg-indigo-500
            text-white text-lg font-medium
            transition cursor-pointer
          "
        >
          { user ? "Go to Dashboard" : "Back Home" }
        </button>
      </div>
    </div>
  );
}