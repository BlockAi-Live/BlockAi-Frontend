import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useCampaign } from '@/context/CampaignContext';

// Section name → required stage
const SECTION_STAGE: Record<string, number> = {
  'chat': 1,
  'market': 2,
  'smart-contracts': 3,
  'nft': 4,
  'wallet-intel': 5,
};

const SECTION_LABELS: Record<string, string> = {
  'chat': 'AI Chat',
  'market': 'Market Analysis',
  'smart-contracts': 'Smart Contracts',
  'nft': 'NFT Generator',
  'wallet-intel': 'Chain Scanner',
};

const PREV_SECTION: Record<string, string> = {
  'market': 'AI Chat',
  'smart-contracts': 'Market Analysis',
  'nft': 'Smart Contracts',
  'wallet-intel': 'NFT Generator',
};

interface CampaignGateProps {
  section: string;
  children: React.ReactNode;
}

export default function CampaignGate({ section, children }: CampaignGateProps) {
  const { unlockedStage, isInvestor, hasRedeemedCode, loading } = useCampaign();

  // Investor bypass — full access
  if (isInvestor) return <>{children}</>;

  // Still loading campaign state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0c14]">
        <div className="w-6 h-6 border-2 border-[#14F195]/30 border-t-[#14F195] rounded-full animate-spin" />
      </div>
    );
  }

  const requiredStage = SECTION_STAGE[section] || 0;
  const isUnlocked = unlockedStage >= requiredStage;

  if (isUnlocked) return <>{children}</>;

  // Locked state
  const sectionLabel = SECTION_LABELS[section] || section;
  const prevLabel = PREV_SECTION[section];
  const needsCode = !hasRedeemedCode;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c14] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Lock icon */}
        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
          <Lock size={36} weight="bold" className="text-neutral-600" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {sectionLabel} is Locked
        </h2>

        {needsCode ? (
          <>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              You need to collect <span className="text-[#F59E0B] font-bold">500 PTS</span> and redeem an Early Access Code to start exploring BlockAI.
            </p>
            <Link
              to="/campaign"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#14F195]/10 border border-[#14F195]/20 text-[#14F195] font-bold text-sm hover:bg-[#14F195]/15 transition-all"
            >
              Go to Campaign
              <ArrowRight size={16} weight="bold" />
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              Submit your feedback for <span className="text-white font-semibold">{prevLabel}</span> to unlock this section.
            </p>
            <Link
              to="/campaign"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#14F195]/10 border border-[#14F195]/20 text-[#14F195] font-bold text-sm hover:bg-[#14F195]/15 transition-all"
            >
              Submit Feedback
              <ArrowRight size={16} weight="bold" />
            </Link>
          </>
        )}

        {/* Progress hint */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((stage) => (
            <div
              key={stage}
              className={`w-8 h-1.5 rounded-full transition-all ${
                unlockedStage >= stage ? 'bg-[#14F195]' : 'bg-white/[0.06]'
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-neutral-600 mt-2">{unlockedStage}/5 sections unlocked</p>
      </motion.div>
    </div>
  );
}
