import { View, Text, ScrollView, TextInput, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function EditTurfScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0b1526]">
      <ScrollView className="px-4">
        <View className="flex-row items-center mt-4 mb-6">
          <Ionicons name="arrow-back" size={22} color="white" />
          <Text className="text-white text-lg font-semibold ml-4">
            Edit Turf
          </Text>
        </View>
        <Text className="text-white font-semibold mb-2">Turf Gallery</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable className="h-20 w-20 border border-dashed border-gray-400 rounded-xl items-center justify-center mr-3">
            <Ionicons name="camera" size={22} color="#9ca3af" />
            <Text className="text-xs text-gray-400 mt-1">Add Photo</Text>
          </Pressable>

          <ImageCard />
          <ImageCard />
          <ImageCard />
        </ScrollView>

        <Card title="Basic details">
          <Label text="Turf Name" />
          <Input placeholder="Green Valley Arena" />

          <Label text="Location" />
          <Input placeholder="Enter location" active />

          <Label text="Description" />
          <Input placeholder="About turf" multiline />
        </Card>

        <Card title="Supported Sports">
          <View className="flex-row flex-wrap">
            <Chip text="Cricket" active />
            <Chip text="Football" active />
            <Chip text="Badminton" />
          </View>
        </Card>

        <Card title="Facilities">
          <View className="flex-row flex-wrap">
            <Chip text="Parking" />
            <Chip text="Water" />
            <Chip text="Restrooms" />
            <Chip text="First Aid" />
            <Chip text="Floodlights" />
          </View>
        </Card>

    
        <Card title="Configuration">
          <Label text="Hourly Rate" />
          <Input placeholder="₹ 1200" />

          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-gray-700 font-medium">Instant Booking</Text>
            <View className="bg-green-500 h-5 w-10 rounded-full justify-center">
              <View className="bg-white h-4 w-4 rounded-full ml-5" />
            </View>
          </View>

          <Label text="House Rules" />
          <Rule text="No metal spikes allowed" />
          <Rule text="Carry your own water bottles" />
          <AddRule />
        </Card>

    
        <Card title="Manager Contact">
          <Label text="Manager Name" />
          <Input placeholder="Enter name" />

          <Label text="Phone Number" />
          <Input placeholder="+91 XXXXX XXXXX" />
        </Card>

        <View className="h-28" />
      </ScrollView>

      <BottomBar />
    </SafeAreaView>
  );
}

function Card({ title, children }: any) {
  return (
    <View className="bg-gray-200 rounded-2xl p-4 mt-6">
      <Text className="text-green-600 font-semibold mb-3">{title}</Text>
      {children}
    </View>
  );
}

function Label({ text }: { text: string }) {
  return <Text className="text-gray-700 text-sm mb-1 mt-2">{text}</Text>;
}

function Input({ placeholder, multiline, active }: any) {
  return (
    <TextInput
      placeholder={placeholder}
      multiline={multiline}
      className={`bg-gray-300 rounded-lg px-3 py-2 text-sm ${
        active ? "border-2 border-blue-500" : ""
      }`}
    />
  );
}

function Chip({ text, active }: { text: string; active?: boolean }) {
  return (
    <View
      className={`px-4 py-1 rounded-full mr-2 mb-2 ${
        active ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <Text className={`${active ? "text-white" : "text-gray-700"} text-xs`}>
        {text}
      </Text>
    </View>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <View className="bg-gray-300 rounded-lg px-3 py-2 mt-2">
      <Text className="text-xs text-gray-700">{text}</Text>
    </View>
  );
}

function AddRule() {
  return (
    <View className="border border-dashed border-green-500 rounded-lg px-3 py-2 mt-2">
      <Text className="text-green-600 text-xs">+ Add Rule</Text>
    </View>
  );
}

function ImageCard() {
  return (
    <View className="h-20 w-20 bg-gray-400 rounded-xl mr-3" />
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
      <Ionicons
        name={icon}
        size={22}
        color={active ? "#16a34a" : "#9ca3af"}
      />
      <Text className={`text-xs mt-1 ${active ? "text-green-600" : "text-gray-400"}`}>
        {label}
      </Text>
    </View>
  );
}
