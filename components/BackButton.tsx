// components/BackButton.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

interface BackButtonProps {
    color?: string;
}

export default function BackButton({ color }: BackButtonProps) {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.back()} style={{ marginStart: 15, marginEnd: 10 }}>
            <Ionicons name="arrow-back" size={28} color={color || "#000"} />
        </Pressable>
    );
}
