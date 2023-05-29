import React, { useState } from "react";
import { ScrollView, TouchableHighlight, View, Image } from "react-native";
import { Portal } from "react-native-paper";
import ImageView from "react-native-image-viewing";

type MultiImageViewProps = {
  images: string[];
  customStyle?: string;
};

const MultiImageView = ({ images, customStyle }: MultiImageViewProps) => {
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
          <View className={customStyle ?? "h-24 w-24"} key={key}>
            <TouchableHighlight
              className="h-full w-full"
              onPress={() => {
                setImgIdx(key);
                setImgVisible(true);
              }}
            >
              <Image
                className="h-full w-full"
                source={{
                  uri: `data:image/jpeg;base64,${image}`
                }}
              />
            </TouchableHighlight>
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
