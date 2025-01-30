"use client";
import { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(/nexarb.png)",
        }}
      >
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r text-[#C15000] bg-clip-text">
              Welcome to NexWallet
            </h1>
            <p className="text-xl mb-8 font-light">Manage your wallet by speaking with AI</p>
            <button
              onClick={handleOpenModal}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-600 transition duration-300"
            >
              See Trial
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <VideoPlayer videoUrl="/welcome.mp4" onClose={handleCloseModal} />}
    </div>
  );
}
