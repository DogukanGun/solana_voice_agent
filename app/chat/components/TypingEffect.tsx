"use client"
import { useState, useEffect } from "react";

function TypingEffect({ text }: { text: string | null }) {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        if (!text) {
            setDisplayText(""); // Clear display when text is null or empty
            return;
        }
        let index = -1;
        setDisplayText(""); // Reset display text
        const interval = setInterval(() => {
            if (index < text.length-1) {
                setDisplayText((prev) => prev + text[index]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Adjust typing speed here (in ms)

        return () => clearInterval(interval); // Cleanup
    }, [text]);

    return <>{displayText}</>;
}


export default TypingEffect;