/** 
 * Created By: THUONGPV
 * Description: Hàm khai báo các màn hình
 * */
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { BGCOLORS } from '../common/colors';
import HomeScreen from '../screens/home/HomeScreen';
import AddNewAgency from '../screens/agency/AddNewAgency';
import CategoryAgency from '../screens/agency/CategoryAgency';
import DMSCheckIn from '../screens/checkin/DMSCheckIn';
import HistoryCheckIn from '../screens/checkin/HistoryCheckIn';
import ListTaskScreen from '../screens/list_task/ListTaskScreen';
import SearchScreen from '../screens/search/SearchScreen';
import InfoScreen from '../screens/info/InfoScreen';
const Stack = createStackNavigator();

const HomeStack = ({navigation}) => {
    return (
        <Stack.Navigator 
            screenOptions={{
                headerStyle: { backgroundColor: BGCOLORS.BG2 },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' }
            }}
        >
            <Stack.Screen 
                name="HomeScreen" 
                component={HomeScreen} 
                options={{
                    title:'Trang chủ',
                    headerLeft: () => (
                        <Icon.Button name="ios-menu" size={25} backgroundColor={BGCOLORS.BG2} onPress={() => {navigation.openDrawer()}}></Icon.Button>
                    )
                }}
            />
            <Stack.Screen 
                name="AddNewAgency" 
                component={AddNewAgency} 
                options={{
                    title:'Tạo đại lý',
                    headerLeft: () => (
                        <Icon.Button name="chevron-back" size={25} backgroundColor={BGCOLORS.BG2} onPress={() => {navigation.navigate(HomeScreen)}}></Icon.Button>
                    )
                }}
            />
            <Stack.Screen 
                name="CategoryAgency" 
                component={CategoryAgency} 
                options={{
                    title:'Danh sách đại lý',
                    headerLeft: () => (
                        <Icon.Button name="chevron-back" size={25} backgroundColor={BGCOLORS.BG2} onPress={() => {navigation.navigate(HomeScreen)}}></Icon.Button>
                    )
                }}
            />
            <Stack.Screen 
                name="DMSCheckIn" 
                component={DMSCheckIn} 
                options={{
                    title:'Checkin',
                    headerLeft: () => (
                        <Icon.Button name="chevron-back" size={25} backgroundColor={BGCOLORS.BG2} onPress={() => {navigation.navigate(HomeScreen)}}></Icon.Button>
                    )
                }}
            />
            <Stack.Screen 
                name="HistoryCheckIn" 
                component={HistoryCheckIn} 
                options={{
                    title:'Lịch sử checkin',
                    headerLeft: () => (
                        <Icon.Button name="chevron-back" size={25} backgroundColor={BGCOLORS.BG2} onPress={() => {navigation.navigate(HomeScreen)}}></Icon.Button>
                    )
                }}
            />
        </Stack.Navigator>
    );
};

const ListTaskStack = ({navigation}) => {
    return (
        <Stack.Navigator 
            screenOptions={{
                headerStyle: { backgroundColor: BGCOLORS.BG2 },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' }
            }}
        >
            <Stack.Screen 
                name="ListTaskScreen" 
                component={ListTaskScreen} 
                options={{
                    title:'Công việc',
                    headerLeft: () => (
                        <Icon.Button name="ios-menu" size={25} backgroundColor={BGCOLORS.BG2} onPress={() => {navigation.openDrawer()}}></Icon.Button>
                    )
                }}
            />
        </Stack.Navigator>
    );
};

const SearchStack = ({navigation}) => {
    return (
        <Stack.Navigator 
            screenOptions={{
                headerStyle: { backgroundColor: BGCOLORS.BG2 },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' }
            }}
        >
            <Stack.Screen 
                name="SearchScreen" 
                component={SearchScreen} 
                options={{
                    title:'Tìm kiếm',
                    headerLeft: () => (
                        <Icon.Button name="ios-menu" size={25} backgroundColor={BGCOLORS.BG2} onPress={() => {navigation.openDrawer()}}></Icon.Button>
                    )
                }}
            />
        </Stack.Navigator>
    );
};

const InfoStack = ({navigation}) => {
    return (
        <Stack.Navigator 
            screenOptions={{
                headerStyle: { backgroundColor: BGCOLORS.BG2 },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' }
            }}
        >
            <Stack.Screen 
                name="InfoScreen" 
                component={InfoScreen} 
                options={{
                    title:'Thông tin',
                    headerLeft: () => (
                        <Icon.Button name="ios-menu" size={25} backgroundColor={BGCOLORS.BG2} onPress={() => {navigation.openDrawer()}}></Icon.Button>
                    )
                }}
            />
        </Stack.Navigator>
    );
};

export { HomeStack, ListTaskStack, SearchStack, InfoStack };