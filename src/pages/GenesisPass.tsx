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
import { createThirdwebClient, getContract, toEther } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { useActiveAccount, useReadContract, TransactionButton, ConnectButton } from "thirdweb/react";
import { claimTo, getTotalClaimedSupply, getActiveClaimCondition } from "thirdweb/extensions/erc721";
import { coingecko } from "@/lib/coingecko";

// Window.ethereum is already defined in global.d.ts

// Contract address - Base (mainnet) - ThirdWeb NFT Drop Contract
const BASE_CONTRACT_ADDRESS = import.meta.env.VITE_BASE_CONTRACT_ADDRESS;

// ThirdWeb Client ID
const THIRDWEB_CLIENT_ID = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

// Chain ID
const BASE_CHAIN_ID = 8453;

// Validate required environment variables
if (!THIRDWEB_CLIENT_ID) {
  throw new Error("VITE_THIRDWEB_CLIENT_ID is required");
}
if (!BASE_CONTRACT_ADDRESS) {
  throw new Error("VITE_BASE_CONTRACT_ADDRESS is required");
}

// Create ThirdWeb client
const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// Define Base chain
const baseChain = defineChain(BASE_CHAIN_ID);

// Get contract instance
const contract = getContract({
  client,
  chain: baseChain,
  address: BASE_CONTRACT_ADDRESS,
});


