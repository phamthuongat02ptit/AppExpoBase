import React, { useState } from "react";
import { StyleSheet, View, Pressable, TextInput, Text, TouchableOpacity } from "react-native";
import { TextInput as TextInputPar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
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
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        onConfirm(currentDate);
      };
      const showDatepicker = () => {
        setShow(true);
      };
      return (
        <View>
            <TouchableOpacity onPress={showDatepicker} style={{height:50, width:'90%'}}><TextInputPar
                mode="outlined"
                style={styles.inputContainerStyle}
                dense
                disabled
                label={label}
                placeholder="chọn ngày"
                value={moment(date).format('DD-MM-YYYY')}
                onChangeText={(outlinedDenseText) =>{ } }
            /></TouchableOpacity>
            
            {show && (
                <DateTimePicker
                    value={date}
                    mode='date'
                    display="default"  
                    // default-calendar
                    onChange={onChange}
                    />
            )}
        </View>
      );
}
