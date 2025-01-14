import VideoPlayer from "./components/VideoPlayer";

export default function Home() {
  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(/nexarb.png)", // Path relative to the public folder
        }}>
        <div className="hero-overlay bg-opacity-80"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Welcome to NexWallet</h1>
            <p className="mb-5">
              Manage your wallet by speaking with AI
            </p>
          </div>
        </div>
      </div>
      <VideoPlayer/>
    </div>
  );
}
