import { View, Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function WelcomeScreen() {
  return (
    <View>
      <StatusBar style="dark" />
      <Text>WelcomeScreen</Text>
    </View>
  );
}
