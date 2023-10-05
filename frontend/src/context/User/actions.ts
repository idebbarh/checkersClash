export const ACTIONS: ActionsType = {
  SETUSER: "SETUSER",
};

export function setUser(value: ReducerActionType["payload"]) {
  return { type: ACTIONS.SETUSER, payload: value };
}
