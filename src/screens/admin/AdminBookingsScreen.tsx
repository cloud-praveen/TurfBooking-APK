import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TextInput,
    Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';


const BookingCard = ({ type, name, status, icon }: { type: 'upcoming' | 'pending', name: string, status: string, icon?: string }) => {
    if (type === 'pending') {
        return (
            <View className="bg-[#D9D9D9] rounded-[32px] p-6 mb-6 shadow-sm">
                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: icon || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }}
                            className="w-14 h-14 rounded-full bg-white shadow-sm"
                        />
                        <View className="ml-3">
                            <Text className="text-[#1E293B] text-lg font-bold">{name}</Text>
                            <Text className="text-gray-500 text-[10px]">Waiting for confirmation</Text>
                        </View>
                    </View>
                    <View className="bg-[#FEF9C3] px-4 py-1.5 rounded-full">
                        <Text className="text-[#A16207] text-[10px] font-bold">Pending</Text>
                    </View>
                </View>

                <View className="bg-white/60 rounded-2xl p-4 mb-4">
                    <Text className="text-[#1E293B] text-sm font-bold">Greenvalley</Text>
                    <Text className="text-gray-500 text-[10px]">Pitch A</Text>
                </View>

                <View className="flex-row items-center mb-6 px-1">
                    <Ionicons name="time-outline" size={18} color="black" />
                    <Text className="text-[#1E293B] text-xs font-medium ml-2">8.00 PM - 9.00 PM   |   1200/-</Text>
                </View>

                <View className="flex-row justify-between gap-4">
                    <TouchableOpacity className="flex-1 bg-[#22C55E] py-3 rounded-xl shadow-sm items-center">
                        <Text className="text-white font-bold text-sm">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white/80 py-3 rounded-xl shadow-sm items-center">
                        <Text className="text-[#1E293B] font-bold text-sm">Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="bg-[#D9D9D9] rounded-[24px] p-5 mb-4 shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-white shadow-sm" />
                    <View className="ml-3">
                        <Text className="text-black text-base font-bold">{name}</Text>
                        <Text className="text-gray-500 text-[10px]">{status}</Text>
                    </View>
                </View>
                <View className="bg-[#E2F8E9] px-3 py-1 rounded-full">
                    <Text className="text-[#22C55E] text-[10px] font-bold">Upcoming</Text>
                </View>
            </View>

            <View className="gap-y-2">
                <View className="flex-row items-center">
                    <Ionicons name="location-sharp" size={16} color="black" />
                    <Text className="text-gray-600 text-xs ml-2">Greenvalley - Pitch 1</Text>
                </View>
                <View className="flex-row items-center mt-2">
                    <Ionicons name="time" size={16} color="black" />
                    <Text className="text-gray-600 text-xs ml-2">8.00 PM - 9.00 PM   |   1200/-</Text>
                </View>
            </View>
        </View>
    );
};

export const AdminBookingsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState('Upcoming');

    return (
        <SafeAreaView className="flex-1 bg-[#0B101B]">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="flex-row items-center px-5 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold flex-1 text-center mr-8">My Bookings</Text>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View className="bg-gray-300 rounded-xl px-4 py-2.5 flex-row items-center mb-6">
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        placeholder="Select player, Booking ID..."
                        placeholderTextColor="gray"
                        className="flex-1 ml-2 text-black text-sm"
                    />
                </View>

                {/* Filters */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity className="bg-[#22C55E] px-6 py-2 rounded-lg mr-3 shadow-sm">
                        <Text className="text-black font-bold text-xs">All Turfs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded-lg flex-row items-center shadow-sm">
                        <Text className="text-black font-bold text-xs mr-2">Vilvam</Text>
                        <Ionicons name="chevron-down" size={16} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className="bg-gray-300 rounded-xl p-1 flex-row mb-6">
                    {['Upcoming', 'Pending', 'History'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-3 rounded-lg ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}
                        >
                            <Text className={`text-center text-xs font-bold ${activeTab === tab ? 'text-black' : 'text-gray-500'}`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Action Required Banner */}
                <View className="bg-[#333333] rounded-2xl p-4 flex-row items-center justify-between mb-6 border border-gray-700">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-gray-400 mr-3" />
                        <View>
                            <Text className="text-red-400 text-xs font-bold">Action Required</Text>
                            <Text className="text-gray-400 text-[10px]">You have 2 pending requests</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-white/90 px-4 py-1.5 rounded-full shadow-sm">
                        <Text className="text-black text-[10px] font-bold">Review</Text>
                    </TouchableOpacity>
                </View>

                {/* Booking List */}
                <View className="mb-24">
                    {activeTab === 'Upcoming' && (
                        <>
                            <BookingCard type="upcoming" name="Raveendran" status="Booking Confirmed" />
                            <BookingCard type="upcoming" name="Raveendran" status="Booking Confirmed" />
                            <BookingCard type="upcoming" name="Raveendran" status="Booking Confirmed" />
                        </>
                    )}
                    {activeTab === 'Pending' && (
                        <>
                            <BookingCard
                                type="pending"
                                name="Asuvath"
                                status="Waiting for confirmation"
                                icon="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            />
                            <BookingCard
                                type="pending"
                                name="Raveendran"
                                status="Waiting for confirmation"
                                icon="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            />
                        </>
                    )}
                    {activeTab === 'History' && (
                        <Text className="text-gray-500 text-center mt-10 italic">No history available</Text>
                    )}
                </View>
            </ScrollView>

            {/* Admin Bottom Nav Bar */}
            <View className="bg-[#F0F0F0] flex-row justify-between items-center px-8 pt-4 pb-8 rounded-t-[40px] shadow-2xl absolute bottom-0 left-0 right-0">
                <TouchableOpacity className="items-center" onPress={() => navigation.navigate('AdminHome')}>
                    <Ionicons name="home-outline" size={26} color="#A0AEC0" />
                    <Text className="text-[10px] font-bold text-[#A0AEC0] mt-1">Home</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => navigation.navigate('AdminBookings')}>
                    <MaterialCommunityIcons name="ticket" size={26} color="#4A5568" />
                    <Text className="text-[10px] font-bold text-[#4A5568] mt-1">Bookings</Text>
                </TouchableOpacity>

                <View className="items-center -mt-16">
                    <TouchableOpacity className="bg-[#22C55E] w-16 h-16 rounded-full items-center justify-center border-[6px] border-[#0B101B] shadow-lg">
                        <Ionicons name="add" size={36} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="items-center" onPress={() => navigation.navigate('AdminProperties')}>
                    <Ionicons name="people-outline" size={26} color="#A0AEC0" />
                    <Text className="text-[10px] font-bold text-[#A0AEC0] mt-1">My Properties</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <Ionicons name="person-outline" size={26} color="#A0AEC0" />
                    <Text className="text-[10px] font-bold text-[#A0AEC0] mt-1">Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
