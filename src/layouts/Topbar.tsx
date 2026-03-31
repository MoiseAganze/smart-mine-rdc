import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Dropdown } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Topbar() {
  const { notificationCount } = useAppStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
    : "??";

  const userMenuItems = [
    {
      label: "Mon profil",
      icon: <User className="h-4 w-4" />,
      onClick: () => navigate("/settings"),
    },
    {
      label: "Paramètres",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => navigate("/settings"),
    },
    { separator: true, label: "", onClick: () => {} },
    {
      label: "Déconnexion",
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
      variant: "danger" as const,
    },
  ];

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-xl px-4 shrink-0">
      {/* Search */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-slate-800/60 px-3 py-1.5 transition-all duration-200 w-64",
          searchFocused ? "border-primary-500/60 w-80" : "border-slate-700/60",
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        <input
          type="text"
          placeholder="Rechercher transport, acteur..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none min-w-0"
        />
        <kbd className="hidden sm:flex h-5 items-center rounded border border-slate-700 bg-slate-800 px-1.5 text-[10px] text-slate-500 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-success-600/30 bg-success-600/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success-500 pulse-dot" />
          <span className="text-[11px] font-medium text-success-400">
            Temps réel
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700/60 hover:text-slate-100 transition-colors cursor-pointer">
            <Bell className="h-4 w-4" />
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger-600 text-[9px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </div>

        {/* User menu */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-700/60 transition-colors cursor-pointer">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white shrink-0">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-slate-200 leading-none">
                  {user?.name.split(" ").slice(0, 2).join(" ") ?? "—"}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 capitalize">
                  {user?.role ?? "—"}
                </p>
              </div>
              <ChevronDown className="hidden md:block h-3 w-3 text-slate-500" />
            </div>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
}

export function TopbarBreadcrumb({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          <span
            className={
              i === items.length - 1 ? "text-slate-300 font-medium" : ""
            }
          >
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}
