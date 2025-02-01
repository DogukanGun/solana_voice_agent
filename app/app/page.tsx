"use client";

import { useState, useEffect, useRef } from "react";
import { buttonClass } from "../components/ButtonClass";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useConfigStore } from '../store/configStore';
import PaymentRequiredModal from "../components/PaymentRequiredModal";
import { apiService } from "../services/ApiService";
import { useAppKitAccount } from "@reown/appkit/react";
import { updateLocalToken } from "@/lib/jwt";
import ArbitrumExplanationModal from "../components/ArbitrumExplanationModal";
import { usePrivy } from "@privy-io/react-auth";
import Cookies from 'js-cookie';
import { enqueueSnackbar } from "notistack";
import { useLoading } from '../context/LoadingContext';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export interface AppChain {
  id: string;
  name: string;
  isEmbedded: boolean;
  disabled: boolean | undefined;
  icon: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  disabled: boolean | undefined;
}

const knowledgeBases: KnowledgeBase[] = [
  {
    id: "cookieDao",
    name: "Cookie Dao",
    disabled: false,
  },
];

const chains: AppChain[] = [
  {
    id: "solana",
    name: "Solana",
    isEmbedded: false,
    disabled: false,
    icon: "/icons/solana.svg",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    isEmbedded: true,
    disabled: false,
    icon: "/icons/arbitrum.svg",
  },
  {
    id: "eigenlayer",
    name: "Eigenlayer",
    disabled: true,
    isEmbedded: false,
    icon: "/icons/eigenlayer.svg",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    disabled: true,
    isEmbedded: true,
    icon: "/icons/ethereum.svg",
  },
  {
    id: "base",
    name: "Base",
    disabled: true,
    isEmbedded: true,
    icon: "/icons/base.svg",
  },
  {
    id: "polygon",
    name: "Polygon",
    disabled: true,
    isEmbedded: false,
    icon: "/icons/polygon.svg",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    disabled: true,
    isEmbedded: false,
    icon: "/icons/avalanche.svg",
  },
];

const llmProviders = [
  {
    id: "claude", disabled: true,
    name: "Claude"
  },
  { id: "openai", name: "OpenAI" },
  {
    id: "llama", disabled: true,
    name: "Llama 3.1"
  },
];

const agentTypes = [
  { id: "voice", name: "Voice Agent", disabled: false },
  { id: "text", name: "Text Agent", disabled: false },
];

