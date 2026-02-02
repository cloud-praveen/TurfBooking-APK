import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../constants/api';

export const OtpVerificationScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'OtpVerification'>>();
    const { phoneNumber } = route.params;

    const [otp, setOtp] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleVerifyParams = async () => {
        if (!otp || otp.length < 4) { // Assuming 4-6 digit OTP
            Alert.alert("Invalid Input", "Please enter a valid OTP");
            return;
        }

        setLoading(true);
        try {
            console.log("Verifying OTP for:", phoneNumber, "OTP:", otp);
            const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    otp: otp
                }),
            });

            const data = await response.json();
            console.log("Verify API Response:", data);

            if (response.ok) {
                // Success
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(data.user));

                Alert.alert("Success", "Phone number verified successfully!");

                // If user already has a name, they are already registered - take them home
                if (data.user && data.user.name) {
                    navigation.replace('Home');
                } else {
                    navigation.replace('UserDetails');
                }
            } else {
                Alert.alert("Error", data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Error", "Network request failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: phoneNumber }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "OTP resent successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to resend OTP");
            }
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Error", "Network request failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            className="flex-1 bg-background"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                    {/* Header/Title Area */}
                    <View className="pt-16 pb-6 items-center">
                        <View className="w-32 h-6 bg-gray-700 rounded-full mb-6 opacity-30" />
                        <Text className="text-white font-semibold text-lg">Turf Booking</Text>
                    </View>

                    {/* Banner Section */}
                    <View className="relative w-full h-56 mb-8 px-4">
                        <View className="w-full h-full bg-[#0F1E29] rounded-2xl overflow-hidden border border-gray-800 relative">
                            {/* Reuse same banner approach or different one */}
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
                                className="w-full h-full absolute opacity-60"
                                resizeMode="cover"
                            />

                            <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <View className="w-12 h-12 bg-[#E0E2D8] rounded-full items-center justify-center mb-2">
                                    <FontAwesome5 name="cricket" size={24} color="#2E7D32" />
                                </View>
                                <Text className="text-white text-2xl font-bold">Game On !</Text>
                                <Text className="text-gray-300 text-xs">Join the league of champions today</Text>
                            </View>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="w-full px-8">
                        <Text className="text-primary text-xl font-bold mb-1">Verify Your Number</Text>
                        <Text className="text-white text-sm mb-6">Enter the code we've sent by text to <Text className="font-bold text-white">{phoneNumber || '+91 8428666442'}</Text></Text>

                        {/* OTP Input - Simplified as one field for now as per design mockup visual */}
                        <View className="flex-row items-center bg-surface-light rounded-full h-14 px-4 border border-gray-700 mb-2 justify-center">
                            <TextInput
                                placeholder="|"
                                placeholderTextColor="#6B7280"
                                className="flex-1 text-white text-base text-center tracking-widest"
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                                value={otp}
                                onChangeText={setOtp}
                            />
                        </View>

                        {/* Resend Link */}
                        <View className="flex-row mb-8">
                            <Text className="text-gray-400 text-xs">Didn't get it ? </Text>
                            <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                                <Text className={`text-[#1DB954] text-xs font-bold ${loading ? 'opacity-50' : ''}`}>Tap to resend.</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleVerifyParams}
                            disabled={loading}
                            className={`w-full h-14 rounded-full flex-row items-center justify-center shadow-lg shadow-green-900/50 mb-8 ${loading ? 'bg-[#1DB954]/70' : 'bg-[#1DB954]'}`}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <>
                                    <Text className="text-white text-base font-bold mr-2">Get in the Game</Text>
                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                </>
                            )}
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
