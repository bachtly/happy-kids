import { Card, useTheme } from "react-native-paper";

const CustomCard = (props: {
  mode?: "outlined" | "elevated";
  children: React.ReactNode;
  onPress?: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <Card
      mode={props.mode ?? "elevated"}
      style={{ backgroundColor: colors.background, borderRadius: 2 }}
      onPress={props.onPress}
    >
      <Card.Content>{props.children}</Card.Content>
    </Card>
  );
};

export default CustomCard;
