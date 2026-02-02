import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Dimensions,
    Alert,
    Modal,
    FlatList,
    Share
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { BottomNavBar } from '../components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

const { width } = Dimensions.get('window');

interface Player {
    _id: string;
    id?: string;
    name: string;
}

export default function ScoreboardUpdate() {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'ScoreboardUpdate'>>();
    const { matchId } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [matchData, setMatchData] = useState<any>(null);

    // Ball Recording State
    const [selectedRuns, setSelectedRuns] = useState<number>(0);
    const [selectedExtra, setSelectedExtra] = useState<'WD' | 'NB' | null>(null); // WD, NB
    const [isWicket, setIsWicket] = useState(false);
    const [wicketType, setWicketType] = useState<string>('Bowled');

    // Next Batter State
    const [showNextBatterModal, setShowNextBatterModal] = useState(false);
    const [battingTeamPlayers, setBattingTeamPlayers] = useState<Player[]>([]);
    const [outPlayers, setOutPlayers] = useState<string[]>([]);
    const [loadingNextBatter, setLoadingNextBatter] = useState(false);

    // Bowler Switching State
    const [showBowlerModal, setShowBowlerModal] = useState(false);
    const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState<Player[]>([]);
    const [loadingNewBowler, setLoadingNewBowler] = useState(false);

    // Target & Match Info
    const [targetScore, setTargetScore] = useState<number | null>(null);
    const [totalOvers, setTotalOvers] = useState<number>(0);

    // Fetch Live Score
    const fetchLiveScore = useCallback(async () => {
        if (!matchId) {
            console.warn("fetchLiveScore: matchId is missing");
            setLoading(false);
            return;
        }
        try {
            const url = `${API_BASE_URL}/public/matches/${matchId}/live`;
            const response = await fetch(url);
            const contentType = response.headers.get('content-type');

            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error(`Non-JSON response from ${url}:`, text);
                throw new Error("Server returned non-json response");
            }

            if (response.ok) {
                setMatchData(data);

                // Debug: Log key data points
                console.log('=== LIVE SCORE DATA ===');
                console.log('Striker:', JSON.stringify(data.striker, null, 2));
                console.log('NonStriker:', JSON.stringify(data.nonStriker, null, 2));
                console.log('Bowler:', JSON.stringify(data.bowler, null, 2));

                // Note: We rely on useEffect monitoring matchData to fetch full squad details
                await fetchFullMatchDetails(data);
            } else {
                console.error("Live Score Error:", data);
            }
        } catch (error) {
            console.error("Fetch Live Score Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingNextBatter(false); // Ensure loading states are reset
            setLoadingNewBowler(false);
        }
    }, [matchId]);

    // Initial Load & Focus Refresh
    useFocusEffect(
        useCallback(() => {
            fetchLiveScore();
        }, [fetchLiveScore])
    );

    // Helper to format overs (e.g., 65 balls -> 10.5)
    const formatOvers = (balls: number) => {
        if (!balls) return "0.0";
        const overs = Math.floor(balls / 6);
        const ballsInOver = balls % 6;
        return `${overs}.${ballsInOver}`;
    };

    // Helper to convert overs (e.g., 1.2) to balls (e.g., 8)
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

    // Monitor Score for Events (Win / Over Complete)
    useEffect(() => {
        if (!matchData?.score) return;

        const score = matchData.score;
        // Robust ball count: use score.balls if valid, else derive from score.overs
        const currentBalls = score.balls || convertOversToBalls(score.overs);
        const currentRuns = score.runs || 0;

        // 1. Check Win Condition
        if (targetScore && targetScore > 0 && !hasWonRef.current) {
            if (currentRuns >= targetScore) {
                hasWonRef.current = true;
                const winnerName = matchData?.battingTeam?.name || "Batting Team";
                Alert.alert("🎉 MATCH ENDED 🎉", `${winnerName} Won the Match!`, [
                    { text: "OK" }
                ]);
                return;
            }
        }

        // 2. Check Over Completion & Max Overs
        const maxBalls = totalOvers * 6;

        // Ensure we only trigger on ball increment
        if (currentBalls > 0 && currentBalls > prevBallsRef.current) {
            const isOverComplete = currentBalls % 6 === 0;
            const isMaxOversReached = maxBalls > 0 && currentBalls >= maxBalls;

            if (isMaxOversReached) {
                const inningsVal = matchData?.currentInnings;
                const currentInningsNum = (typeof inningsVal === 'object' && inningsVal !== null) ? inningsVal.number : (inningsVal || 1);

                if (currentInningsNum == 1) {
                    Alert.alert("Innings Completed", "First innings is over. End innings to proceed.", [{ text: "OK" }]);
                } else {
                    // 2nd Innings Ends (Results)
                    if (!hasWonRef.current) {
                        hasWonRef.current = true;
                        // If target exists and we are here, runs < target
                        const defTeamName = matchData?.bowlingTeam?.name || "Fielding Team";
                        const margin = (targetScore || 0) - currentRuns - 1;

                        let msg = "Match Ended.";
                        if (targetScore && margin >= 0) {
                            if (margin === 0 && currentRuns === (targetScore - 1)) {
                                msg = "Match Tied!";
                            } else {
                                msg = `${defTeamName} Won by ${margin} runs!`;
                            }
                        }
                        Alert.alert("🎉 MATCH ENDED 🎉", msg, [{ text: "OK" }]);
                    }
                }

            } else if (isOverComplete) {
                Alert.alert("Over Completed", `End of Over ${currentBalls / 6}`);
            }
        }

        prevBallsRef.current = currentBalls;

    }, [matchData?.score, targetScore, totalOvers, matchData?.currentInnings]);

    // --- Actions ---

    const handleRecordBall = async () => {
        setRefreshing(true);
        try {
            const token = await AsyncStorage.getItem('userToken');

            // Calculate runs and extras
            let runs = selectedRuns;
            let extras = 0;
            let isWide = false;
            let isNoBall = false;

            if (selectedExtra === 'WD') {
                isWide = true;
                extras = 0; // Backend adds the 1-run penalty automatically
            } else if (selectedExtra === 'NB') {
                isNoBall = true;
                extras = 0; // Backend adds the 1-run penalty automatically
            }

            const payload = {
                runs: runs,
                extras: extras,
                isWide: isWide,
                isNoBall: isNoBall,
                isWicket: isWicket,
                outBatterId: isWicket ? (matchData?.striker?.id || matchData?.striker?._id) : undefined,
                wicketType: isWicket ? wicketType : undefined
            };

            console.log("Recording Ball:", JSON.stringify(payload));

            const url = `${API_BASE_URL}/matches/${matchId}/ball`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error(`Non-JSON response from ${url}:`, text.substring(0, 200));
                throw new Error("Server returned non-json response");
            }

            if (response.ok) {
                // Reset Selection
                setSelectedRuns(0);
                setSelectedExtra(null);
                setIsWicket(false);
                setWicketType('Bowled');

                // Refresh Data
                await fetchLiveScore();

                // If Wicket, check if we need to show Next Batter Modal
                if (isWicket && !data.matchFinished) {
                    setShowNextBatterModal(true);
                    // fetchFullMatchDetails() handled by fetchLiveScore
                }
            } else {
                Alert.alert("Error", data.message || "Failed to record ball");
            }
        } catch (error) {
            Alert.alert("Error", "Network error recording ball");
        } finally {
            setRefreshing(false);
        }
    };

    const handleUndo = async () => {
        Alert.alert("Confirm Undo", "Undo last ball?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Undo",
                style: 'destructive',
                onPress: async () => {
                    setRefreshing(true);
                    try {
                        const token = await AsyncStorage.getItem('userToken');
                        const url = `${API_BASE_URL}/matches/${matchId}/ball/undo`;
                        const response = await fetch(url, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        const contentType = response.headers.get('content-type');
                        let data;
                        if (contentType && contentType.includes('application/json')) {
                            data = await response.json();
                        } else {
                            const text = await response.text();
                            console.error(`Non-JSON response from ${url}:`, text.substring(0, 200));
                            data = { message: "Server returned non-json response" };
                        }

                        if (response.ok) {
                            // Reset scoring UI states
                            setSelectedRuns(0);
                            setSelectedExtra(null);
                            setIsWicket(false);
                            setWicketType('Bowled');

                            await fetchLiveScore();
                            Alert.alert("Success", "Last ball undone");
                        } else {
                            Alert.alert("Error", data.message || "Failed to undo ball");
                        }
                    } catch (e) {
                        console.error(e);
                        Alert.alert("Error", "Network error while undoing ball");
                    }
                    finally { setRefreshing(false); }
                }
            }
        ]);
    };

    const handleEndInnings = async () => {
        Alert.alert("End Innings", "Are you sure you want to end the innings?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "End Innings",
                onPress: async () => {
                    setRefreshing(true);
                    try {
                        const token = await AsyncStorage.getItem('userToken');
                        const url = `${API_BASE_URL}/matches/${matchId}/innings/end`;
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        const contentType = response.headers.get('content-type');
                        let data;
                        if (contentType && contentType.includes('application/json')) {
                            data = await response.json();
                        } else {
                            const text = await response.text();
                            console.error(`Non-JSON response from ${url}:`, text.substring(0, 200));
                            data = { message: "Server returned non-json response" };
                        }

                        if (response.ok) {
                            Alert.alert("Success", "Innings Ended successfully!");

                            // Check if we should move to 2nd innings selection
                            const cInnings = matchData?.currentInnings;
                            const inningNum = (typeof cInnings === 'object' && cInnings !== null) ? cInnings.number : cInnings;

                            if (inningNum == 1) {
                                navigation.navigate('SecondInningsSelection', { matchId });
                            } else {
                                // Match Finished
                                Alert.alert("Match Finished", "Returning to Home Screen");
                                navigation.navigate('Home');
                            }
                        } else {
                            Alert.alert("Error", data.message || "Failed to end innings");
                        }
                    } catch (e) {
                        console.error(e);
                        Alert.alert("Error", "Network error ending innings");
                    }
                    finally { setRefreshing(false); }
                }
            }
        ]);
    };

    const handleShareLiveScore = async () => {
        try {
            const liveUrl = `${API_BASE_URL}/public/matches/${matchId}/live`;
            const result = await Share.share({
                message: `Check out the live score of the match: ${battingTeamName} vs ${bowlingTeamName}!\n\nLive Link: ${liveUrl}`,
                url: liveUrl, // For iOS
                title: 'Live Match Score'
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    // Need full match details for Player List (Squad) because Live API might only return current players
    const fetchFullMatchDetails = async (liveData?: any) => {
        if (!matchId) return;
        try {
            const token = await AsyncStorage.getItem('userToken');
            const url = `${API_BASE_URL}/matches/${matchId}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error(`Non-JSON response from ${url}:`, text.substring(0, 200));
                return;
            }

            if (response.ok && data.match) {
                // Determine which team is batting
                let isTeamABatting = false;

                // Use fresh liveData if available, otherwise fallback to state
                const currentMatchData = liveData || matchData;

                const strikerId = currentMatchData?.striker?.id || currentMatchData?.striker?._id;
                const strikerName = currentMatchData?.striker?.name?.toLowerCase();

                // Method 1: Check by Name (Most reliable for UI consistency)
                const liveBattingName = (currentMatchData?.battingTeam?.name || currentMatchData?.teamAName)?.toLowerCase();
                const squadAName = data.match.teamA.name?.toLowerCase();
                const squadBName = data.match.teamB.name?.toLowerCase();

                if (liveBattingName && squadAName && liveBattingName === squadAName) {
                    isTeamABatting = true;
                } else if (liveBattingName && squadBName && liveBattingName === squadBName) {
                    isTeamABatting = false;
                }
                // Method 2: Check Striker ID
                else if (strikerId) {
                    isTeamABatting = data.match.teamA.players.some((p: any) => (
                        p._id?.toString() === strikerId?.toString() ||
                        p.id?.toString() === strikerId?.toString() ||
                        (strikerName && p.name?.toLowerCase() === strikerName)
                    ));
                }
                // Method 3: Fallback to Innings/Toss logic
                else {
                    const inningsVal = currentMatchData?.currentInnings;
                    const currentInnings = (typeof inningsVal === 'object' && inningsVal !== null)
                        ? (inningsVal.number || 1)
                        : parseInt(inningsVal?.toString() || "1");

                    const checkBattingTeamId = (typeof inningsVal === 'object' && inningsVal !== null)
                        ? inningsVal.battingTeamId
                        : null;

                    if (checkBattingTeamId) {
                        const teamAId = data.match.teamA._id || data.match.teamA.id;
                        const teamBId = data.match.teamB._id || data.match.teamB.id;

                        const checkIdStr = checkBattingTeamId.toString();

                        if (teamAId && checkIdStr === teamAId.toString()) isTeamABatting = true;
                        else if (teamBId && checkIdStr === teamBId.toString()) isTeamABatting = false;
                    } else {
                        // Old logic fallback
                        const tossWinnerRaw = data.match.tossWinner;
                        const tossWinnerId = tossWinnerRaw?._id || tossWinnerRaw?.id || tossWinnerRaw;
                        const tossDecision = data.match.tossDecision?.toUpperCase();
                        const teamAId = data.match.teamA._id || data.match.teamA.id;

                        const didTeamAWinToss = (
                            tossWinnerId?.toString() === teamAId?.toString()
                        );

                        if (currentInnings === 1) {
                            if (didTeamAWinToss) {
                                isTeamABatting = (tossDecision === 'BAT');
                            } else {
                                isTeamABatting = (tossDecision === 'BOWL');
                            }
                        } else {
                            if (didTeamAWinToss) {
                                isTeamABatting = (tossDecision === 'BOWL');
                            } else {
                                isTeamABatting = (tossDecision === 'BAT');
                            }
                        }
                    }
                }

                console.log(`Squad Update: Striker=${strikerId}, TeamA=${isTeamABatting}`);

                if (isTeamABatting) {
                    setBattingTeamPlayers(data.match.teamA.players);
                    setBowlingTeamPlayers(data.match.teamB.players);
                } else {
                    setBattingTeamPlayers(data.match.teamB.players);
                    setBowlingTeamPlayers(data.match.teamA.players);
                }

                // Set Target & Overs for Equation
                if (data.match.currentInnings?.target) {
                    setTargetScore(data.match.currentInnings.target);
                } else if (data.match.targetScore) { // Fallback if at root
                    setTargetScore(data.match.targetScore);
                }

                if (data.match.overs) {
                    setTotalOvers(data.match.overs);
                }
            }
        } catch (e) { console.error("Fetch Details Error", e); }
    };

    const handleSelectBowler = async (bowlerId: string) => {
        setLoadingNewBowler(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/matches/${matchId}/lineup`, {
                method: 'POST', // Re-using lineup API to set/switch bowler as requested
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bowlerId })
            });

            if (response.ok) {
                setShowBowlerModal(false);
                fetchLiveScore(); // Refresh score to update current bowler
            } else {
                const d = await response.json();
                Alert.alert("Error", d.message || "Failed to set bowler");
            }
        } catch (e) {
            Alert.alert("Error", "Network error");
        } finally {
            setLoadingNewBowler(false);
        }
    };

    const handleSelectNextBatter = async (batterId: string) => {
        setLoadingNextBatter(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/matches/${matchId}/next-batter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ batterId })
            });

            if (response.ok) {
                setShowNextBatterModal(false);
                fetchLiveScore();
            } else {
                const d = await response.json();
                Alert.alert("Error", d.message || "Failed to set batter");
            }
        } catch (e) {
            Alert.alert("Error", "Network error");
        } finally {
            setLoadingNextBatter(false);
        }
    };

    // --- UI Renderers ---

    if (loading) {
        return (
            <View className="flex-1 bg-[#0B121F] justify-center items-center">
                <ActivityIndicator size="large" color="#22C55E" />
            </View>
        );
    }

    // Safe Accessors
    const score = matchData?.score || { runs: 0, wickets: 0, balls: 0 };
    const battingTeamName = matchData?.battingTeam?.name || matchData?.teamAName;
    const bowlingTeamName = matchData?.bowlingTeam?.name || matchData?.teamBName;

    const striker = matchData?.striker;
    const nonStriker = matchData?.nonStriker;
    const bowler = matchData?.bowler;

    return (
        <View className="flex-1 bg-[#0B121F]">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">
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

                {/* Over & Win Popups */}
                {/* Logic handled in useEffect, using Alerts for now */}

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

                        {/* Target & Equation (Only 2nd Innings) */}
                        {targetScore !== null && targetScore > 0 && (
                            <View className="mb-5 items-center">
                                <View className="bg-orange-500/20 px-4 py-2 rounded-xl mb-2">
                                    <Text className="text-orange-400 font-bold text-sm">
                                        Target: {targetScore}
                                    </Text>
                                </View>
                                <Text className="text-white font-bold text-lg">
                                    Need <Text className="text-green-400">{Math.max(0, targetScore - (score.runs || 0))}</Text> runs in <Text className="text-green-400">{(totalOvers * 6) - (score.balls || convertOversToBalls(score.overs) || 0)}</Text> balls
                                </Text>
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
                        {/* Striker */}
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

                        {/* Non-Striker */}
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

                    {/* Runs Row */}
                    <View className="flex-row justify-between mb-4 flex-wrap gap-2">
                        {[0, 1, 2, 3, 4, 6].map((run) => (
                            <TouchableOpacity
                                key={run}
                                onPress={() => setSelectedRuns(run)}
                                className={`w-[14%] aspect-square rounded-full items-center justify-center border ${selectedRuns === run
                                    ? 'bg-green-600 border-green-400'
                                    : 'bg-transparent border-green-500/40'
                                    }`}
                            >
                                <Text className="text-white text-xl font-bold">{run}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Extras & Wicket Row */}
                    <View className="flex-row justify-between mb-8 space-x-3">
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

                    {/* Wicket Type Selector (Visible only when OUT is selected) */}
                    {isWicket && (
                        <View className="mb-6">
                            <Text className="text-white/60 text-xs font-bold mb-3 uppercase tracking-wider">Dismissal Type</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {['Bowled', 'Caught', 'Run Out', 'LBW', 'Stumped', 'Hit Wicket'].map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => setWicketType(type)}
                                        className={`px-4 py-2 rounded-full mr-3 border ${wicketType === type ? 'bg-red-600 border-red-400' : 'bg-gray-800 border-gray-600'
                                            }`}
                                    >
                                        <Text className={`font-bold ${wicketType === type ? 'text-white' : 'text-gray-400'}`}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View className="flex-row space-x-4 mb-4">
                        <TouchableOpacity
                            onPress={handleUndo}
                            className="flex-1 py-4 rounded-3xl border border-gray-600 bg-gray-800 items-center"
                        >
                            <Text className="text-gray-300 font-bold">Undo Last</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleRecordBall}
                            disabled={refreshing}
                            className={`flex-[2] py-4 rounded-3xl items-center shadow-lg ${refreshing ? 'bg-green-800' : 'bg-[#22C55E]'
                                }`}
                        >
                            {refreshing ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-xl font-bold">
                                    {isWicket ? 'Record WICKET' : 'Update Score'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handleShareLiveScore}
                        className="flex-row justify-center items-center mt-4 opacity-70"
                    >
                        <Feather name="share" size={16} color="#22C55E" />
                        <Text className="text-[#22C55E] ml-2 font-medium">Share Live Score Link</Text>
                    </TouchableOpacity>

                </ScrollView>

                {/* Next Batter Modal */}
                <Modal
                    visible={showNextBatterModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => { }} // Force selection
                >
                    <View className="flex-1 bg-black/80 justify-end">
                        <View className="bg-[#1e293b] h-[70%] rounded-t-3xl overflow-hidden">
                            <View className="p-6 border-b border-gray-700 bg-[#0f172a] flex-row justify-between items-center">
                                <View>
                                    <Text className="text-white text-xl font-bold">Select Batter</Text>
                                    <Text className="text-gray-400 text-sm mt-1">
                                        {battingTeamName ? `From ${battingTeamName}` : 'Choose next batsman'}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowNextBatterModal(false)}>
                                    <Ionicons name="close-circle" size={28} color="gray" />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={battingTeamPlayers.filter(p => {
                                    const pid = p._id || p.id;
                                    const isStriker = pid === (striker?.id || striker?._id);
                                    const isNonStriker = pid === (nonStriker?.id || nonStriker?._id);
                                    const isOut = outPlayers.includes(pid?.toString() || "");
                                    return !isStriker && !isNonStriker && !isOut;
                                })}
                                keyExtractor={(item) => item._id || item.id || Math.random().toString()}
                                contentContainerStyle={{ padding: 20 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelectNextBatter(item._id || item.id!)}
                                        className="flex-row items-center p-4 mb-3 bg-[#111827] rounded-xl border border-gray-700"
                                    >
                                        <View className="w-10 h-10 rounded-full bg-green-900 justify-center items-center mr-4">
                                            <Text className="text-green-400 font-bold">{item.name.charAt(0)}</Text>
                                        </View>
                                        <Text className="text-white text-lg font-semibold">{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View className="p-10 items-center">
                                        {loadingNextBatter ? <ActivityIndicator /> : <Text className="text-gray-500">No players found</Text>}
                                    </View>
                                }
                            />
                        </View>
                    </View>
                </Modal>

                {/* Bowler Selection Modal */}
                <Modal
                    visible={showBowlerModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowBowlerModal(false)}
                >
                    <View className="flex-1 bg-black/80 justify-end">
                        <View className="bg-[#1e293b] h-[70%] rounded-t-3xl overflow-hidden">
                            <View className="p-6 border-b border-gray-700 bg-[#0f172a] flex-row justify-between items-center">
                                <View>
                                    <Text className="text-white text-xl font-bold">Select New Bowler</Text>
                                    <Text className="text-gray-400 text-sm mt-1">
                                        {bowlingTeamName ? `From ${bowlingTeamName}` : 'Tap to switch bowler'}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowBowlerModal(false)}>
                                    <Ionicons name="close-circle" size={28} color="gray" />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={bowlingTeamPlayers}
                                keyExtractor={(item) => item._id || item.id || Math.random().toString()}
                                contentContainerStyle={{ padding: 20 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelectBowler(item._id || item.id!)}
                                        className={`flex-row items-center p-4 mb-3 rounded-xl border ${item.name === bowler?.name ? 'bg-green-900/40 border-green-500' : 'bg-[#111827] border-gray-700'}`}
                                        disabled={item.name === bowler?.name}
                                    >
                                        <View className="w-10 h-10 rounded-full bg-blue-900 justify-center items-center mr-4">
                                            <Text className="text-blue-400 font-bold">{item.name.charAt(0)}</Text>
                                        </View>
                                        <Text className={`text-lg font-semibold ${item.name === bowler?.name ? 'text-green-400' : 'text-white'}`}>
                                            {item.name} {item.name === bowler?.name ? '(Current)' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View className="p-10 items-center">
                                        <Text className="text-gray-500">No players found</Text>
                                    </View>
                                }
                            />
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
            <BottomNavBar />
        </View>
    );
}
