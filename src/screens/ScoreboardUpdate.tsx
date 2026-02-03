import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Dimensions,
    Alert,
    Modal,
    FlatList,
    Share
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { BottomNavBar } from '../components/BottomNavBar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchLiveScoreRequest, fetchMatchDetailsRequest, recordBallRequest,
    undoBallRequest, endInningsRequest, selectNextBatterRequest, selectBowlerRequest
} from '../store/slices/matchSlice';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');

interface Player {
    _id: string;
    id?: string;
    name: string;
}

export default function ScoreboardUpdate() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const route = useRoute<RouteProp<RootStackParamList, 'ScoreboardUpdate'>>();
    const { matchId } = route.params || {};

    const { liveScore: matchData, currentMatch, loading, error } = useAppSelector(state => state.matches);
    const [refreshing, setRefreshing] = useState(false);

    // Ball Recording State
    const [selectedRuns, setSelectedRuns] = useState<number>(0);
    const [selectedExtra, setSelectedExtra] = useState<'WD' | 'NB' | null>(null); // WD, NB
    const [isWicket, setIsWicket] = useState(false);
    const [wicketType, setWicketType] = useState<string>('Bowled');

    // Next Batter State
    const [showNextBatterModal, setShowNextBatterModal] = useState(false);
    const [battingTeamPlayers, setBattingTeamPlayers] = useState<Player[]>([]);
    const [outPlayers, setOutPlayers] = useState<string[]>([]);

    // Bowler Switching State
    const [showBowlerModal, setShowBowlerModal] = useState(false);
    const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState<Player[]>([]);

    // Target & Match Info
    const [targetScore, setTargetScore] = useState<number | null>(null);
    const [totalOvers, setTotalOvers] = useState<number>(0);

    // Initial Load & Focus Refresh
    useEffect(() => {
        if (matchId) {
            dispatch(fetchLiveScoreRequest(matchId));
            dispatch(fetchMatchDetailsRequest(matchId));
        }
    }, [matchId, dispatch]);

    useFocusEffect(
        useCallback(() => {
            if (matchId) dispatch(fetchLiveScoreRequest(matchId));
        }, [matchId, dispatch])
    );

    useEffect(() => {
        if (error) {
            Alert.alert("Error", error);
        }
    }, [error]);

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

    const prevBallsRef = React.useRef(0);
    const hasWonRef = React.useRef(false);

    // Squad logic moved to an effect that watches currentMatch
    useEffect(() => {
        if (!currentMatch) return;

        // Determine which team is batting by comparing IDs robustly
        const liveBattingId = (matchData?.battingTeam?._id || matchData?.battingTeam?.id || matchData?.battingTeam ||
            currentMatch?.battingTeam?._id || currentMatch?.battingTeam?.id || currentMatch?.battingTeam)?.toString();

        const teamAId = (currentMatch?.teamA?._id || currentMatch?.teamA?.id || currentMatch?.teamA)?.toString();
        const teamBId = (currentMatch?.teamB?._id || currentMatch?.teamB?.id || currentMatch?.teamB)?.toString();

        let isTeamABatting = true; // Default

        if (liveBattingId && teamAId && teamBId) {
            if (liveBattingId === teamAId) {
                isTeamABatting = true;
            } else if (liveBattingId === teamBId) {
                isTeamABatting = false;
            }
        } else if (currentMatch?.currentInnings?.battingTeamId) {
            // Fallback to match innings info
            isTeamABatting = currentMatch.currentInnings.battingTeamId.toString() === teamAId;
        }

        if (isTeamABatting) {
            setBattingTeamPlayers(currentMatch.teamA?.players || []);
            setBowlingTeamPlayers(currentMatch.teamB?.players || []);
        } else {
            setBattingTeamPlayers(currentMatch.teamB?.players || []);
            setBowlingTeamPlayers(currentMatch.teamA?.players || []);
        }

        // Target & Overs
        setTargetScore(currentMatch.currentInnings?.target || currentMatch.targetScore || null);
        setTotalOvers(currentMatch.overs || 0);

        // Out Players
        const allWickets = currentMatch.wickets || [];
        const outPlayerIds = allWickets.map((w: any) => {
            if (typeof w.player === 'object') return (w.player._id || w.player.id || '').toString();
            return (w.player || '').toString();
        }).filter(Boolean);
        setOutPlayers(outPlayerIds);
    }, [currentMatch, matchData]);

    const handleRecordBall = () => {
        if (!matchId) return;

        const payload = {
            matchId,
            runs: selectedRuns,
            isWide: selectedExtra === 'WD',
            isNoBall: selectedExtra === 'NB',
            isWicket,
            outBatterId: isWicket ? (matchData?.striker?.id || matchData?.striker?._id) : undefined,
            wicketType: isWicket ? wicketType : undefined
        };

        dispatch(recordBallRequest(payload));

        // Reset Selection immediately for snappy feel
        setSelectedRuns(0);
        setSelectedExtra(null);
        setIsWicket(false);
        setWicketType('Bowled');

        if (isWicket) setShowNextBatterModal(true);
    };

    const handleUndo = () => {
        Alert.alert("Confirm Undo", "Undo last ball?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Undo",
                style: 'destructive',
                onPress: () => {
                    if (matchId) dispatch(undoBallRequest({ matchId }));
                }
            }
        ]);
    };

    const handleEndInnings = () => {
        Alert.alert("End Innings", "Are you sure you want to end the innings?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "End Innings",
                onPress: () => {
                    if (matchId) dispatch(endInningsRequest({ matchId }));

                    const cInnings = matchData?.currentInnings;
                    const inningNum = (typeof cInnings === 'object' && cInnings !== null) ? cInnings.number : cInnings;

                    if (inningNum == 1) {
                        navigation.navigate('SecondInningsSelection', { matchId });
                    } else {
                        Alert.alert("Match Finished", "Returning to Home Screen");
                        navigation.navigate('Home');
                    }
                }
            }
        ]);
    };

    const handleShareLiveScore = async () => {
        try {
            const liveUrl = `${API_BASE_URL}/public/matches/${matchId}/live`;
            const currentScore = `${score.runs}/${score.wickets}`;
            const ballsDerive = score.balls ? parseInt(score.balls.toString()) : convertOversToBalls(score.overs);
            const oversFormatted = formatOvers(ballsDerive);

            const deepLink = `turfbooking://live/${matchId}`;

            const message = `🏏 *LIVE MATCH UPDATE* 🏏\n\n` +
                `🔥 *${battingTeamName}* vs *${bowlingTeamName}*\n\n` +
                `📊 Score: *${currentScore}*\n` +
                `🥎 Overs: *${oversFormatted}*\n` +
                `📈 CRR: *${score.crr || '0.00'}*\n\n` +
                `-------------------------\n` +
                `👉 *Open in App (Best Experience):* \n` +
                `${deepLink}\n\n` +
                `🌐 *Live Data (JSON):* \n` +
                `${liveUrl}\n\n` +
                `Install the *TurfBooking* App to view our professional live scoreboard!`;

            const result = await Share.share({
                message,
                title: `${battingTeamName} vs ${bowlingTeamName} - Live Score`
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    const handleSelectBowler = (bowlerId: string) => {
        if (!matchId) return;
        dispatch(selectBowlerRequest({
            matchId,
            bowlerId: bowlerId.toString(),
            strikerId: (matchData?.striker?.id || matchData?.striker?._id || '').toString(),
            nonStrikerId: (matchData?.nonStriker?.id || matchData?.nonStriker?._id || '').toString()
        }));
        setShowBowlerModal(false);
    };

    const handleSelectNextBatter = (batterId: string) => {
        if (!matchId) return;
        dispatch(selectNextBatterRequest({
            matchId,
            batterId: batterId.toString()
        }));
        setShowNextBatterModal(false);
    };

    if (loading && !matchData) {
        return (
            <View className="flex-1 bg-[#0B121F] justify-center items-center">
                <ActivityIndicator size="large" color="#22C55E" />
            </View>
        );
    }

    const score = {
        runs: matchData?.score?.runs ?? matchData?.runs ?? 0,
        wickets: matchData?.score?.wickets ?? matchData?.wickets ?? 0,
        balls: matchData?.score?.balls ?? matchData?.balls ?? 0,
        overs: matchData?.score?.overs ?? matchData?.overs ?? 0,
        crr: matchData?.score?.crr ?? matchData?.crr ?? '0.00',
        rrr: matchData?.score?.requiredRunRate ?? matchData?.requiredRunRate ?? '0.00'
    };
    const battingTeamName = matchData?.battingTeam?.name ||
        (matchData?.battingTeam?.toString() === (currentMatch?.teamA?._id || currentMatch?.teamA?.id || currentMatch?.teamA)?.toString()
            ? currentMatch?.teamA?.name : currentMatch?.teamB?.name) ||
        matchData?.teamAName || "Batting Team";

    const bowlingTeamName = matchData?.bowlingTeam?.name ||
        (matchData?.bowlingTeam?.toString() === (currentMatch?.teamA?._id || currentMatch?.teamA?.id || currentMatch?.teamA)?.toString()
            ? currentMatch?.teamA?.name : currentMatch?.teamB?.name) ||
        matchData?.teamBName || "Bowling Team";

    const striker = matchData?.striker;
    const nonStriker = matchData?.nonStriker;
    const bowler = matchData?.bowler;

    return (
        <View className="flex-1 bg-[#0B121F]" style={{ paddingTop: insets.top }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Scoreboard</Text>
                    <TouchableOpacity onPress={handleEndInnings} className="bg-red-900/50 px-3 py-1 rounded-full border border-red-500">
                        <Text className="text-red-400 text-xs font-bold">End Innings</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>

                    {/* Score Card */}
                    <View className="bg-[#111827] rounded-[40px] p-6 mb-5 border-[1.5px] border-green-500/40">
                        <Text className="text-white text-5xl font-bold text-center mb-4">
                            {score.runs} / {score.wickets}
                        </Text>

                        <View className="flex-row justify-center space-x-3 mb-6">
                            <View className="bg-green-500/50 px-4 py-1 rounded-full">
                                <Text className="text-[#0B121F] text-[10px] font-bold">
                                    {`Over ${formatOvers(score.balls ? parseInt(score.balls.toString()) : convertOversToBalls(score.overs))}`}
                                </Text>
                            </View>
                            <View className="bg-green-500/50 px-4 py-1 rounded-full">
                                <Text className="text-[#0B121F] text-[10px] font-bold">
                                    {`CRR ${score.crr || '0.00'}`}
                                </Text>
                            </View>
                        </View>

                        <View className="h-[1.5px] bg-white/10 w-full mb-5" />

                        {targetScore !== null && targetScore > 0 && (
                            <View className="mb-5 items-center">
                                <View className="bg-orange-500/20 px-4 py-2 rounded-xl mb-2">
                                    <Text className="text-orange-400 font-bold text-sm">
                                        Target: {targetScore}
                                    </Text>
                                </View>
                                <Text className="text-white font-bold text-lg">
                                    Need <Text className="text-green-400">{Math.max(0, targetScore - (score.runs || 0))}</Text> runs in <Text className="text-green-400">{(totalOvers * 6) - (typeof score.balls === 'number' ? score.balls : convertOversToBalls(score.overs))}</Text> balls
                                </Text>
                                <View className="bg-blue-500/10 px-3 py-1 rounded-full mt-2">
                                    <Text className="text-blue-400 text-[10px] font-bold">RRR: {score.rrr}</Text>
                                </View>
                            </View>
                        )}

                        <View className="flex-row items-center justify-center">
                            <Text className="text-white text-lg font-bold">{battingTeamName}</Text>
                            <Text className="text-gray-500 mx-2">vs</Text>
                            <Text className="text-gray-400 text-sm font-medium">{bowlingTeamName}</Text>
                        </View>
                    </View>

                    {/* Batsmen */}
                    <View className="bg-[#111827] rounded-[40px] overflow-hidden mb-5 border-[1.5px] border-green-500/40">
                        <TouchableOpacity
                            onPress={() => setShowNextBatterModal(true)}
                            className="bg-green-500/20 p-5 flex-row justify-between items-center"
                        >
                            <View>
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name="cricket" size={20} color="#22C55E" />
                                    <Text className="text-white text-lg font-bold ml-2">{striker?.name || "Select Batter"}</Text>
                                    <Feather name="edit-2" size={12} color="#22C55E" style={{ marginLeft: 8 }} />
                                </View>
                                <Text className="text-[#22C55E] text-[10px] font-bold px-2 py-0.5 bg-green-900/50 rounded mt-1 self-start">STRIKER</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white text-xl font-bold">{striker?.runs || 0}</Text>
                                <Text className="text-white/60 text-xs">({striker?.balls || 0})</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowNextBatterModal(true)}
                            className="p-5 flex-row justify-between items-center"
                        >
                            <View>
                                <View className="flex-row items-center">
                                    <View className="w-2 h-2 rounded-full bg-white ml-1 mr-3" />
                                    <Text className="text-white text-lg font-bold">{nonStriker?.name || "Select Non-Striker"}</Text>
                                    <Feather name="edit-2" size={12} color="gray" style={{ marginLeft: 8 }} />
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-white text-xl font-bold">{nonStriker?.runs || 0}</Text>
                                <Text className="text-white/60 text-xs">({nonStriker?.balls || 0})</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-[#111827] rounded-[40px] p-6 mb-8 border-[1.5px] border-green-500/40">
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-white/60 text-[10px] uppercase font-bold mb-1">Current Bowler</Text>
                                <TouchableOpacity onPress={() => setShowBowlerModal(true)} className="flex-row items-center">
                                    <Text className="text-[#22C55E] text-lg font-bold mr-2">{bowler?.name || "Select Bowler"}</Text>
                                    <Feather name="edit-2" size={14} color="#22C55E" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text className="text-white/60 text-[10px] uppercase font-bold text-center">Overs</Text>
                                <Text className="text-white text-lg font-bold text-center">{bowler?.overs || 0}</Text>
                            </View>
                            <View>
                                <Text className="text-white/60 text-[10px] uppercase font-bold text-center">Runs</Text>
                                <Text className="text-white text-lg font-bold text-center">{bowler?.runs || 0}</Text>
                            </View>
                            <View>
                                <Text className="text-white/60 text-[10px] uppercase font-bold text-center">Wkts</Text>
                                <Text className="text-white text-lg font-bold text-center">{bowler?.wickets || 0}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Keypad */}
                    <Text className="text-white text-xl font-bold mb-4">Update Score</Text>
                    <View className="flex-row justify-between mb-6 flex-wrap">
                        {[0, 1, 2, 3, 4, 6].map((run) => (
                            <TouchableOpacity
                                key={run}
                                onPress={() => setSelectedRuns(run)}
                                className={`w-12 h-12 rounded-full items-center justify-center border ${selectedRuns === run
                                    ? 'bg-green-600 border-green-400'
                                    : 'bg-transparent border-green-500/40'
                                    }`}
                            >
                                <Text className="text-white text-xl font-bold text-center leading-[0px]">{run}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="flex-row items-center mb-8" style={{ gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => setSelectedExtra(selectedExtra === 'WD' ? null : 'WD')}
                            className={`flex-1 py-4 rounded-2xl items-center justify-center border ${selectedExtra === 'WD' ? 'bg-orange-600 border-orange-400' : 'bg-transparent border-green-500/40'
                                }`}
                        >
                            <Text className="text-white font-bold text-lg">WD</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setSelectedExtra(selectedExtra === 'NB' ? null : 'NB')}
                            className={`flex-1 py-4 rounded-2xl items-center justify-center border ${selectedExtra === 'NB' ? 'bg-orange-600 border-orange-400' : 'bg-transparent border-green-500/40'
                                }`}
                        >
                            <Text className="text-white font-bold text-lg">NB</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setIsWicket(!isWicket)}
                            className={`flex-1 py-4 rounded-2xl items-center justify-center border ${isWicket ? 'bg-red-600 border-red-400' : 'bg-[#4B2C33] border-red-900'
                                }`}
                        >
                            <Text className={`${isWicket ? 'text-white' : 'text-red-400'} font-bold text-lg`}>OUT</Text>
                        </TouchableOpacity>
                    </View>

                    {isWicket && (
                        <View className="mb-8">
                            <Text className="text-white text-lg font-bold mb-4">Wicket Type</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped'].map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => setWicketType(type)}
                                        className={`px-6 py-3 rounded-full mr-3 border ${wicketType === type ? 'bg-red-600 border-red-400' : 'bg-gray-800 border-gray-700'
                                            }`}
                                    >
                                        <Text className="text-white font-bold">{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleRecordBall}
                        className="bg-green-600 py-5 rounded-[30px] items-center mb-6 shadow-lg shadow-green-500/50"
                    >
                        <Text className="text-white text-xl font-bold">Record Ball</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-between mb-8" style={{ gap: 15 }}>
                        <TouchableOpacity onPress={handleUndo} className="flex-1 bg-gray-800 py-4 rounded-2xl flex-row items-center justify-center border border-gray-700">
                            <Ionicons name="trash-outline" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Undo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShareLiveScore} className="flex-1 bg-gray-800 py-4 rounded-2xl flex-row items-center justify-center border border-gray-700">
                            <Ionicons name="share-social-outline" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Share</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <BottomNavBar />
            </View>

            {/* Next Batter Modal */}
            <Modal visible={showNextBatterModal} animationType="slide" transparent={true}>
                <View className="flex-1 bg-black/80 justify-end">
                    <View className="bg-[#111827] rounded-t-[40px] p-6 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-2xl font-bold">Select Next Batter</Text>
                            <TouchableOpacity onPress={() => setShowNextBatterModal(false)} className="p-2">
                                <Ionicons name="close" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={battingTeamPlayers.filter(p => !outPlayers.includes((p._id || p.id || '').toString()))}
                            keyExtractor={(item) => (item._id || item.id || '').toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectNextBatter((item._id || item.id || '').toString())}
                                    className="bg-gray-800 p-5 rounded-2xl mb-3 flex-row items-center justify-between border border-gray-700"
                                >
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 rounded-full bg-green-500/20 items-center justify-center mr-4">
                                            <Text className="text-green-500 font-bold">{item.name.charAt(0)}</Text>
                                        </View>
                                        <Text className="text-white text-lg font-bold">{item.name}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="gray" />
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text className="text-gray-500 text-center py-10">All players are out!</Text>}
                        />
                    </View>
                </View>
            </Modal>

            {/* Bowler Modal */}
            <Modal visible={showBowlerModal} animationType="slide" transparent={true}>
                <View className="flex-1 bg-black/80 justify-end">
                    <View className="bg-[#111827] rounded-t-[40px] p-6 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-2xl font-bold">Select Bowler</Text>
                            <TouchableOpacity onPress={() => setShowBowlerModal(false)} className="p-2">
                                <Ionicons name="close" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={bowlingTeamPlayers}
                            keyExtractor={(item) => (item._id || item.id || '').toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectBowler((item._id || item.id || '').toString())}
                                    className="bg-gray-800 p-5 rounded-2xl mb-3 flex-row items-center justify-between border border-gray-700"
                                >
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center mr-4">
                                            <Text className="text-blue-500 font-bold">{item.name.charAt(0)}</Text>
                                        </View>
                                        <Text className="text-white text-lg font-bold">{item.name}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="gray" />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
