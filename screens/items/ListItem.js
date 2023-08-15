import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert, FlatList} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import IconExtra from "../../common/icons";
import { GetApis, PostApis } from "../../common/callapi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';

import * as SQLite from "expo-sqlite";
//mở db
const db = SQLite.openDatabase("db.MDS");

const ListItem = ({ navigation, ...props }) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]); //danh sách hàng hóa
  const [cacheData, setCacheData] = useState([]); //danh sách hàng hóa theo từ khóa tìm kiếm
  const [txtSearch, setTxtSearch] = useState(''); //text tìm kiếm
  const [loading, setLoading] = useState(false); //loading

  useEffect(() => {
        ActionSQLLite();
  }, [isFocused]);

  useEffect(() => {
        setLoading(false);
  }, [data]);

  const ActionSQLLite = () => {
    //kiểm tra đã có bảng này chưa, nếu chưa có thì mới tạo bảng
    db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM mItem",
          null,
          (txObj, { rows: { _array } }) => {setData(_array); setCacheData(_array)},
          (txObj, error) => createrTable()
        );
      });
  };

  //tạo bảng
  const createrTable = () => {
    db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS mItem (Id INTEGER PRIMARY KEY AUTOINCREMENT, ItemCode TEXT, ItemName TEXT, ItemClass TEXT, Industry TEXT, UserField_02 TEXT, SynDate TEXT, Count INT)"
        );
    });
  }

  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM mItem",
        null,
        (txObj, { rows: { _array } }) => {setData(_array); setCacheData(_array)},
        (txObj, error) => {
            //console.log("Error ", error)
        }
      );
    });
  };
  const addItem = (ItemCode, ItemName, ItemClass, Industry, UserField_02, SynDate, Count) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO mItem (ItemCode, ItemName, ItemClass, Industry, UserField_02, SynDate, Count) SELECT ?, ?, ?, ?, ?, ?, ? WHERE NOT EXISTS(SELECT 1 FROM mItem WHERE ItemCode = ?)",
        [ItemCode,ItemName, ItemClass, Industry, UserField_02, SynDate, Count, ItemCode],
        (txObj, resultSet) => {
            
        }
         ,
        (txObj, error) => {
            //console.log("Error", error)
        }
      );
    });
  };
  const deleteItem = (Id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM mItem WHERE Id = ? ",
        [Id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = data.filter((data) => {
              if (data.Id === Id) return false;
              else return true;
            });
            setData(newList);
            setCacheData(newList);
          }
        }
      );
    });
  };
  const clearData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM mItem WHERE Id IS NOT NULL ",
        null,
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            setData([]);
            setCacheData([]);
          }
        }
      );
    });
  };

  //thông báo có muốn đồng bộ không
  const alertConfirmSyn = () => {
    Alert.alert( 'Xác nhận', 'Bạn có chắc đồng bộ dữ liệu hàng hóa không?', 
        [{ text: 'Đồng ý', style: { color: 'blue' }, onPress: () => {Syn_mItem()}, },
        { text: 'Không', onPress: () => { return null; }}],
        { cancelable: false },
    );
  }

  //thông báo có muốn xóa dữ liệu
  const alertConfirmClear = () => {
    Alert.alert( 'Xác nhận', 'Bạn có chắc xóa danh sách hàng hóa không?', 
        [{ text: 'Đồng ý', style: { color: 'blue' }, onPress: () => {clearData()}, },
        { text: 'Không', onPress: () => { return null; }}],
        { cancelable: false },
    );
  }

  //thông báo có muốn xóa item không
  const alertConfirmDelete = (Id) => {
    Alert.alert( 'Xác nhận', 'Bạn có chắc xóa hàng hóa này không?', 
        [{ text: 'Đồng ý', style: { color: 'blue' }, onPress: () => {deleteItem(Id)}, },
        { text: 'Không', onPress: () => { return null; }}],
        { cancelable: false },
    );
  }

  //đồng bộ hàng hóa vào bảng mItem trên máy
  const Syn_mItem = async () => {
    try {
        let userStorage = await AsyncStorage.getItem("userInfo");
        const resJson = JSON.parse(userStorage);
        setLoading(true);
        var result = await GetApis("DashboardApp", "GetListItem", {});
        
        if (!result.IsOK) {
          Alert.alert("Thông báo", result.Messenger, [{ text: "Đóng" }]);
          return;
        }
        const dateNow = new Date().toLocaleDateString();
        result.Data.forEach(element => {
            addItem(element.ItemCode, element.ItemName, element.ItemClass, element.Industry, element.UserField_02, dateNow, 1);
        });
        fetchData();
        //Alert.alert('Thông báo', 'Đồng bộ thành công.' );
      } catch (err) {
        Alert.alert('Lỗi', 'Đồng bộ không thành công.' )
      }
    }

    const renderItem = ({ item }) => (
        <View key={item.Id}>
              <View>
                {/* Nội dung */}
                <View flexDirection="row" style={{ padding: 5 }}>
                  {/* ảnh */}
                  <View
                    flex={2}
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#bfc0c1",
                        borderRadius: 40,
                        justifyContent: 'center',
                        alignItems:'center'
                      }}
                    >
                    <IconExtra
                            family="MaterialCommunityIcons"
                            name="message-image-outline"
                            color="white"
                            size={25}
                        />
                    </View>
                  </View>
                  {/* thông tin */}
                  <View flex={8}>
                    <Text style={{ color: "#7F7F7F", fontWeight: "bold" }}>
                      {item.ItemCode}
                    </Text>
                    <Text style={{ color: "#7F7F7F" }}>
                      {item.ItemName}
                    </Text>
                  </View>
                  {/* thao tác */}
                  <View flex={1} style={{justifyContent:'center', alignItems:'center'}}>
                    <TouchableOpacity onPress={() => alertConfirmDelete(item.Id)}>
                      <IconExtra
                        family="MaterialCommunityIcons"
                        name="delete-forever"
                        color="red"
                        size={25}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* line */}
                <View
                  style={{ borderTopWidth: 1, borderTopColor: "#c0c7ce" }}
                ></View>
              </View>
            </View>
      );

  return (
    <View>
        <Spinner visible={loading} textContent={'Loading...'} textStyle={{ color: 'white' }} />
        <View space={"1"} justify-content="flex-start" style={{padding: 10}}>
                <View width="80%" style={{}}>
                    <View style={[styles.action, styles.fieldSet]}>
                        <TextInput
                            placeholder="Nhập từ khóa tìm kiếm..."
                            value={txtSearch}
                            placeholderTextColor="#9A9696"
                            autoCapitalize="none"
                            style={[styles.textInput]}
                            onChangeText={(value) => {
                                var lstData = cacheData.filter((e) =>
                                                e.ItemCode.toLowerCase().indexOf(value.toLowerCase()) != -1 || 
                                                e.ItemName.toLowerCase().indexOf(value.toLowerCase()) != -1 
                                                //e.ItemClass.toLowerCase().indexOf(value.toLowerCase()) != -1 ||
                                                //e.Industry.toLowerCase().indexOf(value.toLowerCase()) != -1
                                                );
                                setData(lstData);
                                setTxtSearch(value);
                            }}
                            onClear={(e) => {
                                setData(cacheData);
                            }}
                        />
                    </View>
                </View>
                {/* <VStack width="9%" style={{backgroundColor: '#4AB2A8', justifyContent: 'center', alignItems:'center', borderRadius: 5}}>
                    <TouchableOpacity onPress={() => {newItem('MÃ HÀNG 1', 'TÊN HÀNG 1', 'NHÓM HÀNG 1', 'NGÀNH HÀNG1', 1)}}>
                        <IconExtra
                            family="FontAwesome5"
                            name="plus"
                            color="white"
                            size={25}
                        />
                    </TouchableOpacity>
                </VStack> */}
                <View width="9%" style={{backgroundColor: '#4AB2A8', justifyContent: 'center', alignItems:'center', borderRadius: 5}}>
                    <TouchableOpacity onPress={() => alertConfirmSyn()}>
                        <IconExtra
                            family="FontAwesome"
                            name="refresh"
                            color="white"
                            size={25}
                        />
                    </TouchableOpacity>
                </View>
                <View width="9%" style={{backgroundColor: 'red', justifyContent: 'center', alignItems:'center', borderRadius: 5}}>
                    <TouchableOpacity onPress={() => alertConfirmClear()}>
                        <IconExtra
                            family="MaterialCommunityIcons"
                            name="delete-forever"
                            color="white"
                            size={25}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.Id}
      />
      
    </View>
  );
};
const styles = StyleSheet.create({
    action: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 10
    },
    fieldSet: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: "center",
        borderBottomColor: "#d4d4d4",
        borderColor: "#d4d4d4",
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 7,
        fontSize: 15,
        color: '#05375a',
    },
    legend: {
        position: 'absolute',
        top: -10,
        left: 10,
        fontSize: 11,
        color: '#7F7F7F',
        fontWeight: 'bold',
        backgroundColor: '#FFFFFF'
    },
});
export default ListItem;