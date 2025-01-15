"use client";

import { useState, useCallback, } from "react";
import Recording from "../../../public/recording.svg";
import Siriwave from 'react-siriwave';
import TypingEffect from "./TypingEffect";


export default function Microphone() {
    const [micOpen, setMicOpen] = useState(false);
    const [microphone, setMicrophone] = useState<MediaRecorder | null>();
    const [userMedia, setUserMedia] = useState<MediaStream | null>();
    const [caption, setCaption] = useState<string>("");
    const [audio] = useState<HTMLAudioElement | null>();
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

    const toggleMicrophone = useCallback(async () => {
        if (microphone && userMedia) {
            setUserMedia(null);
            setMicrophone(null);
            microphone.stop();
        } else {
            const userMedia = await navigator.mediaDevices.getUserMedia({ audio: true });
            const microphone = new MediaRecorder(userMedia);
            microphone.start(200);
            setAudioChunks([]);
            microphone.onstart = () => {
                setMicOpen(true);
            };
            microphone.onstop = async() => {
                setMicOpen(false);
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append("audio", audioBlob, "audio.webm");
                if (audioBlob.size === 0) {
                    console.error("Audio blob is empty. Check the recording process.");
                    return;
                }
                try {
                    const response = await fetch("/api/transcribe", {
                        method: "POST",
                        body: formData,
                    });
                    const result = await response.json();
                    console.log("Transcription:", result.text);
                    setCaption(result.text);
                } catch (error) {
                    console.error("Error transcribing audio:", error);
                }
            };

    
            microphone.ondataavailable = async (e) => {
                setAudioChunks((prevChunks) => [...prevChunks, e.data]);
            };
    
            setUserMedia(userMedia);
            setMicrophone(microphone);
        }
    }, [microphone, userMedia]);
    

    const generateAudio = async (caption: string) => {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ caption }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch audio");
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error("Error generating audio:", error);
        }
    }

    function handleAudio() {
        return audio && audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > 2;
    }

    return (
        <div className="w-full relative">
            <div className="relative flex w-screen justify-center items-center max-w-screen-lg place-items-center content-center before:pointer-events-none after:pointer-events-none before:absolute before:right-0 after:right-1/4 before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
                <Siriwave
                    theme="ios9"
                    autostart={handleAudio() || false}
                />
            </div>
            <div className="mt-10 flex flex-col align-middle items-center">
                <button className="w-24 h-24" onClick={() => toggleMicrophone()}>
                    <Recording
                        src={Recording}
                        alt="Recording Icon"
                        width={96}
                        height={96}
                        className={`cursor-pointer w-full h-full ${
                            !!userMedia && !!microphone && micOpen
                                ? "fill-red-400 drop-shadow-glowRed"
                                : "fill-gray-600"
                        }`}
                    />
                </button>
                <div className="mt-20 p-6 text-xl text-center">
                    <TypingEffect text={caption} />
                </div>
            </div>
        </div>
    );
}