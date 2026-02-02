import { call, put, takeLatest } from 'redux-saga/effects';
import {
    loginRequest, loginSuccess, loginFailure,
    verifyOtpRequest, verifyOtpSuccess, verifyOtpFailure
} from '../slices/authSlice';
import { API_BASE_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function* handleLogin(action: any): any {
    try {
        const response = yield call(fetch, `${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: action.payload.phoneNumber })
        });
        const data = yield response.json();
        if (response.ok) {
            yield put(loginSuccess());
        } else {
            yield put(loginFailure(data.message || 'Login failed'));
        }
    } catch (error: any) {
        yield put(loginFailure(error.message));
    }
}

function* handleVerifyOtp(action: any): any {
    try {
        const response = yield call(fetch, `${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: action.payload.phoneNumber,
                otp: action.payload.otp
            })
        });
        const data = yield response.json();
        if (response.ok) {
            yield call([AsyncStorage, 'setItem'], 'userToken', data.token);
            if (data.user) {
                yield call([AsyncStorage, 'setItem'], 'userData', JSON.stringify(data.user));
            }
            yield put(verifyOtpSuccess({ user: data.user, token: data.token }));
        } else {
            yield put(verifyOtpFailure(data.message || 'OTP Verification failed'));
        }
    } catch (error: any) {
        yield put(verifyOtpFailure(error.message));
    }
}

export function* authSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
    yield takeLatest(verifyOtpRequest.type, handleVerifyOtp);
}
