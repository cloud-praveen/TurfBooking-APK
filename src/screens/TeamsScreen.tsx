import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomNavBar } from '../components/BottomNavBar';
import { API_BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Alert } from 'react-native';

interface Pool {
    id: string;
    name: string;
    sportType: string;
    memberCount: number;
    isOwner: boolean;
    myRole: string;
    managedByYou: boolean;
    image?: string;
}

export const TeamsScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<'active' | 'invites'>('active');
    const [teams, setTeams] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/pools/mine`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            const data = await response.json();
            console.log("Teams API Response:", data);

            if (response.ok) {
                setTeams(data.pools || []);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch teams");
            }
        } catch (error) {
            console.error("API Error fetching teams:", error);
            // Alert.alert("Error", "Something went wrong while fetching teams");
        } finally {
            setLoading(false);
        }
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
                <View className="w-7" /> {/* Placeholder for balance */}
            </View>

            <View className="flex-1 px-5">
                {/* Tabs */}
                <View className="flex-row bg-[#1e293b] rounded-full p-1 mb-8">
                    <TouchableOpacity
                        onPress={() => setActiveTab('active')}
                        className={`flex-1 py-3 rounded-full items-center ${activeTab === 'active' ? 'bg-[#3d5a45]' : ''}`}
                    >
                        <Text className={`font-bold ${activeTab === 'active' ? 'text-white' : 'text-gray-400'}`}>Active Teams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Invites')}
                        className={`flex-1 py-3 rounded-full items-center flex-row justify-center ${activeTab === 'invites' ? 'bg-[#3d5a45]' : ''}`}
                    >
                        <Text className={`font-bold ${activeTab === 'invites' ? 'text-white' : 'text-gray-400'}`}>Invites</Text>
                        <View className="ml-2 bg-primary px-1.5 rounded-full">
                            <Text className="text-white text-xs font-bold">6</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Create New Team Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateTeam')}
                    className="bg-primary flex-row items-center justify-center py-4 rounded-2xl mb-8"
                >
                    <Ionicons name="add" size={28} color="white" />
                    <Text className="text-white text-lg font-bold ml-2">Create New Team</Text>
                </TouchableOpacity>

                {/* List Section */}
                <View className="mb-4">
                    <Text className="text-white text-lg font-bold">Captain <Text className="text-primary text-xs font-normal">(Managed by you)</Text></Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    {loading ? (
                        <View className="py-10">
                            <ActivityIndicator size="large" color="#22c55e" />
                        </View>
                    ) : teams.length > 0 ? (
                        teams.map((team) => (
                            <TouchableOpacity
                                key={team.id}
                                className="bg-[#0f172a] border-2 border-primary/40 rounded-[40px] p-6 mb-6 flex-row items-center"
                                onPress={() => navigation.navigate('AddTeamMembers', { poolId: team.id })}
                            >
                                <View className="w-16 h-16 bg-gray-300 rounded-full items-center justify-center mr-5">
                                    {team.image ? (
                                        <Image source={{ uri: team.image }} className="w-full h-full rounded-full" />
                                    ) : null}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white text-xl font-bold">{team.name}</Text>
                                    <View className="flex-row items-center mt-2 justify-between">
                                        <View className="flex-row items-center">
                                            <MaterialCommunityIcons
                                                name={team.sportType.toLowerCase().includes('cricket') ? 'cricket' : 'soccer'}
                                                size={18}
                                                color="#22c55e"
                                            />
                                            <Text className="text-primary text-sm ml-1.5">{team.sportType}</Text>
                                        </View>
                                        <Text className="text-primary text-sm font-medium">Total Members : {team.memberCount}</Text>
                                    </View>
                                </View>
                                <View className="ml-4">
                                    <Ionicons name="chevron-forward" size={24} color="#22c55e" strokeWidth={4} />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View className="py-10 items-center">
                            <Text className="text-gray-500 italic">No teams found. Create one to get started!</Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            <BottomNavBar />
        </SafeAreaView>
    );
};
