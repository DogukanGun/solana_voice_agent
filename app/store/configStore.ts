import { AppChain } from '../app/page'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConfigState {
  chains: AppChain[]
  llmProvider: string
  agentType: string
  isConfigured: boolean
  isPremiumVerified: boolean
  setConfig: (config: { chains: AppChain[]; llmProvider: string; agentType: string }) => void
  clearConfig: () => void
  setPremiumVerified: (verified: boolean) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      chains: [],
      llmProvider: '',
      agentType: '',
      isConfigured: false,
      isPremiumVerified: false,
      setConfig: (config) => 
        set({ ...config, isConfigured: true }),
      clearConfig: () => 
        set({ 
          chains: [], 
          llmProvider: '', 
          agentType: '', 
          isConfigured: false,
          isPremiumVerified: false 
        }),
      setPremiumVerified: (verified) =>
        set({ isPremiumVerified: verified }),
    }),
    {
      name: 'app-config',
    }
  )
) 