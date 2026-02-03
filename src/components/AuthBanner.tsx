import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AuthBannerProps {
    title?: string;
    subtitle?: string;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({
    title = "Game On !",
    subtitle = "Join the league of champions today"
}) => {
    return (
        <View className="relative w-full h-52 mb-8 px-4 mt-2">
            <View className="w-full h-full bg-[#0F1E29] rounded-2xl overflow-hidden border border-gray-800 relative">
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
                    className="w-full h-full absolute opacity-60"
                    resizeMode="cover"
                />

                <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <View className="w-14 h-14 bg-[#E0E2D8] rounded-full items-center justify-center mb-2 shadow-lg shadow-green-900/50">
                        <MaterialCommunityIcons name="cricket" size={30} color="#159947" />
                    </View>
                    <Text className="text-white text-2xl font-bold">{title}</Text>
                    <Text className="text-gray-300 text-[10px] mt-1 uppercase tracking-widest">{subtitle}</Text>
                </View>
            </View>
        </View>
    );
};
