import React from "react";
import { Plus, ArrowUpRight, ArrowDownRight, Wallet, MoreHorizontal } from "lucide-react";

export function WalletsPage() {
  return (
    <div className="min-h-screen bg-[#0d0f18] text-white relative font-sans overflow-hidden">
      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(20, 241, 149, 0.2) 100%)"
        }}
      />

      <main className="relative z-10 p-4 md:p-12 max-w-7xl mx-auto pb-24 md:pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4 md:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Wallets</h1>
            <p className="text-gray-400">Manage and track your connected portfolios.</p>
          </div>
          <button className="w-full md:w-auto bg-[#14F195] text-black font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(20,241,149,0.3)]">
            <Plus size={20} />
            Add Wallet
          </button>
        </div>

        {/* Net Worth Card */}
        <div className="bg-[#16181f] rounded-[32px] p-6 md:p-8 border border-white/5 relative overflow-hidden mb-8 md:mb-12 group">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-gray-400 mb-2 font-medium">Total Net Worth</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">$142,050.23</h2>
            </div>
            <div className="flex items-center gap-3 bg-[#14F195]/10 px-4 py-2 rounded-full border border-[#14F195]/20 w-fit">
              <div className="w-8 h-8 rounded-full bg-[#14F195] flex items-center justify-center text-black">
                <ArrowUpRight size={18} />
              </div>
              <span className="text-[#14F195] font-bold text-lg">+12.5%</span>
              <span className="text-gray-400 text-sm">vs last month</span>
            </div>
          </div>
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#14F195]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        </div>

        {/* Wallets List */}
        <div className="space-y-4">
          <div className="hidden md:flex items-center justify-between px-6 text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">
            <div className="w-1/3">Wallet Name</div>
            <div className="w-1/4">Balance</div>
            <div className="w-1/4">24h Change</div>
            <div className="w-1/6 text-right">Status</div>
          </div>

          {walletRows.map((w, i) => (
            <div
              key={i}
              className="bg-[#16181f]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-[#16181f] hover:border-white/10 transition-all group cursor-pointer gap-4 md:gap-0"
            >
              <div className="w-full md:w-1/3 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors shrink-0">
                  <Wallet size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between md:block">
                    <h3 className="font-bold text-white text-lg">{w.name}</h3>
                    {/* Mobile Status Badge (Visible only on mobile) */}
                    <span
                      className={`md:hidden px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        w.status === "ACTIVE"
                          ? "bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-mono">{w.address}</p>
                </div>
              </div>

              <div className="w-full md:w-1/4 flex justify-between md:block border-t border-white/5 md:border-none pt-4 md:pt-0">
                <span className="md:hidden text-gray-400 text-sm">Balance</span>
                <div className="font-bold text-white text-xl">{w.balance}</div>
              </div>

              <div className="w-full md:w-1/4 flex justify-between md:block">
                <span className="md:hidden text-gray-400 text-sm">24h Change</span>
                <div className={`flex items-center gap-2 font-medium ${w.change.startsWith("-") ? "text-red-400" : "text-[#14F195]"}`}>
                  {w.change.startsWith("-") ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                  {w.change}
                </div>
              </div>

              <div className="w-full md:w-1/6 flex justify-between md:justify-end items-center gap-4 hidden md:flex">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    w.status === "ACTIVE"
                      ? "bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20"
                      : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  }`}
                >
                  {w.status}
                </span>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

const walletRows = [
  {
    name: "Main Portfolio",
    address: "0x4d...b29",
    balance: "$45,200.00",
    change: "+5.2%",
    status: "ACTIVE",
  },
  {
    name: "Trading Wallet",
    address: "0xac...0ad",
    balance: "$5,073.20",
    change: "+15.9%",
    status: "ACTIVE",
  },
  {
    name: "Cold Storage",
    address: "0xf6...16b",
    balance: "$270.00",
    change: "-2.02%",
    status: "INACTIVE",
  },
  {
    name: "Degen Plays",
    address: "0x04...a71",
    balance: "$16,404.50",
    change: "+33.7%",
    status: "ACTIVE",
  },
];
