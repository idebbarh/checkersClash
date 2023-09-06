import whitePieceImg from "../assets/white-piece.png";
import redPieceImg from "../assets/red-piece.png";

type PieceType = {
  player: 1 | 2;
  setSelectedPiece: () => void;
};
function Piece({ player, setSelectedPiece }: PieceType) {
  return (
    <div
      onClick={setSelectedPiece}
      className={`w-4/5 h-4/5 rounded-full ${
        player === 1 ? "bg-player-one-piece-color" : "bg-player-two-piece-color"
      } border-2 border-solid border-piece-border`}
    ></div>
  );
}

export default Piece;
