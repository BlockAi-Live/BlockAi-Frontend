interface HeroProps {
  launch: () => void;
}

export default function Hero({ launch }: HeroProps) {
  return (
    <section className="relative overflow-visible pt-20 md:pt-32 pb-12">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none select-none 
                   w-[350px] md:w-[480px] 
                   absolute left-20 -top-10 
                   -translate-x-1/4 
                   z-[1] mix-blend-screen
                   [mask-image:radial-gradient(circle_at_center,white_60%,transparent_95%)]"
      >
        <source src="/sphere-render.webm" type="video/webm" />
      </video>

      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none select-none 
                   w-[600px] md:w-[800px] 
                   absolute right-0 top-32 
                   translate-x-1/3 
                   z-[1] mix-blend-screen
                   [mask-image:radial-gradient(circle_at_center,white_60%,transparent_95%)]"
      >
        <source src="/sphere-render2.webm" type="video/webm" />
      </video>

      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          Talk to AI. Discover Alpha.
        </h1>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-[#FFFFFF] via-[#794F9D] to-[#FFFFFF] bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent pb-2">
          Track Everything.
        </h2>

        <p className="mt-12 text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
          Real-time on-chain analytics, alpha discovery & wallet alerts – all decentralized.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <button 
            className="px-10 py-2.5 rounded-full text-sm font-bold text-white border border-white relative overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, rgba(20, 241, 149, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            Sign Up
          </button>
          <button
            onClick={launch}
            className="px-10 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#14F195] to-[#9B59B6] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Launch App
          </button>
        </div>
      </div>
    </section>
  );
}
