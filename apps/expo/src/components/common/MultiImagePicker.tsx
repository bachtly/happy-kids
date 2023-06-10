import React, { useState, useRef } from "react";
import { View, Image, TouchableHighlight, FlatList } from "react-native";
import { Text, IconButton } from "react-native-paper";
import MyImagePickerMulti from "../ImagePickerMulti";
import { CustomStackFakeDelete, CustomStackFakeDone } from "./CustomStackFake";
import FakeScreenSendWrapper from "./FakeScreenSendWrapper";
import SingleImageView from "./SingleImageView";
import {
  pickMultiImageCameraFunc,
  pickMultiImageFileFunc
} from "../ImagePickerMulti";

interface ImageItem {
  id: number;
  photo: string;
}

interface MultiImagePickerProps {
  images: string[];
  onImagesChange: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiImagePicker = (props: MultiImagePickerProps) => {
  const savedImages: string[] = props.images;
  const _setSavedImages = props.onImagesChange;
  const [images, setImages] = useState<ImageItem[]>(
    savedImages?.map((item, index) => ({ id: index, photo: item })) ?? []
  );
  const [selImages, setSelImages] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(false);
  const flatListRef = useRef<FlatList<ImageItem>>(null);

  const [_, setNextImageId] = useState(savedImages.length);
  const addImage = (photo: string[]) => {
    setNextImageId((curId) => {
      setImages((prev) => [
        ...prev,
        ...photo.map((item, index) => ({ id: curId + index, photo: item }))
      ]);
      return curId + photo.length;
    });
  };

  const directlyAddImage = (photo: string[]) => {
    setNextImageId((curId) => {
      setImages((prev) => {
        const newImgs = [
          ...prev,
          ...photo.map((item, index) => ({ id: curId + index, photo: item }))
        ];

        onDone(newImgs.map((item) => item.photo));

        return newImgs;
      });
      return curId + photo.length;
    });
  };

  const onSelect = (id: number) => {
    setSelImages((prev) => {
      const re = new Set(prev);
      if (!re.delete(id)) re.add(id);
      return re;
    });
  };

  const onDeleteImages = () => {
    setImages((prev) => {
      const re = prev.filter((item) => !selImages.has(item.id));
      setSelImages(new Set());
      return re;
    });
  };

  const resetFields = (_savedImages: string[]) => {
    setSelImages(new Set());
    setImages(_savedImages.map((item, index) => ({ id: index, photo: item })));
    setNextImageId(_savedImages.length);
  };

  const onCloseModal = () => {
    resetFields(savedImages);
    setVisible(false);
  };

  const onDone = (_savedImages: string[]) => {
    _setSavedImages(_savedImages);
    resetFields(_savedImages);
    setVisible(false);
  };

  return (
    <>
      {savedImages.length > 0 && (
        <View className="mb-3 flex w-full flex-row px-0.5">
          {savedImages.slice(0, 3).map((item, index) => {
            return (
              <View className="w-1/3" key={index}>
                <View className="relative aspect-square w-full px-0.5">
                  <View className="absolute h-full w-full">
                    <SingleImageView image={item} />
                  </View>
                  {index === 2 && (
                    <View
                      className="absolute flex h-full w-full items-center justify-center bg-[#00000088]"
                      key={-1}
                    >
                      <Text className="text-white" variant="labelLarge">
                        +{savedImages.length - index}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View className="flex flex-row space-x-2">
        <IconButton
          className="m-0"
          mode="outlined"
          onPress={() => {
            void pickMultiImageCameraFunc(directlyAddImage).catch((e) =>
              console.log(e)
            );
          }}
          icon={"camera"}
        />
        <IconButton
          className="m-0"
          mode="outlined"
          onPress={() => {
            void pickMultiImageFileFunc(directlyAddImage).catch((e) =>
              console.log(e)
            );
          }}
          icon={"attachment"}
        />
        <IconButton
          className="m-0"
          icon={"pencil"}
          mode={"outlined"}
          onPress={() => setVisible(true)}
        />
      </View>

      <FakeScreenSendWrapper
        visible={visible}
        title=""
        onClose={onCloseModal}
        customStackFake={
          selImages.size > 0 ? (
            <CustomStackFakeDelete
              numSelected={selImages.size}
              onBack={() => setSelImages(new Set())}
              onDelete={onDeleteImages}
            />
          ) : (
            <CustomStackFakeDone
              title="Thêm ảnh"
              onBack={onCloseModal}
              onDone={() => onDone(images.map((item) => item.photo))}
            />
          )
        }
      >
        <View className={"flex-1"}>
          <View className="bg-white px-1 py-1">
            <FlatList
              numColumns={3}
              contentContainerStyle={{ rowGap: 4 }}
              data={[...images]}
              renderItem={({ item }) => (
                <View className="aspect-square w-1/3 px-0.5" key={item.id}>
                  <TouchableHighlight
                    className="h-full w-full"
                    onPress={() => onSelect(item.id)}
                  >
                    <View className="h-full w-full">
                      <Image
                        source={{ uri: `data:image/jpeg;base64,${item.photo}` }}
                        className={"h-full w-full"}
                      />
                      {selImages.has(item.id) && (
                        <View className="absolute flex h-full w-full items-center justify-center bg-[#00000088]">
                          <Text className="text-white" variant="labelLarge">
                            &#x2713;
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableHighlight>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              ref={flatListRef}
              onContentSizeChange={() =>
                images.length > 0 && flatListRef?.current?.scrollToEnd()
              }
            />
          </View>
          <View className="mx-1 my-3">
            <MyImagePickerMulti setImageData={addImage} />
          </View>
        </View>
      </FakeScreenSendWrapper>
    </>
  );
};

export default MultiImagePicker;
