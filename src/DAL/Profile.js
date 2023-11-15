import invokeApi from "../functions/invokeAPI"

export const EDIT_PROFILE = ({ token, params, body, navigation }) => {
  return invokeApi({
    path: "api/consultant/profile/" + params,
    method: "PUT",
    postData: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    token,
    navigation,
  })
}
