import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
    Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { BottomNavBar } from '../components/BottomNavBar';
import { API_BASE_URL } from '../constants/api';

export const MatchSummary = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'MatchSummary'>>();
    const { poolId, matchId } = route.params;

    const [loading, setLoading] = useState(true);
    const [matchData, setMatchData] = useState<any>(null);
    const [poolData, setPoolData] = useState<any>(null);

    useEffect(() => {
        fetchMatchDetails();
    }, [matchId]);

    const fetchMatchDetails = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            // Updated API URL as per requirement
            const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            console.log("Match Detail API Response:", data);

            if (response.ok) {
                // Handle the structure: { pool: {...}, match: {...} }
                setMatchData(data.match);
                setPoolData(data.pool);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch match details");
            }
        } catch (error) {
            console.error("Fetch Match Error:", error);
            Alert.alert("Error", "Something went wrong while fetching match details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e" />
                <Text className="text-white mt-4">Loading match summary...</Text>
            </SafeAreaView>
        );
    }

    if (!matchData) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="flex-row items-center px-5 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg">Match details not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Teams</Text>
                <View className="w-7" />
            </View>

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Pool Info Card */}
                {poolData && (
                    <View className="bg-[#0f172a] border border-primary/40 rounded-3xl p-4 mb-6 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-14 h-14 bg-gray-300 rounded-full mr-4" />
                            <View>
                                <Text className="text-white text-lg font-bold">{poolData.name}</Text>
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name="cricket" size={16} color="#22c55e" />
                                    <Text className="text-primary text-xs ml-1">{poolData.sportType || 'Cricket'}</Text>
                                </View>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-primary text-xs mr-3">{poolData.memberCount} Members</Text>
                        </View>
                    </View>
                )}

                {/* Summary Container */}
                <View className="bg-[#d1d5db] rounded-[40px] p-8 mb-8">
                    {/* Overs Section */}
                    <View className="flex-row justify-between items-start mb-8">
                        <View>
                            <Text className="text-gray-800 text-lg font-bold mb-1">Overs</Text>
                            <Text className="text-primary text-4xl font-bold">{matchData.overs}</Text>
                        </View>
                        <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => navigation.goBack()}
                        >
                            <MaterialCommunityIcons name="pencil-outline" size={16} color="gray" />
                            <Text className="text-gray-500 text-xs ml-1 font-medium">Edit Details</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Team A Summary */}
                    <View className="items-center mb-8">
                        <Text className="text-primary text-2xl font-bold mb-4">{matchData.teamA?.name}</Text>

                        <View className="w-full">
                            <View className="flex-row items-center mb-3">
                                <Text className="text-gray-800 text-base font-bold mr-2">
                                    {matchData.teamA?.captain?.name}
                                </Text>
                                <View className="bg-[#3d5a45] px-2 py-0.5 rounded-sm">
                                    <Text className="text-white text-[10px] font-bold">Captain</Text>
                                </View>
                            </View>

                            <View className="flex-row flex-wrap">
                                {matchData.teamA?.players?.map((player: any, index: number) => (
                                    <View key={index} className="bg-[#5a7a5a] px-3 py-1 rounded-full mr-2 mb-2">
                                        <Text className="text-white text-[10px] font-medium">{player.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-400 w-full mb-8 opacity-30" />

                    {/* Team B Summary */}
                    <View className="items-center mb-4">
                        <Text className="text-primary text-2xl font-bold mb-4">{matchData.teamB?.name}</Text>

                        <View className="w-full">
                            <View className="flex-row items-center mb-3">
                                <Text className="text-gray-800 text-base font-bold mr-2">
                                    {matchData.teamB?.captain?.name}
                                </Text>
                                <View className="bg-[#3d5a45] px-2 py-0.5 rounded-sm">
                                    <Text className="text-white text-[10px] font-bold">Captain</Text>
                                </View>
                            </View>

                            <View className="flex-row flex-wrap">
                                {matchData.teamB?.players?.map((player: any, index: number) => (
                                    <View key={index} className="bg-[#5a7a5a] px-3 py-1 rounded-full mr-2 mb-2">
                                        <Text className="text-white text-[10px] font-medium">{player.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Start Match Button */}
                <TouchableOpacity
                    className="bg-primary flex-row items-center justify-center py-5 rounded-3xl mt-4"
                    onPress={() => navigation.navigate('TossSelection', { matchId })}

                >
                    <Text className="text-white text-xl font-bold">Start Match</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomNavBar />
        </SafeAreaView>
    );
};
