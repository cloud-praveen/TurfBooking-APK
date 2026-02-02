import { all, fork } from 'redux-saga/effects';
import { authSaga } from './sagas/authSaga';
import { teamSaga } from './sagas/teamSaga';
import { matchSaga } from './sagas/matchSaga';
import { turfSaga } from './sagas/turfSaga';

export default function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(teamSaga),
        fork(matchSaga),
        fork(turfSaga),
    ]);
}
