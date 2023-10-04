import { createContext, useContext, useReducer } from "react";
import { ACTIONS } from "./actions";

const userInitialState: UserType = { userName: "" };

const UserContext = createContext<StateContextType | undefined>(undefined);

function reducer(state: UserType, action: ActionType<UserType["userName"]>) {
  switch (action.type) {
    case ACTIONS.SETUSER:
      return { userName: action.payload };
    default:
      return state;
  }
}

function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, userInitialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserStateValue(): StateContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useStateValue must be used within a StateProvider");
  }
  return context;
}
export default UserProvider;
