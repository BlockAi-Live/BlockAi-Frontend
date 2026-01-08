import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Navbar, Footer } from "@/components/home";
import { toast } from 'sonner';
import { CircleNotch, PaperPlaneRight, TelegramLogo, TwitterLogo, Wallet, Envelope } from '@phosphor-icons/react';

export default function Waitlist() {
  const [formData, setFormData] = useState({
    email: '',
    walletAddress: '',
    telegram: '',
    twitter: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.joinWaitlist(formData);
      setIsSuccess(true);
      toast.success("Successfully joined the waitlist!");
    } catch (error: any) {
      toast.error(error.message || "Failed to join waitlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E1A] text-white font-inter relative overflow-hidden">
        {/* Background Ambience */}
        <div 
        className="fixed inset-0 pointer-events-none w-full"
        style={{
            background: "radial-gradient(circle at 50% 0%, rgba(20, 241, 149, 0.05) 0%, rgba(13, 15, 24, 0) 50%)",
            minHeight: '100%'
        }}
        />

      <Navbar launch={() => {}} />

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-2xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">Inner Circle</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
                BlockAI is currently in closed beta. Apply for an access code to unlock AI limits and earn rewards.
            </p>
        </div>

        {isSuccess ? (
            <div className="w-full bg-[#13151C]/80 backdrop-blur-xl border border-[#14F195]/20 rounded-3xl p-8 md:p-12 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-[#14F195]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PaperPlaneRight size={40} className="text-[#14F195]" weight="fill" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Request Received!</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    We've added you to the priority list. Keep an eye on your email (or DM) for your exclusive access code.
                </p>
                <div className="bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl p-4 text-[#14F195] text-sm">
                    Tip: Follow us on Twitter for faster approval.
                </div>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="w-full bg-[#13151C]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6">
                
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                            required
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195] outline-none transition-all placeholder-gray-600"
                        />
                    </div>
                </div>

                {/* Wallet */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Wallet Address (Optional)</label>
                    <div className="relative">
                        <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                            type="text"
                            placeholder="0x..."
                            value={formData.walletAddress}
                            onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195] outline-none transition-all placeholder-gray-600 font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Telegram */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Telegram Username</label>
                        <div className="relative">
                            <TelegramLogo className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="text"
                                placeholder="@username"
                                value={formData.telegram}
                                onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195] outline-none transition-all placeholder-gray-600"
                            />
                        </div>
                    </div>

                    {/* Twitter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Twitter Handle</label>
                        <div className="relative">
                            <TwitterLogo className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="text"
                                placeholder="@handle"
                                value={formData.twitter}
                                onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195] outline-none transition-all placeholder-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Why do you want access?</label>
                    <textarea 
                        rows={3}
                        placeholder="I'm a developer/investor interested in AI..."
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195] outline-none transition-all placeholder-gray-600 resize-none"
                    />
                </div>

                <button 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#14F195] to-[#10e291] hover:from-[#10e291] hover:to-[#0dbf7a] text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#14F195]/20 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                    {isSubmitting ? <CircleNotch className="animate-spin" size={24} /> : "Request Access"}
                </button>

            </form>
        )}

      </main>

      <Footer />
    </div>
  );
}
