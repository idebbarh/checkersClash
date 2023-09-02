import { NUMBER_OF_CELLS_IN_ROW } from "../utils/constants";

type PieceType = {
  boardWith: number;
  hasPiece: boolean;
  isAcceptPiece: boolean;
};

function Cell({ boardWith, hasPiece, isAcceptPiece }: PieceType) {
  const cellSize = {
    width: `${boardWith / NUMBER_OF_CELLS_IN_ROW}px`,
    height: `${boardWith / NUMBER_OF_CELLS_IN_ROW}px`,
  };
  return (
    <div
      style={cellSize}
      className={`${isAcceptPiece ? "bg-green-600" : "bg-white"}`}
    ></div>
  );
}

export default Cell;
