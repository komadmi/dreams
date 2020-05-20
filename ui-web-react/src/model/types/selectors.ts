import { StoredState } from "./datatypes";

export const userInfoSelector = (storedState: StoredState) => storedState.user.info;
