/** 
 * Created By: THUONGPV
 * Description: Màn hình thông tin tài khoản
 * */
import { View, Text, StyleSheet } from 'react-native';
import { BGCOLORS } from '../../common/colors';

const InfoScreen = () => {
    return(
        <View style={styles.container}>
            <Text>Màn hình thông tin</Text>
        </View>
    )
}
export default InfoScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BGCOLORS.BG1,
    },
});