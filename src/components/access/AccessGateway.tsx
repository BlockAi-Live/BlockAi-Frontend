import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { LockKey, CircleNotch } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface AccessGatewayProps {
  children: React.ReactNode;
}

export const AccessGateway: React.FC<AccessGatewayProps> = ({ children }) => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If not logged in, we might want to show login prompt or just let them see (but they can't chat anyway without auth)
  // Assuming this gateway protects the *authorized* chat.
  // If user is logged in BUT access is NOT granted:
  const isLocked = isAuthenticated && user && !user.isAccessGranted;

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await api.redeemAccessCode(accessCode, user.id);
      toast.success("Access Unlocked! Welcome to the Beta.");
      
      // Update local user state
      updateUser({ isAccessGranted: true });
    } catch (error: any) {
      toast.error(error.message || "Invalid Access Code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLocked) {
    return (
      <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-[#0B0E1A] overflow-hidden rounded-3xl border border-white/5">
        {/* Blurred Background Mockup (optional) or just simple dark UI */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#14F195]/5 to-[#9945FF]/5" />
        
        <div className="relative z-10 max-w-md w-full p-8 bg-[#13151C]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <LockKey size={32} className="text-[#14F195]" weight="duotone" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">Early Access Required</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
                BlockAI is currently in closed beta. Please enter your access code to unlock AI interactions and start earning points.
            </p>

            <form onSubmit={handleRedeem} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Enter Access Code" 
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#14F195]/50 transition-colors text-center tracking-widest uppercase font-mono"
                />
                
                <button 
                    disabled={isSubmitting || !accessCode}
                    className="w-full bg-[#14F195] hover:bg-[#10e291] text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <CircleNotch className="animate-spin" size={20} /> : "Unlock Access"}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-sm text-gray-500">
                    Don't have a code? <a href="/waitlist" className="text-[#14F195] hover:underline">Join the Waitlist</a>
                </p>
            </div>
        </div>
      </div>
    );
  }

  // If authenticated and unlocked, OR if not authenticated (handled by parent Auth guard usually), render children.
  return <>{children}</>;
};
