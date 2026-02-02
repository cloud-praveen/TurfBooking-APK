import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert,
    Image,
    ActivityIndicator,
    Modal,
    FlatList,
    Animated,
    Easing
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

interface Player {
    _id: string; // API usually returns _id
    id?: string;
    name: string;
}

interface Team {
    _id: string;
    name: string;
    players: Player[];
    captain: Player;
}

interface MatchData {
    id: string;
    teamA: Team;
    teamB: Team;
    overs: number;
}

export const TossSelectionScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'TossSelection'>>();
    const { matchId } = route.params;

    const [loading, setLoading] = useState(true);
    const [matchData, setMatchData] = useState<MatchData | null>(null);

    // Toss State
    const [tossWinner, setTossWinner] = useState<'teamA' | 'teamB' | null>(null);
    const [tossDecision, setTossDecision] = useState<'bat' | 'bowl' | null>(null);
    const [coinSide, setCoinSide] = useState<'heads' | 'tails' | null>(null);

    // Animation State
    const spinValue = useRef(new Animated.Value(0)).current;
    const [isFlipping, setIsFlipping] = useState(false);

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
                console.log('=== MATCH DATA FETCHED ===');
                console.log('Match Data:', JSON.stringify(data.match, null, 2));
                console.log('Team A ID:', data.match?.teamA?._id || data.match?.teamA?.id);
                console.log('Team B ID:', data.match?.teamB?._id || data.match?.teamB?.id);
                console.log('=========================');
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

    const spinCoin = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        setTossWinner(null);
        setTossDecision(null);
        setCoinSide(null);

        // Calculate random results
        const resultSide = Math.random() > 0.5 ? 'heads' : 'tails';
        const winner = Math.random() > 0.5 ? 'teamA' : 'teamB';

        // Spin animation
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 2500, // Slightly longer for anticipation
            useNativeDriver: true,
            easing: Easing.out(Easing.bounce) // Bounce effect for landing
        }).start(() => {
            setCoinSide(resultSide);
            setTossWinner(winner);
            setIsFlipping(false);
            spinValue.setValue(0);
        });
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '2160deg'] // 6 full rotations
    });

    // Validated State helpers
    const battingTeam = tossWinner && tossDecision ? (
        tossWinner === 'teamA' ? (tossDecision === 'bat' ? matchData?.teamA : matchData?.teamB) :
            (tossDecision === 'bat' ? matchData?.teamB : matchData?.teamA)
    ) : null;

    const bowlingTeam = tossWinner && tossDecision ? (
        tossWinner === 'teamA' ? (tossDecision === 'bat' ? matchData?.teamB : matchData?.teamA) :
            (tossDecision === 'bat' ? matchData?.teamA : matchData?.teamB)
    ) : null;

    const handleSelectPlayer = (player: Player) => {
        if (pickerType === 'striker') setStriker(player);
        if (pickerType === 'nonStriker') setNonStriker(player);
        if (pickerType === 'bowler') setOpeningBowler(player);
        setModalVisible(false);
    };

    const getAvailablePlayersForPicker = () => {
        if (!matchData || !battingTeam || !bowlingTeam) return [];
        if (pickerType === 'striker' || pickerType === 'nonStriker') {
            return battingTeam.players.filter(p =>
                (pickerType === 'striker' ? p.id !== nonStriker?.id : p.id !== striker?.id)
            );
        }
        if (pickerType === 'bowler') {
            return bowlingTeam.players;
        }
        return [];
    };

    const handleStartMatch = async () => {
        if (!tossWinner || !tossDecision || !striker || !nonStriker || !openingBowler) {
            Alert.alert("Incomplete", "Please complete all selections to start the match");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            // Determine actual Team ID based on 'teamA' or 'teamB' selection
            const teamObj = tossWinner === 'teamA' ? matchData?.teamA : matchData?.teamB;

            // Extract Team ID - supporting both _id and id fields
            const tossWinnerId = teamObj?._id || teamObj?.id;

            // Validate Team ID before API call
            if (!tossWinnerId) {
                console.error("CRITICAL ERROR: Team ID missing for", tossWinner);
                Alert.alert("Error", "Could not determine the winning team's ID. Please try the toss again.");
                setLoading(false);
                return;
            }

            // Prepare Payload
            const payload = {
                tossWinnerId: tossWinnerId,
                tossDecision: tossDecision.toUpperCase(),
                strikerId: striker._id || striker.id,
                nonStrikerId: nonStriker._id || nonStriker.id,
                bowlerId: openingBowler._id || openingBowler.id
            };

            console.log('=== STARTING MATCH (COMBINED API) ===');
            console.log('Endpoint:', `${API_BASE_URL}/matches/${matchId}/start`);
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(`${API_BASE_URL}/matches/${matchId}/start`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            // Parse response safely
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Non-JSON Response:", text);
                throw new Error(`Server Error: ${response.status}`);
            }

            if (!response.ok) {
                console.error("=== START MATCH API ERROR ===");
                console.error("Status:", response.status);
                console.error("Body:", data);

                // Allow proceeding if match is already started (idempotency check)
                if (response.status === 400 && data.error === "Match not eligible to start") {
                    console.warn("⚠️ Match already started. Proceeding to scoreboard...");
                    navigation.navigate('ScoreboardUpdate', { matchId });
                    return;
                }

                throw new Error(data.message || data.error || "Failed to start match");
            }

            console.log("Match started successfully!");
            // Success - Navigate
            navigation.navigate('ScoreboardUpdate', { matchId });

        } catch (error: any) {
            console.error("Start Match Error:", error);
            Alert.alert("Error", error.message || "Failed to initiate match");
        } finally {
            setLoading(false);
        }
    };

    const renderCoin = () => {
        // High-quality Indian Coin Images
        const HEADS_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/600px-Emblem_of_India.svg.png";
        const TAILS_URL = "https://en.numista.com/catalogue/photos/inde/5e9b_1.jpg"; // Lotus Flower Coin

        if (isFlipping) {
            // Blurred/Spinning visual
            return (
                <View className="w-40 h-40 rounded-full bg-yellow-500 border-4 border-yellow-300 shadow-xl items-center justify-center overflow-hidden">
                    <View className="w-full h-full bg-yellow-400 opacity-50 absolute" />
                    <MaterialCommunityIcons name="loading" size={60} color="#854d0e" />

                </View>
            );
        }

        if (coinSide === 'heads') {
            return (
                <View className="w-40 h-40 rounded-full bg-gray-200 border-4 border-gray-300 shadow-xl items-center justify-center overflow-hidden bg-white">
                    <Image
                        source={{ uri: HEADS_URL }}
                        className="w-28 h-28 object-contain"
                        resizeMode="contain"
                    />
                    <Text className="text-[10px] font-bold text-gray-400 absolute bottom-4">HEADS</Text>
                </View>
            );
        }

        if (coinSide === 'tails') {
            return (
                <View className="w-40 h-40 rounded-full bg-gray-200 border-4 border-gray-300 shadow-xl items-center justify-center overflow-hidden bg-white">
                    <Image
                        source={{ uri: TAILS_URL }}
                        className="w-full h-full object-cover"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/10 items-center justify-end pb-4">
                        <Text className="text-[10px] font-bold text-white shadow-md">TAILS</Text>
                    </View>
                </View>
            );
        }

        // Default / Start State (Show Heads by default or generic coin)
        return (
            <View className="w-40 h-40 rounded-full bg-gray-200 border-4 border-gray-300 shadow-xl items-center justify-center overflow-hidden bg-white">
                <Image
                    source={{ uri: HEADS_URL }}
                    className="w-28 h-28 object-contain opacity-80"
                    resizeMode="contain"
                />
                <Text className="text-xs font-bold text-gray-400 absolute bottom-6">TAP TO FLIP</Text>
            </View>
        );
    };

    if (loading || !matchData) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#22c55e" />
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
                <Text className="text-white text-xl font-bold">Toss & Selection</Text>
                <View className="w-7" />
            </View>

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Toss Section */}
                <View className="bg-[#1e293b] rounded-3xl p-6 mb-6 border border-gray-700 items-center min-h-[350px] justify-center">
                    <Text className="text-white text-lg font-bold mb-8 text-center uppercase tracking-widest text-primary">
                        {isFlipping ? 'Spinning...' : coinSide ? `It's ${coinSide.toUpperCase()}!` : 'Indian Coin Toss'}
                    </Text>

                    <TouchableOpacity onPress={spinCoin} activeOpacity={0.8} disabled={isFlipping}>
                        <Animated.View style={{ transform: [{ rotateY: spin }] }}>
                            {renderCoin()}
                        </Animated.View>
                    </TouchableOpacity>

                    {coinSide && !isFlipping && (
                        <View className="items-center w-full mt-6">

                            <Text className="text-gray-400 text-sm mb-1 uppercase">Toss Won By</Text>
                            <Text className="text-[#22c55e] text-3xl font-black mb-8 text-center shadow-lg">
                                {tossWinner === 'teamA' ? matchData?.teamA.name : matchData?.teamB.name}
                            </Text>

                            <Text className="text-white text-lg font-bold mb-4">Elected to?</Text>
                            <View className="flex-row justify-center space-x-4 w-full">
                                <TouchableOpacity
                                    onPress={() => setTossDecision('bat')}
                                    className={`flex-1 py-4 rounded-2xl flex-row justify-center items-center border ${tossDecision === 'bat' ? 'bg-primary border-primary' : 'bg-[#0f172a] border-gray-600'}`}
                                >
                                    <MaterialCommunityIcons name="cricket" size={24} color={tossDecision === 'bat' ? 'white' : 'gray'} />
                                    <Text className={`font-bold ml-2 text-lg ${tossDecision === 'bat' ? 'text-white' : 'text-gray-400'}`}>Bat</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setTossDecision('bowl')}
                                    className={`flex-1 py-4 rounded-2xl flex-row justify-center items-center border ${tossDecision === 'bowl' ? 'bg-primary border-primary' : 'bg-[#0f172a] border-gray-600'}`}
                                >
                                    <MaterialCommunityIcons name="tennis-ball" size={24} color={tossDecision === 'bowl' ? 'white' : 'gray'} />
                                    <Text className={`font-bold ml-2 text-lg ${tossDecision === 'bowl' ? 'text-white' : 'text-gray-400'}`}>Bowl</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={() => { setTossWinner(null); setTossDecision(null); setCoinSide(null); }}
                                className="mt-8"
                            >
                                <Text className="text-gray-500 text-xs underline">Restart Toss</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>


                {/* Player Selection Section */}
                {tossWinner && tossDecision ? (
                    <View className="space-y-6">
                        {/* Batting Team Selection */}
                        <View>
                            <Text className="text-[#22c55e] font-bold mb-3 ml-1 text-lg">
                                Opening Batters
                                <Text className="text-gray-400 text-sm font-normal"> ({battingTeam?.name})</Text>
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

                        {/* Bowling Team Selection */}
                        <View>
                            <Text className="text-[#22c55e] font-bold mb-3 ml-1 text-lg">
                                Opening Bowler
                                <Text className="text-gray-400 text-sm font-normal"> ({bowlingTeam?.name})</Text>
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

                        {/* Start Button */}
                        <TouchableOpacity
                            onPress={handleStartMatch}
                            className={`py-5 rounded-3xl flex-row justify-center items-center mt-6 mb-10 ${(striker && nonStriker && openingBowler) ? 'bg-[#22c55e]' : 'bg-gray-800'
                                }`}
                        >
                            <Text className={`text-xl font-bold ${(striker && nonStriker && openingBowler) ? 'text-white' : 'text-gray-500'
                                }`}>Start Game</Text>
                            <Ionicons name="play" size={24} color={(striker && nonStriker && openingBowler) ? 'white' : 'gray'} className="ml-2" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="items-center justify-center p-10 opacity-30 mt-10">
                        <MaterialCommunityIcons name="cricket" size={80} color="gray" />
                        <Text className="text-gray-400 mt-4 text-center font-bold">Complete the Toss above to unlock squad selection</Text>
                    </View>
                )}
            </ScrollView>

            {/* Player Picker Modal */}
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
                            keyExtractor={item => item.id || item._id}
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
                            ListEmptyComponent={
                                <Text className="text-center text-gray-500 mt-20 text-lg">No players available</Text>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
