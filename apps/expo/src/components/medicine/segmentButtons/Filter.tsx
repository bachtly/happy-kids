import { List, SegmentedButtons } from "react-native-paper";

export type FilterType = "All" | "Today" | "7days";

const Filter = ({
  value,
  setValue
}: {
  value: FilterType;
  setValue: (val: FilterType) => void;
}) => {
  return (
    <List.Section>
      <SegmentedButtons
        style={{
          width: 300
        }}
        value={value}
        onValueChange={(value) => setValue(value as FilterType)}
        density={"medium"}
        buttons={[
          {
            value: "All",
            label: "Tất cả"
          },
          {
            value: "Today",
            label: "Hôm nay"
          },
          {
            value: "7days",
            label: "7 ngày tới"
          }
        ]}
      />
    </List.Section>
  );
};

export default Filter;
