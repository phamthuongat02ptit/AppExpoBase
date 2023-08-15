// import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
// import { useIsFocused, useRoute } from "@react-navigation/native";
// import { Alert, Dimensions, LogBox, Pressable, Text, StyleSheet, View, TouchableOpacity, InteractionManager, } from "react-native"; 
// import {
//   Badge, Box, Button, Center, Divider, FlatList, HStack, Icon, Input, Modal, Popover, PresenceTransition, Pressable, Skeleton, Text, useToast, VStack
// } from "native-base";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { connect } from "react-redux";
// import Spinner from 'react-native-loading-spinner-overlay';

// import SHDatePickerLabel from "../../components/SHDatePickerLabel";
// import SHSelectBoxLabel from "../../components/SHSelectBoxLabel";

// //Custom function
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import moment from "moment";
// import { GetApis, PostApis } from "../../common/callapi";
// import { ConvertToVnd } from "../../common/convert";

// const SearchBar = React.memo(({ setLocalState, localState }) => {
//   return (
//     <VStack
//       my="2"
//       space={5}
//       w="100%"
//       divider={
//         <Box px="2">
//           <Divider />
//         </Box>
//       }
//     >
//       <VStack w="100%" space={5} alignSelf="center">
//         <Input
//           onSubmitEditing={({ nativeEvent: { text } }) => {
//             setLocalState((pre) => ({
//               ...pre,
//               searchText: text,
//             }));
//           }}
//           placeholder="Nhập để tìm kiếm"
//           variant="outline"
//           width="100%"
//           borderRadius="10"
//           py="1"
//           px="2"
//           InputLeftElement={
//             <Icon
//               ml="2"
//               size="4"
//               color="gray.600"
//               as={<Ionicons name="ios-search" />}
//             />
//           }
//         />
//       </VStack>
//     </VStack>
//   );
// });

// const FilterContentComponent = React.memo(
//   ({ setLocalState, localState, ...props }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     return (
//       <View>
//         <View
//           borderBottomWidth="0"
//           _dark={{
//             borderColor: "muted.50",
//           }}
//           borderColor="muted.300"
//           mx="2"
//           py="2"
//         >
//           <PresenceTransition
//             style={{ display: isOpen ? "flex" : "none" }}
//             visible={isOpen}
//             initial={{
//               opacity: 0,
//               scale: 0,
//             }}
//             animate={{
//               opacity: 1,
//               scale: 1,
//               transition: {
//                 duration: 250,
//               },
//             }}
//           >
//             <HStack space={"1"} justify-content="flex-start">
//               <VStack width="48%">
//                 <SHDatePickerLabel
//                   label={"Đến Ngày"}
//                   value={localState.viewDate}
//                   onConfirm={(date) => {
//                     setLocalState((pre) => ({
//                       ...pre,
//                       viewDate: date,
//                     }));
//                   }}
//                   maximumDate={new Date()}
//                 ></SHDatePickerLabel>
//               </VStack>
//               <VStack width="48%">
//                 <SHSelectBoxLabel
//                   dataSource={localState.lstOrderStatus}
//                   placeholder={"Chọn Trạng Thái"}
//                   label={"Trạng Thái"}
//                   defaultObj={"Tất Cả"}
//                   setSelected={(key) => {
//                     setLocalState((pre) => ({
//                       ...pre,
//                       orderStatus: key,
//                     }));
//                   }}
//                 ></SHSelectBoxLabel>
//               </VStack>
//             </HStack>
//             <HStack>
//               <SearchBar
//                 localState={localState}
//                 GetDMS_Order={props.GetDMS_Order}
//                 setLocalState={setLocalState}
//               />
//             </HStack>
//           </PresenceTransition>
//           <Pressable position={"relative"} onPress={() => setIsOpen(!isOpen)}>
//             <HStack justifyContent={"center"}>
//               <Entypo
//                 name={
//                   !isOpen ? "arrow-with-circle-down" : "arrow-with-circle-up"
//                 }
//                 size={16}
//                 color="gray"
//               />
//             </HStack>
//           </Pressable>
//         </View>
//       </View>
//     );
//   }
// );

