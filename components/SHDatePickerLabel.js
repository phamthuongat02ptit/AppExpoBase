import React, { useState } from "react";
import { StyleSheet, View, Pressable, TextInput, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const styles = StyleSheet.create({
  action: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 10,
  },
  fieldSet: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    borderBottomColor: "#d4d4d4",
    borderColor: "#d4d4d4",
  },
  legend: {
    position: "absolute",
    top: -12,
    left: 10,
    fontSize: 11,
    color: "#7F7F7F",
    fontWeight: "bold",
    backgroundColor: "#fafaf9",
  },
});

export default function SHDatePicker({
  formatDate = "DD-MM-yyyy",
  minimumDate,
  maximumDate,
  label,
  value,
  onConfirm,
  ...props
}) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
        onConfirm(date);
        hideDatePicker();
    };
  return (
    <View style={[styles.action, styles.fieldSet]}>
      <Text style={styles.legend}>{label}</Text>
      <DateTimePickerModal
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        confirmTextIOS="Xác nhận"
        isHeaderVisibleIOS={true}
        cancelTextIOS="Hủy"
        headerTextIOS="Chọn tháng xem"
        isVisible={isDatePickerVisible}
        date={new Date(value ? value : moment())}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Pressable
        width="100%"
        onPress={() => {
            showDatePicker();
        }}
      >
        <View style={{ width: "100%" }} pointerEvents="none">
          <TextInput
            style={{width:'100%', height:20}}
            value={moment(value).format(formatDate)}
            padding={0}
          />
        </View>
      </Pressable>
    </View>
  );
}
