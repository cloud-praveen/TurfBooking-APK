import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function AdminHomepage() {
  return (
    <SafeAreaView className="flex-1 bg-[#0b1526]">
      <ScrollView className="px-4">
        <View className="mt-6 flex-row items-center">
          <View className="h-10 w-10 rounded-full bg-gray-300 mr-3" />
          <View>
            <Text className="text-gray-400 text-sm">Welcome Back</Text>
            <Text className="text-green-400 text-base font-semibold">
              Manoj Sundhar
            </Text>
          </View>
        </View>

        <View className="bg-gray-200 rounded-2xl p-4 mt-6">
          <View className="flex-row items-center mb-2">
            <View className="h-10 w-10 rounded-full bg-gray-400 mr-3" />
            <Text className="font-semibold text-base">
              New Booking Requests
            </Text>
          </View>

          <Text className="text-gray-600 text-sm">
            You have pending requests for “Green Valley Arena” that need
            approval.
          </Text>

          <View className="flex-row items-center mt-4">
            <Pressable className="bg-green-500 px-6 py-2 rounded-full mr-4">
              <Text className="text-white font-semibold">Review</Text>
            </Pressable>

            <Pressable>
              <Text className="text-green-500 font-semibold">Decline</Text>
            </Pressable>
          </View>
        </View>

        <Text className="text-white text-lg font-semibold mt-8">Overview</Text>

        <View className="flex-row justify-between mt-4">
          <OverviewCard title="Earned" value="10k" subtitle="" />
          <OverviewCard title="24" value="Total" subtitle="" />
          <OverviewCard title="78%" value="% Usage" subtitle="High" />
        </View>

        <Text className="text-white text-lg font-semibold mt-8">
          Key Actions
        </Text>

        <View className="flex-row justify-between mb-4 h-20 mt-4">
          <ActionCard title="Manage Turf" subtitle="Edit Details & Photos" />
          <ActionCard
            title="Slot & Pricing"
            subtitle="Set rates & availability"
          />
        </View>

        <View className="flex-row justify-between mt-4 mb-24">
          <ActionCard title="View Bookings" subtitle="Check Schedule" />
          <ActionCard title="Reports" subtitle="Analytics & earnings" />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white h-16 flex-row items-center justify-around">
        <TabItem icon="home-outline" label="Home" active />
        <TabItem icon="calendar-outline" label="Bookings" />

        <View className="-mt-8 bg-green-500 h-14 w-14 rounded-full items-center justify-center">
          <Ionicons name="add" size={28} color="white" />
        </View>

        <TabItem icon="business-outline" label="My Properties" />
        <TabItem icon="person-outline" label="Profile" />
      </View>
    </SafeAreaView>
  );
}

function OverviewCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <View className="bg-gray-200 rounded-xl p-4 w-[30%] items-center">
      <Text className="text-xs text-gray-500">{title}</Text>
      <Text className="font-bold text-lg">{value}</Text>
      {subtitle ? (
        <Text className="text-xs text-gray-500">{subtitle}</Text>
      ) : null}
    </View>
  );
}

function ActionCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="bg-gray-200 rounded-xl p-4 w-[48%]">
      <Text className="font-semibold">{title}</Text>
      <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>
    </View>
  );
}

function TabItem({
  icon,
  label,
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
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
