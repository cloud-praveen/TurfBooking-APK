import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { AuthBanner } from '../components/AuthBanner';
import { API_BASE_URL } from '../constants/api';

export const RegisterNameScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'RegisterName'>>();
    const { phoneNumber, role } = route.params;

    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        if (!fullName.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/generate-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: fullName }),
            });
            const data = await response.json();

            navigation.navigate('RegisterUsername', {
                phoneNumber,
                role,
                fullName,
                suggestedUsername: data.username || ''
            });
        } catch (error) {
            console.error("Error generating username:", error);
            navigation.navigate('RegisterUsername', { phoneNumber, role, fullName });
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
                                <Text className="text-primary text-xl font-bold mb-8">What's your full name ?</Text>

                                <View className="bg-[#1E2330] rounded-2xl h-16 px-4 border border-gray-800 mb-2">
                                    <TextInput
                                        placeholder="Full name"
                                        placeholderTextColor="#4B5563"
                                        className="flex-1 h-full text-white text-base font-medium"
                                        value={fullName}
                                        onChangeText={setFullName}
                                        autoFocus
                                    />
                                </View>
                                <Text className="text-gray-600 text-[10px] ml-1">0/30 Characters</Text>
                            </View>

                            <TouchableOpacity
                                onPress={handleContinue}
                                disabled={!fullName.trim() || loading}
                                className={`w-full h-16 rounded-3xl flex-row items-center justify-center shadow-lg ${fullName.trim() && !loading ? 'bg-primary shadow-green-900/50' : 'bg-gray-800 shadow-black'}`}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <>
                                        <Text className={`text-lg font-bold mr-2 ${fullName.trim() ? 'text-white' : 'text-gray-500'}`}>Continue</Text>
                                        <Ionicons name="arrow-forward" size={20} color={fullName.trim() ? 'white' : 'gray'} />
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
