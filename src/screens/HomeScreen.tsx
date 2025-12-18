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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

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
}

const CATEGORIES: Category[] = [
    { id: '1', name: 'Cricket', icon: 'cricket', type: 'MaterialCommunityIcons' },
    { id: '2', name: 'Soccer', icon: 'soccer', type: 'MaterialCommunityIcons' },
    { id: '3', name: 'Badminton', icon: 'badminton', type: 'MaterialCommunityIcons' },
    { id: '4', name: 'Tennis', icon: 'tennis-ball', type: 'Ionicons' },
];

const VENUES: Venue[] = [
    {
        id: '1',
        name: 'Vilvam Turf',
        distance: '1.2 km away',
        price: '1500 / per hour',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        lat: 11.0805,
        lng: 76.9945,
        sport: 'Cricket',
    },
    {
        id: '2',
        name: 'Sixer Zone',
        distance: '2.5 km away',
        price: '1200 / per hour',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1517747614396-d21a78b850e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1482&q=80',
        lat: 11.0850,
        lng: 77.0000,
        sport: 'Soccer',
    },
    {
        id: '3',
        name: 'Smash Court',
        distance: '3.0 km away',
        price: '800 / per hour',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1626224583764-84786c713066?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        lat: 11.0900,
        lng: 77.0100,
        sport: 'Badminton',
    },
    {
        id: '4',
        name: 'Pro Arena',
        distance: '0.8 km away',
        price: '1000 / per hour',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        lat: 11.0700,
        lng: 76.9800,
        sport: 'Tennis',
    },
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
        className={`flex-row items-center px-4 py-2 rounded-full mr-3 border ${isSelected ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-600'
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

const VenueCard = ({ venue, fullWidth = false }: { venue: Venue, fullWidth?: boolean }) => (
    <View className={`${fullWidth ? 'w-[48%] mb-4' : 'w-72 mr-4'} h-64 bg-gray-800 rounded-3xl overflow-hidden relative border border-gray-700`}>
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
                <TouchableOpacity className="bg-white px-3 py-1.5 rounded-full">
                    <Text className="text-black font-bold text-[10px]">BOOK</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const BottomNavBar = () => (
    <View className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-between px-8 py-4 pb-8 rounded-t-3xl shadow-lg border-t border-gray-100">
        <TouchableOpacity className="items-center">
            <Ionicons name="home" size={24} color="#1f2937" />
            <Text className="text-[10px] font-bold text-gray-900 mt-1">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
            <MaterialCommunityIcons name="ticket-outline" size={24} color="#9ca3af" />
            <Text className="text-[10px] font-medium text-gray-400 mt-1">Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
            <Ionicons name="people-outline" size={24} color="#9ca3af" />
            <Text className="text-[10px] font-medium text-gray-400 mt-1">Teams</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
            <Ionicons name="person-outline" size={24} color="#9ca3af" />
            <Text className="text-[10px] font-medium text-gray-400 mt-1">Profile</Text>
        </TouchableOpacity>
    </View>
);

export const HomeScreen = () => {
    const [activeCategory, setActiveCategory] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [viewMode, setViewMode] = useState<'home' | 'grid'>('home');
    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [displayAddress, setDisplayAddress] = useState('Locating...');

    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setDisplayAddress('Permission Denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });

            // Reverse Geocoding to get address
            let address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (address && address.length > 0) {
                const city = address[0].city || address[0].region || address[0].subregion;
                const area = address[0].district || address[0].street; // Fallback or combination
                setDisplayAddress(city ? `${area ? area + ', ' : ''}${city}` : 'Unknown Location');
            }
        })();
    }, []);

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

    const filteredVenues = VENUES.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.sport.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (viewMode === 'grid') {
        return (
            <SafeAreaView className="flex-1 bg-gray-950">
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
                        />
                    </View>
                </View>

                <FlatList
                    data={filteredVenues}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
                    renderItem={({ item }) => <VenueCard venue={item} fullWidth={true} />}
                    contentContainerStyle={{ paddingBottom: 120 }}
                />
                {/* Added BottomNavBar to Grid View as well for consistency */}
                <BottomNavBar />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-950 relative">
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
                        className="flex-row items-center bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30"
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
                                        className="mt-4 bg-green-500 px-6 py-2 rounded-full"
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
                        />
                        <TouchableOpacity className="bg-green-500 p-1.5 rounded-full">
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
                            onPress={() => setActiveCategory(cat.id)}
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
                                latitude: 11.0805,
                                longitude: 76.9945,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                            region={location || undefined}
                            showsUserLocation={true}
                        >
                            {VENUES.map(venue => (
                                <Marker
                                    key={venue.id}
                                    coordinate={{ latitude: venue.lat, longitude: venue.lng }}
                                    title={venue.name}
                                >
                                    <View className="p-1 bg-white rounded-full border-2 border-green-500">
                                        <MaterialCommunityIcons name="map-marker" size={20} color="black" />
                                    </View>
                                </Marker>
                            ))}
                        </MapView>

                        <TouchableOpacity className="absolute bottom-3 right-3 bg-green-500 p-3 rounded-full shadow-lg items-center justify-center">
                            <MaterialCommunityIcons name="crosshairs" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recommended Section */}
                <View className="pl-5 mb-6">
                    <View className="flex-row items-center justify-between pr-5 mb-4">
                        <Text className="text-white text-lg font-bold">Recommended For You</Text>
                        <TouchableOpacity onPress={() => setViewMode('grid')}>
                            <Text className="text-green-500 text-sm font-medium">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {filteredVenues.length > 0 ? filteredVenues.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        )) : (
                            <Text className="text-gray-500 italic">No venues found.</Text>
                        )}
                        <View className="w-5" />
                    </ScrollView>
                </View>

            </ScrollView>
            <BottomNavBar />
        </SafeAreaView>
    );
};
