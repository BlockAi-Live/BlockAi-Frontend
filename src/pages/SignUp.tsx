"use client";

import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Wallet, Github, ChevronRight, Eye, EyeOff, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import { FaGoogle } from "react-icons/fa";

export function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const handleGitHubLogin = () => {
 window.location.href = "https://blockai-api.onrender.com/auth/github";
  };

  const handleGoogleLogin = () => {
 window.location.href = "https://blockai-api.onrender.com/auth/google";
  };

  const handleXLogin = () => {
 window.location.href = "https://blockai-api.onrender.com/auth/twitter";
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.register(formData);
      login(response.token, response.user);
      toast({
        title: "Account created",
        description: "Welcome to Block AI!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0d0f18]">
      {/* Ambient Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4]/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <img src="/blockai.svg" alt="BlockAI" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-white tracking-tight">BLOCK AI</h1>
          </motion.div>
          <p className="text-gray-400">Initialize your access to the network</p>
        </div>

        <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-[#9945FF] to-[#14F195]">
          <div className="p-8 bg-[#0d0f18] rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6366F1] transition-colors" size={18} />
                  <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#9945FF]/50 to-[#14F195]/50">
                    <input 
                      type="text" 
                      placeholder="Victor Linkie"
                      className="w-full bg-[#0d0f18] border-0 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none transition-all"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6366F1] transition-colors" size={18} />
                  <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#9945FF]/50 to-[#14F195]/50">
                    <input 
                      type="email" 
                      placeholder="victorlinkie@example.com"
                      className="w-full bg-[#0d0f18] border-0 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none transition-all"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6366F1] transition-colors" size={18} />
                  <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#9945FF]/50 to-[#14F195]/50">
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-[#0d0f18] border-0 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-gray-500 focus:outline-none transition-all"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#9945FF]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0d0f18] px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="col-span-2 relative group overflow-hidden rounded-xl p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#0d0f18] group-hover:bg-opacity-90 transition-all h-full rounded-xl flex items-center justify-center gap-3 py-3.5">
                  <Star size={20} className="text-[#FFD700] fill-[#FFD700]" />
                  <span className="font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Genesis Pass</span>
                </div>
              </button>

              <button type="button" className="col-span-2 relative group overflow-hidden rounded-xl p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#0d0f18] group-hover:bg-opacity-90 transition-all h-full rounded-xl flex items-center justify-center gap-3 py-3.5">
                  <Wallet size={20} className="text-[#3B82F6]" />
                  <span className="font-bold text-white group-hover:text-[#3B82F6] transition-colors">Connect Wallet</span>
                </div>
              </button>
              <button type="button"  onClick={handleGoogleLogin} className="col-span-2 relative group overflow-hidden rounded-xl p-[1px]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b60f6,#00a231,#ffcc26,#ff2116)] group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#0d0f18] group-hover:bg-opacity-90 transition-all h-full rounded-xl flex items-center justify-center gap-3 py-3.5">
                  <FaGoogle size={20} className="" />
                  <span className="font-bold text-white group-hover:text-[#3B82F6] transition-colors">Google</span>
                </div>
              </button>
              
              <button type="button"  onClick={handleGitHubLogin} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all hover:-translate-y-0.5">
                <Github size={18} />
                <span className="text-sm font-medium">GitHub</span>
              </button>

              <button type="button" onClick={handleXLogin} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                <span className="text-sm font-medium">Twitter</span>
              </button>


            
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="text-[#14F195] hover:text-[#14F195]/80 font-medium transition-colors inline-flex items-center gap-1">
                Sign in <ChevronRight size={14} />
              </Link>
            </p>
          </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>By joining, you agree to our Terms of Service and Privacy Policy.</p>
          <p className="mt-2">© 2024 BLOCK AI Protocol</p>
        </div>
      </motion.div>
    </main>
  );
}

export default SignUpPage;