// const ContentInfo = ({ lstInfo, setlstInfo, item, ...props }) => {
//   const ShowAlert = (mess, isSuccess) => {
//     toast.show({
//       duration: 3000,
//       avoidKeyboard: true,
//       placement: "top",
//       render: () => {
//         return (
//           <Box
//             bg={isSuccess ? "green.600" : "yellow.600"}
//             px="4"
//             _text={{ color: "#fff", fontSize: 18 }}
//             fontSize={18}
//             py="2"
//             rounded="sm"
//             mb={5}
//           >
//             {mess}
//           </Box>
//         );
//       },
//     });
//   };
//   var refColorText = useRef(
//     item.OrderStatus == "REJECT"
//       ? "danger.800"
//       : item.OrderStatus == "APPROVAL"
//         ? "success.800"
//         : "info.800"
//   );
//   const deleteItem = async (Id) => {
//     try {
//       let userStorage = await AsyncStorage.getItem("userInfo");
//       let curUser = JSON.parse(userStorage);
//       const result = await QueryPost(
//         "/DMS_OrderMaster/Delete_OrderMaster",
//         {
//           userName: curUser.UserName,
//           id: Id,
//         },
//         {},
//         false
//       );
//       if (result.IsOK) {
//         Alert.alert('Thông báo', 'Xóa thành công.');
//         setlstInfo(lstInfo.filter(x => x.Id != Id));
//       }
//       if (!result.IsOK) {
//         Alert.alert(result.Messenger);
//       }
//     } catch (e) {
//       props.LoadingSprin(false);
//       ShowAlert(e);
//       return;
//     }
//   }
//   const alertConfirmDelete = (orderNumber) => {
//     Alert.alert('Xác nhận xóa đơn ' + orderNumber, 'Bạn có chắc xóa đơn này không?',
//       [{ text: 'Xóa', style: "default", onPress: () => { deleteItem(item.Id) }, },
//       { text: 'Không', style: 'cancel', onPress: () => { return null; } }],
//       { cancelable: false, userInterfaceStyle: true },
//     );
//   }
//   return (
//     /**TODO Click Detail */
//     <Pressable
//       onPress={() => {
//         setTimeout(() => {
//           props.navigation.navigate('Sale_OrderDetailTab', {
//             screen: 'Sale_OrderDetail',
//             params: {
//               preScreen: 'Sale_Order',
//               MasterId: item.Id,
//               OrderNumber: item.OrderNumber
//             }
//           });
//         }, 1);
//       }}
//     >
//       <Box
//         borderTopWidth={1}
//         mx="2"
//         py="2"
//         borderStyle={"dotted"}
//         borderBottomColor="muted.200"
//       >
//         <HStack mt={1} justifyContent="space-between">
//           <Box alignItems="center">
//             <Popover
//               trigger={(triggerProps) => {
//                 return (
//                   <Pressable {...triggerProps}>
//                     <Badge
//                       {...triggerProps}
//                       borderRadius={5}
//                       colorScheme={
//                         item.OrderStatus == "REJECT"
//                           ? "danger"
//                           : item.OrderStatus == "APPROVAL"
//                             ? "success"
//                             : "info"
//                       }
//                       variant={"outline"}
//                     >
//                       {`${item.OrderNumber} ${item.strOrderStatus} ` +
//                         `- ${moment(item.OrderDate).format("DD/MM/YYYY")}`}
//                     </Badge>
//                   </Pressable>
//                 );
//               }}
//             >
//               <Popover.Content accessibilityLabel="Delete Customerd" w="56">
//                 <Popover.Arrow />
//                 <Popover.CloseButton />
//                 <Popover.Header>{item.OrderNumber}</Popover.Header>
//                 <Popover.Body>
//                   <HStack>
//                     <Text color={refColorText.current} fontSize="13">
//                       {`Ngày dự kiến giao: ${moment(item.ExpectedDate).format(
//                         "DD/MM/YYYY"
//                       )}`}
//                     </Text>
//                   </HStack>
//                   {item.ApprovalBy ? (
//                     <>
//                       <HStack>
//                         <Text color={refColorText.current} fontSize="12">
//                           {item.OrderStatus == "APPROVAL" ? "Duyệt" : "Từ Chối"}
//                           : {item.ApprovalBy}
//                         </Text>
//                       </HStack>
//                       <HStack>
//                         <Text color={refColorText.current} fontSize="12">
//                           Ngày{" "}
//                           {item.OrderStatus == "APPROVAL" ? "duyệt" : "từ chối"}
//                           : {moment(item.ApprovalDate).format("DD/MM/YYYY")}
//                         </Text>
//                       </HStack>
//                     </>
//                   ) : (
//                     <></>
//                   )}
//                   {item.ReasonReject ? (
//                     <>
//                       <HStack>
//                         <Text color={refColorText.current} fontSize="12">
//                           Lý do từ chối: {item.ReasonReject}
//                         </Text>
//                       </HStack>
//                     </>
//                   ) : (
//                     <></>
//                   )}

