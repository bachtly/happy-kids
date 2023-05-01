import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import { PickupItemModel } from "../../models/PickupModels";
import pickupIcon from "../../../assets/images/pickup-icon.png";
import moment from "moment/moment";
import CustomCard from "../CustomCard";
import LetterStatusText from "../medicine/StatusText";
import React from "react";
import { MedicineLetterStatus } from "../../models/MedicineModels";

const DATE_FORMAT = "DD/MM/YYYY";
const TIME_FORMAT = "hh:mm";

const PickupItem = ({
  item,
  isTeacher
}: {
  item: PickupItemModel;
  isTeacher: boolean;
}) => {
  const router = useRouter();

  return (
    <View>
      <CustomCard
        onPress={() => {
          router.push({
            pathname: `${
              isTeacher ? "teacher" : "parent"
            }/pickup/pickup-detail-screen`,
            params: { id: item.id }
          });
        }}
      >
        <View className={"flex-row space-x-2"}>
          <Image className={"my-auto aspect-square w-16"} source={pickupIcon} />

          <View className={"flex-1 space-y-1"}>
            {isTeacher ? (
              <>
                <Text variant={"labelLarge"} className={""}>
                  {item.studentFullname}
                </Text>
                <Text className={""}>Người đón: {item.pickerFullname}</Text>
              </>
            ) : (
              <Text variant={"labelLarge"} className={""}>
                Người đón: {item.pickerFullname}
              </Text>
            )}
            <Text className={""}>
              Giờ đón: {moment(item.time).format(TIME_FORMAT).toString()}
            </Text>
            <Text>{moment(item.time).format(DATE_FORMAT).toString()}</Text>

            <View>
              {item.status && (
                <LetterStatusText
                  status={item.status as MedicineLetterStatus}
                />
              )}
            </View>
          </View>
        </View>
      </CustomCard>
    </View>
  );
};

export default PickupItem;
