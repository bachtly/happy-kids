import React, { useState, useRef } from "react";
import { View, Image, TouchableHighlight, FlatList } from "react-native";
import { Text, IconButton } from "react-native-paper";
import MyImagePickerMulti from "../ImagePickerMulti";
import { CustomStackFakeDelete, CustomStackFakeDone } from "./CustomStackFake";
import FakeScreenSendWrapper from "./FakeScreenSendWrapper";
interface ImageItem {
  id: number;
  photo: string;
}

interface MultiImagePickerProps {
  images: string[];
  onImagesChange: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiImagePicker = (props: MultiImagePickerProps) => {
  const _savedImages = props.images;
  const _setSavedImages = props.onImagesChange;
  const [_images, _setImages] = useState<ImageItem[]>(
    _savedImages.map((item, index) => ({ id: index, photo: item }))
  );
  const [_selImages, _setSelImages] = useState<Set<number>>(new Set());
  const [visible, setVisible] = useState(false);
  const flatListRef = useRef<FlatList<ImageItem>>(null);

  const [_, setNextImageId] = useState(_savedImages.length);
  const addImage = (photo: string[]) => {
    setNextImageId((curId) => {
      _setImages((prev) => [
        ...prev,
        ...photo.map((item, index) => ({ id: curId + index, photo: item }))
      ]);
      return curId + photo.length;
    });
  };

  const onSelect = (id: number) => {
    _setSelImages((prev) => {
      const re = new Set(prev);
      if (!re.delete(id)) re.add(id);
      return re;
    });
  };

  const onDeleteImages = () => {
    _setImages((prev) => {
      const re = prev.filter((item) => !_selImages.has(item.id));
      _setSelImages(new Set());
      return re;
    });
  };

  const resetFields = (_savedImages: string[]) => {
    _setSelImages(new Set());
    _setImages(_savedImages.map((item, index) => ({ id: index, photo: item })));
    setNextImageId(_savedImages.length);
  };

  const onCloseModal = () => {
    resetFields(_savedImages);
    setVisible(false);
  };

  const onDone = () => {
    const _savedImages = _images.map((item) => item.photo);
    _setSavedImages(_savedImages);
    resetFields(_savedImages);
    setVisible(false);
  };
  return (
    <>
      {_savedImages.length > 0 && (
        <View className="mb-3 flex w-full flex-row px-0.5">
          {_savedImages.slice(0, 3).map((item, index) => {
            return (
              <View className="w-1/3">
                <View className="relative aspect-square w-full px-0.5">
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${item}` }}
                    className="absolute h-full w-full"
                  />
                  {index === 2 && (
                    <View className="absolute flex h-full w-full items-center justify-center bg-[#00000088]">
                      <Text className="text-white" variant="labelLarge">
                        +{_savedImages.length - index}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
      <IconButton
        className="-mt-1"
        mode="outlined"
        onPress={() => setVisible(true)}
        icon={"camera"}
      />
      <FakeScreenSendWrapper
        visible={visible}
        title=""
        onClose={onCloseModal}
        customStackFake={
          _selImages.size > 0 ? (
            <CustomStackFakeDelete
              numSelected={_selImages.size}
              onBack={() => _setSelImages(new Set())}
              onDelete={onDeleteImages}
            />
          ) : (
            <CustomStackFakeDone
              title="Thêm ảnh"
              onBack={onCloseModal}
              onDone={onDone}
            />
          )
        }
      >
        <View className="flex-1 bg-white px-0.5 py-1">
          <FlatList
            numColumns={3}
            contentContainerStyle={{ rowGap: 4 }}
            data={[..._images, { id: -1, photo: "" }]}
            renderItem={({ item }) => {
              return item.id !== -1 ? (
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
                      {_selImages.has(item.id) && (
                        <View className="absolute flex h-full w-full items-center justify-center bg-[#00000088]">
                          <Text className="text-white" variant="labelLarge">
                            &#x2713;
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableHighlight>
                </View>
              ) : (
                <View className="aspect-square w-1/3 px-0.5" key={-1}>
                  <MyImagePickerMulti setImageData={addImage} />
                </View>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />
        </View>
      </FakeScreenSendWrapper>
    </>
  );
};

export default MultiImagePicker;
