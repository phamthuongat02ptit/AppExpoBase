/** 
 * Created By: THUONGPV
 * Description: Hàm vẽ các nội dung trong thanh Drawer
 * */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, Avatar, Title, Caption, Drawer, Text, TouchableRipple, Switch} from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../common/context';

export function DrawerContent(props) {
    const paperTheme = useTheme();
    const [userInfo, setUserInfo] = useState({});
    const { signOut, toggleTheme } = React.useContext(AuthContext);

    useEffect(() => {
        getInfoUser();
    }, []);

    const getInfoUser = async () => {
        let userInfo = await AsyncStorage.getItem('userInfo');
        setUserInfo(JSON.parse(userInfo));
    }
    
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image
                                source={{
                                    uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                                }}
                                size={50}
                            />
                            <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                <Title style={styles.title}>{userInfo.FullName}</Title>
                                <Caption style={styles.caption}>{userInfo.Email}</Caption>
                            </View>
                        </View>

                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="ios-home" color={color} size={size} />
                            )}
                            label="Trang chủ"
                            onPress={() => { props.navigation.navigate('HomeTab') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="ios-home" color={color} size={size} />
                            )}
                            label="Công việc"
                            onPress={() => { props.navigation.navigate('ListTaskTab') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="ios-home" color={color} size={size} />
                            )}
                            label="Lịch sử checkin"
                            onPress={() => { props.navigation.navigate('HistoryCheckIn') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Feather name="user" color={color}
                                    size={size} />

                            )}
                            label="Tài khoản"
                            //onPress={() => { props.navigation.navigate('WorkingDetailScreen') }}
                        />
                    </Drawer.Section>
                    {/* <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => { toggleTheme() }}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <MaterialIcons name="logout" color={color} size={size} />

                    )}
                    label="Đăng xuất"
                    onPress={() => { signOut() }}
                />
            </Drawer.Section>
        </View>
    );
}


const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    // preference: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     paddingVertical: 12,
    //     paddingHorizontal: 16,
    // },
});
