import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SHDatePickerLabel from "../../components/SHDatePickerLabel";
import moment from "moment";
import { GetApis, PostApis } from '../../common/callapi';
import AsyncStorage from "@react-native-async-storage/async-storage";
const HistoryCheckIn = (props) => {
  //State
  const [localState, setLocalState] = useState({ fromDate: moment().startOf('month'), toDate: moment() });
  const [isLoading, setLoading] = useState(false);
  const [lstData, setLstData] = useState([]);
  const LoadingSprin = (pisLoading = true) => {
    setLoading(pisLoading);
  };
  //hàm thông bảo
  const ShowAlert = (mess, isSuccess) => {
    // toast.show({
    //   duration: 3000,
    //   avoidKeyboard: true,
    //   render: () => {
    //     return (
    //       <View
    //         bg={isSuccess ? "green.400" : "yellow.400"}
    //         px="4"
    //         _text={{ color: "#fff", fontSize: 18 }}
    //         fontSize={18}
    //         py="2"
    //         rounded="sm"
    //         mb={5}
    //       >
    //         {mess}
    //       </View>
    //     );
    //   },
    // });
  };

  const getHistoryCheckIn = async () => {
    try {
      let userStorage = await AsyncStorage.getItem("userInfo");
      const resJson = JSON.parse(userStorage);
      let curUser = resJson.UserName;
      LoadingSprin(true);
      const res = await GetApis("api/DMSV2", "GetCheckInData", { cmp_wwn: "", username: curUser, fromdate: localState.fromDate.toISOString(), todate: localState.toDate.toISOString() });
      LoadingSprin(false);
      if (!res.IsOK) {
        ShowAlert(res.Messenger);
        return;
      }
      setLstData(res.Data);
    } catch (err) {
      LoadingSprin(false);
      ShowAlert(err);
    }
  }

  useEffect(() => {
    getHistoryCheckIn();
  }, []);

  return (
    <View style={{ padding: 10 }}>
      <View space={"1"} justify-content="flex-start" style={{flexDirection:'row'}}>
        <View style={{width:'50%'}}>
          <SHDatePickerLabel
            label={"Từ ngày"}
            value={localState.fromDate}
            onConfirm={(date) => {
              setLocalState((pre) => ({
                ...pre,
                fromDate: date,
              }));
            }}
            maximumDate={new Date()}
          ></SHDatePickerLabel>
        </View>
        <View width="45%">
          <SHDatePickerLabel
            label={"Đến ngày"}
            value={localState.toDate}
            onConfirm={(date) => {
              setLocalState((pre) => ({
                ...pre,
                toDate: date,
              }));
            }}
            maximumDate={new Date()}
          ></SHDatePickerLabel>
        </View>
        <View width="20%">
          <Icon name="search" size={25} onPress={() => { getHistoryCheckIn() }} />
        </View>
      </View>
      <View style={{ marginTop: 15 }}>
        <FlatList data={lstData} renderItem={({ item }) => <View borderBottomWidth="1" _dark={{
          borderColor: "muted.50"
        }} borderColor="muted.200" pl={["0", "4"]} pr={["0", "5"]} py="2">
          <View>
            <View direction="row">
              <View w="17%">
                <Image size="48px" source={{ uri: item.ImagePath }} />
              </View>
              <View w="83%">
                <View direction="row">
                  <View w="55%">
                    <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold>{item.cmp_name}</Text>
                  </View>
                  <View w="45%">
                    <Text fontSize="xs" _dark={{ color: "warmGray.50" }} color="coolGray.800" alignSelf="flex-start">
                      {item.strCheckDate}       {item.strCheckTime}
                    </Text>
                  </View>
                </View>
                <Text fontSize="xs" color="coolGray.600" _dark={{ color: "warmGray.200" }}>{item.Address}</Text>
              </View>
            </View>
            <View>

            </View>

          </View>
        </View>} keyExtractor={item => item.Id} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  controls: {
    flex: 0.5,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
  viewcam:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  }
});

export default HistoryCheckIn;
