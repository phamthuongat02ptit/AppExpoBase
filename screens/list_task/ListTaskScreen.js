/** 
 * Created By: THUONGPV
 * Description: Màn hình danh sách công việc
 * */
import { View, Text, StyleSheet } from 'react-native';
import { BGCOLORS } from '../../common/colors';

const ListTaskScreen = () => {
    return(
        <View style={styles.container}>
            <Text>Màn hình danh sách công việc</Text>
        </View>
    )
}
export default ListTaskScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BGCOLORS.BG1,
    },
});