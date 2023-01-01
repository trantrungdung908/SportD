import Toast from 'react-native-toast-message';
import {Platform} from 'react-native';

export class ToastServiceClass {
  show = (message = '') => {
    if (typeof message !== 'string') {
      return;
    }
    return Toast.show({
      type: 'success',
      text1: message,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: Platform.OS === 'ios' ? 50 : 20,
      position: 'top',
    });
  };

  showError = (message = '') => {
    if (typeof message !== 'string') {
      return;
    }
    return Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 2000,
      autoHide: true,
      topOffset: Platform.OS === 'ios' ? 50 : 20,
    });
  };
}
const ToastService = new ToastServiceClass();
export default ToastService;
