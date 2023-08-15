// import React, { useState, useEffect } from "react";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
// import { StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList, Alert, Dimensions } from "react-native";
// import { Box, FormControl, HStack, VStack, useToast, Heading, Pressable, KeyboardAvoidingView } from "native-base";
// import { MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
// import { Button } from "react-native-paper";
// import { SearchBar } from "react-native-elements";
// import { connect } from "react-redux";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Modal from 'react-native-modal';
// import SelectMultiple from 'react-native-select-multiple';
// // import {ViewPropTypes} from 'deprecated-react-native-prop-types'
// // import Swipeout from 'react-native-swipeout';
// import { ConvertToVnd, QueryGet, QueryPost } from "../../Common/CallAPI";
// import SHSelectBoxLabel from "../../components/SHSelectBoxLabel";
// import SHTextAreaLabel from "../../components/SHTextAreaLabel";
// import * as LoginActions from "../../Redux/Action/login";
// import * as SQLite from "expo-sqlite";
// //mở DB
// const db = SQLite.openDatabase("db.MDS");

// let mapStateToProps = (state) => ({ ...state });


// const OrderDetail = ({ route, navigation, ...props }) => {
//     const [text, onChangeText] = useState('');
//     const [isAddPartVisibleV2, setIsAddPartVisibleV2] = useState(false);//biến để hiển thị popup thêm linh kiện V2
//     const [quantity, setQuantity] = useState("1"); //số lượng
//     const [isLstPartVisible, setIsLstPartVisible] = useState(false);//biến để hiển thị popup danh sách linh kiện
//     const [listItemDetails, setListItemDetails] = useState([]); //danh sách tất cả linh kiện
//     const [cacheListItemDetails, setCacheListItemDetails] = useState([]); //danh sách tất cả linh kiện
//     const [listItemDetailsV2, setListItemDetailsV2] = useState([]); //danh sách tất cả linh kiện
//     const [cacheListItemDetailsV2, setCacheListItemDetailsV2] = useState([]); //danh sách tất cả linh kiện
//     const [listChoosePart, setListChoosePart] = useState([]);
//     const [itemPart, setItemPart] = useState({}); // linh kiện được chọn để thêm
//     const [textDetail, onChangeTextDetail] = useState(''); // ghi chú cho chi tiết linh kiện
//     const [lstCmp, setlstCmp] = useState([]);
//     const [lstAgency, setlstAgency] = useState([]);
//     const [agencyId, setAgencyId] = useState("");
//     const [cmp_wwn, setCmp_wwn] = useState("");
//     const [note, setNote] = useState("");
//     const [totalMoney, setTotalMoney] = useState(0);
//     const [totalItem, setTotalItem] = useState(0);
//     const toast = useToast();
//     const [isLoading, setLoading] = useState(false);
//     const isFocused = useIsFocused();
//     const [masterId, setMasterId] = useState(route.params?.MasterId);

//     useEffect(() => {
//         if (isFocused) {
//             getListItemDetailsV2();
//             getListCMP();
//         }
//     }, []);

//     useEffect(() => {
//         GetDMS_OrderDetail(route.params?.MasterId);
//     }, [route]);

//     //bidding từ màn hình danh sách
//     const GetDMS_OrderDetail = async (MasterId = "", Isload = true) => {
//         try {
//             let userStorage = await AsyncStorage.getItem("userInfo");
//             let curUser = JSON.parse(userStorage);
//             if (!MasterId) return;
//             if (Isload) LoadingSprin(true);
//             let result = await QueryGet("/DMS_OrderMaster/GetDMS_OrderDetail", {
//                 id: MasterId,
//                 userName: curUser.UserName,
//             });
//             result = JSON.parse(result.Data);
//             let listDetails = [];
//             result.lstOrderDetail.forEach((e) => {
//                 listDetails.push({ label: e.ItemName, value: e.ItemCode, quantity: e.SaleQuantity, price: e.SalePrice, money: e.SaleQuantity * e.SalePrice });
//             });
//             setListChoosePart(listDetails);
//             setAgencyId(result.orderMaster.AgencyId);
//             setCmp_wwn(result.orderMaster.Cmp_wwn);
//             setNote(result.orderMaster.Note);
//             LoadingSprin(false);
//         } catch (e) {
//             LoadingSprin(false);
//             //console.log(e);
//         }
//     };

