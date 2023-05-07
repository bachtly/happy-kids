import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Portal } from "react-native-paper";
import ImageView from "react-native-image-viewing";

const SingleImageView = ({ image }: { image: string }) => {
  const [imgVisible, setImgVisible] = useState(false);
  const imgSrc = {
    uri: `data:image/jpeg;base64,${image}`
  };
  return (
    <>
      <TouchableOpacity
        className={"h-full w-full"}
        onPress={() => setImgVisible(true)}
      >
        <Image source={imgSrc} className={"h-full w-full"} />
      </TouchableOpacity>
      <Portal>
        <ImageView
          images={[imgSrc]}
          keyExtractor={(_, index) => String(index)}
          imageIndex={0}
          visible={imgVisible}
          onRequestClose={() => setImgVisible(false)}
        />
      </Portal>
    </>
  );
};

export default SingleImageView;
