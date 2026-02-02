import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';


export const MyPropertiesScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const StatCard = ({ title, value, subtext, subtextColor }: { title: string, value: string, subtext: string, subtextColor: string }) => (
        <View className="bg-[#D9D9D9] rounded-2xl p-4 flex-1 mx-1.5 shadow-sm">
            <Text className="text-gray-600 text-[10px] font-bold mb-1">{title}</Text>
            <View className="flex-row items-baseline">
                <Text className="text-black text-xl font-bold">{value}</Text>
                <Text className={`ml-2 text-[10px] font-medium ${subtextColor}`}>{subtext}</Text>
            </View>
        </View>
    );

    const VenueCard = ({ name, address, slots }: { name: string, address: string, slots: string }) => (
        <View className="bg-[#D9D9D9] rounded-[24px] mb-6 overflow-hidden">
            <View className="p-4 flex-row items-center">
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }}
                    className="w-20 h-20 rounded-2xl"
                />
                <View className="ml-4 flex-1">
                    <Text className="text-black text-lg font-bold">{name}</Text>
                    <Text className="text-gray-500 text-[10px] my-1">{address}</Text>
                    <Text className="text-gray-400 text-[10px] font-medium">{slots}</Text>
                </View>
            </View>

            <View className="flex-row border-t border-gray-300">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 border-r border-gray-300">
                    <Ionicons name="eye-outline" size={16} color="#22C55E" />
                    <Text className="text-black text-[11px] font-bold ml-1.5">Details</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 border-r border-gray-300">
                    <MaterialCommunityIcons name="pencil-outline" size={16} color="#22C55E" />
                    <Text className="text-black text-[11px] font-bold ml-1.5">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3">
                    <Ionicons name="calendar-outline" size={16} color="#22C55E" />
                    <Text className="text-black text-[11px] font-bold ml-1.5">Slots</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0B101B]">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="flex-row items-center px-5 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold flex-1 text-center mr-8">My Properties</Text>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {/* Stats Section */}
                <View className="flex-row justify-between mt-4 mb-8">
                    <StatCard
                        title="Total Bookings"
                        value="128"
                        subtext="This Week"
                        subtextColor="text-[#22C55E]"
                    />
                    <StatCard
                        title="Total Revenue"
                        value="100k"
                        subtext="+10%"
                        subtextColor="text-[#22C55E]"
                    />
                </View>

                {/* My Venues Section */}
                <Text className="text-white text-lg font-bold mb-5">My Venues</Text>

                <VenueCard
                    name="Greenyvalley Turf"
                    address="samundipuram, 2.4km..."
                    slots="8 Slots Open"
                />

                <VenueCard
                    name="Greenyvalley Turf"
                    address="samundipuram, 2.4km..."
                    slots="8 Slots Open"
                />

                <VenueCard
                    name="Greenyvalley Turf"
                    address="samundipuram, 2.4km..."
                    slots="8 Slots Open"
                />

                {/* Add New Turf Button */}
                <TouchableOpacity className="bg-[#22C55E] rounded-3xl py-4 flex-row items-center justify-center mb-24">
                    <Ionicons name="add" size={28} color="black" />
                    <Text className="text-black text-lg font-bold ml-2">Add New Turf</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Admin Bottom Nav Bar */}
            <View className="bg-[#F0F0F0] flex-row justify-between items-center px-8 pt-4 pb-8 rounded-t-[40px] shadow-2xl absolute bottom-0 left-0 right-0">
                <TouchableOpacity className="items-center" onPress={() => navigation.navigate('AdminHome')}>
                    <Ionicons name="home-outline" size={26} color="#A0AEC0" />
                    <Text className="text-[10px] font-bold text-[#A0AEC0] mt-1">Home</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => navigation.navigate('AdminBookings')}>
                    <MaterialCommunityIcons name="ticket-outline" size={26} color="#A0AEC0" />
                    <Text className="text-[10px] font-bold text-[#A0AEC0] mt-1">Bookings</Text>
                </TouchableOpacity>

                <View className="items-center -mt-16">
                    <TouchableOpacity className="bg-[#22C55E] w-16 h-16 rounded-full items-center justify-center border-[6px] border-[#0B101B] shadow-lg">
                        <Ionicons name="add" size={36} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="items-center">
                    <Ionicons name="people" size={26} color="#4A5568" />
                    <Text className="text-[10px] font-bold text-[#4A5568] mt-1">My Properties</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <Ionicons name="person-outline" size={26} color="#A0AEC0" />
                    <Text className="text-[10px] font-bold text-[#A0AEC0] mt-1">Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
