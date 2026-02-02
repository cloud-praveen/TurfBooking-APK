import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest: (state, action: PayloadAction<{ phoneNumber: string }>) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state) => {
            state.loading = false;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        verifyOtpRequest: (state, action: PayloadAction<{ phoneNumber: string; otp: string }>) => {
            state.loading = true;
            state.error = null;
        },
        verifyOtpSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        verifyOtpFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        }
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    verifyOtpRequest,
    verifyOtpSuccess,
    verifyOtpFailure,
    logout,
    setUser,
    setToken
} = authSlice.actions;

export default authSlice.reducer;
