import {
  Races,
  RaceItemExt,
  RacerProfile,
  INITIAL_RACES,
  INITIAL_SELECTED_RACE,
  RacerResults,
} from "../types/datatypes";
import Optional from "optional-js";
import {
  RACES_REQUESTED,
  RACES_LOADED,
  RacesLoadedAction,
  SELECTED_RACE_REQUESTED,
  SELECTED_RACE_LOADED,
  SelectedRaceLoadedAction,
  RACES_REQUEST_FAILED,
  SELECTED_RACE_REQUEST_FAILED,
} from "../actions/race.actions";
import { AnyAction } from "redux";
import {
  RACE_PARTICIPANTS_UPDATE_REQUESTED,
  RACE_PARTICIPANTS_UPDATED,
  RaceParticipantsAction,
  RACE_PARTICIPANTS_UPDATE_FAILED,
} from "../actions/race.participants.actions";
import { RACE_CHANGE_STATE_SUCCESS, RaceChangeStateAction } from "../actions/race.state.actions";
import {
  RACE_RESULTS_SUBSCRIPTION_STARTED,
  RACE_RESULTS_SUBSCRIPTION_DATA_RECEIVED,
  RACE_RESULTS_SUBSCRIPTION_STOPPED,
  RACE_RESULTS_SUBSCRIPTION_FAILED,
  RaceResultsSubscriptionDataAction,
} from "../actions/race.results.actions";
import { ReducerTransformerFn } from "./reducers";

const racesTransformers: Map<any, ReducerTransformerFn<Races>> = new Map<
  any,
  ReducerTransformerFn<Races>
>()
  .set(RACES_REQUESTED, transformRacesRequested)
  .set(RACES_LOADED, transformRacesLoaded)
  .set(RACES_REQUEST_FAILED, transformRacesRequestFailed)
  .set(RACE_CHANGE_STATE_SUCCESS, transformRaceChangeStateSuccess);

function transformRacesRequested(state: Races, action: AnyAction) {
  return {
    isFetching: true,
    items: INITIAL_RACES.items,
  };
}

function transformRacesLoaded(state: Races, action: AnyAction) {
  return {
    isFetching: false,
    items: (action as RacesLoadedAction).items,
  };
}

function transformRacesRequestFailed(state: Races, action: AnyAction) {
  return {
    ...state,
    isFetching: false,
  };
}

function transformRaceChangeStateSuccess(state: Races, action: AnyAction) {
  state.items.ifPresent((races) => {
    const raceAction = action as RaceChangeStateAction;
    for (let race of races) {
      if (race.id === raceAction.raceID) {
        race.state = raceAction.state;
        return state;
      }
    }
  });
  return state;
}

const selectedRaceTransformers: Map<any, ReducerTransformerFn<RaceItemExt>> = new Map<
  any,
  ReducerTransformerFn<RaceItemExt>
>()
  .set(SELECTED_RACE_REQUESTED, transformSelectedRaceRequested)
  .set(SELECTED_RACE_REQUEST_FAILED, transformSelectedRaceRequestFailed)
  .set(SELECTED_RACE_LOADED, transformSelectedRaceLoaded)
  .set(RACE_PARTICIPANTS_UPDATE_REQUESTED, transformRaceParticipantsUpdateRequested)
  .set(RACE_PARTICIPANTS_UPDATED, transformRaceParticipantsUpdated)
  .set(RACE_PARTICIPANTS_UPDATE_FAILED, transformRaceParticipantsUpdateFailed)
  .set(RACE_CHANGE_STATE_SUCCESS, transformSelectedRaceChangeStateSuccess)
  .set(RACE_RESULTS_SUBSCRIPTION_STARTED, transformRaceResultsSubscriptionStarted)
  .set(RACE_RESULTS_SUBSCRIPTION_DATA_RECEIVED, transformRaceResultsSubscriptionStarted)
  .set(RACE_RESULTS_SUBSCRIPTION_STOPPED, transformRaceResultsSubscriptionStopped)
  .set(RACE_RESULTS_SUBSCRIPTION_FAILED, transformRaceResultsSubscriptionStopped);

function transformSelectedRaceRequested(state: RaceItemExt, action: AnyAction) {
  return {
    ...state,
    isFetching: true,
  };
}

function transformSelectedRaceRequestFailed(state: RaceItemExt, action: AnyAction) {
  return {
    ...state,
    isFetching: false,
  };
}

function transformSelectedRaceLoaded(state: RaceItemExt, action: AnyAction) {
  return {
    ...(action as SelectedRaceLoadedAction).raceItemExt,
    isFetching: false,
  };
}

function transformRaceParticipantsUpdateRequested(state: RaceItemExt, action: AnyAction) {
  return {
    ...state,
    participants: {
      ...state.participants,
      isFetching: true,
    },
  };
}

function transformRaceParticipantsUpdated(state: RaceItemExt, action: AnyAction) {
  return {
    ...state,
    participants: {
      isFetching: false,
      items: processRaceParticipants(state.participants.items, action as RaceParticipantsAction),
    },
  };
}

function transformRaceParticipantsUpdateFailed(state: RaceItemExt, action: AnyAction) {
  return {
    ...state,
    participants: {
      ...state.participants,
      isFetching: false,
    },
  };
}

function transformSelectedRaceChangeStateSuccess(state: RaceItemExt, action: AnyAction) {
  const raceAction = action as RaceChangeStateAction;
  if (state.id !== raceAction.raceID) return state;
  return {
    ...state,
    state: raceAction.state,
  };
}

function transformRaceResultsSubscriptionStarted(state: RaceItemExt, action: AnyAction) {
  return {
    ...state,
    results: {
      isFetching: true,
      items:
        action.type === RACE_RESULTS_SUBSCRIPTION_STARTED
          ? Optional.empty<RacerResults[]>()
          : (action as RaceResultsSubscriptionDataAction).data,
    },
  };
}

function transformRaceResultsSubscriptionStopped(state: RaceItemExt, action: AnyAction) {
  return {
    ...state,
    results: {
      ...state.results,
      isFetching: false,
      items:
        action.type === RACE_RESULTS_SUBSCRIPTION_FAILED
          ? Optional.empty<RacerResults[]>()
          : state.results.items,
    },
  };
}

export function racesReducer(state: Races = INITIAL_RACES, action: AnyAction) {
  const transformer = racesTransformers.get(action.type);
  return !!transformer ? transformer(state, action) : state;
}

export function selectedRaceReducer(state: RaceItemExt = INITIAL_SELECTED_RACE, action: AnyAction) {
  const transformer = selectedRaceTransformers.get(action.type);
  return !!transformer ? transformer(state, action) : state;
}

function processRaceParticipants(
  currentItems: Optional<RacerProfile[]>,
  action: RaceParticipantsAction
): Optional<RacerProfile[]> {
  const removed = action.itemsRemoved.orElse([]);

  let items = currentItems.orElse([]);
  items = items.filter((item) => removed.find((curr) => item.uuid === curr.uuid) === undefined);
  items = items.concat(action.itemsAdded.orElse([]));
  return items.length === 0 ? Optional.empty<RacerProfile[]>() : Optional.of(items);
}
