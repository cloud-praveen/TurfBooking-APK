import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');
// --- Mock Data ---

const AMENITIES = [
    { id: '1', name: 'Parking', icon: 'parking', type: 'FontAwesome5' },
    { id: '2', name: 'Floodlights', icon: 'lightbulb-on-outline', type: 'MaterialCommunityIcons' },
    { id: '3', name: 'Changing Room', icon: 'tshirt-crew-outline', type: 'MaterialCommunityIcons' }, // 'hanger' might not exist in all sets, approximating
    { id: '4', name: 'Water', icon: 'water-outline', type: 'Ionicons' },
];

const REVIEWS_BREAKDOWN = [
    { star: 5, percentage: 80 },
    { star: 4, percentage: 40 },

    { star: 3, percentage: 10 },
    { star: 2, percentage: 5 },
    { star: 1, percentage: 5 },
];

// --- Components ---

const AmenityItem = ({ item }: { item: any }) => (
    <View className="items-center mr-6">
        <View className="w-14 h-14 bg-gray-800 rounded-2xl items-center justify-center mb-2">
            {item.type === 'FontAwesome5' && <FontAwesome5 name={item.icon} size={24} color="#22c55e" />}
            {item.type === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon} size={24} color="#22c55e" />}
            {item.type === 'Ionicons' && <Ionicons name={item.icon} size={24} color="#22c55e" />}
        </View>
        <Text className="text-gray-400 text-[10px] text-center w-16" numberOfLines={2}>
            {item.name}
        </Text>
    </View>
);

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <View className="flex-1 h-1.5 bg-gray-700 rounded-full ml-3 overflow-hidden">
        <View style={{ width: `${percentage}%` }} className="h-full bg-gray-300 rounded-full" />
    </View>
);

