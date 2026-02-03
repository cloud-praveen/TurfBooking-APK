import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { AuthBanner } from '../components/AuthBanner';
import { API_BASE_URL } from '../constants/api';

export const RegisterUsernameScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'RegisterUsername'>>();
    const { phoneNumber, role, fullName, suggestedUsername } = route.params;

    const [username, setUsername] = useState(suggestedUsername || '');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (suggestedUsername) {
            checkUsername(suggestedUsername);
        }
    }, [suggestedUsername]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (username.length >= 3 && username !== suggestedUsername) {
                checkUsername(username);
            } else if (username.length < 3) {
                setIsAvailable(null);
                setErrorMsg('');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const checkUsername = async (name: string) => {
        setIsChecking(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: name })
            });
            const data = await response.json();

            if (response.ok) {
                setIsAvailable(data.available);
                setErrorMsg(data.available ? '' : 'This name already Taken !');
            } else {
                setIsAvailable(false);
                setErrorMsg('Error checking username');
            }
        } catch (error) {
            // For now, let's assume it's available for testing if API fails
            setIsAvailable(true);
            setErrorMsg('');
        } finally {
            setIsChecking(false);
        }
    };

    const handleContinue = () => {
        if (!isAvailable) return;
        navigation.navigate('RegisterEmail', { phoneNumber, role, fullName, username });
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
                                <Text className="text-primary text-xl font-bold mb-1">Choose a username{"\n"}just for you</Text>
                                <Text className="text-gray-400 text-xs mb-8">This will be your identity On Turf Time</Text>

                                <View className={`bg-[#1E2330] rounded-2xl h-16 px-4 border flex-row items-center ${isAvailable === true ? 'border-primary' : isAvailable === false ? 'border-red-500' : 'border-gray-800'} mb-2`}>
                                    <TextInput
                                        placeholder="Username"
                                        placeholderTextColor="#4B5563"
                                        className="flex-1 h-full text-white text-base font-medium"
                                        value={username}
                                        onChangeText={setUsername}
                                        autoCapitalize="none"
                                        autoFocus
                                    />
                                    {isChecking ? (
                                        <ActivityIndicator size="small" color="#22c55e" />
                                    ) : isAvailable === true ? (
                                        <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                                    ) : isAvailable === false ? (
                                        <Ionicons name="close-circle" size={24} color="#ef4444" />
                                    ) : null}
                                </View>
                                <View className="flex-row justify-between px-1">
                                    <Text className={`text-[10px] ${isAvailable === false ? 'text-red-500' : 'text-gray-600'}`}>
                                        {isAvailable === false ? errorMsg : `${username.length}/30 Characters`}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleContinue}
                                disabled={!isAvailable}
                                className={`w-full h-16 rounded-3xl flex-row items-center justify-center shadow-lg ${isAvailable ? 'bg-primary shadow-green-900/50' : 'bg-gray-800 shadow-black'}`}
                            >
                                <Text className={`text-lg font-bold mr-2 ${isAvailable ? 'text-white' : 'text-gray-500'}`}>Continue</Text>
                                <Ionicons name="arrow-forward" size={20} color={isAvailable ? 'white' : 'gray'} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
