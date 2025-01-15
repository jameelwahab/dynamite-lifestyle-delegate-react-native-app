
import { Platform } from 'react-native';
import { icons } from '../utilities/icons';

const getFileIconByType = (uri, name = undefined) => {
  let ext = uri.split(".").pop();
  if (Platform.OS == "android" && !!name) {
    ext = name.split(".").pop();
  }

  if (ext == "xls" || ext == "xlsx") {
    return icons.file_xls
  } else if (ext == "doc" || ext == "docx") {
    return icons.file_doc
  } else if (ext == "pdf") {
    return icons.file_pdf
  } else if (ext == "csv") {
    return icons.file_csv
  } else if (ext == "mp3") {
    return icons.file_mp3
  } else {
    return null
  }

}

export default getFileIconByType