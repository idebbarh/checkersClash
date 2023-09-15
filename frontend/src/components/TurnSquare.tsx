import { useEffect, useRef, useState } from "react";
import { TIMER } from "../utils/constants";

const sidePortion = TIMER / 4;

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
      {isActive && <Timer />}
    </div>
  );
}

function Timer() {
  //bottom->left->top->right
  const [sidesWidth, setSidesWidth] = useState<number[]>([100, 100, 100, 100]);
  const sideIndexRef = useRef<number>(0);

  useEffect(() => {
    if (sidesWidth[sideIndexRef.current] <= 0) {
      sideIndexRef.current += 1;
    }
  }, [sidesWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSidesWidth((prevState) => {
        return prevState.map((sideWidth, index) =>
          index === sideIndexRef.current
            ? sideWidth - 100 / (sidePortion * 10)
            : sideWidth,
        );
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="absolute w-[calc(100%+20px)] h-[calc(100%+20px)] top-[-10px] left-[-10px]">
      <div className="absolute bottom-0 left-0 bg-cell-can-accept-piece-bg w-full h-[10px]">
        <div
          style={{ width: `${sidesWidth[0]}px` }}
          className="bg-board-green h-full transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="absolute top-0 left-0 bg-cell-can-accept-piece-bg h-full w-[10px]">
        <div
          style={{ height: `${sidesWidth[1]}px` }}
          className="bg-board-green w-full transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="absolute top-0 right-0 bg-cell-can-accept-piece-bg w-full h-[10px]">
        <div
          style={{ width: `${sidesWidth[2]}px` }}
          className="absolute bg-board-green h-full right-0 transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="absolute top-0 right-0 bg-cell-can-accept-piece-bg h-full w-[10px]">
        <div
          style={{ height: `${sidesWidth[3]}px` }}
          className="absolute bg-board-green w-full bottom-0 transition-all duration-300 ease-in-out"
        />
      </div>
    </div>
  );
}

export default TurnSquare;
