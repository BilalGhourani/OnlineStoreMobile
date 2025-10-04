import CustomToolbar from "@/components/CustomToolbar";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#205454ff",
                tabBarInactiveTintColor: "#888",
            }}
        >
            <Tabs.Screen
                name="HomeTab"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: "#000000",
                    tabBarLabel: "Home",
                    tabBarActiveTintColor: "#205454ff",
                    tabBarInactiveTintColor: "#8e8e93",
                    header: () => <CustomToolbar title="" showCart transparent cartBackground />,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="CategoryTab"
                options={{
                    header: () => <CustomToolbar title="Category" titleAlign="center" />,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "grid" : "grid-outline"} // filled when selected
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="ProfileTab"
                options={{
                    header: () => <CustomToolbar title="Profile" titleAlign="center" />,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person-circle" : "person-circle-outline"} // filled when selected
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

        </Tabs>
    );
}
