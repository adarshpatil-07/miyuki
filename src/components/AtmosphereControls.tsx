
interface AtmosphereControlsProps {
  atmosphere: "day" | "sunset" | "night";
  onChange: (value: "day" | "sunset" | "night") => void;
}

const options = ["day", "sunset", "night"] as const;

export default function AtmosphereControls({
  atmosphere,
  onChange,
}: AtmosphereControlsProps) {
  return (
    <div className="atmosphere-controls" role="group" aria-label="Atmosphere">
      {options.map((option) => (
        <button
          key={option}
          className={atmosphere === option ? "active" : ""}
          type="button"
          aria-pressed={atmosphere === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
