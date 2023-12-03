import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  // 공유 값 설정(컴포넌트 마운트 될 때 setTimeout으로 시간 지연 후 스프링 애니메이션 설정)
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;
    setTimeout(
      () => (ring1padding.value = withSpring(ring1padding.value + hp(5))),
      100
    );
    setTimeout(
      () => (ring2padding.value = withSpring(ring2padding.value + hp(5.5))),
      300
    );
    setTimeout(() => navigation.navigate("Home"), 2500); // 2.5초 뒤에 페이지 이동
  }, []);

  return (
    <View className="flex-1 justify-center items-center spave-y-10 space-y-10 bg-[#f78153]">
      <StatusBar style="light" />

      {/* 로고 이미지 */}
      <Animated.View
        className="bg-white/20 rounded-full"
        style={{ padding: ring2padding }}
      >
        <Animated.View
          className="bg-white/20 rounded-full"
          style={{ padding: ring1padding }}
        >
          <Image
            source={require("../../assets/images/welcome.png")}
            style={{ width: hp(20), height: hp(20) }}
          />
        </Animated.View>
      </Animated.View>

      {/* title */}
      <View className="flex items-center space-y-2">
        <Text
          style={{ fontSize: hp(2) }}
          className="font-medium text-white tracking-widest"
        >
          오늘 뭐 먹을지 고민된다면?
        </Text>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: hp(15), height: hp(5) }}
        />
      </View>
    </View>
  );
}
