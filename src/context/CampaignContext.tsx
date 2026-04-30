import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface CampaignState {
  unlockedStage: number;
  hasRedeemedCode: boolean;
  isInvestor: boolean;
  completedTasks: string[];
  totalPoints: number;
  totalXFeedbacks: number;
  twitterHandle: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const CampaignContext = createContext<CampaignState>({
  unlockedStage: 0,
  hasRedeemedCode: false,
  isInvestor: false,
  completedTasks: [],
  totalPoints: 0,
  totalXFeedbacks: 0,
  twitterHandle: null,
  loading: true,
  refresh: async () => {},
});

export const useCampaign = () => useContext(CampaignContext);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<Omit<CampaignState, 'refresh' | 'loading'>>({
    unlockedStage: 0,
    hasRedeemedCode: false,
    isInvestor: false,
    completedTasks: [],
    totalPoints: 0,
    totalXFeedbacks: 0,
    twitterHandle: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) { setLoading(false); return; }
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/campaign/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setState({
          unlockedStage: data.unlockedStage,
          hasRedeemedCode: data.hasRedeemedCode,
          isInvestor: data.isInvestor,
          completedTasks: data.completedTasks,
          totalPoints: data.totalPoints,
          totalXFeedbacks: data.totalXFeedbacks,
          twitterHandle: data.twitterHandle || null,
        });
      }
    } catch (e) {
      console.error('Campaign fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <CampaignContext.Provider value={{ ...state, loading, refresh: fetchProgress }}>
      {children}
    </CampaignContext.Provider>
  );
}
