import LookingForPlayerCard from "../components/LookingForPlayerCard";

type SearchForPlayerType = {
  setIsPlayer: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchForPlayer({ setIsPlayer }: SearchForPlayerType) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[600px] max-w-full p-4 h-fit border-2 border-solid border-cell-can-accept-piece-bg rounded-3xl flex">
        <LookingForPlayerCard playerName="ismail" playerAvatar={null} />
        <span className="text-black font-bold text-lg px-2 mt-2 capitalize">
          vs
        </span>
        <LookingForPlayerCard playerName={null} playerAvatar={null} />
      </div>
    </div>
  );
}

export default SearchForPlayer;
