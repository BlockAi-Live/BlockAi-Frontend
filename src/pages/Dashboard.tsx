import React, { useState } from "react";
import { MessageCircle, Send, Mic, User, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function DashboardPage() {
  const handleLogout = () => {
    window.location.href = "/home";
  };

  return (
    <div className="flex h-screen bg-[#0d0f18] text-white font-inter">
      {/* Main */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Search bar + profile */}
        <div className="flex items-center justify-between mb-12">
          <input
            placeholder="Search..."
            className="w-full max-w-xl bg-transparent border border-[#4c4b5f] rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#7647ff]"
          />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 rounded-full p-0 ml-4"
              >
                <Avatar className="h-12 w-12 border-2 border-border">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full z-0"></div>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-2" align="end">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer p-3 text-base flex items-center"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Assistance + Stats */}
<div className="flex items-start gap-8 mb-6"> {/* reduced gap and margin-bottom */}
  {/* Assist Card */}
  <div className="bg-[#16361f] rounded-xl p-6 w-[420px] shadow-xl">
    <h3 className="text-lg font-semibold mb-2">Ask AI Assistance</h3>
    <p className="text-white/70 text-sm mb-4">
      Analyze a token, check wallet, or ask about market trends.
    </p>
    <button className="bg-[#0cff9b] text-black px-4 py-1 rounded-md text-xs font-semibold">
      Start Chat
    </button>
  </div>

  {/* Right Stats Stacked Diagonal */}
  <div className="relative w-72 h-80"> {/* reduced height */}
    <div className="absolute top-0 left-0">
      <StatCard label="Wallets" value="03" trend="up" />
    </div>
    <div className="absolute top-20 left-16"> {/* closer vertical spacing */}
      <StatCard label="Alerts" value="12" trend="up" />
    </div>
    <div className="absolute top-36 left-32"> {/* closer vertical spacing */}
      <StatCard label="Gas" value="15 gwei" trend="down" />
    </div>
  </div>
</div>

{/* Recent Activity */}
<h3 className="text-xl font-semibold mb-2 text-white/80">Recent Activity</h3> {/* reduced mb */}
<div className="space-y-3 text-white/70"> {/* reduced vertical spacing */}
  <div>
    Analyzed ETH Wallet... <span className="text-white/50 italic">2 mins ago</span>
    <div className="border-b border-white/10 mt-1"></div>
  </div>
  <div>
    Chatted about Solana... <span className="text-white/50 italic">1 hour ago</span>
    <div className="border-b border-white/10 mt-1"></div>
  </div>
</div>
     </main>
    </div>
  );
}

// Stat Card
function StatCard({ label, value, trend }: { label: string; value: string; trend: "up" | "down" }) {
  return (
    <div className="bg-[#1a1f21] rounded-xl p-4 w-36 shadow-lg relative">
      <div className="text-white/60 text-xs mb-1 flex items-center gap-1">
        {label}
        {trend === "up" ? (
          <span className="text-green-400">▲</span>
        ) : (
          <span className="text-red-400">▼</span>
        )}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}