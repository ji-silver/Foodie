import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Loading(props) {
  return (
    <View className="flex-1 flex justify-center item-center">
      <ActivityIndicator {...props} />
      <Text style={{ fontSize: hp(2) }} className="text-center mt-5">
        맛있는 레시피를 불러오고 있습니다🍳
      </Text>
    </View>
  );
}
