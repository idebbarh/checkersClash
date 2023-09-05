import whitePieceImg from "../assets/white-piece.png";
import redPieceImg from "../assets/red-piece.png";

type PieceType = {
  player: 1 | 2;
  setSelectedPiece: () => void;
};
function Piece({ player, setSelectedPiece }: PieceType) {
  return (
    <div onClick={setSelectedPiece}>
      <img
        src={player === 1 ? redPieceImg : whitePieceImg}
        alt={player === 1 ? "red piece" : "white piece"}
      />
    </div>
  );
}

export default Piece;
