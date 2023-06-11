import React, { FC, useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { api } from "../../utils/api";
import OptionListModal from "../OptionListModal";
import {
  ACTIVITIES,
  ACTIVITIES_VERBOSE_MAP,
  DailyRemarkActivity,
  VERBOSE_ACTIVITIES_MAP
} from "../../models/RemarkModels";
import DropDownButton from "../DropDownButton";
import { DailyRemarkModel } from "../../models/DailyRemarkModels";
import moment from "moment";
import { useAuthContext } from "../../utils/auth-context-provider";
import { ErrorContext } from "../../utils/error-context";
import { trpcErrorHandler } from "../../utils/trpc-error-handler";
import FakeScreenSendWrapper from "../common/FakeScreenSendWrapper";
import WhiteBody from "../WhiteBody";
import CustomTitle from "../common/CustomTitle";
import Body from "../Body";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

type AddDailyRemarkModalProps = {
  visible: boolean;
  close: () => void;
  submit: () => void;
  remark: DailyRemarkModel;
};

type ActivityObject = {
  type: DailyRemarkActivity | null;
  content: string;
};

const AddDailyRemarkModal: FC<AddDailyRemarkModalProps> = (props) => {
  const { visible, close, submit, remark } = props;

  const { colors } = useTheme();

  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [activityObjs, setActivityObjs] = useState<
    { id: number; activityObj: ActivityObject }[]
  >(
    remark.activities.length > 0
      ? remark.activities.map((item, idx) => {
          return {
            id: idx,
            activityObj: {
              type: item.activity ?? null,
              content: item.content ?? ""
            }
          };
        })
      : [{ id: 0, activityObj: { type: null, content: "" } }]
  );

  useEffect(() => {
    visible &&
      setActivityObjs(
        remark.activities.length > 0
          ? remark.activities.map((item, idx) => {
              return {
                id: idx,
                activityObj: {
                  type: item.activity ?? null,
                  content: item.content ?? ""
                }
              };
            })
          : [{ id: 0, activityObj: { type: null, content: "" } }]
      );
  }, [visible]);

  const remarkMutation = api.dailyRemark.insertDailyRemarkActivity.useMutation({
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  const insertActivity = () => {
    const activities = activityObjs.filter(
      (activity) =>
        activity.activityObj.type != null &&
        activity.activityObj.content.trim() !== ""
    );

    activities.length > 0 &&
      remarkMutation.mutate({
        activities: activities.map((item) => item.activityObj),
        remarkId: remark.id,
        date: remark.date ?? moment().toDate(),
        studentId: remark.studentId ?? null,
        classId: authContext.classId ?? ""
      });

    submit();
  };

  const updateActivityObject = (
    idx: number,
    activity?: DailyRemarkActivity | null,
    content?: string
  ) => {
    console.log(activityObjs);

    if (
      activity &&
      activityObjs.filter(
        (item) => item.activityObj.type === activity && idx !== item.id
      ).length > 0
    ) {
      trpcErrorHandler(() => {})(
        "",
        `Vui lòng không chọn hai hoạt động trùng lặp nhau. (Hoạt động ${
          ACTIVITIES_VERBOSE_MAP.get(activity ?? "Other") ?? ""
        })`,
        errorContext,
        authContext
      );
      return;
    }

    const oldActivityObjs = activityObjs.map((act) => {
      if (act.id == idx) {
        return {
          id: idx,
          activityObj: {
            type: activity ?? act.activityObj.type,
            content: content ?? act.activityObj.content
          }
        };
      }

      return act;
    });

    console.log("Updating to...", idx, activity, content);

    setActivityObjs(oldActivityObjs);
  };

  const removeActivityObject = (idx: number) => {
    console.log(activityObjs);
    console.log("REmoving", idx);
    activityObjs.length > 1 &&
      setActivityObjs(activityObjs.filter((act) => act.id != idx));
  };

  return (
    <FakeScreenSendWrapper
      visible={visible}
      title="Thêm nhận xét"
      onClose={() => close()}
      sendButtonHandler={() => insertActivity()}
    >
      <Body>
        <ScrollView className={"flex-1"}>
          {activityObjs.map((obj, key) => (
            <View className={"mb-3 flex-1"} key={obj.id}>
              <Activity
                keyIdx={key}
                index={obj.id}
                activityObj={obj.activityObj}
                updateActivityObject={updateActivityObject}
                removeActivityObject={removeActivityObject}
              />
            </View>
          ))}

          <View className={"mt-3 items-center"}>
            <AntDesign
              name={"pluscircleo"}
              size={35}
              color={colors.primary}
              onPress={() => {
                const oldObj = activityObjs;
                const newId = Math.max(...oldObj.map((item) => item.id)) + 1;
                setActivityObjs([
                  ...oldObj,
                  { id: newId, activityObj: { type: null, content: "" } }
                ]);
              }}
            />
          </View>
        </ScrollView>
      </Body>
    </FakeScreenSendWrapper>
  );
};

const Activity = ({
  keyIdx,
  index,
  activityObj,
  updateActivityObject,
  removeActivityObject
}: {
  keyIdx: number;
  index: number;
  activityObj: ActivityObject;
  updateActivityObject: (
    idx: number,
    activity?: DailyRemarkActivity | null,
    content?: string
  ) => void;
  removeActivityObject: (idx: number) => void;
}): React.ReactElement => {
  const { colors } = useTheme();
  const idx = index;
  const [innerContent, setInnerContent] = useState(activityObj.content);
  const [act, setAct] = useState<DailyRemarkActivity | null>(activityObj.type);
  const [activityModalVisible, setActivityModalVisible] = useState(false);

  useEffect(() => {
    updateActivityObject(idx, act, innerContent);
  }, [innerContent, act]);

  useEffect(() => {
    setInnerContent(activityObj.content);
    setAct(activityObj.type);
  }, []);

  return (
    <WhiteBody>
      <CustomTitle
        title={`Hoạt động ${keyIdx + 1}`}
        rightButton={
          <Ionicons
            name={"remove-circle-outline"}
            style={{
              color: colors.onSurfaceDisabled
            }}
            size={24}
            onPress={() => {
              removeActivityObject(idx);
            }}
          />
        }
      />

      <View className={"mx-3 mb-3 w-1/2"}>
        <DropDownButton
          classNameStr={"text-left"}
          onPress={() => setActivityModalVisible(true)}
        >
          {act ? ACTIVITIES_VERBOSE_MAP.get(act ?? "") : "Chọn hoạt động"}
        </DropDownButton>
      </View>

      <TextInput
        className={"mx-3 mb-3 text-sm"}
        placeholder="Nhập nội dung nhận xét"
        mode={"outlined"}
        multiline
        onChangeText={(input) => setInnerContent(input)}
        value={innerContent}
      />

      <OptionListModal
        options={ACTIVITIES.map(
          (act) => ACTIVITIES_VERBOSE_MAP.get(act) ?? "Other"
        )}
        visible={activityModalVisible}
        close={() => setActivityModalVisible(false)}
        submit={(value) => {
          console.log("Activity received", value);
          setAct(
            (VERBOSE_ACTIVITIES_MAP.get(value) ??
              "Other") as DailyRemarkActivity
          );
          setActivityModalVisible(false);
        }}
      />
    </WhiteBody>
  );
};

export default AddDailyRemarkModal;
