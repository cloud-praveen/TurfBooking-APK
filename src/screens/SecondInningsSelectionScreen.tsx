import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    ActivityIndicator,
    Modal,
    FlatList
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

interface Player {
    _id: string;
    id?: string;
    name: string;
}

interface Team {
    _id: string;
    id?: string;
    name: string;
    players: Player[];
    captain: Player;
}

interface MatchData {
    id: string;
    teamA: Team;
    teamB: Team;
    overs: number;
    tossWinner: any;
    tossDecision: string;
    currentInnings?: any;
}

export const SecondInningsSelectionScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'SecondInningsSelection'>>();
    const { matchId } = route.params;

    const [loading, setLoading] = useState(true);
    const [matchData, setMatchData] = useState<MatchData | null>(null);

    // Selection State
    const [striker, setStriker] = useState<Player | null>(null);
    const [nonStriker, setNonStriker] = useState<Player | null>(null);
    const [openingBowler, setOpeningBowler] = useState<Player | null>(null);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerType, setPickerType] = useState<'striker' | 'nonStriker' | 'bowler' | null>(null);

    useEffect(() => {
        fetchMatchDetails();
    }, [matchId]);

    const fetchMatchDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (response.ok) {
                setMatchData(data.match);
            } else {
                Alert.alert("Error", "Failed to fetch match details");
                navigation.goBack();
            }
        } catch (error) {
            console.error("Fetch Match Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Determine teams for 2nd innings
    const getTeams = () => {
        if (!matchData) return { battingTeam: null, bowlingTeam: null };

        // Method 1: Use explicit currentInnings data if available
        if (matchData.currentInnings && typeof matchData.currentInnings === 'object') {
            const { battingTeamId, bowlingTeamId } = matchData.currentInnings;

            let battingTeam = null;
            let bowlingTeam = null;

            const tA = matchData.teamA;
            const tB = matchData.teamB;
            const tAId = tA._id || tA.id;
            const tBId = tB._id || tB.id;

            if (battingTeamId) {
                const bTeamIdStr = battingTeamId.toString();
                if (tAId?.toString() === bTeamIdStr) battingTeam = tA;
                else if (tBId?.toString() === bTeamIdStr) battingTeam = tB;
            }

            if (bowlingTeamId) {
                const bowTeamIdStr = bowlingTeamId.toString();
                if (tAId?.toString() === bowTeamIdStr) bowlingTeam = tA;
                else if (tBId?.toString() === bowTeamIdStr) bowlingTeam = tB;
            }

            if (battingTeam && bowlingTeam) {
                return { battingTeam, bowlingTeam };
            }
        }

        // Method 2: Fallback logic based on Toss
        const tossWinnerId = matchData.tossWinner?._id || matchData.tossWinner?.id || matchData.tossWinner;
        const teamAId = matchData.teamA?._id || matchData.teamA?.id;
        const tossDecision = matchData.tossDecision || '';
        const didTeamAWinToss = tossWinnerId && teamAId && (tossWinnerId.toString() === teamAId.toString());

        let firstInningsBattingTeam;
        if (didTeamAWinToss) {
            firstInningsBattingTeam = tossDecision.toUpperCase() === 'BAT' ? matchData.teamA : matchData.teamB;
        } else {
            firstInningsBattingTeam = tossDecision.toUpperCase() === 'BAT' ? matchData.teamB : matchData.teamA;
        }

        // For Second Innings, it's the reverse
        const firstInningsBattingTeamId = firstInningsBattingTeam?._id || firstInningsBattingTeam?.id;
        if (firstInningsBattingTeamId && teamAId && firstInningsBattingTeamId.toString() === teamAId.toString()) {
            // Team A batted first, so Team B bats second
            return { battingTeam: matchData.teamB, bowlingTeam: matchData.teamA };
        } else {
            return { battingTeam: matchData.teamA, bowlingTeam: matchData.teamB };
        }
    };

    const { battingTeam, bowlingTeam } = getTeams();

    const handleSelectPlayer = (player: Player) => {
        if (pickerType === 'striker') setStriker(player);
        if (pickerType === 'nonStriker') setNonStriker(player);
        if (pickerType === 'bowler') setOpeningBowler(player);
        setModalVisible(false);
    };

    const getAvailablePlayersForPicker = () => {
        if (!matchData || !battingTeam || !bowlingTeam) return [];
        if (pickerType === 'striker' || pickerType === 'nonStriker') {
            return battingTeam.players.filter(p => {
                const pId = p._id || p.id;
                const otherId = pickerType === 'striker'
                    ? (nonStriker?._id || nonStriker?.id)
                    : (striker?._id || striker?.id);

                // If no other player selected, show all available
                if (!otherId) return true;

                // Exclude the other selected player
                return pId?.toString() !== otherId?.toString();
            });
        }
        if (pickerType === 'bowler') {
            return bowlingTeam.players;
        }
        return [];
    };

    const handleStartSecondInnings = async () => {
        if (!striker || !nonStriker || !openingBowler) {
            Alert.alert("Incomplete", "Please complete all selections to start the second innings");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const payload = {
                strikerId: striker._id || striker.id,
                nonStrikerId: nonStriker._id || nonStriker.id,
                bowlerId: openingBowler._id || openingBowler.id
            };

            const response = await fetch(`${API_BASE_URL}/matches/${matchId}/lineup`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to set second innings lineup");
            }

            Alert.alert("Success", "Second Innings Started!");
            navigation.navigate('ScoreboardUpdate', { matchId });

        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !matchData) {
        return (
            <SafeAreaView className="flex-1 bg-[#0f172a] justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#0f172a]">
            <StatusBar barStyle="light-content" />

            <View className="flex-row items-center justify-between px-5 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Start Second Inning</Text>
                <View className="w-7" />
            </View>

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="bg-[#1e293b] rounded-3xl p-6 mb-6 border border-gray-700 items-center">
                    <MaterialCommunityIcons name="cricket" size={48} color="#22c55e" />
                    <Text className="text-white text-2xl font-bold mt-4 text-center">Second Innings</Text>
                    <Text className="text-gray-400 text-center mt-2">Set your opening batters and bowler</Text>
                </View>

                <View className="space-y-6">
                    <View>
                        <Text className="text-[#22c55e] font-bold mb-3 ml-1 text-lg">
                            Opening Batters
                            <Text className="text-gray-400 text-sm font-normal">{` (${battingTeam?.name || ''})`}</Text>
                        </Text>
                        <View className="bg-[#1e293b] rounded-3xl p-2 border border-gray-700">
                            <TouchableOpacity
                                onPress={() => { setPickerType('striker'); setModalVisible(true); }}
                                className="p-4 border-b border-gray-700 flex-row justify-between items-center"
                            >
                                <View>
                                    <Text className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Striker</Text>
                                    <Text className={`text-lg font-bold ${striker ? 'text-white' : 'text-gray-500'}`}>
                                        {striker?.name || 'Select Striker'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="gray" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { setPickerType('nonStriker'); setModalVisible(true); }}
                                className="p-4 flex-row justify-between items-center"
                            >
                                <View>
                                    <Text className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Non-Striker</Text>
                                    <Text className={`text-lg font-bold ${nonStriker ? 'text-white' : 'text-gray-500'}`}>
                                        {nonStriker?.name || 'Select Non-Striker'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text className="text-[#22c55e] font-bold mb-3 ml-1 text-lg">
                            Opening Bowler
                            <Text className="text-gray-400 text-sm font-normal">{` (${bowlingTeam?.name || ''})`}</Text>
                        </Text>
                        <View className="bg-[#1e293b] rounded-3xl p-2 border border-gray-700">
                            <TouchableOpacity
                                onPress={() => { setPickerType('bowler'); setModalVisible(true); }}
                                className="p-4 flex-row justify-between items-center"
                            >
                                <View>
                                    <Text className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Bowler</Text>
                                    <Text className={`text-lg font-bold ${openingBowler ? 'text-white' : 'text-gray-500'}`}>
                                        {openingBowler?.name || 'Select Bowler'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleStartSecondInnings}
                        className={`py-5 rounded-3xl flex-row justify-center items-center mt-6 mb-10 ${(striker && nonStriker && openingBowler) ? 'bg-[#22c55e]' : 'bg-gray-800'}`}
                    >
                        <Text className={`text-xl font-bold ${(striker && nonStriker && openingBowler) ? 'text-white' : 'text-gray-500'}`}>Start Second Inning</Text>
                        <Ionicons name="play" size={24} color={(striker && nonStriker && openingBowler) ? 'white' : 'gray'} style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/80">
                    <View className="bg-[#1e293b] rounded-t-[30px] h-[70%] overflow-hidden border-t border-gray-700">
                        <View className="bg-[#0f172a] p-5 flex-row justify-between items-center border-b border-gray-800">
                            <Text className="text-xl font-bold text-white">
                                Select {pickerType === 'striker' ? 'Striker' : pickerType === 'nonStriker' ? 'Non-Striker' : 'Bowler'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-800 p-2 rounded-full">
                                <Ionicons name="close" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={getAvailablePlayersForPicker()}
                            keyExtractor={item => item._id || item.id || Math.random().toString()}
                            contentContainerStyle={{ padding: 20 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectPlayer(item)}
                                    className="py-5 border-b border-gray-700/50 flex-row items-center"
                                >
                                    <View className="w-12 h-12 bg-gray-700 rounded-full mr-4 justify-center items-center border border-gray-600">
                                        <Text className="font-bold text-gray-300 text-lg">{item.name.charAt(0)}</Text>
                                    </View>
                                    <Text className="text-lg text-white font-medium">{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
