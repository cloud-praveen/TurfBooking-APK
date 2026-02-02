import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchLiveScoreRequest } from '../store/slices/matchSlice';

export const LiveScoreView = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const route = useRoute<RouteProp<RootStackParamList, 'LiveScoreView'>>();
    const { matchId } = route.params || {};

    const { liveScore: matchData, loading } = useAppSelector(state => state.matches);

    const fetchLiveScore = useCallback(() => {
        if (matchId) dispatch(fetchLiveScoreRequest(matchId));
    }, [matchId, dispatch]);

    useEffect(() => {
        fetchLiveScore();
        const interval = setInterval(fetchLiveScore, 20000);
        return () => clearInterval(interval);
    }, [fetchLiveScore]);

    const onRefresh = () => {
        fetchLiveScore();
    };

    const formatOvers = (balls: number) => {
        if (!balls) return "0.0";
        const overs = Math.floor(balls / 6);
        const ballsInOver = balls % 6;
        return `${overs}.${ballsInOver}`;
    };

    const convertOversToBalls = (oversRaw: any) => {
        if (!oversRaw) return 0;
        const oversStr = oversRaw.toString();
        const parts = oversStr.split('.');
        const fullOvers = parseInt(parts[0] || "0");
        const balls = parseInt(parts[1] || "0");
        return (fullOvers * 6) + balls;
    };

    if (loading && !matchData) {
        return (
            <View className="flex-1 bg-[#0B121F] justify-center items-center">
                <ActivityIndicator size="large" color="#22C55E" />
                <Text className="text-gray-400 mt-4">Loading Live Score...</Text>
            </View>
        );
    }

    if (!matchData) {
        return (
            <View className="flex-1 bg-[#0B121F]" style={{ paddingTop: insets.top }}>
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                <View className="flex-row items-center px-5 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-1 justify-center items-center px-10">
                    <MaterialCommunityIcons name="alert-circle-outline" size={60} color="gray" />
                    <Text className="text-white text-lg font-bold mt-4 text-center">Scoreboard Unavailable</Text>
                    <Text className="text-gray-500 text-center mt-2">The match data could not be loaded or the match has not started yet.</Text>
                </View>
            </View>
        );
    }

    const score = {
        runs: matchData.score?.runs ?? matchData.runs ?? 0,
        wickets: matchData.score?.wickets ?? matchData.wickets ?? 0,
        balls: matchData.score?.balls ?? matchData.balls ?? 0,
        overs: matchData.score?.overs ?? matchData.overs ?? 0,
        crr: matchData.score?.crr ?? matchData.crr ?? '0.00',
        rrr: matchData.score?.requiredRunRate ?? matchData.requiredRunRate ?? '0.00',
        target: matchData.score?.target ?? matchData.target ?? null
    };
    const battingTeamName = matchData.battingTeam?.name || "Batting Team";
    const bowlingTeamName = matchData.bowlingTeam?.name || "Fielding Team";
    const striker = matchData.striker;
    const nonStriker = matchData.nonStriker;
    const bowler = matchData.bowler;

    return (
        <View className="flex-1 bg-[#0B121F]" style={{ paddingTop: insets.top }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="bg-gray-800/50 p-2 rounded-full">
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="bg-red-500/10 border border-red-500/50 px-3 py-1 rounded-full flex-row items-center">
                        <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                        <Text className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Live</Text>
                    </View>
                    <View className="w-10" />
                </View>

                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#22C55E" />
                    }
                >
                    {/* Hero Score Card */}
                    <View className="bg-[#111827] rounded-[40px] p-8 mb-6 border border-green-500/20 shadow-2xl">
                        <Text className="text-gray-400 text-center mb-2 font-medium uppercase tracking-widest text-xs">
                            {battingTeamName} is Batting
                        </Text>
                        <Text className="text-white text-7xl font-bold text-center mb-4">
                            {score.runs}<Text className="text-green-500">/</Text>{score.wickets}
                        </Text>

                        <View className="flex-row justify-center space-x-4 mb-8">
                            <View className="bg-green-500/20 px-5 py-2 rounded-2xl border border-green-500/30">
                                <Text className="text-green-400 text-sm font-bold">
                                    {`Over ${formatOvers(score.balls ? parseInt(score.balls.toString()) : convertOversToBalls(score.overs))}`}
                                </Text>
                            </View>
                            <View className="bg-blue-500/20 px-5 py-2 rounded-2xl border border-blue-500/30">
                                <Text className="text-blue-400 text-sm font-bold">
                                    {`CRR ${score.crr || '0.00'}`}
                                </Text>
                            </View>
                            {score.target && (
                                <View className="bg-orange-500/20 px-5 py-2 rounded-2xl border border-orange-500/30">
                                    <Text className="text-orange-400 text-sm font-bold">
                                        {`RRR ${score.rrr}`}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="h-[1px] bg-white/5 w-full mb-6" />

                        <View className="flex-row items-center justify-around">
                            <View className="items-center">
                                <Text className="text-white font-bold text-lg">{battingTeamName}</Text>
                                <Text className="text-gray-500 text-[10px] uppercase font-bold">Batting</Text>
                            </View>
                            <Text className="text-gray-700 text-xl font-bold italic">VS</Text>
                            <View className="items-center">
                                <Text className="text-gray-400 font-bold text-lg">{bowlingTeamName}</Text>
                                <Text className="text-gray-500 text-[10px] uppercase font-bold">Bowling</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Sections */}
                    <View className="flex-row space-x-4 mb-6" style={{ gap: 10 }}>
                        <View className="flex-1 bg-[#111827] rounded-3xl p-5 border border-white/5">
                            <Text className="text-gray-500 text-[10px] uppercase font-bold mb-4 tracking-tighter">On Strike</Text>
                            <Text className="text-white text-base font-bold mb-1 truncate">{striker?.name || '-'}</Text>
                            <View className="flex-row items-end">
                                <Text className="text-green-500 text-2xl font-bold">{striker?.runs || 0}</Text>
                                <Text className="text-gray-500 text-xs mb-1 ml-1">({striker?.balls || 0})</Text>
                            </View>
                        </View>

                        <View className="flex-1 bg-[#111827] rounded-3xl p-5 border border-white/5">
                            <Text className="text-gray-500 text-[10px] uppercase font-bold mb-4 tracking-tighter">Non-Striker</Text>
                            <Text className="text-white text-base font-bold mb-1 truncate">{nonStriker?.name || '-'}</Text>
                            <View className="flex-row items-end">
                                <Text className="text-white text-2xl font-semibold">{nonStriker?.runs || 0}</Text>
                                <Text className="text-gray-500 text-xs mb-1 ml-1">({nonStriker?.balls || 0})</Text>
                            </View>
                        </View>
                    </View>

                    <View className="bg-[#111827] rounded-3xl p-6 border border-white/5 mb-10">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-gray-500 text-[10px] uppercase font-bold mb-1">Current Bowler</Text>
                                <Text className="text-blue-400 text-xl font-bold">{bowler?.name || '-'}</Text>
                                <View className="flex-row mt-2">
                                    <View className="bg-blue-500/10 px-2 py-0.5 rounded mr-2">
                                        <Text className="text-blue-500 text-[10px] font-bold">ECON {bowler?.economy || '0.00'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex-row space-x-4">
                                <View className="items-center mr-4">
                                    <Text className="text-gray-500 text-[10px] font-bold">OVERS</Text>
                                    <Text className="text-white text-lg font-bold">{bowler?.overs || '0.0'}</Text>
                                </View>
                                <View className="items-center mr-4">
                                    <Text className="text-gray-500 text-[10px] font-bold">RUNS</Text>
                                    <Text className="text-white text-lg font-bold">{bowler?.runs || '0'}</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-red-400 text-[10px] font-bold">WKTS</Text>
                                    <Text className="text-red-400 text-lg font-bold">{bowler?.wickets || '0'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Text className="text-gray-600 text-[10px] text-center mb-4">
                        Automatic updates every 20 seconds. Pull down to refresh.
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
};
