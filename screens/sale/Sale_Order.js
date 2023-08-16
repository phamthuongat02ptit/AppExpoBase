import { Entypo, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Alert, Dimensions, LogBox, Pressable, Text, StyleSheet, View, TouchableOpacity, InteractionManager, FlatList, TextInput } from "react-native"; 
import React, { useCallback, useEffect, useRef, useState } from "react";
import Spinner from 'react-native-loading-spinner-overlay';

import SHDatePickerLabel from "../../components/SHDatePickerLabel";
import SHSelectBoxLabel from "../../components/SHSelectBoxLabel";
import useDialogBase from '../../hookcustoms/useDialogBase';

//Custom function
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { GetApis, PostApis } from "../../common/callapi";
import { ConvertToVnd } from "../../common/convert";

const SearchBar = React.memo(({ setLocalState, localState }) => {
  return (
    <View
      my="2"
      space={5}
      w="100%"
      divider={
        <View px="2">
          
        </View>
      }
    >
      <View w="100%" space={5} alignSelf="center">
        <TextInput
          onSubmitEditing={({ nativeEvent: { text } }) => {
            setLocalState((pre) => ({
              ...pre,
              searchText: text,
            }));
          }}
          placeholder="Nhập để tìm kiếm"
          variant="outline"
          width="100%"
          borderRadius="10"
          py="1"
          px="2"
          InputLeftElement={
            <Ionicons name="ios-search" />
          }
        />
      </View>
    </View>
  );
});

const FilterContentComponent = React.memo(
  ({ setLocalState, localState, ...props }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <View>
        <View
          borderBottomWidth="0"
          _dark={{
            borderColor: "muted.50",
          }}
          borderColor="muted.300"
          mx="2"
          py="2"
        >
          <View
            style={{ display: isOpen ? "flex" : "none" }}
            visible={isOpen}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 250,
              },
            }}
          >
            <View space={"1"} justify-content="flex-start" style={{flexDirection:'row'}}>
              <View width="48%">
                <SHDatePickerLabel
                  label={"Đến Ngày"}
                  value={localState.viewDate}
                  onConfirm={(date) => {
                    setLocalState((pre) => ({
                      ...pre,
                      viewDate: date,
                    }));
                  }}
                  maximumDate={new Date()}
                ></SHDatePickerLabel>
              </View>
              <View width="48%">
                <SHSelectBoxLabel
                  dataSource={localState.lstOrderStatus}
                  placeholder={"Chọn Trạng Thái"}
                  label={"Trạng Thái"}
                  defaultObj={"Tất Cả"}
                  setSelected={(key) => {
                    setLocalState((pre) => ({
                      ...pre,
                      orderStatus: key,
                    }));
                  }}
                ></SHSelectBoxLabel>
              </View>
            </View>
            <View>
              <SearchBar
                localState={localState}
                GetDMS_Order={props.GetDMS_Order}
                setLocalState={setLocalState}
              />
            </View>
          </View>
          <Pressable position={"relative"} onPress={() => setIsOpen(!isOpen)}>
            <View justifyContent={"center"}>
              <Entypo
                name={
                  !isOpen ? "arrow-with-circle-down" : "arrow-with-circle-up"
                }
                size={16}
                color="gray"
              />
            </View>
          </Pressable>
        </View>
      </View>
    );
  }
);

