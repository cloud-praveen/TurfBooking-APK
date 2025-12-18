import React from "react";
import { View, Text, StatusBar, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const SplashScreen = () => {
  return (
    <View className="flex-1 bg-[#10141E] items-center justify-between py-12">
      <StatusBar barStyle="light-content" backgroundColor="#10141E" />

      <View />

      <View className="items-center">
        {/* Logo Container */}
        <View className="items-center justify-center mb-6 relative">
          {/* OUTER GLOW */}
          <View
            className="absolute w-44 h-44 rounded-full"
            style={{
              backgroundColor: "rgba(21, 153, 71, 0.35)",
              shadowColor: "#159947",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 40,
              elevation: 30,
            }}
          />

          {/* INNER GLOW */}
          <View
            className="absolute w-42 h-42 rounded-full"
            style={{
              backgroundColor: "rgba(21, 153, 71, 0.25)",
              shadowColor: "#159947",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 25,
              elevation: 20,
            }}
          />

          {/* MAIN CIRCLE */}
          <View
            className="w-40 h-40 bg-[#E0E2D8] rounded-full items-center justify-center"
            style={{
              shadowColor: "#159947",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.9,
              shadowRadius: 20,
              elevation: 15,
            }}
          >
            <MaterialCommunityIcons name="cricket" size={80} color="#159947" />
          </View>
        </View>

        {/* Title */}
        <View className="flex-row items-center mb-2">
          <Text className="text-white text-4xl font-bold">Turf</Text>
          <Text className="text-[#159947] text-4xl font-bold ml-2">Time</Text>
        </View>

        {/* Subtitle */}
        <Text className="text-[#D9D9D9] text-sm">Book . Play . Repeat</Text>
      </View>

      {/* Footer / Loading */}
      <View className="w-4/5 items-center">
        <Text className="text-[#FFFFFF] text-sm mb-4 font-semibold text-center ml-2">
          Loading Pitches...
        </Text>
        <View className="w-full h-2 bg-white rounded-full overflow-hidden">
          <View className="w-1/3 h-full bg-[#2E7D32] rounded-full" />
        </View>
      </View>
    </View>
  );
};
