"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, PuzzlePiece, CreditCard, Shield, Camera, Trash, 
  Envelope, LockKey, CaretRight, Check, CurrencyDollar,
  Key, Warning, CaretDown, CheckCircle, Code
} from "@phosphor-icons/react";
import SettingsAPI from "../components/settings/SettingsAPI";

type TabType = "general" | "notifications" | "plugins" | "subscription" | "security" | "api";

const tabs = [
  { id: "general" as TabType, label: "General", icon: User },
  { id: "notifications" as TabType, label: "Notifications", icon: Bell },
  { id: "api" as TabType, label: "API & Billing", icon: Code }, // New Tab
  { id: "plugins" as TabType, label: "Integrations", icon: PuzzlePiece },
  { id: "subscription" as TabType, label: "Subscription", icon: CreditCard },
  { id: "security" as TabType, label: "Security", icon: Shield },
];




const currencies = ["USD ($)", "EUR (€)", "GBP (£)", "JPY (¥)", "BTC (₿)", "ETH (Ξ)"];

// --- REUSABLE COMPONENTS ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-[#13151C] border border-white/5 rounded-[24px] overflow-hidden ${className}`}>
        {children}
    </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
            checked ? "bg-[#14F195] shadow-[0_0_10px_rgba(20,241,149,0.3)]" : "bg-white/10"
        }`}
    >
        <div 
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${
                checked ? "left-7" : "left-1"
            }`} 
        />
    </button>
);

const InputGroup = ({ label, type = "text", value, onChange, placeholder, icon, disabled }: any) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-[2px]" />
            <div className="relative flex items-center bg-[#0d0f18] border border-white/10 rounded-xl overflow-hidden focus-within:border-transparent transition-colors">
                {icon && <div className="pl-4 text-gray-400">{icon}</div>}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full bg-transparent px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none text-sm font-medium"
                />
            </div>
        </div>
    </div>
);

