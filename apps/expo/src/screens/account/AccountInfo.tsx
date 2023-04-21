import { RefreshControl, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import moment, { Moment } from "moment";

import Body from "../../components/Body";
import CustomStackScreen from "../../components/CustomStackScreen";
import { pickImageFunc } from "../../components/ImagePicker";
import LoadingBar from "../../components/common/LoadingBar";

import AccountInfoUpdateComponent from "../../components/account/AccountInfoUpdateComponent";
import BigAvatar from "../../components/account/BigAvatar";
import BirthdateFormField from "../../components/account/BirthdateFormField";
import EditableFormField from "../../components/account/EditableFormField";
import { AccountInfoModel } from "../../models/AccountModels";

import { api } from "../../utils/api";
import { useAuthContext } from "../../utils/auth-context-provider";

const AccountInfo = () => {
  const { userId } = useAuthContext();
  if (!userId) throw Error("account_info: missing userId");

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<Moment | null>(null);
  const [avatar, setAvatar] = useState("");

  const [accountInfo, setAccountInfo] = useState<AccountInfoModel>({
    fullname: name,
    email: mail,
    birthdate: birthDate,
    phone: phone,
    avatar: avatar
  });

  const onEditAvatar = () => {
    pickImageFunc({ setImage: setAvatar }).catch((err: Error) =>
      console.log(err.message)
    );
  };

  const resetToDefault = () => {
    setName(accountInfo.fullname);
    setMail(accountInfo.email);
    setPhone(accountInfo.phone);
    setBirthDate(accountInfo.birthdate ? moment(accountInfo.birthdate) : null);
    setAvatar(accountInfo.avatar);
  };
  useEffect(() => resetToDefault(), [accountInfo]);

  const { refetch, isFetching } = api.account.getAccountInfo.useQuery(
    {
      userId
    },
    {
      onSuccess: (data) => {
        if (data.res) {
          const accGot = data.res;
          setAccountInfo((prev) => ({
            fullname: accGot.fullname,
            email: accGot.email,
            phone: accGot.phone,
            birthdate: accGot.birthdate
              ? moment(accGot.birthdate)
              : prev.birthdate,
            avatar: accGot.avatar
          }));
        } else {
          console.log(data.errMess);
          alert(data.errMess);
        }
      }
    }
  );

  const fetchData = () => {
    refetch().catch((e: Error) => {
      console.log(e);
    });
  };

  const isAnyChanged =
    name.trim() !== accountInfo.fullname ||
    mail.trim() !== accountInfo.email ||
    phone.trim() !== accountInfo.phone ||
    birthDate?.unix() !== accountInfo.birthdate?.unix() ||
    avatar !== accountInfo.avatar;

  return (
    <Body>
      <CustomStackScreen title="Thông tin tài khoản" />
      <LoadingBar isFetching={isFetching} />
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        <View className="flex-1">
          <View className="p-4">
            <BigAvatar image={avatar} onEditPress={onEditAvatar} />

            <View className="h-3" />

            <EditableFormField
              label="Tên"
              placeholder="Nhập tên"
              setText={setName}
              text={name}
              icon="account-circle"
            />

            <EditableFormField
              label="Email"
              placeholder="Nhập email"
              setText={setMail}
              text={mail}
              icon="email"
            />

            <EditableFormField
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              setText={setPhone}
              text={phone}
              icon="phone"
              textInputProps={{ keyboardType: "numeric" }}
            />

            <BirthdateFormField date={birthDate} setDate={setBirthDate} />

            <AccountInfoUpdateComponent
              accountInfo={{
                fullname: name,
                email: mail,
                phone: phone,
                birthdate: birthDate,
                avatar: avatar
              }}
              fetchData={fetchData}
              isAnyChanged={isAnyChanged}
              isFetching={isFetching}
              userId={userId}
            />
          </View>
        </View>
      </ScrollView>
    </Body>
  );
};

export default AccountInfo;
