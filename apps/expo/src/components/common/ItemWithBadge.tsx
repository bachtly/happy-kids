import { ReactNode } from "react";
import { View } from "react-native";
import { Badge } from "react-native-paper";

const ItemWithBadge = ({
  children,
  n,
  offset
}: {
  children: ReactNode;
  n?: number;
  offset?: number;
}) => {
  if (!offset) offset = -2;

  return (
    <View>
      {children}
      {n ? (
        <Badge
          style={{ position: "absolute", top: offset, right: offset }}
          size={10}
        >
          {n}
        </Badge>
      ) : (
        <Badge
          style={{ position: "absolute", top: offset, right: offset }}
          size={10}
        />
      )}
    </View>
  );
};

export default ItemWithBadge;
