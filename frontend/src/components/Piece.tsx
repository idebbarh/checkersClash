type PieceType = {
  player: 1 | 2 | 3 | 4;
  setSelectedPiece: () => void;
  isKing: true | false;
};
function Piece({ player, setSelectedPiece, isKing }: PieceType) {
  return (
    <div
      onClick={setSelectedPiece}
      className={`cursor-pointer w-4/5 h-4/5 rounded-full ${
        player === 1 || player === 3
          ? "bg-player-one-piece-color"
          : "bg-player-two-piece-color"
      } border-2 border-solid border-piece-border flex items-center justify-center`}
    >
      {isKing && <span className="text-red-500 font-bold text-lg">K</span>}
    </div>
  );
}

export default Piece;
