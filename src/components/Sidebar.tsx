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
  CaretRight
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

const menuItems = [
  { title: "Dashboard", icon: SquaresFour, path: "/dashboard" },
  { title: "Chat", icon: ChatCircleDots, path: "/chat" },
  { title: "Wallets", icon: Wallet, path: "/wallets" },
  { title: "Market Analysis", icon: ChartBar, path: "/market" },
  { title: "Network", icon: Users, path: "/referrals" },
  { title: "Settings", icon: Gear, path: "/settings" },
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

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-[#0d0f18]">
      <div className="flex h-full flex-col bg-[#0d0f18] border-r border-white/5 transition-all duration-300">
        
        {/* --- HEADER --- */}
        <SidebarHeader className={`h-20 flex items-center border-b border-white/5 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
          <NavLink to="/" className={`flex items-center transition-all duration-300 ${isCollapsed ? "justify-center" : "gap-3"}`}>
            <img src="/blockai.svg" alt="BlockAI" className="w-8 h-8 shrink-0" />
            <div className={`flex flex-col transition-all duration-300 overflow-hidden ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
                <span className="text-lg font-bold text-white tracking-wide whitespace-nowrap">BLOCKAI</span>
            </div>
          </NavLink>
        </SidebarHeader>

        {/* --- NAVIGATION --- */}
        <SidebarContent className="px-3 py-6 flex-1 overflow-visible">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setOpenMobile(false)}
                  className={({ isActive }) => `
                    relative flex items-center h-[48px] rounded-lg transition-all duration-200 group
                    ${isCollapsed ? "justify-center px-0" : "px-4 gap-3"}
                    ${isActive 
                        ? "bg-white text-black font-bold shadow-lg shadow-white/5" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                    {/* Icon */}
                    <item.icon 
                        weight={isActive ? "fill" : "regular"} 
                        size={20} 
                        className={`shrink-0 transition-colors ${isActive ? "text-black" : "text-gray-500 group-hover:text-white"}`} 
                    />

                    {/* Label */}
                    {!isCollapsed && (
                         <span className="text-sm shadow-none">
                            {item.title}
                        </span>
                    )}
                </NavLink>
              );
            })}
          </div>
        </SidebarContent>

        {/* --- FOOTER (PROFILE) --- */}
        <SidebarFooter className="p-4 bg-[#0d0f18] border-t border-white/5">
            {!isCollapsed ? (
                <div className="p-3 rounded-xl bg-[#13151C]/50 border border-white/5 transition-all w-full">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#14F195] to-[#9945FF] p-[1px]">
                             <div className="w-full h-full rounded-full bg-[#13151C] flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white">{user?.fullName?.substring(0,2).toUpperCase() || "US"}</span>
                             </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{user?.fullName || "User"}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#14F195]" />
                                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wide">Pro Plan</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full py-1.5 flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                        <SignOut size={14} /> Log Out
                    </button>
                </div>
            ) : (
                 <button 
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors mx-auto"
                >
                    <SignOut size={20} />
                </button>
            )}
        </SidebarFooter>

      </div>
      <SidebarRail />
    </Sidebar>
  );
}
