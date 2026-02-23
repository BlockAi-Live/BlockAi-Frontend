"use client";

import React from "react";
import { 
  SquaresFour, 
  ChatCircleDots, 
  Wallet, 
  ChartBar, 
  Users, 
  Gear, 
  SignOut,
  FileCode,
  PaintBrush,
  Detective,
  Bell,
  Sparkle,
  Lightning,
} from "@phosphor-icons/react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  icon: typeof SquaresFour;
  path: string;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: SquaresFour, path: "/dashboard" },
      { title: "Market", icon: ChartBar, path: "/market" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { title: "Chat", icon: ChatCircleDots, path: "/chat" },
      { title: "Smart Contracts", icon: FileCode, path: "/smart-contracts" },
      { title: "NFT Generator", icon: PaintBrush, path: "/nft" },
      { title: "Chain Scanner", icon: Detective, path: "/wallet-intel" },
      { title: "Smart Alerts", icon: Bell, path: "/alerts", badge: "New", badgeColor: "#14F195" },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Wallets", icon: Wallet, path: "/wallets" },
      { title: "Network", icon: Users, path: "/referrals" },
      { title: "Settings", icon: Gear, path: "/settings" },
    ],
  },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed" && !isMobile;

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const points = user?.points || 0;

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-[#0a0c14]">
      <div className="flex h-full flex-col bg-[#0a0c14] border-r border-white/[0.04] transition-all duration-300">
        
        {/* --- HEADER --- */}
        <SidebarHeader className={`h-16 flex items-center border-b border-white/[0.04] transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-5"}`}>
          <NavLink to="/" className={`flex items-center transition-all duration-300 ${isCollapsed ? "justify-center" : "gap-2.5"}`}>
            <div className="relative">
              <img src="/blockai.svg" alt="BlockAI" className="w-7 h-7 shrink-0" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#14F195] border-2 border-[#0a0c14]" />
            </div>
            <div className={`flex flex-col transition-all duration-300 overflow-hidden ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
                <span className="text-sm font-bold text-white tracking-widest whitespace-nowrap">BLOCKAI</span>
                <span className="text-[9px] text-neutral-600 font-medium tracking-wider -mt-0.5">INTELLIGENCE</span>
            </div>
          </NavLink>
        </SidebarHeader>

        {/* --- NAVIGATION --- */}
        <SidebarContent className="px-2.5 py-3 flex-1 overflow-y-auto overflow-x-hidden
          [&::-webkit-scrollbar]:w-0
        ">
          {navSections.map((section, sIdx) => (
            <div key={section.label} className={sIdx > 0 ? "mt-4" : ""}>
              {/* Section label */}
              {!isCollapsed && (
                <div className="px-3 mb-2 flex items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-700">
                    {section.label}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.03]" />
                </div>
              )}
              {isCollapsed && sIdx > 0 && (
                <div className="mx-3 mb-2.5 mt-1 border-t border-white/[0.04]" />
              )}

              {/* Nav items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => isMobile && setOpenMobile(false)}
                      className={`
                        relative flex items-center h-[38px] rounded-xl transition-all duration-200 group
                        ${isCollapsed ? "justify-center px-0 mx-0.5" : "px-3 gap-2.5"}
                        ${isActive 
                            ? "bg-white/[0.06] text-white" 
                            : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.025]"
                        }
                      `}
                    >
                        {/* Active glow */}
                        {isActive && !isCollapsed && (
                          <div className="absolute inset-0 rounded-xl bg-[#14F195]/[0.03] pointer-events-none" />
                        )}

                        {/* Active indicator bar */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-4 rounded-r-full bg-[#14F195] shadow-[0_0_8px_rgba(20,241,149,0.4)]" />
                        )}

                        {/* Icon */}
                        <item.icon 
                            weight={isActive ? "fill" : "regular"} 
                            size={17} 
                            className={`shrink-0 transition-all duration-200 ${isActive ? "text-[#14F195]" : "text-neutral-600 group-hover:text-neutral-400"}`} 
                        />

                        {/* Label */}
                        {!isCollapsed && (
                          <span className={`text-[13px] flex-1 transition-colors duration-200 ${isActive ? "font-semibold" : "font-medium"}`}>
                            {item.title}
                          </span>
                        )}

                        {/* Badge */}
                        {!isCollapsed && item.badge && (
                          <span 
                            className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded-md"
                            style={{ 
                              backgroundColor: `${item.badgeColor || '#14F195'}12`,
                              color: item.badgeColor || '#14F195',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </SidebarContent>

        {/* --- FOOTER --- */}
        <SidebarFooter className="p-2.5 bg-[#0a0c14] border-t border-white/[0.04]">
            {!isCollapsed ? (
                <div className="space-y-2.5">
                    {/* Points bar */}
                    <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Lightning size={11} weight="fill" className="text-[#F59E0B]" />
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Points</span>
                        </div>
                        <span className="text-[11px] font-bold text-white font-mono">{points.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF] transition-all duration-500"
                          style={{ width: `${Math.min((points / 500) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* User card */}
                    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/[0.02] transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14F195]/20 to-[#9945FF]/20 border border-white/[0.06] flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{user?.fullName?.substring(0,2).toUpperCase() || "US"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[12px] font-semibold text-neutral-300 truncate">{user?.fullName || "User"}</h4>
                            <span className="text-[10px] text-neutral-600 truncate block">{user?.email || ""}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-1.5 rounded-lg text-neutral-700 hover:text-red-400 hover:bg-red-400/5 transition-colors opacity-0 group-hover:opacity-100"
                            title="Log out"
                        >
                            <SignOut size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14F195]/20 to-[#9945FF]/20 border border-white/[0.06] flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">{user?.fullName?.substring(0,2).toUpperCase() || "US"}</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                    >
                        <SignOut size={15} />
                    </button>
                </div>
            )}
        </SidebarFooter>

      </div>
      <SidebarRail />
    </Sidebar>
  );
}
