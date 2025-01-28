'use client'

import { useState } from 'react'
import { buttonClass } from '../components/ButtonClass'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface StepperProps {
    currentStep: number
    totalSteps: number
}

const chains = [
    {
        id: 'solana',
        name: 'Solana',
        icon: '/icons/solana.svg'
    },
    {
        id: 'ethereum',
        name: 'Ethereum',
        disabled: true,
        icon: '/icons/ethereum.svg'
    },
    {
        id: 'arbitrum',
        name: 'Arbitrum',
        disabled: true,
        icon: '/icons/arbitrum.svg'
    },
    {
        id: 'base',
        name: 'Base',
        disabled: true,
        icon: '/icons/base.svg'
    },
    {
        id: 'polygon',
        name: 'Polygon',
        disabled: true,
        icon: '/icons/polygon.svg'
    },
    {
        id: 'avalanche',
        name: 'Avalanche',
        disabled: true,
        icon: '/icons/avalanche.svg'
    },
]

const llmProviders = [
    { id: 'claude', name: 'Claude' },
    { id: 'openai', name: 'OpenAI' },
    { id: 'llama', name: 'Llama 3.1' },
]

const agentTypes = [
    { id: 'voice', name: 'Voice Agent' },
    { id: 'text', name: 'Text Agent' },
]

const StepperHeader = ({ currentStep, totalSteps }: StepperProps) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between w-full">
                {[...Array(totalSteps)].map((_, index) => (
                    <div key={index} className="flex items-center flex-1 last:flex-initial">
                        <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${index + 1 <= currentStep
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                        >
                            {index + 1}
                        </div>
                        {index < totalSteps - 1 && (
                            <div
                                className={`h-1 w-full mx-2 flex-grow ${index + 1 < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const primaryButtonClass = 'px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300'

export default function Home() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedChains, setSelectedChains] = useState<string[]>([])
    const [selectedLLM, setSelectedLLM] = useState<string>('')
    const [selectedAgentType, setSelectedAgentType] = useState<string>('')

    const handleChainSelection = (chainId: string) => {
        setSelectedChains((prev) =>
            prev.includes(chainId)
                ? prev.filter((id) => id !== chainId)
                : [...prev, chainId]
        )
    }

    const handleLLMSelection = (llmId: string) => {
        setSelectedLLM(prev => prev === llmId ? '' : llmId)
    }

    const handleAgentTypeSelection = (typeId: string) => {
        setSelectedAgentType(prev => prev === typeId ? '' : typeId)
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleStart = () => {
        const config = {
            chains: selectedChains,
            llmProvider: selectedLLM,
            agentType: selectedAgentType
        }

        console.log('Starting with configuration:', config)

        if (selectedAgentType === 'voice') {
            router.push('/voice-chat')
        } else if (selectedAgentType === 'text') {
            router.push('/text-chat')
        }
    }

    const selectedButtonClass =
        'px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300 text-sm'

    const cardContainerClass = "grid grid-cols-2 gap-4 min-h-[160px]"
    const cardClass = "h-[45px] flex items-center justify-center w-full relative"
    const buttonContentClass = "absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-[140px]"
    const iconClass = "w-5 h-5 mr-3"
    const buttonTextClass = "text-sm"

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return selectedChains.length > 0
            case 2:
                return selectedLLM !== ''
            case 3:
                return selectedAgentType !== ''
            default:
                return false
        }
    }

    const getStepErrorMessage = (step: number) => {
        switch (step) {
            case 1:
                return 'Please select at least one chain'
            case 2:
                return 'Please select an LLM provider'
            case 3:
                return 'Please select an agent type'
            default:
                return ''
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-3xl bg-black rounded-lg p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-2">
                        NexAI Wallet
                    </h1>
                    <p className="text-gray-400">Your Gateway to AI-Powered Web3 Experience</p>
                </div>

                <StepperHeader currentStep={currentStep} totalSteps={3} />

                <div className="space-y-8">
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Select Chains</h2>
                            <div className={cardContainerClass}>
                                {chains.map((chain) => (
                                    <button
                                        key={chain.id}
                                        onClick={() => !chain.disabled && handleChainSelection(chain.id)}
                                        className={`
                      ${chain.disabled
                                                ? 'opacity-50 cursor-not-allowed'
                                                : selectedChains.includes(chain.id)
                                                    ? selectedButtonClass
                                                    : buttonClass}
                      ${cardClass}
                    `}
                                        disabled={chain.disabled}
                                    >
                                        <div className={buttonContentClass}>
                                            <Image
                                                src={chain.icon}
                                                alt={`${chain.name} icon`}
                                                width={20}
                                                height={20}
                                                className={iconClass}
                                            />
                                            <span className={buttonTextClass}>{chain.name}</span>
                                        </div>
                                        {chain.disabled && (
                                            <span className="absolute -top-2 -right-2 bg-purple-500 text-xs px-2 py-1 rounded-full text-white">
                                                Coming Soon
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Select LLM Provider</h2>
                            <div className={cardContainerClass}>
                                {llmProviders.map((provider) => (
                                    <button
                                        key={provider.id}
                                        onClick={() => handleLLMSelection(provider.id)}
                                        className={`
                      ${selectedLLM === provider.id ? selectedButtonClass : buttonClass}
                      ${cardClass}
                    `}
                                    >
                                        <div className={buttonContentClass}>
                                            <span className={buttonTextClass}>{provider.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Select Agent Type</h2>
                            <div className={cardContainerClass}>
                                {agentTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => handleAgentTypeSelection(type.id)}
                                        className={`
                      ${selectedAgentType === type.id ? selectedButtonClass : buttonClass}
                      ${cardClass}
                    `}
                                    >
                                        <div className={buttonContentClass}>
                                            <span className={buttonTextClass}>{type.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleBack}
                            className={`${buttonClass} ${currentStep === 1 ? 'invisible' : 'visible'
                                }`}
                        >
                            Back
                        </button>
                        {currentStep === 3 ? (
                            <div className="relative group">
                                <button
                                    onClick={handleStart}
                                    className={`${primaryButtonClass} ${!selectedAgentType ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    disabled={!selectedAgentType}
                                >
                                    Start
                                </button>
                                {!selectedAgentType && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        <div className="relative bg-black text-white text-sm px-4 py-2 rounded-xl whitespace-nowrap">
                                            Please select an agent type
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black transform rotate-45"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative group">
                                <button
                                    onClick={handleNext}
                                    className={`${buttonClass} ${!isStepValid(currentStep) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    disabled={!isStepValid(currentStep)}
                                >
                                    Next
                                </button>
                                {!isStepValid(currentStep) && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        <div className="relative bg-black text-white text-sm px-4 py-2 rounded-xl whitespace-nowrap">
                                            {getStepErrorMessage(currentStep)}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black transform rotate-45"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
