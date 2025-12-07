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
} from "@/components/ui/sidebar";
import { FiMessageCircle, FiSettings, FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { RiWallet3Line } from "react-icons/ri";
import { TbChartBar } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  { title: "Chat", icon: FiMessageCircle, path: "/chat" },
  { title: "My Wallets", icon: RiWallet3Line, path: "/wallets" },
  { title: "Referrals", icon: FiUsers, path: "/referrals" },
  { title: "Market Analysis", icon: TbChartBar, path: "/market" },
  { title: "Settings", icon: FiSettings, path: "/settings" },
];

export default function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/5 bg-[#0B0E1A]/95 backdrop-blur-xl transition-all duration-300">
      
      {/* Header with Logo */}
      <SidebarHeader className="p-6 pb-2">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/blockai.svg" alt="BlockAI" className="w-10 h-10" />
          <div className="text-white font-bold text-xl">BLOCKAI</div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto py-1">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          isActive
                            ? "bg-gradient-to-r from-[#14F195]/10 to-[#9B59B6]/10 text-white shadow-inner border border-white/5"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#14F195] to-[#9B59B6] rounded-r-full" />
                          )}
                          <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? "text-[#14F195]" : "group-hover:text-white"}`} />
                          <span className={`text-sm font-medium transition-all duration-300 ${isActive ? "translate-x-1" : ""}`}>
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
      <SidebarFooter className="p-4">
        <button className="mt-4 flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors w-full rounded-xl hover:bg-red-500/10 group">
          <FiLogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
