import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import Animated from "react-native-reanimated";

// 이미지를 로컬 스토리지에 캐시
export const CachedImage = (props) => {
  const [cachedSource, setCachedSource] = useState(null);
  const { uri } = props;

  useEffect(() => {
    // 로컬 스토리지에서 이미지를 가져오고 캐시된 이미지가 있으면 setCachedSource호출
    // 그렇지 않으면 uri에서 이미지 가져오기
    const getCachedImage = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);
        if (cachedImageData) {
          setCachedSource({ uri: cachedImageData });
        } else {
          const response = await fetch(uri);
          const imageBlob = await response.blob();
          const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
          await AsyncStorage.setItem(uri, base64Data);
          setCachedSource({ uri: base64Data });
        }
      } catch (error) {
        console.error("이미지 캐싱 오류:", error);
        setCachedSource({ uri });
      }
    };

    getCachedImage();
  }, []);

  return <Animated.Image source={cachedSource} {...props} />;
};
