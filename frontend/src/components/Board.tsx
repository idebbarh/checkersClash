import { useEffect, useRef, useState } from "react";
import Piece from "./Piece";
import {
  NUMBER_OF_CELLS_IN_ROW,
  NUMBER_OF_ROWS_IN_BOARD,
} from "../utils/constants";

function Board() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardWith, setBoardWith] = useState<number | null>(null);

  useEffect(() => {
    if (!boardRef.current) {
      return;
    }
    setBoardWith(boardRef.current?.offsetWidth);
  }, []);

  return (
    <div
      ref={boardRef}
      className="max-w-[600px] h-[600px] mx-auto mt-10 border border-solid border-black"
    >
      {new Array(NUMBER_OF_ROWS_IN_BOARD).fill(0).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center">
          {boardWith !== null &&
            new Array(NUMBER_OF_CELLS_IN_ROW)
              .fill(0)
              .map((_, cellIndex) => (
                <Piece
                  boardWith={boardWith}
                  key={cellIndex}
                  hasPiece={false}
                  isAcceptPiece={
                    rowIndex % 2 === 0
                      ? cellIndex % 2 === 0
                      : cellIndex % 2 !== 0
                  }
                />
              ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
