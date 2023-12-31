class GameMoves {
  public static getEatenPiece(
    cellPos: [number, number],
    piecePos: [number, number],
    piecesPositions: (0 | 1 | 2)[][],
    isKing: boolean,
  ): [number, number] | null {
    const [pieceRow, pieceCol] = piecePos;
    const [cellRow, cellCol] = cellPos;
    const pieceValue = piecesPositions[pieceRow][pieceCol];
    const playerOp = pieceValue === 1 ? 2 : 1;
    const M = piecesPositions.length;
    const N = piecesPositions[0].length;

    const { eatMoves } = GameMoves.pieceAvailableMoves(
      piecePos,
      pieceValue,
      piecesPositions,
      isKing,
    );

    if (eatMoves.length === 0) {
      return null;
    }

    let eatenPiece: [number, number] | null = null;

    if (isKing) {
      let i = 0;
      let j = 0;
      if (cellCol > pieceCol && cellRow < pieceRow) {
        i = cellRow;
        j = cellCol;
        while (i < M && j >= 0 && piecesPositions[i][j] !== playerOp) {
          i++;
          j--;
        }
      } else if (cellCol > pieceCol && cellRow > pieceRow) {
        i = cellRow;
        j = cellCol;
        while (i >= 0 && j >= 0 && piecesPositions[i][j] !== playerOp) {
          i--;
          j--;
        }
      } else if (cellCol < pieceCol && cellRow < pieceRow) {
        i = cellRow;
        j = cellCol;
        while (i < M && j < N && piecesPositions[i][j] !== playerOp) {
          i++;
          j++;
        }
      } else if (cellCol < pieceCol && cellRow > pieceRow) {
        i = cellRow;
        j = cellCol;
        while (i >= 0 && j < N && piecesPositions[i][j] !== playerOp) {
          i--;
          j++;
        }
      }
      if (
        i >= 0 &&
        i < M &&
        j >= 0 &&
        j < N &&
        piecesPositions[i][j] === playerOp
      ) {
        eatenPiece = [i, j];
      }
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

    return eatenPiece;
  }

  public static pieceAvailableMoves(
    piecePos: [number, number],
    pieceValue: 0 | 1 | 2,
    piecesPositions: (0 | 1 | 2)[][],
    isKing: boolean,
    prevPiecePos: [number, number] | null = null,
  ): { normalMoves: number[][]; eatMoves: number[][] } {
    const M = piecesPositions.length;
    const N = piecesPositions[0].length;
    const [pieceRow, pieceCol] = piecePos;
    const normalMoves: number[][] = [];
    let eatMoves: number[][] = [];
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
          i += r;
          j += c;
          let nextPieceRow = piecesPositions[i];
          while (nextPieceRow !== undefined && nextPieceRow[j] === 0) {
            eatMoves.push([i, j]);
            i += r;
            j += c;
            nextPieceRow = piecesPositions[i];
          }
        }
      }

      if (prevPiecePos) {
        const eatenPiece = GameMoves.getEatenPiece(
          piecePos,
          prevPiecePos,
          piecesPositions,
          isKing,
        );

        if (eatenPiece !== null) {
          eatMoves = eatMoves.filter((eatMove) => {
            const curEatenPiece = GameMoves.getEatenPiece(
              eatMove as [number, number],
              piecePos,
              piecesPositions,
              isKing,
            );
            return (
              curEatenPiece === null ||
              curEatenPiece[0] !== eatenPiece[0] ||
              curEatenPiece[1] !== eatenPiece[1]
            );
          });
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
