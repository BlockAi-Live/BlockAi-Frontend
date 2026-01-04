import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/home";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RocketLaunch, 
  Coins, 
  ShieldCheck, 
  Users, 
  CheckCircle,
  Warning,
  CaretRight,
  Copy,
  Wallet
} from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function GenesisPass() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const launch = () => navigate("/dashboard");
  const { width, height } = useWindowSize();
  
  const [isMinting, setIsMinting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mintedCount, setMintedCount] = useState(342); // Mock initial count
  
  // Confetti cleanup
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleMint = () => {
    setIsMinting(true);
    
    // Simulate Minting Delay
    setTimeout(() => {
        setIsMinting(false);
        setMintedCount(prev => Math.min(prev + 1, 666));
        setShowConfetti(true);
        
        toast({
            title: "Genesis Pass Minted! 🚀",
            description: "Welcome to the inner circle. Your NFT has been sent to your wallet.",
            duration: 5000,
        });
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0f18] text-white font-inter relative overflow-x-hidden">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} colors={['#9945FF', '#14F195', '#FFFFFF']} />}

      {/* Background Ambience */}
      {/* Background Ambience from Home Page */}
      <div 
        className="fixed inset-0 pointer-events-none w-full"
        style={{
            background: "radial-gradient(circle at 50% 0%, rgba(20, 241, 149, 0.05) 0%, rgba(13, 15, 24, 0) 50%)",
            minHeight: '100%'
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar launch={launch} />

        <main className="flex-grow pt-24 md:pt-36 pb-20 px-6 max-w-[1200px] mx-auto w-full">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                
                {/* Left Column: Video Preview */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative group"
                >
                    {/* Glowing Border Card */}
                    <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-[#13151C]/50 backdrop-blur-sm shadow-2xl shadow-[#14F195]/10 group-hover:shadow-[#14F195]/20 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#14F195]/5 to-transparent z-10 pointer-events-none" />
                        <div className="aspect-[9/16] relative">
                           <video 
                             src="/blockai-nft.mp4" 
                             autoPlay 
                             loop 
                             muted 
                             playsInline
                             className="w-full h-full object-cover"
                           />
                        </div>
                        
                        {/* Overlay Badge */}
                        <div className="absolute top-6 left-6 z-20">
                            <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
                                <span className="text-xs font-bold tracking-wider uppercase">Live Mint</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -z-10 top-10 -left-10 w-40 h-40 bg-[#9945FF]/20 rounded-full blur-[80px]" />
                    <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-[#14F195]/20 rounded-full blur-[80px]" />
                </motion.div>


                {/* Right Column: Mint Details */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col gap-8"
                >
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                            GENESIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">PASS</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                            Fund the MVP. Secure your legacy. <br />
                            Limited to 666 early supporters who believe in the future of decentralized AI.
                        </p>
                    </div>

                    {/* Mint Card */}
                    <div className="p-[1px] rounded-3xl bg-gradient-to-br from-[#14F195]/30 to-[#9945FF]/30">
                        <div className="bg-[#0d0f18] rounded-[22px] p-6 md:p-8 h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#14F195]/5 rounded-full blur-3xl -z-0" />
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Price</span>
                                    <div className="text-2xl font-bold flex items-end gap-1">
                                        $39 <span className="text-sm text-gray-500 font-normal mb-1">USD</span>
                                    </div>
                                    <p className="text-xs text-[#14F195]">~0.015 ETH</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Supply</span>
                                    <div className="text-2xl font-bold">
                                        {mintedCount} <span className="text-gray-600">/ 666</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-8">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(mintedCount / 666) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#9945FF] to-[#14F195]" 
                                />
                            </div>

                            {/* Mint Button */}
                            <button
                                onClick={handleMint}
                                disabled={isMinting || mintedCount >= 666}
                                className="w-full py-4 rounded-xl font-bold text-lg bg-[#14F195] text-black hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isMinting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        Minting...
                                    </>
                                ) : (
                                    <>
                                        Mint Genesis Pass <RocketLaunch size={20} weight="fill" />
                                    </>
                                )}
                            </button>
                            
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Contract: <span className="font-mono text-gray-400">0x...Soon</span>
                            </p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="p-2 rounded-lg bg-[#9945FF]/20 text-[#9945FF]">
                                <Coins size={24} weight="fill" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">500 $BLOCKAI Airdrop</h3>
                                <p className="text-sm text-gray-400">Fixed allocation from community pool. 0.005% of total supply per NFT.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="p-2 rounded-lg bg-[#14F195]/20 text-[#14F195]">
                                <ShieldCheck size={24} weight="fill" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">MVP Fundraiser</h3>
                                <p className="text-sm text-gray-400">100% of proceeds go directly to development. No burns, just build.</p>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>

            {/* Bottom Info Section */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div className="p-6 rounded-2xl bg-[#13151C]/40 backdrop-blur-md border border-white/5 hover:border-[#14F195]/30 transition-colors group">
                    <h3 className="text-xl font-bold mb-3 text-white">Eligibility</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Genesis holders are classified as "Early Supporters". Rewards are strictly from community pools, not investor allocations.
                    </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#13151C]/40 backdrop-blur-md border border-white/5 hover:border-[#14F195]/30 transition-colors group">
                    <h3 className="text-xl font-bold mb-3 text-white">Future Utility</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Main collection & utility products designed post-MVP. This pass is your "Pre-Seed" ticket into the ecosystem.
                    </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#13151C]/40 backdrop-blur-md border border-white/5 hover:border-[#14F195]/30 transition-colors group">
                    <h3 className="text-xl font-bold mb-3 text-white">Fair Launch</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Price fixed at $39. No bonding curves. No complex mechanics. Simple, transparent support for the project.
                    </p>
                </div>
            </motion.div>

        </main>
        
        <Footer />
      </div>
    </div>
  );
}
