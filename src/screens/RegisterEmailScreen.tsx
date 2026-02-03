import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../constants/api';
import { AuthBanner } from '../components/AuthBanner';

export const RegisterEmailScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'RegisterEmail'>>();
    const { phoneNumber, role, fullName, username } = route.params;

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGetInTheGame = async () => {
        if (!email.trim() || !email.includes('@')) {
            Alert.alert("Invalid Email", "Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: fullName,
                    username: username,
                    email: email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update local storage with complete user data from response or provided details
                const userData = await AsyncStorage.getItem('userData');
                let parsedUser = userData ? JSON.parse(userData) : {};

                parsedUser = {
                    ...parsedUser,
                    ...data.user,
                    name: fullName,
                    username: username,
                    email: email,
                    role: role // Ensure role is preserved for dashboard routing
                };

                await AsyncStorage.setItem('userData', JSON.stringify(parsedUser));

                Alert.alert("Success", "Welcome to Turf Time!");

                if (role === 'ADMIN') {
                    navigation.replace('AdminHome');
                } else {
                    navigation.replace('Home');
                }
            } else {
                Alert.alert("Error", data.message || "Failed to complete registration");
            }
        } catch (error) {
            Alert.alert("Error", "Network request failed. Please try again.");
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
                        <AuthBanner subtitle="Player Registration" />

                        <View className="flex-1 px-8 justify-between pb-12">
                            <View>
                                <Text className="text-primary text-xl font-bold mb-1">Enter Your Email ID</Text>
                                <Text className="text-gray-400 text-xs mb-8">This will help us recover your account when you can't login</Text>

                                <View className="bg-[#1E2330] rounded-2xl h-16 px-4 border border-gray-800 mb-6">
                                    <TextInput
                                        placeholder="Email ID"
                                        placeholderTextColor="#4B5563"
                                        className="flex-1 h-full text-white text-base font-medium"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoFocus
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleGetInTheGame}
                                disabled={loading || !email.trim()}
                                className={`w-full h-16 rounded-3xl flex-row items-center justify-center shadow-lg ${email.trim() ? 'bg-primary shadow-green-900/50' : 'bg-gray-800'}`}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <>
                                        <Text className={`text-lg font-bold mr-2 ${email.trim() ? 'text-white' : 'text-gray-500'}`}>Get in the Game</Text>
                                        <Ionicons name="arrow-forward" size={20} color={email.trim() ? 'white' : 'gray'} />
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
