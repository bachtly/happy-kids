import React from "react";
import { ScrollView, View } from "react-native";
import MyImagePicker from "../ImagePicker";

type MultiImageViewProps = {
  images: string[];
};

const MultiImageView = ({ images }: MultiImageViewProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {images
        .filter((item) => item.trim() != "")
        .map((image, key) => (
          <View className="h-24 w-24" key={key}>
            <MyImagePicker
              imageData={image}
              setImageData={() => {}}
              disabled={true}
            />
          </View>
        ))}
    </ScrollView>
  );
};

export default MultiImageView;
