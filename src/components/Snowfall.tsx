import { useEffect, useRef, useState } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  opacity: number;
}

const createSnowflake = (width: number, height: number): Snowflake => ({
  x: Math.random() * width,
  y: Math.random() * height,
  radius: Math.random() * 2 + 0.5,
  speed: Math.random() * 0.7 + 0.3,
  drift: Math.random() * 0.5 - 0.25,
  opacity: Math.random() * 0.6 + 0.2,
});

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flakesRef = useRef<Snowflake[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const densityRef = useRef(50);
  const speedRef = useRef(1);
  const windRef = useRef(0);
  const pausedRef = useRef(false);
  const pointerInteractionRef = useRef(false);
  const pointerRef = useRef({ x: -1000, y: -1000 });

  const [density, setDensity] = useState(50);
  const [speed, setSpeed] = useState(1);
  const [wind, setWind] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [moveAwayFromPointer, setMoveAwayFromPointer] = useState(false);

  const updateDensity = (value: number) => {
    densityRef.current = value;
    setDensity(value);

    const { width, height } = dimensionsRef.current;
    const targetCount = Math.round(value * 2.5);
    const flakes = flakesRef.current;

    while (flakes.length < targetCount) {
      flakes.push(createSnowflake(width, height));
    }

    flakes.length = targetCount;
  };

  const updateSpeed = (value: number) => {
    speedRef.current = value;
    setSpeed(value);
  };

  const updateWind = (value: number) => {
    windRef.current = value;
    setWind(value);
  };

  const togglePaused = () => {
    const nextPaused = !pausedRef.current;
    pausedRef.current = nextPaused;
    setIsPaused(nextPaused);
  };

  const updatePointerInteraction = (enabled: boolean) => {
    pointerInteractionRef.current = enabled;
    setMoveAwayFromPointer(enabled);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    let animationFrame = 0;
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const resize = () => {
      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;
      dimensionsRef.current = { width, height };

      const targetCount = Math.round(densityRef.current * 1.8);
      const flakes = flakesRef.current;

      while (flakes.length < targetCount) {
        flakes.push(createSnowflake(width, height));
      }

      flakes.length = targetCount;
    };

    const updateReducedMotion = () => {
      pausedRef.current = motionPreference.matches;
      setIsPaused(motionPreference.matches);
    };

    const updatePointer = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };

    const clearPointer = () => {
      pointerRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      const { width, height } = dimensionsRef.current;
      const pointer = pointerRef.current;

      context.clearRect(0, 0, width, height);

      flakesRef.current.forEach((flake) => {
        if (!pausedRef.current) {
          flake.y += flake.speed * speedRef.current;
          flake.x += flake.drift + windRef.current * 0.5;

          if (pointerInteractionRef.current) {
            const dx = flake.x - pointer.x;
            const dy = flake.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            const radius = 72;

            if (distance > 0 && distance < radius) {
              const strength = (1 - distance / radius) * 0.45;
              flake.x += (dx / distance) * strength;
              flake.y += (dy / distance) * strength;
            }
          }

          if (flake.y > height + 5) {
            flake.y = -5;
            flake.x = Math.random() * width;
          }

          if (flake.x > width + 5) flake.x = -5;
          if (flake.x < -5) flake.x = width + 5;
        }

        context.beginPath();
        context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(235, 242, 250, ${flake.opacity})`;
        context.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    updateReducedMotion();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("pointerleave", clearPointer);
    motionPreference.addEventListener("change", updateReducedMotion);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", clearPointer);
      motionPreference.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="snowfall-canvas"
        aria-hidden="true"
      />

      <section className="snowfall-controls" aria-label="Snowfall controls">
        <label className="snowfall-range">
          <span>
            <span>Density</span>
            <output>{density}%</output>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={density}
            onChange={(event) => updateDensity(Number(event.target.value))}
            aria-label="Snowfall density"
          />
        </label>

        <label className="snowfall-range">
          <span>
            <span>Speed</span>
            <output>
              {Number.isInteger(speed) ? speed.toFixed(1) : speed.toFixed(2)}x
            </output>
          </span>
          <input
            type="range"
            min="0.25"
            max="2.5"
            step="0.05"
            value={speed}
            onChange={(event) => updateSpeed(Number(event.target.value))}
            aria-label="Snowfall speed"
          />
        </label>

        <label className="snowfall-range">
          <span>
            <span>Wind</span>
            <output>
              {wind === 0
                ? "0"
                : `${wind > 0 ? "+" : ""}${
                    Number.isInteger(wind) ? wind.toFixed(1) : wind.toFixed(2)
                  }`}
            </output>
          </span>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={wind}
            onChange={(event) => updateWind(Number(event.target.value))}
            aria-label="Snowfall wind"
          />
        </label>

        <label className="snowfall-toggle">
          <input
            type="checkbox"
            checked={moveAwayFromPointer}
            onChange={(event) => updatePointerInteraction(event.target.checked)}
            aria-label="Move snow away from pointer"
          />
          <span>Move away from pointer</span>
        </label>

        <button
          className="snowfall-play"
          type="button"
          onClick={togglePaused}
          aria-label={isPaused ? "Resume snowfall" : "Pause snowfall"}
          aria-pressed={isPaused}
        >
          {isPaused ? "Play" : "Pause"}
        </button>
      </section>
    </>
  );
}
