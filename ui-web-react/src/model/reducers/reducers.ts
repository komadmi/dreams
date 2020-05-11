import { combineReducers, AnyAction } from "redux";
import { StoredState } from "../types/datatypes";
import { userReducer } from "./user.reducer";
import { racesReducer, selectedRaceReducer } from "./race.reducer";
import { alertsQueueReducer } from "./alertsQueue.reducer";
import { racerProfilesReducer } from "./racerProfiles.reducer";

const raceLogAppState = combineReducers<StoredState>({
  user: userReducer,
  racerProfiles: racerProfilesReducer,
  races: racesReducer,
  selectedRace: selectedRaceReducer,
  alertsQueue: alertsQueueReducer,
});

export default raceLogAppState;

export type ReducerTransformerFn<T> = (state: T, action: AnyAction) => T;

export function createReducer<T>(
  transformersMap: Map<any, ReducerTransformerFn<T>>,
  initialState: T
) {
  return (state: T = initialState, action: AnyAction) => {
    const transformer = transformersMap.get(action.type);
    return !!transformer ? transformer(state, action) : state;
  };
}
