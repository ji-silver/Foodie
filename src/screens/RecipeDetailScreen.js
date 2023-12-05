import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { CachedImage } from "../helpers/image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_KEY } from "@env";
import Loading from "../components/loading";

export default function RecipeDetailScreen(props) {
  let item = props.route.params;
  const [isFavorite, setFavorite] = useState(false);
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const API_BASE_URL = "http://openapi.foodsafetykorea.go.kr/api";

  useEffect(() => {
    getData(item.name);
  }, []);

  // 레시피 불러오기
  const getData = async (name) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${API_KEY}/COOKRCP01/json/1/1/RCP_NM=${name}`
      );
      if (
        response &&
        response.data &&
        response.data.COOKRCP01 &&
        response.data.COOKRCP01.row
      ) {
        let fetchedRecipes = response.data.COOKRCP01.row.map((recipe) => ({
          id: recipe.RCP_SEQ,
          name: recipe.RCP_NM,
          category: recipe.RCP_PAT2,
          details: recipe.RCP_PARTS_DTLS,
          instructions: getInstructions(recipe),
        }));
        console.log(fetchedRecipes[0]);
        setMeal(fetchedRecipes[0]);
        setLoading(false);
      }
    } catch (err) {
      console.log("카테고리 오류:", err.message);
    }
  };

  // 레시피 따로 저장
  const getInstructions = (recipe) => {
    let instructions = [];

    const sortedInstructions = Object.keys(recipe)
      .filter(
        (key) =>
          key.startsWith("MANUAL") &&
          recipe[key] &&
          !key.startsWith("MANUAL_IMG")
      )
      .sort(
        (a, b) =>
          parseInt(a.replace("MANUAL", "")) - parseInt(b.replace("MANUAL", ""))
      );

    sortedInstructions.forEach((key) => {
      instructions.push({
        text: recipe[key].trim(),
        image: recipe[`MANUAL_IMG${key.replace("MANUAL", "")}`],
      });
    });

    return instructions;
  };

  // 재료 정보 배열
  const mealDetails = meal && meal.details ? meal.details.split(/\s*,\s*/) : [];

  return (
    <ScrollView
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar style="light" />

      {/* 레시피 이미지 */}
      <View className="flex-row justify-center">
        <CachedImage
          uri={item.imageMain}
          style={{
            width: wp(98),
            height: hp(50),
            borderRadius: 53,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            marginTop: 4,
          }}
        />
      </View>

      {/* 버튼 */}
      <View className="w-full absolute flex-row justify-between items-center pt-14">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 ml-5 rounded-full bg-white"
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4} color="#f78153" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFavorite(!isFavorite)}
          className="p-2 mr-5 rounded-full bg-white"
        >
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4}
            color={isFavorite ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>

      {/* 레시피 설명 */}
      {loading ? (
        <Loading size="large" className="mt-16" />
      ) : (
        <View className="px-4 flex justify-between space-y-4 pt-8">
          {/* 이름 */}
          <View className="space-y-2">
            <Text style={{ fontSize: hp(3) }} className="font-bold flex-1">
              {meal.name}
            </Text>
          </View>

          {/* 레시피 정보 */}
          <View className="space-y-4">
            <Text style={{ fontSize: hp(2) }} className="font-bold">
              기본 재료
            </Text>
            <View className="space-y-2 bg-black/5 p-2 rounded-xl">
              {mealDetails.map((detail, index) => {
                const trimmedDetail = detail.trim();
                return (
                  <View
                    key={index}
                    className="flex-row space-x-4 items-center  ml-2"
                  >
                    <View
                      style={{
                        height: hp(1.5),
                        width: hp(1.5),
                      }}
                      className="bg-[#f78153] rounded-full"
                    ></View>
                    <Text key={index} style={{ fontSize: hp(1.8) }}>
                      {trimmedDetail}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 레시피 내용 */}
          <View className="space-y-4">
            <Text style={{ fontSize: hp(2) }} className="font-bold mt-5">
              조리 순서
            </Text>
            {meal &&
              meal.instructions &&
              meal.instructions.map((instruction, index) => (
                <View key={index} className="flex flex-row">
                  {instruction.text && (
                    <Text
                      style={{ fontSize: hp(1.8) }}
                      className="flex-1 mr-5 min-w-[30%]"
                    >
                      {instruction.text}
                    </Text>
                  )}
                  {instruction.image && (
                    <CachedImage
                      uri={instruction.image}
                      className="bg-black/5"
                      style={{
                        width: "100%",
                        height: hp(15),
                        flex: 1,
                        borderRadius: 15,
                      }}
                    />
                  )}
                </View>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
