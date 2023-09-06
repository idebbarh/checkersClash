class GameMove {
  public static isValidMove(
    cellValue: 0 | 1 | 2,
    pieceValue: 0 | 1 | 2,
    cellPos: [number, number],
    piecePos: [number, number]
  ): boolean {
    return (
      cellValue === 0 &&
      GameMove.isValidMoveByPlayerNumber(pieceValue, cellPos, piecePos)
    );
  }

  public static isValidMoveByPlayerNumber(
    pieceValue: 0 | 1 | 2,
    cellPos: [number, number],
    piecePos: [number, number]
  ): boolean {
    const [cellRow, cellCol] = cellPos;
    const [pieceRow, pieceCol] = piecePos;

    return pieceValue === 1
      ? cellRow - 1 === pieceRow &&
          (cellCol + 1 === pieceCol || cellCol - 1 === pieceCol)
      : cellRow + 1 === pieceRow &&
          (cellCol + 1 === pieceCol || cellCol - 1 === pieceCol);
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
