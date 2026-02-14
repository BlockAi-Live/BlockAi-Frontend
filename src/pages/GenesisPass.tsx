import { useState, useEffect } from "react";
import { Navbar, Footer } from "@/components/home";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Coins,
  ShieldCheck,
  CheckCircle,
  Copy,
} from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { createThirdwebClient, getContract, toEther } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import {
  useActiveAccount,
  useReadContract,
  TransactionButton,
  ConnectButton,
} from "thirdweb/react";
import {
  claimTo,
  getTotalClaimedSupply,
  getActiveClaimCondition,
} from "thirdweb/extensions/erc721";
import { coingecko } from "@/lib/coingecko";

/* ─── Contract Setup ─── */
const BASE_CONTRACT_ADDRESS = import.meta.env.VITE_BASE_CONTRACT_ADDRESS;
const THIRDWEB_CLIENT_ID = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
const BASE_CHAIN_ID = 8453;

if (!THIRDWEB_CLIENT_ID) throw new Error("VITE_THIRDWEB_CLIENT_ID is required");
if (!BASE_CONTRACT_ADDRESS) throw new Error("VITE_BASE_CONTRACT_ADDRESS is required");

const client = createThirdwebClient({ clientId: THIRDWEB_CLIENT_ID });
const baseChain = defineChain(BASE_CHAIN_ID);
const contract = getContract({ client, chain: baseChain, address: BASE_CONTRACT_ADDRESS });

