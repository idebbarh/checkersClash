import { useEffect, useRef, useState } from "react";

function TurnSquare({
  isActive,
  player,
}: {
  isActive: boolean;
  player: 1 | 2;
}) {
  return (
    <div
      className={`relative w-20 h-20 ${
        player === 1 ? "bg-player-one-piece-color" : "bg-player-two-piece-color"
      }`}
    >
      {isActive && <OverlayTimer />}
    </div>
  );
}

function OverlayTimer() {
  const [overlayHeight, setOverlayHeight] = useState<number>(100);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOverlayHeight((prevState) => prevState - 100 / 30);
    }, 1000);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (overlayHeight <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      //do somthing here//
    }
  }, [overlayHeight]);

  return (
    <div
      style={{ height: `${overlayHeight}%` }}
      className="absolute w-full h-full bottom-0 left-0 bg-[#b15653] opacity-80"
    ></div>
  );
}

export default TurnSquare;
