"use client";

import { useState } from "react";

interface PopupComponentProps {
  handleSubscribe: () => void;
  handleCheckCode: (accessCode: string) => void;
}

const PopupComponent: React.FC<PopupComponentProps> = ({ handleSubscribe, handleCheckCode }) => {
  const [accessCode, setAccessCode] = useState<string>("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">
          Premium Access Required
        </h3>
        <p className="text-gray-300 mb-4">
          To continue using this feature, you need to either:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-6">
          <li>Pay $10 in cryptocurrency</li>
          <li>Enter a special access code</li>
        </ul>

        <button
          onClick={handleSubscribe}
          className="w-full bg-blue-600 text-white font-semibold rounded-full py-2 hover:bg-blue-700 transition duration-300 mb-4"
        >
          Subscribe Now
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter your access code"
              className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
              value={accessCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccessCode(e.target.value)}
            />
            <button
              onClick={() => handleCheckCode(accessCode)}
              className="bg-blue-600 text-white font-semibold rounded-full px-6 py-2 hover:bg-blue-700 transition duration-300"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupComponent;
