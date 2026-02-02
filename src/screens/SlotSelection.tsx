import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');

// --- Mock Data ---

const DATES = [
    { id: '1', day: 'Sat', date: '14', fullDate: '2025-10-14' },
    { id: '2', day: 'Sun', date: '15', fullDate: '2025-10-15' },
    { id: '3', day: 'Mon', date: '16', fullDate: '2025-10-16' },
    { id: '4', day: 'Tue', date: '17', fullDate: '2025-10-17' },
    { id: '5', day: 'Wed', date: '18', fullDate: '2025-10-18' },
];

const TIME_FILTERS = ['All', 'Morning', 'Afternoon', 'Evening'];

type SlotStatus = 'available' | 'booked' | 'fast_filling' | 'selected';

const SLOTS = [
    { id: '1', time: '17:00 - 18:00', duration: '60 min', price: 1500, status: 'fast_filling' as SlotStatus },
    { id: '2', time: '17:00 - 18:00', duration: '60 min', price: 1500, status: 'selected' as SlotStatus }, // Mocking one as selected initially for demo
    { id: '3', time: '17:00 - 18:00', duration: '60 min', price: 1500, status: 'available' as SlotStatus },
    { id: '4', time: '17:00 - 18:00', duration: '60 min', price: 1500, status: 'booked' as SlotStatus },
    { id: '5', time: '17:00 - 18:00', duration: '60 min', price: 1500, status: 'fast_filling' as SlotStatus },
    { id: '6', time: '17:00 - 18:00', duration: '60 min', price: 1500, status: 'fast_filling' as SlotStatus },
];

