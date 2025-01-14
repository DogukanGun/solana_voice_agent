
const VideoPlayer = () => {
    return (
        <div className="m-12">
            <div className="flex-row items-center justify-center min-h-screen">
                <h2 className="my-8 text-center text-5xl font-bold">The Feature</h2>
                <video
                    controls
                    className="max-w-full max-h-screen rounded-lg shadow-lg"
                >
                    <source src="/welcome.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    )
}


export default VideoPlayer;