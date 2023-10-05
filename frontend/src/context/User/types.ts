type UserType = { username: string };

type ReducerActionType = {
  type: keyof ActionsType;
  payload: UserType;
};

type ActionsType = {
  SETUSER: "SETUSER";
};

type StateContextType = {
  state: UserType;
  dispatch: React.Dispatch<ReducerActionType>;
};
