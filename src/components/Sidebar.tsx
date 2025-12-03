// Sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { FiMessageCircle, FiSettings } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { RiWallet3Line } from "react-icons/ri";
import { TbChartBar } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  { title: "Chat", icon: FiMessageCircle, path: "/chat" },
  { title: "My Wallets", icon: RiWallet3Line, path: "/wallets" },
  { title: "Market Analysis", icon: TbChartBar, path: "/market" },
  { title: "Settings", icon: FiSettings, path: "/settings" },
];

export default function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/10 sm:w-64">
      <SidebarContent className="bg-[#111111]">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <NavLink to="/dashboard" className="flex items-center">
            <h1 className="text-xl font-semibold text-white">BlockAI</h1>
          </NavLink>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-[#0cff9b]/20 text-[#0cff9b] font-semibold"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-base font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
