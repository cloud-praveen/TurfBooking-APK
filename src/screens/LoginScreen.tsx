import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../constants/api';

export const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSocialLoginSuccess = async (data: any) => {
        try {
            if (data.token) {
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(data.user));

                if (data.user && data.user.name) {
                    navigation.replace('Home');
                } else {
                    navigation.replace('UserDetails');
                }
            }
        } catch (error) {
            console.error("Storage Error:", error);
            Alert.alert("Error", "Failed to save login session");
        }
    };

    const handleGoogleLogin = async () => {
        // In a real app, you would use @react-native-google-signin/google-signin 
        // to get the idToken first. For now, we simulate this call.
        Alert.prompt(
            "Google Login",
            "Please enter your Google ID Token (Testing Mode)",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Login",
                    onPress: async (idToken: string | undefined) => {
                        if (!idToken) return;
                        setLoading(true);
                        try {
                            const response = await fetch(`${API_BASE_URL}/auth/google`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ idToken })
                            });
                            const data = await response.json();
                            if (response.ok) {
                                await handleSocialLoginSuccess(data);
                            } else {
                                Alert.alert("Error", data.message || "Google Login failed");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Network request failed");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleFacebookLogin = async () => {
        // In a real app, you would use react-native-fbsdk-next 
        // to get the accessToken first. For now, we simulate this call.
        Alert.prompt(
            "Facebook Login",
            "Please enter your Facebook Access Token (Testing Mode)",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Login",
                    onPress: async (accessToken: string | undefined) => {
                        if (!accessToken) return;
                        setLoading(true);
                        try {
                            const response = await fetch(`${API_BASE_URL}/auth/facebook`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ accessToken })
                            });
                            const data = await response.json();
                            if (response.ok) {
                                await handleSocialLoginSuccess(data);
                            } else {
                                Alert.alert("Error", data.message || "Facebook Login failed");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Network request failed");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleGetOtp = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            Alert.alert("Invalid Input", "Please enter a valid phone number");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending OTP to:", phoneNumber);
            const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: phoneNumber }),
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (response.ok) {
                // Success
                Alert.alert("Success", "OTP sent successfully!");
                navigation.navigate('OtpVerification', { phoneNumber: phoneNumber });
            } else {
                Alert.alert("Error", data.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Error", "Network request failed. Please check your connection or server.");
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
                        {/* Notch placeholder if needed, usually handled by SafeAreaView but visual was requested */}
                        <View className="w-32 h-6 bg-gray-700 rounded-full mb-6 opacity-30" />
                        <Text className="text-white font-semibold text-lg">Turf Booking</Text>
                    </View>

                    {/* Banner Section */}
                    <View className="relative w-full h-56 mb-8 px-4">
                        {/* Using a placeholder gradient or image for the stadium vibe */}
                        <View className="w-full h-full bg-[#0F1E29] rounded-2xl overflow-hidden border border-gray-800 relative">
                            {/* Background Image Placeholder */}
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
                                className="w-full h-full absolute opacity-60"
                                resizeMode="cover"
                            />

                            <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <View className="w-12 h-12 bg-[#E0E2D8] rounded-full items-center justify-center mb-2">
                                    <MaterialCommunityIcons name="cricket" size={25} color="#159947" />
                                </View>
                                <Text className="text-white text-2xl font-bold">Game On !</Text>
                                <Text className="text-gray-300 text-xs">Join the league of champions today</Text>
                            </View>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="w-full px-8">
                        <Text className="text-primary text-xl font-bold mb-1">Enter Your</Text>
                        <Text className="text-primary text-xl font-bold mb-6 ">Phone Number</Text>

                        {/* Phone Input */}
                        <View className="flex-row items-center bg-[#252A3A] rounded-full h-14 px-4 border border-gray-700 mb-6">
                            <Text className="text-white  mr-3">+91</Text>
                            <View className="w-[1px] h-6 bg-gray-500 mr-3 " />
                            <TextInput
                                placeholder="Phone Number"
                                placeholderTextColor="#6B7280"
                                className="flex-1 h-full text-white text-left"
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>

                        {/* Get OTP Button */}
                        <TouchableOpacity
                            onPress={handleGetOtp}
                            disabled={loading}
                            className={`w-full h-14 rounded-full items-center justify-center shadow-lg shadow-green-900/50 mb-8 ${loading ? 'bg-[#1DB954]/70' : 'bg-[#1DB954]'}`}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text className="text-white text-base font-bold">Get OTP</Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center justify-center mb-8">
                            <View className="flex-1 h-[1px] bg-gray-800" />
                            <Text className="text-gray-500 mx-4 text-xs font-semibold">or Connect With</Text>
                            <View className="flex-1 h-[1px] bg-gray-800" />
                        </View>

                        {/* Social Login */}
                        <View className="flex-row justify-center gap-5 space-x-6 pb-8">
                            <TouchableOpacity
                                onPress={handleGoogleLogin}
                                className="w-12 h-12 bg-white rounded-full items-center justify-center"
                            >
                                <Image
                                    source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
                                    className="w-8 h-8"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleFacebookLogin}
                                className="w-12 h-12 bg-white rounded-full items-center justify-center"
                            >
                                <FontAwesome name="facebook" size={24} color="#1877F2" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
