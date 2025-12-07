export default function Footer() {
  return (
    <footer className="mt-32 pb-10 px-6 md:px-0 max-w-7xl mx-auto">
      <div className="relative rounded-3xl border border-white/10 bg-[#0B0E1A]/80 backdrop-blur-xl p-12 md:p-16 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            <img src="/blockai.svg" alt="BlockAI Logo" className="w-32 h-32 md:w-48 md:h-48 mb-6" />
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 w-full lg:w-auto">
            {/* GENERAL */}
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-gray-400 tracking-wider">GENERAL</h4>
              <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
                <a href="#" className="hover:text-[#10e291] transition-colors">APP</a>
                <a href="#" className="hover:text-[#10e291] transition-colors">DOCS</a>
                <a href="#" className="hover:text-[#10e291] transition-colors">ABOUT</a>
              </div>
            </div>

            {/* COMMUNITY */}
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-gray-400 tracking-wider">COMMUNITY</h4>
              <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
                <a href="#" className="hover:text-[#10e291] transition-colors">X (TWITTER)</a>
                <a href="#" className="hover:text-[#10e291] transition-colors">DISCORD</a>
                <a href="#" className="hover:text-[#10e291] transition-colors">TELEGRAM</a>
              </div>
            </div>

            {/* PRODUCT */}
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-gray-400 tracking-wider">PRODUCT</h4>
              <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
                <a href="#" className="hover:text-[#10e291] transition-colors">LIVE DASHBOARD</a>
                <a href="#" className="hover:text-[#10e291] transition-colors">PLUGIN MARKETPLACE</a>
                <a href="#" className="hover:text-[#10e291] transition-colors">TOKENOMICS</a>
              </div>
            </div>

            {/* RESOURCES */}
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-gray-400 tracking-wider">RESOURCES</h4>
              <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
                <a href="#" className="hover:text-[#10e291] transition-colors">WHITEPAPER</a>
                <a href="#" className="hover:text-[#10e291] transition-colors">API DOCUMENTATION</a>
                <a href="#" className="hover:text-[#10e291] transition-colors">SECURITY AUDITS</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="text-center text-gray-600 text-xs mt-8">
        © 2025 BlockAI. All rights reserved.
      </div>
    </footer>
  );
}
