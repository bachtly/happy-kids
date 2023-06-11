import { useRouter, useSearchParams } from "expo-router";
import moment, { Moment } from "moment";

import React, { useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Avatar,
  Text,
  TextInput,
  useTheme,
  IconButton
} from "react-native-paper";
import TimePicker from "../../../src/components/TimePicker";
import { api } from "../../../src/utils/api";
import DatePicker from "../../../src/components/date-picker/DatePicker";
import SelectPickerModal from "../../../src/components/pickup/SelectPickerModal";
import { RelativeModel } from "../../../src/models/PickupModels";
import { ErrorContext } from "../../../src/utils/error-context";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import CustomWhiteStackScreen from "../../../src/components/CustomWhiteStackScreen";
import WhiteBody from "../../../src/components/WhiteBody";
import CustomTitle from "../../../src/components/common/CustomTitle";

const DEFAULT_TIME = moment(moment.now());

const AddPickupScreen = () => {
  const { studentId } = useSearchParams();
  const router = useRouter();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const { colors } = useTheme();

  const [date, setDate] = useState<Moment>(DEFAULT_TIME);
  const [time, setTime] = useState<Moment>(DEFAULT_TIME);
  const [note, setNote] = useState("");
  const [picker, setPicker] = useState<RelativeModel | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const pickupMutation = api.pickup.insertPickupLetter.useMutation({
    onSuccess: () => router.back(),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const closeModal = () => {
    setModalVisible(false);
  };

  const submitModal = (picker: RelativeModel) => {
    setPicker(picker);
    setModalVisible(false);
  };

  const confirmCreateLetter = () => {
    studentId &&
      pickupMutation.mutate({
        pickerId: picker?.id ?? "",
        date: combineDateTime(date, time).toDate(),
        studentId: studentId,
        note: note,
        classId: authContext.classId ?? ""
      });
  };

  const combineDateTime = (date: Moment, time: Moment) => {
    return moment(date.format("YYYY-MM-DD") + " " + time.format("hh:mm:ss"));
  };

  return (
    <View className="flex-1">
      <CustomWhiteStackScreen
        title={"Tạo đơn đón về"}
        rightButtonHandler={() => confirmCreateLetter()}
      />

      <ScrollView className="flex-1">
        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Ngày giờ đón"} />

            <View className="flex flex-row items-center justify-center pb-4 pt-1">
              <DatePicker initTime={date} setTime={setDate} />
            </View>

            <View className="flex flex-row items-center justify-center pb-4 pt-1">
              <TimePicker time={time} setTime={setTime} />
            </View>
          </WhiteBody>
        </View>

        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle
              title={"Người đón"}
              rightButton={
                <IconButton
                  icon={"pencil"}
                  iconColor={colors.primary}
                  size={16}
                  mode={"outlined"}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                />
              }
            />

            <View className="px-3 pb-3">
              {picker && (
                <View className={"flex-row space-x-3"}>
                  <Avatar.Image
                    className={"my-auto"}
                    size={42}
                    source={{
                      uri: picker.avatar
                        ? `data:image/jpeg;base64,${picker.avatar}`
                        : ""
                    }}
                  />
                  <View>
                    <Text className={""} variant={"labelLarge"}>
                      {picker.fullname}
                    </Text>
                    <Text className={""} variant={"bodyMedium"}>
                      {picker.phone}
                    </Text>
                  </View>
                </View>
              )}

              {!picker && <Text>Chưa có người đón</Text>}
            </View>
          </WhiteBody>
        </View>

        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Ghi chú"} />

            <TextInput
              className={"mx-3 mb-3 text-sm"}
              placeholder="Nhập ghi chú"
              mode={"outlined"}
              multiline
              onChangeText={(input) => setNote(input)}
              value={note}
            />
          </WhiteBody>
        </View>
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
