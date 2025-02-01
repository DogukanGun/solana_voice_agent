"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat, Message } from "ai/react";
import { ChatLayout } from "../components/chat/chat-layout";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { apiService } from "@/app/services/ApiService";

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatId, setChatId] = useState<string>("");
    const { input, handleInputChange, isLoading, error, stop, setInput } = useChat();
    const [defaultLayout] = useState([30, 160]); // Example default layout
    const navCollapsedSize = 10; // Example nav collapsed size
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const loadHistoricalMessages = () => {
            const chatIdFromPath = window.location.pathname.split('/').pop();
            if (chatIdFromPath && chatIdFromPath !== 'chat') {
                const storedMessages = localStorage.getItem(`chat_${chatIdFromPath}`);
                if (storedMessages) {
                    setMessages(JSON.parse(storedMessages));
                    setChatId(chatIdFromPath);
                } else {
                    // Generate a new chat ID if no messages found
                    const id = uuidv4(); // Generate a new chat ID
                    setChatId(id);
                }
            } else {
                // Generate a new chat ID if no chatId is present
                const id = uuidv4(); // Generate a new chat ID
                setChatId(id);
            }
        };

        loadHistoricalMessages();
    }, []);

    useEffect(() => {
        if (chatId && messages.length > 0) {
            // Save messages to local storage
            localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
            // Trigger the storage event to update the sidebar component
            window.dispatchEvent(new Event("storage"));
        }
    }, [chatId, messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Add the user message to the messages array
        const userMessage: Message = { role: "user", content: input, id: chatId };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput(""); // Clear the input field

    };

    return (
        <main className="flex h-[calc(90dvh)] flex-col items-center ">
            <ChatLayout
                chatId={chatId}
                messages={messages}
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                stop={stop}
                defaultLayout={defaultLayout}
                navCollapsedSize={navCollapsedSize}
                setMessages={setMessages}
                formRef={formRef}
            />
        </main>
    );
}
