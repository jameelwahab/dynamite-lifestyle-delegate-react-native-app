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