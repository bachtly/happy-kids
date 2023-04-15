import { useState } from "react";
import { View, Text } from "react-native";
import UnderlineButton from "./UnderlineButton";

const EllipsedText = (props: { lines: number; content: string }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <View>
      <Text
        numberOfLines={showAll ? 0 : props.lines}
        onTextLayout={(e) => {
          if (e.nativeEvent.lines.length <= props.lines) setShowAll(true);
        }}
      >
        {props.content}
      </Text>
      {showAll ? (
        <></>
      ) : (
        <View className={"self-start"}>
          <UnderlineButton
            onPress={() => {
              const tmp = showAll;
              setShowAll(!tmp);
            }}
          >
            ... Xem thêm
          </UnderlineButton>
        </View>
      )}
    </View>
  );
};

export default EllipsedText;
