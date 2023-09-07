import { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import {
  NUMBER_OF_CELLS_IN_ROW,
  NUMBER_OF_ROWS_IN_BOARD,
} from "../utils/constants";
import Piece from "./Piece";
import GameMove from "../utils/functions";
import TurnSquare from "./TurnSquare";
import MoveMarker from "./MoveMarker";

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

  const [playerTurn, setPlayerTurn] = useState<1 | 2 | null>(null);

  const [possibleMoves, setPossibleMoves] = useState<null | number[][]>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  const [boardWith, setBoardWith] = useState<number | null>(null);

  useEffect(() => {
    if (!boardRef.current) {
      return;
    }
    setBoardWith(boardRef.current?.offsetWidth);
    setPlayerTurn(() => Math.floor(Math.random() * 2 + 1) as 1 | 2);
  }, []);

  useEffect(() => {
    movePiece();
  }, [selectedCell, selectedPiece]);

  function clearBoardSelections() {
    setSelectedCell(null);
    setSelectedPiece(null);
    setPossibleMoves(null);
  }

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
    clearBoardSelections();
    changeTurn();
  }

  function changeTurn(): void {
    if (!playerTurn) {
      return;
    }
    const turnMatch: { 1: 2; 2: 1 } = {
      1: 2,
      2: 1,
    };
    setPlayerTurn(() => turnMatch[playerTurn]);
  }

  function cellClickHandler(rowIndex: number, cellIndex: number) {
    if (!selectedPiece || piecesPositions[rowIndex][cellIndex] !== 0) {
      pieceClickHandler(rowIndex, cellIndex);
      return;
    }

    const [pieceRow, pieceCol] = selectedPiece;
    const cellValue = piecesPositions[rowIndex][cellIndex];
    const pieceValue = piecesPositions[pieceRow][pieceCol];
    const cellPos = [rowIndex, cellIndex] as [number, number];

    const isValidMove = GameMove.isValidMove(
      cellValue,
      pieceValue,
      cellPos,
      selectedPiece
    );

    if (!isValidMove) {
      return;
    }

    setSelectedCell(() => [rowIndex, cellIndex]);
  }

  function pieceClickHandler(rowIndex: number, cellIndex: number) {
    if (piecesPositions[rowIndex][cellIndex] !== playerTurn) {
      return;
    }

    const piecePos: [number, number] = [rowIndex, cellIndex];
    const pieceValue = piecesPositions[rowIndex][cellIndex];
    const moves = GameMove.pieceAvailableMoves(
      piecePos,
      pieceValue,
      piecesPositions
    );
    setPossibleMoves(() => moves);
    setSelectedPiece(() => [rowIndex, cellIndex]);
  }
  console.log(possibleMoves);

  return (
    <div className="h-screen bg-[#c6e2e9] p-4">
      <div className="flex items-center justify-center gap-4">
        <TurnSquare isActive={playerTurn === 1} player={1} />
        <TurnSquare isActive={playerTurn === 2} player={2} />
      </div>
      <div
        ref={boardRef}
        className="max-w-[600px] h-[600px] mx-auto mt-10 rounded-3xl overflow-hidden border-2 border-solid border-white shadow-boardShadow"
      >
        {new Array(NUMBER_OF_ROWS_IN_BOARD).fill(0).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-center">
            {boardWith !== null &&
              new Array(NUMBER_OF_CELLS_IN_ROW).fill(0).map((_, cellIndex) => (
                <Cell
                  boardWith={boardWith}
                  key={cellIndex}
                  isAcceptPiece={
                    rowIndex % 2 === 0
                      ? cellIndex % 2 === 0
                      : cellIndex % 2 !== 0
                  }
                  setSelectedCell={() => cellClickHandler(rowIndex, cellIndex)}
                  isSelected={
                    selectedPiece
                      ? selectedPiece[0] === rowIndex &&
                        selectedPiece[1] === cellIndex
                      : false
                  }
                >
                  {piecesPositions[rowIndex][cellIndex] !== 0 && (
                    <Piece
                      player={piecesPositions[rowIndex][cellIndex] as 1 | 2}
                      setSelectedPiece={() =>
                        pieceClickHandler(rowIndex, cellIndex)
                      }
                    />
                  )}
                  {possibleMoves?.some(
                    ([row, col]) => row === rowIndex && col === cellIndex
                  ) && <MoveMarker />}
                </Cell>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
