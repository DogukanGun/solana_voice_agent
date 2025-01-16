'use client'
import Microphone from "./components/Microphone";
import Starter from "./components/Starter";
import { useAppKitAccount } from "../config";


export default function Home() {
  const { isConnected } = useAppKitAccount()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 flex justify-center items-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4">
        {
          isConnected ? <Microphone /> : <Starter/>
        }
      </div>
    </main>
  );
}