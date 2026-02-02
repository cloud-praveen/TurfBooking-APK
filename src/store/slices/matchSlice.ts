import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchState {
    currentMatch: any | null;
    liveScore: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: MatchState = {
    currentMatch: null,
    liveScore: null,
    loading: false,
    error: null,
};

const matchSlice = createSlice({
    name: 'matches',
    initialState,
    reducers: {
        fetchMatchDetailsRequest: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.error = null;
        },
        fetchMatchDetailsSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.currentMatch = action.payload;
        },
        fetchMatchDetailsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchLiveScoreRequest: (state, action: PayloadAction<string>) => {
            state.error = null;
        },
        fetchLiveScoreSuccess: (state, action: PayloadAction<any>) => {
            state.liveScore = action.payload;
        },
        fetchLiveScoreFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        recordBallRequest: (state, action: PayloadAction<any>) => {
            state.loading = true;
        },
        recordBallSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.liveScore = action.payload;
        },
        recordBallFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        undoBallRequest: (state, action: PayloadAction<{ matchId: string }>) => {
            state.loading = true;
        },
        undoBallSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.liveScore = action.payload;
        },
        undoBallFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        endInningsRequest: (state, action: PayloadAction<{ matchId: string }>) => {
            state.loading = true;
        },
        endInningsSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
        },
        endInningsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        selectNextBatterRequest: (state, action: PayloadAction<{ matchId: string, batterId: string }>) => {
            state.loading = true;
        },
        selectNextBatterSuccess: (state) => {
            state.loading = false;
        },
        selectNextBatterFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        selectBowlerRequest: (state, action: PayloadAction<{ matchId: string, bowlerId: string, strikerId: string, nonStrikerId: string }>) => {
            state.loading = true;
        },
        selectBowlerSuccess: (state) => {
            state.loading = false;
        },
        selectBowlerFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    fetchMatchDetailsRequest,
    fetchMatchDetailsSuccess,
    fetchMatchDetailsFailure,
    fetchLiveScoreRequest,
    fetchLiveScoreSuccess,
    fetchLiveScoreFailure,
    recordBallRequest,
    recordBallSuccess,
    recordBallFailure,
    undoBallRequest,
    undoBallSuccess,
    undoBallFailure,
    endInningsRequest,
    endInningsSuccess,
    endInningsFailure,
    selectNextBatterRequest,
    selectNextBatterSuccess,
    selectNextBatterFailure,
    selectBowlerRequest,
    selectBowlerSuccess,
    selectBowlerFailure
} = matchSlice.actions;

export default matchSlice.reducer;
