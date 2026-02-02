import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CreateMatch = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Create Match</Text>
                <View className="w-7" />
            </View>

            <ScrollView className="flex-1 px-5 pt-6">
                <Text className="text-white text-lg font-bold mb-6">Match Details</Text>

                {/* Form placeholder */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-400 text-sm mb-2">Match Title</Text>
                        <TextInput
                            placeholder="Enter match title"
                            placeholderTextColor="#94a3b8"
                            className="bg-[#1e293b] text-white p-4 rounded-xl"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 text-sm mb-2">Select Sport</Text>
                        <TouchableOpacity className="bg-[#1e293b] p-4 rounded-xl flex-row justify-between items-center">
                            <Text className="text-white">Cricket</Text>
                            <Ionicons name="chevron-down" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text className="text-gray-400 text-sm mb-2">Match Date</Text>
                        <TouchableOpacity className="bg-[#1e293b] p-4 rounded-xl flex-row justify-between items-center">
                            <Text className="text-white">Select Date</Text>
                            <Ionicons name="calendar-outline" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity className="bg-primary py-4 rounded-2xl mt-12 items-center">
                    <Text className="text-white text-lg font-bold">Create Match</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};
