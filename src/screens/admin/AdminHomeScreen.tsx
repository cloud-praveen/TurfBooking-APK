import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';


export const AdminHomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const OverviewCard = ({ title, value, subtext }: { title: string, value: string, subtext?: string }) => (
        <View className="bg-[#D9D9D9] rounded-xl p-3 flex-1 mx-1.5 items-center justify-center h-20 shadow-sm">
            <Text className="text-gray-500 text-[9px] uppercase font-bold tracking-wider mb-1">{title}</Text>
            <Text className="text-black text-lg font-bold">{value}</Text>
            {subtext && <Text className="text-gray-400 text-[9px] font-medium">{subtext}</Text>}
        </View>
    );

    const ActionCard = ({ title, subtitle }: { title: string, subtitle: string }) => (
        <TouchableOpacity
            className="bg-[#D9D9D9] rounded-2xl p-6 w-[48%] mb-4 h-36 justify-center"
            activeOpacity={0.7}
        >
            <Text className="text-black text-base font-bold leading-tight">{title}</Text>
            <Text className="text-gray-500 text-[11px] mt-1">{subtitle}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0B101B]">
            <StatusBar barStyle="light-content" />

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center mt-8 mb-10">
                    <View className="w-14 h-14 rounded-full bg-[#D9D9D9]" />
                    <View className="ml-4">
                        <Text className="text-gray-400 text-xs font-medium">Welcome Back</Text>
                        <Text className="text-[#22C55E] text-xl font-bold">Manoj Sundhar</Text>
                    </View>
                </View>

                {/* Booking Requests Card */}
                <View className="bg-[#D9D9D9] rounded-[32px] p-6 mb-10">
                    <View className="flex-row items-center mb-4">
                        <View className="w-16 h-16 rounded-full bg-gray-500 mr-4" />
                        <View className="flex-1">
                            <Text className="text-black text-lg font-bold">New Booking Requests</Text>
                            <Text className="text-gray-600 text-xs leading-4 mt-1">
                                You have pending requests for "Green Valley Arena" that need approval.
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center ml-[80px]">
                        <TouchableOpacity className="bg-[#22C55E] px-8 py-2.5 rounded-full mr-6 shadow-sm">
                            <Text className="text-white font-bold text-sm">Review</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text className="text-[#22C55E] font-bold text-sm opacity-80">Decline</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Overview Section */}
                <View className="mb-10">
                    <Text className="text-white text-xl font-bold mb-5 ml-1">Overview</Text>
                    <View className="flex-row justify-between mr-[-6px] ml-[-6px]">
                        <OverviewCard title="Earned" value="10k" />
                        <OverviewCard title="Total" value="24" />
                        <OverviewCard title="% Usage" value="78%" subtext="High" />
                    </View>
                </View>

                {/* Key Actions Section */}
                <View className="mb-24">
                    <Text className="text-white text-xl font-bold mb-5 ml-1">Key Actions</Text>
                    <View className="flex-row flex-wrap justify-between">
                        <ActionCard
                            title="Manage Turf"
                            subtitle="Edit Details & Photos"
                        />
                        <ActionCard
                            title="Slot & Pricing"
                            subtitle="Set rates & availability"
                        />
                        <ActionCard
                            title="View Bookings"
                            subtitle="Check Schedule"
                        />
                        <ActionCard
                            title="Reports"
                            subtitle="Analytics & earnings"
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Admin Bottom Nav Bar */}
            <View className="bg-[#F0F0F0] flex-row justify-between items-center px-8 pt-4 pb-8 rounded-t-[40px] shadow-2xl">
                <TouchableOpacity className="items-center">
                    <Ionicons name="home" size={26} color="#4A5568" />
                    <Text className="text-[10px] font-bold text-[#4A5568] mt-1">Home</Text>
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