//     //lấy danh sách tất cả linh kiện v2
//     const getListItemDetailsV2 = async () => {
//         try {
//             let listData = [];
//             db.transaction((e) => {
//                 e.executeSql(
//                     "SELECT * FROM mItem",
//                     null,
//                     (Obj, { rows: { _array } }) => {
//                         _array.forEach(e => {
//                             listData.push({ label: e.ItemName, value: e.ItemCode });
//                         });
//                         setListItemDetailsV2(listData);
//                         setCacheListItemDetailsV2(listData);
//                     },
//                     (Obj, error) => { Alert.alert('Lỗi', 'Dữ liệu hàng hóa chưa được đồng bộ') }
//                 );
//             });
//         } catch (error) { Alert.alert('Lỗi', 'Không truy vấn được danh sách hàng hóa') }
//     }
//     //lấy danh sách nhà phân phối
//     const getListCMP = async () => {
//         try {
//             let userStorage = await AsyncStorage.getItem("userInfo");
//             let curUser = JSON.parse(userStorage);
//             let resultCmp = await QueryGet("dms/GetListCicmpyByUserDapper", {
//                 username: curUser.UserName,
//             });
//             if (resultCmp) {
//                 let lstCmp = [];
//                 resultCmp.ResponseData.forEach(element => {
//                     lstCmp.push({ 'key': element.cmp_wwn, 'label': element.cmp_name })
//                 });
//                 setlstCmp(lstCmp);
//             }
//             let resultAgency = await QueryGet("dms/GetListDMSCustomerLookup", {
//                 username: curUser.UserName,
//             });
//             if (resultAgency) {
//                 let lstAgency = [];
//                 resultAgency.ResponseData.forEach(element => {
//                     lstAgency.push({ 'key': element.cmp_wwn, 'label': `${element.cmp_name} - ${element.PhoneNumber}` })
//                 });
//                 setlstAgency(lstAgency);
//             }
//         } catch (err) {
//             Alert.alert('Lỗi', 'Không gọi được api.')
//         }
//     }


