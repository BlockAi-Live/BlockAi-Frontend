export default function SeeItLive() {
  return (
    <section className="mt-32 px-6 md:px-0">
      <h3 className="text-[#10e291] text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-20 tracking-wide">See It Live</h3>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20 max-w-7xl mx-auto">
        {/* Left Text */}
        <div className="flex-1 text-left space-y-8">
          <p className="text-2xl md:text-3xl font-semibold text-white leading-tight">
            Live chain intelligence,<br />updated every second:
          </p>
          <div className="space-y-4 text-lg md:text-xl text-gray-400 font-medium">
            <p>Whale movements & smart-money flows</p>
            <p>New airdrops and hidden opportunities</p>
            <p>Instant wallet & token alerts</p>
          </div>
          <div className="text-base md:text-lg text-[#10e291] font-bold tracking-wider uppercase">
            Your alpha advantage starts here.
          </div>
        </div>

        {/* Center Image */}
        <div className="flex-[2] flex justify-center w-full">
          <div className="relative w-full max-w-[1000px] group">
            {/* Green Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#10e291] blur-[100px] opacity-20 rounded-full pointer-events-none"></div>
            
            <img
              src="/laptop.png"
              alt="Live preview"
              className="relative w-full h-auto drop-shadow-2xl z-10"
            />
          </div>
        </div>

        {/* Right Text */}
        <div className="flex-1 text-right space-y-8">
          <p className="text-3xl md:text-4xl font-bold text-white">BlockAI never sleeps.</p>
          <div className="space-y-4 text-lg md:text-xl text-gray-400 font-medium">
            <p>Whales moving.</p>
            <p>Airdrops dropping.</p>
            <p>Smart money loading.</p>
            <p className="text-white font-semibold pt-2">All in real time — all on-chain.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
