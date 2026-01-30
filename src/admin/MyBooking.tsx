import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function MyBookings() {
  return (
    <SafeAreaView className="flex-1 bg-[#0b1526]">
      <ScrollView className="px-4">
        <View className="flex-row items-center mt-4 mb-4">
          <Ionicons name="arrow-back" size={22} color="white" />
          <Text className="text-white text-lg font-semibold ml-4">
            My Bookings
          </Text>
        </View>

        <View className="bg-gray-200 rounded-xl px-3 py-2 flex-row items-center mb-3">
          <Ionicons name="search-outline" size={18} color="#6b7280" />
          <TextInput
            placeholder="Select player, Booking ID..."
            className="ml-2 flex-1 text-sm"
          />
        </View>

        <View className="flex-row justify-between mb-3">
          <FilterChip label="All Turfs" active />
          <FilterChip label="Vivian" dropdown />
        </View>

        <View className="flex-row bg-gray-200 rounded-xl p-1 mb-4">
          <Tab label="Upcoming" />
          <Tab label="Pending" active />
          <Tab label="History" />
        </View>

        <View className="bg-gray-200 rounded-xl p-3 flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <View className="h-8 w-8 rounded-full bg-gray-400 mr-3" />
            <View>
              <Text className="font-semibold text-sm text-red-600">
                Action Required
              </Text>
              <Text className="text-xs text-gray-500">
                You have 7 pending requests
              </Text>
            </View>
          </View>

          <Pressable className="bg-gray-300 px-4 py-1 rounded-full">
            <Text className="text-xs font-semibold">Review</Text>
          </Pressable>
        </View>

        <BookingCard />
        <BookingCard />
        <BookingCard />
        <BookingCard />
        <BookingCard />
        <BookingCard />

        <View className="h-24" />
      </ScrollView>

      <BottomBar />
    </SafeAreaView>
  );
}

function FilterChip({ label, active, dropdown }: any) {
  return (
    <View
      className={`px-4 py-2 rounded-xl flex-row items-center ${
        active ? "bg-green-500" : "bg-gray-200"
      }`}
    >
      <Text className={`${active ? "text-white" : "text-gray-700"} text-sm`}>
        {label}
      </Text>
      {dropdown && (
        <Ionicons
          name="chevron-down"
          size={14}
          color="#6b7280"
          style={{ marginLeft: 4 }}
        />
      )}
    </View>
  );
}

function Tab({ label, active }: any) {
  return (
    <View
      className={`flex-1 items-center py-2 rounded-lg ${
        active ? "bg-white" : ""
      }`}
    >
      <Text
        className={`text-sm ${
          active ? "font-semibold text-black" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

function BookingCard() {
  return (
    <View className="bg-gray-200 rounded-2xl p-4 mb-4">
      <View className="flex-row justify-between mb-3">
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://picsum.photos/100" }}
            className="h-10 w-10 rounded-full mr-3"
          />
          <View>
            <Text className="font-semibold">Raveendran</Text>
            <Text className="text-xs text-gray-500">
              Waiting for confirmation
            </Text>
          </View>
        </View>

        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-xs text-green-700">Upcoming</Text>
        </View>
      </View>

      <View className="bg-gray-300 rounded-lg px-3 py-2">
        <View className="flex-row items-center mb-1">
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-600 ml-1">Greenvalley</Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-600 ml-1">
            8:00 PM - 9:00 PM | 1200/-
          </Text>
        </View>
      </View>
    </View>
  );
}

function BottomBar() {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white h-16 flex-row justify-around items-center">
      <TabItem icon="home-outline" label="Home" />
      <TabItem icon="calendar-outline" label="Bookings" active />
      <View className="-mt-8 bg-green-500 h-14 w-14 rounded-full items-center justify-center">
        <Ionicons name="add" size={28} color="white" />
      </View>
      <TabItem icon="business-outline" label="My Properties" />
      <TabItem icon="person-outline" label="Profile" />
    </View>
  );
}

function TabItem({ icon, label, active }: any) {
  return (
    <View className="items-center">
      <Ionicons name={icon} size={22} color={active ? "#16a34a" : "#9ca3af"} />
      <Text
        className={`text-xs mt-1 ${
          active ? "text-green-600" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}
