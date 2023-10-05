import { ChangeEvent, FormEvent, useState } from "react";
import { useUserStateValue } from "../context/User/UserContext";
import { setUser } from "../context/User/actions";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  const { dispatch } = useUserStateValue();

  function changeHander(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsername(() => value);
  }

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(setUser({ username }));
    navigate("/play");
  }
  return (
    <div className="h-screen">
      <form
        className="max-w-full w-[300px] mx-auto h-full flex flex-col justify-center gap-4"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          className="bg-transparent outline-transparent border-2 border-solid border-cell-can-accept-piece-bg py-2 px-4 rounded-md text-cell-can-accept-piece-bg placeholder:text-cell-can-accept-piece-bg focus:outline-none"
          placeholder="username"
          value={username}
          onChange={changeHander}
        />
        <button className="w-full bg-cell-can-accept-piece-bg text-[#c6e2e9] text-lg font-bold uppercase py-2 rounded-md">
          play
        </button>
      </form>
    </div>
  );
}
export default Home;
