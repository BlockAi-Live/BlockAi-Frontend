import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "../../client";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
];

interface NavbarProps {
  launch: () => void;
}

export default function Navbar({ launch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, user, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const account = useActiveAccount();

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

  const handleWalletConnect = async (wallet: any) => {
    const account = wallet.getAccount();
    const address = account?.address;
    if (address) {
      const refCode = localStorage.getItem('blockai_ref_code');
      login("wallet-mock-token-" + address, {
        id: address,
        email: `${address.slice(0,6)}...@wallet.connect`,
        fullName: "Wallet User",
        walletAddress: address,
        avatar: `https://effigy.im/a/${address}.png`,
        referralCode: refCode
      });
      toast({
        title: "Wallet Connected",
        description: "Successfully logged in with wallet.",
      });
      
      // Don't redirect if on genesis page
      if (!window.location.pathname.includes('/genesis')) {
        navigate("/dashboard");
      }
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Genesis", href: "/genesis" },
    { name: "Community", href: "/#community" },
  ];

  const customTheme = darkTheme({
    colors: {
        primaryButtonBg: "#14F195",
        primaryButtonText: "#000000",
        modalBg: "#0d0f18",
        borderColor: "#14F195",
        accentText: "#14F195",
    },
  });

  return (
    <nav 
      className="w-full sticky top-0 left-0 right-0 z-50 flex items-center justify-between py-4 px-6 md:px-12 lg:px-20"
      style={{
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        backgroundColor: isScrolled ? 'rgba(11, 14, 26, 0.7)' : 'rgba(11, 14, 26, 0)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0)',
        transition: 'all 0.3s ease'
      }}
    >
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <img src="/blockai.svg" alt="BlockAI" className="w-10 h-10" />
        <div className="text-white font-bold text-xl">BLOCKAI</div>
      </Link>

      {/* Desktop Navigation */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-8 text-sm text-gray-300">
        {navLinks.map((link) => (
          <a key={link.name} href={link.href} className="hover:text-white cursor-pointer transition-colors">
            {link.name}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        
        {/* Thirdweb Connect Button - Only show when connected */}
        {account && (
            <div className="hidden md:block">
                <ConnectButton 
                    client={client}
                    theme={customTheme}
                    wallets={wallets}
                    onConnect={handleWalletConnect}
                    connectModal={{
                        size: "compact",
                        titleIcon: "https://blockai-frontend-v1.vercel.app/blockai.svg",
                        showThirdwebBranding: false,
                    }}
                    connectButton={{
                        label: "Connect Wallet",
                    }}
                />
            </div>
        )}

        <button
          onClick={handleAuthAction}
          className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#14F195] to-[#9B59B6] shadow-md hover:opacity-90 transition-opacity text-white"
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
                
                {account && (
                    <div className="w-full flex justify-center">
                        <ConnectButton 
                            client={client}
                            theme={customTheme}
                            wallets={wallets}
                            onConnect={handleWalletConnect}
                            connectModal={{
                                size: "compact",
                                titleIcon: "https://blockai-frontend-v1.vercel.app/blockai.svg",
                                showThirdwebBranding: false,
                            }}
                            connectButton={{
                                label: "Connect Wallet",
                            }}
                        />
                    </div>
                )}

                <button
                  onClick={handleAuthAction}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#14F195] to-[#9B59B6] shadow-lg hover:opacity-90 transition-opacity text-white"
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
