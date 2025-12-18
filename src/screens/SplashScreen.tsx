import React from 'react';
import { View, Text, StatusBar, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const SplashScreen = () => {
    return (
        <View className="flex-1 bg-[#10141E] items-center justify-between py-12">
            <StatusBar barStyle="light-content" backgroundColor="#10141E" />

            {/* Top spacer to balance layout */}
            <View />

            <View className="items-center">
                {/* Logo Container */}
                <View className="w-40 h-40 bg-[#E0E2D8] rounded-full items-center justify-center mb-6 shadow-2xl relative">
                    {/* Glow effect hack if needed, or just shadow */}
                    <View className="absolute w-full h-full rounded-full bg-white opacity-10 blur-xl" />
                    <MaterialCommunityIcons name="cricket" size={80} color="#2E7D32" />
                    {/* Small ball icon */}
                    <View className="absolute top-8 right-8 w-6 h-6 rounded-full bg-[#2E7D32]" />
                </View>

                {/* Title */}
                <View className="flex-row items-center mb-2">
                    <Text className="text-white text-4xl font-bold">Turf</Text>
                    <Text className="text-[#2E7D32] text-4xl font-bold ml-2">Time</Text>
                </View>

                {/* Subtitle */}
                <Text className="text-gray-400 text-sm">Book . Play . Repeat</Text>
            </View>

            {/* Footer / Loading */}
            <View className="w-4/5 items-center">
                <Text className="text-white text-sm mb-4 font-semibold self-start ml-2">Loading Pitches...</Text>
                <View className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <View className="w-1/3 h-full bg-[#2E7D32] rounded-full" />
                </View>
            </View>
        </View>
    );
};
