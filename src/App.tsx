// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/Sidebar"; // your new sidebar
// import ProfileBar from "./components/ProfileBar";

import Home from "./pages/Home";
import { DashboardPage } from "./pages/Dashboard";
import Chat from "./pages/Chat";
import { WalletsPage } from "./pages/Wallets";

const Market = () => <div className="p-6 text-white">Market Analysis</div>;
const Settings = () => <div className="p-6 text-white">Settings</div>;

// Layout with toggleable sidebar
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-black text-white">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-3 border-b border-white/10">
            {/* Sidebar toggle button */}
            <SidebarTrigger className="text-white" />
            {/* <ProfileBar /> */}
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Dashboard & other pages */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <MainLayout>
              <Chat />
            </MainLayout>
          }
        />
        <Route
          path="/wallets"
          element={
            <MainLayout>
              <WalletsPage />
            </MainLayout>
          }
        />
        <Route
          path="/market"
          element={
            <MainLayout>
              <Market />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
