
import { useEffect, useState } from "react";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen request failed:", error);
    }
  };

  useEffect(() => {
    const update = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", update);

    return () => {
      document.removeEventListener("fullscreenchange", update);
    };
  }, []);

  return (
    <button className="fullscreen-button" onClick={toggleFullscreen}>
      {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
    </button>
  );
}
