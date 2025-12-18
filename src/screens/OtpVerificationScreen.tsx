import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export const OtpVerificationScreen = () => {
    return (
        <ScrollView className="flex-1 bg-[#090C15]" contentContainerStyle={{ flexGrow: 1 }}>
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
                <Text className="text-[#1DB954] text-xl font-bold mb-1">Verify Your Number</Text>
                <Text className="text-white text-sm mb-6">Enter the code we've sent by text to <Text className="font-bold text-white">+91 8428666442</Text></Text>

                {/* OTP Input - Simplified as one field for now as per design mockup visual */}
                <View className="flex-row items-center bg-[#252A3A] rounded-full h-14 px-4 border border-gray-700 mb-2 justify-center">
                    <TextInput
                        placeholder="|"
                        placeholderTextColor="#6B7280"
                        className="flex-1 text-white text-base text-center tracking-widest"
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                    />
                </View>

                {/* Resend Link */}
                <View className="flex-row mb-8">
                    <Text className="text-gray-400 text-xs">Didn't get it ? </Text>
                    <TouchableOpacity>
                        <Text className="text-[#1DB954] text-xs font-bold">Tap to resend.</Text>
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity className="w-full bg-[#1DB954] h-14 rounded-full flex-row items-center justify-center shadow-lg shadow-green-900/50 mb-8">
                    <Text className="text-white text-base font-bold mr-2">Get in the Game</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};
