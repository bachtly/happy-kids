import { useSearchParams } from "expo-router";
import moment, { Moment } from "moment";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { ScrollView, View } from "react-native";
import { TextInput } from "react-native-paper";
import DateRangePicker from "../../../src/components/date-picker/DateRangePicker";
import type { Item } from "../../../src/components/medicine/addLetter/MedicineList";
import { api } from "../../../src/utils/api";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import MedicineBatchList from "../../../src/components/medicine/addLetter/MedicineBatchList";
import { GetTimeNumber } from "../../../src/components/medicine/TimeInDay";
import { SYSTEM_ERROR_MESSAGE } from "../../../src/utils/constants";
import Body from "../../../src/components/Body";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import { ErrorContext } from "../../../src/utils/error-context";
import CustomWhiteStackScreen from "../../../src/components/CustomWhiteStackScreen";
import CustomTitle from "../../../src/components/common/CustomTitle";
import WhiteBody from "../../../src/components/WhiteBody";
import LoadingBar from "../../../src/components/common/LoadingBar";

const AddLetter = () => {
  const now = moment();
  const { studentId } = useSearchParams();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [dateStart, setDateStart] = useState<Moment | null>(now);
  const [dateEnd, setDateEnd] = useState<Moment | null>(now);

  const [medicineList, setMedicineList] = useState<Item[]>([]);
  const [batchList, setBatchList] = useState<Array<Moment | null>>([now]);

  const [note, setNote] = useState("");

  const postMedicineLetterMutation =
    api.medicine.postMedicineLetter.useMutation({
      onError: ({ message, data }) =>
        trpcErrorHandler(() => {})(
          data?.code ?? "",
          message,
          errorContext,
          authContext
        ),
      onSuccess: () => router.back()
    });

  const onSubmit = () => {
    if (!dateStart || !dateEnd) {
      trpcErrorHandler(() => {})(
        "",
        "Vui lòng chọn ngày dặn thuốc",
        errorContext,
        authContext
      );
      return;
    }

    if (medicineList.length == 0) {
      trpcErrorHandler(() => {})(
        "",
        "Vui lòng thêm thuốc",
        errorContext,
        authContext
      );
      return;
    }

    if (note === "") {
      trpcErrorHandler(() => {})(
        "",
        "Vui lòng thêm ghi chú",
        errorContext,
        authContext
      );
      return;
    }
    postMedicineLetterMutation.mutate({
      studentId: studentId,
      startDate: dateStart.toDate(),
      endDate: dateEnd.toDate(),
      medicines: medicineList.map((item) => ({
        id: "",
        name: item.medItem.name,
        amount: item.medItem.amount,
        photo: item.medItem.photo,
        time: GetTimeNumber(
          batchList[item.batchNumber]?.hours() ?? 0,
          batchList[item.batchNumber]?.minutes() ?? 0
        ),
        batchNumber: item.batchNumber
      })),
      note: note
    });
  };

  if (!studentId)
    trpcErrorHandler(() => {})(
      "",
      SYSTEM_ERROR_MESSAGE,
      errorContext,
      authContext
    );

  return (
    <Body>
      <CustomWhiteStackScreen
        title={"Tạo đơn dặn thuốc"}
        addButtonHandler={() => onSubmit()}
      />
      <LoadingBar isFetching={postMedicineLetterMutation.isLoading} />
      <ScrollView className="flex-1">
        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Ngày uống thuốc"} />

            <View className="flex flex-row items-center justify-center pb-4 pt-1">
              <DateRangePicker
                initTimeStart={dateStart}
                initTimeEnd={dateEnd}
                setTimeStart={setDateStart}
                setTimeEnd={setDateEnd}
              />
            </View>
          </WhiteBody>
        </View>

        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Đơn thuốc"} />

            <View className={"mb-3"}>
              <MedicineBatchList
                medicineList={medicineList}
                setMedicineList={setMedicineList}
                batchList={batchList}
                setBatchList={setBatchList}
              />
            </View>
          </WhiteBody>
        </View>

        <View className={"mb-3 flex-1"}>
          <WhiteBody>
            <CustomTitle title={"Ghi chú"} />

            <TextInput
              className={"mx-3 mb-3 text-sm"}
              placeholder="Nhập ghi chú cho đơn dặn thuốc"
              mode={"outlined"}
              multiline
              onChangeText={(input) => setNote(input)}
              value={note}
            />
          </WhiteBody>
        </View>
      </ScrollView>
    </Body>
  );
};

export default AddLetter;
