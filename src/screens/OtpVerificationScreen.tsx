import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../constants/api';
import { AuthBanner } from '../components/AuthBanner';

export const OtpVerificationScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'OtpVerification'>>();
    const { phoneNumber, role } = route.params;

    const [otp, setOtp] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            Alert.alert("Invalid Input", "Please enter a valid OTP");
            return;
        }

        setLoading(true);
        try {
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

            if (response.ok) {
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(data.user));

                if (data.user && data.user.name) {
                    if (role === 'ADMIN') {
                        navigation.replace('AdminHome');
                    } else {
                        navigation.replace('Home');
                    }
                } else {
                    // Start registration flow
                    navigation.replace('RegisterName', { phoneNumber, role });
                }
            } else {
                Alert.alert("Error", data.message || "Invalid OTP");
            }
        } catch (error) {
            Alert.alert("Error", "Network request failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: phoneNumber, role: role }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "OTP resent successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to resend OTP");
            }
        } catch (error) {
            Alert.alert("Error", "Network request failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
                        <AuthBanner />

                        {/* Form Section */}
                        <View className="flex-1 px-8 justify-between pb-12">
                            <View>
                                <Text className="text-primary text-xl font-bold mb-1">Verify Your Number</Text>
                                <Text className="text-gray-400 text-xs mb-8">
                                    Enter the code we've sent by text to {"\n"}
                                    <Text className="font-bold text-white">+91 {phoneNumber}</Text>
                                </Text>

                                <View className="flex-row items-center bg-[#1E2330] rounded-2xl h-16 px-4 border border-gray-800 mb-4 justify-center">
                                    <TextInput
                                        placeholder="Enter OTP"
                                        placeholderTextColor="#4B5563"
                                        className="flex-1 text-white text-lg text-center font-bold tracking-[10px]"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        autoFocus
                                        value={otp}
                                        onChangeText={setOtp}
                                    />
                                </View>

                                <View className="flex-row mb-8 px-2">
                                    <Text className="text-gray-500 text-xs font-medium">Didn't get it ? </Text>
                                    <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                                        <Text className={`text-primary text-xs font-bold ${loading ? 'opacity-50' : ''}`}>Tap to resend.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleVerifyOtp}
                                disabled={loading}
                                className={`w-full h-16 rounded-3xl flex-row items-center justify-center shadow-lg shadow-green-900/50 ${loading ? 'bg-primary/70' : 'bg-primary'}`}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <>
                                        <Text className="text-white text-lg font-bold mr-2">Verify</Text>
                                        <Ionicons name="arrow-forward" size={20} color="white" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
