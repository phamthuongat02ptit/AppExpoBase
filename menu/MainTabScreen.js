/** 
 * Created By: THUONGPV
 * Description: Hàm tạo ra các tab bottom
 * */
import React from 'react';
import { View } from 'react-native';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BGCOLORS } from '../common/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { HomeStack, ListTaskStack, SearchStack, InfoStack } from './MainStack';
const Tab = createBottomTabNavigator();
// const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
    return (
        <Tab.Navigator
            shifting={true}
            screenOptions={{ headerShown: false, sceneContainerStyle: {
          backgroundColor: 'red',
          padding: 20,
          borderRadius: 10,
        }, }}
            
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Trang chủ',
                    tabBarColor: '#009387',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="home" size={30} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="ListTaskTab"
                component={ListTaskStack}
                options={{
                    tabBarLabel: 'Task',
                    tabBarColor: 'blue',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="tasks" size={30} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="SearchTab"
                component={SearchStack}
                options={{
                    tabBarLabel: 'Tìm kiếm',
                    tabBarColor: 'green',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="search" size={30} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="InfoTab"
                component={InfoStack}
                options={{
                    tabBarLabel: 'Thông tin',
                    tabBarColor: 'yellow',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="user" size={30} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
export default MainTabScreen;

