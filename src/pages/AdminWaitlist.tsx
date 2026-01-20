import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Navbar } from "@/components/home";
import { CheckCircle, XCircle, Copy, Ticket, TelegramLogo, TwitterLogo } from '@phosphor-icons/react';

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  useEffect(() => {
    loadWaitlist();
  }, []);

  const loadWaitlist = async () => {
    try {
      const data = await api.getWaitlist();
      setWaitlist(data);
    } catch (error) {
    //   toast.error("Failed to load waitlist. Are you authorized?");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      const res = await api.generateInvite(1); // 1 use per invite default
      setGeneratedCode(res.code);
      toast.success("Invite Code Generated!");
    } catch (error) {
      toast.error("Failed to generate code");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#0B0E1A] text-white font-inter">
      <Navbar launch={() => {}} />
      
      <main className="pt-32 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-bold mb-2">Waitlist Management</h1>
                <p className="text-gray-400">Total Entries: {waitlist.length}</p>
                {/* 
                  SECURITY NOTE: This is a demo version. 
                  The admin authentication is currently disabled for demonstration purposes.
                  Ensure proper backend auth middleware is enabled in production.
                */}
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 rounded-lg text-sm max-w-md">
                   ⚠️ <b>Demo Mode:</b> Admin authentication is currently disabled. This page is publicly viewable for demo purposes.
                </div>
            </div>
            
            <div className="flex gap-4">
                {generatedCode && (
                    <div className="flex items-center gap-3 bg-[#14F195]/10 border border-[#14F195] px-4 py-2 rounded-xl">
                        <span className="font-mono text-[#14F195] font-bold">{generatedCode}</span>
                        <button onClick={() => copyToClipboard(generatedCode)} className="text-white hover:text-[#14F195]">
                            <Copy size={20} />
                        </button>
                    </div>
                )}
                
                <button 
                  onClick={handleInvite}
                  className="bg-[#9945FF] hover:bg-[#8e44ad] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
                >
                    <Ticket size={20} />
                    Generate Invite Code
                </button>
            </div>
        </div>

        <div className="bg-[#13151C] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Socials</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                        ) : waitlist.map((entry) => (
                            <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 font-medium">{entry.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {entry.telegram && <div className="flex items-center gap-1"><TelegramLogo /> {entry.telegram}</div>}
                                    {entry.twitter && <div className="flex items-center gap-1 mt-1"><TwitterLogo /> {entry.twitter}</div>}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate" title={entry.reason}>
                                    {entry.reason || "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${entry.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {entry.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(entry.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                       <button 
                                         onClick={async () => {
                                             try {
                                                 await api.approveWaitlist(entry.id);
                                                 toast.success("User Approved");
                                                 setWaitlist(prev => prev.map(p => p.id === entry.id ? { ...p, status: 'APPROVED' } : p));
                                             } catch (e) {
                                                 toast.error("Failed to approve");
                                             }
                                         }}
                                         className="text-[#14F195] hover:text-white text-sm font-semibold border border-[#14F195]/30 px-3 py-1 rounded-lg hover:bg-[#14F195]/10 transition-colors"
                                       >
                                         Approve
                                       </button>
                                       <button 
                                         onClick={handleInvite}
                                         className="text-[#9945FF] hover:text-white text-sm font-semibold border border-[#9945FF]/30 px-3 py-1 rounded-lg hover:bg-[#9945FF]/10 transition-colors"
                                       >
                                         <Ticket size={16} />
                                       </button>
                                   </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!loading && waitlist.length === 0 && (
                <div className="p-12 text-center text-gray-500">No waitlist entries yet.</div>
            )}
        </div>
      </main>
    </div>
  );
}