export const TurfDetails = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* --- Header Image Section --- */}
                <View className="relative h-72">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    {/* Gradients or Overlays can be added here if needed */}
                    <View className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />

                    {/* Top Actions */}
                    <SafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between px-5">
                        <TouchableOpacity
                            className="bg-black/30 p-2 rounded-full backdrop-blur-md"
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-black/30 p-2 rounded-full backdrop-blur-md">
                            <Ionicons name="heart-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>

                    {/* Pagination Dots (Static for now) */}
                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-2">
                        {[1, 2, 3, 4].map((dot, index) => (
                            <View key={index} className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`} />
                        ))}
                    </View>
                </View>

                {/* --- Title & Info --- */}
                <View className="px-5 pt-6">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-white text-2xl font-bold">Vilvam Turf</Text>
                            <View className="flex-row items-center mt-1">
                                <Ionicons name="location-outline" size={14} color="#22c55e" />
                                <Text className="text-gray-400 text-xs ml-1">Saravanampatti, CBE</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <View className="bg-white px-2 py-1 rounded-lg flex-row items-center">
                                <Ionicons name="star" size={12} color="black" />
                                <Text className="text-black text-xs font-bold ml-1">4.8</Text>
                            </View>
                            <Text className="text-primary text-[10px] underline mt-1">120 Reviews</Text>
                        </View>
                    </View>

                    <View className="h-[1px] bg-gray-800 my-6" />

                    {/* --- Amenities --- */}
                    <Text className="text-white text-lg font-bold mb-4">Amenities</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {AMENITIES.map(item => <AmenityItem key={item.id} item={item} />)}
                    </ScrollView>

                    {/* --- About Venue --- */}
                    <View className="mt-8">
                        <Text className="text-white text-lg font-bold mb-3">About Venue</Text>
                        <Text className="text-gray-400 text-xs leading-5">
                            Welcome to Vilvam Sports Arena, a premier destination for athletes of all ages and skill levels in Coimbatore! From looking for a premier Sports Academy in Coimbatore or looking for a place to...
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-primary text-xs font-bold mt-1">Read More</Text>
                        </TouchableOpacity>
                    </View>

                    {/* --- Location Map --- */}
                    <View className="mt-8">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white text-lg font-bold">Location</Text>
                            <TouchableOpacity>
                                <Text className="text-primary text-xs font-bold">Open Maps</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="h-40 rounded-3xl overflow-hidden border border-gray-700 relative">
                            <MapView
                                style={{ flex: 1 }}
                                initialRegion={{
                                    latitude: 11.0805,
                                    longitude: 76.9945,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                            >
                                <Marker coordinate={{ latitude: 11.0805, longitude: 76.9945 }} />
                            </MapView>
                            {/* Overlay to intercept touches if desired, or let it jump to maps */}
                        </View>
                        <Text className="text-gray-400 text-[10px] mt-3 leading-4">
                            Easen vilayadat, Kumaraguru college back entrance, Athipalayam Rd, Ramani's Sri Mayuri Layout, Saravanampatti, Coimbatore, Tamil Nadu 641049
                        </Text>
                    </View>

                    {/* --- Rules --- */}
                    <View className="mt-8">
                        <Text className="text-white text-lg font-bold mb-4">Rules & Regulations</Text>

                        <View className="bg-gray-900 p-4 rounded-2xl flex-row items-center mb-3 border border-gray-800">
                            <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center border border-red-500">
                                <MaterialCommunityIcons name="shoe-cleat" size={20} color="#ef4444" />
                                <View className="absolute w-full h-[2px] bg-red-500 rotate-45" />
                            </View>
                            <View className="ml-4 flex-1">
                                <Text className="text-white text-sm font-bold">No Metal Spikes</Text>
                                <Text className="text-gray-400 text-[10px]">Only turf shoes or flat soles allowed</Text>
                            </View>
                        </View>

                        <View className="bg-gray-900 p-4 rounded-2xl flex-row items-center border border-gray-800">
                            <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center">
                                <Ionicons name="time" size={20} color="#22c55e" />
                            </View>
                            <View className="ml-4 flex-1">
                                <Text className="text-white text-sm font-bold">Arrive on Time</Text>
                                <Text className="text-gray-400 text-[10px]">Bookings end exactly at the scheduled time</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- Reviews --- */}
                    <View className="mt-8 mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white text-lg font-bold">Reviews</Text>
                            <TouchableOpacity>
                                <Text className="text-primary text-xs font-bold">See All</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-gray-900 p-5 rounded-3xl border border-gray-800">
                            <View className="flex-row mb-6">
                                <View className="items-center justify-center mr-6">
                                    <Text className="text-primary text-5xl font-black">4.8</Text>
                                    <View className="flex-row">
                                        {[1, 2, 3, 4, 5].map(i => <Ionicons key={i} name="star" size={10} color="#fbbf24" />)}
                                    </View>
                                </View>
                                <View className="flex-1 justify-center">
                                    {REVIEWS_BREAKDOWN.map((item) => (
                                        <View key={item.star} className="flex-row items-center mb-1">
                                            <Text className="text-white text-[10px] w-3 font-bold">{item.star}</Text>
                                            <ProgressBar percentage={item.percentage} />
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className="h-[1px] bg-gray-800 mb-4" />

                            {/* Single Review Card Mock */}
                            <View className="flex-row">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                                    className="w-10 h-10 rounded-full"
                                />
                                <View className="ml-3 flex-1">
                                    <View className="flex-row items-center mb-1">
                                        <Text className="text-white text-xs font-bold mr-2">Alex M.</Text>
                                        <Text className="text-gray-500 text-[10px]">2 days ago</Text>
                                    </View>
                                    <View className="flex-row mb-1">
                                        {[1, 2, 3, 4, 5].map(i => <Ionicons key={i} name="star" size={8} color="#fbbf24" />)}
                                    </View>
                                    <Text className="text-gray-300 text-[10px] leading-4">
                                        Great turf! The lights are amazing for evening games. Definitely coming back next week.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* --- Bottom Action Bar --- */}
            <View className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-6 py-4 pb-8 flex-row items-center justify-between z-50">
                <View>
                    <Text className="text-gray-400 text-xs font-medium">Price</Text>
                    <View className="flex-row items-end">
                        <Text className="text-white text-xl font-bold">₹ 1500</Text>
                        <Text className="text-gray-500 text-xs mb-1 ml-1">/ 1 Slot</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="bg-green-500 px-6 py-3 rounded-xl flex-row items-center"
                    onPress={() => navigation.navigate('SlotSelection', { turfId: '1' })}
                >
                    <Text className="text-gray-900 font-bold mr-2">Check Availability</Text>
                    <Ionicons name="calendar" size={18} color="#111827" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