//                   <HStack>
//                     <Text
//                       color={refColorText.current}
//                       _dark={{
//                         color: "warmGray.200",
//                       }}
//                     >
//                       Ghi chú: {item.Note}
//                     </Text>
//                   </HStack>
//                 </Popover.Body>
//               </Popover.Content>
//             </Popover>
//           </Box>
//           <Pressable
//             onPress={() => {
//               alertConfirmDelete(item.OrderNumber);
//             }}
//           >
//             <Box alignItems="center">
//               <Feather name="trash-2" size={24} color="red" />
//             </Box>
//           </Pressable>
//         </HStack>
//         <HStack justifyContent="space-between">
//           <Box width={"70%"}>
//             <Text fontSize={13} bold>
//               {item.AgencyName}
//             </Text>
//           </Box>
//           <Box alignItems={"flex-end"} width={"30%"}>
//             <Text color={"coolGray.500"}>
//               {"O:" + ConvertToVnd(item.TotalAmount ? item.TotalAmount : 0)}
//             </Text>
//           </Box>
//         </HStack>
//         <HStack justifyContent="space-between">
//           <Box width={"70%"}>
//             <Text fontSize={12}>{item.cmp_name}</Text>
//           </Box>
//           <Box alignItems={"flex-end"} width={"30%"}>
//             <Text color={"green.600"}>
//               {"F:" + ConvertToVnd(item.ConfirmAmount ? item.ConfirmAmount : 0)}
//             </Text>
//           </Box>
//         </HStack>
//       </Box>
//     </Pressable>
//   );
// };

// const ContentInfoHOC = ContentInfo;

// const OrderListScreenNavigation = ({ navigation, ...props }) => {
//   //State
//   const [localState, setLocalState] = useState({
//     PageNumber: -1,
//     RowsOfPage: 10,
//     InfoTypeFilter: "",
//     viewDate: moment(),
//     isStopLoad: false,
//     orderStatus: "",
//     searchText: "",
//     lstOrderStatus: [
//       { key: "", label: "Tất Cả" },
//       { key: "WAIT", label: "Chờ Duyệt" },
//       { key: "APPROVAL", label: "Đã Duyệt" },
//       { key: "REJECT", label: "Từ Chối" },
//     ],
//   });
//   const [isLoading, setLoading] = useState(false);
//   const [lstInfo, setlstInfo] = useState([]);
//   //Ref
//   const initialRef = React.useRef(true);
//   const curUser = React.useRef("");
//   const routes = useRoute();
//   //Contanst
//   const isFocus = useIsFocused();
//   const toast = useToast();
//   const GetUser = async () => {
//     let userStorage = await AsyncStorage.getItem("userInfo");
//     curUser.current = JSON.parse(userStorage);
//   };
//   const funcSetIconRight = () => {
//     navigation.setOptions({
//       headerRight: () => (
//         <Feather
//           name="plus"
//           style={{ marginRight: 10 }}
//           size={25}
//           color="#fff"
//           onPress={() => {
//             navigation.navigate("DMS_OrderDetailTab", {
//               screen: "DMS_OrderDetail",
//               params: {
//                 preScreen: "DMS_Order",
//                 MasterId: '',
//                 OrderNumber: ''
//               }
//             })
//           }}
//         />
//       ),
//     });
//   };
//   useEffect(() => {
//     if (isFocus) {
//       initialRef.current = false;
//       if (isFocus) {
//         funcSetIconRight();
//         GetDMS_Order(
//           localState.viewDate,
//           -1,
//           localState.RowsOfPage,
//           false,
//           {
//             orderStatus: localState.orderStatus,
//             searchText: localState.searchText,
//           }
//         );
//       }
//       InteractionManager.runAfterInteractions(() => {

