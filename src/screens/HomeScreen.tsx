import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { increment, decrement } from '../store/slices/counterSlice';
import { Button } from '../components/Button';

export const HomeScreen = () => {
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    return (
        <View className="flex-1 items-center justify-center bg-gray-50">
            <StatusBar barStyle="dark-content" />
            <Text className="text-3xl font-bold mb-8 text-gray-800 text-center">
                Expo + Redux + Tailwind
            </Text>

            <View className="bg-white p-8 rounded-2xl shadow-lg items-center mb-8 w-4/5">
                <Text className="text-gray-500 text-lg mb-2">Current Count</Text>
                <Text className="text-6xl font-black text-blue-600">
                    {count}
                </Text>
            </View>

            <View className="flex-row justify-between w-4/5">
                <Button label="Decrement" onPress={() => dispatch(decrement())} className="flex-1 mr-2 bg-red-500 active:bg-red-700" />
                <Button label="Increment" onPress={() => dispatch(increment())} className="flex-1 ml-2 bg-green-500 active:bg-green-700" />
            </View>
        </View>
    );
};
