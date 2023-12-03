import { View, Text, ScrollView, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  SpeakerWaveIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import Categories from "../components/categories";
import axios from "axios";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);

  // 마운트 되면 불러오기
  useEffect(() => {
    getCategories();
    console.log(categories);
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "http://openapi.foodsafetykorea.go.kr/api/758aca942efa483285a7/COOKRCP01/json/1/1000"
      );

      if (
        response &&
        response.data &&
        response.data.COOKRCP01 &&
        response.data.COOKRCP01.row
      ) {
        const fetchedCategories = response.data.COOKRCP01.row.map(
          (recipe) => recipe.RCP_PAT2
        );

        // Set을 사용하여 중복된 값 제거
        const uniqueCategories = [...new Set(fetchedCategories)];

        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.log("Error categories:", err.message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      {/* 스크롤 막대 없애기 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <Image
            source={require("../../assets/images/avatar.png")}
            style={{ height: hp(5), width: hp(5) }}
          />
          <SpeakerWaveIcon color="#f78153" size={hp(3)} />
        </View>

        <View className="mx-4 space-y-2 mb-2">
          <Text
            style={{ fontSize: hp(3) }}
            className="text-neutral-600 font-semibold"
          >
            <Text className="text-[#f78153]">지은</Text>님! 이 레시피는
            어떠신가요?
          </Text>
        </View>

        {/* 검색 */}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder="검색어를 입력해주세요"
            placeholderTextColor={"gray"}
            style={{ fontSize: hp(2) }}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
          />
          <View className="bg-white rounded-full p-3">
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </View>
        </View>

        {/* 카테고리 */}
        <View>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
