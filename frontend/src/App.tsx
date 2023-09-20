import { Route, Routes } from "react-router-dom";
import Play from "./screens/Play";
import Home from "./screens/Home";

function App() {
  return (
    <div className="bg-[#c6e2e9]">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </div>
  );
}

export default App;