const ContentInfo = ({ lstInfo, setlstInfo, item, ...props }) => {
    const { showDialog, hideDialog, DialogBase } = useDialogBase();
  const ShowAlert = (mess, isSuccess) => {
    // toast.show({
    //   duration: 3000,
    //   avoidKeyboard: true,
    //   placement: "top",
    //   render: () => {
    //     return (
    //       <View
    //         bg={isSuccess ? "green.600" : "yellow.600"}
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
  var refColorText = useRef(
    item.OrderStatus == "REJECT"
      ? "danger.800"
      : item.OrderStatus == "APPROVAL"
        ? "success.800"
        : "info.800"
  );
  const deleteItem = async (Id) => {
    try {
      let userStorage = await AsyncStorage.getItem("userInfo");
      let curUser = JSON.parse(userStorage);
      const result = await PostApis(
        "/DMS_OrderMaster/Delete_OrderMaster","",
        {
          userName: curUser.UserName,
          id: Id,
        },
        {},
        false
      );
      if (result.IsOK) {
        Alert.alert('Thông báo', 'Xóa thành công.');
        setlstInfo(lstInfo.filter(x => x.Id != Id));
      }
      if (!result.IsOK) {
        Alert.alert(result.Messenger);
      }
    } catch (e) {
      props.LoadingSprin(false);
      ShowAlert(e);
      return;
    }
  }
  const alertConfirmDelete = (orderNumber) => {
    Alert.alert('Xác nhận xóa đơn ' + orderNumber, 'Bạn có chắc xóa đơn này không?',
      [{ text: 'Xóa', style: "default", onPress: () => { deleteItem(item.Id) }, },
      { text: 'Không', style: 'cancel', onPress: () => { return null; } }],
      { cancelable: false, userInterfaceStyle: true },
    );
  }
  let objColor = [
    { key: "WAIT", label: "Chờ Duyệt", color:'blue', backColor:'#FAFFEB' },
    { key: "APPROVAL", label: "Đã Duyệt", color:'#079637', backColor:'#E5FFE2' },
    { key: "REJECT", label: "Từ Chối", color:'#FB0000', backColor:'#FFE2E2' },
  ].find(e => e.key === item.OrderStatus);
  let strColor = objColor.color;
  let strBackColor = objColor.backColor;
  return (
    <View style={{backgroundColor: strBackColor, margin: 5, padding: 5}}>
        <TouchableOpacity
            style={styles.signIn}
            onPress={() => { props.navigation.navigate('Sale_OrderDetail', {
                preScreen: 'Sale_Order',
                MasterId: item.Id,
                OrderNumber: item.OrderNumber
          }); }}
        >
            <View style={styles.styleRowItem}>
                <View style={{flex: 5}}>
                    <TouchableOpacity onPress={() => { showDialog({ 
                            title: item.OrderNumber, 
                            content: <View>
                                        <Text>Ngày dự kiến giao: {moment(item.ExpectedDate).format("DD/MM/YYYY")}</Text>
                                        <Text>Duyệt bởi: {item.ApprovalBy}</Text>
                                        <Text>Ngày duyệt: {moment(item.ApprovalDate).format("DD/MM/YYYY")}</Text>
                                        <Text>Ghi chú: {item.Note}</Text>
                                     </View>, 
                            bgcolor: strBackColor
                            }); }}>
                        <Text style={{color:strColor, fontWeight:'bold', fontSize:14}}>{item.OrderNumber} {item.strOrderStatus} - {moment(item.OrderDate).format("DD/MM/YYYY")}</Text>
                    </TouchableOpacity></View>
                <View style={{flex: 1,alignItems:'flex-end'}}><TouchableOpacity onPress={() => { alertConfirmDelete(item.OrderNumber) }}><MaterialIcons name="delete" size={24} color="red" /></TouchableOpacity></View>
            </View>
            <View style={styles.styleRowItem}>
                <View style={{flex: 3, flexDirection:'row', alignItems:'center'}}><Text style={{fontWeight:'bold'}}>{item.AgencyName}</Text></View>
                <View style={{flex: 1, flexDirection:'row', alignItems:'center'}}><Text style={{fontWeight:'bold'}}> {"O:" + ConvertToVnd(item.TotalAmount ? item.TotalAmount : 0)}</Text></View>
            </View>
            <View style={styles.styleRowItem}>
                <View style={{flex: 3, flexDirection:'row', alignItems:'center'}}><Text style={styles.textSmall}>{item.cmp_name}</Text></View>
                <View style={{flex: 1, flexDirection:'row', alignItems:'center'}}><Text style={{fontWeight:'bold', color:'green'}}> {"F:" + ConvertToVnd(item.ConfirmAmount ? item.ConfirmAmount : 0)}</Text></View>
            </View>
            <DialogBase />
        </TouchableOpacity>
    </View>
  );
};

const ContentInfoHOC = ContentInfo;

const OrderListScreenNavigation = ({ navigation, ...props }) => {
  //State
  const [localState, setLocalState] = useState({
    PageNumber: -1,
    RowsOfPage: 10,
    InfoTypeFilter: "",
    viewDate: moment(),
    isStopLoad: false,
    orderStatus: "",
    searchText: "",
    lstOrderStatus: [
      { key: "", label: "Tất Cả" },
      { key: "WAIT", label: "Chờ Duyệt" },
      { key: "APPROVAL", label: "Đã Duyệt" },
      { key: "REJECT", label: "Từ Chối" },
    ],
  });
  const [isLoading, setLoading] = useState(false);
  const [lstInfo, setlstInfo] = useState([]);
  //Ref
  const initialRef = React.useRef(true);
  const curUser = React.useRef("");
  const routes = useRoute();
  //Contanst
  const isFocus = useIsFocused();
//   const toast = useToast();
  const GetUser = async () => {
    let userStorage = await AsyncStorage.getItem("userInfo");
    curUser.current = JSON.parse(userStorage);
  };
  const funcSetIconRight = () => {
    navigation.setOptions({
      headerRight: () => (
        <Feather
          name="plus"
          style={{ marginRight: 10 }}
          size={25}
          color="#fff"
          onPress={() => {
            navigation.navigate("DMS_OrderDetailTab", {
              screen: "DMS_OrderDetail",
              params: {
                preScreen: "DMS_Order",
                MasterId: '',
                OrderNumber: ''
              }
            })
          }}
        />
      ),
    });
  };
  useEffect(() => {
    if (isFocus) {
      initialRef.current = false;
      if (isFocus) {
        funcSetIconRight();
        GetDMS_Order(
          localState.viewDate,
          -1,
          localState.RowsOfPage,
          false,
          {
            orderStatus: localState.orderStatus,
            searchText: localState.searchText,
          }
        );
      }
      InteractionManager.runAfterInteractions(() => {

      });
    }
  }, [isFocus]);

  useEffect(() => {
    if (!initialRef.current) {
      GetDMS_Order(localState.viewDate, 1, localState.RowsOfPage, false, {
        orderStatus: localState.orderStatus,
        searchText: localState.searchText,
      });
    }
  }, [localState.searchText]);
  useEffect(() => {
    if (!initialRef.current) {
      GetDMS_Order(localState.viewDate, -1, localState.RowsOfPage, false, {
        orderStatus: localState.orderStatus,
        searchText: localState.searchText,
      });
    }
  }, [localState.orderStatus]);
  useEffect(() => {
    if (!initialRef.current) {
      GetDMS_Order(localState.viewDate, -1, localState.RowsOfPage, false, {
        orderStatus: localState.orderStatus,
        searchText: localState.searchText,
      });
    }
  }, [localState.viewDate]);

  const LoadingSprin = (pisLoading = true) => {
    setLoading(pisLoading);
  };

  const renderContent = useCallback(({ item }) => <ContentInfoHOC
    navigation={navigation}
    routes={routes}
    setlstInfo={setlstInfo}
    lstInfo={lstInfo}
    LoadingSprin={LoadingSprin}
    item={item}
  />, [lstInfo])
  //Lấy danh sách thông tin thị trường
  const GetDMS_Order = async (
    viewDate,
    pageNumber,
    pageSize,
    Isload = true,
    objData
  ) => {
    try {
      if (Isload) LoadingSprin(true);
      let userStorage = await AsyncStorage.getItem("userInfo");
      let curUser = JSON.parse(userStorage);
      var result = await GetApis("/DMS_OrderMaster/GetDMS_OrderMobile", "", {
        userName: curUser.UserName,
        viewDate: viewDate.toISOString(),
        pageNumber: -1,
        pageSize: pageSize,
        ...objData,
      });
      LoadingSprin(false);
      var items = JSON.parse(result.Data);
      if (!items || items.length == 0) setlstInfo([]);

      if (pageNumber == 1 || pageNumber == -1) {
        setlstInfo(items);
        return;
      }
    } catch (e) {
      LoadingSprin(false);
      //console.log(e);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 7000);
  }, [isLoading])
  return (
    <>
      <Spinner visible={isLoading} textContent={'Loading...'} textStyle={{ color: 'white' }} />
      <View paddingBottom={"1"} flex={1}>
        <FilterContentComponent
          GetDMS_Order={GetDMS_Order}
          setlabelInfo={(label) => setlabelInfo(label)}
          setInfoType={(label) => setInfoType(label)}
          setLocalState={setLocalState}
          localState={localState}
        />
        {lstInfo.length > 0 ? (
          <>
            <FlatList
              removeClippedSubviews
              data={lstInfo}
              renderItem={renderContent}
              keyExtractor={(item) => item.Id}
            />
          </>
        ) : <>
        </>
        }
      </View>
    </>
  );
};

export default OrderListScreenNavigation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerSearch: {
        backgroundColor: '#d02860'
    },
    boxSearch: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      marginVertical: 10
    },
    searchInput: {
      flex: 1,
      height: 40,
      paddingHorizontal: 10,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: 'white'
    },
    searchButton: {
      marginLeft: 10,
      backgroundColor: '#0093FE',
      borderRadius: 5,
      padding: 10,
    },
    searchButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    styleRowItem: {
        flexDirection:'row', flex: 1, marginBottom: 7
    },
    textSmall: {
        fontSize:12
    }

  });