export function SettingsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("USD ($)");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Loading Profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token && !localStorage.getItem('auth_token')) {
         navigate("/signin");
         return;
      }
      try {
        const data = await api.getMe(token || localStorage.getItem('auth_token') || "");
        setDisplayName(data.user.fullName || "");
        setEmail(data.user.email || "");
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [navigate, token]);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true, priceAlerts: true, newsUpdates: false,
    weeklyReport: true, pushNotifications: true, marketingEmails: false,
  });

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    if (!token) return;

    try {
        await api.updateProfile(token, { fullName: displayName, email });
        updateUser({ fullName: displayName, email });
        toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to update", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setIsChangingPassword(true);
    try {
      if (!token) return;
      await api.updatePassword(token, { currentPassword, newPassword });
      toast({ title: "Success", description: "Password updated successfully" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update password", variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // --- RENDERERS ---

  const renderApiTab = () => (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <SettingsAPI />
      </motion.div>
  );

  const renderGeneralTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Avatar Section */}
      <GlassCard className="p-8 flex flex-col sm:flex-row items-center gap-8">
         <div className="relative group cursor-pointer">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#14F195] to-[#9945FF] p-[2px]">
                 <div className="w-full h-full rounded-full bg-[#0d0f18] flex items-center justify-center overflow-hidden">
                     <User size={48} weight="duotone" className="text-gray-400" />
                 </div>
             </div>
             <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera size={24} className="text-white" />
             </div>
         </div>
         <div className="flex-1 text-center sm:text-left space-y-4">
             <div>
                 <h3 className="text-lg font-bold text-white">Profile Photo</h3>
                 <p className="text-gray-500 text-sm">We support PNGs, JPEGs and GIFs under 2MB</p>
             </div>
             <div className="flex gap-3 justify-center sm:justify-start">
                 <button className="px-4 py-2 bg-[#9945FF]/10 text-[#9945FF] border border-[#9945FF]/20 rounded-xl text-xs font-bold hover:bg-[#9945FF]/20 transition-all flex items-center gap-2">
                     <Camera weight="bold" /> Upload New
                 </button>
                 <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all flex items-center gap-2">
                     <Trash weight="bold" /> Remove
                 </button>
             </div>
         </div>
      </GlassCard>

      {/* Form Section */}
      <GlassCard className="p-8 space-y-6">
          <InputGroup label="Display Name" value={displayName} onChange={(e: any) => setDisplayName(e.target.value)} icon={<User />} />
          <InputGroup label="Email Address" value={email} onChange={(e: any) => setEmail(e.target.value)} icon={<Envelope />} />
          
          <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Default Currency</label>
              <div className="relative">
                  <button 
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)} 
                    className="w-full bg-[#0d0f18] border border-white/10 rounded-xl px-4 py-3 text-white text-left text-sm font-medium flex items-center justify-between hover:border-white/20 transition-colors"
                  >
                      <div className="flex items-center gap-2">
                          <CurrencyDollar className="text-[#14F195]" size={18} />
                          {currency}
                      </div>
                      <CaretDown className={`transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} size={16} />
                  </button>
                  
                  <AnimatePresence>
                    {showCurrencyDropdown && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute mt-2 w-full bg-[#0d0f18] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl"
                        >
                            {currencies.map(c => (
                                <button 
                                    key={c}
                                    onClick={() => { setCurrency(c); setShowCurrencyDropdown(false); }}
                                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white flex justify-between"
                                >
                                    {c}
                                    {currency === c && <Check className="text-[#14F195]" />}
                                </button>
                            ))}
                        </motion.div>
                    )}
                  </AnimatePresence>
              </div>
          </div>
      </GlassCard>
    </motion.div>
  );

  const renderSecurityTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        
        {/* Two Factor */}
        <GlassCard className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#14F195]/20 flex items-center justify-center text-[#14F195]">
                    <Shield size={24} weight="duotone" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Two-Factor Authentication</h3>
                    <p className="text-gray-500 text-xs">Add an extra layer of security.</p>
                </div>
            </div>
            <Toggle checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} />
        </GlassCard>

        {/* Change Password */}
        <GlassCard className="p-8 space-y-6">
            <h3 className="font-bold text-white text-lg mb-4">Change Password</h3>
            <InputGroup type="password" label="Current Password" value={currentPassword} onChange={(e: any) => setCurrentPassword(e.target.value)} icon={<LockKey />} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup type="password" label="New Password" value={newPassword} onChange={(e: any) => setNewPassword(e.target.value)} icon={<Key />} />
                <InputGroup type="password" label="Confirm Password" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} icon={<Key />} />
            </div>
            <div className="flex justify-end pt-2">
                <button 
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="px-6 py-2 bg-[#6366F1] hover:bg-[#6366F1]/80 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
            </div>
        </GlassCard>

        {/* Danger Zone */}
        <div className="p-6 rounded-[24px] border border-red-500/20 bg-red-500/5">
            <div className="flex items-start gap-4">
                <Warning className="text-red-400 mt-1" size={24} />
                <div>
                    <h4 className="text-red-400 font-bold">Danger Zone</h4>
                    <p className="text-red-400/60 text-sm mt-1 mb-4">Irreversible action. Your data will be wiped.</p>
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
  );

  const renderNotificationsTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <GlassCard className="divide-y divide-white/5">
            {[
                { k: "emailAlerts", l: "Email Alerts", d: "Get notified about important account activity" },
                { k: "priceAlerts", l: "Price Alerts", d: "When tokens hit your target price" },
                { k: "newsUpdates", l: "News Updates", d: "Crypto news and trends" },
                { k: "pushNotifications", l: "Push Notifications", d: "Receive push notifications on mobile" },
            ].map((item: any) => (
                <div key={item.k} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                        <h4 className="font-bold text-white text-sm">{item.l}</h4>
                        <p className="text-gray-500 text-xs mt-1">{item.d}</p>
                    </div>
                    {/* @ts-ignore */}
                    <Toggle checked={notifications[item.k]} onChange={() => setNotifications({ ...notifications, [item.k]: !notifications[item.k] })} />
                </div>
            ))}
        </GlassCard>
    </motion.div>
  );

  const renderSubscriptionTab = () => (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
           {/* Plan Card */}
           <div className="rounded-[32px] p-8 bg-gradient-to-br from-[#14F195]/10 to-[#9945FF]/10 border border-white/10 relative overflow-hidden">
               <div className="relative z-10 flex justify-between items-start">
                   <div>
                       <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/10">Pro Plan</span>
                       <h2 className="text-4xl font-bold text-white mt-4">$29<span className="text-lg text-gray-400 font-normal">/mo</span></h2>
                       <p className="text-gray-400 text-sm mt-2">Next billing: Jan 4, 2025</p>
                   </div>
                   <CreditCard size={48} className="text-white opacity-20" />
               </div>
               <div className="relative z-10 mt-8 flex gap-4">
                   <button className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">Upgrade Plan</button>
                   <button className="px-6 py-2.5 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors text-sm">Cancel</button>
               </div>
           </div>
            
           {/* XTokens */}
           <GlassCard className="p-8 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-white text-lg">XToken Balance</h3>
                    <p className="text-gray-500 text-sm">Used for AI Credits & Premium Features</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-[#14F195]">1,250 <span className="text-sm text-gray-500">XTK</span></h2>
                    <button className="text-[#14F195] text-xs font-bold hover:underline mt-1">Buy More</button>
                </div>
           </GlassCard>
      </motion.div>
  );
  
  const renderPluginsTab = () => (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
          {[
              { n: "MetaMask", d: "Wallet connected", c: true, i: "🦊" },
              { n: "Discord", d: "Receive alerts in Discord", c: true, i: "💬" },
              { n: "Twitter/X", d: "Share your trades", c: false, i: "🐦" },
          ].map((app) => (
              <GlassCard key={app.n} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="text-2xl w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">{app.i}</div>
                      <div>
                          <h4 className="font-bold text-white">{app.n}</h4>
                          <p className="text-xs text-gray-500">{app.d}</p>
                      </div>
                  </div>
                  <button className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${app.c ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-[#14F195]/10 text-[#14F195] border-[#14F195]/20"}`}>
                      {app.c ? "Disconnect" : "Connect"}
                  </button>
              </GlassCard>
          ))}
      </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white overflow-hidden relative pb-20">
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 0%, rgba(153, 69, 255, 0.05) 0%, rgba(13, 15, 24, 0) 50%)" }} />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
          <div className="mb-6 md:mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-500 text-sm md:text-base">Manage your account preferences and security.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* SIDEBAR / MOBILE TABS */}
              <div className="lg:w-64 flex-shrink-0">
                  <div className="flex lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-2 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                      {tabs.map((tab) => {
                          const isActive = activeTab === tab.id;
                          return (
                              <button
                                  key={tab.id}
                                  onClick={() => setActiveTab(tab.id as TabType)}
                                  className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden group whitespace-nowrap ${
                                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                                  }`}
                              >
                                  {isActive && (
                                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#232838] border border-white/5 rounded-xl -z-10" />
                                  )}
                                  <tab.icon size={18} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[#14F195]" : "text-gray-500 group-hover:text-white"} />
                                  {tab.label}
                              </button>
                          )
                      })}
                  </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                  <div className="relative">
                       {activeTab === 'general' && renderGeneralTab()}
                       {activeTab === 'notifications' && renderNotificationsTab()}
                       {activeTab === 'api' && renderApiTab()}
                       {activeTab === 'subscription' && renderSubscriptionTab()}
                       {activeTab === 'security' && renderSecurityTab()}
                       {activeTab === 'plugins' && renderPluginsTab()}

                       {activeTab === 'general' && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex justify-end pb-8 lg:pb-0">
                               <button 
                                   onClick={handleSave} 
                                   disabled={isSaving}
                                   className="w-full md:w-auto px-8 py-3 bg-[#14F195] text-black font-bold rounded-xl hover:bg-[#14F195]/90 transition-all shadow-[0_0_20px_rgba(20,241,149,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                               >
                                   {isSaving ? "Saving..." : <><CheckCircle weight="fill" size={20} /> Save Changes</>}
                               </button>
                           </motion.div>
                       )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

export default SettingsPage;
