import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OtpVerificationScreen } from '../screens/OtpVerificationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { TurfDetails } from '../screens/TurfDetails';
import { SlotSelection } from '../screens/SlotSelection';
import { BookingSummary } from '../screens/BookingSummary';
import { UserDetailsScreen } from '../screens/UserDetailsScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TeamsScreen } from '../screens/TeamsScreen';
import { CreateTeam } from '../screens/CreateTeam';
import { CreateMatch } from '../screens/CreateMatch';
import { InvitesScreen } from '../screens/InvitesScreen';
import { AddTeamMembers } from '../screens/AddTeamMembers';
import { CreateSquad } from '../screens/CreateSquad';
import { MatchSummary } from '../screens/MatchSummary';
import ScoreboardUpdate from '../screens/ScoreboardUpdate';
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { MyPropertiesScreen } from '../screens/admin/MyPropertiesScreen';
import { AdminBookingsScreen } from '../screens/admin/AdminBookingsScreen';
import { TossSelectionScreen } from '../screens/TossSelectionScreen';
import { SecondInningsSelectionScreen } from '../screens/SecondInningsSelectionScreen';
import { LiveScoreView } from '../screens/LiveScoreView';






const Stack = createNativeStackNavigator<RootStackParamList>();


export const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Splash"

            // Force refresh context
            screenOptions={{

                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
                name="OtpVerification"
                component={OtpVerificationScreen}
                initialParams={{ phoneNumber: '' }}
            />
            <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TurfDetails" component={TurfDetails} />
            <Stack.Screen name="SlotSelection" component={SlotSelection} />
            <Stack.Screen name="BookingSummary" component={BookingSummary} />
            <Stack.Screen name="Bookings" component={BookingsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Teams" component={TeamsScreen} />
            <Stack.Screen name="CreateTeam" component={CreateTeam} />
            <Stack.Screen name="CreateMatch" component={CreateMatch} />
            <Stack.Screen name="Invites" component={InvitesScreen} />
            <Stack.Screen name="AddTeamMembers" component={AddTeamMembers} />
            <Stack.Screen name="CreateSquad" component={CreateSquad} />
            <Stack.Screen name="MatchSummary" component={MatchSummary} />
            <Stack.Screen name="TossSelection" component={TossSelectionScreen} />
            <Stack.Screen name="SecondInningsSelection" component={SecondInningsSelectionScreen} />
            <Stack.Screen name="ScoreboardUpdate" component={ScoreboardUpdate} />
            <Stack.Screen name="LiveScoreView" component={LiveScoreView} />

            <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
            <Stack.Screen name="AdminProperties" component={MyPropertiesScreen} />
            <Stack.Screen name="AdminBookings" component={AdminBookingsScreen} />
        </Stack.Navigator>


    );
};
