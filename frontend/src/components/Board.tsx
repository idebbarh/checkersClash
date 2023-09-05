import { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import {
  NUMBER_OF_CELLS_IN_ROW,
  NUMBER_OF_ROWS_IN_BOARD,
} from "../utils/constants";
import Piece from "./Piece";
import GameMove from "../utils/functions";

function getPiecesPositions(): (0 | 1 | 2)[][] {
  let board = new Array(NUMBER_OF_ROWS_IN_BOARD).fill(0).map((_, rowIndex) => {
    return new Array(NUMBER_OF_CELLS_IN_ROW).fill(0).map((_, cellIndex) => {
      return rowIndex !== 3 && rowIndex !== 4
        ? rowIndex % 2 === 0
          ? cellIndex % 2 === 0
            ? rowIndex > 2
              ? 2
              : 1
            : 0
          : cellIndex % 2 !== 0
          ? rowIndex > 2
            ? 2
            : 1
          : 0
        : 0;
    });
  });
  return board;
}

function Board() {
  const [piecesPositions, setPiecesPositions] = useState<(0 | 1 | 2)[][]>(
    getPiecesPositions()
  );
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(
    null
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardWith, setBoardWith] = useState<number | null>(null);

  useEffect(() => {
    if (!boardRef.current) {
      return;
    }
    setBoardWith(boardRef.current?.offsetWidth);
  }, []);

  useEffect(() => {
    movePiece();
  }, [selectedCell, selectedPiece]);

  function movePiece(): void {
    if (!selectedPiece || !selectedCell) {
      return;
    }

    const [pieceRow, pieceCol] = selectedPiece;
    const [cellRow, cellCol] = selectedCell;

    setPiecesPositions(() =>
      piecesPositions.map((row, rowIndex) => {
        return row.map((colValue, colIndex) => {
          return rowIndex === pieceRow && colIndex === pieceCol
            ? 0
            : rowIndex === cellRow && colIndex === cellCol
            ? piecesPositions[pieceRow][pieceCol]
            : colValue;
        });
      })
    );
    setSelectedCell(null);
    setSelectedPiece(null);
  }

  function cellClickHandler(rowIndex: number, cellIndex: number) {
    if (!selectedPiece) {
      return;
    }

    const [pieceRow, pieceCol] = selectedPiece;
    const cellValue = piecesPositions[rowIndex][cellIndex];
    const pieceValue = piecesPositions[pieceRow][pieceCol];
    const cellPos = [rowIndex, cellIndex] as [number, number];

    const gameMove = new GameMove(
      cellValue,
      pieceValue,
      cellPos,
      selectedPiece
    );

    if (!gameMove.isValidMove()) {
      return;
    }

    setSelectedCell(() => [rowIndex, cellIndex]);
  }

  return (
    <div
      ref={boardRef}
      className="max-w-[600px] h-[600px] mx-auto mt-10 border border-solid border-black"
    >
      {new Array(NUMBER_OF_ROWS_IN_BOARD).fill(0).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center">
          {boardWith !== null &&
            new Array(NUMBER_OF_CELLS_IN_ROW).fill(0).map((_, cellIndex) => (
              <Cell
                boardWith={boardWith}
                key={cellIndex}
                isAcceptPiece={
                  rowIndex % 2 === 0 ? cellIndex % 2 === 0 : cellIndex % 2 !== 0
                }
                setSelectedCell={() => cellClickHandler(rowIndex, cellIndex)}
              >
                {piecesPositions[rowIndex][cellIndex] !== 0 && (
                  <Piece
                    player={piecesPositions[rowIndex][cellIndex] as 1 | 2}
                    setSelectedPiece={() =>
                      setSelectedPiece(() => [rowIndex, cellIndex])
                    }
                  />
                )}
              </Cell>
            ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
