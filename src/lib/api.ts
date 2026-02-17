const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export const api = {
  register: async (data: any) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    return response.json();
  },

  login: async (data: any) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },

  walletLogin: async (walletAddress: string) => {
    const response = await fetch(`${API_URL}/api/auth/wallet-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
    });
    if (response.status === 404) return null; // User not found
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Wallet Login failed");
    }
    return response.json();
  },

  walletRegister: async (walletAddress: string, username: string) => {
    const response = await fetch(`${API_URL}/api/auth/wallet-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, username }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Wallet Registration failed");
    }
    return response.json();
  },

  getMe: async (token: string) => {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  updateProfile: async (token: string, data: { fullName?: string; email?: string }) => {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Update failed");
    }
    return response.json();
  },

  updatePassword: async (token: string, data: { currentPassword: string; newPassword: string }) => {
    const response = await fetch(`${API_URL}/api/auth/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Password update failed");
    }
    return response.json();
  },

  chatQuestion: async (data: { content: string }) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/v1/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (response.status === 402) {
      throw new Error("Payment Required: Insufficient Credits");
    }

    if (!response.ok) {
       const err = await response.json();
       throw new Error(err.error || "AI Chat Failed");
    }
    
    // Log is handled by backend now
    return response.json();
  },

  getBillingStats: async () => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/api/v1/billing`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch billing");
    return response.json();
  },

  createApiKey: async (name: string) => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/api/v1/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to create key");
    return response.json();
  },

  simulatePayment: async () => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/api/v1/payment/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error("Payment simulation failed");
    return response.json();
  },

  // --- Access & Points System ---

  joinWaitlist: async (data: { email: string; walletAddress?: string; telegram?: string; twitter?: string; reason?: string }) => {
    const response = await fetch(`${API_URL}/api/access/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to join waitlist");
    }
    return response.json();
  },

  redeemAccessCode: async (code: string, userId: string) => {
    const response = await fetch(`${API_URL}/api/access/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to redeem code");
    }
    return response.json();
  },

  getWaitlist: async () => {
    // Admin check logic relies on backend or client secret typically, but here we just fetch.
    const response = await fetch(`${API_URL}/api/access/admin/waitlist`, {});
    if (!response.ok) throw new Error("Failed to fetch waitlist");
    return response.json();
  },

  approveWaitlist: async (id: string) => {
    const response = await fetch(`${API_URL}/api/access/admin/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("Failed to approve");
    return response.json();
  },

  generateInvite: async (maxUses: number = 1) => {
    const response = await fetch(`${API_URL}/api/access/admin/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxUses }),
    });
    if (!response.ok) throw new Error("Failed to generate code");
    return response.json();
  },

  getActivity: async () => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/api/v1/activity`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch activity");
    return response.json();
  },
};
