import { ReactNode } from "react";
import { NUMBER_OF_CELLS_IN_ROW } from "../utils/constants";

type PieceType = {
  children: ReactNode | false;
  boardWith: number;
  isAcceptPiece: boolean;
  setSelectedCell: () => void;
};

function Cell({
  children,
  boardWith,
  isAcceptPiece,
  setSelectedCell,
}: PieceType) {
  const cellSize = {
    width: `${boardWith / NUMBER_OF_CELLS_IN_ROW}px`,
    height: `${boardWith / NUMBER_OF_CELLS_IN_ROW}px`,
  };
  return (
    <div
      style={cellSize}
      className={`${isAcceptPiece ? "bg-green-600" : "bg-white"}`}
      onClick={setSelectedCell}
    >
      {children}
    </div>
  );
}

export default Cell;
