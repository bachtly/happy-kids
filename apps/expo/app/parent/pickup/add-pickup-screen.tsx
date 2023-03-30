import { Stack, useRouter, useSearchParams } from "expo-router";
import moment, { Moment } from "moment";

import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import TimePicker from "../../../src/components/TimePicker";
import { api } from "../../../src/utils/api";
import DatePicker from "../../../src/components/DatePicker";
import SelectPickerModal from "../../../src/components/pickup/SelectPickerModal";
import { RelativeModel } from "../../../src/models/PickupModels";

const DEFAULT_TIME = moment(moment.now());

const AddPickupScreen = () => {
  const { studentId } = useSearchParams();
  const router = useRouter();

  const [date, setDate] = useState<Moment | null>(DEFAULT_TIME);
  const [time, setTime] = useState<Moment | null>(null);
  const [note, setNote] = useState("");
  const [picker, setPicker] = useState<RelativeModel | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const pickupMutation = api.pickup.insertPickupLetter.useMutation({});

  const closeModal = () => {
    setModalVisible(false);
  };

  const submitModal = (picker: RelativeModel) => {
    setPicker(picker);
    setModalVisible(false);
  };

  const confirmCreateLetter = () => {
    if (picker && date && time && studentId && note) {
      pickupMutation.mutate({
        pickerId: picker.id,
        date: combineDateTime(date, time).toDate(),
        studentId: studentId,
        note: note
      });
      router.back();
    }
  };

  const combineDateTime = (date: Moment, time: Moment) => {
    return moment(date.format("YYYY-MM-DD") + " " + time.format("hh:mm:ss"));
  };

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: "Tạo đơn đón về"
        }}
      />

      <ScrollView className="flex-1 bg-white p-4">
        <View className="mb-4 h-12 flex-row justify-between">
          <Text variant={"titleMedium"}>Ngày đón</Text>
          <DatePicker initTime={date} setTime={setDate} />
        </View>

        <View className="mb-4 h-12 flex-row justify-between">
          <Text variant={"titleMedium"}>Giờ đón</Text>
          <TimePicker time={time} setTime={setTime} />
        </View>

        <View className="mb-4 space-y-4">
          <Text variant={"titleMedium"}>Người đón</Text>

          {picker && (
            <View className={"flex-row space-x-3"}>
              <Avatar.Image
                className={"my-auto"}
                size={42}
                source={{ uri: picker.avatarUrl ?? "" }}
              />
              <View>
                <Text className={""} variant={"titleSmall"}>
                  {picker.fullname}
                </Text>
                <Text className={"italic"} variant={"bodyMedium"}>
                  {picker.phone}
                </Text>
              </View>
            </View>
          )}
          <Button mode={"outlined"} onPress={() => setModalVisible(true)}>
            {picker ? "Đổi người đón" : "Chọn"}
          </Button>
        </View>

        <View className={"mb-4"}>
          <Text variant={"titleMedium"} className={"mb-2"}>
            Ghi chú
          </Text>

          <TextInput
            className={"text-sm"}
            placeholder="Nhập ghi chú"
            mode={"outlined"}
            multiline
            onChangeText={(input) => setNote(input)}
            value={note}
          />
        </View>

        <Button mode={"contained"} onPress={() => confirmCreateLetter()}>
          Xác nhận
        </Button>
      </ScrollView>

      <SelectPickerModal
        visible={modalVisible}
        close={closeModal}
        submit={submitModal}
      />
    </View>
  );
};

export default AddPickupScreen;
