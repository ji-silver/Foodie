import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import { categoryData } from "../constants/index";

export default function Categories({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      {/* 가로로 스크롤 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {categories.map((category, index) => {
          /* categoryData에서 현재 카테고리의 정보를 가져오기 */
          const categoryInfo = categoryData.find(
            (data) => data.name === category
          );
          /* 현재 활성화된 카테고리와 이름이 일치하는지 */
          let isActive = category === activeCategory;
          let activeButtonClass = isActive ? "bg-amber-400" : "bg-black/10";
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveCategory(category)}
              className="flex items-center space-y-1"
            >
              <View className={"rounded-full p-[6px] " + activeButtonClass}>
                <Image
                  source={categoryInfo ? categoryInfo.image : null}
                  style={{ width: hp(6), height: hp(6) }}
                  className="rounded-full"
                />
              </View>
              <Text className="text-neutral-600" style={{ fontSize: hp(1.6) }}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
