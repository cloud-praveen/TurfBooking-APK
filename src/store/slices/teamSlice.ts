import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeamState {
    myTeams: any[];
    invites: any[];
    loading: boolean;
    error: string | null;
}

const initialState: TeamState = {
    myTeams: [],
    invites: [],
    loading: false,
    error: null,
};

const teamSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        fetchMyTeamsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchMyTeamsSuccess: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.myTeams = action.payload;
        },
        fetchMyTeamsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchInvitesRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchInvitesSuccess: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.invites = action.payload;
        },
        fetchInvitesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        acceptInviteRequest: (state, action: PayloadAction<string>) => {
            state.loading = true;
        },
        acceptInviteSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.invites = state.invites.filter(invite => invite.inviteId !== action.payload);
        },
        acceptInviteFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        declineInviteRequest: (state, action: PayloadAction<string>) => {
            state.loading = true;
        },
        declineInviteSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.invites = state.invites.filter(invite => invite.inviteId !== action.payload);
        },
        declineInviteFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchMyTeamsRequest,
    fetchMyTeamsSuccess,
    fetchMyTeamsFailure,
    fetchInvitesRequest,
    fetchInvitesSuccess,
    fetchInvitesFailure,
    acceptInviteRequest,
    acceptInviteSuccess,
    acceptInviteFailure,
    declineInviteRequest,
    declineInviteSuccess,
    declineInviteFailure,
} = teamSlice.actions;

export default teamSlice.reducer;
