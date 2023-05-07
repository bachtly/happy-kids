import { View } from "react-native";
import { ProgressBar } from "react-native-paper";

interface PropsType {
  isFetching: boolean;
}

const LoadingBar = (props: PropsType) => {
  return (
    <View className="relative z-10">
      {props.isFetching && (
        <ProgressBar className="absolute top-0" indeterminate visible={true} />
      )}
    </View>
  );
};
export default LoadingBar;
