export const ACTIONS = {
  SETUSER: "SETUSER",
};

export function setUser(value: UserType["userName"]) {
  return { type: ACTIONS.SETUSER, payload: value };
}
