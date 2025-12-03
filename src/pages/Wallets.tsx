import React from "react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

export function WalletsPage() {
  const handleLogout = () => {
    window.location.href = "/home";
  };

  return (
    <div className="flex h-screen bg-[#0d0f18] text-white font-inter">
      {/* Main Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Search + Profile */}
        <div className="flex items-center justify-between mb-10">
          <input
            placeholder="Search..."
            className="w-full max-w-xl bg-transparent border border-[#4c4b5f] rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#7647ff]"
          />

          {/* Profile Dropdown */}
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full p-0"
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
        </div>

        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Tracked Wallets</h2>
          <button className="bg-[#7647ff] px-4 py-2 rounded-md text-sm font-medium">
            + Add Wallet
          </button>
        </div>

        {/* Net Worth Card */}
        <div className="bg-[#1c1f2b] rounded-xl p-6 flex items-center justify-between mb-10">
          <div className="text-white/60">Total Net Worth</div>
          <div className="text-4xl font-bold">$142,050.23</div>
          <div className="text-green-400 text-xl font-semibold">+ 12.5%</div>
        </div>

        {/* Wallet Table */}
        <table className="w-full text-sm">
          <thead className="text-white/60">
            <tr className="text-left">
              <th className="pb-4">Wallet Name</th>
              <th className="pb-4">Address</th>
              <th className="pb-4">Balance</th>
              <th className="pb-4">24h Change</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>

          <tbody className="space-y-4">
            {walletRows.map((w, i) => (
              <tr
                key={i}
                className="bg-[#1a1d27] rounded-lg overflow-hidden h-14"
              >
                <td className="px-4">{w.name}</td>
                <td className="px-4 text-white/60">{w.address}</td>
                <td className="px-4">{w.balance}</td>
                <td
                  className={`px-4 ${
                    w.change.startsWith("-") ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {w.change}
                </td>
                <td className="px-4 text-right">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${
                      w.status === "ACTIVE"
                        ? "bg-[#2a4] text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

const walletRows = [
  {
    name: "Portfolio A",
    address: "0x4d...b29",
    balance: "$45,200",
    change: "+5.2%",
    status: "ACTIVE",
  },
  {
    name: "Portfolio B",
    address: "0xac...0ad",
    balance: "$5,073.20",
    change: "+15.9%",
    status: "ACTIVE",
  },
  {
    name: "Portfolio C",
    address: "0xf6...16b",
    balance: "$270",
    change: "-2.02%",
    status: "INACTIVE",
  },
  {
    name: "Portfolio D",
    address: "0x04...a71",
    balance: "$16,404",
    change: "+33.7%",
    status: "ACTIVE",
  },
];