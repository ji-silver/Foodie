import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
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
import Recipes from "../components/recipes";
import { API_KEY } from "@env";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("반찬");
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [recipesFound, setRecipesFound] = useState(true);

  const API_BASE_URL = "http://openapi.foodsafetykorea.go.kr/api";

  useEffect(() => {
    getCategories();
    getRecipes();
  }, []);

  // 카테고리 불러오기
  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${API_KEY}/COOKRCP01/json/1/100`
      );

      if (response?.data?.COOKRCP01?.row) {
        // 카테고리 목록에서 "국&찌개"를 "국"으로 변경
        const fetchedCategories = [
          ...new Set(
            response.data.COOKRCP01.row.map((recipe) =>
              recipe.RCP_PAT2.replace("&찌개", "")
            )
          ),
        ];
        setCategories(fetchedCategories);
      }
    } catch (err) {
      console.log("카테고리 오류:", err.message);
    }
  };

  // 기본(반찬) 선택된 레시피 불러오기
  const getRecipes = async (category = "반찬", search = "") => {
    try {
      let url = `${API_BASE_URL}/${API_KEY}/COOKRCP01/json/1/100/RCP_PAT2=${category}`;

      // 검색어가 있을 시 url에 붙이기
      if (search.trim() !== "") {
        url += `&RCP_NM=${search}`;
      }

      const response = await axios.get(url);

      if (
        response &&
        response.data &&
        response.data.COOKRCP01 &&
        response.data.COOKRCP01.row
      ) {
        let fetchedRecipes = response.data.COOKRCP01.row.map((recipe) => ({
          id: recipe.RCP_SEQ,
          image: recipe.ATT_FILE_NO_MAIN,
          name: recipe.RCP_NM,
        }));

        if (search.trim() !== "") {
          fetchedRecipes = fetchedRecipes.filter((recipe) =>
            recipe.name.includes(search)
          );
        }

        setRecipes(fetchedRecipes);
        setRecipesFound(fetchedRecipes.length > 0);
      } else {
        setRecipes([]);
        setRecipesFound(false); // 레시피가 없다고 표시
      }
    } catch (err) {
      console.log("레시피 오류:", err.message);
    }
  };

  // 카테고리 변경
  const handleChangeCategory = (category) => {
    getRecipes(category);
    setActiveCategory(category);
    setRecipes([]);
  };

  // 검색 버튼 누르면 getRecipes실행
  const handleSearch = () => {
    getRecipes(activeCategory, search);
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
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
          <TouchableOpacity onPress={handleSearch}>
            <View className="bg-white rounded-full p-3">
              <MagnifyingGlassIcon
                size={hp(2.5)}
                strokeWidth={3}
                color="gray"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* 카테고리 */}
        <View>
          <Categories
            categories={categories}
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* 레시피 */}
        <View>
          {recipesFound ? (
            <Recipes recipes={recipes} categories={categories} />
          ) : (
            <Text style={{ fontSize: hp(2) }} className="text-center mt-10">
              검색 결과가 없습니다.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
