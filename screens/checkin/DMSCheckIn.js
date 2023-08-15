import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from "react-native-paper";
import { GetApis, PostApis } from '../../common/callapi';
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';
import axios from 'axios';
import config from '../../config/appsetting';
import { Feather } from "@expo/vector-icons";
var profileImage = require('../../assets/camera.png');
import SHSelectBoxLabel from "../../components/SHSelectBoxLabel";
const DMSCheckIn = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [curUser, setCurUser] = useState({});
    const [lstAgency, setLstAgency] = useState([]);
    const [distance, setDistance] = useState("");
    const [agencyId, setAgencyId] = useState("");
    const [urlDoc, setUrlDoc] = useState("");
    const [images, setImages] = useState("");
    const [address, setAddress] = useState("");
    const [location,setLocation] = useState({latitude: 0,longitude : 0});
    const [saving, setSaving] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const isFocused = useIsFocused();
    

    useEffect(() => {
        (async () => {
            await GetUser();
        })();
    }, []);

    useEffect(() => {
        if(isFocused)
        {
            (async () => {
                refreshData();
                var enabled = await CheckIfLocationEnabled();
                if(!enabled)
                return false;
                await GetCurrentLocation();
            })();
        }
       
    }, [isFocused]);
    useLayoutEffect(() => {
        funcSetIconRight();
    }, []);
    useEffect(() => {
        if (saving) {
            saveCheckInAgency();
        }
        setSaving(false);
    }, [saving]);

    useEffect(() => {
        if(location.latitude != 0)
        {
            getListAgencyByUser();
        }
    }, [location]);

    //refresh data
    const refreshData = async () => {
        setImages("");
        setDistance("");
        setAgencyId("");
        setUrlDoc("");
        setSaving(false);
        setIsReset(true); 
    }
    //hàm thông bảo
    const ShowAlert = (mess, isSuccess) => {
        // const id = "show"
        // if (!toast.isActive(id))
        // {
        //     toast.show({
        //         id,
        //         duration: 3000,
        //         avoidKeyboard: true,
        //         render: () => {
        //             return (
        //                 <View
        //                     bg={isSuccess ? "green.400" : "yellow.400"}
        //                     px="4"
        //                     _text={{ color: "#fff", fontSize: 18 }}
        //                     fontSize={18}
        //                     py="2"
        //                     rounded="sm"
        //                     mb={5}
        //                 >
        //                     {mess}
        //                 </View>
        //             );
        //         },
        //     });
        // }
       
    };
    //Lấy user name trong hệ thống
    const GetUser = async () => {
        let userStorage = await AsyncStorage.getItem("userInfo");
        const resJson = JSON.parse(userStorage);
        setCurUser(resJson);
    };
    //Lấy danh sách đại lý theo user
    const getListAgencyByUser = async () => {
        try {
            let userStorage = await AsyncStorage.getItem("userInfo");
            const resJson = JSON.parse(userStorage);
            let curUser = resJson.UserName;
            LoadingSprin(true);
            const result = await QueryGet("api/DMSV2/GetListDMSCustomerLookup", { username: curUser,latitude : location.latitude,longitude: location.longitude }, false);
            LoadingSprin(false);
            if (!result.IsOK) {
                ShowAlert(result.Messenger)
                return;
            }
            const resCon = await result?.Data.map(item => ({ key: item.cmp_wwn, label: item.cmp_name + "-" + item.PhoneNumber + "(" + item.Distance + "km)",Distance : item.Distance, latitude: item.Latitude, longitude: item.Longitude }));
            setLstAgency(resCon);
        } catch (ex) {
            LoadingSprin(false);
            ShowAlert(ex)
        }
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
        try {
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
                let response = await Location.reverseGeocodeAsync({ latitude, longitude }, true);
                for (let item of response) {
                    let address = Platform.OS === "android" ? `${item.street}, ${item.subregion}, ${item.region}` : `${item.name}, ${item.district}, ${item.subregion}, ${item.city}`;
                    setAddress(address);
                }
                return true;
            }else
            {
                Alert.alert(
                    'Thông báo',
                    'Không lấy được tọa độ ở vị trí hiện tại',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                return false;
            }

        } catch (ex) {
            ShowAlert(ex)
            return false;
        }
    }
    //Bật camera
    const openCameraWithPermission = async () => {
        try {
            let isPermission = await ImagePicker.getCameraPermissionsAsync();
            if (!isPermission.granted) {
                let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                if (permissionResult.granted === false) {
                    Alert.alert(
                        'Thông báo',
                        'Bạn chưa cho phép ứng dụng truy cập vào Camera',
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                    return false;
                }
            }
            let result = await ImagePicker.launchCameraAsync({ allowsEditing: false, aspect: [4, 3], quality: 1, });
            if (!result.canceled) {
                result.UrlDoc = Platform.OS === "android" ? result.uri : result.uri.replace("file://", "");
                setImages(result.uri);
            }
        } catch (error) {
            ShowAlert(error)
        }
    }
    //loadding
    const LoadingSprin = (pisLoading = true) => {
        setLoading(pisLoading);
    };
    //Vẽ nút lưu bên phải
    const funcSetIconRight = () => {
        props.navigation.setOptions({
            headerRight: () => (
                <Feather
                    name="check"
                    style={{ marginRight: 10 }}
                    size={25}
                    color="#fff"
                    onPress={() => {
                        setSaving(true);
                    }}
                />
            ),
        });
    };
    //Tính khoảng cách
    const rad = (x) => {
        return x * Math.PI / 180;
    };
    // const getDistance = (latAgency, longAgency) => {
    //     try{
    //         var R = 6378137; // Earth’s mean radius in meter
    //         var dLat = rad(latitude - latAgency);
    //         var dLong = rad(longitude - longAgency);
    //         var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //             Math.cos(rad(latAgency)) * Math.cos(rad(latitude)) *
    //             Math.sin(dLong / 2) * Math.sin(dLong / 2);
    //         var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //         var d = R * c;
    //         return Math.round(d, 3);
    //     }catch(ex)
    //     {
    //         ShowAlert(ex)
    //     }
    // };
    //even chọn đại lý check in
    const fSelected = (key) => {
        var obj = lstAgency.find(c => c.key == key);
        if (obj != null) {
            setDistance(`${obj.Distance * 1000}`);
            setAgencyId(key);
            setIsReset(false);
        }
    }
    //Call hàm luwu image và check in
    const saveCheckInAgency = async () => {
        //validate data
        if (images == "") {
            ShowAlert("Bạn chưa chụp ảnh checkin");
            return false;
        }
        if (agencyId == "") {
            ShowAlert("Bạn chưa chọn điểm bán");
            return false;
        }
        if (curUser.UserName === "") {
            ShowAlert("Không lấy được thông tin đăng nhập");
            return false;
        }
        if (location.latitude == 0 || location.longitude == 0) {
            ShowAlert("Không lấy được định vị trí hiện tại");
            return false;
        }
        if (distance > 100) {
            ShowAlert("Khoảng cách check in phải nhỏ hơn hoặc bằng 100m");
            return false;
        }

        //upload image
        LoadingSprin(true);
        var objUpload = await uploadFile();
        if (objUpload == null)
            return;
        await saveCheckIn(objUpload);

    }
    //Lưu thông tin check in
    const saveCheckIn = async (objUpload) => {

        try {
            const res = await PostApis("api/DMSV2/SaveCheckInData","",
                {
                    cmp_wwn: agencyId,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    username: curUser.UserName,
                    distance: distance,
                    sysnote: "APPDMS",
                    imagepath: objUpload.Value,
                    actioncode: "CHECKIN"
                }, "");
            LoadingSprin(false);
            if (res.IsOK) {
                props.navigation.goBack();
                ShowAlert(res.Messenger, true);
                return;
            } else {
                ShowAlert(res.Messenger);
                return;
            }

        } catch (err) {
            LoadingSprin(false);
            ShowAlert(err);
            return;
        }
    }
    //upload hình ảnh
    var uploadFile = async () => {
        try {
            let formData = new FormData();
            let filename = images.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            let uri = Platform.OS === "android" ? images : images.replace("file://", "");
            formData.append("photo", { uri: uri, name: filename, type });
            var res = await axios.post(`${config.APIHOSTBASE}/api/Document/UploadFile?appid=${config.appidExpo}&username=${curUser.UserName}&filetype=image&recordid=${uuid.v4()}&docNote=APP`,
                formData, {
                headers:
                {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": config.Authorization
                },
            });
            LoadingSprin(false);
            if (res.data.ResponseStatus != "OK") {
                ShowAlert(res.data.ResponseMessenger);
                return null;
            }
            var obj = res.data.ResponseData.find(c => c.Key == "Url");
            return obj;
        } catch (error) {
            LoadingSprin(false);
            ShowAlert(error);
            return null;
        }
    }
    return (
        <KeyboardAwareScrollView >
            <View style={styles.container}>
                <View style={{ padding: 5 }}>
                    <SHSelectBoxLabel
                        dataSource={lstAgency}
                        placeholder={"Điểm bán"}
                        label={"Điểm bán"}
                        isReset={isReset}
                         setSelected={(key) => fSelected(key)}
                        >
                        </SHSelectBoxLabel>
                </View>
                <TouchableOpacity style={styles.image} onPress={() => { openCameraWithPermission() }}>
                    <ImageBackground style={{ width: 200, height: 200 }} imageStyle={{ borderRadius: 100, borderWidth: 0.5 }} source={images == "" ? profileImage : { uri: `${images}` }} resizeMode="cover">
                    </ImageBackground>
                </TouchableOpacity>

                <View style={{ padding: 5, marginTop: 15 }}>
                    <View style={[styles.action, styles.fieldSet]}>
                        <Text style={styles.legend}>THÔNG TIN CHUNG</Text>
                        <View style={{ flex: 1 }}>
                            <View style={styles.infoView}>
                                <Text style={{ flex: 1 }} >Người dùng: </Text>
                                <Text style={{ flex: 2 }} >{curUser.FullName}</Text>
                            </View>
                            <View style={styles.infoView}>
                                <Text style={{ flex: 1 }}>Vị trí:</Text>
                                <Text style={{ flex: 2 }}>{address}</Text>
                            </View>
                            <View style={styles.infoView}>
                                <Text style={{ flex: 1 }}>Khoảng cách:</Text>
                                <Text style={{ flex: 2 }}>{distance}m</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>

    );
}

const styles = StyleSheet.create({
    image: {
        ustifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    container: {
        flex: 1,
        paddingTop: 10
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
    infoView:
    {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "center"
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
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    fieldSet: {
        margin: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: '#E5E5E5'
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
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0
    }

});
export default DMSCheckIn;