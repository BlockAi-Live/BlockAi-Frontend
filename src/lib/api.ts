import { GoogleGenAI } from "@google/genai";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey:GEMINI_API_KEY});

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
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not set in .env");

  try {
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    {
      role: "user",
      parts: [
        { text: "INSTRUCTION: Only respond if the following message is about economics, crypto and AI. Otherwise, say you can only help with economics, crypto and AI related question." },
        { text: data.content }
      ]
    }
  ],
});

    
    let aiAnswer = "No response from AI";

    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      aiAnswer = response.candidates[0].content.parts[0].text;
    }

    await fetch(`${API_URL}/ai/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: data.content,
        answer: aiAnswer,
      }),
    });

    return {
      question: data.content,
      answer: aiAnswer,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "AI chat failed");
  }
}

};
