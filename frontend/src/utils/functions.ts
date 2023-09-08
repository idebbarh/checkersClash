class GameMove {
  public static isValidMove(
    cellValue: 0 | 1 | 2,
    pieceValue: 0 | 1 | 2,
    cellPos: [number, number],
    piecePos: [number, number],
    piecesPositions: (0 | 1 | 2)[][]
  ): [boolean, [number, number] | null] {
    const [first, second] = GameMove.isValidMoveByPlayerNumber(
      pieceValue,
      cellPos,
      piecePos,
      piecesPositions
    );
    return [cellValue === 0 && first, second];
  }

  public static isValidMoveByPlayerNumber(
    pieceValue: 0 | 1 | 2,
    cellPos: [number, number],
    piecePos: [number, number],
    piecesPositions: (0 | 1 | 2)[][]
  ): [boolean, [number, number] | null] {
    const [cellRow, cellCol] = cellPos;
    const [pieceRow, pieceCol] = piecePos;
    const playerOp = pieceValue === 1 ? 2 : 1;

    const isValidNormalMove =
      pieceValue === 1
        ? cellRow - 1 === pieceRow &&
          (cellCol + 1 === pieceCol || cellCol - 1 === pieceCol)
        : cellRow + 1 === pieceRow &&
          (cellCol + 1 === pieceCol || cellCol - 1 === pieceCol);

    const isValidEatMovePart1 =
      pieceValue === 1
        ? cellRow - 2 === pieceRow &&
          (cellCol + 2 === pieceCol || cellCol - 2 === pieceCol)
        : cellRow + 2 === pieceRow &&
          (cellCol + 2 === pieceCol || cellCol - 2 === pieceCol);

    const isValidEatMovePart2 =
      pieceValue === 1
        ? (piecesPositions[cellRow - 1][cellCol - 1] === playerOp &&
            cellRow - 2 === pieceRow &&
            cellCol - 2 === pieceCol) ||
          (piecesPositions[cellRow - 1][cellCol + 1] === playerOp &&
            cellRow - 2 === pieceRow &&
            cellCol + 2 === pieceCol)
        : (piecesPositions[cellRow + 1][cellCol - 1] === playerOp &&
            cellRow + 2 === pieceRow &&
            cellCol - 2 === pieceCol) ||
          (piecesPositions[cellRow + 1][cellCol + 1] === playerOp &&
            cellRow + 2 === pieceRow &&
            cellCol + 2 === pieceCol);

    const pieceToEatPosition: [number, number] | null =
      isValidEatMovePart1 && isValidEatMovePart2
        ? pieceValue === 1
          ? piecesPositions[cellRow - 1][cellCol - 1] === playerOp &&
            cellRow - 2 === pieceRow &&
            cellCol - 2 === pieceCol
            ? [cellRow - 1, cellCol - 1]
            : piecesPositions[cellRow - 1][cellCol + 1] === playerOp &&
              cellRow - 2 === pieceRow &&
              cellCol + 2 === pieceCol
            ? [cellRow - 1, cellCol + 1]
            : null
          : piecesPositions[cellRow + 1][cellCol - 1] === playerOp &&
            cellRow + 2 === pieceRow &&
            cellCol - 2 === pieceCol
          ? [cellRow + 1, cellCol - 1]
          : piecesPositions[cellRow + 1][cellCol + 1] === playerOp &&
            cellRow + 2 === pieceRow &&
            cellCol + 2 === pieceCol
          ? [cellRow + 1, cellCol + 1]
          : null
        : null;

    const isValidEatMoveComplete = isValidEatMovePart1 && isValidEatMovePart2;

    return [isValidNormalMove || isValidEatMoveComplete, pieceToEatPosition];
  }

  public static pieceAvailableMoves(
    piecePos: [number, number],
    pieceValue: 0 | 1 | 2,
    piecesPositions: (0 | 1 | 2)[][]
  ): number[][] {
    const [pieceRow, pieceCol] = piecePos;
    const res: number[][] = [];
    if (pieceValue === 1) {
      if (
        pieceRow < piecesPositions.length - 1 &&
        pieceCol < piecesPositions[0].length - 1 &&
        piecesPositions[pieceRow + 1][pieceCol + 1] === 0
      ) {
        res.push([pieceRow + 1, pieceCol + 1]);
      }
      if (
        pieceRow < piecesPositions.length - 1 &&
        pieceCol > 0 &&
        piecesPositions[pieceRow + 1][pieceCol - 1] === 0
      ) {
        res.push([pieceRow + 1, pieceCol - 1]);
      }
    } else {
      if (
        pieceRow > 0 &&
        pieceCol < piecesPositions[0].length - 1 &&
        piecesPositions[pieceRow - 1][pieceCol + 1] === 0
      ) {
        res.push([pieceRow - 1, pieceCol + 1]);
      }
      if (
        pieceRow > 0 &&
        pieceCol > 0 &&
        piecesPositions[pieceRow - 1][pieceCol - 1] === 0
      ) {
        res.push([pieceRow - 1, pieceCol - 1]);
      }
    }
    return res;
  }
}

export default GameMove;
