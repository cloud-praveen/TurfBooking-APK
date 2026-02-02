import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomNavBar = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute();
    const currentRoute = route.name;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (routeName: string) => currentRoute === routeName;

    return (
        <>
            {/* FAB Popup Menu */}
            {isMenuOpen && (
                <View className="absolute bottom-24 left-0 right-0 items-center z-50">
                    <Pressable
                        className="absolute -top-[1000%] -left-[1000%] -right-[1000%] -bottom-[1000%]"
                        onPress={() => setIsMenuOpen(false)}
                    />
                    <View className="items-center mb-4">
                        <TouchableOpacity
                            className="bg-primary px-8 py-3 rounded-full mb-3 shadow-lg"
                            onPress={() => {
                                setIsMenuOpen(false);
                                navigation.navigate('Teams');
                            }}
                        >
                            <Text className="text-white font-bold text-sm">Create Team</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-white px-8 py-3 rounded-full shadow-lg"
                            onPress={() => {
                                setIsMenuOpen(false);
                                // Navigate to Create Tournament if exists
                            }}
                        >
                            <Text className="text-black font-bold text-sm">Create Tournament</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View
                className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-between px-8 pt-4 rounded-t-3xl shadow-lg border-t border-gray-100"
                style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
                <TouchableOpacity onPress={() => navigation.navigate('Home')} className="items-center">
                    <Ionicons
                        name={isActive('Home') ? "home" : "home-outline"}
                        size={24}
                        color={isActive('Home') ? "#000000" : "#9ca3af"}
                    />
                    <Text className={`text-[10px] font-bold mt-1 ${isActive('Home') ? 'text-gray-900' : 'text-gray-400'}`}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Bookings')} className="items-center">
                    <MaterialCommunityIcons
                        name={isActive('Bookings') ? "ticket" : "ticket-outline"}
                        size={24}
                        color={isActive('Bookings') ? "#000000" : "#9ca3af"}
                    />
                    <Text className={`text-[10px] font-bold mt-1 ${isActive('Bookings') ? 'text-gray-900' : 'text-gray-400'}`}>Bookings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="items-center justify-center bg-primary rounded-full w-16 h-16 -mt-10 shadow-lg border-4 border-gray-100"
                    onPress={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Ionicons name={isMenuOpen ? "close" : "add"} size={32} color="white" />
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => navigation.navigate('Teams')}>
                    <Ionicons
                        name={isActive('Teams') ? "people" : "people-outline"}
                        size={24}
                        color={isActive('Teams') ? "#000000" : "#9ca3af"}
                    />
                    <Text className={`text-[10px] font-bold mt-1 ${isActive('Teams') ? 'text-gray-900' : 'text-gray-400'}`}>Teams</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => navigation.navigate('Profile')}>
                    <Ionicons
                        name={isActive('Profile') ? "person" : "person-outline"}
                        size={24}
                        color={isActive('Profile') ? "#000000" : "#9ca3af"}
                    />
                    <Text className={`text-[10px] font-bold mt-1 ${isActive('Profile') ? 'text-gray-900' : 'text-gray-400'}`}>Profile</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};
