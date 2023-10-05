import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [randomAvatarSearching, setRandomAvatarSearching] = useState<
    null | string
  >(null);
  useEffect(() => {
    const cll = new CLL();
    AVATARS.forEach((a) => cll.addValue(a));
    let cur = cll.head;

    if (cur) {
      setRandomAvatarSearching(cur.value);
      cur = cur.next;
    }

    const interval = setInterval(() => {
      if (cur && !playerAvatar) {
        setRandomAvatarSearching(cur.value);
        cur = cur.next;
        return;
      }
      clearInterval(interval);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex items-center flex-col gap-2 h-full border border-solid border-cell-can-accept-piece-bg p-4">
      <div className="relative w-[100px] h-[100px] rounded-2xl border border-solid border-black overflow-hidden">
        {playerAvatar ? (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ top: 0 }}
            animate={{ top: "50%" }}
            transition={{ duration: 0.5 }}
            key={playerAvatar}
          >
            {playerAvatar.toUpperCase()}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              exit={{ top: "120%" }}
              transition={{ duration: 0.5 }}
              key={randomAvatarSearching}
            >
              {randomAvatarSearching?.toUpperCase()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
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
