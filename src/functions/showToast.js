import Toast from 'react-native-toast-message';



const showToast = ({ body, title = 'Alert', type = 'error' }) => {

  Toast.hide();
  setTimeout(() => {
    Toast.show({
      type: type,
      text1: title,
      text2: body,
      autoHide: true,
      visibilityTime: 3000,
      topOffset: 50
    });
  }, 150);
};

export default showToast;
