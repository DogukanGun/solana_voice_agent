"use client";

import { useState } from "react";
import { buttonClass } from "./ButtonClass";

interface PopupComponentProps {
  handleSubscribe: () => void;
  handleCheckCode: (accessCode: string) => void;
}

const PopupComponent: React.FC<PopupComponentProps> = ({ handleSubscribe, handleCheckCode }) => {
  const [accessCode, setAccessCode] = useState<string>("");

  return (
    <div className="popup text-center bg-slate-500 rounded-lg p-8">
      <h2 className="text-2xl py-2">Subscription Required</h2>
      <p>You need to pay $10 to subscribe.</p>
      <div className="flow grid-flow-row gap-4">
        <button className={`${buttonClass} mt-3 w-full`} onClick={handleSubscribe}>
          Subscribe Now
        </button>
        <div className="flex items-center mt-6">
          <input
            type="text"
            placeholder="Enter your access code"
            className="border px-4 py-2 w-full rounded-l-2xl text-black"
            value={accessCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccessCode(e.target.value)}
          />
          <button
            onClick={() => handleCheckCode(accessCode)}
            className="bg-blue-500 text-white rounded-r-2xl px-4 py-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupComponent;
