import { useEffect, useState } from "react";
import Board from "../components/Board";
import TurnSquare from "../components/TurnSquare";
import SearchForPlayer from "./SearchForPlayer";
import { AVATARS } from "../utils/constants";
import { faker } from "@faker-js/faker";

type opponentDataType = {
  opponentName: null | string;
  opponentAvatar: null | string;
  isReady: boolean;
};

const initOpponentData: opponentDataType = {
  opponentName: null,
  opponentAvatar: null,
  isReady: false,
};

const fakeNames = Array(10)
  .fill(0)
  .map(() =>
    faker.person.firstName(
      ["female", "male"][Math.floor(Math.random() * 2)] as "female" | "male",
    ),
  );

function Play() {
  const playerName = "ismail";
  const playerAvatar = playerName[0];
  const [opponentData, setOpponentData] =
    useState<opponentDataType>(initOpponentData);
  const [playerTurn, setPlayerTurn] = useState<1 | 2 | null>(null);

  useEffect(() => {
    setPlayerTurn(() => Math.floor(Math.random() * 2 + 1) as 1 | 2);
    const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const timer = setTimeout(() => {
      setOpponentData((prevData) => ({
        ...prevData,
        opponentName: randomName,
        opponentAvatar: randomName[0],
      }));
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!opponentData.isReady) {
    return (
      <SearchForPlayer
        playerName={playerName}
        playerAvatar={playerAvatar}
        opponentName={opponentData.opponentName}
        opponentAvatar={opponentData.opponentAvatar}
      />
    );
  }

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
