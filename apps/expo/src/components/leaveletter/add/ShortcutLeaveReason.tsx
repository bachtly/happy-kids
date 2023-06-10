import { ScrollView, Text } from "react-native";
import { Chip } from "react-native-paper";
import React, { useState } from "react";

const ShortcutLeaveReason = ({
  setReason
}: {
  setReason: (inp: string) => void;
}) => {
  const [selectedReason, setSelectedReason] = useState<
    "sick" | "vacation" | "hometown" | "other"
  >("other");

  return (
    <ScrollView horizontal={true} className={"flex-row space-x-2"}>
      <Chip
        selected={selectedReason == "sick"}
        onPress={() => {
          setSelectedReason("sick");
          setReason("Bé bị bệnh");
        }}
      >
        <Text className="capitalize">Bệnh</Text>
      </Chip>

      <Chip
        selected={selectedReason == "vacation"}
        onPress={() => {
          setSelectedReason("vacation");
          setReason("Bé đi du lịch với gia đình");
        }}
      >
        <Text>Du lịch</Text>
      </Chip>

      <Chip
        selected={selectedReason == "hometown"}
        onPress={() => {
          setSelectedReason("hometown");
          setReason("Bé về quê");
        }}
      >
        <Text>Về quê</Text>
      </Chip>

      <Chip
        selected={selectedReason == "other"}
        onPress={() => {
          setSelectedReason("other");
          setReason("");
        }}
      >
        <Text>Khác</Text>
      </Chip>
    </ScrollView>
  );
};

export default ShortcutLeaveReason;
