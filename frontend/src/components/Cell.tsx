import { ReactNode } from "react";
import { NUMBER_OF_CELLS_IN_ROW } from "../utils/constants";

type PieceType = {
  children: ReactNode | false;
  boardWith: number;
  isAcceptPiece: boolean;
  setSelectedCell: () => void;
  isSelected: boolean;
};

function Cell({
  children,
  boardWith,
  isAcceptPiece,
  setSelectedCell,
  isSelected,
}: PieceType) {
  const cellSize = {
    width: `${boardWith / NUMBER_OF_CELLS_IN_ROW}px`,
    height: `${boardWith / NUMBER_OF_CELLS_IN_ROW}px`,
  };
  return (
    <div
      style={cellSize}
      className={`${
        isAcceptPiece
          ? "bg-cell-can-accept-piece-bg"
          : "bg-cell-cannot-accept-piece-bg"
      } flex items-center justify-center z-[1] relative`}
      onClick={setSelectedCell}
    >
      {isSelected && <SelectedPieceOverlay />}
      {children}
    </div>
  );
}

function SelectedPieceOverlay() {
  return (
    <div className="z-[-1] absolute w-full h-full bottom-0 left-0 bg-board-green opacity-60 animate-pulse"></div>
  );
}

export default Cell;
