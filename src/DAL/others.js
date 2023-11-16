import invokeApi from "../functions/invokeAPI"

export const CHANGE_ZOOM_CRED = ({ body, token, navigation }) => {
  return invokeApi({
    path: "api/consultant/zoom_credentials/update",
    method: "POST",
    token: token,
    navigation: navigation,
    postData: body
  })
}

export const UPLOAD_FILE_TO_S3 = ({ body, token, navigation }) => {
  return invokeApi({
    path: "app/update_image_on_s3",
    headers: { "content-type": "multipart/form-data" },
    method: "POST",
    token: token,
    navigation: navigation,
    postData: body,
    noAlerts: true
  })
}


export const UPDATE_REMINDER_MESSAGES = ({ body, token, navigation }) => {
  return invokeApi({
    path: "api/consultant/welcome_reminder_setting_for_delegate",
    method: "POST",
    token: token,
    navigation: navigation,
    postData: body
  })
}