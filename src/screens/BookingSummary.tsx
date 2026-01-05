import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const BookingSummary = () => {
    const navigation = useNavigation();
    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1">
                {/* --- Header --- */}
                <View className="flex-row items-center px-5 py-4">
                    <TouchableOpacity
                        className="mr-4"
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold flex-1 text-center mr-8">Booking Summary</Text>
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>

                    {/* --- Turf Info Card --- */}
                    <View className="border border-green-500/30 rounded-3xl p-3 bg-gray-900/50 mb-6">
                        <View className="h-32 rounded-2xl overflow-hidden mb-3">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1570498839593-e565b39455fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} // Cricket turf image
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>

                        <View className="px-2">
                            <View className="flex-row items-center mb-1">
                                <Ionicons name="star" size={14} color="#fbbf24" />
                                <Text className="text-gray-300 text-xs ml-1">4.8 (120 reviews)</Text>
                            </View>

                            <Text className="text-white text-lg font-bold mb-2">Vilvam Turf - Pitch A</Text>

                            <View className="flex-row space-x-2">
                                <View className="bg-gray-700 px-3 py-1 rounded-md">
                                    <Text className="text-gray-300 text-[10px] font-bold">10 vs 10</Text>
                                </View>
                                <View className="bg-gray-700 px-3 py-1 rounded-md">
                                    <Text className="text-gray-300 text-[10px] font-bold">Outdoor</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* --- Reservation Details --- */}
                    <View className="border border-green-500/30 rounded-3xl p-5 bg-gray-900/50 mb-6">
                        <Text className="text-white text-base font-bold mb-4">Reservation Details</Text>

                        {/* Date Row */}
                        <View className="flex-row items-center justify-between mb-4 border-b border-gray-800 pb-4">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center mr-4">
                                    <Ionicons name="calendar" size={20} color="white" />
                                </View>
                                <View>
                                    <Text className="text-white text-sm font-bold">Fri, Oct 24</Text>
                                    <Text className="text-gray-500 text-[10px] mt-0.5">Date</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="pencil" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Time Row */}
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-green-500/80 items-center justify-center mr-4">
                                    <Ionicons name="time-outline" size={20} color="white" />
                                </View>
                                <View>
                                    <Text className="text-white text-sm font-bold">07:00 PM - 8:00 PM</Text>
                                    <Text className="text-gray-500 text-[10px] mt-0.5">Time Slot (1 Hour)</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="pencil" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- Payment Breakdown --- */}
                    <View className="border border-green-500/30 rounded-3xl p-5 bg-gray-900/50 mb-6">
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-white text-sm font-semibold">Hourly Rate (1 hr)</Text>
                            <Text className="text-white text-sm font-semibold">₹ 1500</Text>
                        </View>

                        <View className="flex-row justify-between mb-4">
                            <Text className="text-white text-sm font-semibold">Service fee</Text>
                            <Text className="text-white text-sm font-semibold">₹ 40</Text>
                        </View>

                        <View className="h-[1px] bg-green-500/30 my-2 mb-4" />

                        <View className="flex-row justify-between items-center">
                            <Text className="text-white text-lg font-bold">Total Amount</Text>
                            <Text className="text-white text-lg font-bold">₹ 1540</Text>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>

            {/* --- Sticky Footer --- */}
            <View className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-6 py-4 pb-8 flex-row items-center justify-between z-50">
                <View>
                    <Text className="text-gray-400 text-xs font-medium">Grand Total</Text>
                    <View className="flex-row items-end">
                        <Text className="text-white text-xl font-bold">₹ 1540</Text>
                        <Text className="text-gray-500 text-xs mb-1 ml-1">/ 1 Slot</Text>
                    </View>
                </View>
                <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-xl flex-row items-center">
                    <Text className="text-gray-900 font-bold mr-2">Proceed To Payment</Text>
                    <Ionicons name="arrow-forward" size={18} color="#111827" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
