import React from "react";
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0d0f18] text-white relative font-sans overflow-hidden">
      {/* Background gradient overlay from Settings page */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(20, 241, 149, 0.2) 100%)"
        }}
      />

      <main className="relative z-10 p-8 md:p-12 max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-8">
          
          {/* Left Column */}
          <div className="space-y-16">
            {/* Ask AI Card */}
            <div className="bg-[#16181f] rounded-[32px] p-8 border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-4">Ask AI Assistance</h2>
                    <p className="text-gray-400 mb-12 max-w-sm text-lg leading-relaxed">
                        Analyze a token, check wallet, or ask about market trends.
                    </p>
                    <div className="flex justify-end">
                        <button className="bg-[#14F195] text-black font-bold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(20,241,149,0.3)]">
                            Start Chat
                        </button>
                    </div>
                </div>
                {/* Subtle background glow for card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#14F195]/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-3xl font-bold text-gray-500/50 mb-8">Recent Activity</h2>
                <div className="space-y-8">
                    {/* Item 1 */}
                    <div className="group cursor-pointer">
                        <div className="flex justify-between items-baseline mb-3">
                            <h3 className="text-xl text-gray-300 group-hover:text-[#14F195] transition-colors">Analyzed ETH Wallet...</h3>
                            <span className="text-gray-500 italic font-light">2 mins ago</span>
                        </div>
                        <div className="h-px bg-white/10 w-full group-hover:bg-[#14F195]/50 transition-colors" />
                    </div>
                    {/* Item 2 */}
                     <div className="group cursor-pointer">
                        <div className="flex justify-between items-baseline mb-3">
                            <h3 className="text-xl text-gray-300 group-hover:text-[#14F195] transition-colors">Chatted about Solana...</h3>
                            <span className="text-gray-500 italic font-light">1 hour ago</span>
                        </div>
                        <div className="h-px bg-white/10 w-full group-hover:bg-[#14F195]/50 transition-colors" />
                    </div>
                </div>
            </div>
          </div>

          {/* Right Column - Cascading Cards */}
          <div className="relative h-[500px] lg:h-auto flex items-center justify-center lg:block">
            <div className="relative w-full max-w-md h-[400px]">
                {/* Wallets Card (Back) */}
                <div className="absolute top-0 left-0 lg:left-10 w-56 h-56 bg-[#111318] rounded-[32px] p-8 border border-white/5 shadow-xl z-10 transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-gray-400 text-base font-medium">Wallets</span>
                        <ArrowUp className="text-[#14F195] w-6 h-6" />
                    </div>
                    <div className="text-7xl font-bold text-white tracking-tighter">03</div>
                </div>

                {/* Alerts Card (Middle) */}
                <div className="absolute top-24 left-24 lg:left-40 w-56 h-56 bg-[#13151C] rounded-[32px] p-8 border border-white/5 shadow-2xl z-20 transform hover:-translate-y-2 transition-transform duration-300">
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-gray-400 text-base font-medium">Alerts</span>
                        <ArrowUp className="text-[#14F195] w-6 h-6" />
                    </div>
                    <div className="text-7xl font-bold text-white tracking-tighter">12</div>
                </div>

                {/* Gas Card (Front) */}
                <div className="absolute top-48 left-48 lg:left-72 w-56 h-56 bg-[#16181f] rounded-[32px] p-8 border border-white/5 shadow-2xl z-30 transform hover:-translate-y-2 transition-transform duration-300">
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-gray-400 text-base font-medium">Gas</span>
                        <ArrowDown className="text-red-500 w-6 h-6" />
                    </div>
                    <div className="text-7xl font-bold text-white tracking-tighter flex items-baseline gap-2">
                        15 <span className="text-2xl font-normal text-gray-400">gwei</span>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
