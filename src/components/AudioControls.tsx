
interface AudioControlsProps {
  started: boolean;
  muted: boolean;
  volumes: {
    instrumental: number;
    wind: number;
    snowfall: number;
  };
  onStart: () => void;
  onMute: () => void;
  onVolumeChange: (track: "instrumental" | "wind" | "snowfall", value: number) => void;
}

export default function AudioControls({
  started,
  muted,
  volumes,
  onStart,
  onMute,
  onVolumeChange,
}: AudioControlsProps) {
  return (
    <div className="audio-controls" role="group" aria-label="Audio controls">
      {!started ? (
        <button type="button" onClick={onStart} aria-label="Enable sound">
          Enable sound
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onMute}
            aria-label={muted ? "Unmute audio" : "Mute audio"}
            aria-pressed={muted}
          >
            {muted ? "Unmute" : "Mute"}
          </button>

          {(
            ["instrumental", "wind", "snowfall"] as const
          ).map((track) => (
            <label key={track}>
              <span>{track}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volumes[track]}
                aria-label={`${track} volume`}
                onChange={(event) =>
                  onVolumeChange(track, Number(event.target.value))
                }
              />
            </label>
          ))}
        </>
      )}
    </div>
  );
}
