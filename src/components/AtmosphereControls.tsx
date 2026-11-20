
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
    <div className="atmosphere-controls">
      {options.map((option) => (
        <button
          key={option}
          className={atmosphere === option ? "active" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
