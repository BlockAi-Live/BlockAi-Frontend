"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Bell, Puzzle, CreditCard, Shield, Camera, Trash2, 
  Mail, Lock, ChevronRight, Check, Globe, DollarSign,
  Smartphone, Key, AlertTriangle
} from "lucide-react";

type TabType = "general" | "notifications" | "plugins" | "subscription" | "security";

const tabs = [
  { id: "general" as TabType, label: "General", icon: User },
  { id: "notifications" as TabType, label: "Notifications", icon: Bell },
  { id: "plugins" as TabType, label: "Plugins & Integrations", icon: Puzzle },
  { id: "subscription" as TabType, label: "Subscription / XToken", icon: CreditCard },
  { id: "security" as TabType, label: "Security", icon: Shield },
];

const currencies = ["USD ($)", "EUR (€)", "GBP (£)", "JPY (¥)", "BTC (₿)", "ETH (Ξ)"];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [displayName, setDisplayName] = useState("CryptoKing123");
  const [email, setEmail] = useState("user@blockai.com");
  const [currency, setCurrency] = useState("USD ($)");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    priceAlerts: true,
    newsUpdates: false,
    weeklyReport: true,
    pushNotifications: true,
    marketingEmails: false,
  });

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  const renderGeneralTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* Profile Picture */}
      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-white/10">
            <User size={32} className="text-gray-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#10B981] rounded-full flex items-center justify-center border-2 border-[#0d0f18]">
            <Camera size={14} className="text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#9945FF] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Camera size={16} />
              Change Image
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <Trash2 size={16} />
              Remove Image
            </button>
          </div>
          <p className="text-xs text-gray-500">We support PNGs, JPEGs and GIFs under 2MB</p>
        </div>
      </div>

      {/* Display Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400 block">Display Name</label>
        <div className="w-full max-w-md p-[1px] rounded-lg" style={{ background: "linear-gradient(90deg, #14F195 0%, #9945FF 100%)" }}>
          <div className="bg-[#232838] rounded-lg">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-transparent rounded-lg px-4 py-3 text-white focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Default Currency */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Default Currency</label>
        <div className="relative w-fit">
          <div className="p-[1px] rounded-lg" style={{ background: "linear-gradient(90deg, #14F195 0%, #9945FF 100%)" }}>
            <div className="bg-[#232838] rounded-lg">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="px-4 py-2.5 bg-transparent text-cyan-400 text-sm font-medium rounded-lg hover:bg-white/5 transition-all flex items-center gap-2"
              >
              <DollarSign size={16} />
              {currency}
              <ChevronRight size={16} className={`transition-transform ${showCurrencyDropdown ? "rotate-90" : ""}`} />
              </button>
            </div>
          </div>
          {showCurrencyDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 mt-2 bg-[#16181f] border border-white/10 rounded-lg overflow-hidden z-10 min-w-[150px]"
            >
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setCurrency(curr);
                    setShowCurrencyDropdown(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${
                    currency === curr ? "text-cyan-400 bg-cyan-500/10" : "text-gray-300"
                  }`}
                >
                  {curr}
                  {currency === curr && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Account Section */}
      <div className="pt-6 border-t border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Account</h3>
        
        {/* Email */}
        <div className="space-y-2 mb-6">
          <label className="text-sm text-gray-400">Email</label>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md p-[1px] rounded-lg" style={{ background: "linear-gradient(90deg, #14F195 0%, #9945FF 100%)" }}>
              <div className="bg-[#232838] rounded-lg">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent rounded-lg px-4 py-3 text-white focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="p-[1px] rounded-lg" style={{ background: "linear-gradient(90deg, #14F195 0%, #9945FF 100%)" }}>
              <div className="bg-[#232838] rounded-lg">
                <button className="px-5 py-3 bg-transparent text-gray-300 text-sm font-medium rounded-lg hover:bg-white/5 transition-all">
                  Change email
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Password</label>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md p-[1px] rounded-lg" style={{ background: "linear-gradient(90deg, #14F195 0%, #9945FF 100%)" }}>
              <div className="bg-[#232838] rounded-lg">
                <input
                  type="password"
                  value="••••••••••"
                  readOnly
                  className="w-full bg-transparent rounded-lg px-4 py-3 text-white focus:outline-none cursor-default"
                />
              </div>
            </div>
            <div className="p-[1px] rounded-lg" style={{ background: "linear-gradient(90deg, #14F195 0%, #9945FF 100%)" }}>
              <div className="bg-[#232838] rounded-lg">
                <button className="px-5 py-3 bg-transparent text-gray-300 text-sm font-medium rounded-lg hover:bg-white/5 transition-all">
                  Change password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationsTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
        <p className="text-sm text-gray-500">Manage what emails you receive</p>
      </div>

      <div className="space-y-4">
        {[
          { key: "emailAlerts", label: "Email Alerts", desc: "Get notified about important account activity" },
          { key: "priceAlerts", label: "Price Alerts", desc: "Receive alerts when tokens hit your target price" },
          { key: "newsUpdates", label: "News Updates", desc: "Stay updated with crypto news and trends" },
          { key: "weeklyReport", label: "Weekly Report", desc: "Get a weekly summary of your portfolio" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-[#16181f] rounded-xl border border-white/5">
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications[item.key as keyof typeof notifications] ? "bg-emerald-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications[item.key as keyof typeof notifications] ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
          <p className="text-sm text-gray-500">Control notifications on your devices</p>
        </div>

        {[
          { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications on mobile", icon: Smartphone },
          { key: "marketingEmails", label: "Marketing Emails", desc: "Receive promotional content and offers", icon: Mail },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-[#16181f] rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                <item.icon size={18} className="text-gray-400" />
              </div>
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications[item.key as keyof typeof notifications] ? "bg-emerald-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications[item.key as keyof typeof notifications] ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderPluginsTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">Connected Apps</h3>
        <p className="text-sm text-gray-500">Manage your connected applications and integrations</p>
      </div>

      <div className="grid gap-4">
        {[
          { name: "MetaMask", desc: "Wallet connected", connected: true, icon: "🦊" },
          { name: "Discord", desc: "Receive alerts in Discord", connected: true, icon: "💬" },
          { name: "Telegram", desc: "Connect your Telegram", connected: false, icon: "✈️" },
          { name: "Twitter/X", desc: "Share your trades", connected: false, icon: "𝕏" },
        ].map((app) => (
          <div key={app.name} className="flex items-center justify-between p-4 bg-[#16181f] rounded-xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                {app.icon}
              </div>
              <div>
                <p className="text-white font-medium">{app.name}</p>
                <p className="text-sm text-gray-500">{app.desc}</p>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                app.connected
                  ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
              }`}
            >
              {app.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderSubscriptionTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">Current Plan</h3>
        <p className="text-sm text-gray-500">Manage your subscription and XToken balance</p>
      </div>

      {/* Current Plan Card */}
      <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full uppercase">Pro Plan</span>
            <h4 className="text-2xl font-bold text-white mt-2">$29/month</h4>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Next billing date</p>
            <p className="text-white font-medium">January 4, 2025</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all">
            Change Plan
          </button>
          <button className="px-4 py-2 text-red-400 text-sm font-medium hover:text-red-300 transition-colors">
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* XToken Balance */}
      <div className="p-6 bg-[#16181f] rounded-2xl border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">XToken Balance</p>
            <p className="text-3xl font-bold text-white">1,250 <span className="text-lg text-cyan-400">XTK</span></p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">
            Buy XTokens
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderSecurityTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">Security Settings</h3>
        <p className="text-sm text-gray-500">Keep your account safe and secure</p>
      </div>

      {/* Two-Factor Auth */}
      <div className="p-6 bg-[#16181f] rounded-2xl border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Key size={24} />
            </div>
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              twoFactorEnabled
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
            }`}
          >
            {twoFactorEnabled ? "Enabled" : "Enable"}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Active Sessions</h4>
        {[
          { device: "Chrome on MacOS", location: "San Francisco, US", current: true },
          { device: "Safari on iPhone", location: "San Francisco, US", current: false },
        ].map((session, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-[#16181f] rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                <Globe size={18} className="text-gray-400" />
              </div>
              <div>
                <p className="text-white font-medium flex items-center gap-2">
                  {session.device}
                  {session.current && <span className="text-xs text-emerald-400">(Current)</span>}
                </p>
                <p className="text-sm text-gray-500">{session.location}</p>
              </div>
            </div>
            {!session.current && (
              <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-white/10">
        <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-red-400 font-medium mb-1">Danger Zone</h4>
              <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralTab();
      case "notifications":
        return renderNotificationsTab();
      case "plugins":
        return renderPluginsTab();
      case "subscription":
        return renderSubscriptionTab();
      case "security":
        return renderSecurityTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white relative">
      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(20, 241, 149, 0.2) 100%)"
        }}
      />
      
      <div className="p-6 lg:p-10 relative z-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl lg:text-4xl font-bold text-white mb-8"
      >
        Account Settings
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                style={activeTab === tab.id ? { background: "linear-gradient(90deg, rgba(20, 241, 149, 0.2) 0%, rgba(153, 69, 255, 0.2) 100%)" } : {}}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {renderTabContent()}

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex justify-end"
          >
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-[#14F195] text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default SettingsPage;
