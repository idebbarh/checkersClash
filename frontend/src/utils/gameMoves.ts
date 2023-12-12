class GameMoves {
  public static isValidMove(
    cellPos: [number, number],
    piecePos: [number, number],
    piecesPositions: (0 | 1 | 2 | 3 | 4)[][],
  ): [boolean, [number, number] | null] {
    const [pieceRow, pieceCol] = piecePos;
    const [cellRow, cellCol] = cellPos;
    const pieceValue = piecesPositions[pieceRow][pieceCol];

    const { normalMoves, eatMoves } = GameMoves.pieceAvailableMoves(
      piecePos,
      pieceValue,
      piecesPositions,
    );

    let res = null;

    eatMoves.forEach(([mr, mc]) => {
      if (mr === cellRow && mc === cellCol) {
        let eatenPiece = null;

        if (pieceValue === 1) {
          eatenPiece =
            cellCol > pieceCol
              ? [cellRow - 1, cellCol - 1]
              : [cellRow - 1, cellCol + 1];
        } else {
          eatenPiece =
            cellCol > pieceCol
              ? [cellRow + 1, cellCol - 1]
              : [cellRow + 1, cellCol + 1];
        }
        res = [true, eatenPiece];
        return;
      }
    });

    if (res) {
      return res;
    }

    normalMoves.forEach(([mr, mc]) => {
      if (mr === cellRow && mc === cellCol) {
        res = [true, null];
        return;
      }
    });

    return res ?? [false, null];
  }

  public static isValidToSwitchPlayer(
    piecePos: [number, number],
    pieceValue: 0 | 1 | 2 | 3 | 4,
    piecesPositions: (0 | 1 | 2 | 3 | 4)[][],
  ): boolean {
    const playerOp = pieceValue === 1 ? 2 : 1;
    const [pieceRow, pieceCol] = piecePos;

    const isEmptyNext = (row: number, col: number) =>
      piecesPositions[row][col] === 0;

    try {
      const res =
        pieceValue === 1
          ? (piecesPositions[pieceRow + 1][pieceCol + 1] === playerOp &&
              isEmptyNext(pieceRow + 2, pieceCol + 2)) ||
            (piecesPositions[pieceRow + 1][pieceCol - 1] === playerOp &&
              isEmptyNext(pieceRow + 2, pieceCol - 2))
          : (piecesPositions[pieceRow - 1][pieceCol + 1] === playerOp &&
              isEmptyNext(pieceRow - 2, pieceCol + 2)) ||
            (piecesPositions[pieceRow - 1][pieceCol - 1] === playerOp &&
              isEmptyNext(pieceRow - 2, pieceCol - 2));

      return !res;
    } catch (e) {
      return true;
    }
  }

  public static pieceAvailableMoves(
    piecePos: [number, number],
    pieceValue: 0 | 1 | 2 | 3 | 4,
    piecesPositions: (0 | 1 | 2 | 3 | 4)[][],
  ): { normalMoves: number[][]; eatMoves: number[][] } {
    const [pieceRow, pieceCol] = piecePos;
    const normalMoves: number[][] = [];
    const eatMoves: number[][] = [];
    const playerOp = pieceValue === 1 ? 2 : 1;
    const normalMovesDirs = [
      [1, 1],
      [1, -1],
    ];
    const doubleMovesDirs = [
      [2, 2],
      [2, -2],
    ];
    if (pieceValue === 1) {
      for (let [nr, nc] of normalMovesDirs) {
        let nextRow = piecesPositions[pieceRow + nr];
        if (nextRow === undefined) {
          continue;
        }
        let nextCol = nextRow[pieceCol + nc];
        if (nextCol === undefined) {
          continue;
        }
        if (nextCol === 0) {
          normalMoves.push([pieceRow + nr, pieceCol + nc]);
        }
      }
      for (let [nr, nc] of doubleMovesDirs) {
        let nextNextRow = piecesPositions[pieceRow + nr];
        let nextRow = piecesPositions[pieceRow + (nr - 1)];
        if (nextNextRow === undefined) {
          continue;
        }
        let nextNextCol = nextNextRow[pieceCol + nc];
        let nextCol =
          nc > 0 ? nextRow[pieceCol + (nc - 1)] : nextRow[pieceCol + (nc + 1)];

        if (nextNextCol === undefined) {
          continue;
        }

        if (nextNextCol === 0 && nextCol === playerOp) {
          eatMoves.push([pieceRow + nr, pieceCol + nc]);
        }
      }
    } else {
      for (let [nr, nc] of normalMovesDirs) {
        nr *= -1;
        let nextRow = piecesPositions[pieceRow + nr];
        if (nextRow === undefined) {
          continue;
        }
        let nextCol = nextRow[pieceCol + nc];
        if (nextCol === undefined) {
          continue;
        }
        if (nextCol === 0) {
          normalMoves.push([pieceRow + nr, pieceCol + nc]);
        }
      }

      for (let [nr, nc] of doubleMovesDirs) {
        nr *= -1;
        let nextNextRow = piecesPositions[pieceRow + nr];
        let nextRow =
          nr > 0
            ? piecesPositions[pieceRow + (nr - 1)]
            : piecesPositions[pieceRow + (nr + 1)];
        if (nextNextRow === undefined) {
          continue;
        }
        let nextNextCol = nextNextRow[pieceCol + nc];
        let nextCol =
          nc > 0 ? nextRow[pieceCol + (nc - 1)] : nextRow[pieceCol + (nc + 1)];

        if (nextNextCol === undefined) {
          continue;
        }

        if (nextNextCol === 0 && nextCol === playerOp) {
          eatMoves.push([pieceRow + nr, pieceCol + nc]);
        }
      }
    }
    return { normalMoves, eatMoves };
  }
}

export default GameMoves;
