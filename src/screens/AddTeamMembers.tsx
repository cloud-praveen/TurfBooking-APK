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
    Alert
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { BottomNavBar } from '../components/BottomNavBar';
import { API_BASE_URL } from '../constants/api';

interface User {
    id: string;
    name: string;
    username: string;
    status?: 'add' | 'invited' | 'remove';
}

export const AddTeamMembers = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RootStackParamList, 'AddTeamMembers'>>();
    const { poolId } = route.params || {};

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [poolData, setPoolData] = useState<any>(null);
    const [fetchingPool, setFetchingPool] = useState(false);

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
            console.log("Pool Details API Response:", data);

            if (response.ok) {
                setPoolData(data.pool);
            }
        } catch (error) {
            console.error("Error fetching pool details:", error);
        } finally {
            setFetchingPool(false);
        }
    };

    const handleInvite = async (userId: string) => {
        if (!poolId) return;
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/pools/${poolId}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ invitedUserId: userId }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Invitation sent successfully!");
                fetchPoolDetails(); // Refresh list to show as invited
                setSearchQuery('');
                setSearchResults([]);
            } else {
                Alert.alert("Error", data.message || "Failed to send invitation");
            }
        } catch (error) {
            console.error("Invite API Error:", error);
            Alert.alert("Error", "Something went wrong while sending invitation");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                performSearch(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const performSearch = async (query: string) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log("Searching for:", query);

            const response = await fetch(`${API_BASE_URL}/pools/users/search?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            console.log("Search API Response:", data);

            if (response.ok && data.users) {
                const users = data.users.map((user: any) => ({
                    id: user.id || user._id,
                    name: user.name || 'Unknown',
                    username: user.username || `@${(user.name || 'user').toLowerCase().replace(/\s/g, '_')}`,
                    status: 'add'
                }));
                setSearchResults(users);
            } else {
                console.error("Search API Error Response:", data);
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Search API Error:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };



    const renderUserItem = (user: User) => (
        <View
            key={user.id}
            className="bg-[#0f172a] border border-[#22c55e]/30 rounded-[40px] p-4 mb-4 flex-row items-center justify-between"
        >
            <View className="flex-row items-center flex-1">
                <View className="w-14 h-14 bg-gray-300 rounded-full mr-4" />
                <View>
                    <Text className="text-white font-bold text-lg">{user.name}</Text>
                    <Text className="text-gray-500 text-xs">{user.username || `@${user.name.toLowerCase().replace(/\s/g, '_')}`}</Text>
                </View>
            </View>

            {user.status === 'add' && (
                <TouchableOpacity
                    className="bg-[#1e293b] px-6 py-2 rounded-2xl border border-[#22c55e]/30"
                    onPress={() => handleInvite(user.id)}
                >
                    <Text className="text-[#22c55e] font-bold text-sm">Add</Text>
                </TouchableOpacity>
            )}

            {user.status === 'invited' && (
                <View className="bg-[#1e293b] px-6 py-2 rounded-2xl border border-[#22c55e]/30">
                    <Text className="text-[#22c55e] font-bold text-sm">Invited</Text>
                </View>
            )}

            {user.status === 'remove' && (
                <TouchableOpacity className="bg-[#1e293b] px-6 py-2 rounded-2xl border border-[#22c55e]/30">
                    <Text className="text-[#a3e635] font-bold text-sm">Remove</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Add Team Members</Text>
                <View className="w-7" />
            </View>

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Search Bar */}
                <View className="bg-[#0f172a] border border-primary/40 rounded-full px-5 py-3 flex-row items-center mb-6">
                    <Feather name="search" size={20} color="#94a3b8" />
                    <TextInput
                        placeholder="Name,Username,or email"
                        placeholderTextColor="#475569"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 text-white ml-3 text-sm"
                    />
                </View>

                {/* Search Results Section */}
                {searchQuery.length > 0 ? (
                    <View className="mb-6">
                        <Text className="text-white text-base font-bold mb-4">Search Results</Text>
                        {loading ? (
                            <View className="flex-row items-center">
                                <ActivityIndicator size="small" color="#22c55e" />
                                <Text className="text-gray-400 text-sm italic ml-2">Searching...</Text>
                            </View>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(renderUserItem)
                        ) : searchQuery.length >= 2 ? (
                            <Text className="text-gray-400 text-sm">No users found</Text>
                        ) : null}
                        <View className="h-[1px] bg-gray-800/50 my-4" />
                    </View>
                ) : null}



                {/* Invited Users Section */}
                <Text className="text-white text-base font-bold mb-4 mt-2">Invited Users</Text>
                {poolData?.invites?.map((invite: any) => renderUserItem({
                    id: invite.id,
                    name: invite.invitedUser?.name || invite.user?.name || 'Unknown',
                    username: invite.invitedUser?.username || invite.user?.username || '',
                    status: 'invited'
                }))}

                {/* Current Members Section */}
                <Text className="text-white text-base font-bold mb-4 mt-2">Current Members ({poolData?.memberCount || 0})</Text>
                {poolData?.members?.map((member: any) => renderUserItem({
                    id: member.id,
                    name: member.user?.name || 'Unknown',
                    username: member.user?.username || '',
                    status: 'remove'
                }))}

                {/* Create Match Button */}
                <TouchableOpacity
                    className="bg-[#22c55e] flex-row items-center justify-center py-5 rounded-[30px] mt-8"
                    onPress={() => {
                        navigation.navigate('CreateSquad', { poolId });
                    }}
                >
                    <Text className="text-white text-xl font-bold">Create Match</Text>
                    <Ionicons name="arrow-forward" size={24} color="white" className="ml-2" />
                </TouchableOpacity>
            </ScrollView>

            <BottomNavBar />
        </SafeAreaView>
    );
};
