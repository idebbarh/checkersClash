class GameMove {
  cellValue: 0 | 1 | 2;
  pieceValue: 0 | 1 | 2;
  cellPos: [number, number];
  piecePos: [number, number];

  constructor(
    cellValue: 0 | 1 | 2,
    pieceValue: 0 | 1 | 2,
    cellPos: [number, number],
    piecePos: [number, number]
  ) {
    this.cellValue = cellValue;

    this.pieceValue = pieceValue;
    this.cellPos = cellPos;
    this.piecePos = piecePos;
  }

  isValidMove(): boolean {
    return this.cellValue === 0 && this.isValidMoveByPlayerNumber();
  }

  isValidMoveByPlayerNumber(): boolean {
    const [cellRow, cellCol] = this.cellPos;
    const [pieceRow, pieceCol] = this.piecePos;

    return this.pieceValue === 1
      ? cellRow - 1 === pieceRow &&
          (cellCol + 1 === pieceCol || cellCol - 1 === pieceCol)
      : cellRow + 1 === pieceRow &&
          (cellCol + 1 === pieceCol || cellCol - 1 === pieceCol);
  }
}

export default GameMove;
