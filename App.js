/** 
 * Created By: THUONGPV
 * Description: File được chạy đầu tiên khi app được khỏi động
*/
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import axios from 'axios';
import { DrawerContent } from './menu/DrawerContent';
import config from './config/appsetting';
import { AuthContext } from './common/context';
import MainTabScreen from './menu/MainTabScreen';
import RootStackScreen from './screens/login/RootStackScreen';
const Drawer = createDrawerNavigator();

export default function App() {
    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
    };

    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        ...PaperDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperDefaultTheme.colors,
            background: '#ffffff',
            text: '#333333'
        }
    }

    const theme = CustomDefaultTheme;

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };    
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false,
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
        }
    };
    
    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => ({
        signIn: async (foundUser, data) => {
            const userToken = String(foundUser[0].userToken);
            const userName = foundUser[0].username;
        
            try {
                await AsyncStorage.setItem('userToken', userToken);
                await AsyncStorage.setItem('userInfo', data);
            } catch (e) { }
            dispatch({ type: 'LOGIN', id: userName, token: userToken });
        },
        signOut: async () => {
            try {
                await ClearTokenLoginsExpo();
            } catch (e) { }
            dispatch({ type: 'LOGOUT' });
        },
        signUp: () => { },
        toggleTheme: () => {
          //setIsDarkTheme(isDarkTheme => !isDarkTheme);
        }
    }), []);

    //clear token của app
    const ClearTokenLoginsExpo = async () => {
        try {
            let userStorage = await AsyncStorage.getItem('userInfo');
            let user = JSON.parse(userStorage);
            let loginProvider = await AsyncStorage.getItem('loginProvider');
            let Token = await AsyncStorage.getItem('AccessToken_APP');

            await axios.post(
                `${config.APIHOST}/api/Account/saveAppUserLoginsExpo?applicationId=${config.appid}&loginProvider=${loginProvider}&userId=${""}&accessToken=${Token}`,
                {}, { headers: { Authorization: "Basic dHJpZXVwdjpwaGFtdHJpZXU=" } }
            ).then((newres) => {
                if (newres) {
                    //AsyncStorage.clear();
                    AsyncStorage.removeItem('userToken');
                    AsyncStorage.removeItem('userInfo');
                } else { }
            });
        }
        catch (error) {
        //console.log(error);
        }
    }

    useEffect(() => {
        setTimeout(async () => {
            let userToken;
            userToken = null;
            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch (e) {
                // console.log(e);
            }
            dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
        }, 1000);
    }, []);

    if (loginState.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <AuthContext.Provider value={authContext}>
                <NavigationContainer theme={theme}>
                {loginState.userToken !== null ? (
                    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} screenOptions={{ headerShown: false }} initialRouteName="MainTab">
                        <Drawer.Screen name="MainTab" component={MainTabScreen}/>
                    </Drawer.Navigator>
                )
                    :
                    <RootStackScreen />
                }
                </NavigationContainer>
            </AuthContext.Provider>
        </PaperProvider>
    );
}
