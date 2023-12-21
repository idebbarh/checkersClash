import React, { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import {
  NUMBER_OF_CELLS_IN_ROW,
  NUMBER_OF_ROWS_IN_BOARD,
} from "../utils/constants";
import Piece from "./Piece";
import GameMoves from "../utils/gameMoves";
import MoveMarker from "./MoveMarker";
import { filterObj, positonToString } from "../utils/helperFunctions";
//TODO: fix king fake double move

type Equal<T1, T2> = (<P>() => T1 extends P ? 1 : 0) extends <
  P,
>() => T2 extends P ? 1 : 0
  ? true
  : false;

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
    useState<(0 | 1 | 2)[][]>(getPiecesPositions());
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(
    null,
  );
  const [possibleMoves, setPossibleMoves] = useState<null | number[][]>(null);
  const [boardWith, setBoardWith] = useState<number | null>(null);
  const [availablePieces, setAvailablePieces] = useState<[] | number[][]>([]);
  const kingPositionsRef = useRef<{
    [key: string]: [number, number];
  } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const piecesPositionsRef = useRef<(0 | 1 | 2)[][]>(piecesPositions);

  useEffect(() => {
    if (!boardRef.current) {
      return;
    }
    setBoardWith(boardRef.current?.offsetWidth);
  }, []);

  useEffect(() => {
    piecesPositionsRef.current = piecesPositions;
    const availablePiecesAndItsCells = getAvailablePiecesAndItsCells();
    const newAvailablePieces = availablePiecesAndItsCells.map(
      ([piece]) => piece,
    );
    setAvailablePieces(() => newAvailablePieces);
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
    //check if the piece become new king , or its already a king an move its place
    const isKing =
      (playerTurn == 1 && cellRow === piecesPositionsRef.current.length - 1) ||
      (playerTurn === 2 && cellRow === 0) ||
      (kingPositionsRef.current !== null &&
        kingPositionsRef.current.hasOwnProperty(
          positonToString(selectedPiece),
        ));

    const isFirstTimeKing =
      isKing &&
      (kingPositionsRef.current === null ||
        !kingPositionsRef.current.hasOwnProperty(
          positonToString(selectedPiece),
        ));

    if (isKing) {
      //if it's new king king store its position, remove the its prevPositon and store the positon if its already king
      kingPositionsRef.current = {
        ...(isFirstTimeKing
          ? kingPositionsRef.current
          : filterObj<{ [key: string]: [number, number] }>(
              kingPositionsRef.current,
              (key) => key !== positonToString(selectedPiece),
            )),
        [positonToString(selectedCell)]: selectedCell,
      };
    } else if (
      pieceToEat !== null &&
      kingPositionsRef.current?.hasOwnProperty(positonToString(pieceToEat))
    ) {
      //if the eatenPiece is the a king remove the piece from the kingPositions
      kingPositionsRef.current = filterObj<{ [key: string]: [number, number] }>(
        kingPositionsRef.current,
        (key) => key !== positonToString(pieceToEat),
      );
    }

    const newPiecesPositionsState = piecesPositionsRef.current.map((row, i) => {
      return row.map((col, j) => {
        return pieceRow === i && pieceCol === j
          ? 0
          : cellRow === i && cellCol === j
            ? playerTurn
            : pieceToEat && pieceToEat[0] === i && pieceToEat[1] === j
              ? 0
              : col;
      });
    });

    setPiecesPositions(() => {
      return newPiecesPositionsState;
    });

    const isValidToSwitch = GameMoves.isValidToSwitchPlayer(
      selectedCell,
      selectedPiece,
      playerTurn,
      newPiecesPositionsState,
      kingPositionsRef.current !== null &&
        kingPositionsRef.current.hasOwnProperty(positonToString(selectedCell)),
    );

    clearBoardSelections();

    if (isValidToSwitch || pieceToEat === null || isFirstTimeKing) {
      changeTurn();
    } else {
      setTimeout(() => {
        pieceClickHandler(cellRow, cellCol);
      }, 0);
    }
  }

  function cellClickHandler(rowIndex: number, cellIndex: number) {
    if (
      !selectedPiece ||
      piecesPositionsRef.current[rowIndex][cellIndex] !== 0
    ) {
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

    const eatenPiece = GameMoves.getEatenPiece(
      cellPos,
      selectedPiece,
      piecesPositionsRef.current,
      kingPositionsRef.current !== null &&
        kingPositionsRef.current.hasOwnProperty(positonToString(selectedPiece)),
    );

    movePiece([rowIndex, cellIndex], eatenPiece);
  }

  //i used here piecesPositionsRef insteand of piecesPositions because i need to call pieceClickHandler inside setTimeout.
  function pieceClickHandler(rowIndex: number, cellIndex: number) {
    //this just for the validation , and return [available Pieces To Play,the cell that will give it the max profit (eats)][]
    const availablePiecesAndItsCells = getAvailablePiecesAndItsCells();
    //separate the pieces from the cells
    const newAvailablePieces = availablePiecesAndItsCells.map(
      ([piece]) => piece,
    );
    //separate the cells from the pieces then filter them by the curPiece
    const newAvailablePiecesCells = availablePiecesAndItsCells
      .filter(([piece]) => piece[0] === rowIndex && piece[1] === cellIndex)
      .map(([, cell]) => cell);
    //check if the selected piece belong to the player who the turn is his turn, or the selected piece not in the available valid pieces to play with.
    if (
      piecesPositionsRef.current[rowIndex][cellIndex] !== playerTurn ||
      !newAvailablePieces.some(
        ([moveRow, moveCol]) => moveRow === rowIndex && moveCol === cellIndex,
      )
    ) {
      clearBoardSelections();
      setAvailablePieces(() => newAvailablePieces);
      return;
    }

    const piecePos: [number, number] = [rowIndex, cellIndex];

    const movesInfo = GameMoves.pieceAvailableMoves(
      piecePos,
      playerTurn,
      piecesPositionsRef.current,
      kingPositionsRef.current !== null &&
        kingPositionsRef.current.hasOwnProperty(positonToString(piecePos)),
    );

    setPossibleMoves(() =>
      movesInfo.eatMoves.length
        ? newAvailablePiecesCells
        : movesInfo.normalMoves,
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

  function getAvailablePiecesAndItsCells(): [number[], number[]][] {
    const forceMoves = getEatMoves();
    if (forceMoves.length > 0) {
      return getEatMoveWithMaxEats(forceMoves);
    }

    return piecesPositionsRef.current
      .reduce((prev: number[][], row, rowIndex) => {
        return [
          ...prev,
          ...(row
            .map((col, colIndex) => {
              if (col !== playerTurn) {
                return null;
              }
              const piecePos: [number, number] = [rowIndex, colIndex];
              const movesInfo = GameMoves.pieceAvailableMoves(
                piecePos,
                playerTurn,
                piecesPositionsRef.current,
                kingPositionsRef.current !== null &&
                  kingPositionsRef.current.hasOwnProperty(
                    positonToString(piecePos),
                  ),
              );

              const res = movesInfo.normalMoves.length > 0;
              return res ? piecePos : null;
            })
            .filter(Boolean) as number[][]),
        ];
      }, [])
      .map((piece) => [piece, [-1, -1]]);
  }

  function getEatMoves(): number[][] {
    const moves: number[][] = [];
    piecesPositionsRef.current.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === playerTurn) {
          const piecePos: [number, number] = [rowIndex, colIndex];
          const movesInfo = GameMoves.pieceAvailableMoves(
            piecePos,
            playerTurn,
            piecesPositionsRef.current,
            kingPositionsRef.current !== null &&
              kingPositionsRef.current.hasOwnProperty(
                positonToString(piecePos),
              ),
          );
          if (movesInfo.eatMoves.length > 0) {
            moves.push([rowIndex, colIndex]);
          }
        }
      });
    });
    return moves;
  }

  function getEatMoveWithMaxEats(pieces: number[][]): [number[], number[]][] {
    let maxPiecesOrPiece: [number[], number[]][] = [];
    let maxEats = 0;
    pieces.forEach((piece) => {
      const [eats, cell] = getPieceMaxEats(piece);
      if (eats > maxEats) {
        maxEats = eats;
        maxPiecesOrPiece = [[piece, cell]];
      } else if (eats === maxEats) {
        maxPiecesOrPiece.push([piece, cell]);
      }
    });
    return maxPiecesOrPiece;
  }

  function getPieceMaxEats(piece: number[]): [number, [number, number]] {
    //TODO: handle when piece have multipe cells that gives max profit
    const backtrack = (
      piecesPositions: (0 | 1 | 2)[][],
      cur: [number, number],
      total: number,
      maxEatsCell: [number, number],
      kingPositions: typeof kingPositionsRef.current,
    ): [number, [number, number]] => {
      const [cR, cC] = cur;
      const isKing =
        kingPositions !== null &&
        kingPositions.hasOwnProperty(positonToString(cur));

      const { eatMoves: nexts } = GameMoves.pieceAvailableMoves(
        cur,
        playerTurn,
        piecesPositions,
        isKing,
      );

      if (nexts.length === 0) {
        return [total, maxEatsCell];
      }

      let maxEats = 0;
      let fMaxEatsCell: [number, number] = [-1, -1];

      for (let i = 0; i < nexts.length; i++) {
        const [nR, nC] = nexts[i];
        const eatenPiece = GameMoves.getEatenPiece(
          nexts[i] as [number, number],
          cur,
          piecesPositions,
          isKing,
        );

        piecesPositions[cR][cC] = 0;
        piecesPositions[nR][nC] = playerTurn;

        if (eatenPiece) {
          const [eR, eC] = eatenPiece;
          piecesPositions[eR][eC] = 0;
        }

        if (isKing) {
          kingPositions = {
            ...filterObj<{ [key: string]: [number, number] }>(
              kingPositions,
              (key) => key !== positonToString(cur),
            ),
            [positonToString(nexts[i] as [number, number])]: nexts[i] as [
              number,
              number,
            ],
          };
        }
        let result = backtrack(
          piecesPositions,
          nexts[i] as [number, number],
          total + 1,
          (total === 0 ? nexts[i] : maxEatsCell) as [number, number],
          kingPositions,
        );
        if (maxEats < result[0]) {
          maxEats = result[0];
          fMaxEatsCell = result[1];
        }
      }
      return [maxEats, fMaxEatsCell];
    };

    let piecePositionsClone = piecesPositionsRef.current.map((row) => [...row]);
    let kingPositionsClone = { ...kingPositionsRef.current };

    return backtrack(
      piecePositionsClone,
      piece as [number, number],
      0,
      [-1, -1],
      kingPositionsClone,
    );
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
                    player={piecesPositions[rowIndex][cellIndex] as 1 | 2}
                    setSelectedPiece={() =>
                      pieceClickHandler(rowIndex, cellIndex)
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
