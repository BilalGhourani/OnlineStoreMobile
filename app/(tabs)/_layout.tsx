import CustomToolbar from "@/components/CustomToolbar";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    const { theme } = useTheme();
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarStyle: {
                    outlineColor: theme.tabbarBackground,
                    backgroundColor: theme.tabbarBackground,
                    borderTopColor: theme.border,
                    elevation: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: "absolute",
                    overflow: "hidden",
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: `${theme.tabActive}`,
                tabBarInactiveTintColor: `${theme.tabInactive}`,
            }}
        >
            <Tabs.Screen
                name="HomeTab"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: "#000000",
                    tabBarLabel: "Home",
                    tabBarActiveTintColor: `${theme.tabActive}`,
                    tabBarInactiveTintColor: `${theme.tabInactive}`,
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