export default function GenesisPass() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const refCode = searchParams.get("ref");

  useEffect(() => {
    if (refCode) localStorage.setItem("blockai_ref_code", refCode);
  }, [refCode]);

  const { toast } = useToast();
  const launch = () => navigate("/dashboard");
  const { width, height } = useWindowSize();
  const thirdwebAccount = useActiveAccount();

  /* ── Contract reads ── */
  const { data: claimedSupply, isLoading: loadingSupply, error: totalSupplyError } = useReadContract(getTotalClaimedSupply, { contract });
  const { data: totalNFTSupply, error: maxSupplyError } = useReadContract({ contract, method: "function nextTokenIdToMint() view returns (uint256)", params: [] });
  const { data: claimCondition, isLoading: loadingClaimCondition } = useReadContract(getActiveClaimCondition, { contract });

  /* ── State ── */
  const [showConfetti, setShowConfetti] = useState(false);
  const [mintedCount, setMintedCount] = useState(0);
  const [maxSupply] = useState(100);
  const [mintPrice, setMintPrice] = useState("0.015");
  const [hasMinted, setHasMinted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ethPriceInUsd, setEthPriceInUsd] = useState(2966.67);

  useEffect(() => {
    if (totalSupplyError) console.error("Error loading total supply:", totalSupplyError);
    if (claimedSupply !== undefined) setMintedCount(Number(claimedSupply.toString()));
  }, [claimedSupply, totalSupplyError]);

  useEffect(() => {
    if (maxSupplyError) console.error("Error loading max supply:", maxSupplyError);
  }, [totalNFTSupply, maxSupplyError]);

  useEffect(() => {
    if (claimCondition?.pricePerToken) setMintPrice(toEther(claimCondition.pricePerToken));
  }, [claimCondition]);

  useEffect(() => {
    setIsLoading(loadingSupply || loadingClaimCondition);
  }, [loadingSupply, loadingClaimCondition]);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const markets = await coingecko.getMarkets();
        const eth = markets.find((coin: any) => coin.id === "ethereum");
        if (eth) setEthPriceInUsd(eth.current_price);
      } catch (error) {
        console.error("Failed to fetch ETH price:", error);
      }
    };
    fetchEthPrice();
  }, []);

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

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  /* ── Handlers ── */
  const handleMintSuccess = async () => {
    setHasMinted(true);
    setMintedCount((prev) => prev + 1);
    setShowConfetti(true);
    toast({ title: "Genesis Pass Minted! 🚀", description: "Welcome to the inner circle! Your NFT has been sent to your wallet.", duration: 8000 });

    try {
      const storedRef = localStorage.getItem("blockai_ref_code");
      const token = localStorage.getItem("blockai_token");
      if (storedRef && token) {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/referrals/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ txHash: "0x000" }),
        });
      }
    } catch (e) {
      console.error("Failed to track referral", e);
    }
  };

  const handleMintError = (error: any) => {
    console.error("Minting error:", error);
    let errorMessage = "Failed to mint. Please try again.";
    const errMsg = error.message || "";
    if (errMsg.includes("insufficient funds")) errorMessage = "Insufficient funds. Please ensure you have enough ETH.";
    else if (errMsg.includes("!Qty") || errMsg.includes("already")) { errorMessage = "You have already minted a Genesis Pass."; setHasMinted(true); }
    else if (errMsg.includes("user rejected") || error.code === 4001) errorMessage = "Transaction was rejected.";
    else if (errMsg) errorMessage = errMsg;
    toast({ title: "Minting Failed", description: errorMessage, variant: "destructive", duration: 10000 });
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(BASE_CONTRACT_ADDRESS);
    toast({ title: "Copied!", description: "Contract address copied to clipboard." });
  };

  const progressPercent = Math.min((mintedCount / maxSupply) * 100, 100);

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white font-inter relative overflow-x-hidden">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} colors={["#9945FF", "#14F195", "#FFFFFF"]} />}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar launch={launch} />

        <main className="flex-grow pt-28 md:pt-36 pb-20 px-6 max-w-[1100px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* ── Left: Video ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-neutral-800/40 bg-[#0e0e11]">
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

                {/* Bottom overlay info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Live Mint</span>
                  </div>
                  <p className="text-white font-bold text-lg">Genesis Pass</p>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Mint Details ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              {/* Header */}
              <div>
                <p className="text-[11px] font-semibold text-[#14F195] uppercase tracking-[0.2em] mb-3">Introducing</p>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
                  THE BLOCKAI{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">GENESIS PASS</span>
                </h1>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                  Genesis Pass isn't just an NFT — it's your key to early access and core features of BlockAI. Designed for early supporters, it funds the MVP launch while providing real, limited utility.
                </p>
              </div>

              {/* Mint Card */}
              <div className="rounded-2xl bg-[#0e0e11] border border-neutral-800/40 p-6">
                {/* Network */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-[#0052FF]" />
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Base Mainnet</span>
                </div>

                {/* Price + Supply row */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider block mb-1">Price</span>
                    {isLoading ? (
                      <div className="text-lg font-bold text-neutral-500">Loading...</div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-white">
                          {mintPrice} <span className="text-sm text-neutral-600 font-normal">ETH</span>
                        </div>
                        <p className="text-[11px] text-[#14F195] font-medium">~${(parseFloat(mintPrice) * ethPriceInUsd).toFixed(2)} USD</p>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider block mb-1">Supply</span>
                    {isLoading ? (
                      <div className="text-lg font-bold text-neutral-500">Loading...</div>
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        {mintedCount}<span className="text-neutral-700">/{maxSupply}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="w-full h-1.5 bg-neutral-800/60 rounded-full overflow-hidden mb-5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"
                  />
                </div>

                {/* Status messages */}
                {thirdwebAccount?.address && (
                  <div className="mb-3 py-2.5 px-3 rounded-xl bg-[#14F195]/[0.05] border border-[#14F195]/10 flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" className="text-[#14F195] shrink-0" />
                    <p className="text-xs text-[#14F195]">
                      {thirdwebAccount.address.slice(0, 6)}...{thirdwebAccount.address.slice(-4)}
                    </p>
                  </div>
                )}
                {hasMinted && (
                  <div className="mb-3 py-2.5 px-3 rounded-xl bg-[#14F195]/[0.05] border border-[#14F195]/10 flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" className="text-[#14F195] shrink-0" />
                    <p className="text-xs text-[#14F195]">You have already minted a Genesis Pass</p>
                  </div>
                )}

                {/* Mint / Connect Button */}
                {!thirdwebAccount?.address ? (
                  <div className="w-full">
                    <ConnectButton
                      client={client}
                      chain={baseChain}
                      theme="dark"
                      connectButton={{
                        label: "Connect Wallet to Mint",
                        className: "!w-full !py-3.5 !rounded-xl !font-bold !text-sm !bg-[#14F195] !text-black hover:!bg-[#12d883] !transition-colors",
                      }}
                    />
                  </div>
                ) : hasMinted ? (
                  <button disabled className="w-full py-3.5 rounded-xl font-bold text-sm bg-neutral-800 text-neutral-500 cursor-not-allowed flex items-center justify-center gap-2">
                    Already Minted <CheckCircle size={16} weight="fill" />
                  </button>
                ) : mintedCount >= maxSupply ? (
                  <button disabled className="w-full py-3.5 rounded-xl font-bold text-sm bg-neutral-800 text-neutral-500 cursor-not-allowed">
                    Sold Out
                  </button>
                ) : (
                  <TransactionButton
                    transaction={() => claimTo({ contract, to: thirdwebAccount.address, quantity: BigInt(1) })}
                    onTransactionConfirmed={handleMintSuccess}
                    onError={handleMintError}
                    theme="dark"
                    className="!w-full !py-3.5 !rounded-xl !font-bold !text-sm !bg-[#14F195] !text-black hover:!bg-[#12d883] !transition-colors"
                  >
                    Mint Genesis Pass ({mintPrice} ETH)
                  </TransactionButton>
                )}

                {/* Contract address */}
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <span className="text-[10px] text-neutral-600">Contract:</span>
                  <button onClick={copyContractAddress} className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 hover:text-white transition-colors">
                    {`${BASE_CONTRACT_ADDRESS.slice(0, 6)}...${BASE_CONTRACT_ADDRESS.slice(-4)}`}
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Key Utilities (full width below grid) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-5">Key Utilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { emoji: "🧠", title: "Conversational AI", desc: "Up to 30 daily chats for on-chain & market analysis" },
                { emoji: "👛", title: "Wallet Tracking", desc: "Monitor 5 wallets with major activity alerts" },
                { emoji: "📊", title: "Token Tracking", desc: "Track 5 tokens with basic AI insights" },
                { emoji: "🔔", title: "AI Alerts", desc: "Up to 5 daily alerts for wallet/token activity" },
                { emoji: "🧪", title: "Feature Preview", desc: "Early access to new tools & give feedback" },
                { emoji: "🏷️", title: "Genesis Badge", desc: "Visual identity inside BlockAI" },
                { emoji: "💰", title: "20% Off Plans", desc: "Subscription discount on future individual plans" },
                { emoji: "🚀", title: "MVP & Product Access", desc: "Core features & limited main-product use" },
              ].map((u, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#0e0e11] border border-neutral-800/40 p-4 hover:border-neutral-700/50 transition-colors"
                >
                  <span className="text-lg mb-2 block">{u.emoji}</span>
                  <p className="text-[13px] font-semibold text-white leading-tight mb-1">{u.title}</p>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">{u.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Airdrop + Fundraiser ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div className="rounded-xl bg-[#0e0e11] border border-neutral-800/40 p-5 flex items-start gap-4">
              <Coins size={20} weight="fill" className="text-[#9945FF] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">1000 $BLOCKAI Airdrop</h3>
                <p className="text-xs text-neutral-600">0.05% of total supply per NFT from community pool.</p>
              </div>
            </div>
            <div className="rounded-xl bg-[#0e0e11] border border-neutral-800/40 p-5 flex items-start gap-4">
              <ShieldCheck size={20} weight="fill" className="text-[#14F195] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">MVP Fundraiser</h3>
                <p className="text-xs text-neutral-600">100% of proceeds go directly to development. No burns, just build.</p>
              </div>
            </div>
          </div>

          {/* Bottom Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                title: "Eligibility",
                desc: "Genesis holders are classified as \"Early Supporters\". Rewards are strictly from community pools, not investor allocations.",
              },
              {
                title: "Future Utility",
                desc: "Main collection & utility products designed post-MVP. This pass is your \"Pre-Seed\" ticket into the ecosystem.",
              },
              {
                title: "Fair Launch",
                desc: `Price fixed at $${mintPrice ? (parseFloat(mintPrice) * ethPriceInUsd).toFixed(0) : "45"}. No bonding curves. No complex mechanics. Simple, transparent support.`,
              },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl bg-[#0e0e11] border border-neutral-800/40 p-6 hover:border-neutral-700/50 transition-colors">
                <h3 className="text-sm font-bold text-white mb-2">{card.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
