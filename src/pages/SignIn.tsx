"use client";
import { motion } from "framer-motion";
import { EnvelopeSimple, Lock, ArrowRight, Eye, EyeSlash, GithubLogo, Wallet, ShieldCheck } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import { FaGoogle } from "react-icons/fa";
import { darkTheme, useConnectModal } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "../client";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
];

const customTheme = darkTheme({
    colors: {
        primaryButtonBg: "#14F195",
        primaryButtonText: "#000000",
        modalBg: "#0a0c14",
        borderColor: "#14F195",
        accentText: "#14F195",
    },
});

export function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => { logout(); }, []);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const handleWalletConnect = async (wallet: any) => {
    const account = wallet.getAccount();
    const address = account?.address;
    if (address) {
      try {
        const response = await api.walletLogin(address);
        if (!response) {
            setConnectedWallet(address);
            setShowUsernameModal(true);
            return;
        }
        login(response.token, response.user);
        toast({ title: "Wallet Connected", description: "Successfully logged in." });
        navigate("/dashboard");
      } catch (error) {
        toast({ title: "Wallet Error", description: "Failed to authenticate wallet.", variant: "destructive" });
      }
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectedWallet || !username) return;
    setIsLoading(true);
    try {
        const response = await api.walletRegister(connectedWallet, username);
        login(response.token, response.user);
        toast({ title: "Account Created", description: `Welcome to BlockAI, ${username}!` });
        navigate("/dashboard");
    } catch (error) {
        toast({ title: "Registration Failed", description: "Could not create account.", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.login(formData);
      login(response.token, response.user);
      toast({ title: "Welcome back!", description: "Successfully signed in." });
      navigate("/dashboard");
    } catch (error) {
      toast({ title: "Sign in failed", description: error instanceof Error ? error.message : "Invalid credentials", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleGitHubLogin = () => { window.location.href = "https://blockai-api.onrender.com/auth/github"; };
  const handleGoogleLogin = () => { window.location.href = "https://blockai-api.onrender.com/auth/google"; };
  const handleXLogin = () => { window.location.href = "https://blockai-api.onrender.com/auth/twitter"; };
  
  const { connect } = useConnectModal();
  const handleWalletClick = async () => {
    try {
      const wallet = await connect({ client, wallets, theme: customTheme });
      handleWalletConnect(wallet);
    } catch (error) { console.error("Failed to connect:", error); }
  };

  return (
    <main className="min-h-screen flex relative overflow-hidden bg-[#0a0c14]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#14F195]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-[#9945FF]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <img src="/blockai.svg" alt="BlockAI" className="w-9 h-9" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-widest">BLOCKAI</h1>
              <p className="text-[8px] text-neutral-600 font-medium tracking-[0.3em]">INTELLIGENCE</p>
            </div>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              The AI Layer<br />
              <span className="bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">for Web3</span>
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed mb-10">
              Analyze wallets, decode transactions, generate smart contracts, and monitor on-chain activity — all powered by AI intelligence.
            </p>
            
            <div className="space-y-4">
              {[
                "AI-powered wallet & transaction analysis",
                "Smart contract generation & auditing",
                "Real-time on-chain intelligence alerts",
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#14F195]/10 flex items-center justify-center shrink-0">
                    <ShieldCheck size={13} weight="fill" className="text-[#14F195]" />
                  </div>
                  <span className="text-sm text-neutral-400">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-[10px] text-neutral-500 font-medium">© 2026 BLOCKAI Protocol</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <img src="/blockai.svg" alt="BlockAI" className="w-8 h-8" />
              <span className="text-xl font-bold text-white tracking-widest">BLOCKAI</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-neutral-500 text-sm">Sign in to continue to your dashboard</p>
          </div>

          {/* Wallet Connect — primary CTA */}
          <button
            type="button"
            onClick={handleWalletClick}
            className="w-full mb-4 flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold text-sm hover:bg-white/[0.07] hover:border-white/[0.12] transition-all active:scale-[0.98]"
          >
            <Wallet size={18} weight="duotone" /> Connect Wallet
          </button>

          {/* OAuth row */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-1.5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl text-neutral-500 hover:text-white transition-all">
              <FaGoogle size={13} />
              <span className="text-[11px] font-medium">Google</span>
            </button>
            <button type="button" onClick={handleGitHubLogin} className="flex items-center justify-center gap-1.5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl text-neutral-500 hover:text-white transition-all">
              <GithubLogo size={14} />
              <span className="text-[11px] font-medium">GitHub</span>
            </button>
            <button type="button" onClick={handleXLogin} className="flex items-center justify-center gap-1.5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl text-neutral-500 hover:text-white transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              <span className="text-[11px] font-medium">Twitter</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative py-1 mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.04]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="bg-[#0a0c14] px-3 text-neutral-700">or with email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <EnvelopeSimple weight="duotone" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-700" size={16} />
                <input 
                  type="email" 
                  placeholder="Email address"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-neutral-700 focus:outline-none focus:border-[#14F195]/30 transition-colors"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock weight="duotone" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-700" size={16} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 pl-10 pr-10 text-white text-sm placeholder:text-neutral-700 focus:outline-none focus:border-[#14F195]/30 transition-colors"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-neutral-500 transition-colors">
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-3.5 h-3.5 rounded border transition-all flex items-center justify-center ${
                    rememberMe ? 'bg-[#14F195] border-[#14F195]' : 'border-white/10 group-hover:border-white/20'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-2 h-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
                <span className="text-[11px] text-neutral-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[11px] text-neutral-600 hover:text-[#14F195] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#14F195] text-black font-bold py-2.5 rounded-xl hover:bg-[#14F195]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={15} weight="bold" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 text-xs">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#14F195] hover:text-[#14F195]/80 font-semibold transition-colors">
                Create account
              </Link>
            </p>
          </div>
          
          <div className="lg:hidden mt-8 text-center text-[10px] text-neutral-500 font-medium">
            <p>© 2026 BLOCKAI Protocol</p>
          </div>
        </motion.div>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm bg-[#0d0f18] border border-white/[0.06] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                 <div className="h-[2px] bg-gradient-to-r from-transparent via-[#14F195]/40 to-transparent absolute top-0 left-0 right-0" />
                 <h2 className="text-xl font-bold text-white mb-2">Finish Setup</h2>
                 <p className="text-neutral-500 text-sm mb-6">Choose a username to identify yourself on the network.</p>
                 <form onSubmit={handleUsernameSubmit}>
                    <div className="mb-6">
                        <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-2">Username</label>
                        <input type="text" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#14F195]/30 transition-colors" placeholder="e.g. Satoshi" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl bg-[#14F195] text-black font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                         {isLoading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Complete Registration"}
                    </button>
                 </form>
            </motion.div>
        </div>
      )}
    </main>
  );
}

export default SignInPage;
