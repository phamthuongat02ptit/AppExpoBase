/** 
 * Created By: THUONGPV
 * Description: Màn hình trang chủ
 * */
import { View, Text, StyleSheet } from 'react-native';
import { BGCOLORS } from '../../common/colors';

const HomeScreen = () => {
    return(
        <View style={styles.container}>
            <Text>Màn hình trang chủ</Text>
        </View>
    )
}
export default HomeScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BGCOLORS.BG1,
    },
});