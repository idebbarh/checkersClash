import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Link to="/play">
        <button className="flex items-center justify-center flex-col px-4 py-2 rounded-md bg-cell-can-accept-piece-bg w-[150px] uppercase font-bold text-lg shadow-playBtnShadow">
          <span className="text-player-one-piece-color">play</span>
          <span className="text-player-two-piece-color">online</span>
        </button>
      </Link>
    </div>
  );
}
export default Home;
