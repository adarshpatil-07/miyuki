import useAmbientAudio from "../hooks/useAmbientAudio";
import AudioControls from "./AudioControls";
import { useEffect, useState } from "react";
import Snowfall from "./Snowfall";
import AtmosphereControls from "./AtmosphereControls";
import "../styles/miyuki.css";
import FullscreenButton from "./FullscreenButton";

type Atmosphere = "day" | "sunset" | "night";

const backgrounds: Record<Atmosphere, string> = {
  day: new URL("../assets/images/winter-day.jpg", import.meta.url).href,
  sunset: new URL("../assets/images/winter-sunset.jpg", import.meta.url).href,
  night: new URL("../assets/images/winter-night.jpg", import.meta.url).href,
};

export default function OpeningSequence() {
  const [phase, setPhase] = useState(0);
  const [atmosphere, setAtmosphere] = useState<Atmosphere>("night");
  const audio = useAmbientAudio();

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 2000),
      setTimeout(() => setPhase(2), 5000),
      setTimeout(() => setPhase(3), 7000),
      setTimeout(() => setPhase(4), 10000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <main className="opening-screen">
      <FullscreenButton />
      {audio.audioElements}
      
<AudioControls
  started={audio.started}
  muted={audio.muted}
  volumes={audio.volumes}
  onStart={audio.startAudio}
  onMute={audio.toggleMute}
  onVolumeChange={audio.updateVolume}
/>
      <div className="background-container">
        {(["day", "sunset", "night"] as const).map((time) => (
          <div
            key={time}
            className={`background-image ${
              atmosphere === time ? "active" : ""
            }`}
            style={{ backgroundImage: `url("${backgrounds[time]}")` }}
          />
        ))}
      </div>

      <div className="background-overlay" />

      <Snowfall />

      <div className={`opening-title ${phase === 0 ? "visible" : "hidden"}`}>
        美雪
      </div>

      <div
        className={`opening-title english-title ${
          phase >= 1 && phase < 4 ? "visible" : "hidden"
        }`}
      >
        miyuki.
      </div>

      <p className={`opening-tagline ${
        phase >= 2 && phase < 4 ? "visible" : "hidden"
      }`}>
        Where winter feels endless.
      </p>

      {phase >= 4 && (
        <AtmosphereControls
          atmosphere={atmosphere}
          onChange={setAtmosphere}
        />
      )}
    </main>
  );
}
