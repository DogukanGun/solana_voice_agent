"use client";

import { Message, useChat } from "ai/react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import type { Provider } from "@reown/appkit-adapter-solana";
import { ChatLayout } from "./components/chat/chat-layout";
import { useAppKitAccount } from "../config";
import { VersionedTransaction } from "@solana/web3.js";
import { useAppKitProvider } from "@reown/appkit/react";
import SubscriptionWrapper from "../providers/SubscriptionWrapper";
import RequireConfig from "../components/RequireConfig";
import { apiService } from "@/app/services/ApiService";
import WalletButton from "../components/WalletButton";
import { useRouter } from "next/navigation";
import { useConfigStore } from "../store/configStore";
import { usePrivy } from "@privy-io/react-auth";

export default function ChatUI() {
  const { messages, input, handleInputChange, isLoading, error, stop, setMessages, setInput } =
    useChat({
      onResponse: (response) => {
        if (response) {
          setLoadingSubmit(false);
        }
      },
      onError: (error) => {
        setLoadingSubmit(false);
        toast.error("An error occurred. Please try again.");
      },
    });
  const [chatId, setChatId] = React.useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = usePrivy();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const router = useRouter();
  const stores = useConfigStore();

  // Add state for modal
  const [showWalletModal, setShowWalletModal] = React.useState(false);

  useEffect(() => {
    const loadHistoricalMessages = () => {
      // Check if we're returning to an existing chat
      const chatIdFromPath = window.location.pathname.split('/').pop();
      if (chatIdFromPath && chatIdFromPath !== 'chat') {
        const storedMessages = localStorage.getItem(`chat_${chatIdFromPath}`);
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          setMessages(parsedMessages);
          setChatId(chatIdFromPath);
        }
      } else {
        // Generate a new chat ID if we're not returning to an existing chat
        const id = uuidv4(); // Generate a new chat ID
        setChatId(id);
      }
    };

    if (messages.length < 1) {
      loadHistoricalMessages();
    }
  }, [setMessages]);

  React.useEffect(() => {
    if (!isLoading && !error && chatId && messages.length > 0) {
      // Save messages to local storage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [chatId, isLoading, error, messages]);

  // Check wallet connection on mount and when connection status changes
  useEffect(() => {
    // Check if the user has configured a chain with an embedded wallet
    const hasUserWallet = useConfigStore.getState().chains.some(chain => !chain.isEmbedded);

    if (!isConnected && hasUserWallet) {
      setShowWalletModal(true);
    } else {
      setShowWalletModal(false);
    }
  }, [isConnected]);

  const addMessage = (innerMessage: Message) => {
    messages.push(innerMessage);
    window.dispatchEvent(new Event("storage"));
    setMessages([...messages]);
  };

  const handleSolAi = async (text: string) => {
    const res = await apiService.postBotSolana(text, address!);
    console.log("Bot response", res.text);

    if (res.text) {
      addMessage({ role: "assistant", content: res.text, id: chatId });
      setMessages([...messages]);
      setLoadingSubmit(false);
    } else {
      const serializedTransaction = Buffer.from(res.transaction!, "base64");
      const tx = VersionedTransaction.deserialize(serializedTransaction);
      try {
        await walletProvider.signAndSendTransaction(tx);
      } catch (e) {
        console.log(e);
        addMessage({
          role: "assistant",
          content: "Transaction failed, please try again",
          id: chatId,
        });
        setMessages([...messages]);
        setLoadingSubmit(false);
      }
    }
  }

  const handleBaseAi = async (text: string) => {
    const res = await apiService.postBotBase(text, user?.id ?? "");
    console.log("Bot response", res.text);
    if (res.text) {
      addMessage({ role: "assistant", content: res.text, id: chatId });
      setMessages([...messages]);
      setLoadingSubmit(false);
    }else{
      addMessage({ role: "assistant", content: "Transaction failed, please try again", id: chatId });
      setMessages([...messages]);
      setLoadingSubmit(false);
    }
  }

  // Function to handle chatting with Ollama in production (client side)
  const handleSubmitProduction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addMessage({ role: "user", content: input, id: chatId });
    setInput("");

    try {
      const { text, op } = await apiService.postChat(input, messages, stores.chains);
      console.log("Text=", text);
      console.log("Op=", op);
      if (op === "solana") {
        handleSolAi(text);
      } else if (op ==="base") {
        handleBaseAi(text);
      } else {
        console.log(text.includes("sol_ai"));
        addMessage({ role: "assistant", content: text, id: chatId });
        setMessages([...messages]);
        setLoadingSubmit(false);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("An error occurred. Please try again.");
      setLoadingSubmit(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);

    setMessages([...messages]);
    handleSubmitProduction(e);
  };

  return (
    <main className="flex h-[calc(90dvh)] flex-col items-center page-with-navbar">
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Please connect your wallet to continue using the chat.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center">
                <WalletButton />
              </div>
              <button
                onClick={() => router.push('/app')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
      <RequireConfig>
        <SubscriptionWrapper>
          <ChatLayout
            chatId={chatId}
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={onSubmit}
            isLoading={isLoading}
            loadingSubmit={loadingSubmit}
            error={error}
            stop={stop}
            navCollapsedSize={10}
            defaultLayout={[30, 160]}
            formRef={formRef}
            setMessages={setMessages}
            setInput={setInput}
          />
        </SubscriptionWrapper>
      </RequireConfig>
    </main>
  );
}
