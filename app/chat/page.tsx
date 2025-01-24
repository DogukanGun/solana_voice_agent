"use client";

import { useChat } from "ai/react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import type { Provider } from '@reown/appkit-adapter-solana'
import { ChatLayout } from "./components/chat/chat-layout";
import { useAppKitAccount } from "../config";
import { VersionedTransaction } from "@solana/web3.js";
import { useAppKitProvider } from "@reown/appkit/react";
import SubscriptionWrapper from "../providers/SubscriptionWrapper";

export default function ChatUI() {
  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    error,
    stop,
    setMessages,
    setInput,
  } = useChat({
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
  const { address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider<Provider>('solana')

  useEffect(() => {
    if (messages.length < 1) {
      // Generate a random id for the chat
      console.log("Generating chat id");
      const id = uuidv4();
      setChatId(id);
    }
  }, [messages]);

  React.useEffect(() => {
    if (!isLoading && !error && chatId && messages.length > 0) {
      // Save messages to local storage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [chatId, isLoading, error]);

  const addMessage = (Message: any) => {
    messages.push(Message);
    window.dispatchEvent(new Event("storage"));
    setMessages([...messages]);
  };

  // Function to handle chatting with Ollama in production (client side)
  const handleSubmitProduction = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    addMessage({ role: "user", content: input, id: chatId });
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ caption: input, messageHistory: messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch audio");
    }
    const { text } = await response.json();// Destructure text and audio
    console.log("Text", text)
    if (text.includes("sol_ai")) {
      const res = await (await fetch("/api/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.split("op")[0], address }),
      })).json()
      console.log("Bot response", res.text)
      if (res.text) {
        addMessage({ role: "assistant", content: res.text, id: chatId });
        setMessages([...messages]);
        setLoadingSubmit(false);
      } else {
        const serializedTransaction = Buffer.from(
          res.transaction,
          "base64",
        );
        const tx = VersionedTransaction.deserialize(serializedTransaction)
        try {
          await walletProvider.signAndSendTransaction(tx);
        } catch (e) {
          console.log(e)
          addMessage({ role: "assistant", content: "Transaction failed, please try again", id: chatId });
          setMessages([...messages]);
          setLoadingSubmit(false);
        }
      }
    } else {
      console.log(text.includes("sol_ai"))
      addMessage({ role: "assistant", content: text, id: chatId });
      setMessages([...messages]);
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
    <main className="flex h-[calc(90dvh)] flex-col items-center ">
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
    </main>
  );
}