export const SlotSelection = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'SlotSelection'>>();
    const { turfId } = route.params;

    const [venue, setVenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('2025-10-14');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    useEffect(() => {
        fetchVenueDetails();
    }, [turfId]);

    const fetchVenueDetails = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const url = `${API_BASE_URL}/turf/${turfId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            const data = await response.json();

            if (response.ok) {
                setVenue(data);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch venue details");
                navigation.goBack();
            }
        } catch (error) {
            console.error("API Error fetching venue details:", error);
            Alert.alert("Error", "Something went wrong while fetching venue details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e" />
            </View>
        );
    }

    if (!venue) return null;

    const handleSlotPress = (id: string, status: SlotStatus) => {
        if (status === 'booked') return;
        if (selectedSlotId === id) {
            setSelectedSlotId(null);
        } else {
            setSelectedSlotId(id);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1">
                {/* --- Header --- */}
                <View className="px-5 pt-2 pb-6">
                    <Text className="text-gray-400 text-sm mb-4">Slot Selection</Text>

                    {/* Title Block */}
                    <View className="items-center mb-6">
                        <View className="bg-gray-800/50 px-8 py-4 rounded-[40px] items-center w-full">
                            <Text className="text-white text-xl font-bold">{venue.name}</Text>
                            <Text className="text-gray-400 text-xs">{venue.sport || 'Sports Turf'}</Text>
                        </View>
                    </View>

                    {/* Date Navigation Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-lg font-bold">October 2025</Text>
                        <View className="flex-row space-x-2">
                            <TouchableOpacity
                                className="w-8 h-8 rounded-full bg-green-500 items-center justify-center"
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="chevron-back" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-8 h-8 rounded-full bg-green-500 items-center justify-center">
                                <Ionicons name="chevron-forward" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Date Strip */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        {DATES.map((date) => {
                            const isSelected = selectedDate === date.fullDate;
                            return (
                                <TouchableOpacity
                                    key={date.id}
                                    onPress={() => setSelectedDate(date.fullDate)}
                                    className={`w-16 h-20 rounded-3xl mx-2 items-center justify-center border ${isSelected ? 'bg-primary border-primary' : 'bg-transparent border-gray-700'}`}
                                >
                                    <Text className={`text-xs mb-1 ${isSelected ? 'text-black font-semibold' : 'text-gray-300'}`}>{date.day}</Text>
                                    <Text className={`text-lg font-bold ${isSelected ? 'text-black' : 'text-gray-300'}`}>{date.date}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Time Filters */}
                    <View className="flex-row justify-between mb-8 px-2">
                        {TIME_FILTERS.map((filter) => {
                            const isActive = selectedFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => setSelectedFilter(filter)}
                                    className={`px-4 py-2 rounded-full border ${isActive ? 'bg-primary border-primary' : 'bg-transparent border-gray-600'}`}
                                >
                                    <Text className={`text-[10px] font-medium ${isActive ? 'text-black' : 'text-gray-300'}`}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Slots Section */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-lg font-bold">Available Slots</Text>
                        <View className="bg-gray-200 rounded-full px-3 py-1">
                            <Text className="text-black text-[10px] font-bold">8 slots left</Text>
                        </View>
                    </View>
                </View>

                {/* Slots Grid */}
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
                    <View className="flex-row flex-wrap justify-between">
                        {SLOTS.map((slot) => {
                            const isSelected = selectedSlotId === slot.id;
                            const isBooked = slot.status === 'booked';

                            // Determine styles based on status
                            let containerBorder = 'border-primary/30';
                            let statusBadgeBg = 'bg-gray-800';
                            let statusText = 'text-primary';
                            let statusLabel = 'Available';

                            if (isBooked) {
                                containerBorder = 'border-red-500/30';
                                statusBadgeBg = 'bg-red-500/20';
                                statusText = 'text-red-500';
                                statusLabel = 'Booked';
                            } else if (slot.status === 'fast_filling') {
                                containerBorder = 'border-yellow-500/30'; // Or keep green but add badge
                                statusBadgeBg = 'bg-yellow-900/40';
                                statusText = 'text-yellow-500';
                                statusLabel = 'FAST FILLING';
                            } else if (isSelected) {
                                statusBadgeBg = 'bg-primary';
                                statusText = 'text-white';
                                statusLabel = 'Selected';
                            }

                            // Selection Border Override
                            if (isSelected) {
                                containerBorder = 'border-primary bg-gray-900'; // Highlight
                            } else if (!isBooked) {
                                containerBorder = 'border-green-900/40 bg-gray-900/40';
                            } else {
                                containerBorder = 'border-gray-800 bg-gray-900/20';
                            }

                            return (
                                <TouchableOpacity
                                    key={slot.id}
                                    onPress={() => handleSlotPress(slot.id, slot.status)}
                                    activeOpacity={isBooked ? 1 : 0.7}
                                    className={`w-[48%] h-28 rounded-2xl mb-4 p-3 border ${containerBorder} justify-between relative overflow-hidden`}
                                >
                                    {/* Strike-through for booked time */}
                                    {isBooked && (
                                        <View className="absolute top-1/2 left-2 right-2 h-[1px] bg-red-500/50 z-10" />
                                    )}

                                    <View className="flex-row justify-between items-start">
                                        <View>
                                            <Text className={`text-sm font-semibold ${isBooked ? 'text-gray-500' : 'text-white'}`}>
                                                {slot.time}
                                            </Text>
                                            <Text className="text-gray-500 text-[10px]">{slot.duration}</Text>
                                        </View>

                                        {/* Selection Radio / Icon */}
                                        {isBooked ? (
                                            <Ionicons name="ban-outline" size={20} color="#ef4444" />
                                        ) : (
                                            <View className={`w-5 h-5 rounded-full border ${isSelected ? 'bg-primary border-primary' : 'border-gray-500'}`} />
                                        )}
                                    </View>

                                    <View className="flex-row justify-between items-end mt-2">
                                        {/* Status Badge */}
                                        <View className={`px-2 py-1 rounded-md ${statusBadgeBg}`}>
                                            <Text className={`text-[8px] font-bold uppercase ${statusText}`}>
                                                {isSelected ? 'Selected' : statusLabel}
                                            </Text>
                                        </View>

                                        <Text className={`text-lg font-bold ${isBooked ? 'text-gray-500' : 'text-white'}`}>
                                            ₹{slot.price}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* --- Sticky Footer --- */}
            <View className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-6 py-4 pb-8 flex-row items-center justify-between z-50">
                <View>
                    <Text className="text-gray-400 text-xs font-medium">Price</Text>
                    <View className="flex-row items-end">
                        <Text className="text-white text-xl font-bold">₹ {venue.price || '0'}</Text>
                        <Text className="text-gray-500 text-xs mb-1 ml-1">/ 1 Slot</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="bg-green-500 px-6 py-3 rounded-xl flex-row items-center"
                    onPress={() => {
                        if (selectedSlotId) {
                            navigation.navigate('BookingSummary', { slotId: selectedSlotId });
                        } else {
                            Alert.alert("Selection Required", "Please select a slot before proceeding");
                        }
                    }}
                >
                    <Text className="text-gray-900 font-bold mr-2">Proceed To Pay</Text>
                    <Ionicons name="arrow-forward" size={18} color="#111827" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
