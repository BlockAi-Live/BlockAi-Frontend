// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/Sidebar"; // your new sidebar
import ProtectedRoute from "./components/ProtectedRoute";
// import ProfileBar from "./components/ProfileBar";

import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import { DashboardPage } from "./pages/Dashboard";
import Chat from "./pages/Chat";
import { WalletsPage } from "./pages/Wallets";
import { ReferralsPage } from "./pages/Referrals";
import { SignUpPage } from "./pages/SignUp";
import { SignInPage } from "./pages/SignIn";
import MarketAnalysisPage from "./pages/MarketAnalysis";
import { SettingsPage } from "./pages/Settings";
import { Toaster } from "@/components/ui/toaster";
import AuthSuccess from "./pages/AuthSuccess";

// Layout with toggleable sidebar
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#0d0f18] text-white overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col relative h-full overflow-hidden">
          {/* Floating Sidebar Toggle - Positioned absolutely to not take layout space */}
          <div className="absolute top-4 left-4 z-50">
             <SidebarTrigger className="text-gray-400 hover:text-white bg-[#13151C]/50 hover:bg-[#13151C] backdrop-blur-md border border-white/5 rounded-full w-8 h-8 transition-all duration-200" />
          </div>

          <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative">
             {children}
          </main>
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
        <Route path="/team" element={<Team />} />

        {/* Auth Pages */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
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
