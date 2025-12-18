import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, ...props }) => {
    return (
        <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg items-center m-2 active:bg-blue-700 shadow-md"
            {...props}
        >
            <Text className="text-white font-bold text-lg">{label}</Text>
        </TouchableOpacity>
    );
};
