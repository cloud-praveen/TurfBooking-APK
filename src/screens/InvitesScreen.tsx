import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomNavBar } from '../components/BottomNavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchInvitesRequest, acceptInviteRequest, declineInviteRequest } from '../store/slices/teamSlice';

export const InvitesScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    const { invites, loading, error } = useAppSelector(state => state.teams);
    const [activeTab, setActiveTab] = useState<'active' | 'invites'>('invites');

    useEffect(() => {
        dispatch(fetchInvitesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            Alert.alert("Error", error);
        }
    }, [error]);

    const handleAccept = (inviteId: string) => {
        dispatch(acceptInviteRequest(inviteId));
    };

    const handleDecline = (inviteId: string) => {
        dispatch(declineInviteRequest(inviteId));
    };

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

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
        </View>
    );
};
