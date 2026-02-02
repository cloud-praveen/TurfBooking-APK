export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    OtpVerification: { phoneNumber?: string };
    UserDetails: undefined;
    Home: undefined;
    TurfDetails: { turfId?: string };
    SlotSelection: { turfId?: string };
    BookingSummary: { slotId?: string };
    Bookings: undefined;
    Profile: undefined;
    Teams: undefined;
    CreateTeam: undefined;
    CreateMatch: undefined;
    Invites: undefined;
    AddTeamMembers: { poolId?: string };
    CreateSquad: { poolId?: string };
    MatchSummary: { poolId: string; matchId: string };
    ScoreboardUpdate: { matchId: string };
    TossSelection: { matchId: string };
    SecondInningsSelection: { matchId: string };
    AdminHome: undefined;

    AdminProperties: undefined;
    AdminBookings: undefined;
};
