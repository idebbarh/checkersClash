type UserType = { userName: string };

type StateContextType = {
  state: UserType;
  dispatch: React.Dispatch<ActionType<UserType["userName"]>>;
};
