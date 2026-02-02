import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
    Modal,
    FlatList
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { BottomNavBar } from '../components/BottomNavBar';
import { API_BASE_URL } from '../constants/api';

interface Player {
    id: string;
    name: string;
    username?: string;
}

interface MemberChipProps {
    name: string;
    onRemove: () => void;
}

const MemberChip = ({ name, onRemove }: MemberChipProps) => (
    <View className="bg-[#5a7a5a] flex-row items-center px-3 py-1 rounded-full mr-2 mb-2">
        <Text className="text-white text-[10px] font-medium mr-1">{name}</Text>
        <TouchableOpacity onPress={onRemove}>
            <Ionicons name="close-circle" size={14} color="white" />
        </TouchableOpacity>
    </View>
);

export const CreateSquad = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'CreateSquad'>>();
    const { poolId } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [fetchingPool, setFetchingPool] = useState(false);
    const [poolMembers, setPoolMembers] = useState<Player[]>([]);
    const [poolName, setPoolName] = useState('Loading...');

    const [overs, setOvers] = useState('20');
    const [teamAName, setTeamAName] = useState('Covai Kings');
    const [teamBName, setTeamBName] = useState('Red Evils');

    const [teamACaptain, setTeamACaptain] = useState<Player | null>(null);
    const [teamBCaptain, setTeamBCaptain] = useState<Player | null>(null);

    const [teamAPlayers, setTeamAPlayers] = useState<Player[]>([]);
    const [teamBPlayers, setTeamBPlayers] = useState<Player[]>([]);

    const [selectorModalVisible, setSelectorModalVisible] = useState(false);
    const [selectorType, setSelectorType] = useState<'captainA' | 'captainB' | 'playersA' | 'playersB' | null>(null);

    useEffect(() => {
        if (poolId) {
            fetchPoolDetails();
        }
    }, [poolId]);

    const fetchPoolDetails = async () => {
        setFetchingPool(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/pools/${poolId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (response.ok && data.pool) {
                const members = data.pool.members.map((m: any) => ({
                    id: m.user?._id || m.user?.id || m.id,
                    name: m.user?.name || 'Unknown',
                    username: m.user?.username
                }));
                setPoolMembers(members);
                setPoolName(data.pool.name || 'Unknown Pool');
                // Set Team A default name to Pool Name if it's currently default
                if (teamAName === 'Covai Kings') {
                    setTeamAName(data.pool.name || 'Team A');
                }
            } else {
                Alert.alert("Error", data.message || "Failed to fetch pool details");
            }
        } catch (error) {
            console.error("Error fetching pool details:", error);
            Alert.alert("Error", "Could not connect to server");
        } finally {
            setFetchingPool(false);
        }
    };

    const handleCreateMatch = async () => {
        if (!overs || !teamACaptain || !teamBCaptain || teamAPlayers.length === 0 || teamBPlayers.length === 0) {
            Alert.alert("Error", "Please fill all details and select teams");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const payload = {
                overs: parseInt(overs),
                teamA: {
                    name: teamAName,
                    captainId: teamACaptain.id,
                    players: teamAPlayers.map(p => p.id)
                },
                teamB: {
                    name: teamBName,
                    captainId: teamBCaptain.id,
                    players: teamBPlayers.map(p => p.id)
                }
            };

            const response = await fetch(`${API_BASE_URL}/pools/${poolId}/matches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Match created successfully!");
                navigation.navigate('MatchSummary', { poolId, matchId: data.match.id || data.match._id });
            } else {
                Alert.alert("Error", data.message || "Failed to create match");
            }
        } catch (error) {
            console.error("Create Match Error:", error);
            Alert.alert("Error", "Something went wrong while creating match");
        } finally {
            setLoading(false);
        }
    };

    const openSelector = (type: 'captainA' | 'captainB' | 'playersA' | 'playersB') => {
        setSelectorType(type);
        setSelectorModalVisible(true);
    };

    const handleSelectPlayer = (player: Player) => {
        if (!selectorType) return;

        if (selectorType === 'captainA') {
            setTeamACaptain(player);
            if (!teamAPlayers.find(p => p.id === player.id)) {
                setTeamAPlayers([...teamAPlayers, player]);
            }
        } else if (selectorType === 'captainB') {
            setTeamBCaptain(player);
            if (!teamBPlayers.find(p => p.id === player.id)) {
                setTeamBPlayers([...teamBPlayers, player]);
            }
        } else if (selectorType === 'playersA') {
            if (!teamAPlayers.find(p => p.id === player.id)) {
                setTeamAPlayers([...teamAPlayers, player]);
            }
        } else if (selectorType === 'playersB') {
            if (!teamBPlayers.find(p => p.id === player.id)) {
                setTeamBPlayers([...teamBPlayers, player]);
            }
        }
        setSelectorModalVisible(false);
    };

    const getAvailablePlayers = () => {
        if (selectorType === 'captainA' || selectorType === 'playersA') {
            return poolMembers.filter(p => !teamBPlayers.find(tp => tp.id === p.id));
        } else if (selectorType === 'captainB' || selectorType === 'playersB') {
            return poolMembers.filter(p => !teamAPlayers.find(tp => tp.id === p.id));
        }
        return poolMembers;
    };

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
                {/* Team Card (Source Pool Info) - Fixed Name, No Edit */}
                <View className="bg-[#0f172a] border border-primary/40 rounded-3xl p-4 mb-6 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-14 h-14 bg-gray-300 rounded-full mr-4" />
                        <View>
                            <Text className="text-white text-lg font-bold">{poolName}</Text>
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons name="cricket" size={16} color="#22c55e" />
                                <Text className="text-primary text-xs ml-1">Cricket</Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <Text className="text-primary text-xs mr-3">{poolMembers.length} Members</Text>
                    </View>
                </View>

                {/* Squad Selection Container */}
                <View className="bg-[#d1d5db] rounded-[40px] p-6 mb-8">
                    <View className="mb-6">
                        <Text className="text-gray-800 text-lg font-bold mb-2">Overs</Text>
                        <TextInput
                            value={overs}
                            onChangeText={setOvers}
                            keyboardType="numeric"
                            className="bg-gray-400/50 h-12 rounded-2xl px-4 text-gray-800 font-bold"
                            placeholder="Enter overs"
                        />
                    </View>

                    <Text className="text-gray-800 text-lg font-bold mb-4">Select Your Squads</Text>

                    {/* Team A Section */}
                    <View className="mb-8">
                        <View className="flex-row items-center justify-center mb-4">
                            <TextInput
                                value={teamAName}
                                onChangeText={setTeamAName}
                                className="text-primary text-2xl font-bold text-center border-b border-primary/20 pb-1 min-w-[150px]"
                                placeholder="Team A Name"
                                placeholderTextColor="#22c55e"
                            />
                            <MaterialCommunityIcons name="pencil-outline" size={18} color="#22c55e" className="ml-2" />
                        </View>

                        <TouchableOpacity
                            onPress={() => openSelector('captainA')}
                            className="bg-gray-400/50 p-4 rounded-xl flex-row justify-between items-center mb-3"
                        >
                            <Text className="text-gray-600">
                                {teamACaptain ? `Captain: ${teamACaptain.name}` : "Select Your Team Captain"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#22c55e" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openSelector('playersA')}
                            className="bg-gray-400/50 p-4 rounded-xl flex-row justify-between items-center mb-3"
                        >
                            <Text className="text-gray-600">Select Your Team Members</Text>
                            <Ionicons name="chevron-down" size={20} color="#22c55e" />
                        </TouchableOpacity>

                        <View className="flex-row flex-wrap">
                            {teamAPlayers.map((player) => (
                                <MemberChip
                                    key={player.id}
                                    name={player.name}
                                    onRemove={() => {
                                        setTeamAPlayers(prev => prev.filter(p => p.id !== player.id));
                                        if (teamACaptain?.id === player.id) setTeamACaptain(null);
                                    }}
                                />
                            ))}
                        </View>
                        <View className="h-[1px] bg-gray-400 mt-4" />
                    </View>

                    {/* Team B Section */}
                    <View className="mb-4">
                        <View className="flex-row items-center justify-center mb-4">
                            <TextInput
                                value={teamBName}
                                onChangeText={setTeamBName}
                                className="text-primary text-2xl font-bold text-center border-b border-primary/20 pb-1 min-w-[150px]"
                                placeholder="Team B Name"
                                placeholderTextColor="#22c55e"
                            />
                            <MaterialCommunityIcons name="pencil-outline" size={18} color="#22c55e" className="ml-2" />
                        </View>

                        <TouchableOpacity
                            onPress={() => openSelector('captainB')}
                            className="bg-gray-400/50 p-4 rounded-xl flex-row justify-between items-center mb-3"
                        >
                            <Text className="text-gray-600">
                                {teamBCaptain ? `Captain: ${teamBCaptain.name}` : "Select Your Team Captain"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#22c55e" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openSelector('playersB')}
                            className="bg-gray-400/50 p-4 rounded-xl flex-row justify-between items-center mb-3"
                        >
                            <Text className="text-gray-600">Select Your Team Members</Text>
                            <Ionicons name="chevron-down" size={20} color="#22c55e" />
                        </TouchableOpacity>

                        <View className="flex-row flex-wrap">
                            {teamBPlayers.map((player) => (
                                <MemberChip
                                    key={player.id}
                                    name={player.name}
                                    onRemove={() => {
                                        setTeamBPlayers(prev => prev.filter(p => p.id !== player.id));
                                        if (teamBCaptain?.id === player.id) setTeamBCaptain(null);
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Create Match Button */}
                <TouchableOpacity
                    className="bg-primary flex-row items-center justify-center py-5 rounded-3xl mt-4"
                    onPress={handleCreateMatch}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white text-xl font-bold">Create Match</Text>
                            <Ionicons name="arrow-forward" size={24} color="white" className="ml-2" />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <Modal
                transparent={true}
                visible={selectorModalVisible}
                animationType="slide"
                onRequestClose={() => setSelectorModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-[40px] p-6 h-[60%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold">Select Player</Text>
                            <TouchableOpacity onPress={() => setSelectorModalVisible(false)}>
                                <Ionicons name="close" size={28} color="black" />
                            </TouchableOpacity>
                        </View>

                        {fetchingPool ? (
                            <ActivityIndicator size="large" color="#22c55e" />
                        ) : (
                            <FlatList
                                data={getAvailablePlayers()}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="py-4 border-b border-gray-100"
                                        onPress={() => handleSelectPlayer(item)}
                                    >
                                        <Text className="text-lg text-gray-800">{item.name}</Text>
                                        {item.username && <Text className="text-sm text-gray-400">@{item.username}</Text>}
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text className="text-center text-gray-500 mt-10">No players available</Text>
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>

            <BottomNavBar />
        </SafeAreaView>
    );
};
