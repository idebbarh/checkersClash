import { useEffect, useState } from "react";
import Board from "../components/Board";
import TurnSquare from "../components/TurnSquare";

function Play() {
  const [playerTurn, setPlayerTurn] = useState<1 | 2 | null>(null);

  useEffect(() => {
    setPlayerTurn(() => Math.floor(Math.random() * 2 + 1) as 1 | 2);
  }, []);

  return (
    <div className="h-screen p-4">
      <div className="flex items-center justify-center gap-4">
        <TurnSquare isActive={playerTurn === 1} player={1} />
        <TurnSquare isActive={playerTurn === 2} player={2} />
      </div>
      {playerTurn && (
        <Board playerTurn={playerTurn} setPlayerTurn={setPlayerTurn} />
      )}
    </div>
  );
}
export default Play;
