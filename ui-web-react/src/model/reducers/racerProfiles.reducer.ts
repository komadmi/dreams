import { RacerProfiles, RacerProfile, INITIAL_RACER_PROFILES } from "../types/datatypes";
import Optional from "optional-js";
import { AnyAction } from "redux";
import {
  RacerProfilesDataAction,
  RACER_PROFILES_REQUESTED_ALL,
  RACER_PROFILES_UPDATE_REQUESTED,
  RACER_PROFILES_REQUEST_FAILED,
  RACER_PROFILES_UPDATE_RECEIVED,
} from "../actions/racerProfiles.actions";
import { ReducerTransformerFn } from "./reducers";

const racerProfilesTransformers: Map<any, ReducerTransformerFn<RacerProfiles>> = new Map<
  any,
  ReducerTransformerFn<RacerProfiles>
>()
  .set(RACER_PROFILES_REQUESTED_ALL, transformRequested)
  .set(RACER_PROFILES_UPDATE_REQUESTED, transformRequested)
  .set(RACER_PROFILES_UPDATE_RECEIVED, transformUpdateReceived)
  .set(RACER_PROFILES_REQUEST_FAILED, transformRequestFailed);

function transformRequested(state: RacerProfiles, action: AnyAction) {
  return {
    ...state,
    isFetching: true,
  };
}

function transformUpdateReceived(state: RacerProfiles, action: AnyAction) {
  return {
    items: processProfiles(action as RacerProfilesDataAction),
    isFetching: false,
  };
}

function transformRequestFailed(state: RacerProfiles, action: AnyAction) {
  return {
    ...state,
    isFetching: false,
  };
}

function processProfiles(action: RacerProfilesDataAction): Optional<RacerProfile[]> {
  let result: RacerProfile[] = [];
  action.itemsAdded.ifPresent((profiles) => (result = result.concat(profiles)));
  action.itemsUpdated.ifPresent((profiles) => (result = result.concat(profiles)));
  return result.length > 0 ? Optional.of(result) : Optional.empty<RacerProfile[]>();
}

export function racerProfilesReducer(
  state: RacerProfiles = INITIAL_RACER_PROFILES,
  action: AnyAction
) {
  const transformer = racerProfilesTransformers.get(action.type);
  return !!transformer ? transformer(state, action) : state;
}
