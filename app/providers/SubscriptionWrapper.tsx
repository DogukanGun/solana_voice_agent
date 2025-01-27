"use client"
import React, { useEffect, useState, ReactNode } from 'react';
import { useModal } from '../hooks/useModal';
import { buttonClass } from '../components/ButtonClass';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useAppKit, useAppKitAccount } from '../config';
import { useAppKitProvider } from '@reown/appkit/react';
import type { Provider } from '@reown/appkit-adapter-solana'
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { useSnackbar } from 'notistack';
import { apiService } from '../services/ApiService';

type SubscriptionWrapperProps = {
  children: ReactNode;
};

const SubscriptionWrapper: React.FC<SubscriptionWrapperProps> = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { openModal, closeModal, setModalContent } = useModal();
  const { address, isConnected } = useAppKitAccount()
  const { open, close } = useAppKit()
  const [accessCode, setAccessCode] = useState<string>("");
  const { walletProvider } = useAppKitProvider<Provider>('solana')
  const { connection } = useAppKitConnection()
  const { enqueueSnackbar } = useSnackbar();

  const PopupComponent = React.memo(() => (
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
            className="border px-4 py-2 w-full rounded-l-2xl"
            value={accessCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccessCode(e.target.value)}
          />
          <button onClick={handleCheckCode} className="bg-blue-500 text-white rounded-r-2xl px-4 py-2">
            Submit
          </button>
        </div>
      </div>
    </div>
  ));


  const handleCheckCode = async () => {
    try {
      const data = await apiService.checkUsercode(accessCode)
      if (data.isValid) {
        setIsAllowed(true);
        setShowPopup(false);
      } else {
        console.error('Invalid access code');
      }
    } catch (e) {
      console.error('Failed to verify access code:', e);
    }
  }

  const handleSubscribe = async () => {
    const env = process.env.NODE_ENV;
    if (!isConnected || address === undefined) {
      open()
      enqueueSnackbar('Please connect with a wallet that has funding.', { variant: 'error' });
      return
    }
    const recipientAddress = new PublicKey("2B8gzcafXieWkB2SL9Esnj7h16ECDnsd5msbg42qn1BS");
    const senderAddress = new PublicKey(address);
    const usdcMint = new PublicKey(env == "development" ? "Es9vMFrzaCERMaVSPyY9KaSk4uKygHNKx5o7pCjHjJ1i" : "EPjFWdd5AuLkZkdr9vNdD8xpLdmrQFAhQ5ABw4gMiHQm");
    const userUSDCAddress = await getAssociatedTokenAddress(usdcMint, senderAddress);
    const recipientUSDCAddress = await getAssociatedTokenAddress(usdcMint, recipientAddress);
    const amount = 10 * 10 ** 6; // USDC has 6 decimal places
    const transferInstruction = createTransferInstruction(
      userUSDCAddress,
      recipientUSDCAddress,
      recipientAddress,
      amount,
      [],
      TOKEN_PROGRAM_ID
    );
    const transaction = new Transaction().add(transferInstruction);
    const hash = await connection?.getLatestBlockhash()
    transaction.recentBlockhash = hash?.blockhash
    transaction.feePayer = senderAddress
    const signature = await walletProvider.signAndSendTransaction(transaction);
    if (signature) {
      setShowPopup(false);
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          transactionSignature: signature,
        }),
      });
      if (res.ok) {
        setIsAllowed(true);
      } else {
        console.error('Failed to register subscription:', await res.text());
      }
    }
  };

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/user/check');
        if (response.status === 200) {
          setIsAllowed(true);
        } else {
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setShowPopup(true);
      }
    };

    checkSubscriptionStatus();
  }, []);

  useEffect(() => {
    if (showPopup) {
      setModalContent(<PopupComponent />);
      openModal();
    } else {
      closeModal();
    }

    return () => {
      closeModal();
    };
  }, [showPopup]);

  if (isAllowed) {
    return <>{children}</>; // Render the page content if the user is allowed.
  }

  return (
    <>
      {isAllowed && children}
    </>
  );
};

export default SubscriptionWrapper;
