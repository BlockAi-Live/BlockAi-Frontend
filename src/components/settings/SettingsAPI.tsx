import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Copy, Check, CreditCard, Shield, Lightning, ArrowsClockwise } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function SettingsAPI() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [simulatingPay, setSimulatingPay] = useState(false);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const data = await api.getBillingStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateKey = async () => {
    setGeneratingKey(true);
    try {
      await api.createApiKey("My API Key");
      toast({ title: "API Key Created", description: "Your new key is ready to use." });
      fetchStats();
    } catch (e) {
      toast({ title: "Error", description: "Failed to create key", variant: "destructive" });
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleSimulatePayment = async () => {
    setSimulatingPay(true);
    try {
      await api.simulatePayment();
      toast({ 
        title: "Payment Successful", 
        description: "10 USDC received. Tier upgraded to PAID.",
        className: "bg-green-900 border-green-800 text-green-100"
      });
      fetchStats();
    } catch (e) {
      toast({ title: "Payment Failed", description: "Simulation failed", variant: "destructive" });
    } finally {
      setSimulatingPay(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ description: "Copied to clipboard" });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading billing data...</div>;

  const billing = stats?.billing || {};
  const apiKey = stats?.keys?.[0]?.key;
  const isPaid = billing.tier === "PAID";
  const progress = Math.min((billing.dailyUsageCount / (isPaid ? 1000 : 10)) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-[#13151C] border border-white/5 relative overflow-hidden group"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${isPaid ? 'from-purple-500/10 to-blue-500/10' : 'from-gray-500/10 to-gray-800/10'} opacity-50`}></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-white/5 text-white"><Shield size={20} /></div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${isPaid ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                        {billing.tier || 'FREE'}
                    </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Plan Status</h3>
                <p className="text-2xl font-bold text-white mt-1">{isPaid ? 'Pro Investor' : 'Starter'}</p>
                 {!isPaid && (
                   <button onClick={handleSimulatePayment} disabled={simulatingPay} className="mt-3 text-xs text-[#14F195] hover:underline flex items-center gap-1">
                      {simulatingPay ? "Processing..." : "Upgrade to Pro ->"}
                   </button>
                 )}
            </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-[#13151C] border border-white/5"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-white/5 text-[#14F195]"><Lightning size={20} /></div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Credits Remaining</h3>
            <p className="text-2xl font-bold text-white mt-1">{billing.credits}</p>
            <p className="text-xs text-gray-500 mt-2">Cost: ~1 Credit / Request</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-[#13151C] border border-white/5"
        >
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-white/5 text-blue-400"><ArrowsClockwise size={20} /></div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Daily Limit</h3>
            <div className="mt-2 w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{billing.dailyUsageCount} Used</span>
                <span>{isPaid ? 1000 : 10} Limit</span>
            </div>
        </motion.div>
      </div>

      {/* API Key Management */}
      <div className="p-6 rounded-2xl bg-[#13151C] border border-white/5">
        <h2 className="text-lg font-bold text-white mb-4">API Access Keys</h2>
        {apiKey ? (
            <div className="bg-[#0d0f18] p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                <code className="text-gray-300 font-mono text-sm tracking-wide">
                    {apiKey}
                </code>
                <button 
                  onClick={() => copyToClipboard(apiKey)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
            </div>
        ) : (
            <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No API Keys generated yet.</p>
                <button 
                  onClick={handleCreateKey}
                  disabled={generatingKey}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
                >
                    {generatingKey ? "Generating..." : "Generate API Key"}
                </button>
            </div>
        )}
        <p className="text-xs text-gray-500 mt-4">
            Use this key in the <code>x-api-key</code> header for external requests.
        </p>
      </div>

      {/* X402 Payment Simulation */}
      <div className="p-6 rounded-2xl bg-[#13151C] border border-white/5">
         <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-[#14F195]" />
            Waitlist / Payment Simulation
         </h2>
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d0f18] p-6 rounded-xl border border-dashed border-[#14F195]/30">
            <div>
                <h3 className="text-white font-medium mb-1">Simulate X402 Payment</h3>
                <p className="text-sm text-gray-400">
                    This creates a mock transaction on Base Sepolia and verifies it instantly.
                </p>
            </div>
            <button 
                onClick={handleSimulatePayment}
                disabled={simulatingPay || isPaid}
                className="px-6 py-3 bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/50 rounded-xl font-bold hover:bg-[#14F195]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isPaid ? "Plan Active" : (simulatingPay ? "Verifying..." : "Simulate 10 USDC Pay")}
            </button>
         </div>
      </div>
    </div>
  );
}
