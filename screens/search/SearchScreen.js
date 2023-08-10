/** 
 * Created By: THUONGPV
 * Description: Màn hình tìm kiếm
 * */
import { View, Text, StyleSheet } from 'react-native';
import { BGCOLORS } from '../../common/colors';

const SearchScreen = () => {
    return(
        <View style={styles.container}>
            <Text>Màn hình tìm kiếm</Text>
        </View>
    )
}
export default SearchScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BGCOLORS.BG1,
    },
});