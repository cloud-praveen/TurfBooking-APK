export type RootStackParamList = {
    Splash: undefined;
    RoleSelection: undefined;
    Login: { role: 'USER' | 'ADMIN' };
    OtpVerification: { phoneNumber: string; role: 'USER' | 'ADMIN' };
    RegisterName: { phoneNumber: string; role: 'USER' | 'ADMIN' };
    RegisterUsername: { phoneNumber: string; role: 'USER' | 'ADMIN'; fullName: string; suggestedUsername?: string };
    RegisterEmail: { phoneNumber: string; role: 'USER' | 'ADMIN'; fullName: string; username: string };
    UserDetails: undefined; // To be deprecated or repurposed
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
    LiveScoreView: { matchId: string };
};
