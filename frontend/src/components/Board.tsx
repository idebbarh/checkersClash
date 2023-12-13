import React, { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import {
  NUMBER_OF_CELLS_IN_ROW,
  NUMBER_OF_ROWS_IN_BOARD,
} from "../utils/constants";
import Piece from "./Piece";
import GameMoves from "../utils/gameMoves";
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

type BoardType = {
  playerTurn: 1 | 2;
  setPlayerTurn: React.Dispatch<React.SetStateAction<1 | 2 | null>>;
};

function Board({ playerTurn, setPlayerTurn }: BoardType) {
  const [piecesPositions, setPiecesPositions] =
    useState<(0 | 1 | 2 | 3 | 4)[][]>(getPiecesPositions());
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(
    null,
  );
  const [possibleMoves, setPossibleMoves] = useState<null | number[][]>(null);
  const [boardWith, setBoardWith] = useState<number | null>(null);
  const [availablePieces, setAvailablePieces] = useState<[] | number[][]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const piecesPositionsRef = useRef<(0 | 1 | 2 | 3 | 4)[][]>(piecesPositions);

  useEffect(() => {
    if (!boardRef.current) {
      return;
    }
    setBoardWith(boardRef.current?.offsetWidth);
  }, []);

  useEffect(() => {
    setAvailablePieces(() => getAvailablePieces());
  }, [playerTurn]);

  useEffect(() => {
    piecesPositionsRef.current = piecesPositions;
  }, [piecesPositions]);

  function clearBoardSelections() {
    setSelectedPiece(null);
    setPossibleMoves(null);
  }

  function movePiece(
    selectedCell: [number, number],
    pieceToEat: [number, number] | null,
  ): void {
    if (!selectedPiece || !playerTurn) {
      return;
    }

    const [pieceRow, pieceCol] = selectedPiece;
    const [cellRow, cellCol] = selectedCell;
    const isKing =
      (cellRow === 0 && playerTurn === 2) ||
      (cellRow === piecesPositions.length - 1 && playerTurn === 1);
    const playerKing = playerTurn === 1 ? 3 : 4;

    setPiecesPositions((prevState) => {
      const newArr = [...prevState];
      //remove the piece from its old position
      newArr[pieceRow][pieceCol] = 0;
      //set the new piece its new position
      newArr[cellRow][cellCol] = isKing ? playerKing : playerTurn;
      //if there a taken piece remove it.
      if (pieceToEat) {
        const [pieceToEatRow, pieceToEatCol] = pieceToEat;
        newArr[pieceToEatRow][pieceToEatCol] = 0;
      }
      return newArr;
    });

    const isValidToSwitch = GameMoves.isValidToSwitchPlayer(
      selectedCell,
      playerTurn,
      piecesPositions,
    );

    clearBoardSelections();

    if (isValidToSwitch || pieceToEat === null) {
      changeTurn();
    } else {
      setTimeout(() => {
        pieceClickHandler(cellRow, cellCol);
      }, 0);
    }
  }

  function cellClickHandler(rowIndex: number, cellIndex: number) {
    if (!selectedPiece || piecesPositions[rowIndex][cellIndex] !== 0) {
      pieceClickHandler(rowIndex, cellIndex);
      return;
    }

    if (
      !possibleMoves?.some(
        ([moveRow, moveCol]) => rowIndex === moveRow && cellIndex === moveCol,
      )
    ) {
      return;
    }

    const cellPos: [number, number] = [rowIndex, cellIndex];

    const [isValidMove, pieceToEatPosition] = GameMoves.isValidMove(
      cellPos,
      selectedPiece,
      piecesPositions,
    );

    if (!isValidMove) {
      return;
    }

    movePiece([rowIndex, cellIndex], pieceToEatPosition);
  }

  //i used here piecesPositionsRef insteand of piecesPositions because i need to call pieceClickHandler inside setTimeout.
  function pieceClickHandler(rowIndex: number, cellIndex: number) {
    //this just for the validation
    const forValidationAvailablePieces = getAvailablePieces();
    //check if the selected piece belong to the player who the turn is his turn, or the selected piece not in the available valid pieces to play with.
    if (
      piecesPositionsRef.current[rowIndex][cellIndex] !== playerTurn ||
      !forValidationAvailablePieces.some(
        ([moveRow, moveCol]) => moveRow === rowIndex && moveCol === cellIndex,
      )
    ) {
      clearBoardSelections();
      setAvailablePieces(() => forValidationAvailablePieces);
      return;
    }

    const piecePos: [number, number] = [rowIndex, cellIndex];

    const movesInfo = GameMoves.pieceAvailableMoves(
      piecePos,
      playerTurn,
      piecesPositionsRef.current,
    );

    setPossibleMoves(() =>
      movesInfo.eatMoves.length ? movesInfo.eatMoves : movesInfo.normalMoves,
    );

    setSelectedPiece(() => [rowIndex, cellIndex]);
    setAvailablePieces(() => []);
  }

  function changeTurn(): void {
    if (!playerTurn) {
      return;
    }
    setPlayerTurn(() => (playerTurn === 1 ? 2 : 1));
  }

  function getAvailablePieces(): number[][] {
    const forceMoves = getEatMoves();
    if (forceMoves.length > 0) {
      if (forceMoves.length === 1) {
        return forceMoves;
      }
      return getEatMoveWithMaxEats(forceMoves);
    }

    let pieces: number[][] = [];
    piecesPositions.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === playerTurn) {
          const movesInfo = GameMoves.pieceAvailableMoves(
            [rowIndex, colIndex],
            playerTurn,
            piecesPositionsRef.current,
          );
          if (movesInfo.normalMoves.length > 0) {
            pieces.push([rowIndex, colIndex]);
          }
        }
      });
    });
    return pieces;
  }

  function getEatMoves(): number[][] {
    const moves: number[][] = [];
    piecesPositions.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === playerTurn) {
          const movesInfo = GameMoves.pieceAvailableMoves(
            [rowIndex, colIndex],
            playerTurn,
            piecesPositionsRef.current,
          );
          if (movesInfo.eatMoves.length > 0) {
            moves.push([rowIndex, colIndex]);
          }
        }
      });
    });
    return moves;
  }

  function getEatMoveWithMaxEats(pieces: number[][]): number[][] {
    let maxPiecesOrPiece: number[][] = [];
    let maxEats = 0;
    pieces.forEach((piece) => {
      const eats = getPieceMaxEats(piece);
      if (eats > maxEats) {
        maxEats = eats;
        maxPiecesOrPiece = [piece];
      } else if (eats === maxEats) {
        maxPiecesOrPiece.push(piece);
      }
    });
    return maxPiecesOrPiece;
  }

  function getPieceMaxEats(piece: number[]): number {
    const backtrack = (
      piecesPositions: (0 | 1 | 2 | 3 | 4)[][],
      cur: [number, number],
      total: number,
    ): number => {
      const [cR, cC] = cur;
      const { eatMoves: nexts } = GameMoves.pieceAvailableMoves(
        cur,
        playerTurn,
        piecesPositions,
      );

      if (nexts.length === 0) {
        return total;
      }

      let maxEats = 0;

      for (let i = 0; i < nexts.length; i++) {
        const [nR, nC] = nexts[i];
        piecesPositions[cR][cC] = 0;
        piecesPositions[nR][nC] = playerTurn;
        let result = backtrack(
          piecesPositions,
          nexts[i] as [number, number],
          total + 1,
        );
        maxEats = Math.max(result, maxEats);
      }
      return maxEats;
    };

    let piecePositionsClone = piecesPositionsRef.current.map((row) => [...row]);

    return backtrack(piecePositionsClone, piece as [number, number], 0);
  }

  return (
    <div
      ref={boardRef}
      style={{ height: `${boardRef.current?.offsetWidth}px` }}
      className="max-w-[600px] mx-auto mt-10 rounded-3xl overflow-hidden border-2 border-solid border-white shadow-boardShadow"
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
                isSelected={
                  selectedPiece
                    ? selectedPiece[0] === rowIndex &&
                      selectedPiece[1] === cellIndex
                    : availablePieces.some(
                        ([pieceRow, pieceCol]) =>
                          rowIndex === pieceRow && pieceCol === cellIndex,
                      )
                }
              >
                {piecesPositions[rowIndex][cellIndex] !== 0 && (
                  <Piece
                    player={
                      piecesPositions[rowIndex][cellIndex] as 1 | 2 | 3 | 4
                    }
                    setSelectedPiece={() =>
                      pieceClickHandler(rowIndex, cellIndex)
                    }
                    isKing={
                      piecesPositions[rowIndex][cellIndex] === 3 ||
                      piecesPositions[rowIndex][cellIndex] === 4
                    }
                  />
                )}
                {possibleMoves?.some(
                  ([row, col]) => row === rowIndex && col === cellIndex,
                ) && <MoveMarker />}
              </Cell>
            ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
