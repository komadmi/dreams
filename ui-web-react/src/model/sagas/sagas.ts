import { all, call } from "redux-saga/effects";
import { racesSaga, selectedRaceSaga } from "./race.saga";
import {
  userLoginSaga,
  userRegistrationSaga,
  userLogoutSaga,
  userLoginOnStartSaga
} from "./user.saga";
import { alertsHideSaga } from "./alerts.saga";
import { racerProfilesRequestAll, racerProfilesUpdate } from "./racerProfiles.saga";
import { raceResultsSaga } from "./race.results.saga";
import { raceParticipantsUpdateRequestSaga } from "./race.participants.saga";
import { raceChangeStateSaga } from "./race.state.saga";

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

function* raceLogSaga() {
  yield all([
    call(racesSaga),
    call(selectedRaceSaga),
    call(userLoginSaga),
    call(userLoginOnStartSaga),
    call(userLogoutSaga),
    call(userRegistrationSaga),
    call(alertsHideSaga),
    call(racerProfilesRequestAll),
    call(racerProfilesUpdate),
    call(raceParticipantsUpdateRequestSaga),
    call(raceResultsSaga),
    call(raceChangeStateSaga)
  ]);
}

export default raceLogSaga;
