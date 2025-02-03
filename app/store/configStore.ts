import { AppChain } from '../configurator/page'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConfigState {
  chains: AppChain[]
  llmProvider: string
  agentType: string
  isConfigured: boolean
  isPremiumVerified: boolean
  knowledgeBase: string[]
  setConfig: (config: { chains: AppChain[]; llmProvider: string; agentType: string }) => void
  clearConfig: () => void
  setPremiumVerified: (verified: boolean) => void
  getFeatures: () => { value: string; label: string; }[]
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      chains: [],
      llmProvider: '',
      agentType: '',
      isConfigured: false,
      isPremiumVerified: false,
      knowledgeBase: [],
      setConfig: (config) => 
        set({ ...config, isConfigured: true }),
      clearConfig: () => 
        set({ 
          chains: [], 
          llmProvider: '', 
          agentType: '', 
          isConfigured: false,
          isPremiumVerified: false,
          knowledgeBase: []
        }),
      setPremiumVerified: (verified) =>
        set({ isPremiumVerified: verified }),
      getFeatures: () => {
        const { chains, llmProvider } = get();
        const features = [];
        
        if (chains.length > 0) {
          chains.forEach(chain => {
            features.push({ value: chain.name, label: "chain" });
          });
          features.push({ value: llmProvider, label: "LLM Provider" });
        }
        return features;
      },
    }),
    {
      name: 'app-config',
    }
  )
) 