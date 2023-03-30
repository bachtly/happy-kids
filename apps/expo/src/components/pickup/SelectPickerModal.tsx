import React, { FC, useEffect, useState } from "react";
import { ScrollView, Pressable } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { api } from "../../utils/api";
import { RelativeModel } from "../../models/PickupModels";
import RelativeItem from "./RelativeItem";
import { useAuthContext } from "../../utils/auth-context-provider";
import NewRelativeModal from "./NewRelativeModal";

type AddPickerModalProps = {
  visible: boolean;
  close: () => void;
  submit: (picker: RelativeModel) => void;
};

const SelectPickerModal: FC<AddPickerModalProps> = (props) => {
  const { visible, close, submit } = props;

  const { userId } = useAuthContext();

  const [picker, setPicker] = useState<RelativeModel | null>(null);
  const [relativeSelectIndex, setRelativeSelectIndex] = useState<number | null>(
    null
  );
  const [relativeList, setRelativeList] = useState<RelativeModel[]>([]);
  const [newModalVisibility, setNewModalVisibility] = useState(false);

  const pickupMutation = api.pickup.getRelativeList.useMutation({
    onSuccess: (resp) => resp.relatives && setRelativeList(resp.relatives)
  });

  useEffect(() => {
    if (visible) {
      userId &&
        pickupMutation.mutate({
          parentId: userId
        });
    }
  }, [visible, newModalVisibility]);

  const closeNewModal = () => {
    setNewModalVisibility(false);
  };

  return (
    <>
      <Portal>
        <Dialog
          visible={visible}
          dismissable={false}
          style={{ maxHeight: 400 }}
        >
          <Dialog.Title>Chọn người đón</Dialog.Title>
          <Dialog.ScrollArea className={"px-1"}>
            <ScrollView>
              {relativeList.map((item, key) => (
                <Pressable
                  className={"mb-1"}
                  onPress={() => {
                    setRelativeSelectIndex(key);
                    setPicker(item);
                  }}
                  key={key}
                >
                  <RelativeItem
                    item={item}
                    selected={key === relativeSelectIndex}
                  />
                </Pressable>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button onPress={() => setNewModalVisibility(true)}>
              Thêm người đón mới
            </Button>
            <Button onPress={close}>Hủy</Button>
            <Button onPress={() => picker && submit(picker)}>Lưu</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <NewRelativeModal visible={newModalVisibility} close={closeNewModal} />
    </>
  );
};

export default SelectPickerModal;
