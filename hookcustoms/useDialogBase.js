import { useState } from 'react';
import { Text } from 'react-native';
import { Portal, Dialog, Button } from 'react-native-paper';

/**
 *Created By: THUONGPV
 *Description: hook được thiết kế để thông báo dạng dialog
 *DialogParams:
 *              - title: Tiêu đề thông báo
 *              - content: Nội dung thông báo
 *              - bgcolor: Màu nền thông báo (Thể hiện cho trạng thái)
 *              - isconfirm: Có hiển thị nút xác nhận hay không
 *              - onConfirm: Hàm truyền vào khi ấn sự kiện xác nhận
 * @return {*} 
 */
const useDialogBase = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogParams, setDialogParams] = useState({});

  const showDialog = (params) => {
    setDialogParams(params);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleConfirm = () => {
    const { onConfirm } = dialogParams;
    if (onConfirm && typeof onConfirm === 'function') {
        onConfirm();
      }
    hideDialog();
  };

  const DialogBase = () => {
    const { title, content, bgcolor, isconfirm } = dialogParams;

    return (
      <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog} style={{backgroundColor: bgcolor??'#efe8f6'}}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{content}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Đóng</Button>
              {isconfirm ? <Button onPress={handleConfirm}>Xác nhận</Button> : null}
            </Dialog.Actions>
          </Dialog>
        </Portal>
    );
  };

  return {
    showDialog,
    hideDialog,
    DialogBase,
  };
};

export default useDialogBase;