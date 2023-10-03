import LookingForPlayerCard from "../components/LookingForPlayerCard";

type SearchForPlayerType = {
  playerName: string;
  playerAvatar: string;
  opponentName: string | null;
  opponentAvatar: string | null;
};

function SearchForPlayer({
  playerName,
  playerAvatar,
  opponentName,
  opponentAvatar,
}: SearchForPlayerType) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[600px] max-w-full p-4 h-fit border-2 border-solid border-cell-can-accept-piece-bg rounded-3xl flex">
        <LookingForPlayerCard
          playerName={playerName}
          playerAvatar={playerAvatar}
        />
        <span className="text-black font-bold text-lg px-2 mt-2 capitalize">
          vs
        </span>
        <LookingForPlayerCard
          playerName={opponentName}
          playerAvatar={opponentAvatar}
        />
      </div>
    </div>
  );
}

export default SearchForPlayer;
