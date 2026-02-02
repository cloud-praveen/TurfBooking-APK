import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TurfState {
    venues: any[];
    nearbyVenues: any[];
    myBookings: any[];
    loading: boolean;
    error: string | null;
    displayAddress: string;
}

const initialState: TurfState = {
    venues: [],
    nearbyVenues: [],
    myBookings: [],
    loading: false,
    error: null,
    displayAddress: 'Locating...',
};

const turfSlice = createSlice({
    name: 'turfs',
    initialState,
    reducers: {
        fetchVenuesRequest: (state, action: PayloadAction<{ lat?: number; lng?: number; city?: string }>) => {
            state.loading = true;
            state.error = null;
        },
        fetchVenuesSuccess: (state, action: PayloadAction<{ venues: any[], address?: string }>) => {
            state.loading = false;
            state.venues = action.payload.venues;
            if (action.payload.address) {
                state.displayAddress = action.payload.address;
            }
        },
        fetchVenuesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchMyBookingsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchMyBookingsSuccess: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.myBookings = action.payload;
        },
        fetchMyBookingsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    fetchVenuesRequest,
    fetchVenuesSuccess,
    fetchVenuesFailure,
    fetchMyBookingsRequest,
    fetchMyBookingsSuccess,
    fetchMyBookingsFailure
} = turfSlice.actions;

export default turfSlice.reducer;
