import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import MyImagePicker from "../ImagePicker";

type ImageItem = {
  id: number;
  photo: string;
};

type MultiImagePickerProps = {
  onImagesChange: (images: string[]) => void;
};

const MultiImagePicker = (props: MultiImagePickerProps) => {
  const [images, setImages] = useState<ImageItem[]>([{ id: 0, photo: "" }]);
  const [_, setNextImageId] = useState(1);
  const addImage = (id: number, photo: string) => {
    setNextImageId((prevId) => {
      setImages((prev) =>
        prev
          .map((item) => {
            if (item.id !== id) return item;
            return { ...item, photo: photo };
          })
          .filter((item) => item.photo !== "")
          .concat({ id: prevId, photo: "" })
      );
      return prevId + 1;
    });
  };

  useEffect(() => {
    props.onImagesChange(images.map((image) => image.photo));
  }, [images]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {images.map((image) => (
        <View className="h-24 w-24" key={image.id}>
          <MyImagePicker
            imageData={image.photo}
            setImageData={(photo) => addImage(image.id, photo)}
            disabled={image.photo !== ""}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default MultiImagePicker;
