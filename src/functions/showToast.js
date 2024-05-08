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
      topOffset: 50,


    });
  }, 150);
};

const showToastCustom = ({ body, title = '', bgColor }) => {
  Toast.hide()
  setTimeout(() => {
    Toast.show({
      text1: title,
      text2: body,
      type: "custom",
      autoHide: true,
      visibilityTime: 3000,
      topOffset: 50,
      props: { bgColor }
    });
  }, 150);
};

export { showToastCustom }
export default showToast;
