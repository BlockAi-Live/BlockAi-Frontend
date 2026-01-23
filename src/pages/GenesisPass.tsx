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
import { useActiveAccount } from "thirdweb/react";
import { ethers } from "ethers";
import GenesisPassABI from "@/contracts/GenesisPass.json";
import { coingecko } from "@/lib/coingecko";

// Window.ethereum is already defined in global.d.ts

// Contract address - Sepolia (testnet)
const SEPOLIA_CONTRACT_ADDRESS = import.meta.env.VITE_SEPOLIA_CONTRACT_ADDRESS || "0xef243E21545eeE86541B412015b03748C339a8D0";

// RPC URL
const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL || "https://rpc.sepolia.org";

// Chain ID
const SEPOLIA_CHAIN_ID = 11155111;

// Helper function to detect any available wallet provider (MetaMask, Coinbase, Rabby, Rainbow, Zerion, etc.)
const getWalletProvider = () => {
  if (typeof window === 'undefined') return null;
  
  // Check for window.ethereum (MetaMask, Coinbase, Rabby, Rainbow, etc.)
  if (window.ethereum) {
    return window.ethereum;
  }
  
  // Check for Coinbase Wallet
  if ((window as any).coinbaseWalletExtension) {
    return (window as any).coinbaseWalletExtension;
  }
  
  // Check for Rabby
  if ((window as any).rabby?.ethereum) {
    return (window as any).rabby.ethereum;
  }
  
  // Check for Rainbow
  if ((window as any).rainbow) {
    return (window as any).rainbow;
  }
  
  // Check for Zerion
  if ((window as any).zerionWallet) {
    return (window as any).zerionWallet;
  }
  
  return null;
};

