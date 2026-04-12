import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Map,
  Users,
  Cpu,
  AlertTriangle,
  BarChart3,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mountain,
  Shield,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

const navItems = [
  { path: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { path: "/transports", label: "Transports", icon: Truck },
  { path: "/map", label: "Carte en direct", icon: Map },
  { path: "/actors", label: "Acteurs", icon: Users },
  { path: "/equipment", label: "Équipements", icon: Cpu },
  { path: "/alerts", label: "Alertes & Anomalies", icon: AlertTriangle },
  { path: "/reports", label: "Rapports & Analyses", icon: BarChart3 },
  { path: "/audit", label: "Journaux d'audit", icon: ScrollText },
  { path: "/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "sidebar-transition relative flex h-screen flex-col border-r border-slate-700/60 bg-slate-900/95 backdrop-blur-xl shrink-0",
        sidebarCollapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-slate-700/60 px-4 py-4",
          sidebarCollapsed ? "justify-center" : "gap-3",
        )}
      >
        <div className="flex shrink-0 items-center justify-center rounded-lg">
          <img src="/logo.png" alt="Logo" className="w-32" />
        </div>
        {/* {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-100 leading-none">
              SMART MINE
            </p>
            <p className="text-[10px] font-medium text-primary-400 tracking-widest mt-0.5">
              RDC
            </p>
          </div>
        )} */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive =
            path === "/" ? pathname === "/" : pathname.startsWith(path);
          const link = (
            <NavLink
              to={path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                sidebarCollapsed ? "justify-center" : "",
                isActive
                  ? "bg-primary-600/20 text-primary-300 border border-primary-600/30"
                  : "text-slate-400 hover:bg-slate-700/40 hover:text-slate-100 border border-transparent",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-primary-400" : "",
                )}
              />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          );
          return sidebarCollapsed ? (
            <Tooltip key={path} content={label} side="right">
              {link}
            </Tooltip>
          ) : (
            <div key={path}>{link}</div>
          );
        })}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="border-t border-slate-700/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-success-500" />
            <p className="text-[10px] text-slate-500">
              Système sécurisé · v2.4.1
            </p>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer shadow-md"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}
