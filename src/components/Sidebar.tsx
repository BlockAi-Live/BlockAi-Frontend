// Sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  SquaresFour, 
  ChatCircleDots, 
  Wallet, 
  ChartBar, 
  Users, 
  Gear, 
  SignOut 
} from "@phosphor-icons/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { title: "Dashboard", icon: SquaresFour, path: "/dashboard" },
  { title: "Chat", icon: ChatCircleDots, path: "/chat" },
  { title: "Wallets", icon: Wallet, path: "/wallets" },
  { title: "Market Analysis", icon: ChartBar, path: "/market" },
  { title: "Network", icon: Users, path: "/referrals" },
  { title: "Settings", icon: Gear, path: "/settings" },
];

export default function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-[#0d0f18]">
      <div className="flex h-full flex-col bg-[#13151C] border-r border-white/5 transition-all duration-300">
        
        {/* Header with Logo */}
        <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/5">
          <NavLink to="/" className="flex items-center gap-3 overflow-hidden px-2">
            <img src="/blockai.svg" alt="BlockAI" className="w-8 h-8 shrink-0" />
            <div className={`text-white font-bold text-lg tracking-wide transition-all duration-300 ${state === "collapsed" ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              BLOCKAI
            </div>
          </NavLink>
        </SidebarHeader>

        <SidebarContent className="px-3 py-6">
          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className="h-auto py-1 hover:bg-transparent">
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative w-full overflow-hidden ${
                            isActive
                              ? "bg-gradient-to-r from-[#14F195]/10 to-[#9B59B6]/10 text-white shadow-inner border border-white/5"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Active Side Indicator */}
                            {isActive && state !== "collapsed" && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#14F195] to-[#9B59B6] rounded-r-full" />
                            )}
                            
                             {/* Icon */}
                            <item.icon weight={isActive ? "duotone" : "regular"} className={`w-5 h-5 transition-colors duration-300 shrink-0 ${isActive ? "text-[#14F195]" : "text-gray-500 group-hover:text-white"}`} />
                            
                            {/* Label */}
                            <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${state === "collapsed" ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                              {item.title}
                            </span>
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-3 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-red-400 transition-colors w-full rounded-xl hover:bg-red-500/10 group overflow-hidden ${state === "collapsed" ? "justify-center" : ""}`}
          >
            <SignOut weight="duotone" className="w-5 h-5 shrink-0" />
            <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${state === "collapsed" ? "w-0 opacity-0" : "w-auto opacity-100"}`}>Log Out</span>
          </button>
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
