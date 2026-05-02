import { useRef, useState } from "react";
import { useAuth } from "../hooks/auth/useAuth";
import { useTheme } from "../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "../hooks/topbar/useClickOutside";

export function Topbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false));

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

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
          <span className="
            text-sm font-medium tracking-tight
            text-indigo-600 dark:text-indigo-400 cursor-default
          ">
            Linksy
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* Create button */}
        
        <button
          onClick={() => navigate('/links/new')}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-indigo-600 hover:bg-indigo-500
            text-white text-sm font-medium transition cursor-pointer
          "
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1v8M1 5h8"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          New link
        </button>
        

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="
            w-8 h-8 flex items-center justify-center rounded-lg
            bg-gray-100 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            hover:bg-gray-200 dark:hover:bg-white/10
            transition text-gray-600 dark:text-white/60 cursor-pointer
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

        {/* Avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              w-8 h-8 rounded-full flex items-center justify-center
              bg-indigo-500/10 dark:bg-indigo-500/20
              border border-indigo-500/20 dark:border-indigo-500/30
              text-indigo-600 dark:text-indigo-400 text-xs font-semibold
              hover:scale-105 transition cursor-pointer
            "
          >
            {user.username[0].toUpperCase()}
          </button>

          {menuOpen && (
            <div className="
              absolute right-0 mt-2 w-44 rounded-xl shadow-xl overflow-hidden z-50
              bg-white dark:bg-[#111118]
              border border-gray-200 dark:border-white/10
            ">

              <div className="
                px-3 py-2.5 text-xs
                text-gray-500 dark:text-white/40
                border-b border-gray-200 dark:border-white/10
                ">
                {user.username}
              </div>

              <button
                onClick={handleLogout}
                className="
                  w-full text-left px-3 py-2.5 text-sm
                  text-red-500 dark:text-red-400
                  hover:bg-gray-50 dark:hover:bg-white/5
                  transition cursor-pointer
                "
              >
                Log out
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}