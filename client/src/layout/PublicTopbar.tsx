import { useTheme } from "../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";

export function PublicTopbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="
      w-full h-14 sticky top-0 z-10
      flex items-center justify-between px-4 md:px-6
      bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md
      border-b border-gray-200 dark:border-white/10
      transition-colors
    ">

      {/* Logo */}
      <div className="flex items-center">
        <div className="
          flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-indigo-500/10 dark:bg-indigo-500/15
          border border-indigo-500/20 dark:border-indigo-500/25
        ">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />

          <button
            className="
              text-sm font-medium tracking-tight
              text-indigo-600 dark:text-indigo-400
              cursor-default
            "
            onClick={() => navigate("/")}
          >
            Linksy
          </button>
        </div>
      </div>


      <div className="flex items-center gap-2">

        <button
          onClick={() => navigate("/login")}
          className="
            px-3 py-1.5 rounded-lg text-sm
            text-gray-900
            dark:text-white font-medium
            bg-gray-100 hover:bg-gray-200
            dark:bg-gray-800 dark:hover:bg-gray-700
            transition cursor-pointer
          "
        >
          Log in
        </button>


        <button
          onClick={() => navigate("/register")}
          className="
            px-3 py-1.5 rounded-lg
            bg-indigo-600 hover:bg-indigo-500
            text-white text-sm font-medium
            transition cursor-pointer
          "
        >
          Sign up
        </button>


        <button
          onClick={toggleTheme}
          className="
            w-8 h-8 flex items-center justify-center rounded-lg
            bg-gray-100 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            hover:bg-gray-200 dark:hover:bg-white/10
            transition cursor-pointer
          "
        >
          {theme === "dark" ? (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5l1.5-1.5M11 5l1.5-1.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

      </div>

    </header>
  );
}