export default function GenesisPass() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const launch = () => navigate("/dashboard");
  const { width, height } = useWindowSize();
  const thirdwebAccount = useActiveAccount();
  
  // Read contract data using ThirdWeb extensions
  const { data: claimedSupply, isLoading: loadingSupply, error: totalSupplyError } = useReadContract(
    getTotalClaimedSupply,
    { contract }
  );
  
  const { data: totalNFTSupply, error: maxSupplyError } = useReadContract(
    { contract, method: "function nextTokenIdToMint() view returns (uint256)", params: [] }
  );
  
  const { data: claimCondition, isLoading: loadingClaimCondition } = useReadContract(
    getActiveClaimCondition,
    { contract }
  );
  
  // State
  const [showConfetti, setShowConfetti] = useState(false);
  const [mintedCount, setMintedCount] = useState(0);
  const [maxSupply, setMaxSupply] = useState(500);
  const [mintPrice, setMintPrice] = useState("0.015");
  const [hasMinted, setHasMinted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ethPriceInUsd, setEthPriceInUsd] = useState<number>(2966.67);
  
  // Update state when ThirdWeb data loads
  useEffect(() => {
    if (totalSupplyError) {
      console.error("Error loading total supply:", totalSupplyError);
    }
    if (claimedSupply !== undefined) {
      const count = Number(claimedSupply.toString());
      setMintedCount(count);
    }
  }, [claimedSupply, totalSupplyError]);
  
  useEffect(() => {
    if (maxSupplyError) {
      console.error("Error loading max supply:", maxSupplyError);
    }
    // We want to force 500 as the max supply for now, ignoring nextTokenIdToMint which is likely current count
    // if (totalNFTSupply !== undefined) {
    //   const count = Number(totalNFTSupply.toString());
    //   setMaxSupply(count > 0 ? count : 500);
    // }
  }, [totalNFTSupply, maxSupplyError]);
  
  // Update mint price from claim condition
  useEffect(() => {
    if (claimCondition?.pricePerToken) {
      const priceInEth = toEther(claimCondition.pricePerToken);
      setMintPrice(priceInEth);
    }
  }, [claimCondition]);
  
  useEffect(() => {
    const loading = loadingSupply || loadingClaimCondition;
    setIsLoading(loading);
  }, [loadingSupply, loadingClaimCondition]);


  // Fetch ETH Price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const markets = await coingecko.getMarkets();
        const eth = markets.find((coin: any) => coin.id === "ethereum");
        if (eth) {
          setEthPriceInUsd(eth.current_price);
        }
      } catch (error) {
        console.error("Failed to fetch ETH price:", error);
      }
    };
    fetchEthPrice();
  }, []);

  // Check if user has already minted
  useEffect(() => {
    const checkBalance = async () => {
      if (thirdwebAccount?.address) {
        try {
          const balance = await contract.erc721.balanceOf(thirdwebAccount.address);
          setHasMinted(balance > 0n);
        } catch (error) {
          console.error("Error checking balance:", error);
        }
      }
    };
    checkBalance();
  }, [thirdwebAccount?.address]);

  // Confetti cleanup
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Handle successful mint
  const handleMintSuccess = async () => {
    setHasMinted(true);
    setMintedCount(prev => prev + 1);
    setShowConfetti(true);
    
    toast({
      title: "Genesis Pass Minted! 🚀",
      description: "Welcome to the inner circle! Your NFT has been sent to your wallet.",
      duration: 8000,
    });
  };
  
  // Handle mint error
  const handleMintError = (error: any) => {
    console.error("Minting error:", error);
    
    let errorMessage = "Failed to mint. Please try again.";
    const errMsg = error.message || "";
    
    if (errMsg.includes("insufficient funds")) {
      errorMessage = "Insufficient funds. Please ensure you have enough ETH.";
    } else if (errMsg.includes("!Qty") || errMsg.includes("already")) {
      errorMessage = "You have already minted a Genesis Pass.";
      setHasMinted(true);
    } else if (errMsg.includes("user rejected") || error.code === 4001) {
      errorMessage = "Transaction was rejected.";
    } else if (errMsg) {
      errorMessage = errMsg;
    }
    
    toast({
      title: "Minting Failed",
      description: errorMessage,
      variant: "destructive",
      duration: 10000,
    });
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(BASE_CONTRACT_ADDRESS);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0f18] text-white font-inter relative overflow-x-hidden">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} colors={['#9945FF', '#14F195', '#FFFFFF']} />}

      {/* Background Ambience */}
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
                            Limited to {maxSupply} early supporters who believe in the future of decentralized AI.
                        </p>
                    </div>

                    {/* Mint Card */}
                    <div className="p-[1px] rounded-3xl bg-gradient-to-br from-[#14F195]/30 to-[#9945FF]/30">
                        <div className="bg-[#0d0f18] rounded-[22px] p-6 md:p-8 h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#14F195]/5 rounded-full blur-3xl -z-0" />
                            
                            {/* Network Badge */}
                            <div className="mb-4 flex flex-col items-center justify-center gap-2">
                              <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                🌐 Base Mainnet
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Price</span>
                                    {isLoading ? (
                                        <div className="text-2xl font-bold">Loading...</div>
                                    ) : (
                                        <>
                                            <div className="text-2xl font-bold flex items-end gap-1">
                                                {mintPrice} <span className="text-sm text-gray-500 font-normal mb-1">ETH</span>
                                            </div>
                                            <p className="text-xs text-[#14F195]">~${(parseFloat(mintPrice) * ethPriceInUsd).toFixed(2)} USD</p>
                                        </>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Supply</span>
                                    {isLoading ? (
                                        <div className="text-2xl font-bold">Loading...</div>
                                    ) : (
                                        <div className="text-2xl font-bold">
                                            {mintedCount} <span className="text-gray-600">/ {maxSupply}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-8">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(mintedCount / maxSupply) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#9945FF] to-[#14F195]" 
                                />
                            </div>

                            {/* Wallet Connection Status */}
                            {thirdwebAccount?.address && (
                                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <p className="text-sm text-green-500">
                                        Connected: {thirdwebAccount.address.slice(0, 6)}...{thirdwebAccount.address.slice(-4)}
                                    </p>
                                </div>
                            )}
                            {hasMinted && (
                                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <p className="text-sm text-green-500">You have already minted a Genesis Pass</p>
                                </div>
                            )}

                            {/* Mint/Connect Button */}
                            {!thirdwebAccount?.address ? (
                                <div className="w-full">
                                    <ConnectButton
                                        client={client}
                                        chain={baseChain}
                                        theme="dark"
                                        connectButton={{
                                            label: "Connect Wallet to Mint",
                                            className: "!w-full !py-4 !rounded-xl !font-bold !text-lg !bg-[#14F195] !text-black hover:!opacity-90"
                                        }}
                                    />
                                </div>
                            ) : hasMinted ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl font-bold text-lg bg-[#14F195] text-black opacity-50 cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    Already Minted <CheckCircle size={20} weight="fill" />
                                </button>
                            ) : mintedCount >= maxSupply ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl font-bold text-lg bg-[#14F195] text-black opacity-50 cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    Sold Out
                                </button>
                            ) : (
                                <TransactionButton
                                    transaction={() => claimTo({
                                        contract: contract,
                                        to: thirdwebAccount.address,
                                        quantity: BigInt(1),
                                    })}
                                    onTransactionConfirmed={handleMintSuccess}
                                    onError={handleMintError}
                                    theme="dark"
                                    className="!w-full !py-4 !rounded-xl !font-bold !text-lg !bg-[#14F195] !text-black hover:!opacity-90 hover:!scale-[1.02] active:!scale-[0.98] !transition-all"
                                >
                                    Mint Genesis Pass ({mintPrice} ETH)
                                </TransactionButton>
                            )}
                            
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Contract: <span 
                                    className="font-mono text-gray-400 cursor-pointer hover:text-[#14F195] transition-colors"
                                    onClick={copyContractAddress}
                                    title="Click to copy"
                                >
                                    {`${BASE_CONTRACT_ADDRESS.slice(0, 6)}...${BASE_CONTRACT_ADDRESS.slice(-4)}`}
                                </span>
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
                                <h3 className="font-bold text-white">1000 $BLOCKAI Airdrop</h3>
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
                        Price fixed at ${mintPrice ? (parseFloat(mintPrice) * ethPriceInUsd).toFixed(0) : "45"}. No bonding curves. No complex mechanics. Simple, transparent support for the project.
                    </p>
                </div>
            </motion.div>

        </main>
        
        <Footer />
      </div>
    </div>
  );
}
