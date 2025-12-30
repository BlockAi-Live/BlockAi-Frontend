import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  launch: () => void;
}

export default function Navbar({ launch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/signup");
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      }) as string[];
      
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast({
          title: "Wallet connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("User rejected")) {
        return;
      }
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    const address = walletAddress;
    setWalletAddress(null);
    toast({
      title: "Wallet disconnected",
      description: address ? `Disconnected from ${address.slice(0, 6)}...${address.slice(-4)}` : "Wallet disconnected",
    });
  };

  const handleWalletAction = () => {
    if (walletAddress) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Community", href: "/#community" },
  ];

  return (
    <nav 
      className="w-full fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 px-6 md:px-12 lg:px-20"
      style={{
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        backgroundColor: isScrolled ? 'rgba(11, 14, 26, 0.7)' : 'rgba(11, 14, 26, 0)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0)',
        transition: 'backdrop-filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <img src="/blockai.svg" alt="BlockAI" className="w-10 h-10" />
        <div className="text-white font-bold text-xl">BLOCKAI</div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 text-sm text-gray-300">
        {navLinks.map((link) => (
          <a key={link.name} href={link.href} className="hover:text-white cursor-pointer transition-colors">
            {link.name}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleWalletAction}
          className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#14F195] to-[#9B59B6] shadow-md hover:opacity-90 transition-opacity"
          title={walletAddress ? "Click to disconnect" : "Click to connect wallet"}
        >
          {walletAddress ? (
            <>
              <Wallet size={16} />
              <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
              <LogOut size={14} />
            </>
          ) : (
            <>
              <Wallet size={16} />
              <span>Connect wallet</span>
            </>
          )}
        </button>
        <button
          onClick={handleAuthAction}
          className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#14F195] to-[#9B59B6] shadow-md hover:opacity-90 transition-opacity"
        >
          {isAuthenticated ? (
            <>
              <span>Sign Out</span>
              <LogOut size={16} />
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0B0E1A] border-l border-white/10 text-white w-[300px]">
              <SheetHeader className="text-left border-b border-white/10 pb-6 mb-6">
                <SheetTitle className="flex items-center gap-2 text-white">
                  <img src="/blockai.svg" alt="BlockAI" className="w-8 h-8" />
                  <span className="font-bold text-xl">BLOCKAI</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a 
                      key={link.name} 
                      href={link.href} 
                      className="text-lg font-medium text-gray-300 hover:text-white hover:translate-x-2 transition-all"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>

                <div className="h-px bg-white/10 w-full my-2" />

                <button
                  onClick={handleWalletAction}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#14F195] to-[#9B59B6] shadow-lg hover:opacity-90 transition-opacity text-center"
                  title={walletAddress ? "Click to disconnect" : "Click to connect wallet"}
                >
                  {walletAddress ? (
                    <>
                      <Wallet size={16} />
                      <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
                      <LogOut size={14} />
                    </>
                  ) : (
                    <>
                      <Wallet size={16} />
                      <span>Connect wallet</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleAuthAction}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#14F195] to-[#9B59B6] shadow-lg hover:opacity-90 transition-opacity text-center"
                >
                  {isAuthenticated ? (
                    <>
                      <span>Sign Out</span>
                      <LogOut size={16} />
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
