import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
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
        </Stack.Navigator>
    );
};
