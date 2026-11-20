
import { useRef, useState } from "react";

import instrumental from "../assets/audio/japanese-instrumental.mp3";
import wind from "../assets/audio/winter-wind.mp3";
import snowfall from "../assets/audio/snowfall.mp3";

export default function useAmbientAudio() {
  const instrumentalRef = useRef<HTMLAudioElement>(null);
  const windRef = useRef<HTMLAudioElement>(null);
  const snowfallRef = useRef<HTMLAudioElement>(null);

  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  const [volumes, setVolumes] = useState({
    instrumental: 0.35,
    wind: 0.2,
    snowfall: 0.15,
  });

  const tracks = {
    instrumental: instrumentalRef,
    wind: windRef,
    snowfall: snowfallRef,
  };

  const startAudio = async () => {
    const audioElements = Object.values(tracks);

    try {
      await Promise.all(
        audioElements.map((ref) => {
          if (!ref.current) return Promise.resolve();
          ref.current.volume = muted ? 0 : volumes[
            Object.keys(tracks).find(
              (key) => tracks[key as keyof typeof tracks] === ref
            ) as keyof typeof volumes
          ];
          return ref.current.play();
        })
      );

      setStarted(true);
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  const updateVolume = (
    track: keyof typeof volumes,
    value: number
  ) => {
    setVolumes((previous) => ({ ...previous, [track]: value }));

    const audio = tracks[track].current;
    if (audio) audio.volume = muted ? 0 : value;
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);

    Object.entries(tracks).forEach(([key, ref]) => {
      if (ref.current) {
        ref.current.volume = nextMuted
          ? 0
          : volumes[key as keyof typeof volumes];
      }
    });
  };

  const audioElements = (
    <>
      <audio ref={instrumentalRef} src={instrumental} loop />
      <audio ref={windRef} src={wind} loop />
      <audio ref={snowfallRef} src={snowfall} loop />
    </>
  );

  return {
    started,
    muted,
    volumes,
    startAudio,
    updateVolume,
    toggleMute,
    audioElements,
  };
}
