'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Agent {
  id: string
  name: string
  description: string
  poweredBy: string
  requiresPrivy?: boolean
}

export default function Home() {
  const [predefinedAgents, setPredefinedAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Solana AI Bot',
      description: 'Interact with Solana blockchain, manage tokens, and get real-time information. Works in text and voice mode.',
      poweredBy: 'SendAI',
      requiresPrivy: false
    },
    {
      id: '2',
      name: 'Base AI Bot',
      description: 'Navigate Base network, handle transactions, and access DeFi protocols. Works in text mode only.',
      poweredBy: 'OpenAI',
      requiresPrivy: false
    },
    {
      id: '3',
      name: 'Ethereum AI Bot',
      description: 'Coming Soon. Manage Ethereum assets, interact with smart contracts, and explore the ecosystem. Works in text mode only.',
      poweredBy: 'Coinbase Agent Kit',
      requiresPrivy: false
    },
    {
      id: '4',
      name: 'Base with Llama 3.1',
      description: 'Coming Soon. Interact with Base network using Llama 3.1. Works in text mode only.',
      poweredBy: 'Gaia OnChain',
      requiresPrivy: false
    }
  ])

  const [selectedChain, setSelectedChain] = useState<string>('')
  const isVoiceModeEnabled = selectedChain === 'Solana'

  return (
    <main className="min-h-screen bg-gradient-to-b bg-black text-white page-with-navbar">
      <div className="container mx-auto px-4 py-8">
        {/* Main Actions Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Create Your AI Agent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Configurator Card */}
            <Link href="/configurator" 
                  className="block p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <h3 className="text-xl font-semibold mb-2 text-purple-400">Configurator</h3>
              <p className="text-gray-300">Create and customize your own AI agent</p>
            </Link>

            {/* Import Agent Card (Disabled) */}
            <div className="relative p-6 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 cursor-not-allowed">
              <div className="absolute top-2 right-2">
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-400">Import Agent</h3>
              <p className="text-gray-500">Import your existing AI agent configuration</p>
            </div>
          </div>
        </section>

        {/* Predefined Agents Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Predefined Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predefinedAgents.map((agent) => (
              <div key={agent.id} 
                   className={`p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 ${agent.description.includes('Coming Soon') ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <h3 className="text-xl font-semibold mb-2 text-purple-400">{agent.name}</h3>
                <p className="text-gray-300 mb-4">{agent.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Powered by {agent.poweredBy}
                  </span>
                  {agent.requiresPrivy && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      Requires Privy Login
                    </span>
                  )}
                  {agent.description.includes('Coming Soon') && (
                    <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {agent.name === 'Base with Llama 3.1' && (
                    <span className="absolute top-2 right-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      On Chain Bot
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Agents Section (Placeholder) */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Saved Agents
          </h2>
          <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <p className="text-gray-300 text-center">
              Your saved agents will appear here
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
