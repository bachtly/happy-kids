import { View } from "react-native";
import { TextInput, TextInputProps, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface PropsType {
  label?: string;
  text: string;
  setText: (text: string) => void;
  placeholder: string;
  icon?: string;
  textInputProps?: TextInputProps;
  error?: string;
}

const EditableFormField = (props: PropsType) => {
  const { colors } = useTheme();
  const { error } = props;
  return (
    <>
      <View className="flex-row items-center gap-x-2">
        {props.icon && <Icon name={props.icon} size={20} />}
        <TextInput
          label={props.label}
          mode={"outlined"}
          className={"flex-grow text-sm"}
          value={props.text}
          onChangeText={props.setText}
          placeholder={props.placeholder}
          error={error ? error !== "" : undefined}
          {...props.textInputProps}
        />
      </View>
      {error && (
        <Text className="mt-1 text-sm" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
      <View className="h-3" />
    </>
  );
};

export default EditableFormField;
