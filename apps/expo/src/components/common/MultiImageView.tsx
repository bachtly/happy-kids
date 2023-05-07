import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Portal } from "react-native-paper";
import ImageView from "react-native-image-viewing";

import MyImagePicker from "../ImagePicker";

type MultiImageViewProps = {
  images: string[];
};

const MultiImageView = ({ images }: MultiImageViewProps) => {
  const [imgVisible, setImgVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const photoList = images.filter((item) => item.trim() != "");
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {photoList.map((image, key) => (
          <View className="h-24 w-24" key={key}>
            <MyImagePicker
              imageData={image}
              setImageData={() => {}}
              onPress={() => {
                setImgIdx(key);
                setImgVisible(true);
              }}
            />
          </View>
        ))}
      </ScrollView>
      <Portal>
        <ImageView
          images={photoList.map((item) => ({
            uri: `data:image/jpeg;base64,${item}`
          }))}
          keyExtractor={(_, index) => String(index)}
          imageIndex={imgIdx}
          visible={imgVisible}
          onRequestClose={() => setImgVisible(false)}
        />
      </Portal>
    </>
  );
};

export default MultiImageView;
