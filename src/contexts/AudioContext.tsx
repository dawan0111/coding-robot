import React from 'react'
type audioT = "bgm" | "drop"

const soundMapper: Record<audioT, string> = {
  "bgm": require("../sounds/bgm2.wav").default,
  "drop": require("../sounds/drop.wav").default,
}

interface audioPlayOptionT {
  loop?: boolean;
}

interface AudioPlayerContextT {
  play(id: audioT, options?: audioPlayOptionT): void;
  stop(id?: audioT): void;
}

const AudioPlayerContext = React.createContext({} as AudioPlayerContextT);

export default AudioPlayerContext;

export const AudioPlayerProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const soundWrapperRef = React.useRef<HTMLDivElement>(null);

  const getAudioElement = (id: audioT): HTMLAudioElement | null => {
    return soundWrapperRef.current?.querySelector(`[data-id="${id}"]`) || null;
  };
  const handlePlayMusic = (id: audioT, options: audioPlayOptionT) => {
    const audio = getAudioElement(id);
    
    if (audio) {
      audio.loop = Boolean(options?.loop);
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }

      audio.play();
    }
  };

  const handleStopMusic = (id?: audioT) => {
    if (id) {
      const audio = getAudioElement(id);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } else {
      (Object.keys(soundMapper) as audioT[]).forEach((key) => {
        handleStopMusic(key);
      });
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        play: handlePlayMusic,
        stop: handleStopMusic,
      }}>
      {children}
      <div ref={soundWrapperRef}>
        {Object.entries(soundMapper).map(([key, src]) => (
          <audio key={key} data-id={key} src={src} />
        ))}
      </div>
    </AudioPlayerContext.Provider>
  );
};
