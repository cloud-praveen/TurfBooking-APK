import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

export const LoginScreen = () => {
    return (
        <ScrollView className="flex-1 bg-[#090C15]" contentContainerStyle={{ flexGrow: 1 }}>
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
                            <FontAwesome5 name="cricket" size={24} color="#2E7D32" />
                        </View>
                        <Text className="text-white text-2xl font-bold">Game On !</Text>
                        <Text className="text-gray-300 text-xs">Join the league of champions today</Text>
                    </View>
                </View>
            </View>

            {/* Form Section */}
            <View className="w-full px-8">
                <Text className="text-[#2E7D32] text-xl font-bold mb-1">Enter Your</Text>
                <Text className="text-[#2E7D32] text-xl font-bold mb-6">Phone Number</Text>

                {/* Phone Input */}
                <View className="flex-row items-center bg-[#252A3A] rounded-xl h-14 px-4 border border-gray-700 mb-6">
                    <Text className="text-white text-base mr-3">+91</Text>
                    <View className="w-[1px] h-6 bg-gray-500 mr-3" />
                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor="#6B7280"
                        className="flex-1 text-white text-base"
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Get OTP Button */}
                <TouchableOpacity className="w-full bg-[#2E7D32] h-14 rounded-full items-center justify-center shadow-lg shadow-green-900/50 mb-8">
                    <Text className="text-white text-base font-bold">Get OTP</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center justify-center mb-8">
                    <View className="flex-1 h-[1px] bg-gray-800" />
                    <Text className="text-gray-500 mx-4 text-xs font-semibold">or Connect With</Text>
                    <View className="flex-1 h-[1px] bg-gray-800" />
                </View>

                {/* Social Login */}
                <View className="flex-row justify-center space-x-6 pb-8">
                    <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center">
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
                            className="w-8 h-8"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center">
                        <FontAwesome name="facebook" size={24} color="#1877F2" />
                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    );
};
