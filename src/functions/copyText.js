import Clipboard from '@react-native-clipboard/clipboard';
import showToast from './showToast';

const copyText = (text, alertText = "Copied") => {
  Clipboard.setString(text)
  showToast({ title: alertText, type: "success" })

}

export default copyText