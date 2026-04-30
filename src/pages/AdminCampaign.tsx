import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/home";
import {
  CheckCircle, XCircle, Clock, TwitterLogo, Eye,
  Ticket, Copy, CaretDown, Funnel, MagnifyingGlass, ArrowsClockwise
} from "@phosphor-icons/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Submission {
  id: string;
  userId: string;
  section: string;
  platform: string;
  tweetUrl: string;
  status: string;
  reviewNote: string | null;
  pointsAwarded: number;
  createdAt: string;
  user: { fullName: string | null; email: string | null };
}

const SECTION_LABELS: Record<string, string> = {
  chat: "AI Chat",
  market: "Market Analysis",
  "smart-contracts": "Smart Contracts",
  nft: "NFT Generator",
  "wallet-intel": "Chain Scanner",
};

export default function AdminCampaign() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [investorCode, setInvestorCode] = useState("");
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, [filter]);

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const query = filter !== "ALL" ? `?status=${filter}` : "";
      const res = await fetch(`${API_URL}/api/campaign/admin/feedback${query}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (e) {
      console.error("Failed to load submissions:", e);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setReviewingId(id);
    try {
      const res = await fetch(`${API_URL}/api/campaign/admin/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id, action: "approve" }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg(data.message, "success");
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "APPROVED", pointsAwarded: data.pointsAwarded } : s));
      } else {
        showMsg(data.error, "error");
      }
    } catch (e) { showMsg("Failed to approve", "error"); }
    setReviewingId(null);
  };

  const handleReject = async (id: string) => {
    setReviewingId(id);
    try {
      const res = await fetch(`${API_URL}/api/campaign/admin/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id, action: "reject", reviewNote: rejectNote }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("Feedback rejected", "success");
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "REJECTED" } : s));
      } else {
        showMsg(data.error, "error");
      }
    } catch (e) { showMsg("Failed to reject", "error"); }
    setReviewingId(null);
    setShowRejectModal(null);
    setRejectNote("");
  };

  const handleCreateInvestorCode = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaign/admin/investor-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(investorCode ? { code: investorCode } : { count: 1 }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedCodes(data.codes);
        setInvestorCode("");
        showMsg(`Generated ${data.codes.length} code(s)`, "success");
      } else {
        showMsg(data.error, "error");
      }
    } catch (e) { showMsg("Failed to generate code", "error"); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showMsg("Copied!", "success");
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20",
      APPROVED: "bg-[#14F195]/15 text-[#14F195] border-[#14F195]/20",
      REJECTED: "bg-red-400/15 text-red-400 border-red-400/20",
    };
    const icons: Record<string, React.ReactNode> = {
      PENDING: <Clock size={12} />,
      APPROVED: <CheckCircle size={12} />,
      REJECTED: <XCircle size={12} />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${styles[status] || ""}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const pendingCount = submissions.filter(s => s.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#0B0E1A] text-white font-inter">
      <Navbar launch={() => {}} />

      {/* Toast */}
      {message && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-bold border ${
          message.type === "success" ? "bg-[#14F195]/10 border-[#14F195]/20 text-[#14F195]" : "bg-red-400/10 border-red-400/20 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#13151C] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-3">Reject Feedback</h3>
            <p className="text-sm text-neutral-400 mb-4">Optionally provide a reason:</p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-neutral-700 focus:outline-none focus:border-red-400/30 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowRejectModal(null); setRejectNote(""); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-neutral-400 font-bold text-sm hover:bg-white/[0.08] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={reviewingId === showRejectModal}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 font-bold text-sm hover:bg-red-400/15 transition-all disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Campaign Admin</h1>
            <p className="text-neutral-500 text-sm">Review feedback submissions and manage access codes</p>
          </div>

          {/* Investor code generator */}
          <div className="flex items-center gap-3">
            {generatedCodes.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#14F195]/10 border border-[#14F195]/20">
                <span className="font-mono text-[#14F195] text-sm font-bold">{generatedCodes[generatedCodes.length - 1]}</span>
                <button onClick={() => copyToClipboard(generatedCodes[generatedCodes.length - 1])} className="text-white hover:text-[#14F195]">
                  <Copy size={16} />
                </button>
              </div>
            )}
            <input
              value={investorCode}
              onChange={(e) => setInvestorCode(e.target.value)}
              placeholder="Custom code..."
              className="px-3 py-2 rounded-xl bg-[#13151C] border border-white/10 text-white text-sm font-mono placeholder:text-neutral-700 w-40 focus:outline-none focus:border-[#9945FF]/30"
            />
            <button
              onClick={handleCreateInvestorCode}
              className="bg-[#9945FF] hover:bg-[#8833ee] text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <Ticket size={16} /> Bypass Code
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(["PENDING", "ALL", "APPROVED", "REJECTED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filter === f
                  ? "bg-white/[0.06] border-white/10 text-white"
                  : "bg-transparent border-white/[0.04] text-neutral-600 hover:text-neutral-400"
              }`}
            >
              {f}
              {f === "PENDING" && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-[#F59E0B]/20 text-[#F59E0B] text-[10px]">{pendingCount}</span>
              )}
            </button>
          ))}
          <button
            onClick={() => loadSubmissions()}
            disabled={loading}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-bold border bg-transparent border-white/[0.04] text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <ArrowsClockwise size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Submissions table */}
        <div className="bg-[#13151C] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.03] text-neutral-600 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Section</th>
                  <th className="px-5 py-4">Tweet Link</th>
                  <th className="px-5 py-4">Platform</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">PTS</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-neutral-600">Loading submissions...</td></tr>
                ) : submissions.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-neutral-600">No submissions found.</td></tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.015] transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-white">{sub.user?.fullName || "—"}</div>
                        <div className="text-[10px] text-neutral-600">{sub.user?.email || ""}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold text-neutral-300">{SECTION_LABELS[sub.section] || sub.section}</span>
                      </td>
                      <td className="px-5 py-4 max-w-[200px]">
                        <a
                          href={sub.tweetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#1DA1F2] hover:underline truncate block font-mono"
                        >
                          {sub.tweetUrl.length > 45 ? sub.tweetUrl.substring(0, 45) + "..." : sub.tweetUrl}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-neutral-500 capitalize">{sub.platform}</span>
                      </td>
                      <td className="px-5 py-4">{statusBadge(sub.status)}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold text-[#F59E0B] font-mono">
                          {sub.pointsAwarded > 0 ? `+${sub.pointsAwarded}` : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-neutral-600">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        {sub.status === "PENDING" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(sub.id)}
                              disabled={reviewingId === sub.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[#14F195] border border-[#14F195]/20 text-xs font-bold hover:bg-[#14F195]/10 transition-all disabled:opacity-50"
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button
                              onClick={() => setShowRejectModal(sub.id)}
                              disabled={reviewingId === sub.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-400 border border-red-400/20 text-xs font-bold hover:bg-red-400/10 transition-all disabled:opacity-50"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                            <a
                              href={sub.tweetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all"
                              title="View tweet"
                            >
                              <Eye size={14} />
                            </a>
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-700">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Total Submissions", value: submissions.length, color: "#9945FF" },
            { label: "Pending Review", value: submissions.filter(s => s.status === "PENDING").length, color: "#F59E0B" },
            { label: "Approved", value: submissions.filter(s => s.status === "APPROVED").length, color: "#14F195" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-[#13151C] border border-white/5">
              <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white font-mono mt-1" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
