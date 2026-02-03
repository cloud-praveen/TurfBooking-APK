import { call, put, takeLatest } from 'redux-saga/effects';
import {
    fetchMatchDetailsRequest, fetchMatchDetailsSuccess, fetchMatchDetailsFailure,
    fetchLiveScoreRequest, fetchLiveScoreSuccess, fetchLiveScoreFailure,
    recordBallRequest, recordBallSuccess, recordBallFailure,
    undoBallRequest, undoBallSuccess, undoBallFailure,
    endInningsRequest, endInningsSuccess, endInningsFailure,
    selectNextBatterRequest, selectNextBatterSuccess, selectNextBatterFailure,
    selectBowlerRequest, selectBowlerSuccess, selectBowlerFailure
} from '../slices/matchSlice';
import { API_BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* handleFetchMatchDetails(action: any): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const response = yield call(fetch, `${API_BASE_URL}/matches/${action.payload}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(fetchMatchDetailsSuccess(data.match));
        } else {
            yield put(fetchMatchDetailsFailure(data.message || 'Failed to fetch match details'));
        }
    } catch (error: any) {
        yield put(fetchMatchDetailsFailure(error.message));
    }
}

function* handleFetchLiveScore(action: any): any {
    try {
        const response = yield call(fetch, `${API_BASE_URL}/public/matches/${action.payload}/live`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(fetchLiveScoreSuccess(data));
        } else {
            yield put(fetchLiveScoreFailure(data.message || 'Failed to fetch live score'));
        }
    } catch (error: any) {
        yield put(fetchLiveScoreFailure(error.message));
    }
}

function* handleRecordBall(action: any): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const { matchId, ...ballData } = action.payload;
        // The original code used /matches/${matchId}/ball
        const response = yield call(fetch, `${API_BASE_URL}/matches/${matchId}/ball`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ballData)
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(recordBallSuccess(data.match));
            // Refresh live score to get updated striker/non-striker/bowler assignments
            yield put(fetchLiveScoreRequest(matchId));
        } else {
            yield put(recordBallFailure(data.message || 'Failed to record ball'));
        }
    } catch (error: any) {
        yield put(recordBallFailure(error.message));
    }
}

function* handleUndoBall(action: any): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        // Original code used /matches/${matchId}/ball/undo (DELETE)
        const response = yield call(fetch, `${API_BASE_URL}/matches/${action.payload.matchId}/ball/undo`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(undoBallSuccess(data.match));
            // Refresh live score after undo
            yield put(fetchLiveScoreRequest(action.payload.matchId));
        } else {
            yield put(undoBallFailure(data.message || 'Failed to undo ball'));
        }
    } catch (error: any) {
        yield put(undoBallFailure(error.message));
    }
}

function* handleEndInnings(action: any): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const response = yield call(fetch, `${API_BASE_URL}/matches/${action.payload.matchId}/innings/end`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(endInningsSuccess(data));
        } else {
            yield put(endInningsFailure(data.message || 'Failed to end innings'));
        }
    } catch (error: any) {
        yield put(endInningsFailure(error.message));
    }
}

function* handleSelectNextBatter(action: any): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const response = yield call(fetch, `${API_BASE_URL}/matches/${action.payload.matchId}/next-batter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ batterId: action.payload.batterId })
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(selectNextBatterSuccess());
            // Refresh live score to show the new batter
            yield put(fetchLiveScoreRequest(action.payload.matchId));
        } else {
            yield put(selectNextBatterFailure(data.message || 'Failed to select next batter'));
        }
    } catch (error: any) {
        yield put(selectNextBatterFailure(error.message));
    }
}

function* handleSelectBowler(action: any): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const { matchId, bowlerId, strikerId, nonStrikerId } = action.payload;
        const response = yield call(fetch, `${API_BASE_URL}/matches/${matchId}/lineup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bowlerId, strikerId, nonStrikerId })
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(selectBowlerSuccess());
            // Refresh live score to show the new bowler
            yield put(fetchLiveScoreRequest(matchId));
        } else {
            yield put(selectBowlerFailure(data.message || 'Failed to select bowler'));
        }
    } catch (error: any) {
        yield put(selectBowlerFailure(error.message));
    }
}

export function* matchSaga() {
    yield takeLatest(fetchMatchDetailsRequest.type, handleFetchMatchDetails);
    yield takeLatest(fetchLiveScoreRequest.type, handleFetchLiveScore);
    yield takeLatest(recordBallRequest.type, handleRecordBall);
    yield takeLatest(undoBallRequest.type, handleUndoBall);
    yield takeLatest(endInningsRequest.type, handleEndInnings);
    yield takeLatest(selectNextBatterRequest.type, handleSelectNextBatter);
    yield takeLatest(selectBowlerRequest.type, handleSelectBowler);
}
