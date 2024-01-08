import invokeApi from "../functions/invokeAPI"

export const DASHBAORD = ({ body = {}, token, navigation }) => {
  return invokeApi({
    path: "api/consultant/delegate_dashboard",
    method: "POST",
    token: token,
    navigation: navigation,
    postData: body
  })
}
