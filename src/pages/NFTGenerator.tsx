import React, { useState, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkle,
  CircleNotch,
  DownloadSimple,
  ArrowRight,
  Eraser,
  Image as ImageIcon,
  MagicWand,
} from "@phosphor-icons/react";

const EXAMPLE_PROMPTS = [
  "A cyberpunk samurai with neon armor standing in a futuristic Tokyo street, digital art style",
  "An ancient crystal dragon guarding a treasure of glowing ethereum coins, fantasy art",
  "A cosmic astronaut floating through a galaxy of Bitcoin and blockchain nodes, surreal",
  "A golden phoenix rising from digital flames in a dark cyber landscape, 4K detailed",
  "An abstract geometric wolf made of purple and green crystalline blockchain structures",
  "A futuristic AI robot artist painting on a holographic canvas in a neon-lit studio",
];

export default function NFTGeneratorPage() {
  const { user, updateUser } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const result = await api.generateNFT(prompt);
      
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        // Scroll to image
        setTimeout(() => {
          imageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      } else {
        setError("No image was returned. Try a different prompt.");
      }

      // Refresh points
      try {
        const { user: updatedUser } = await api.getMe(localStorage.getItem("auth_token") || "");
        if (updatedUser) updateUser({ points: updatedUser.points });
      } catch {}

    } catch (err: any) {
      console.error("NFT Generation Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blockai-nft-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
    }
  };

  const handleSurpriseMe = () => {
    const randomPrompt = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(randomPrompt);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0f18] relative">
      {/* Points badge */}
      <div className="absolute top-4 right-6 z-30">
        <div className="bg-[#13151C]/80 backdrop-blur-md border border-[#9945FF]/30 rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2 shadow-lg">
          <Sparkle size={14} weight="fill" className="text-[#9945FF]" />
          <span className="text-xs font-bold text-white">{user?.points || 0} PTS</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 pt-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            AI NFT Generator
          </h1>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Describe your vision and generate unique NFT artwork powered by AI.
          </p>
        </div>

        {/* Prompt Input Card */}
        <div className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl overflow-hidden mb-8">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} weight="duotone" className="text-[#9945FF]" />
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Prompt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSurpriseMe}
                className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-[#9945FF] hover:text-white hover:bg-[#9945FF]/10 rounded-lg transition-colors"
              >
                <MagicWand size={12} />
                Surprise Me
              </button>
              {prompt && (
                <button
                  onClick={() => { setPrompt(""); setImageUrl(null); setError(null); }}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Eraser size={12} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the NFT you want to create... Be detailed about style, colors, composition, and mood."
            className="w-full h-[120px] bg-transparent text-sm text-gray-200 placeholder:text-neutral-600 px-5 py-4 resize-none focus:outline-none"
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04] bg-white/[0.01]">
            <span className="text-[11px] text-neutral-600">
              {prompt.length} characters · +20 points per generation
            </span>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                !prompt.trim() || isLoading
                  ? "bg-white/5 text-neutral-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:shadow-lg hover:shadow-[#9945FF]/20"
              }`}
            >
              {isLoading ? (
                <>
                  <CircleNotch size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <MagicWand size={16} weight="bold" />
                  Generate NFT
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl p-12 mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-[#9945FF]/30 flex items-center justify-center">
                  <CircleNotch size={32} className="text-[#9945FF] animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full bg-[#9945FF]/10 animate-ping" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold mb-1">Creating your NFT...</p>
                <p className="text-neutral-500 text-xs">This may take 10-30 seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl px-5 py-4 mb-8">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Result — Generated Image */}
        {imageUrl && (
          <div ref={imageRef} className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl overflow-hidden">
            {/* Image Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#14F195]" />
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Generated NFT
                </span>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <DownloadSimple size={14} />
                Download
              </button>
            </div>

            {/* Image */}
            <div className="p-6 flex justify-center bg-[#0a0c14]/50">
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt="Generated NFT"
                  className="max-w-full max-h-[512px] rounded-xl shadow-2xl shadow-[#9945FF]/10 object-contain"
                  onError={() => setError("Failed to load the generated image.")}
                />
                {/* Glow effect */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
            </div>

            {/* Prompt Footer */}
            <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Sparkle size={12} weight="fill" className="text-[#9945FF] shrink-0" />
                <span className="text-[11px] text-neutral-500 truncate">
                  "{prompt}"
                </span>
              </div>
              <span className="text-[11px] text-[#14F195] font-semibold ml-4 shrink-0">
                +20 PTS
              </span>
            </div>
          </div>
        )}

        {/* Inspiration Grid */}
        {!imageUrl && !isLoading && (
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 px-1">
              Need Inspiration?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EXAMPLE_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(p)}
                  className="text-left px-4 py-3 rounded-xl bg-[#13151C]/40 border border-white/[0.04] hover:border-[#9945FF]/30 hover:bg-[#9945FF]/[0.03] transition-all text-sm text-neutral-400 hover:text-neutral-200"
                >
                  <span className="text-[#9945FF]/60 font-mono mr-2">0{i + 1}</span>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
