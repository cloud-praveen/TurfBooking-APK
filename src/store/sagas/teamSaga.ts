import { call, put, takeLatest } from 'redux-saga/effects';
import {
    fetchMyTeamsRequest, fetchMyTeamsSuccess, fetchMyTeamsFailure,
    fetchInvitesRequest, fetchInvitesSuccess, fetchInvitesFailure,
    acceptInviteRequest, acceptInviteSuccess, acceptInviteFailure,
    declineInviteRequest, declineInviteSuccess, declineInviteFailure
} from '../slices/teamSlice';
import { API_BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* handleFetchMyTeams(): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const response = yield call(fetch, `${API_BASE_URL}/pools/mine`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(fetchMyTeamsSuccess(data.pools || []));
        } else {
            yield put(fetchMyTeamsFailure(data.message || 'Failed to fetch teams'));
        }
    } catch (error: any) {
        yield put(fetchMyTeamsFailure(error.message));
    }
}

function* handleFetchInvites(): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const response = yield call(fetch, `${API_BASE_URL}/pools/invites`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(fetchInvitesSuccess(data.invites || []));
        } else {
            yield put(fetchInvitesFailure(data.message || 'Failed to fetch invites'));
        }
    } catch (error: any) {
        yield put(fetchInvitesFailure(error.message));
    }
}

function* handleAcceptInvite(action: any): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const response = yield call(fetch, `${API_BASE_URL}/pools/invites/${action.payload}/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(acceptInviteSuccess(action.payload));
        } else {
            yield put(acceptInviteFailure(data.message || 'Failed to accept invite'));
        }
    } catch (error: any) {
        yield put(acceptInviteFailure(error.message));
    }
}

function* handleDeclineInvite(action: any): any {
    try {
        const token = yield call([AsyncStorage, 'getItem'], 'userToken');
        const response = yield call(fetch, `${API_BASE_URL}/pools/invites/${action.payload}/decline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(declineInviteSuccess(action.payload));
        } else {
            yield put(declineInviteFailure(data.message || 'Failed to decline invite'));
        }
    } catch (error: any) {
        yield put(declineInviteFailure(error.message));
    }
}

export function* teamSaga() {
    yield takeLatest(fetchMyTeamsRequest.type, handleFetchMyTeams);
    yield takeLatest(fetchInvitesRequest.type, handleFetchInvites);
    yield takeLatest(acceptInviteRequest.type, handleAcceptInvite);
    yield takeLatest(declineInviteRequest.type, handleDeclineInvite);
}
