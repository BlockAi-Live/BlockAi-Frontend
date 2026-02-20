import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut, ChevronDown, ArrowRight, BarChart3, MessageSquare, Bell, Wallet, FileText, Map, Coins, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
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
import { motion, AnimatePresence } from "framer-motion";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
];

const productsItems = [
  { icon: BarChart3, label: "Dashboard", desc: "Real-time portfolio & analytics", href: "/dashboard", accent: "#14F195" },
  { icon: MessageSquare, label: "AI Chat", desc: "Natural language on-chain queries", href: "/dashboard", accent: "#9945FF" },
  { icon: Bell, label: "Smart Alerts", desc: "Whale moves & smart-money signals", href: "/dashboard", accent: "#14F195" },
  { icon: Wallet, label: "Wallet Tracker", desc: "Monitor any wallet live", href: "/dashboard", accent: "#9945FF" },
];

const resourcesItems = [
  { icon: Map, label: "Roadmap", desc: "Development milestones", href: "/Roadmap.pdf", accent: "#14F195" },
  { icon: Coins, label: "Tokenomics", desc: "Distribution & utility model", href: "/Tokenomics.pdf", accent: "#9945FF" },
  { icon: FileText, label: "Whitepaper", desc: "Technical architecture", href: "/Whitepaper.pdf", accent: "#14F195" },
  { icon: BookOpen, label: "Documentation", desc: "Guides & API reference", href: "#", accent: "#9945FF" },
];

