import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export const BottomNavBar = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const currentRoute = route.name;

    const isActive = (routeName: string) => currentRoute === routeName;

    return (
        <View className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-between px-8 py-4 pb-8 rounded-t-3xl shadow-lg border-t border-gray-100">
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

            <TouchableOpacity className="items-center bg-primary rounded-full p-4 -mt-10 shadow-lg border-4 border-gray-100" onPress={() => navigation.navigate('SlotSelection')}>
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={() => console.log('Teams')}>
                <Ionicons name="people-outline" size={24} color="#9ca3af" />
                <Text className="text-[10px] font-medium text-gray-400 mt-1">Teams</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={() => navigation.navigate('Profile')}>
                <Ionicons
                    name={isActive('Profile') ? "person" : "person-outline"}
                    size={24}
                    color={isActive('Profile') ? "#000000" : "#9ca3af"}
                />
                <Text className={`text-[10px] font-medium mt-1 ${isActive('Profile') ? 'text-gray-900' : 'text-gray-400'}`}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
};
