import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomNavBar } from '../components/BottomNavBar';
import { API_BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Invite {
    inviteId: string;
    poolName: string;
    sportType: string;
    invitedByName: string;
}

export const InvitesScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<'active' | 'invites'>('invites');
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvites();
    }, []);

    const fetchInvites = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/pools/invites`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            const data = await response.json();
            console.log("Invites API Response:", data);

            if (response.ok) {
                setInvites(data.invites || []);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch invites");
            }
        } catch (error) {
            console.error("API Error fetching invites:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (inviteId: string) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/pools/invites/${inviteId}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Invite accepted! You are now a member of the team.");
                fetchInvites();
            } else {
                Alert.alert("Error", data.message || "Failed to accept invite");
            }
        } catch (error) {
            console.error("Error accepting invite:", error);
            Alert.alert("Error", "Something went wrong while accepting the invite");
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async (inviteId: string) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/pools/invites/${inviteId}/decline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Invite declined.");
                fetchInvites();
            } else {
                Alert.alert("Error", data.message || "Failed to decline invite");
            }
        } catch (error) {
            console.error("Error declining invite:", error);
            Alert.alert("Error", "Something went wrong while declining the invite");
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
                <View className="w-7" />
            </View>

            <View className="flex-1 px-5">
                {/* Tabs */}
                <View className="flex-row bg-[#1e293b] rounded-full p-1 mb-8">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Teams')}
                        className={`flex-1 py-3 rounded-full items-center ${activeTab === 'active' ? 'bg-[#3d5a45]' : ''}`}
                    >
                        <Text className={`font-bold ${activeTab === 'active' ? 'text-white' : 'text-gray-400'}`}>Active Teams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { }}
                        className={`flex-1 py-3 rounded-full items-center flex-row justify-center ${activeTab === 'invites' ? 'bg-[#3d5a45]' : ''}`}
                    >
                        <Text className={`font-bold ${activeTab === 'invites' ? 'text-white' : 'text-gray-400'}`}>Invites</Text>
                        {invites.length > 0 && (
                            <View className="ml-2 bg-primary px-1.5 rounded-full">
                                <Text className="text-white text-xs font-bold">{invites.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Section Title */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-white text-lg font-bold">Pending Invites</Text>
                    <TouchableOpacity>
                        <Text className="text-primary text-sm font-bold">View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Invites List */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    {loading ? (
                        <View className="py-10">
                            <ActivityIndicator size="large" color="#22c55e" />
                        </View>
                    ) : invites.length > 0 ? (
                        invites.map((invite) => (
                            <View
                                key={invite.inviteId}
                                className="bg-[#0f172a] border-2 border-primary/40 rounded-[40px] p-6 mb-6 flex-row items-center"
                            >
                                <View className="w-16 h-16 bg-gray-300 rounded-full mr-5" />
                                <View className="flex-1">
                                    <Text className="text-white text-xl font-bold">{invite.poolName}</Text>
                                    <Text className="text-[#22c55e] text-sm mt-1">Invited by {invite.invitedByName}</Text>
                                </View>

                                <View className="flex-row space-x-3">
                                    <TouchableOpacity
                                        onPress={() => handleDecline(invite.inviteId)}
                                        className="bg-[#1e293b] w-12 h-12 rounded-full items-center justify-center border border-red-500/20"
                                    >
                                        <Ionicons name="close" size={26} color="#ef4444" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleAccept(invite.inviteId)}
                                        className="bg-primary w-12 h-12 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="checkmark" size={26} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="py-10 items-center">
                            <Text className="text-gray-500 italic">No pending invites</Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            <BottomNavBar />
        </SafeAreaView>
    );
};
