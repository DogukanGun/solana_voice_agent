"use client";
import ChatPage from "../components/ChatPage";

export default function ChatWithId({ params }: { params: { id: string } }) {
  return <ChatPage initialChatId={params.id} />;
}
