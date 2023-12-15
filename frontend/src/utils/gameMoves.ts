class GameMoves {
  public static isValidMove(
    cellPos: [number, number],
    piecePos: [number, number],
    piecesPositions: (0 | 1 | 2)[][],
    isKing: boolean,
  ): [boolean, [number, number] | null] {
    const [pieceRow, pieceCol] = piecePos;
    const [cellRow, cellCol] = cellPos;
    const pieceValue = piecesPositions[pieceRow][pieceCol];

    const { normalMoves, eatMoves } = GameMoves.pieceAvailableMoves(
      piecePos,
      pieceValue,
      piecesPositions,
      isKing,
    );

    let res: [boolean, [number, number] | null] = [false, null];

    eatMoves.forEach(([mr, mc]) => {
      if (mr === cellRow && mc === cellCol) {
        let eatenPiece: [number, number] | null = null;
        if (isKing) {
          //TODO: handle king eatenPiece
        } else {
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
        }
        res = [true, eatenPiece];
        return;
      }
    });

    if (res[0] == true) {
      return res;
    }

    normalMoves.forEach(([mr, mc]) => {
      if (mr === cellRow && mc === cellCol) {
        res = [true, null];
        return;
      }
    });

    return res;
  }

  public static isValidToSwitchPlayer(
    piecePos: [number, number],
    pieceValue: 0 | 1 | 2,
    piecesPositions: (0 | 1 | 2)[][],
    isKing: boolean,
  ): boolean {
    const { eatMoves } = GameMoves.pieceAvailableMoves(
      piecePos,
      pieceValue,
      piecesPositions,
      isKing,
    );

    return eatMoves.length === 0;
  }

  public static pieceAvailableMoves(
    piecePos: [number, number],
    pieceValue: 0 | 1 | 2,
    piecesPositions: (0 | 1 | 2)[][],
    isKing: boolean,
  ): { normalMoves: number[][]; eatMoves: number[][] } {
    const M = piecesPositions.length;
    const N = piecesPositions[0].length;
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
    const kingMoves = [
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ];
    if (isKing) {
      for (let [r, c] of kingMoves) {
        let i = pieceRow + r;
        let j = pieceCol + c;
        if (i >= M || j >= N || i < 0 || j < 0) {
          continue;
        }
        while (
          i < M &&
          j < N &&
          i >= 0 &&
          j >= 0 &&
          piecesPositions[i][j] === 0
        ) {
          normalMoves.push([i, j]);
          i += r;
          j += c;
        }
        if (
          i < M &&
          j < N &&
          i >= 0 &&
          j >= 0 &&
          piecesPositions[i][j] === playerOp
        ) {
          const nextPieceRow = piecesPositions[i + r];

          if (nextPieceRow !== undefined && nextPieceRow[j + c] === 0) {
            eatMoves.push([i + r, j + c]);
          }
        }
      }
    } else {
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
            nc > 0
              ? nextRow[pieceCol + (nc - 1)]
              : nextRow[pieceCol + (nc + 1)];

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
            nc > 0
              ? nextRow[pieceCol + (nc - 1)]
              : nextRow[pieceCol + (nc + 1)];

          if (nextNextCol === undefined) {
            continue;
          }

          if (nextNextCol === 0 && nextCol === playerOp) {
            eatMoves.push([pieceRow + nr, pieceCol + nc]);
          }
        }
      }
    }
    return { normalMoves, eatMoves };
  }
}

export default GameMoves;
