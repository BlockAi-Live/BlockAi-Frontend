// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/Sidebar"; // your new sidebar
import ProtectedRoute from "./components/ProtectedRoute";
// import ProfileBar from "./components/ProfileBar";

import Home from "./pages/Home";
import About from "./pages/About";
import { DashboardPage } from "./pages/Dashboard";
import Chat from "./pages/Chat";
import { WalletsPage } from "./pages/Wallets";
import { ReferralsPage } from "./pages/Referrals";
import { SignUpPage } from "./pages/SignUp";
import { SignInPage } from "./pages/SignIn";
import { MarketAnalysisPage } from "./pages/MarketAnalysis";
import { SettingsPage } from "./pages/Settings";
import { Toaster } from "@/components/ui/toaster";

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
      <Toaster />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<About />} />

        {/* Auth Pages */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/login" element={<Navigate to="/signin" replace />} />

        {/* Dashboard & other pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Chat />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallets"
          element={
            <ProtectedRoute>
              <MainLayout>
                <WalletsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ReferralsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MarketAnalysisPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
