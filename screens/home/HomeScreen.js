/** 
 * Created By: THUONGPV
 * Description: Màn hình trang chủ
 * */
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Alert, Dimensions, LogBox, Pressable, Text, StyleSheet, View, TouchableOpacity, InteractionManager, } from "react-native";
import { useIsFocused, useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box, Flex, Center, HStack } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
// import Spinner from "react-native-loading-spinner-overlay/lib";
import { ConvertToVnd } from "../../common/convert";
import { GetApis } from "../../common/callapi";
import IconExtra from "../../common/icons";

const HomeScreen = ({ navigation, ...props }) => {
    const isFocus = useIsFocused();

    /*thuongpv thong tin trang chu */
    const [totalVisit, setTotalVisit] = useState(0); //DL đã thăm
    const [totalAdd, setTotalAdd] = useState(0); //DL đã thêm
    const [totalApproval, setTotalApproval] = useState(0); //DL đã duyệt
    const [totalOrder, setTotalOrder] = useState(0); //số lượng đã lên đơn
    const [totalOrderConfirm, setTotalOrderConfirm] = useState(0); //số lượng đã xác nhận
    const [totalOrderReject, setTotalOrderReject] = useState(0); //số lượng đã từ chối
    const [priceOrder, setPriceOrder] = useState(0); //doanh số đã lên đơn
    const [priceConfirm, setPriceConfirm] = useState(0); //ds đã xác nhận
    const [isload, setIsLoad] = useState(false);
    useEffect(() => {
        (async () => {
        if (isFocus) {
            getDataDashboard();
        }
        })();
    }, [isFocus]);
    useEffect(() => {
        (async () => {
        props.GetInfoLogin();
        })
        InteractionManager.runAfterInteractions(() => {

        })
    }, []);
    //Lấy dữ liệu trang chủ
    const getDataDashboard = async () => {
        try {
        let userStorage = await AsyncStorage.getItem("userInfo");
        const resJson = JSON.parse(userStorage);
        let curUser = resJson.UserName;
        //LoadingSprin(true);
        var result = await GetApis("DashboardApp","GetDataDashboard", { UserName: curUser, MonthSearch: '2022-12-01' });
        //LoadingSprin(false);
        if (!result.IsOK) {
            Alert.alert("Thông báo", result.Messenger, [{ text: "Đóng" }],);
            return;
        }
        setTotalVisit(result.Data.TotalVisit);
        setTotalAdd(result.Data.TotalAdd);
        setTotalApproval(result.Data.TotalApproval);
        setTotalOrder(result.Data.TotalOrder);
        setTotalOrderConfirm(result.Data.TotalOrderConfirm);
        setTotalOrderReject(result.Data.TotalOrderReject);
        setPriceOrder(result.Data.PriceOrder);
        setPriceConfirm(result.Data.PriceConfirm);
        } catch (err) {
        //console.log(err);
        }
    }
    const { colors } = useTheme();
    return (
        <View style={[styles.containerwhite, { padding: 8 }]}>
        {/* <Spinner visible={isload} textContent={'Đang tải bản mới...'} textStyle={{ color: 'white' }} /> */}
        <ScrollView>
            {/* content */}
            <View style={[styles.boxContent]}>
            {/* Thống kê */}
            <View>
                {/* Tiêu đề */}
                <View flexDirection="row">
                <View flex={4}>
                    <Text style={[styles.textTitle]}>Thống kê tháng</Text>
                </View>
                <View flex={1}>
                    <Text style={[styles.textTitle]}>12/2022</Text>
                </View>
                </View>
                {/* Line*/}
                <View style={[styles.lineColor]}></View>
                {/* Nội dung */}
                <View style={{ marginTop: 5 }}>
                {/* dòng 1 */}
                <View flexDirection="row">
                    {/* box trái */}
                    <View flex={1} flexDirection="row" style={{ padding: 8 }}>
                    {/* Icon */}
                    <View flex={1} style={{ justifyContent: 'center' }}>
                        <IconExtra
                        family="MaterialCommunityIcons"
                        name="camera-marker"
                        color="#199E92"
                        size={30}
                        />
                    </View>
                    {/* Box Text */}
                    <View flex={4}>
                        <Text style={{ color: "#7F7F7F" }}>DL đã thăm</Text>
                        <Text
                        style={{
                            color: "#525252",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                        >
                        {ConvertToVnd(totalVisit)}
                        </Text>
                    </View>
                    </View>
                    {/* box phải */}
                    <View flex={1} flexDirection="row" style={{ padding: 8 }}>
                    {/* Icon */}
                    <View flex={1} style={{ justifyContent: 'center' }}>
                        <IconExtra
                        family="MaterialCommunityIcons"
                        name="order-alphabetical-ascending"
                        color="#199E92"
                        size={30}
                        />
                    </View>
                    {/* Box Text */}
                    <View flex={4}>
                        <Text style={{ color: "#7F7F7F" }}>Đã lên đơn</Text>
                        <Text
                        style={{
                            color: "#525252",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                        >
                        {ConvertToVnd(totalOrder)}
                        </Text>
                    </View>
                    </View>
                </View>
                {/* dòng 2 */}
                <View flexDirection="row">
                    {/* box trái */}
                    <View flex={1} flexDirection="row" style={{ padding: 8 }}>
                    {/* Icon */}
                    <View flex={1} style={{ justifyContent: 'center' }}>
                        <IconExtra
                        family="MaterialCommunityIcons"
                        name="badge-account-horizontal"
                        color="#199E92"
                        size={30}
                        />
                    </View>
                    {/* Box Text */}
                    <View flex={4}>
                        <Text style={{ color: "#7F7F7F" }}>DL đã thêm</Text>
                        <Text
                        style={{
                            color: "#525252",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                        >
                        {ConvertToVnd(totalAdd)}
                        </Text>
                    </View>
                    </View>
                    {/* box phải */}
                    <View flex={1} flexDirection="row" style={{ padding: 8 }}>
                    {/* Icon */}
                    <View flex={1} style={{ justifyContent: 'center' }}>
                        <IconExtra
                        family="MaterialCommunityIcons"
                        name="calendar-multiple-check"
                        color="#199E92"
                        size={30}
                        />
                    </View>
                    {/* Box Text */}
                    <View flex={4}>
                        <Text style={{ color: "#7F7F7F" }}>Đã xác nhận</Text>
                        <Text
                        style={{
                            color: "#525252",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                        >
                        {ConvertToVnd(totalOrderConfirm)}
                        </Text>
                    </View>
                    </View>
                </View>
                {/* dòng 3 */}
                <View flexDirection="row">
                    {/* box trái */}
                    <View flex={1} flexDirection="row" style={{ padding: 8 }}>
                    {/* Icon */}
                    <View flex={1} style={{ justifyContent: 'center' }}>
                        <IconExtra
                        family="MaterialCommunityIcons"
                        name="card-account-mail"
                        color="#199E92"
                        size={30}
                        />
                    </View>
                    {/* Box Text */}
                    <View flex={4}>
                        <Text style={{ color: "#7F7F7F" }}>DL đã duyệt</Text>
                        <Text
                        style={{
                            color: "#525252",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                        >
                        {ConvertToVnd(totalApproval)}
                        </Text>
                    </View>
                    </View>
                    {/* box phải */}
                    <View flex={1} flexDirection="row" style={{ padding: 8 }}>
                    {/* Icon */}
                    <View flex={1} style={{ justifyContent: 'center' }}>
                        <IconExtra
                        family="MaterialCommunityIcons"
                        name="calendar-remove"
                        color="red"
                        size={30}
                        />
                    </View>
                    {/* Box Text */}
                    <View flex={4}>
                        <Text style={{ color: "red" }}>Đã hủy</Text>
                        <Text
                        style={{ color: "red", fontSize: 20, fontWeight: "bold" }}
                        >
                        {ConvertToVnd(totalOrderReject)}
                        </Text>
                    </View>
                    </View>
                </View>
                </View>
            </View>
            {/* Doanh số */}
            <View style={{ marginTop: 10 }}>
                {/* Tiêu đề */}
                <View flexDirection="row">
                <View flex={4}>
                    <Text style={[styles.textTitle]}>Doanh số</Text>
                </View>
                <View flex={1}>
                    <Text style={[styles.textTitle]}>12/2022</Text>
                </View>
                </View>
                {/* Line*/}
                <View style={[styles.lineColor]}></View>
                {/* Nội dung */}
                <View style={{ marginTop: 5 }}>
                {/* dòng 1 */}
                <View flexDirection="row">
                    {/* box trái */}
                    <View flex={1} flexDirection="row" style={{ padding: 8 }}>
                    {/* Icon */}
                    <View flex={1} style={{ justifyContent: 'center' }}>
                        <IconExtra
                        family="MaterialCommunityIcons"
                        name="cash-multiple"
                        color="#199E92"
                        size={30}
                        style={{ paddingBottom: '10%' }}
                        />
                    </View>
                    {/* Box Text */}
                    <View flex={4}>
                        <Text style={{ color: "#7F7F7F" }}>DS đã lên đơn</Text>
                        <Text
                        style={{
                            color: "#525252",
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                        >
                        {ConvertToVnd(priceOrder)} vnd
                        </Text>
                    </View>
                    </View>
                    {/* box phải */}
                    <View flex={1} flexDirection="row" style={{ padding: 8 }}>
                    {/* Icon */}
                    <View flex={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <IconExtra
                        family="FontAwesome5"
                        name="dollar-sign"
                        color="#199E92"
                        size={28}
                        />
                    </View>
                    {/* Box Text */}
                    <View flex={4}>
                        <Text style={{ color: "#7F7F7F" }}>DS đã xác nhận</Text>
                        <Text
                        style={{
                            color: "#525252",
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                        >
                        {ConvertToVnd(priceConfirm)} vnd
                        </Text>
                    </View>
                    </View>
                </View>
                </View>
            </View>
            </View>
            {/* Btn */}
            <View style={{ marginTop: 10 }}>
            {/* dòng 1 */}
            <View flexDirection="row">
                {/* btn trái */}
                <View flex={1} style={{ backgroundColor: '#4AB2A8', alignItems: 'center', margin: 10, borderRadius: 7 }}>
                <TouchableOpacity
                    style={styles.icontop}
                    onPress={() => { navigation.navigate("AddNewAgency"); }}
                >
                    {/* icon */}
                    <View style={{ margin: 10, alignItems: 'center' }}>
                    <IconExtra
                        family="MaterialCommunityIcons"
                        name="calendar-cursor"
                        color="white"
                        size={50}
                    />
                    </View>
                    {/* text */}
                    <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Tạo đại lý</Text>
                    </View>
                </TouchableOpacity>
                </View>
                {/* btn trái */}
                <View flex={1} style={{ backgroundColor: '#4AB2A8', alignItems: 'center', margin: 10, borderRadius: 7 }}>
                <TouchableOpacity
                    style={styles.icontop}
                    onPress={() => { navigation.navigate("CategoryAgency"); }}
                >
                    {/* icon */}
                    <View style={{ margin: 10, alignItems: 'center' }}>
                    <IconExtra
                        family="MaterialIcons"
                        name="list-alt"
                        color="white"
                        size={50}
                    />
                    </View>
                    {/* text */}
                    <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>DS đại lý</Text>
                    </View>
                </TouchableOpacity>
                </View>
            </View>
            <View flexDirection="row">
                {/* btn trái */}
                <View flex={1} style={{ backgroundColor: '#4AB2A8', alignItems: 'center', margin: 10, borderRadius: 7 }}>
                <TouchableOpacity
                    style={styles.icontop}
                    onPress={() => { navigation.navigate("DMSCheckIn"); }}
                >
                    {/* icon */}
                    <View style={{ margin: 10, alignItems: 'center' }}>
                    <IconExtra
                        family="FontAwesome5"
                        name="camera-retro"
                        color="white"
                        size={50}
                    />
                    </View>
                    {/* text */}
                    <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Checkin</Text>
                    </View>
                </TouchableOpacity>
                </View>
                {/* btn trái */}
                <View flex={1} style={{ backgroundColor: '#4AB2A8', alignItems: 'center', margin: 10, borderRadius: 7 }}>
                <TouchableOpacity
                    style={styles.icontop}
                    onPress={() => { navigation.navigate('InfoMarketing', { screen: 'InfoMarketingScreen' }); }}
                >
                    {/* icon */}
                    <View style={{ margin: 10, alignItems: 'center' }}>
                    <IconExtra
                        family="MaterialCommunityIcons"
                        name="chart-line-stacked"
                        color="white"
                        size={50}
                    />
                    </View>
                    {/* text */}
                    <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Khảo sát</Text>
                    </View>
                </TouchableOpacity>
                </View>
            </View>
            {/* dòng 1 */}
            <View flexDirection="row">
                {/* btn trái */}
                <View flex={1} style={{ backgroundColor: '#4AB2A8', alignItems: 'center', margin: 10, borderRadius: 7 }}>
                <TouchableOpacity
                    style={styles.icontop}
                    onPress={() => {
                    setTimeout(() => {
                        navigation.navigate('Sale_OrderDetailTab', {
                        screen: 'Sale_OrderDetail',
                        params: {
                            preScreen: 'Home'
                        }
                        });
                    }, 1)
                    }}
                >
                    {/* icon */}
                    <View style={{ margin: 10, alignItems: 'center' }}>
                    <IconExtra
                        family="MaterialIcons"
                        name="post-add"
                        color="white"
                        size={50}
                    />
                    </View>
                    {/* text */}
                    <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Đặt hàng</Text>
                    </View>
                </TouchableOpacity>
                </View>
                {/* btn trái */}
                <View flex={1} style={{ backgroundColor: '#4AB2A8', alignItems: 'center', margin: 10, borderRadius: 7 }}>
                <TouchableOpacity
                    style={styles.icontop}
                    onPress={() => {
                    setTimeout(() => {
                        navigation.navigate('Sale_OrderTab');
                    }, 1)
                    }}
                >
                    {/* icon */}
                    <View style={{ margin: 10, alignItems: 'center' }}>
                    <IconExtra
                        family="MaterialCommunityIcons"
                        name="calendar-text-outline"
                        color="white"
                        size={50}
                    />
                    </View>
                    {/* text */}
                    <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Đơn hàng</Text>
                    </View>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </ScrollView>
        </View>
    );
}
export default HomeScreen;

const styles = StyleSheet.create({
    /*start thuongpv code thêm style, không sử dụng style cũ, có thời gian sẽ lược bớt những style không dùng*/
    boxContent: {
      borderWidth: 2,
      borderColor: "#199E92",
      borderRadius: 10,
      padding: 10
    },
    textTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: '#7F7F7F'
    },
    textContent: {
      color: '#7F7F7F'
    },
    lineColor: {
      borderTopWidth: 1,
      borderColor: "#7F7F7F",
    },
    /*end thuongpv code thêm style, không sử dụng style cũ, có thời gian sẽ lược bớt những style không dùng*/
  
    containerwhite: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "white",
    },
  });