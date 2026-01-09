import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomNavBar } from '../components/BottomNavBar';
import { COLORS } from '../constants/colors';

// Mock Data
const UPCOMING_BOOKINGS = [
    {
        id: '1',
        turfName: 'Green Valley turf',
        location: 'Downtown Sports Complex',
        status: 'Confirmed',
        date: 'Oct 24',
        time: '18:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
        id: '2',
        turfName: 'Green Valley turf',
        location: 'Downtown Sports Complex',
        status: 'Pending',
        date: 'Oct 24',
        time: '18:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1517747614396-d21a78b850e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1482&q=80',
    },
];

const PAST_BOOKINGS = [
    {
        id: '3',
        turfName: 'Smash Court',
        location: 'Uptown Area',
        status: 'Completed',
        date: 'Oct 10',
        time: '10:00 - 11:00',
        image: 'https://images.unsplash.com/photo-1626224583764-84786c713066?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    }
];

export const BookingsScreen = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const navigation = useNavigation<any>();

    const bookings = activeTab === 'upcoming' ? UPCOMING_BOOKINGS : PAST_BOOKINGS;

    const renderBookingCard = ({ item }: { item: typeof UPCOMING_BOOKINGS[0] }) => (
        <View className="bg-surface rounded-2xl p-4 mb-4 border border-gray-700">
            <View className="flex-row">
                <Image
                    source={{ uri: item.image }}
                    className="w-16 h-16 rounded-2xl bg-gray-600"
                />
                <View className="ml-4 flex-1">
                    <Text className="text-white text-lg font-bold">{item.turfName}</Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="location-sharp" size={14} color={COLORS.primary} />
                        <Text className="text-gray-400 text-xs ml-1">{item.location}</Text>
                    </View>

                    <View className={`self-start px-2 py-0.5 rounded-full mt-2 flex-row items-center ${item.status === 'Confirmed' ? 'bg-green-900/50' :
                            item.status === 'Pending' ? 'bg-yellow-900/50' : 'bg-gray-700'
                        }`}>
                        <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status === 'Confirmed' ? 'bg-green-500' :
                                item.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                        <Text className={`text-[10px] ${item.status === 'Confirmed' ? 'text-green-500' :
                                item.status === 'Pending' ? 'text-yellow-500' : 'text-gray-400'
                            }`}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="h-[1px] bg-gray-700 my-4" />

            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-gray-500 text-[10px] font-medium mb-1">Date & Time</Text>
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={12} color={COLORS.primary} />
                        <Text className="text-white text-xs ml-1 font-medium">
                            {item.date} • {item.time}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="px-6 py-2 rounded-full border border-gray-600"
                    onPress={() => { }}
                >
                    <Text className="text-gray-300 text-xs font-medium">
                        {activeTab === 'upcoming' ? 'Cancel' : 'Details'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background relative">
            <View className="px-5 pt-2 pb-4 flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold flex-1 text-center mr-8">Bookings</Text>
            </View>

            {/* Tabs */}
            <View className="px-5 mb-6">
                <View className="bg-surfaceLight rounded-full p-1 flex-row">
                    <TouchableOpacity
                        className={`flex-1 py-3 rounded-full items-center flex-row justify-center ${activeTab === 'upcoming' ? 'bg-primary' : 'bg-transparent'}`}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Ionicons name="calendar-outline" size={18} color={activeTab === 'upcoming' ? 'white' : '#9ca3af'} />
                        <Text className={`ml-2 font-bold ${activeTab === 'upcoming' ? 'text-white' : 'text-gray-400'}`}>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-3 rounded-full items-center flex-row justify-center ${activeTab === 'past' ? 'bg-surface' : 'bg-transparent'}`}
                        onPress={() => setActiveTab('past')}
                    >
                        <MaterialCommunityIcons name="history" size={18} color={activeTab === 'past' ? 'white' : '#9ca3af'} />
                        <Text className={`ml-2 font-bold ${activeTab === 'past' ? 'text-white' : 'text-gray-400'}`}>Past</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={bookings}
                renderItem={renderBookingCard}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
                ListEmptyComponent={
                    <View className="items-center justify-center mt-20">
                        <Text className="text-gray-500">No bookings found</Text>
                    </View>
                }
            />

            {/* Book New Game Button */}
            <View className="absolute bottom-28 left-5 right-5">
                <TouchableOpacity
                    className="bg-primary py-4 rounded-xl flex-row items-center justify-center shadow-lg"
                    onPress={() => navigation.navigate('Home')}
                >
                    <Ionicons name="add" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Book New Game</Text>
                </TouchableOpacity>
            </View>

            <BottomNavBar />
        </SafeAreaView>
    );
};
