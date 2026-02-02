import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Platform,
    FlatList,
    Modal,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { BottomNavBar } from '../components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Data Types
interface Category {
    id: string;
    name: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof Ionicons.glyphMap;
    type: 'MaterialCommunityIcons' | 'Ionicons';
}

interface Venue {
    id: string;
    name: string;
    distance: string;
    price: string;
    rating: number;
    image: string;
    lat: number;
    lng: number;
    sport: string;
    city?: string;
}

const CATEGORIES: Category[] = [
    { id: '1', name: 'Cricket', icon: 'cricket', type: 'MaterialCommunityIcons' },
    { id: '2', name: 'Soccer', icon: 'soccer', type: 'MaterialCommunityIcons' },
    { id: '3', name: 'Badminton', icon: 'badminton', type: 'MaterialCommunityIcons' },
    { id: '4', name: 'Tennis', icon: 'tennis-ball', type: 'Ionicons' },
];

const CategoryChip = ({
    category,
    isSelected,
    onPress,
}: {
    category: Category;
    isSelected: boolean;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        className={`flex-row items-center px-4 py-2 rounded-full mr-3 border ${isSelected ? 'bg-primary border-primary' : 'bg-transparent border-gray-600'
            }`}
    >
        {category.type === 'MaterialCommunityIcons' ? (
            <MaterialCommunityIcons
                name={category.icon as any}
                size={20}
                color={isSelected ? 'white' : 'white'}
            />
        ) : (
            <Ionicons
                name={category.icon as any}
                size={20}
                color={isSelected ? 'white' : 'white'}
            />
        )}
        <Text className={`text-white ml-2 font-medium ${isSelected ? 'opacity-100' : 'opacity-80'}`}>
            {category.name}
        </Text>
    </TouchableOpacity>
);

const VenueCard = ({ venue, fullWidth = false, onPress }: { venue: Venue, fullWidth?: boolean, onPress?: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className={`${fullWidth ? 'w-[48%] mb-4' : 'w-72 mr-4'} h-64 bg-gray-800 rounded-3xl overflow-hidden relative border border-gray-700`}
    >
        <Image source={{ uri: venue.image }} className="w-full h-32" resizeMode="cover" />

        <View className="absolute top-2 left-2 bg-white/90 px-1.5 py-0.5 rounded-full flex-row items-center">
            <Ionicons name="star" size={10} color="black" />
            <Text className="text-black text-[10px] font-bold ml-0.5">{venue.rating}</Text>
        </View>

        <View className="absolute top-2 right-2 bg-white/90 p-1 rounded-full">
            <Ionicons name="heart-outline" size={14} color="black" />
        </View>

        <View className="p-3 bg-gray-900 flex-1 justify-between">
            <View>
                <Text className="text-white text-sm font-bold" numberOfLines={1}>{venue.name}</Text>
                <View className="flex-row items-center mt-1">
                    <Ionicons name="navigate-outline" size={10} color="#9ca3af" />
                    <Text className="text-gray-400 text-[10px] ml-1">{venue.distance}</Text>
                </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
                <View>
                    <Text className="text-gray-400 text-[8px] uppercase font-bold">Price</Text>
                    <Text className="text-gray-300 text-[10px]">{venue.price}</Text>
                </View>
                <View className="bg-white px-3 py-1.5 rounded-full">
                    <Text className="text-black font-bold text-[10px]">BOOK</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { API_BASE_URL } from '../constants/api';

export const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [viewMode, setViewMode] = useState<'home' | 'grid'>('home');
    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [displayAddress, setDisplayAddress] = useState('Locating...');
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastCitySearch, setLastCitySearch] = useState('');

    const fetchTurfs = async (params: { lat?: number; lng?: number; city?: string }) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            let url = `${API_BASE_URL}/turf`;

            if (params.city) {
                url += `?city=${encodeURIComponent(params.city)}`;
                setLastCitySearch(params.city);
            } else if (params.lat && params.lng) {
                url += `?lat=${params.lat}&lng=${params.lng}`;
            }

            console.log("Fetching turfs from:", url);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            const data = await response.json();

            if (response.ok) {
                const mappedVenues = data.map((item: any) => ({
                    id: item.id || item._id,
                    name: item.name,
                    distance: item.distance ? `${parseFloat(item.distance).toFixed(1)} km away` : 'Near you',
                    price: item.price ? `${item.price} / per hour` : 'Price on request',
                    rating: parseFloat(item.rating) || 4.5,
                    image: item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    lat: parseFloat(item.lat || item.latitude),
                    lng: parseFloat(item.lng || item.longitude),
                    sport: item.sport || item.category || 'Multi-sport',
                    city: item.city
                }));
                setVenues(mappedVenues);
                if (params.city) setDisplayAddress(params.city);
            } else {
                console.warn("Failed to fetch turfs:", data.message);
            }
        } catch (error) {
            console.error("API Error fetching turfs:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setDisplayAddress('Permission Denied');
                fetchTurfs({ lat: 12.9352, lng: 77.6245 });
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            const { latitude, longitude } = location.coords;
            setLocation({
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });

            fetchTurfs({ lat: latitude, lng: longitude });

            let address = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (address && address.length > 0) {
                const city = address[0].city || address[0].region || address[0].subregion;
                const area = address[0].district || address[0].street;
                setDisplayAddress(city ? `${area ? area + ', ' : ''}${city}` : 'Unknown Location');
            }
        })();
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            fetchTurfs({ city: searchQuery.trim() });
        }
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        setDate(currentDate);
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const filteredVenues = venues.filter(venue => {
        // If the query matches the city we just searched for via API, we show all results 
        // to avoid "No venues found" just because the venue name doesn't contain the city name.
        const matchesCitySearch = lastCitySearch && searchQuery.toLowerCase() === lastCitySearch.toLowerCase();

        const matchesSearch = matchesCitySearch ||
            venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (venue.city && venue.city.toLowerCase().includes(searchQuery.toLowerCase()));

        const category = CATEGORIES.find(c => c.id === activeCategory);
        const matchesCategory = category ?
            venue.sport.toLowerCase().includes(category.name.toLowerCase()) : true;

        return matchesSearch && matchesCategory;
    });

    if (viewMode === 'grid') {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="px-5 py-2 flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => setViewMode('home')} className="bg-gray-800 p-2 rounded-full mr-4">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">All Venues</Text>
                </View>

                {/* Search in Grid View */}
                <View className="px-5 mb-4">
                    <View className="flex-row items-center bg-gray-200 rounded-full px-4 h-12">
                        <Ionicons name="search" size={20} color="black" />
                        <TextInput
                            placeholder="Search venues..."
                            placeholderTextColor="gray"
                            className="flex-1 ml-2 text-black text-sm"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                        {loading && <ActivityIndicator size="small" color="#22c55e" className="ml-2" />}
                    </View>
                </View>

                {loading && venues.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#22c55e" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredVenues}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
                        renderItem={({ item }) => (
                            <VenueCard
                                venue={item}
                                fullWidth={true}
                                onPress={() => navigation.navigate('TurfDetails', { turfId: item.id })}
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        ListEmptyComponent={<Text className="text-gray-500 text-center mt-10">No venues found.</Text>}
                    />
                )}
                <BottomNavBar />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background relative">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>

                {/* Header */}
                <View className="flex-row items-center justify-between px-5 pt-2 mb-6">
                    <View>
                        <Text className="text-gray-400 text-xs font-medium">Location</Text>
                        <View className="flex-row items-center mt-1">
                            <Ionicons name="location-outline" size={18} color="#22c55e" />
                            <Text className="text-white text-lg font-bold ml-1">{displayAddress}</Text>
                            <Ionicons name="chevron-down" size={16} color="gray" style={{ marginLeft: 4 }} />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="flex-row items-center bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30"
                    >
                        <Ionicons name="calendar-outline" size={14} color="#22c55e" />
                        <Text className="text-white text-xs font-medium ml-1">{formatDate(date)}</Text>
                    </TouchableOpacity>
                </View>

                {/* Date Picker Logic */}
                {showDatePicker && (
                    Platform.OS === 'ios' ? (
                        <Modal
                            transparent={true}
                            animationType="fade"
                            visible={showDatePicker}
                            onRequestClose={() => setShowDatePicker(false)}
                        >
                            <View className="flex-1 justify-center items-center bg-black/70">
                                <View className="bg-white rounded-3xl p-5 w-4/5 items-center">
                                    <Text className="text-black text-lg font-bold mb-4">Select Date</Text>
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode="date"
                                        display="inline"
                                        onChange={onChangeDate}
                                        minimumDate={new Date()}
                                        themeVariant="light"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker(false)}
                                        className="mt-4 bg-primary px-6 py-2 rounded-full"
                                    >
                                        <Text className="text-white font-bold">Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    ) : (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                            minimumDate={new Date()}
                        />
                    )
                )}

                {/* Search Bar */}
                <View className="px-5 mb-6">
                    <View className="flex-row items-center bg-gray-200 rounded-full px-4 h-12">
                        <Ionicons name="search" size={20} color="black" />
                        <TextInput
                            placeholder="Find a turf, sport, or venue..."
                            placeholderTextColor="gray"
                            className="flex-1 ml-2 text-black text-sm"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                        {loading && <ActivityIndicator size="small" color="#22c55e" className="mr-2" />}
                        <TouchableOpacity onPress={handleSearch} className="bg-primary p-1.5 rounded-full">
                            <Ionicons name="options-outline" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-6 pl-5"
                >
                    {CATEGORIES.map((cat) => (
                        <CategoryChip
                            key={cat.id}
                            category={cat}
                            isSelected={activeCategory === cat.id}
                            onPress={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                        />
                    ))}
                    <View className="w-5" />
                </ScrollView>

                {/* Map Section */}
                <View className="px-5 mb-8">
                    <View className="rounded-3xl overflow-hidden h-48 border border-gray-700 relative">
                        <MapView
                            style={{ width: '100%', height: '100%' }}
                            initialRegion={{
                                latitude: 12.9352,
                                longitude: 77.6245,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                            region={location || undefined}
                            showsUserLocation={true}
                        >
                            {venues.map(venue => (
                                <Marker
                                    key={venue.id}
                                    coordinate={{ latitude: venue.lat, longitude: venue.lng }}
                                    title={venue.name}
                                >
                                    <View className="p-1 bg-white rounded-full border-2 border-primary">
                                        <MaterialCommunityIcons name="map-marker" size={20} color="black" />
                                    </View>
                                </Marker>
                            ))}
                        </MapView>

                        <TouchableOpacity className="absolute bottom-3 right-3 bg-primary p-3 rounded-full shadow-lg items-center justify-center">
                            <MaterialCommunityIcons name="crosshairs" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recommended Section */}
                <View className="pl-5 mb-6">
                    <View className="flex-row items-center justify-between pr-5 mb-4">
                        <Text className="text-white text-lg font-bold">Recommended For You</Text>
                        <TouchableOpacity onPress={() => setViewMode('grid')}>
                            <Text className="text-primary text-sm font-medium">See All</Text>
                        </TouchableOpacity>
                    </View>

                    {loading && venues.length === 0 ? (
                        <View className="h-40 justify-center items-center">
                            <ActivityIndicator size="large" color="#22c55e" />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {filteredVenues.length > 0 ? filteredVenues.map((venue) => (
                                <VenueCard
                                    key={venue.id}
                                    venue={venue}
                                    onPress={() => navigation.navigate('TurfDetails', { turfId: venue.id })}
                                />
                            )) : (
                                <Text className="text-gray-500 italic">No venues found.</Text>
                            )}
                            <View className="w-5" />
                        </ScrollView>
                    )}
                </View>

            </ScrollView>
            <BottomNavBar />
        </SafeAreaView>
    );
};
