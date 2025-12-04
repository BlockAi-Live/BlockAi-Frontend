import HeroStats from "@/components/referrals/HeroStats";
import LevelBreakdown from "@/components/referrals/LevelBreakdown";
import ReferralTree from "@/components/referrals/ReferralTree";
import EarningsChart from "@/components/referrals/EarningsChart";
import TransactionHistory from "@/components/referrals/TransactionHistory";
import Leaderboard from "@/components/referrals/Leaderboard";
import ReferralLink from "@/components/referrals/ReferralLink";

export function ReferralsPage() {
  return (
    <div className="min-h-screen bg-[#0d0f18] text-white relative">
      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(20, 241, 149, 0.2) 100%)"
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        {/* Header */}
        <div className="py-6 border-b border-white/10 mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Referral Program</h1>
          <p className="text-gray-400 mt-2">Grow your network and earn commissions on every level</p>
        </div>
        
        <div className="space-y-8">
          <HeroStats />
          <LevelBreakdown />
          <ReferralTree />
          <EarningsChart />
          <TransactionHistory />
          <Leaderboard />
          <ReferralLink />
        </div>
        
        <footer className="mt-16 py-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© 2024 BLOCK AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default ReferralsPage;