//     //tăng số lượng item linh kiện đã chọn
//     const UpQuantity = async (item) => {
//         let newArr = [...listChoosePart.map(e => { if (e.value == item.value) { return { label: item.label, value: item.value, quantity: 1 + item.quantity, price: item.price, money: (1 + item.quantity) * item.price } } else return e })];
//         let sumMoney = 0;
//         newArr.forEach(e => { sumMoney += e.money });
//         setTotalMoney(sumMoney);
//         setListChoosePart(newArr);
//     }
//     //giảm số lượng item linh kiện đã chọn
//     const DownQuantity = async (item) => {
//         if (item.quantity - 1 <= 1) {
//             item.quantity = 2;
//         }
//         let newArr = [...listChoosePart.map(e => { if (e.value == item.value) { return { label: item.label, value: item.value, quantity: item.quantity - 1, price: item.price, money: (item.quantity - 1) * item.price } } else return e })];
//         let sumMoney = 0;
//         newArr.forEach(e => { sumMoney += e.money });
//         setTotalMoney(sumMoney);
//         setListChoosePart(newArr);
//     }
//     //onchange quantity
//     const OnChangeQuantity = async (item, textQuantity) => {
//         let newArr = [...listChoosePart.map(e => { if (e.value == item.value) { return { label: item.label, value: item.value, quantity: textQuantity, price: item.price, money: textQuantity * item.price } } else return e })];
//         let sumMoney = 0;
//         newArr.forEach(e => { sumMoney += e.money });
//         setTotalMoney(sumMoney);
//         setListChoosePart(newArr);
//     }
//     //onchange price
//     const OnChangePrice = async (item, textPrice) => {
//         textPrice = textPrice.indexOf(0) == '0' ? textPrice.substring(1) : textPrice;
//         //console.log(textPrice);
//         let newArr = [...listChoosePart.map(e => { if (e.value == item.value) { return { label: item.label, value: item.value, quantity: item.quantity, price: textPrice, money: item.quantity * textPrice } } else return e })];
//         let sumMoney = 0;
//         newArr.forEach(e => { sumMoney += e.money; });
//         setTotalMoney(sumMoney);
//         setListChoosePart(newArr);
//     }
//     //xác nhận xóa linh kiện thay thế
//     const AlertDeletePart = async (value) => {
//         Alert.alert('Xác nhận', 'Bạn có chắc xóa linh kiện này không?',
//             [{ text: 'Đồng ý', style: { color: '#F5365C' }, onPress: () => { DeletePart(value) }, },
//             { text: 'Không', onPress: () => { return null; } }],
//             { cancelable: false },
//         );
//     }
//     const DeletePart = (value) => {
//         let newArr = [...listChoosePart.filter(e => e.value != value)];
//         let sumMoney = 0;
//         let sumItem = 0;
//         newArr.forEach(e => { sumMoney += e.money; sumItem += 1 });
//         setTotalMoney(sumMoney);
//         setTotalItem(sumItem);
//         setListChoosePart(newArr);
//     }
//     //thông báo tạo phiếu yêu cầu linh kiện
//     const AlertSave = () => {
//         Alert.alert('Xác nhận', 'Bạn có chắc lưu đơn này không?',
//             [{ text: 'Đồng ý', style: { color: '#F5365C' }, onPress: () => { SaveOrderDMS() }, },
//             { text: 'Không', onPress: () => { return null; } }],
//             { cancelable: false },
//         );
//     }
//     const ShowAlert = (mess, isSuccess) => {
//         toast.show({
//             duration: 3000,
//             avoidKeyboard: true,
//             placement: "top",
//             render: () => {
//                 return (
//                     <Box
//                         bg={isSuccess ? "green.600" : "yellow.600"}
//                         px="4"
//                         _text={{ color: "#fff", fontSize: 18 }}
//                         fontSize={18}
//                         py="2"
//                         rounded="sm"
//                         mb={5}
//                     >
//                         {mess}
//                     </Box>
//                 );
//             },
//         });
//     };
//     const LoadingSprin = (pisLoading = true) => {
//         setLoading(pisLoading);
//     };
//     const SaveOrderDMS = async () => {
//         try {
//             //    console.log(cmp_wwn);
//             if (!cmp_wwn) {
//                 ShowAlert("Chưa chọn nhà phân phối", false);
//                 return;
//             }
//             if (!agencyId) {
//                 ShowAlert("Chưa chọn đại lý", false);
//                 return;
//             }
//             //console.log(listChoosePart);
//             if (listChoosePart.length == 0) {
//                 ShowAlert("Chưa chọn sản phẩm lên đơn", false);
//                 return;
//             }
//             let lstOrderDetail = [];
//             listChoosePart.forEach(e => {
//                 lstOrderDetail.push({ 'ItemCode': e.value, 'SaleQuantity': e.quantity, 'SalePrice': e.price, 'MasterId': route.params?.MasterId })
//             });
//             //console.log(lstOrderDetail);
//             LoadingSprin(true);
//             let userStorage = await AsyncStorage.getItem("userInfo");
//             let curUser = JSON.parse(userStorage);
//             const result = await QueryPost(
//                 "/DMS_OrderMaster/SaveDMS_OrderMaster",
//                 {
//                     userName: curUser.UserName,
//                     cmp_wwn: cmp_wwn,
//                     agencyId: agencyId,
//                     note: note,
//                 },
//                 lstOrderDetail,
//                 true
//             );
//             LoadingSprin(false);
//             if (result.IsOK) {
//                 navigation.navigate('Sale_OrderTab', {
//                     screen: 'Sale_Order',
//                     params: {
//                         preScreen: 'Sale_OrderDetail',
//                     }
//                 });
//                 Alert.alert('Thông báo', 'Lưu đơn thành công.');
//             }
//             else {
//                 Alert.alert('Thông báo', result.Messenger);
//             }
//             //   if (!result.IsOK) {
//             //     Alert.alert('Thông báo', result.Messenger);
//             //     // navigation.navigation("DMS_Order");
//             //   }
//         } catch (e) {
//             //   LoadingSprin(false);
//             //   ShowAlert(e.message);
//             return;
//         }
//     };

