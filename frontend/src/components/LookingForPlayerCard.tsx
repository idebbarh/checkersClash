import { useEffect, useState } from "react";
import CLL from "../utils/dataStructures";
import { AVATARS } from "../utils/constants";

type LookingForPlayerCardType = {
  playerName: string | null;
  playerAvatar: string | null;
};
function LookingForPlayerCard({
  playerName,
  playerAvatar,
}: LookingForPlayerCardType) {
  const [curAvatar, setCurAvatar] = useState<null | string>(null);
  useEffect(() => {
    const cll = new CLL();
    AVATARS.forEach((a) => cll.addValue(a));
    let cur = cll.head;
    const interval = setInterval(() => {
      if (cur) {
        setCurAvatar(cur.value);
        cur = cur.next;
        console.log(cur);
        return;
      }
      clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex-1 flex items-center flex-col gap-2 h-full border border-solid border-cell-can-accept-piece-bg p-4">
      {/* avatar */}
      <div className="w-[100px] h-[100px] rounded-2xl border border-solid border-black flex items-center justify-center">
        {playerAvatar ?? curAvatar}
      </div>
      {/* name */}
      <h4 className="text-sm text-center">
        {playerName ? (
          <span className="text-red-800 capitalize">{playerName}</span>
        ) : (
          <span className="text-gray-500">Searching for opponent...</span>
        )}
      </h4>
    </div>
  );
}

export default LookingForPlayerCard;
