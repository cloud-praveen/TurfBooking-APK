import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomNavBar } from '../components/BottomNavBar';
import { COLORS } from '../constants/colors';

export const ProfileScreen = () => {
    const navigation = useNavigation();

    const StatBox = ({ icon, value, label, type = 'Ionicons' }: { icon: any, value: string, label: string, type?: 'Ionicons' | 'MaterialCommunityIcons' }) => (
        <View className="bg-surface border border-gray-700 rounded-3xl p-4 items-center flex-1 mx-2 h-32 justify-center">
            {type === 'Ionicons' ? (
                <Ionicons name={icon} size={24} color={COLORS.primary} className="mb-2" />
            ) : (
                <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} className="mb-2" />
            )}
            <Text className="text-white text-xl font-bold mt-2">{value}</Text>
            <Text className="text-gray-400 text-[10px] mt-1">{label}</Text>
        </View>
    );

    const MenuItem = ({ icon, label, onPress, isGreen = false }: { icon: any, label: string, onPress: () => void, isGreen?: boolean }) => (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center justify-between p-4 rounded-3xl mb-4 border ${isGreen ? 'bg-primary border-primary' : 'bg-surface border-gray-700'}`}
        >
            <View className="flex-row items-center">
                <View className={`p-2 rounded-full ${isGreen ? 'bg-white/20' : 'bg-gray-700'}`}>
                    <Ionicons name={icon} size={20} color={isGreen ? 'black' : COLORS.primary} />
                </View>
                <Text className={`ml-4 text-base font-bold ${isGreen ? 'text-black' : 'text-white'}`}>{label}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={isGreen ? 'black' : 'white'} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-background relative">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Header */}
                <View className="px-5 pt-2 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">My Profile</Text>
                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                {/* Profile Info */}
                <View className="items-center mt-8 mb-8">
                    <View className="relative">
                        <View className="w-24 h-24 rounded-full p-1 border-2 border-primary">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                                className="w-full h-full rounded-full"
                            />
                        </View>
                        <View className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-background">
                            <Ionicons name="camera" size={12} color="white" />
                        </View>
                    </View>
                    <Text className="text-white text-xl font-bold mt-4">Alex Striker</Text>
                </View>

                {/* Stats */}
                <View className="flex-row px-3 mb-8">
                    <StatBox icon="cricket" value="12" label="Red Devils" type="MaterialCommunityIcons" />
                    <StatBox icon="star" value="4.8" label="Rating" />
                    <StatBox icon="wallet" value="2.5k" label="wallet" />
                </View>

                {/* Actions */}
                <View className="px-5">
                    <MenuItem
                        icon="wallet-outline"
                        label="Topup Wallet"
                        onPress={() => { }}
                        isGreen={true}
                    />
                    <MenuItem
                        icon="time-outline"
                        label="Booking History"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="heart"
                        label="Saved Turfs"
                        onPress={() => { }}
                    />
                </View>

                {/* Logout */}
                <View className="px-5 mt-4">
                    <TouchableOpacity className="border border-red-900/50 bg-red-900/10 py-4 rounded-3xl items-center">
                        <Text className="text-red-400 font-bold">Log out</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <BottomNavBar />

        </SafeAreaView>
    );
};