//     //hàm chuyển chuỗi thành tiếng việt không dấu
//     const convertToEngForm = (alias, place = " ") => {
//         var str = alias.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
//         str = str.toLowerCase();
//         str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
//         str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ệ/g, "e");
//         str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
//         str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
//         str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
//         str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
//         str = str.replace(/đ/g, "d");
//         str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, place);
//         str = str.replace(/ + /g, place);
//         str = str.replace(/\ /g, place);
//         str = str.trim();
//         return str;
//     }

//     const OnChangePart = (listChoose) => {
//         let sumItem = 0;
//         listChoose.forEach(e => { e.quantity = 1; e.price = 0; e.money = 0; sumItem += 1 });
//         setTotalItem(sumItem);
//         setListChoosePart(listChoose);
//     }

//     const ConvertToVnd2 = (number) => {
//         if (!number) return 0;
//         return number.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&.').replace('.000', '')
//     }

//     //vẽ giao diện một item được chọn
//     const RenderItemRequestV2 = ({ item }) => {
//         return (
//             <View style={{ backgroundColor: 'white', paddingHorizontal: 5, paddingBottom: 15, paddingTop: 5, borderBottomWidth: 1, borderRadius: 5, borderColor: '#009387' }}>
//                 <View style={{ flexDirection: 'row' }}>
//                     <View flex={20} style={{ paddingTop: 5 }}>
//                         <Text style={{ fontWeight: 'bold', color: '#515151' }}>{item.label}</Text>
//                         <Text style={{ color: '#8c8c8c' }}>( mã: {item.value} )</Text>
//                     </View>
//                     <View flex={1} style={{ alignItems: 'center' }}>
//                         <TouchableOpacity onPress={() => { AlertDeletePart(item.value) }}>
//                             <FontAwesome name="remove" size={15} color="#b2b2b2" />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <View style={{ flexDirection: 'row', marginTop: 15, height: 27 }}>
//                     <View style={{ flex: 2, flexDirection: 'row', borderWidth: 1, marginRight: 20, borderColor: '#d8d8d8', justifyContent: 'center' }}>
//                         <View flex={1} style={{ backgroundColor: '#03baaa', justifyContent: 'center', alignItems: 'center' }}>
//                             <TouchableOpacity onPress={() => { DownQuantity(item) }} style={{ justifyContent: 'center', alignItems: 'center' }}>
//                                 <Text style={{ color: 'white', fontWeight: 'bold' }}>-</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View flex={2}>
//                             <TextInput
//                                 style={{ padding: 5, fontSize: 15, color: '#515050' }}
//                                 onChangeText={(val) => { OnChangeQuantity(item, val) }}
//                                 value={item.quantity + ''}
//                                 defaultValue={item.quantity + ''}
//                                 keyboardType="numeric"
//                             />
//                         </View>
//                         <View flex={1} style={{ backgroundColor: '#03baaa', justifyContent: 'center', alignItems: 'center' }}>
//                             <TouchableOpacity onPress={() => { UpQuantity(item) }} style={{ justifyContent: 'center', alignItems: 'center' }}>
//                                 <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                     <View style={{ flex: 3, flexDirection: 'row' }}>
//                         <TextInput
//                             style={{ borderWidth: 1, padding: 5, borderRadius: 5, borderColor: '#d8d8d8', width: '100%', fontSize: 15, color: '#515050' }}
//                             onChangeText={(val) => { OnChangePrice(item, val) }}
//                             value={item.price}
//                             defaultValue={item.price + ''}
//                             keyboardType="numeric"
//                         />
//                     </View>
//                     <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//                         <Text style={{ borderWidth: 1, borderColor: '#d8d8d8', borderRadius: 3, color: '#939393', width: '90%', backgroundColor: '#f2f2f2', height: '100%', padding: 5 }}>{ConvertToVnd2(item.money)}</Text>
//                     </View>
//                 </View>
//             </View>
//         );
//     };