// ─── Premium Dropdown ───
function DropdownMenu({
  items,
  title,
  isOpen,
  onClose,
}: {
  items: typeof productsItems;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-full left-0 mt-3 z-[60]"
        >
          <div className="bg-[#0c0c0e] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/70 w-[320px]">
            {/* Top accent bar */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#14F195]/40 to-transparent" />

            {/* Header */}
            <div className="px-4 pt-3.5 pb-2">
              <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-[0.15em]">{title}</p>
            </div>

            {/* Items */}
            <div className="px-2 pb-2 space-y-0.5">
              {items.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-all duration-200 group relative"
                >
                  {/* Icon with accent glow on hover */}
                  <div className="relative">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 border"
                      style={{
                        backgroundColor: `${item.accent}08`,
                        borderColor: `${item.accent}15`,
                      }}
                    >
                      <item.icon
                        className="w-[18px] h-[18px] transition-colors duration-200"
                        style={{ color: `${item.accent}90` }}
                      />
                    </div>
                    {/* Subtle glow on hover */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"
                      style={{ backgroundColor: `${item.accent}15` }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-neutral-200 group-hover:text-white transition-colors">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-neutral-600 group-hover:text-neutral-500 transition-colors">
                      {item.desc}
                    </p>
                  </div>

                  {/* Arrow on hover */}
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </a>
              ))}
            </div>

            {/* Bottom accent */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-neutral-800/50 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Navbar ───
interface NavbarProps {
  launch: () => void;
}

export default function Navbar({ launch }: NavbarProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { isAuthenticated, logout, user, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const account = useActiveAccount();
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Smoothly slide up once user scrolls past the ticker (home page only)
  useEffect(() => {
    if (!isHomePage) {
      setIsPinned(true);
      return;
    }
    const handleScroll = () => setIsPinned(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    const acct = wallet.getAccount();
    const address = acct?.address;
    if (address) {
      try {
        // Try login first
        let result = await api.walletLogin(address);
        
        // If user doesn't exist, auto-register
        if (!result) {
          result = await api.walletRegister(address, `User_${address.slice(0, 6)}`);
        }
        
        if (result?.token && result?.user) {
          const refCode = localStorage.getItem("blockai_ref_code");
          login(result.token, {
            ...result.user,
            avatar: `https://effigy.im/a/${address}.png`,
            referralCode: refCode,
          });
          toast({ title: "Wallet Connected", description: "Successfully logged in with wallet." });
          if (!window.location.pathname.includes("/genesis")) navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("Wallet auth error:", error);
        toast({ title: "Wallet Login Failed", description: error.message || "Could not authenticate wallet.", variant: "destructive" });
      }
    }
  };

  const handleEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const customTheme = darkTheme({
    colors: {
      primaryButtonBg: "#14F195",
      primaryButtonText: "#000000",
      modalBg: "#09090b",
      borderColor: "#262626",
      accentText: "#14F195",
    },
  });

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 z-50 px-4 pt-3 transition-[top] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ top: isHomePage ? (isPinned ? 0 : 44) : 0 }}
    >
      <div
        className={`max-w-5xl mx-auto flex items-center justify-between px-5 py-2 rounded-2xl border transition-all duration-300 ${
          isPinned
            ? "bg-[#0a0a0c]/90 backdrop-blur-md border-neutral-800/80 shadow-lg shadow-black/30"
            : "bg-[#0a0a0c]/50 border-neutral-800/30"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer shrink-0">
          <img src="/blockai.svg" alt="BlockAI" className="w-10 h-10" />
          <span className="text-white font-bold text-lg tracking-tight">BLOCKAI</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5 text-[13px]">
          <div
            className="relative"
            onMouseEnter={() => handleEnter("products")}
            onMouseLeave={handleLeave}
          >
            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              openDropdown === "products" ? "text-white bg-white/[0.04]" : "text-neutral-500 hover:text-white hover:bg-white/[0.04]"
            }`}>
              Products
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${openDropdown === "products" ? "rotate-180" : ""}`} />
            </button>
            <DropdownMenu items={productsItems} title="Products" isOpen={openDropdown === "products"} onClose={() => setOpenDropdown(null)} />
          </div>

          <div
            className="relative"
            onMouseEnter={() => handleEnter("resources")}
            onMouseLeave={handleLeave}
          >
            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              openDropdown === "resources" ? "text-white bg-white/[0.04]" : "text-neutral-500 hover:text-white hover:bg-white/[0.04]"
            }`}>
              Resources
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${openDropdown === "resources" ? "rotate-180" : ""}`} />
            </button>
            <DropdownMenu items={resourcesItems} title="Resources" isOpen={openDropdown === "resources"} onClose={() => setOpenDropdown(null)} />
          </div>

          <a href="/about" className="px-3 py-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-all">About</a>
          <a href="/team" className="px-3 py-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-all">Team</a>
          <a href="/genesis" className="px-3 py-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-all">Genesis</a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
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
                connectButton={{ label: "Connect" }}
              />
            </div>
          )}

          <button
            onClick={handleAuthAction}
            className="hidden md:flex items-center px-4 py-1.5 rounded-full text-[13px] font-medium text-neutral-400 hover:text-white transition-colors"
          >
            {isAuthenticated ? "Sign Out" : "Login"}
          </button>

          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium text-white bg-white/[0.08] border border-neutral-700/60 hover:bg-white/[0.12] hover:border-neutral-600 transition-all group"
          >
            {isAuthenticated ? "Dashboard" : "Start for free"}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-neutral-400 p-1.5 hover:text-white transition-colors">
                  <Menu size={18} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#09090b] border-l border-neutral-800 text-white w-[280px]">
                <SheetHeader className="text-left border-b border-neutral-800 pb-5 mb-5">
                  <SheetTitle className="flex items-center gap-2.5 text-white">
                    <img src="/blockai.svg" alt="BlockAI" className="w-7 h-7" />
                    <span className="font-bold text-base">BlockAI</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider px-3 mb-1">Products</p>
                  {productsItems.map((item, i) => (
                    <a key={i} href={item.href} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all">
                      <item.icon className="w-4 h-4" /> {item.label}
                    </a>
                  ))}
                  <div className="h-px bg-neutral-800 my-3" />
                  <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider px-3 mb-1">Resources</p>
                  {resourcesItems.map((item, i) => (
                    <a key={i} href={item.href} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all">
                      <item.icon className="w-4 h-4" /> {item.label}
                    </a>
                  ))}
                  <div className="h-px bg-neutral-800 my-3" />
                  <a href="/about" className="px-3 py-2 text-sm text-neutral-400 hover:text-white transition-all">About</a>
                  <a href="/team" className="px-3 py-2 text-sm text-neutral-400 hover:text-white transition-all">Team</a>
                  <a href="/genesis" className="px-3 py-2 text-sm text-neutral-400 hover:text-white transition-all">Genesis</a>
                  <div className="h-px bg-neutral-800 my-3" />
                  {account && (
                    <div className="w-full flex justify-center mb-2">
                      <ConnectButton client={client} theme={customTheme} wallets={wallets} onConnect={handleWalletConnect}
                        connectModal={{ size: "compact", titleIcon: "https://blockai-frontend-v1.vercel.app/blockai.svg", showThirdwebBranding: false }}
                        connectButton={{ label: "Connect Wallet" }}
                      />
                    </div>
                  )}
                  <button onClick={handleAuthAction} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-neutral-200 transition-colors">
                    {isAuthenticated ? (<>Sign Out <LogOut size={14} /></>) : "Sign Up"}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
