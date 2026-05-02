import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ApiError } from "../../types/auth/ApiError";
import { useAuth } from "../../hooks/auth/useAuth";

export function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastErrorRef = useRef<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setErrors([]);
  }, []);

  useEffect(() => {
    if (!confirmTouched) return;

    const mismatch =
      form.confirmPassword.length > 0 &&
      form.password !== form.confirmPassword;

    const newError = mismatch ? "Passwords do not match" : "";

    if (newError !== lastErrorRef.current) {
      lastErrorRef.current = newError;
      setErrors(newError ? [newError] : []);
    }
  }, [form.password, form.confirmPassword, confirmTouched]);

  const isMismatch =
    confirmTouched &&
    form.confirmPassword.length > 0 &&
    form.password !== form.confirmPassword;

  const isDisabled =
    !form.username || !form.email || !form.password || isMismatch || isLoading;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }
    setIsLoading(true);
    setErrors([]);
    try {
      await register({
        username: form.username.trim(),
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
          <span className="text-white font-semibold text-lg tracking-tight">Linksy</span>
        </div>

        <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">Create an account</h1>
        <p className="text-white/40 text-sm mb-6">Start shortening links in seconds</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">Username</label>
            <input
              type="text"
              autoComplete="off"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={inputBase}
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              placeholder="martin@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputBase}
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputBase}
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              disabled={!form.password}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              onBlur={() => setConfirmTouched(true)}
              className={`${inputBase} ${isMismatch ? "border-red-500/60 bg-red-500/5" : ""} ${!form.password ? "opacity-40 cursor-not-allowed" : ""}`}
            />
            {isMismatch && (
              <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>
            )}
          </div>

          {errors.filter((e) => e !== "Passwords do not match").length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
              {errors
                .filter((e) => e !== "Passwords do not match")
                .map((err, i) => (
                  <p key={i} className="text-red-400 text-sm text-center">{err}</p>
                ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full mt-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>

        </form>

        <div className="border-t border-white/[0.07] mt-6 pt-5">
          <p className="text-center text-white/35 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}