//       });
//     }
//   }, [isFocus]);

//   useEffect(() => {
//     if (!initialRef.current) {
//       GetDMS_Order(localState.viewDate, 1, localState.RowsOfPage, false, {
//         orderStatus: localState.orderStatus,
//         searchText: localState.searchText,
//       });
//     }
//   }, [localState.searchText]);
//   useEffect(() => {
//     if (!initialRef.current) {
//       GetDMS_Order(localState.viewDate, -1, localState.RowsOfPage, false, {
//         orderStatus: localState.orderStatus,
//         searchText: localState.searchText,
//       });
//     }
//   }, [localState.orderStatus]);
//   useEffect(() => {
//     if (!initialRef.current) {
//       GetDMS_Order(localState.viewDate, -1, localState.RowsOfPage, false, {
//         orderStatus: localState.orderStatus,
//         searchText: localState.searchText,
//       });
//     }
//   }, [localState.viewDate]);

//   const LoadingSprin = (pisLoading = true) => {
//     setLoading(pisLoading);
//   };

//   const renderContent = useCallback(({ item }) => <ContentInfoHOC
//     navigation={navigation}
//     routes={routes}
//     setlstInfo={setlstInfo}
//     lstInfo={lstInfo}
//     LoadingSprin={LoadingSprin}
//     item={item}
//   />, [lstInfo])
//   //Lấy danh sách thông tin thị trường
//   const GetDMS_Order = async (
//     viewDate,
//     pageNumber,
//     pageSize,
//     Isload = true,
//     objData
//   ) => {
//     try {
//       if (Isload) LoadingSprin(true);
//       let userStorage = await AsyncStorage.getItem("userInfo");
//       let curUser = JSON.parse(userStorage);
//       var result = await QueryGet("/DMS_OrderMaster/GetDMS_OrderMobile", {
//         userName: curUser.UserName,
//         viewDate: viewDate.toISOString(),
//         pageNumber: -1,
//         pageSize: pageSize,
//         ...objData,
//       });
//       LoadingSprin(false);
//       var items = JSON.parse(result.Data);
//       if (!items || items.length == 0) setlstInfo([]);

//       if (pageNumber == 1 || pageNumber == -1) {
//         setlstInfo(items);
//         return;
//       }
//     } catch (e) {
//       LoadingSprin(false);
//       //console.log(e);
//     }
//   };
//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 7000);
//   }, [isLoading])
//   return (
//     <>
//       <Spinner visible={isLoading} textContent={'Loading...'} textStyle={{ color: 'white' }} />
//       <Box paddingBottom={"1"} flex={1}>
//         <FilterContentComponent
//           GetDMS_Order={GetDMS_Order}
//           setlabelInfo={(label) => setlabelInfo(label)}
//           setInfoType={(label) => setInfoType(label)}
//           setLocalState={setLocalState}
//           localState={localState}
//         />
//         {lstInfo.length > 0 ? (
//           <>
//             <FlatList
//               removeClippedSubviews

//               // mb="30%"
//               data={lstInfo}
//               // onEndReachedThreshold={0.2}
//               // onEndReached={() => {
//               //   setLocalState((pre) => ({
//               //     ...pre,
//               //     PageNumber: pre.PageNumber + 1,
//               //     RowsOfPage: pre.RowsOfPage,
//               //   }));
//               // }}
//               renderItem={renderContent}
//               keyExtractor={(item) => item.Id}
//             />
//           </>
//         ) : <>
//         </>
//         }
//       </Box>
//     </>
//   );
// };

// export default OrderListScreenNavigation;
