import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { BottomNavBar } from '../components/BottomNavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMatchDetailsRequest } from '../store/slices/matchSlice';

export const MatchSummary = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const route = useRoute<RouteProp<RootStackParamList, 'MatchSummary'>>();
    const { matchId } = route.params;

    const { currentMatch: matchData, loading } = useAppSelector(state => state.matches);

    useEffect(() => {
        if (matchId) dispatch(fetchMatchDetailsRequest(matchId));
    }, [matchId, dispatch]);

    if (loading && !matchData) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e" />
                <Text className="text-white mt-4">Loading match summary...</Text>
            </View>
        );
    }

    if (!matchData) {
        return (
            <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                <View className="flex-row items-center px-5 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg">Match details not found.</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Match Summary</Text>
                <View className="w-7" />
            </View>

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 150 }}>
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
                                <Text className="text-gray-800 text-2xl font-bold mr-2">
                                    {matchData.teamA?.captain?.name}
                                </Text>
                                <View className="bg-[#3d5a45] px-2 py-0.5 rounded-sm">
                                    <Text className="text-white text-xs font-bold">Captain</Text>
                                </View>
                            </View>

                            <View className="flex-row flex-wrap">
                                {matchData.teamA?.players?.map((player: any, index: number) => (
                                    <View key={index} className="bg-[#5a7a5a] px-4 py-1.5 rounded-[10px] mr-2 mb-2">
                                        <Text className="text-white text-base font-medium">{player.name}</Text>
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
                                <Text className="text-gray-800 text-2xl font-bold mr-2">
                                    {matchData.teamB?.captain?.name}
                                </Text>
                                <View className="bg-[#3d5a45] px-2 py-0.5 rounded-sm">
                                    <Text className="text-white text-xs font-bold">Captain</Text>
                                </View>
                            </View>

                            <View className="flex-row flex-wrap">
                                {matchData.teamB?.players?.map((player: any, index: number) => (
                                    <View key={index} className="bg-[#5a7a5a] px-4 py-1.5 rounded-[10px] mr-2 mb-2">
                                        <Text className="text-white text-base font-medium">{player.name}</Text>
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
        </View>
    );
};
