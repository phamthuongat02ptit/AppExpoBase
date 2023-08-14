import { useState, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, Text, TextInput, Image, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons'
import { GetApis, PostApis } from '../../common/callapi';
import StatesCountry from '../../common/StatesCountry';
import { useIsFocused } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box, useToast } from "native-base";
import * as Location from 'expo-location';
import axios from 'axios';
import config from '../../config/appsetting';
import { Feather } from "@expo/vector-icons";
import SHSelectBoxLabel from "../../components/SHSelectBoxLabel";

const AddNewAgency = ({ navigation, route }) => {
    const [editable, setEditable] = useState(true)
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [agency, setAgency] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [id, setId] = useState("");
    const [isReset, setIsReset] = useState(false);
    const [rsDistrict, setRsDistrict] = useState(false);
    const [rsCommune, setRsCommune] = useState(false);
    const [saleAvg, setSaleAvg] = useState("");
    const [scaleValue, setScaleValue] = useState("");
    const [provinceId, setProvinceId] = useState("")
    const [lstProvince, setListProvince] = useState([])
    const [cmp_wwn, setCmp_wwn] = useState("")
    const [dataSelect, setDataSelect] = useState({ cmp_name: "", scalename: "", proviname: "", districtname: "", communename: "" })
    const [lstDistrict, setListDistrict] = useState([])
    const [districtId, setDistrictId] = useState("")
    const [lstCommune, setListCommune] = useState([])
    const [communeId, setCommuneId] = useState("")
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [lstCmp, setLstCmp] = useState([]);
    const [saving, setSaving] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [curUser, setCurUser] = useState("")
    const [images, setImages] = useState([]);
    const lstDataScale = [{ key: 'SMALL', label: 'Nhỏ', }, { key: 'MEDIUM', label: 'Vừa', }, { key: 'LARGE', label: 'Lớn', }];
    const isFocused = useIsFocused();
    const toast = useToast();
    const refreshData = async () => {
        setCommuneId("");
        setId("");
        setDistrictId("");
        setProvinceId("");
        setScaleValue("");
        setCmp_wwn("");
        setSaleAvg("");
        setAddress("");
        setContact("");
        setAgency("");
        setPhone2("");
        setLatitude(0);
        setLongitude(0);
        setImages([]);
        setEditable(true);
        setIsReset(true);
        setDataSelect({ cmp_name: "", scalename: "", proviname: "", districtname: "", communename: "" });
        setRsDistrict(true);
        setRsCommune(true);
        setSaving(false);
    }

    const lstState = StatesCountry.filter(c => c.StatesLevel == 0).map(item => ({ key: item.Id, label: item.Name }));
    //Lấy danh sách NPP
    const GetListCmp = async () => {
        try {
            let userStorage = await AsyncStorage.getItem("userInfo");
            const resJson = JSON.parse(userStorage);
            let curUser = resJson.UserName;
            LoadingSprin(true);
            const res = await GetApis("api/DMSV2", "GetListCustomerForPP" , { loginUser: curUser });
            LoadingSprin(false);
            if (!res.IsOK) {
                Alert.alert("Thông báo", res.Messenger, [{ text: "Đóng" }],);
                return;
            }
            const resCon = res?.Data.map(item => ({ key: item.cmp_wwn, label: item.cmp_name }));
            setLstCmp(resCon);
        } catch (ex) {
            LoadingSprin(false);
            ShowAlert(ex);
        }
    }
    //LẤy user
    const GetUser = async () => {
        let userStorage = await AsyncStorage.getItem("userInfo");
        const resJson = JSON.parse(userStorage);
        setCurUser(resJson.UserName);

    };
    //loadding
    const LoadingSprin = (pisLoading = true) => {
        setLoading(pisLoading);
    };
    //Loadding
    const ShowAlert = (mess, isSuccess) => {
        const id = "show";
        if(!toast.isActive(id))
        {
            toast.show({
                id,
                duration: 3000,
                avoidKeyboard: true,
                render: () => {
                    return (
                        <Box
                            bg={isSuccess ? "green.400" : "yellow.400"}
                            px="4"
                            _text={{ color: "#fff", fontSize: 18 }}
                            fontSize={18}
                            py="2"
                            rounded="sm"
                            mb={5}>
                            {mess}
                        </Box>
                    );
                },
            });
        }  
    };
    //Lưu agency
    const saveNewAgency = async () => {
        try {
            if (agency == "" || agency == null) {
                ShowAlert("Tên đại lý không được để trống");
                return false;
            }
            if (contact == "" || contact == null) {
                ShowAlert("Người liên hệ không được để trống");
                return false;
            }
            if (phone1 == "" || phone1 == null) {
                ShowAlert("Số điện thoại không được để trống");
                return false;
            }
            if (address == "" || address == null) {
                ShowAlert("Địa chỉ không được để trống");
                return false;
            }
            if (saleAvg == "" || saleAvg == null) {
                ShowAlert("Doanh số TB không được để trống");
                return false;
            }
            if (cmp_wwn == "" || cmp_wwn == null) {
                ShowAlert("NPP không được để trống");
                return false;
            }
            if (scaleValue == "" || scaleValue == null) {
                ShowAlert("Quy mô không được để trống");
                return false;
            }
            if (provinceId == "" || provinceId == null) {
                ShowAlert("Tỉnh/TP không được để trống");
                return false;
            }
            if (districtId == "" || districtId == null) {
                ShowAlert("Quận/Huyện không được để trống");
                return false;
            }
            if (communeId == "" || communeId == null) {
                ShowAlert("Xã/Phường không được để trống");
                return false;
            }
            if (images.length <= 0) {
                ShowAlert("Ảnh đại lý không được để trống");
                return false;
            }
            var Id = id;
            var formBody =
            {
                "Id": Id,
                "cmp_wwn": cmp_wwn,
                "AgencyName": agency,
                "Address": address,
                "SHProvinceId": provinceId,
                "SHDistrictId": districtId,
                "WardID": communeId,
                "PhoneNumber": phone1,
                "PhoneNumber2": phone2,
                "ContactName": contact,
                "AgencyType": "AGENCY",
                "SizeCode": scaleValue,
                "MonthlyRevenue": saleAvg,
                "Latitude": latitude,
                "Longitude": longitude,
                "AuditRound": 0
            }

            LoadingSprin(true);
            var checkUpload = await uploadFile(Id);
            if (!checkUpload)
                return;
            const res = await QueryPost("api/DMSV2/SaveSHMarAgencyForUser", { loginUser: curUser }, formBody);

            if (!res.IsOK) {
                LoadingSprin(false);
                ShowAlert(res.Messenger);
                return false;
            }
            ShowAlert(res.Messenger, true);
            setPhone1("");
            await refreshData();
            LoadingSprin(false);

        } catch (ex) {
            LoadingSprin(false);
            ShowAlert(ex);
        }


    }
    //upload hình ảnh
    var uploadFile = async (recodId) => {
        try {
            let formData = new FormData();
            var imageSave = images.filter(c => c.typeUrl == "CAMERA");
            if (imageSave.length > 0) {
                for (let img of imageSave) {
                    let filename = img.uri.split('/').pop();
                    let match = /\.(\w+)$/.exec(filename);
                    let type = match ? `image/${match[1]}` : `image`;
                    let uri = Platform.OS === "android" ? img.uri : img.uri.replace("file://", "");
                    formData.append("photo", { uri: uri, name: filename, type });
                }
                var res = await axios.post(`${config.APIHOSTBASE}/api/Document/UploadFile?appid=${config.appidExpo}&username=${curUser}&filetype=image&recordid=${recodId}&docNote=APP`,
                    formData, {
                    headers:
                    {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": config.Authorization
                    },
                });

                if (res.data.ResponseStatus != "OK") {
                    LoadingSprin(false);
                    ShowAlert(res.data.ResponseMessenger);
                    return false;
                }
            }
            return true;
        } catch (error) {
            LoadingSprin(false);
            ShowAlert(error);
            return false;
        }
    }
    //convert number
    const convertNumber = (txtNumber, paramSet) => {
        const valueNum = txtNumber.replace(/[^0-9]/g, '');
        paramSet(valueNum);
    }
    //Lấy thông tin đại lý từ SDT
    const getAgencyByPhone = async () => {
        //Lấy tọa độ và vị trí hiện tại
        try {
            if(phone1 != "")
            {
                setImages([]);
                setId("");
                LoadingSprin(true);
                const res = await GetApis("api/DMSV2", "GetAgencyByPhone" , { phonenumber: phone1, loginUser: curUser });
                LoadingSprin(false);
                if (!res.IsOK) {
                    ShowAlert(res.Messenger);
                    return;
                }
                let result = res.Data;
                if (result.length > 0) {
                    let data = result[0];
                    setImages(result.map(item => ({ uri: item.UrlDoc, typeUrl: "DEFAUT" })));
                    setAddress(data.Address);
                    setSaleAvg("" + data.MonthlyRevenue);
                    setCommuneId(data.WardID);
                    setDistrictId(data.SHDistrictId);
                    setProvinceId(data.SHProvinceId);
                    setScaleValue(data.SizeCode);
                    setCmp_wwn(data.cmp_wwn);
                    setContact(data.ContactName);
                    setAgency(data.AgencyName);
                    setPhone1(data.PhoneNumber);
                    setPhone2(data.PhoneNumber2);
                    setId(data.Id);
                    if (data.Approval)
                        setEditable(false);
                    let objScale = lstDataScale.find(c => c.key == data.SizeCode);
                    setDataSelect({ cmp_name: data.cmp_name, scalename: objScale == null ? "" : objScale.label, provincename: data.provincename, districtname: data.districtname, communename: data.communename });
                } else {
                    setEditable(true);
                    await refreshData();
                }
                await GetCurrentLocation();
            }
        } catch (ex) {
            LoadingSprin(false);
            ShowAlert(ex);
        }
    }
    useEffect(() => {
        (async () => {
            setListProvince(lstState);
            await GetUser();
            await GetListCmp();
        })();
    }, []);

    useLayoutEffect(() => {
        funcSetIconRight();
    }, []);
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
        //setLocationServiceEnabled(enabled);

    }
    //Check xem thiết bị có cho phép truy cập vào định vị k
    const GetCurrentLocation = async () => {
        try {
            LoadingSprin(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Thông báo',
                    'Bạn chưa cho phép ứng dụng truy cập vị trí',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                LoadingSprin(false);
                return false;
            }
            let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, });
            if (coords) {
                const { latitude, longitude } = coords;
                setLatitude(latitude); setLongitude(longitude);
                //console.log(latitude);
                let response = await Location.reverseGeocodeAsync({ latitude, longitude }, true);
                for (let item of response) {
                    let address = Platform.OS === "android" ? `${item.street}, ${item.subregion}, ${item.region}` : `${item.name}, ${item.district}, ${item.subregion}, ${item.city}`;
                    setAddress(address);
                }
            }
            LoadingSprin(false);

        } catch (ex) {
            LoadingSprin(false);
            ShowAlert(error);
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
                let objImage = { uri: result.uri, typeUrl: "CAMERA" };
                images.push(objImage);
                setImages([...images]);
            }
        } catch (error) {
            ShowAlert(error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            setPhone1("");
            (async () => {
                await refreshData();
                var locationEnabled = await CheckIfLocationEnabled();
                if (!locationEnabled) {
                    setLatitude(0); setLongitude(0);
                    return;
                }
                //await GetCurrentLocation();
            })();
        }
    }, [isFocused]);

    useEffect(() => {
        if (saving) {
            saveNewAgency();
        }
        setSaving(false);
    }, [saving]);

    const funcsetSelected = async (value, typeOption) => {
        setIsReset(false);
        if (typeOption == "PROVINCE") {
            setListDistrict(StatesCountry.filter(c => c.RefId == value).map(item => ({ key: item.Id, label: item.Name })));
            setProvinceId(value);
            setRsDistrict(true);
            dataSelect.districtname = "";
            dataSelect.communename = "";
            setRsCommune(true);
            setListCommune([]);
            setDistrictId("");
            setCommuneId("");
        }

        if (typeOption == "DISTRICT") {
            setDistrictId(value);
            if (districtId != "") {
                setListCommune(StatesCountry.filter(c => c.RefId == value).map(item => ({ key: item.Id, label: item.Name })));
                setCommuneId("");
                dataSelect.communename = "";
                setRsDistrict(false);
                setRsCommune(true);
            }
        }

        if (typeOption == "COMMUNE") {
            setCommuneId(value);
            setRsCommune(false);
            // setRsCommune(false);
        }
        if (typeOption == "SCALE") {
            setScaleValue(value);
        }
        if (typeOption == "CMP") {
            setCmp_wwn(value);
        }
    }

    const funcSetIconRight = () => {
        navigation.setOptions({
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

    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <View style={[styles.action, styles.fieldSet]}>
                    <Text style={styles.legend}>Số điện thoại*</Text>
                    <TextInput
                        placeholder=""
                        onEndEditing={() => getAgencyByPhone()}
                        keyboardType='numeric'
                        maxLength={11}
                        value={phone1}
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        autoFocus = {true}
                        style={[styles.textInput, { paddingBottom: 3, paddingTop: 3 }]}
                        onChangeText={(val) => convertNumber(val, setPhone1)} />

                </View>
                <View style={[styles.action, styles.fieldSet]}>
                    <Text style={styles.legend}>Tên đại lý*</Text>
                    <TextInput
                        placeholder=""
                        editable={editable}
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        value={agency}
                        style={[styles.textInput, { paddingBottom: 3, paddingTop: 3 }]}
                        onChangeText={(val) => setAgency(val)} />

                </View>
                <View style={[styles.action, styles.fieldSet]}>
                    <Text style={styles.legend}>Người liên hệ*</Text>
                    <TextInput
                        placeholder=""
                        value={contact}
                        editable={editable}
                        onChangeText={(val) => setContact(val)}
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        style={[styles.textInput, { paddingBottom: 3, paddingTop: 3 }]} />

                </View>
                <View style={[styles.action, styles.fieldSet]}>
                    <Text style={styles.legend}>Địa chỉ*</Text>
                    <TextInput
                        placeholder=""
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        editable={editable}
                        value={address}
                        style={[styles.textInput, { paddingBottom: 3, paddingTop: 3 }]}
                        onChangeText={(val) => setAddress(val)} />

                </View>
                <View style={[styles.action, styles.fieldSet]}>
                    <Text style={styles.legend}>Doanh số TB*</Text>
                    <TextInput
                        placeholder=""
                        keyboardType='numeric'
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        editable={editable}
                        value={saleAvg}
                        style={[styles.textInput, { paddingBottom: 3, paddingTop: 3 }]}
                        onChangeText={(val) => convertNumber(val, setSaleAvg)}
                    />

                </View>

                <View style={{ padding: 10 }}>
                    <SHSelectBoxLabel
                        dataSource={lstCmp}
                        placeholder={"nhà phân phối"}
                        label={"Nhà phân phối*"}
                        defaultObj={dataSelect.cmp_name}
                        isReset={isReset}
                        setSelected={(key) => funcsetSelected(key, "CMP")}></SHSelectBoxLabel>
                    <View style={{ marginTop: 20 }}>
                        <SHSelectBoxLabel style={{ marginTop: 10 }}
                            dataSource={lstDataScale}
                            placeholder={"Quy mô"}
                            disabled={!editable}
                            label={"Quy mô*"}
                            defaultObj={dataSelect.scalename}
                            isReset={isReset}
                            setSelected={(key) => funcsetSelected(key, "SCALE")}></SHSelectBoxLabel>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <SHSelectBoxLabel style={{ marginTop: 10 }}
                            dataSource={lstProvince}
                            placeholder={"Tỉnh/Thành phố"}
                            disabled={!editable}
                            label={"Tỉnh/Thành phố*"}
                            defaultObj={dataSelect.provincename}
                            isReset={isReset}
                            setSelected={(key) => funcsetSelected(key, "PROVINCE")}></SHSelectBoxLabel>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <SHSelectBoxLabel
                            dataSource={lstDistrict}
                            placeholder={"Quận/Huyện"}
                            label={"Quận/Huyện*"}
                            disabled={!editable}
                            defaultObj={dataSelect.districtname}
                            isReset={rsDistrict}
                            setSelected={(key) => funcsetSelected(key, "DISTRICT")}></SHSelectBoxLabel>
                    </View>
                    <View style={{ marginTop: 20 }} >
                        <SHSelectBoxLabel
                            dataSource={lstCommune}
                            placeholder={"Xã/Phường"}
                            label={"Xã/Phường*"}
                            disabled={!editable}
                            defaultObj={dataSelect.communename}
                            isReset={rsCommune}
                            setSelected={(key) => funcsetSelected(key, "COMMUNE")}></SHSelectBoxLabel>
                    </View>
                </View>
                <View style={[styles.action, styles.fieldSet]}>
                    <Text style={[styles.legend]} onPress={() => openCameraWithPermission()}>
                        Ảnh đại lý* <Icon style={styles.searchIcon} name="md-camera-outline" onPress={() => openCameraWithPermission()} size={15} color="#000" /></Text>
                    <Text style={[styles.textInput, { paddingBottom: 4, paddingTop: 3 }]} />
                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: "row", padding: 5 }}>
                            {images.map((item) => { return (<Image resizeMode="contain" source={{ uri: item.uri }} style={{ padding: 60 }} />) })}
                        </View>
                        <View>
                            <Feather
                              name="x"
                              style={{ position: 'absolute', right: 10, top: -215 }}
                              size={15}
                              color="red"
                              onPress={() => { deleteImage(item.Id) }}
                            />
                          </View>
                    </ScrollView>
                </View>
            </View>
        </KeyboardAwareScrollView>

    );
}
export default AddNewAgency;
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
    }
});
