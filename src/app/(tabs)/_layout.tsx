import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.card,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedText,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={focused ? colors.accent : colors.mutedText}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="search"
              size={size}
              color={focused ? colors.accent : colors.mutedText}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="bookmark"
              size={size}
              color={focused ? colors.accent : colors.mutedText}
            />
          ),
        }}
      />
    </Tabs>
  );
}
