import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ApiError } from "../../types/auth/ApiError";
import { useAuth } from "../../hooks/auth/useAuth";

export function LoginPage() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastErrorRef = useRef<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setErrors([]);
  }, []);

  const isDisabled =
    !form.email || !form.password || isLoading;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors([]);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard", { replace: true });

    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";
      if (err instanceof ApiError) message = err.errors.join("\n");
      else if (err instanceof Error) message = err.message;

      if (message !== lastErrorRef.current) {
        lastErrorRef.current = message;
        setErrors([message]);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-indigo-500 focus:bg-indigo-500/10 transition";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/3 border border-white/10 rounded-2xl p-8">

        <div className="flex items-center gap-2 mb-7">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h6M6 4l3 3-3 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Linksy
          </span>
        </div>

        <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-white/40 text-sm mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className={inputBase}
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className={inputBase}
            />
          </div>

          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
              {errors.map((err, i) => (
                <p key={i} className="text-red-400 text-sm text-center">
                  {err}
                </p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full mt-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="border-t border-white/[0.07] mt-6 pt-5">
          <p className="text-center text-white/35 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 transition"
            >
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}