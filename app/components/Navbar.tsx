"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { buttonClass, message } from "./ButtonClass";
import { useAppKitWallet } from "@reown/appkit-wallet-button/react";
import { useAppKitAccount } from "../config";
import { useAppKitProvider } from "@reown/appkit/react";
import type { Provider } from '@reown/appkit-adapter-solana'
import { useSnackbar } from 'notistack';
import { apiService } from "../services/ApiService";

const Navbar = () => {
    const path = usePathname()
    const { enqueueSnackbar } = useSnackbar();
    const { connect } = useAppKitWallet({
        onSuccess(data) {

        },
        onError(error) {

        }
    })
    const router = useRouter();
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider<Provider>('solana')

    const signMessage = async () => {
        if (!walletProvider || !address) {
            throw Error('user is disconnected')
        }

        const encodedMessage = new TextEncoder().encode(message)
        const signature = await walletProvider.signMessage(encodedMessage)

        try {
            const {token} = await apiService.postAdmin(address, Array.from(signature))
            if (!token) {
                throw new Error('Failed to fetch token');
            }

            localStorage.setItem('token', token);
            enqueueSnackbar(`Message signed successfully!`, { variant: 'success' });
            enqueueSnackbar(`Redirecting to admin page`, { variant: 'success' });
            router.push('/admin');
        } catch (error) {
            enqueueSnackbar(`Don\'t need to sign`, { variant: 'error' });
        }
    }

    return (
        <div className="drawer">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg w-full">
                    <div className="flex-none lg:hidden">
                        <label
                            htmlFor="my-drawer-3"
                            aria-label="open sidebar"
                            className="btn btn-square btn-ghost text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2 text-2xl font-bold">
                        Nexarb
                    </div>
                    {!isConnected && <button className={buttonClass} onClick={() => connect("walletConnect")}>
                        Connect Wallet
                    </button>}
                    {isConnected && <button className={buttonClass} onClick={() => signMessage()}>
                        {address}
                    </button>}
                    {isConnected && <div className="hidden flex-none lg:block">
                        <ul className="menu menu-horizontal px-4 py-2">
                            {path == "/" &&
                                <>
                                    <li className="mx-6">
                                        <Link
                                            href="/voice"
                                            className={buttonClass}
                                        >
                                            Launch App with Voice
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/chat"
                                            className={buttonClass}
                                        >
                                            Launch App with Chat
                                        </Link>
                                    </li>
                                </>
                            }
                            {path == "/chat" &&
                                <Link
                                    href="/voice"
                                    className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
                                >
                                    Switch to Voice
                                </Link>
                            }
                            {path == "/voice" &&
                                <Link
                                    href="/chat"
                                    className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
                                >
                                    Switch to Chat
                                </Link>
                            }
                        </ul>
                    </div>}
                </div>
            </div>
            {isConnected && <div className="drawer-side">
                <label
                    htmlFor="my-drawer-3"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                        {path == "/" &&
                            <>
                                <li className="mx-6">
                                    <Link
                                        href="/voice"
                                        className={buttonClass}
                                    >
                                        Launch App with Voice
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/chat"
                                        className={buttonClass}
                                    >
                                        Launch App with Chat
                                    </Link>
                                </li>
                            </>
                        }
                        {path == "/chat" &&
                            <Link
                                href="/voice"
                                className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
                            >
                                Switch to Voice
                            </Link>
                        }
                        {path == "/voice" &&
                            <Link
                                href="/chat"
                                className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
                            >
                                Switch to Chat
                            </Link>
                        }
                </ul>
            </div>}
        </div>
    );
};

export default Navbar;
