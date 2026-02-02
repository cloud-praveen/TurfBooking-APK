import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView,
    StatusBar,
    Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomNavBar } from '../components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../constants/api';

const SPORTS = ['Cricket', 'Soccer', 'Badminton', 'Tennis', 'Basketball', 'Kabaddi'];

export const CreateTeam = () => {
    const navigation = useNavigation<any>();
    const [teamName, setTeamName] = useState('');
    const [sport, setSport] = useState('Cricket');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sportModalVisible, setSportModalVisible] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleCreateTeam = async () => {
        if (!teamName.trim()) {
            Alert.alert("Error", "Please enter a team name");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_BASE_URL}/pools`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    poolName: teamName,
                    sportType: sport,
                    image: image || "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Team created successfully:", data);
                navigation.navigate('AddTeamMembers', { poolId: data.id });
            } else {
                Alert.alert("Error", data.message || "Failed to create team");
            }
        } catch (error) {
            console.error("API Error creating team:", error);
            Alert.alert("Error", "Something went wrong while creating the team");
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
                <Text className="text-white text-xl font-bold">Create New Team</Text>
                <View className="w-7" />
            </View>

            <ScrollView className="flex-1 px-5 pt-8" contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Logo Upload Section */}
                <View className="items-center mb-10">
                    <TouchableOpacity className="relative" onPress={pickImage}>
                        <View className="w-32 h-32 rounded-full border-2 border-dashed border-gray-500 items-center justify-center overflow-hidden">
                            {image ? (
                                <Image source={{ uri: image }} className="w-full h-full" />
                            ) : (
                                <Ionicons name="camera-outline" size={40} color="white" />
                            )}
                        </View>
                        <View className="absolute bottom-1 right-1 bg-primary p-1.5 rounded-full border-2 border-background">
                            <MaterialCommunityIcons name="pencil" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-gray-400 mt-4 font-medium">Upload Team Logo</Text>
                </View>

                {/* Form Fields */}
                <View className="space-y-6">
                    <View>
                        <Text className="text-white text-base font-bold mb-3">Team Name</Text>
                        <TextInput
                            placeholder="Enter team name"
                            placeholderTextColor="#94a3b8"
                            value={teamName}
                            onChangeText={setTeamName}
                            className="bg-[#0f172a] text-white p-5 rounded-3xl border border-primary/40"
                        />
                    </View>

                    <View>
                        <Text className="text-white text-base font-bold mb-3">Sport</Text>
                        <TouchableOpacity
                            className="bg-[#0f172a] p-5 rounded-3xl border border-primary/40 flex-row justify-between items-center"
                            onPress={() => setSportModalVisible(true)}
                        >
                            <Text className="text-white text-base">{sport}</Text>
                            <Ionicons name="chevron-down" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sport Selection Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={sportModalVisible}
                    onRequestClose={() => setSportModalVisible(false)}
                >
                    <Pressable
                        className="flex-1 bg-black/60 justify-end"
                        onPress={() => setSportModalVisible(false)}
                    >
                        <View className="bg-[#1e293b] rounded-t-[40px] p-8">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-white text-xl font-bold">Select Sport</Text>
                                <TouchableOpacity onPress={() => setSportModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row flex-wrap justify-between">
                                {SPORTS.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => {
                                            setSport(item);
                                            setSportModalVisible(false);
                                        }}
                                        className={`w-[48%] py-4 rounded-2xl mb-4 border ${sport === item ? 'bg-primary border-primary' : 'bg-[#0f172a] border-gray-700'}`}
                                    >
                                        <Text className={`text-center font-bold ${sport === item ? 'text-white' : 'text-gray-400'}`}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Pressable>
                </Modal>

                {/* Next Button */}
                <TouchableOpacity
                    className="bg-primary flex-row items-center justify-center py-5 rounded-3xl mt-16"
                    onPress={handleCreateTeam}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white text-xl font-bold">Next</Text>
                            <Ionicons name="arrow-forward" size={24} color="white" className="ml-2" />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <BottomNavBar />
        </SafeAreaView>
    );
};
