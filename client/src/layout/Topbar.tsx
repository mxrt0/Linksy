import { useRef, useState } from "react";
import { useAuth } from "../hooks/auth/useAuth";
import { useTheme } from "../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "../hooks/topbar/useClickOutside";

interface TopbarProps {
  onCreateClick?: () => void;
}

export function Topbar({ onCreateClick }: TopbarProps) {
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
    <header className="w-full h-14 border-b border-white/10 bg-[#0a0a0f] flex items-center justify-between px-4 md:px-6">

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">L</span>
        </div>
        <span className="text-white font-semibold tracking-tight">
          Linksy
        </span>
      </div>

      <div className="flex items-center gap-2">

        {onCreateClick && (
            <button
            onClick={onCreateClick}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
            >
            New link
            </button>
        )}

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer 
          bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full cursor-pointer bg-white/10 border border-white/10 flex 
            items-center justify-center text-white text-sm hover:scale-105"
          >
            {user.username[0].toUpperCase()}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#111118] border border-white/10 rounded-lg shadow-lg overflow-hidden">
              <div className="px-3 py-2 text-xs text-white/50 border-b border-white/10">
                {user.username}
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}