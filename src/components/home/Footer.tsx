export default function Footer() {
  return (
    <footer className="mt-32 relative">
      {/* Top border with center notch */}
      <div className="relative">
        <div className="border-t border-neutral-800/60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-1.5 bg-neutral-500 rounded-full" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
          {/* Logo + tagline */}
          <div className="flex flex-col items-start lg:max-w-[220px]">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/blockai.svg" alt="BlockAI Logo" className="w-8 h-8" />
            </div>
            <p className="text-neutral-600 text-sm leading-relaxed">
              AI-powered on-chain intelligence for smarter decisions.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">Product</h4>
              <div className="flex flex-col gap-3 text-sm text-neutral-600">
                <a href="/dashboard" className="hover:text-neutral-300 transition-colors">Dashboard</a>
                <a href="#" className="hover:text-neutral-300 transition-colors">Pricing</a>
                <a href="#" className="hover:text-neutral-300 transition-colors">Marketplace</a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">Community</h4>
              <div className="flex flex-col gap-3 text-sm text-neutral-600">
                <a href="https://x.com/BlockAi_live" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Twitter</a>
                <a href="https://discord.gg/FuPn3FbkG9" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Discord</a>
                <a href="https://t.me/BlockAiOrg" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Telegram</a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">Resources</h4>
              <div className="flex flex-col gap-3 text-sm text-neutral-600">
                <a href="/Roadmap.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Roadmap</a>
                <a href="/Whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Whitepaper</a>
                <a href="/Tokenomics.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Tokenomics</a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">Company</h4>
              <div className="flex flex-col gap-3 text-sm text-neutral-600">
                <a href="/about" className="hover:text-neutral-300 transition-colors">About Us</a>
                <a href="/team" className="hover:text-neutral-300 transition-colors">Team</a>
                <a href="#" className="hover:text-neutral-300 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: copyright + watermark */}
      <div className="relative overflow-hidden">
        <div className="border-t border-neutral-800/40 px-6 py-6">
          <p className="max-w-6xl mx-auto text-neutral-700 text-xs">
            © 2026 BlockAI INC. All rights reserved.
          </p>
        </div>

        {/* Giant watermark text */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[30%] pointer-events-none select-none">
          <span className="text-[120px] md:text-[180px] lg:text-[220px] font-black tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.025)] whitespace-nowrap leading-none">
            BLOCKAI
          </span>
        </div>
      </div>
    </footer>
  );
}
