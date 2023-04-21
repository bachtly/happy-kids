import { Pressable, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Moment } from "moment";
import { useState } from "react";
import DatePickerDialog from "../date-picker/DatePickerDialog";
import { TextInput, useTheme } from "react-native-paper";

interface PropsType {
  date: Moment | null;
  setDate: (date: Moment | null) => void;
}

const BirthdateFormField = (props: PropsType) => {
  const { colors } = useTheme();
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <View className="mb-3 flex-row items-center gap-x-2">
      <Icon style={{ marginRight: 2 }} name={"birthday-cake"} size={20} />
      <Pressable className="flex-grow" onPress={() => setDialogVisible(true)}>
        {({ pressed }) => (
          <TextInput
            label={"Ngày sinh"}
            mode={"outlined"}
            className={"flex-grow text-sm"}
            value={
              props.date
                ? props.date.format("DD/MM/YYYY").toString()
                : "__/__/____"
            }
            editable={false}
            outlineStyle={
              pressed
                ? { borderColor: colors.primary, borderWidth: 2 }
                : undefined
            }
            theme={
              pressed
                ? { colors: { onSurfaceVariant: colors.primary } }
                : undefined
            }
          />
        )}
      </Pressable>
      <DatePickerDialog
        initTime={props.date}
        setTime={props.setDate}
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
      />
    </View>
  );
};

export default BirthdateFormField;
