import { useEffect, useState } from 'react';
import Siriwave from 'react-siriwave';
import '@reown/appkit-wallet-button/react'
import { useAppKit } from '@reown/appkit/react'

const Starter = () => {
    const [audio, setAudio] = useState<HTMLAudioElement | null | undefined>(undefined);
    const { open } = useAppKit()

    useEffect(() => {
        // const audio = new Audio();
        // audio.src = "/audio/hey-siri.mp3";
        // audio.loop = true;
        // audio.play();
        // setAudio(audio);

        // return () => {
        //     audio.pause();
        //     setAudio(null);
        // }
    }, [])

    function handleAudio() {
        return audio && audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > 2;
    }

    return (
        <div className="w-full relative">
            <div className="relative flex w-screen justify-center items-center max-w-screen-lg place-items-center content-center before:pointer-events-none after:pointer-events-none before:absolute before:right-0 after:right-1/4 before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
                {audio != undefined ? <Siriwave
                    theme="ios9"
                    autostart={handleAudio() || false}
                /> : <>
                <appkit-button />
              </>


            }
            </div>
        </div>
    )
}

export default Starter;