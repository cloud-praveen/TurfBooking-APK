import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

export const RoleSelectionScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [selectedRole, setSelectedRole] = useState<'USER' | 'ADMIN'>('USER');

    const handleNext = () => {
        navigation.navigate('Login', { role: selectedRole });
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar barStyle="light-content" />
            <View className="flex-1 px-8 justify-center">

                {/* Logo/Icon */}
                <View className="items-center mb-8">
                    <View className="w-16 h-16 bg-[#159947]/20 rounded-full items-center justify-center relative">
                        <View className="absolute inset-0 bg-[#159947]/10 rounded-full scale-150 opacity-50" />
                        <MaterialCommunityIcons name="cricket" size={32} color="#159947" />
                    </View>
                </View>

                {/* Title Section */}
                <View className="items-center mb-10">
                    <Text className="text-white text-3xl font-bold mb-2">Select Your Role</Text>
                    <Text className="text-gray-400 text-sm text-center">Join the league of champions today</Text>
                </View>

                {/* Options Section */}
                <View className="space-y-4 mb-14">
                    {/* Player Option */}
                    <TouchableOpacity
                        onPress={() => setSelectedRole('USER')}
                        className={`flex-row items-center p-6 rounded-3xl border ${selectedRole === 'USER' ? 'bg-[#252A3A] border-primary/50' : 'bg-[#1E2330] border-gray-800'}`}
                    >
                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${selectedRole === 'USER' ? 'border-primary' : 'border-gray-600'}`}>
                            {selectedRole === 'USER' && <View className="w-3 h-3 rounded-full bg-primary" />}
                        </View>
                        <Text className={`text-lg font-bold ${selectedRole === 'USER' ? 'text-white' : 'text-gray-400'}`}>Iam Player</Text>
                    </TouchableOpacity>

                    {/* Turf Owner Option */}
                    <TouchableOpacity
                        onPress={() => setSelectedRole('ADMIN')}
                        className={`flex-row items-center p-6 rounded-3xl border mt-5 ${selectedRole === 'ADMIN' ? 'bg-[#252A3A] border-primary/50' : 'bg-[#1E2330] border-gray-800'}`}
                    >
                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${selectedRole === 'ADMIN' ? 'border-primary' : 'border-gray-600'}`}>
                            {selectedRole === 'ADMIN' && <View className="w-3 h-3 rounded-full bg-primary" />}
                        </View>
                        <Text className={`text-lg font-bold ${selectedRole === 'ADMIN' ? 'text-white' : 'text-gray-400'}`}>Iam Turf Owner</Text>
                    </TouchableOpacity>
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-primary py-5 rounded-3xl flex-row items-center justify-center shadow-lg shadow-green-900/40"
                >
                    <Text className="text-white text-lg font-bold mr-2">Next</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};
