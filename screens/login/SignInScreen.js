/** 
 * Created By: THUONGPV
 * Description: Màn hình đăng nhập
 * */
import React, { useState } from 'react';
import {View, Text, Platform, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import { useTheme, TextInput as TextInputPaper, PaperProvider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MainColors, BoxColors } from '../../common/colors';
import { GetApiBases } from '../../common/callapi';
import config from '../../config/appsetting';
import useDialogBase from '../../hookcustoms/useDialogBase';
import { AuthContext } from '../../common/context';

const SignInScreen = ({ navigation }) => {
    const { theme, colors } = useTheme();
    const { showDialog, hideDialog, DialogBase } = useDialogBase();
    const { signIn } = React.useContext(AuthContext);
    const [isDisplayPass, setIsDisplayPass] = useState(false);

    const [data, setData] = useState({
        username: '',
        password: '',
        isValidUser: false,
        isValidPassword: false,
    });

    //sự kiện nhập user
    const onChangeUser = (val) => {
        if (val.length >= 4) {
            setData({ ...data, username: val, isValidUser: true });
        } else {
            setData({ ...data, username: val, isValidUser: false });
        }
    }

    //sự kiện nhập password
    const onChangePassword = (val) => {
        if (val.length >= 4 && val.indexOf(' ') == -1) {
            setData({ ...data, password: val, isValidPassword: true });
        } else {
            setData({ ...data, password: val, isValidPassword: false });
        }
    }

    //Phần hiển thị cảnh báo
    const [showWarning, setShowWarning] = useState({hiden: false, mess:''});
    const showView = (mes) => {
        setShowWarning({hiden:true, mess: mes});
        setTimeout(() => { setShowWarning({hiden:false, mess: ''}) }, 3000);
    }

    //Hàm xử lý đăng nhập
    const loginHandle = async () => {
        try {
            if (!data.isValidUser) {
                showView('Tài khoản không hợp lệ');
                return;
            }
            else if (!data.isValidPassword) {
                showView('Mật khẩu không hợp lệ');
                return;
            }
            
            // Caii API
            GetApiBases('Account', 'Login',
                {
                    appid: config.appid,
                    username: data.username,
                    password: data.password,
                    deviceinfo: "",
                },
                10000).then((res) => {
                    if(res){
                        if(res.AccessToken != undefined){
                            signIn([{
                                id: 1,
                                email: res.Email,
                                FullName : res.FullName,
                                username: res.UserName,
                                userToken: res.AccessToken
                            }],JSON.stringify(res));
                            return;
                        }
                        else{
                            showDialog({ 
                                title: 'Thông báo', 
                                content: res.messenger, 
                                bgcolor: BoxColors.BOXDANGER
                                });
                            return;
                        }
                    }
                    else{
                        showDialog({ 
                            title: 'Thông báo', 
                            content: 'Không kết nối được với hệ thống, Vui lòng kiểm tra lại đường truyền.', 
                            bgcolor: BoxColors.BOXDANGER
                            });
                        return;
                    }
                });
        }
        catch (error) {
            showDialog({ 
                title: 'Thông báo', 
                content: 'Không kết nối được với hệ thống, Vui lòng kiểm tra lại đường truyền.', 
                bgcolor: BoxColors.BOXDANGER
                });
            return;
        }
    }

    return (
        <PaperProvider>
        <View style={styles.container}><ImageBackground style={{flex:1}} source={require('../../assets/images/background/bglogin.jpg')}>
            <View flex={9}></View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >
                <View style={{paddingVertical: 7}}>
                    {showWarning.hiden ? (
                            <Animatable.View animation="fadeIn" duration={500}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={{flex:10, alignItems:'flex-end', justifyContent:'center'}}>
                                        <Text style={{color: MainColors.RED}}>{showWarning.mess}</Text>
                                    </View>
                                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                                        <FontAwesome name="exclamation-circle" size={15} color={MainColors.RED} />
                                    </View>
                                </View>
                            </Animatable.View>
                    ) : <Text></Text>
                    }
                </View>
                <TextInputPaper
                    placeholder="Nhập tài khoản..."
                    mode="outlined"
                    dense
                    style={styles.boxShadow}
                    placeholderTextColor={MainColors.GREEN}
                    textColor={MainColors.GREEN}
                    theme={{ roundness: 10 }}
                    left={ <TextInputPaper.Icon icon={() => (<FontAwesome name="user" size={20} color={MainColors.GREEN} style={!data.isValidUser ? {opacity: 0.7} : {opacity: 1.0}} />)} /> }
                    value={data.username}
                    onChangeText={(value) => onChangeUser(value) }
                    outlineColor='white'
                    activeOutlineColor={MainColors.GREEN}
                />
                <TextInputPaper
                    placeholder="Nhập mật khẩu..."
                    mode="outlined"
                    dense
                    style={[{marginTop:10}, styles.boxShadow]}
                    placeholderTextColor={MainColors.GREEN}
                    textColor={MainColors.GREEN}
                    theme={{ roundness: 10 }}
                    left={ <TextInputPaper.Icon icon={() => ( <FontAwesome name="lock" size={20} color={MainColors.GREEN} style={!data.isValidPassword ? {opacity: 0.7} : {opacity: 1.0}}/> )} /> }
                    right={
                            <TextInputPaper.Icon 
                                icon={() => ( <FontAwesome name={isDisplayPass ? 'eye' : 'eye-slash'} size={18} color={MainColors.GREEN} /> )} 
                                onPress={() => setIsDisplayPass(!isDisplayPass) }
                                forceTextInputFocus={false}
                            />
                        }
                    value={data.password}
                    onChangeText={(value) => onChangePassword(value) }
                    secureTextEntry={!isDisplayPass}
                    outlineColor='white'
                    activeOutlineColor={MainColors.GREEN}
                />
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} >
                        <Text style={{ color: 'blue', marginTop: 15 }}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} >
                        <Text style={{ color: 'blue', marginTop: 15 }}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.signIn} onPress={() => loginHandle()} >
                        <LinearGradient colors={[MainColors.GREEN, '#01ab9d']} style={styles.signIn} >
                            <Text style={[styles.textSign, { color: '#fff',  }]}>Đăng nhập</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
            <DialogBase />
            </ImageBackground>
        </View>
        </PaperProvider>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#009387' },
    footer: { flex: 10, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 30, paddingVertical: 0 },
    button: { alignItems: 'center', marginTop: 50 },
    signIn: { width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10},
    textSign: { fontSize: 18, fontWeight: 'bold' },
    boxShadow: { 
        padding: 3, fontWeight:'600', borderRadius:1,
        shadowOffset: { width: 0, height: 0, }, shadowColor: MainColors.GREEN, shadowOpacity: 0.99, shadowRadius: 5.0, elevation: 15
      }
});