export default function GenesisPass() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const launch = () => navigate("/dashboard");
  const { width, height } = useWindowSize();
  const thirdwebAccount = useActiveAccount();
  
  // State for wallet address (from any connected wallet)
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mintedCount, setMintedCount] = useState(0);
  const [maxSupply, setMaxSupply] = useState(500);
  const [mintPrice, setMintPrice] = useState("0.015");
  const [mintPriceWei, setMintPriceWei] = useState("15000000000000000");
  const [hasMinted, setHasMinted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contractAddress, setContractAddress] = useState<string>(SEPOLIA_CONTRACT_ADDRESS);
  const [rpcUrl, setRpcUrl] = useState<string>(SEPOLIA_RPC_URL);
  const [ethPriceInUsd, setEthPriceInUsd] = useState<number>(2966.67); // Fallback results in ~$44.50 USD

  // Set Sepolia as default network
  useEffect(() => {
    setContractAddress(SEPOLIA_CONTRACT_ADDRESS);
    setRpcUrl(SEPOLIA_RPC_URL);

    // Listen for network changes
    const provider = getWalletProvider();
    if (provider && typeof provider.on === 'function') {
      provider.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  // Check for wallet connection (supports all wallets)
  useEffect(() => {
    const checkWalletConnection = async () => {
      // First check thirdweb account
      if (thirdwebAccount?.address) {
        setWalletAddress(thirdwebAccount.address);
        return;
      }
      
      // Then check any available wallet provider
      const provider = getWalletProvider();
      if (provider) {
        try {
          const accounts = await provider.request({ method: 'eth_accounts' }) as string[] | undefined;
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet accounts:", error);
        }
      }
    };
    checkWalletConnection();
    
    // Listen for account changes
    const provider = getWalletProvider();
    if (provider && typeof provider.on === 'function') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      };
      
      provider.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        if (typeof provider.removeListener === 'function') {
          provider.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [thirdwebAccount?.address]);

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

  // Connect wallet function (supports all wallets)
  const connectWallet = async () => {
    const provider = getWalletProvider();
    
    if (!provider) {
      toast({
        title: "Wallet Not Found",
        description: "Please install a compatible wallet (MetaMask, Coinbase Wallet, Rabby, Rainbow, or Zerion).",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[] | undefined;
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        
        // Ensure we're on Sepolia
        try {
          const ethersProvider = new ethers.BrowserProvider(provider);
          const network = await ethersProvider.getNetwork();
          if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
            });
          }
        } catch (switchError: any) {
          // If Sepolia network doesn't exist, add it
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [SEPOLIA_RPC_URL],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }],
            });
          }
        }
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to your wallet.",
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "Please connect your wallet to continue.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to wallet.",
          variant: "destructive",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Initialize contract and fetch data
  useEffect(() => {
    if (!contractAddress) {
      setIsLoading(false);
      return;
    }

    const fetchContractData = async () => {
      try {
        // Use wallet provider if available (avoids CORS issues), otherwise use RPC
        let provider: ethers.Provider;
        const walletProvider = getWalletProvider();
        
        if (walletProvider) {
          // Use wallet provider (no CORS issues)
          provider = new ethers.BrowserProvider(walletProvider);
        } else {
          // Fallback to RPC provider (may have CORS issues, but we'll handle gracefully)
          provider = new ethers.JsonRpcProvider(rpcUrl);
        }
        
        const contract = new ethers.Contract(contractAddress, GenesisPassABI, provider);
        
        // Fetch contract data
        const totalSupply = await contract.totalSupply();
        const maxSupplyValue = await contract.MAX_SUPPLY();
        const price = await contract.mintPrice();
        
        setMintedCount(Number(totalSupply));
        // setMaxSupply(Number(maxSupplyValue));
        // setMintPriceWei(price.toString());
        // setMintPrice(ethers.formatEther(price));
        
        // Check if user has minted (only if wallet is connected)
        const addressToCheck = walletAddress || thirdwebAccount?.address;
        if (addressToCheck) {
          try {
            const userHasMinted = await contract.hasMinted(addressToCheck);
            setHasMinted(userHasMinted);
          } catch (error) {
            // Silently fail if we can't check mint status
            console.warn("Could not check mint status:", error);
          }
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching contract data:", error);
        
        // If it's a CORS error and no wallet is connected, don't show error
        // Just set default values and stop loading
        if (error.message?.includes("CORS") || error.message?.includes("Failed to fetch")) {
          if (!walletAddress && !thirdwebAccount?.address) {
            // No wallet connected and CORS error - just use defaults
            setIsLoading(false);
            return;
          }
        }
        
        setIsLoading(false);
        // Only show error toast if wallet is connected
        if (walletAddress || thirdwebAccount?.address) {
          toast({
            title: "Connection Error",
            description: "Could not connect to contract on Sepolia. Make sure the network is accessible.",
            variant: "destructive",
          });
        }
      }
    };
    
    fetchContractData();
    
    // Set up event listener for new mints (only if wallet provider is available)
    if (contractAddress) {
      const walletProvider = getWalletProvider();
      if (walletProvider) {
        try {
          const provider = new ethers.BrowserProvider(walletProvider);
          const contract = new ethers.Contract(contractAddress, GenesisPassABI, provider);
          
          const handleMinted = (to: string, tokenId: bigint, price: bigint) => {
            const currentAddress = walletAddress || thirdwebAccount?.address;
            if (currentAddress && to.toLowerCase() === currentAddress.toLowerCase()) {
              setShowConfetti(true);
              toast({
                title: "Genesis Pass Minted! 🚀",
                description: "Welcome to the inner circle. Your NFT has been sent to your wallet.",
                duration: 5000,
              });
            }
            // Update minted count
            contract.totalSupply().then((supply: bigint) => {
              setMintedCount(Number(supply));
            }).catch(() => {
              // Silently fail if we can't update
            });
          };
          
          contract.on("Minted", handleMinted);
          return () => {
            contract.off("Minted", handleMinted);
          };
        } catch (error) {
          // Silently fail if we can't set up event listener
          console.warn("Could not set up event listener:", error);
        }
      }
    }
  }, [walletAddress, thirdwebAccount?.address, contractAddress, rpcUrl, toast]);

  // Confetti cleanup
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleMint = async () => {
    const currentAddress = walletAddress || thirdwebAccount?.address;
    
    if (!currentAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint.",
        variant: "destructive",
      });
      await connectWallet();
      return;
    }

    if (!contractAddress) {
      toast({
        title: "Contract Not Configured",
        description: "Sepolia contract address not set. Please set VITE_SEPOLIA_CONTRACT_ADDRESS.",
        variant: "destructive",
      });
      return;
    }

    if (hasMinted) {
      toast({
        title: "Already Minted",
        description: "You have already minted a Genesis Pass.",
        variant: "destructive",
      });
      return;
    }

    if (mintedCount >= maxSupply) {
      toast({
        title: "Sold Out",
        description: "All Genesis Passes have been minted.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);
    
    try {
      // Get wallet provider (supports MetaMask, Coinbase, Rabby, Rainbow, Zerion, etc.)
      const walletProvider = getWalletProvider();
      
      if (!walletProvider) {
        throw new Error("No wallet found. Please install a compatible wallet.");
      }
      
      // Use browser's ethereum provider (works with any EIP-1193 wallet)
      const provider = new ethers.BrowserProvider(walletProvider);
      
      // Check and switch to Sepolia if needed
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await walletProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          // If Sepolia network doesn't exist, add it
          if (switchError.code === 4902) {
            await walletProvider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [SEPOLIA_RPC_URL],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }],
            });
          } else {
            throw new Error("Please switch to Sepolia network");
          }
        }
      }
      
      const signer = await provider.getSigner();
      
      // First verify contract exists at address before creating contract instance
      try {
        const code = await provider.getCode(contractAddress);
        if (!code || code === "0x" || code === "0x0") {
          throw new Error(`No contract found at ${contractAddress} on Sepolia.\n\nMake sure:\n1. You're connected to Sepolia network\n2. The contract address is correct: ${contractAddress}`);
        }
      } catch (error: any) {
        if (error.message.includes("No contract found")) {
          throw error;
        }
        throw new Error(`Cannot connect to Sepolia network. Make sure your wallet is connected to Sepolia testnet.`);
      }
      
      const contract = new ethers.Contract(contractAddress, GenesisPassABI, signer);
      
      // Verify contract is accessible by reading a value
      try {
        await contract.MAX_SUPPLY();
      } catch (error: any) {
        throw new Error(`Contract exists but cannot read data. Check your network connection to Sepolia.`);
      }
      
      // Check if user has already minted
      try {
        const userHasMinted = await contract.hasMinted(currentAddress);
        if (userHasMinted) {
          setHasMinted(true);
          throw new Error("You have already minted a Genesis Pass.");
        }
      } catch (error: any) {
        if (error.message.includes("already minted")) {
          throw error;
        }
        // If check fails, continue (might be network issue)
      }
      
      // Check current phase
      let currentPhase;
      try {
        currentPhase = await contract.currentPhase();
        if (currentPhase === 0) {
          throw new Error("Minting has not started yet. Please wait for the owner to enable minting.");
        }
      } catch (error: any) {
        if (error.message.includes("not started")) {
          throw error;
        }
        // If currentPhase read fails, try to proceed with Public Phase
        console.warn("Could not read currentPhase, attempting Public Phase mint");
        currentPhase = 2;
      }
      
      // Mint based on phase
      let tx;
      if (currentPhase === 1) {
        // Allowlist phase - free mint
        // First check if user is on allowlist
        const isAllowed = await contract.allowlist(currentAddress);
        if (!isAllowed) {
          throw new Error("You are not on the allowlist for this phase.");
        }
        tx = await contract.mint(currentAddress, { value: 0 });
      } else if (currentPhase === 2) {
        // Public phase - paid mint
        if (!mintPriceWei || mintPriceWei === "0") {
          // Fetch price if not available
          const price = await contract.mintPrice();
          tx = await contract.mint(currentAddress, { value: price });
        } else {
          tx = await contract.mint(currentAddress, { value: mintPriceWei });
        }
      } else {
        throw new Error("Minting is not active. Current phase: " + currentPhase);
      }
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });
      
      const receipt = await tx.wait();
      
      // Get the token ID from the Minted event
      let tokenId = null;
      if (receipt.logs) {
        const contractInterface = new ethers.Interface(GenesisPassABI);
        for (const log of receipt.logs) {
          try {
            const parsedLog = contractInterface.parseLog(log);
            if (parsedLog && parsedLog.name === "Minted") {
              tokenId = parsedLog.args.tokenId.toString();
              break;
            }
          } catch (e) {
            // Not our event, continue
          }
        }
      }
      
      setIsMinting(false);
      setHasMinted(true);
      setMintedCount(prev => prev + 1);
      setShowConfetti(true);
      
      const message = tokenId 
        ? `Welcome to the inner circle! Your NFT (Token ID: ${tokenId}) has been sent to your wallet. Check your wallet's NFT tab to view it.`
        : "Welcome to the inner circle. Your NFT has been sent to your wallet. Check your wallet's NFT tab to view it.";
      
      toast({
        title: "Genesis Pass Minted! 🚀",
        description: message,
        duration: 8000,
      });
    } catch (error: any) {
      console.error("Minting error:", error);
      setIsMinting(false);
      
      let errorMessage = "Failed to mint. Please try again.";
      if (error.message) {
        if (error.message.includes("insufficient funds") || error.message.includes("insufficient balance")) {
          errorMessage = "Insufficient funds for minting. Please ensure you have enough ETH.";
        } else if (error.message.includes("already minted") || error.message.includes("Address already minted")) {
          errorMessage = "You have already minted a Genesis Pass.";
          setHasMinted(true);
        } else if (error.message.includes("not started") || error.message.includes("Minting not started")) {
          errorMessage = error.message;
        } else if (error.message.includes("Max supply") || error.message.includes("Max supply reached")) {
          errorMessage = "All Genesis Passes have been minted.";
        } else if (error.message.includes("user rejected") || error.message.includes("User rejected") || error.message.includes("rejected")) {
          errorMessage = "Transaction was rejected.";
        } else if (error.message.includes("switch") || error.message.includes("network")) {
          errorMessage = error.message;
        } else if (error.message.includes("Cannot connect to contract") || error.message.includes("connect to contract")) {
          errorMessage = error.message;
        } else if (error.message.includes("allowlist") || error.message.includes("Not on allowlist")) {
          errorMessage = error.message;
        } else if (error.message.includes("CALL_EXCEPTION") || error.message.includes("missing revert data") || error.message.includes("Internal JSON-RPC error")) {
          errorMessage = `Cannot connect to Sepolia contract. Make sure:\n1. You're connected to Sepolia network\n2. The contract address is correct: ${contractAddress || "Not set"}`;
        } else if (error.message.includes("No contract found")) {
          errorMessage = error.message;
        } else if (error.message.includes("No wallet found")) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      } else if (error.code === "CALL_EXCEPTION") {
        errorMessage = `Cannot connect to contract on Sepolia. Make sure you're connected to Sepolia network.`;
      }
      
      // Format error message for toast (replace newlines with spaces)
      const toastMessage = errorMessage.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      
      toast({
        title: "Minting Failed",
        description: toastMessage,
        variant: "destructive",
        duration: 10000, // Longer duration for important errors
      });
    }
  };

  const copyContractAddress = () => {
    if (!contractAddress) return;
    navigator.clipboard.writeText(contractAddress);
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
                                🌐 Sepolia Testnet
                              </div>
                              {!contractAddress && (
                                <p className="text-xs text-yellow-500 text-center">
                                  Set VITE_SEPOLIA_CONTRACT_ADDRESS in .env file
                                </p>
                              )}
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
                            {!walletAddress && !thirdwebAccount?.address && (
                                <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Warning size={20} className="text-yellow-500" />
                                        <p className="text-sm text-yellow-500">Connect your wallet to mint</p>
                                    </div>
                                    <button
                                        onClick={connectWallet}
                                        disabled={isConnecting}
                                        className="w-full mt-2 py-2 px-4 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-500 text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                        {isConnecting ? "Connecting..." : "Connect Wallet"}
                                    </button>
                                </div>
                            )}
                            
                            {walletAddress && (
                                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <p className="text-sm text-green-500">
                                        Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                    </p>
                                </div>
                            )}
                            {hasMinted && (
                                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <p className="text-sm text-green-500">You have already minted a Genesis Pass</p>
                                </div>
                            )}

                            {/* Mint Button */}
                            <button
                                onClick={handleMint}
                                disabled={isMinting || mintedCount >= maxSupply || hasMinted || (!walletAddress && !thirdwebAccount?.address) || isLoading || isConnecting || !contractAddress}
                                className="w-full py-4 rounded-xl font-bold text-lg bg-[#14F195] text-black hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isConnecting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        Connecting...
                                    </>
                                ) : isMinting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        Minting...
                                    </>
                                ) : hasMinted ? (
                                    <>
                                        Already Minted <CheckCircle size={20} weight="fill" />
                                    </>
                                ) : mintedCount >= maxSupply ? (
                                    <>
                                        Sold Out
                                    </>
                                ) : !walletAddress && !thirdwebAccount?.address ? (
                                    <>
                                        Connect Wallet to Mint <Wallet size={20} weight="fill" />
                                    </>
                                ) : !contractAddress ? (
                                    <>
                                        Contract Not Configured
                                    </>
                                ) : (
                                    <>
                                        Mint Genesis Pass <RocketLaunch size={20} weight="fill" />
                                    </>
                                )}
                            </button>
                            
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Contract: <span 
                                    className="font-mono text-gray-400 cursor-pointer hover:text-[#14F195] transition-colors"
                                    onClick={copyContractAddress}
                                    title="Click to copy"
                                >
                                    {contractAddress ? `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}` : "Not set"}
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
                        Price fixed at ${mintPrice ? (parseFloat(mintPrice) * 2000).toFixed(0) : "39"}. No bonding curves. No complex mechanics. Simple, transparent support for the project.
                    </p>
                </div>
            </motion.div>

        </main>
        
        <Footer />
      </div>
    </div>
  );
}
