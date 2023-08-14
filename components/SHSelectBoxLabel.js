import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View, Text } from "react-native";
import ModalSelector from "react-native-modal-selector-searchable";
import { TextInput } from "react-native-gesture-handler";
const styles = StyleSheet.create({
  action: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  textInput: {
    flex: 1,
    marginTop: 0,
    paddingLeft: 7,
    fontSize: 15,
    color: "#05375a",
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
  selectList: {
    borderEndColor: 0,
    borderBottomColor: 0,
    borderTopColor: 0,
    borderStartColor: 0,
    paddingBottom: Platform.OS == "ios" ? 0 : 0,
    paddingTop: Platform.OS == "ios" ? 0 : 0,
    paddingLeft: 0,
    color: "black",
  },
});
export default React.memo(function SHSelectBoxLabel({
  label,
  defaultObj,
  setSelected,
  dataSource,
  placeholder,
  styleFieldSet = {},
  searchPlaceholder,
  disabled = false,
  isReset = false,
  ...props
}) {
  const [value, setValue] = useState(defaultObj);
  const [disa, setDisa] = useState(disabled);
  useEffect(() => { }, [value]);
  useEffect(() => {
    if (isReset) setValue("");
  }, [isReset]);

  useEffect(() => {
    setValue(defaultObj);
  }, [defaultObj]);

  useEffect(() => {
    setDisa(disabled);
  }, [disabled]);
  return (
      <View
        style={[
          styles.action,
          styles.fieldSet,
          { ...styleFieldSet },
        ]}
      >
        <Text style={styles.legend}>{label}</Text>
        <View style={styles.textInput}>
          <ModalSelector
            disabled={disabled}
            data={dataSource}
            initValue={`Chọn` + label}
            optionContainerStyle={{ maxHeight: "50%" }}
            accessible={true}
            optionTextStyle={{ textAlign: 'left', color: 'black' }}
            scrollViewAccessibilityLabel={"Scrollable options"}
            cancelButtonAccessibilityLabel={"Hủy"}
            onCancel={() => {
              setValue("");
              setSelected("");
            }}
            listType={"FLATLIST"}
            onChange ={(option) => {
              setValue(option.label);
              setSelected(option.key);
            }}
          >
            <TextInput
              style={[styles.selectList]}
              editable={true}
              value={value && value}
            />
          </ModalSelector>
        </View>
      </View>
  );
});
