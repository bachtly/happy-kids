import { Pressable } from "react-native";
import { Moment } from "moment";
import { useState } from "react";
import { TextInput, TextInputProps, useTheme } from "react-native-paper";

import DatePickerDialog from "../date-picker/DatePickerDialog";

interface PropsType {
  date: Moment | null;
  setDate: (date: Moment | null) => void;
  textInputProps?: TextInputProps;
}

const DatePickerTextInput = (props: PropsType) => {
  const { colors } = useTheme();
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <>
      <Pressable className="flex-grow" onPress={() => setDialogVisible(true)}>
        {({ pressed }) => (
          <TextInput
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
            {...props.textInputProps}
          />
        )}
      </Pressable>
      <DatePickerDialog
        initTime={props.date}
        setTime={props.setDate}
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
      />
    </>
  );
};
export default DatePickerTextInput;
