import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../constants/api';
import { AuthBanner } from '../components/AuthBanner';

export const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Login'>>();
    const { role } = route.params;

    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleGetOtp = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            Alert.alert("Invalid Input", "Please enter a valid phone number");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: phoneNumber, role: role }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "OTP sent successfully!");
                navigation.navigate('OtpVerification', { phoneNumber: phoneNumber, role: role });
            } else {
                Alert.alert("Error", data.message || "Failed to send OTP");
            }
        } catch (error) {
            Alert.alert("Error", "Network request failed. Please check your connection.");
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
                                <Text className="text-primary text-xl font-bold mb-8">Enter Your{"\n"}Phone Number</Text>

                                {/* Phone Input */}
                                <View className="flex-row items-center bg-[#1E2330] rounded-2xl h-16 px-4 border border-gray-800 mb-6">
                                    <Text className="text-white font-bold mr-3">+91</Text>
                                    <View className="w-[1px] h-6 bg-gray-700 mr-4" />
                                    <TextInput
                                        placeholder="Enter Your Phone Number"
                                        placeholderTextColor="#4B5563"
                                        className="flex-1 h-full text-white text-base font-medium"
                                        keyboardType="phone-pad"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                    />
                                </View>
                            </View>

                            {/* Get OTP Button */}
                            <TouchableOpacity
                                onPress={handleGetOtp}
                                disabled={loading}
                                className={`w-full h-16 rounded-3xl flex-row items-center justify-center shadow-lg shadow-green-900/50 ${loading ? 'bg-primary/70' : 'bg-primary'}`}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <>
                                        <Text className="text-white text-lg font-bold mr-2">Get OTP</Text>
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
