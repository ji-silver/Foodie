import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MasonryList from "@react-native-seoul/masonry-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./loading";
import { CachedImage } from "../helpers/image";

export default function Recipes({ categories, recipes }) {
  return (
    <View className="mx-4 space-y-3">
      {categories.length === 0 || recipes.length === 0 ? (
        <Loading size="large" className="mt-20" color="#f78153" />
      ) : (
        // masonry 레이아웃
        <MasonryList
          data={recipes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }) => <RecipeCard item={item} index={i} />}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  );
}

const RecipeCard = ({ item, index }) => {
  let isEven = index % 2 == 0; // 짝수인지 아닌지 확인 후 padding 주기
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .duration(600)
        .springify()
        .damping(12)}
    >
      <Pressable
        style={{
          width: "100%",
          paddingLeft: isEven ? 0 : 8,
          paddingRight: isEven ? 8 : 0,
        }}
        className="flex justify-center mb-5 space-y-1"
      >
        <CachedImage
          uri={item.image}
          className="bg-black/5"
          style={{
            width: "100%",
            height: index % 3 === 0 ? hp(25) : hp(35),
            borderRadius: 20,
          }}
        />
        <Text style={{ fontSize: hp(1.8) }} className="ml-2">
          {item.name}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
