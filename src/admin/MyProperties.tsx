import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function MyProperties() {
  return (
    <SafeAreaView className="flex-1 bg-[#0b1526]">
      <ScrollView className="px-4">
        <View className="flex-row items-center mt-4 mb-6">
          <Ionicons name="arrow-back" size={22} color="white" />
          <Text className="text-white text-lg font-semibold ml-4">
            My Properties
          </Text>
        </View>

        <View className="flex-row justify-between mb-6">
          <StatCard title="Total Bookings" value="128" subtitle="This Week" />
          <StatCard
            title="Total Revenue"
            value="100k"
            subtitle="+10%"
            highlight
          />
        </View>

        <Text className="text-white font-semibold mb-4">My Venues</Text>

        <VenueCard />
        <VenueCard />
        <VenueCard />

        <Pressable className="bg-green-500 py-4 rounded-xl items-center mt-6 mb-24">
          <Text className="text-white font-semibold text-base">
            + Add New Turf
          </Text>
        </Pressable>
      </ScrollView>

      <BottomBar />
    </SafeAreaView>
  );
}

function StatCard({ title, value, subtitle, highlight }: any) {
  return (
    <View className="bg-gray-200 rounded-xl p-4 w-[48%]">
      <Text className="text-xs text-gray-500">{title}</Text>
      <View className="flex-row items-end mt-1">
        <Text className="text-lg font-bold">{value}</Text>
        <Text
          className={`text-xs ml-2 ${
            highlight ? "text-green-600" : "text-gray-500"
          }`}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

function VenueCard() {
  return (
    <View className="bg-gray-200 rounded-xl p-3 mb-4">
      <View className="flex-row">
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          className="h-16 w-16 rounded-lg mr-3"
        />

        <View className="flex-1">
          <Text className="font-semibold">Greenyvalley Turf</Text>
          <Text className="text-xs text-gray-500">samundipuram, 2.4km…</Text>
          <Text className="text-xs text-gray-500 mt-1">8 Slots Open</Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-3">
        <Action label="Details" icon="information-circle-outline" />
        <Action label="Edit" icon="create-outline" />
        <Action label="Slots" icon="calendar-outline" />
      </View>
    </View>
  );
}

function Action({ label, icon }: any) {
  return (
    <View className="flex-row items-center">
      <Ionicons name={icon} size={14} color="#16a34a" />
      <Text className="text-xs text-green-600 ml-1">{label}</Text>
    </View>
  );
}

function BottomBar() {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white h-16 flex-row justify-around items-center">
      <Tab icon="home-outline" label="Home" />
      <Tab icon="calendar-outline" label="Bookings" />
      <View className="-mt-8 bg-green-500 h-14 w-14 rounded-full items-center justify-center">
        <Ionicons name="add" size={28} color="white" />
      </View>
      <Tab icon="business-outline" label="My Properties" active />
      <Tab icon="person-outline" label="Profile" />
    </View>
  );
}

function Tab({ icon, label, active }: any) {
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
