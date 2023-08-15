import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { StyleSheet, TextInput, View, Text } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  Actionbtn: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  btn: {
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: "stretch",
    color: "#fff",
    marginTop: 8,
    marginBottom: 8,
    minWidth: "45%",
    paddingHorizontal: 16,
  },

  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 10,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : 0,
    fontSize: 13,
    backgroundColor: "red.500",
    color: "#05375a",
    borderColor: "#fff",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  fieldSet: {
    // margin: 10,
    // paddingHorizontal: 10,
    // paddingBottom: 7,
    // paddingTop: 7,
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

export default function SHTextAreaLabel({
  placeholder,
  onChangeText,
  label,
  height,
  value,
  defaulValue,
  ...props
}) {
  const [localValue, setValue] = React.useState(value);
  useEffect(() => {
    setValue(value);
  }, [value]);
  return (
    <View style={[styles.action, styles.fieldSet]}>
      <Text style={styles.legend}>{label}</Text>
      <TextInput
        width={"100%"}
        style={{textAlignVertical:"top",paddingHorizontal:5,paddingTop:2,height:40}}
        multiline={true}
        numberOfLines={2}
        placeholder={placeholder}
        // placeholderTextColor="#666666"
        value={localValue}
        h={height}
        borderColor={"#fff"}
        borderWidth={0}
        // marginX={0}
        // style={{ borderWidth:0 }}
        onChangeText={(text) => {
          onChangeText(text);
          setValue(text);
        }} // for android and ios
      />
    </View>
  );
}
