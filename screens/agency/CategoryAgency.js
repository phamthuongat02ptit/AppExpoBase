import { useState, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, TextInput, FlatList, Linking,TouchableOpacity,Alert, Text } from 'react-native';
import { Feather, } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetApis, PostApis } from '../../common/callapi';
import * as Location from 'expo-location';
const CategoryAgency = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(false);
    const [lstAgency, setLstAgency] = useState([]);
    const [txtSearch, setTxtSearch] = useState('');
    const [lstFilter, setLstFilter] = useState([]);
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    //loadding
    const LoadingSprin = (pisLoading = true) => {
        setLoading(pisLoading);
    };
    const refreshData = () => {
        setLstAgency([]);
        setLstFilter([]);
        setTxtSearch("");
    }
    //Check xem thiết bị đã bật định vị chưa
    const CheckIfLocationEnabled = async () => {
        let enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            Alert.alert(
                'Thông báo',
                'Bạn chưa bật định vị của thiết bị',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return false;
        }
        return true;
    }
    //Check xem thiết bị có cho phép truy cập vào định vị k
    const GetCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Thông báo',
                'Bạn chưa cho phép ứng dụng truy cập vị trí',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return false;
        }
        let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, });
        if (coords) {
            const { latitude, longitude } = coords;
            setLocation(pre => ({
                ...pre,
                latitude: latitude,
                longitude: longitude
            }));
            return true;
        } else {
            Alert.alert(
                'Thông báo',
                'Không lấy được tọa độ ở vị trí hiện tại',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return false;
        }
    }
    useEffect(() => {
        if (isFocused) {
            (async () => {
                refreshData();
                var enabled = await CheckIfLocationEnabled();
                if (!enabled)
                    return false;
                await GetCurrentLocation();
            })();
        }
    }, [isFocused]);

    useEffect(() => {
        getListAgencyByUser();
    }, [location]);

    const getListAgencyByUser = async () => {
        try {
            let userStorage = await AsyncStorage.getItem("userInfo");
            const resJson = JSON.parse(userStorage);
            let curUser = resJson.UserName;
            LoadingSprin(true);
            const result = await GetApis("api/DMSV2","GetListDMSCustomerLookup", { username: curUser, latitude: location.latitude, longitude: location.longitude });
            LoadingSprin(false);
            if (!result.IsOK) {
                Alert.alert("Thông báo", result.Messenger, [{ text: "Đóng" }],);
                return;
            }
            setLstAgency(result.Data);
            setLstFilter(result.Data);
        } catch (err) {
            LoadingSprin(false);
            Alert.alert("Thông báo", "Cập nhật lại vị trí điểm bán", [{ text: "Đóng" }],);
        }
    }

    const confirmChangeLocation = async (Id) => {
        Alert.alert("Thông báo", "Cập nhật lại tọa độ điểm bán", [{ text: "Đóng" },
        { text: "Đồng ý", onPress: () => { saveChangeLocation(Id) } }]);
    }

    const saveChangeLocation = async (Id) => {
        try {
            let userStorage = await AsyncStorage.getItem("userInfo");
            const resJson = JSON.parse(userStorage);
            let curUser = resJson.UserName;
            if (location.latitude == 0 || location.longitude == 0) {
                Alert.alert("Thông báo", "Không lấy được vị trí hiện tại vui long thử lại", [{ text: "Đóng" }]);
                GetCurrentLocation();
            }
            LoadingSprin(true);
            const res = await GetApis("api/DMSV2","GetUpdateLocation", { agencyId: Id, latitude: location.latitude, longitude: location.longitude, username: curUser });
            LoadingSprin(false);
            Alert.alert("Thông báo", res.Messenger, [{ text: "Đóng" }],);
            if (!res.IsOK) {
                return false;
            };
            getListAgencyByUser();
        } catch (err) {
            LoadingSprin(false);
            Alert.alert("Thông báo", err, [{ text: "Đóng" }],);
        }
    }

    const filterAgency = async (txtKey) => {
        setTxtSearch(txtKey);
        if (txtKey != "") {
            setLstFilter(lstAgency.filter(c => c.cmp_name.toLowerCase().indexOf(txtKey.toLowerCase()) != -1 || c.PhoneNumber.indexOf(txtKey) != -1));

        } else {
            setLstFilter(lstAgency);
        }
    }
    const LinkGoogleMAp = async (lat1, long1) => {
        let lati = parseFloat(lat1);
        let longi = parseFloat(long1);
        if (location.latitude == 0 || location.longitude == 0) {
            Alert.alert("Thông báo", "Không lấy được vị trí hiện tại", [{ text: "Đóng" }],);
            return;
        }
        const browser_url = `https://www.google.com/maps/dir/'${location.latitude},${location.longitude}'/'${lati},${longi}'`;
        return Linking.openURL(browser_url);
    }

    const confirmInfo = async (Id,lat1,long1) => {
        Alert.alert("Thông báo", "", [
        { text: "Update Location", onPress: () => { saveChangeLocation(Id) } },
        { text: "Google Map", onPress: () => { LinkGoogleMAp(lat1,long1) } },
        { text: "Close" }
    ]);
    }
    return (
        <View pt="1">
            <View space={"1"} justify-content="flex-start">
                <View width="100%">
                    <View style={[styles.action, styles.fieldSet]}>
                        <Text style={styles.legend}>Tìm kiếm</Text>
                        <TextInput
                            placeholder="Nhập từ khóa tìm kiếm..."
                            value={txtSearch}
                            placeholderTextColor="#9A9696"
                            autoCapitalize="none"
                            style={[styles.textInput]}
                            onChangeText={(val) => filterAgency(val)}
                        />

                    </View>
                </View>
            </View>
            <View pl="2" pr="2">
                <FlatList data={lstFilter} 
                //maxToRenderPerBatch = {10} 
                windowSize = {2} //Number ở đây là một đơn vị đo lường trong đó 1 tương đương với chiều cao khung nhìn của bạn. Default là 21, là 10 khung nhìn ở trên, 10 bên dưới và một ở giữa
                initialNumToRender = {10} //Số lượng hiển thị ban đầu
                updateCellsBatchingPeriod = {20} //end scroll update thêm số lượng item
                removeClippedSubviews = {true} //Xóa đi nhưng dữ liệu người scroll
                renderItem={({ item }) =>
                    <View style={{ borderBottomWidth: "1", borderColor: "#d4d4d4", fontStyle: "bold", padding: 5 }}>
                        <TouchableOpacity onPress = {() => confirmInfo(item.cmp_wwn,item.Latitude, item.Longitude)}>
                            <Text style={{ color: "green", fontSize: 13 }} >{item.cmp_name} - {item.PhoneNumber}<Text style={{ fontSize: 10 }}>({item.Distance}km)</Text></Text>
                            <Text style={{ fontSize: 12 }}>{item.Address}</Text>
                        </TouchableOpacity>
                    </View>
                } />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        flex: 1, justifyContent: "flex-start", flexDirection: "row"
    },
    container: {
        flex: 1,
        paddingTop: 10
    },
    camera: {
        flex: 5,
        borderRadius: 20,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    Actionbtn:
    {

        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'

    },
    btn: {
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        alignSelf: 'stretch',
        color: '#fff',
        marginTop: 8,
        marginBottom: 8,
        minWidth: '45%',
        paddingHorizontal: 16,
    },

    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 10
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 7,
        fontSize: 15,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    fieldSet: {
        margin: 10,
        paddingHorizontal: 10,
        paddingBottom: 7,
        paddingTop: 7,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: "center",
        borderBottomColor: "#d4d4d4",
        borderColor: "#d4d4d4",
    },
    legend: {
        position: 'absolute',
        top: -10,
        left: 10,
        fontSize: 11,
        color: '#7F7F7F',
        fontWeight: 'bold',
        backgroundColor: '#FFFFFF'
    },
    selectList:
    {
        borderEndColor: 0,
        borderBottomColor: 0,
        borderTopColor: 0,
        borderStartColor: 0,
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 0
    }
});
export default CategoryAgency;