import { create } from 'zustand';

interface AISettings {
  temperature: number;
  model: 'gpt-4o' | 'gpt-4o-mini';
  systemPrompt: string;
  persistMemory: boolean;
  voiceEnabled: boolean;
  setTemperature: (temp: number) => void;
  setModel: (model: 'gpt-4o' | 'gpt-4o-mini') => void;
  setSystemPrompt: (prompt: string) => void;
  setPersistMemory: (persist: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
}

export const useAISettings = create<AISettings>((set) => ({
  temperature: 0.7,
  model: 'gpt-4o',
  systemPrompt: 'You are a helpful assistant.',
  persistMemory: true,
  voiceEnabled: false,
  setTemperature: (temp) => set({ temperature: temp }),
  setModel: (model) => set({ model }),
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setPersistMemory: (persist) => set({ persistMemory: persist }),
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
}));