//     return (
//         <View style={{ padding: 10, flex: 1 }}>
//             <View>
//                 <View style={{ flexDirection: 'row' }}>
//                     <View flex={1} style={{ paddingRight: 5 }}>
//                         <SHSelectBoxLabel
//                             dataSource={lstCmp}
//                             defaultObj={lstCmp.find((x) => x.key == cmp_wwn)?.label}
//                             placeholder={"Chọn Nhà Phân Phối"}
//                             label={"Nhà Phân Phối"}
//                             setSelected={(key) => {
//                                 setCmp_wwn(key);
//                             }}
//                         ></SHSelectBoxLabel>
//                     </View>
//                     <View flex={1} style={{ paddingLeft: 5 }}>
//                         <SHSelectBoxLabel
//                             dataSource={lstAgency}
//                             defaultObj={lstAgency.find((x) => x.key == cmp_wwn)?.label}
//                             placeholder={"Chọn Đại Lý"}
//                             label={"Đại Lý"}
//                             setSelected={(key) => {
//                                 setAgencyId(key);
//                             }}
//                         ></SHSelectBoxLabel>
//                     </View>
//                 </View>
//                 <View>
//                     <SHTextAreaLabel
//                         defaulValue={note}
//                         value={note}
//                         h={15}
//                         label={"Ghi Chú"}
//                         onChangeText={(text) => setNote(text)}
//                     ></SHTextAreaLabel>
//                 </View>
//             </View>
//             <View style={{ paddingVertical: 5 }}>
//                 <View style={{ flexDirection: 'row' }}>
//                     <View flex={1} style={{ backgroundColor: '#03baaa', padding: 3, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
//                         <TouchableOpacity onPress={() => { setIsAddPartVisibleV2(true) }}>
//                             <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Thêm hàng</Text>
//                         </TouchableOpacity>
//                     </View>
//                     <View flex={3} style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
//                         <Text style={{ color: '#515151' }}>Tổng: <Text style={{ color: 'red', fontSize: 16 }}>{ConvertToVnd2(totalMoney)}</Text> vnd</Text>
//                     </View>
//                 </View>
//                 <View style={{ borderTopWidth: 1, borderColor: "#009387", }}></View>
//             </View>
//             <View style={{ flexGrow: 1, borderWidth: 1, borderColor: '#bfbfbf', padding: 3, borderRadius: 5, marginTop: 5 }}>
//                 <KeyboardAwareScrollView
//                     keyboardShouldPersistTaps={"handled"}
//                     style={{ flex: 1, backgroundColor: "white" }}
//                     behavior={Platform.OS == "ios" ? "position" : null}
//                     resetScrollToCoords={{ x: 0, y: 0 }}
//                     extraScrollHeight={180}
//                     keyboardOpeningTime={1}
//                     enableOnAndroid={true}
//                     enableAutomaticScroll={true}>
//                     <FlatList
//                         style={{ paddingTop: 2, paddingBottom: 2 }}
//                         data={listChoosePart}
//                         renderItem={RenderItemRequestV2}
//                         keyExtractor={(item) => item.value}
//                     />
//                 </KeyboardAwareScrollView>
//             </View>
//             <View style={{ backgroundColor: '#009387', borderRadius: 5, marginBottom: 20, marginTop: 10, height: 45 }}>
//                 <TouchableOpacity style={{ height: '100%' }} onPress={() => { AlertSave() }}>
//                     <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//                         <View flex={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
//                             <Text style={{ color: 'white', justifyContent: 'center', alignItems: 'center' }}>Số hàng: {ConvertToVnd2(totalItem)}</Text>
//                         </View>
//                         <View flex={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
//                             <Text style={{ color: 'white', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center', fontSize: 16 }}>LƯU ĐƠN</Text>
//                         </View>
//                         <View flex={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
//                             <Text style={{ color: 'white', justifyContent: 'center', alignItems: 'center' }}>{ConvertToVnd2(totalMoney)} vnd</Text>
//                         </View>
//                     </View>
//                 </TouchableOpacity>
//                 {/* <View style={{backgroundColor: '#009387', borderRadius: 5, justifyContent:'center'}}>
//                     <Button title="ĐỒNG Ý" onPress={() => {AlertSave()}}><Text style={{color:'white', fontWeight:'bold'}}>Số hàng: </Text><Text style={{color:'white', fontWeight:'bold'}}>LƯU ĐƠN</Text></Button>
//                 </View> */}
//             </View>
//             <Modal isVisible={isAddPartVisibleV2}>
//                 <View style={{ flexDirection: 'column', backgroundColor: 'white', height: Dimensions.get('window').height * 7 / 10, borderRadius: 10 }}>
//                     <View flex={8}>
//                         <View style={{ alignItems: 'center', marginTop: 10 }}><Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Danh sách hàng hóa</Text></View>
//                         <SearchBar
//                             placeholder="Tìm kiếm..."
//                             onChangeText={(value) => {
//                                 let lstItemDetails = listItemDetailsV2.filter((e) =>
//                                     convertToEngForm(e.value).indexOf(convertToEngForm(value)) != -1 ||
//                                     convertToEngForm(e.label).indexOf(convertToEngForm(value)) != -1
//                                 );
//                                 setCacheListItemDetailsV2(lstItemDetails);
//                             }}
//                             onClear={(e) => {
//                                 setCacheListItemDetailsV2(listItemDetailsV2);
//                             }}
//                             value={null}
//                             lightTheme={true}
//                             containerStyle={{ backgroundColor: "#fff", padding: 2 }}
//                             inputStyle={{ height: 30, fontSize: 14 }}
//                             inputContainerStyle={styles.inputContainerStyle}
//                         />
//                         <SelectMultiple
//                             items={cacheListItemDetailsV2}
//                             selectedItems={listChoosePart}
//                             onSelectionsChange={OnChangePart} />
//                     </View>
//                     <View style={{ flex: 1, flexDirection: 'row', marginRight: 10, justifyContent: 'flex-end' }}>
//                         <Button
//                             style={{ backgroundColor: '#009387', width: 100, marginRight: 10, marginTop: 12, marginBottom: 12 }}
//                             onPress={() => { setIsAddPartVisibleV2(false) }} >
//                             <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}> Đóng </Text>
//                         </Button>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     input: {
//         height: 40,
//         borderWidth: 1,
//         padding: 10,
//         borderRadius: 5,
//         borderColor: '#009387'
//     },
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     maintext: {
//         fontSize: 16,
//         margin: 20,
//     },
//     barcodebox: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: 300,
//         width: 300,
//         overflow: 'hidden',
//         borderRadius: 30,
//         backgroundColor: 'tomato'
//     }
// })
// export default connect(mapStateToProps, { ...LoginActions })(OrderDetail);

