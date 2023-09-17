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
const initSidesWidth = [80, 90, 90, 100];
function Timer() {
  //bottom->left->top->right
  const [sidesWidth, setSidesWidth] = useState<number[]>(initSidesWidth);
  const sideIndexRef = useRef<number>(0);
  const intervalRef = useRef<null | number>(null);

  useEffect(() => {
    if (sidesWidth[sideIndexRef.current] < 0) {
      if (
        sideIndexRef.current === sidesWidth.length - 1 &&
        intervalRef.current
      ) {
        //do something here
        clearInterval(intervalRef.current);
        return;
      }
      sideIndexRef.current += 1;
    }
  }, [sidesWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("interval");
      setSidesWidth((prevState) => {
        return prevState.map((sideWidth, index) =>
          index === sideIndexRef.current
            ? sideWidth -
              initSidesWidth[sideIndexRef.current] / (sidePortion * 10)
            : sideWidth,
        );
      });
      intervalRef.current = interval;
    }, 100);
    return () =>
      intervalRef.current ? clearInterval(intervalRef.current) : undefined;
  }, []);

  return (
    <div className="absolute w-[calc(100%+20px)] h-[calc(100%+20px)] top-[-10px] left-[-10px]">
      {/* bottom */}
      <div className="absolute bottom-0 left-0 bg-cell-can-accept-piece-bg w-full h-[10px]">
        <div
          style={{ width: `${sidesWidth[0] > 0 ? sidesWidth[0] : 0}%` }}
          className="absolute bg-board-green h-full transition-all duration-300 ease-in-out left-[10px]"
        />
      </div>
      {/* left */}

      <div className="absolute top-0 left-0 bg-cell-can-accept-piece-bg h-full w-[10px]">
        <div
          style={{ height: `${sidesWidth[1] > 0 ? sidesWidth[1] : 0}%` }}
          className="absolute bg-board-green w-full transition-all duration-300 ease-in-out top-[10px]"
        />
      </div>
      {/* top */}

      <div className="absolute top-0 right-0 bg-cell-can-accept-piece-bg w-full h-[10px]">
        <div
          style={{ width: `${sidesWidth[2] > 0 ? sidesWidth[2] : 0}%` }}
          className="absolute bg-board-green h-full right-[10px] transition-all duration-300 ease-in-out"
        />
      </div>
      {/* right */}

      <div className="absolute top-0 right-0 bg-cell-can-accept-piece-bg h-full w-[10px]">
        <div
          style={{ height: `${sidesWidth[3] > 0 ? sidesWidth[3] : 0}%` }}
          className="absolute bg-board-green w-full bottom-0 transition-all duration-300 ease-in-out"
        />
      </div>
    </div>
  );
}

export default TurnSquare;
