<<<<<<< HEAD
import { useNavigate } from "react-router-dom";

// Icons
import Head from "@/assets/icons/Head.jsx";
import LightningIcon from "@/assets/icons/Lightning";
import NotisIcon from "@/assets/icons/Notis";
import SearchIcon from "@/assets/icons/Search";
import TrendIcon from "@/assets/icons/Trend";
import FunnelIcon from "@/assets/icons/Funnel";

export default function Home() {
  const navigate = useNavigate();

  const launch = () => navigate("/dashboard");

  return (
    <div className="min-h-screen w-full bg-[#0b0d18] text-white font-inter">

      {/* NAVBAR */}
      <nav className="w-full flex justify-between items-center py-6 px-8 md:px-20">
        <div className="text-xl font-semibold">BlockAI</div>

        {/* Nav links */}
        <div className="hidden md:flex gap-10 text-sm text-gray-300">
          <span className="hover:text-white cursor-pointer">Features</span>
          <span className="hover:text-white cursor-pointer">Pricing</span>
          <span className="hover:text-white cursor-pointer">Roadmap</span>
        </div>

        {/* Launch button */}
        <button
          onClick={launch}
          className="hidden md:block px-4 py-2 rounded-md bg-gradient-to-r from-[#00E3A5] to-[#6A5BFF] text-sm font-semibold"
        >
          Launch App
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center mt-20 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Talk to AI. Discover Alpha.
          <br />
          <span className="text-[#8f5aff]">Track Everything.</span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl text-sm md:text-base">
          Your intelligent assistant for market analysis and wallet tracking.
        </p>

        <button
          onClick={launch}
          className="mt-8 px-6 py-3 rounded-md text-sm font-semibold bg-gradient-to-r from-[#00E3A5] to-[#6A5BFF]"
        >
          Launch App
        </button>
      </section>

      {/* FEATURES TITLE */}
      <h2 className="mt-28 text-left px-8 md:px-20 text-[#00E3A5] font-semibold text-sm tracking-wider">
        FEATURES
      </h2>

      {/* FEATURES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 md:px-20 mt-6 pb-24">

        {/* CARD GENERATOR */}
        {[
          {
            icon: <LightningIcon />,
            text: "Real-time data from Solana & beyond, decoded instantly.",
            label: "ON-CHAIN ANALYTICS",
          },
          {
            icon: <Head />,
            text: "The more the chain moves, the smarter BlockAI gets — forever.",
            label: "CONTINUOUS LEARNING",
          },
          {
            icon: <NotisIcon />,
            text: "Instant notifications on whale moves & smart-money activity.",
            label: "WALLET ALERTS",
          },
          {
            icon: <SearchIcon />,
            text: "Hidden gems, airdrops, and early DeFi plays — delivered first.",
            label: "ALPHA DISCOVERY",
          },
          {
            icon: <TrendIcon />,
            text: "AI-powered forecasts on tokens, trends, and market shifts.",
            label: "PREDICTIVE INSIGHTS",
          },
          {
            icon: <FunnelIcon />,
            text: "Cuts through misinformation and shills so you see only truth.",
            label: "NOISE FILTERING",
          },
        ].map((card, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="bg-[#111325] rounded-xl p-6 border border-white/10 w-full">
              <div className="w-full mb-4 flex justify-center">
                {card.icon}
              </div>
              <p className="text-gray-300 text-sm text-center">
                {card.text}
              </p>
            </div>

            <div className="mt-2 text-white text-sm font-bold text-center">
              {card.label}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
=======
import { useNavigate } from "react-router-dom";

// Icons
import Head from "@/assets/icons/Head.jsx";
import LightningIcon from "@/assets/icons/Lightning";
import NotisIcon from "@/assets/icons/Notis";
import SearchIcon from "@/assets/icons/Search";
import TrendIcon from "@/assets/icons/Trend";
import FunnelIcon from "@/assets/icons/Funnel";

export default function Home() {
  const navigate = useNavigate();

  const launch = () => navigate("/dashboard");

  return (
    <div className="min-h-screen w-full bg-[#0b0d18] text-white font-inter">

      {/* NAVBAR */}
      <nav className="w-full flex justify-between items-center py-6 px-8 md:px-20">
        <div className="text-xl font-semibold">BlockAI</div>

        {/* Nav links */}
        <div className="hidden md:flex gap-10 text-sm text-gray-300">
          <span className="hover:text-white cursor-pointer">Features</span>
          <span className="hover:text-white cursor-pointer">Pricing</span>
          <span className="hover:text-white cursor-pointer">Roadmap</span>
        </div>

        {/* Launch button */}
        <button
          onClick={launch}
          className="hidden md:block px-4 py-2 rounded-md bg-gradient-to-r from-[#00E3A5] to-[#6A5BFF] text-sm font-semibold"
        >
          Launch App
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center mt-20 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Talk to AI. Discover Alpha.
          <br />
          <span className="text-[#8f5aff]">Track Everything.</span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl text-sm md:text-base">
          Your intelligent assistant for market analysis and wallet tracking.
        </p>

        <button
          onClick={launch}
          className="mt-8 px-6 py-3 rounded-md text-sm font-semibold bg-gradient-to-r from-[#00E3A5] to-[#6A5BFF]"
        >
          Launch App
        </button>
      </section>

      {/* FEATURES TITLE */}
      <h2 className="mt-28 text-left px-8 md:px-20 text-[#00E3A5] font-semibold text-sm tracking-wider">
        FEATURES
      </h2>

      {/* FEATURES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 md:px-20 mt-6 pb-24">

        {/* CARD GENERATOR */}
        {[
          {
            icon: <LightningIcon />,
            text: "Real-time data from Solana & beyond, decoded instantly.",
            label: "ON-CHAIN ANALYTICS",
          },
          {
            icon: <Head />,
            text: "The more the chain moves, the smarter BlockAI gets — forever.",
            label: "CONTINUOUS LEARNING",
          },
          {
            icon: <NotisIcon />,
            text: "Instant notifications on whale moves & smart-money activity.",
            label: "WALLET ALERTS",
          },
          {
            icon: <SearchIcon />,
            text: "Hidden gems, airdrops, and early DeFi plays — delivered first.",
            label: "ALPHA DISCOVERY",
          },
          {
            icon: <TrendIcon />,
            text: "AI-powered forecasts on tokens, trends, and market shifts.",
            label: "PREDICTIVE INSIGHTS",
          },
          {
            icon: <FunnelIcon />,
            text: "Cuts through misinformation and shills so you see only truth.",
            label: "NOISE FILTERING",
          },
        ].map((card, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="bg-[#111325] rounded-xl p-6 border border-white/10 w-full">
              <div className="w-full mb-4 flex justify-center">
                {card.icon}
              </div>
              <p className="text-gray-300 text-sm text-center">
                {card.text}
              </p>
            </div>

            <div className="mt-2 text-white text-sm font-bold text-center">
              {card.label}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
>>>>>>> 563e2be438a3ec5992c96ceeb453250da23265ab