const StepperHeader = ({ currentStep, totalSteps }: StepperProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between w-full">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex items-center flex-1 last:flex-initial">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${index + 1 <= currentStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-1 w-full mx-2 flex-grow ${index + 1 < currentStep ? "bg-blue-500" : "bg-gray-200"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const primaryButtonClass =
  "px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300";

export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedChains, setSelectedChains] = useState<typeof chains[number][]>([]);
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<typeof knowledgeBases[number][]>([]);
  const [selectedLLM, setSelectedLLM] = useState<string>("");
  const [selectedAgentType, setSelectedAgentType] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const { address, isConnected } = useAppKitAccount();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showArbitrumModal, setShowArbitrumModal] = useState(false);
  const { getAccessToken, user } = usePrivy();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleChainSelection = (chainId: string) => {
    const selectedChain = chains.find(chain => chain.id === chainId);

    if (chainId === "arbitrum") {
      if (selectedChains.some(chain => chain.id === selectedChain!.id)) {
        setSelectedChains((prev) => prev.filter((chain) => chain.id !== chainId));
        return;
      }
      setShowArbitrumModal(true);
      return;
    }

    setSelectedChains((prev) =>
      prev.some(chain => chain.id === selectedChain!.id) ? prev.filter((chain) => chain.id !== chainId) : [...prev, selectedChain!],
    );
  };

  const handleLLMSelection = (llmId: string) => {
    const selectedProvider = llmProviders.find(provider => provider.id === llmId);
    if (selectedProvider?.disabled) {
      return; // Prevent selection if the provider is disabled
    }

    if (llmId === 'claude' || llmId === 'openai') {
      setSelectedProvider(llmId === 'claude' ? 'Claude' : 'OpenAI');
      setShowPaymentModal(true);
    }
    setSelectedLLM((prev) => (prev === llmId ? "" : llmId));
  };

  const handleAgentTypeSelection = (typeId: string) => {
    const selectedType = agentTypes.find(type => type.id === typeId);
    if (selectedType?.disabled) {
      return; // Prevent selection if the agent type is disabled
    }

    setSelectedAgentType((prev) => (prev === typeId ? "" : typeId));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStart = async () => {
    // Save selections into the store
    const config = {
      chains: selectedChains,
      llmProvider: selectedLLM,
      agentType: selectedAgentType,
    };

    useConfigStore.getState().setConfig(config);

    const hasUserWallet = useConfigStore.getState().chains.some(chain => !chain.isEmbedded);

    if (!isConnected && hasUserWallet) {
      setShowWalletModal(true);
      return;
    }

    const res = await apiService.updateToken(hasUserWallet ? address! : user ? user.id : "");
    updateLocalToken(res.token);

    if (selectedAgentType === "voice") {
      router.push("/voice");
    } else if (selectedAgentType === "text") {
      router.push("/chat");
    }
  };

  const selectedButtonClass =
    "px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300 text-sm";

  const cardContainerClass = "grid grid-cols-2 gap-4 min-h-[160px]";
  const cardClass = "h-[45px] flex items-center justify-center w-full relative";
  const buttonContentClass =
    "absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-[140px]";
  const iconClass = "w-5 h-5 mr-3";
  const buttonTextClass = "text-sm";

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return selectedChains.length > 0;
      case 2:
        return true; // Allow proceeding without selection for Knowledge Bases
      case 3:
        return selectedLLM !== ""; // Ensure this checks if a provider is selected
      default:
        return false;
    }
  };

  const getStepErrorMessage = (step: number) => {
    switch (step) {
      case 1:
        return "Please select at least one chain";
      case 2:
        return "";
      case 3:
        return "Please select an LLM provider";
      default:
        return "";
    }
  };

  const WalletRequiredModal = ({ onClose }: { onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-white mb-4">Wallet Connection Required</h3>
          <p className="text-gray-300 mb-6">
            The chatbot needs to interact with your wallet. Please connect your wallet before starting.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  };

  const onAuthenticated = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && accessToken) {
        Cookies.set('accessToken', accessToken, { expires: 7 });
        console.log('Access token saved in cookie:', accessToken);
        enqueueSnackbar('Privy token is valid, welcome to NexAI!', { variant: 'success' });
        setSelectedChains((prev) => [...prev, chains.find(chain => chain.id === "arbitrum")!]);
        setShowArbitrumModal(false);
      } else {
        console.error('Error in API response:', data);
      }
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleWalletTypeSelection = (isEmbedded: boolean) => {
    const filterType = isEmbedded ? "embedded" : "browser";
    if (activeFilter === filterType) {
      setActiveFilter(null);
      setSelectedChains([]);
    } else {
      setActiveFilter(filterType);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-0">
      {showPaymentModal && (
        <PaymentRequiredModal
          provider={selectedProvider}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
      {showWalletModal && (
        <WalletRequiredModal
          onClose={() => setShowWalletModal(false)}
        />
      )}
      {showArbitrumModal && (
        <ArbitrumExplanationModal
          onClose={() => {
            setSelectedChains((prev) => {
              if (prev.map(chain => chain.id).includes("arbitrum")) {
                return prev.filter((chain) => chain.id !== "arbitrum");
              }
              return prev;
            });
            setShowArbitrumModal(false);
          }}
          onAuthenticated={onAuthenticated}
        />
      )}

      <div className="w-full h-screen bg-black rounded-none p-8">
        <div className="text-center mb-12 flex justify-between items-center">
          <h1 className="text-4xl w-full font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-2">
            NexAI Wallet
          </h1>
        </div>

        <StepperHeader currentStep={currentStep} totalSteps={4} />

        <div className="space-y-8">
          {currentStep === 1 && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Select Chains</h2>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className={`${buttonClass} mb-4 flex items-center bg-gray-200 text-black`}
                >
                  Filter Chain {activeFilter ? `(${activeFilter === 'embedded' ? 'Embedded' : 'Browser'})` : ''}
                  <span className="ml-2">{isDropdownOpen ? '▼' : '▲'}</span>
                </button>
                {isDropdownOpen && (
                  <div ref={dropdownRef} className="absolute bg-white shadow-lg rounded-md mt-2 z-10">
                    <div
                      onClick={() => handleWalletTypeSelection(true)}
                      className={`w-full text-left px-4 py-2 text-black hover:bg-gray-200 cursor-pointer`}
                    >
                      Embedded Wallet
                    </div>
                    <div
                      onClick={() => handleWalletTypeSelection(false)}
                      className={`w-full text-left px-4 py-2 text-black hover:bg-gray-200 cursor-pointer`}
                    >
                      Browser Wallet
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <div className={cardContainerClass}>
                {chains
                  .filter(chain => {
                    if (activeFilter === "embedded") return chain.isEmbedded;
                    if (activeFilter === "browser") return !chain.isEmbedded;
                    return true; // Show all if no filter is active
                  })
                  .map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => !chain.disabled && handleChainSelection(chain.id)}
                      className={`
                        ${chain.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : selectedChains.some(selectedChain => selectedChain.id === chain.id)
                            ? selectedButtonClass
                            : buttonClass
                        }
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
              <h2 className="text-2xl font-bold mb-4 text-white">Knowledge Bases</h2>
              <div className={cardContainerClass}>
                {knowledgeBases.map((kb) => (
                  <button
                    key={kb.id}
                    onClick={() => {
                      const knowledgeBase = knowledgeBases.find(k => k.id === kb.id);
                      setSelectedKnowledgeBases((prev) =>
                        prev.some(kb => kb.id === knowledgeBase!.id)
                          ? prev.filter(kb => kb.id !== knowledgeBase!.id)
                          : knowledgeBase ? [...prev, knowledgeBase] : prev // Add the object if found
                      );
                    }}
                    className={`
                      ${selectedKnowledgeBases.some(kb => kb.id === kb.id) ? selectedButtonClass : buttonClass}
                      ${cardClass}
                    `}
                  >
                    <span className={buttonTextClass}>
                      {kb.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Select LLM Provider</h2>
              <div className={cardContainerClass}>
                {llmProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleLLMSelection(provider.id)}
                    className={`
                      ${provider.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : selectedLLM === provider.id
                          ? selectedButtonClass
                          : buttonClass
                      }
                      ${cardClass}
                    `}
                    disabled={provider.disabled}
                  >
                    <div className={buttonContentClass}>
                      <span className={buttonTextClass}>{provider.name}</span>
                    </div>
                    {provider.disabled && (
                      <span className="absolute -top-2 -right-2 bg-purple-500 text-xs px-2 py-1 rounded-full text-white">
                        Coming Soon
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Select Agent Type</h2>
              <div className={cardContainerClass}>
                {agentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleAgentTypeSelection(type.id)}
                    className={`
                      ${type.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : selectedAgentType === type.id
                          ? selectedButtonClass
                          : buttonClass
                      }
                      ${cardClass}
                    `}
                    disabled={type.disabled}
                  >
                    <div className={buttonContentClass}>
                      <span className={buttonTextClass}>{type.name}</span>
                    </div>
                    {type.disabled && (
                      <span className="absolute -top-2 -right-2 bg-purple-500 text-xs px-2 py-1 rounded-full text-white">
                        Coming Soon
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className={`${buttonClass} ${currentStep === 1 ? "invisible" : "visible"}`}
            >
              Back
            </button>
            {currentStep === 4 ? (
              <div className="relative group">
                <button
                  onClick={handleStart}
                  className={`${primaryButtonClass} ${!selectedAgentType ? "opacity-50 cursor-not-allowed" : ""
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
                  className={`${buttonClass} ${!isStepValid(currentStep) ? "opacity-50 cursor-not-allowed" : ""}`}
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
  );
}
