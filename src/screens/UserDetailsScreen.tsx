import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const UserDetailsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [name, setName] = React.useState('');
    const [dob, setDob] = React.useState('');

    const handleSubmit = () => {
        // Validation logic can go here
        navigation.replace('Home');
    };

    return (
        <ScrollView className="flex-1 bg-[#090C15]" contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header/Title Area */}
            <View className="pt-16 pb-6 items-center">
                <View className="w-32 h-6 bg-gray-700 rounded-full mb-6 opacity-30" />
                <Text className="text-white font-semibold text-lg">Turf Booking</Text>
            </View>

            {/* Banner Section */}
            <View className="relative w-full h-56 mb-8 px-4">
                <View className="w-full h-full bg-[#0F1E29] rounded-2xl overflow-hidden border border-gray-800 relative">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
                        className="w-full h-full absolute opacity-60"
                        resizeMode="cover"
                    />

                    <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <View className="w-12 h-12 bg-[#E0E2D8] rounded-full items-center justify-center mb-2">
                            <MaterialCommunityIcons name="cricket" size={25} color="#159947" />
                        </View>
                        <Text className="text-white text-2xl font-bold">Game On !</Text>
                        <Text className="text-gray-300 text-xs">Join the league of champions today</Text>
                    </View>
                </View>
            </View>

            {/* Form Section */}
            <View className="w-full px-8">
                <Text className="text-[#1DB954] text-xl font-bold mb-8 text-center">Enter User name and DOB</Text>

                {/* User Name Input */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs font-semibold mb-2 ml-1">User name</Text>
                    <View className="flex-row items-center bg-[#252A3A] rounded-xl h-14 px-4 border border-gray-700">
                        <TextInput
                            placeholder="Create User name"
                            placeholderTextColor="#6B7280"
                            className="flex-1 text-white text-base"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </View>

                {/* DOB Input */}
                <View className="mb-8">
                    <Text className="text-gray-400 text-xs font-semibold mb-2 ml-1">Date Of Birth</Text>
                    <View className="flex-row items-center bg-[#252A3A] rounded-xl h-14 px-4 border border-gray-700">
                        <TextInput
                            placeholder="DD / MM / YYYY"
                            placeholderTextColor="#6B7280"
                            className="flex-1 text-white text-base"
                            value={dob}
                            onChangeText={setDob}
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="w-full bg-[#1DB954] h-14 rounded-full flex-row items-center justify-center shadow-lg shadow-green-900/50 mb-8"
                >
                    <Text className="text-white text-base font-bold mr-2">Get in the Game</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};
