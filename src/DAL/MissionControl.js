import invokeApi from "../functions/invokeAPI"

export const DASHBAORD = ({ body = {}, token, navigation, filter = false }) => {
  return invokeApi({
    path: `api/consultant/delegate_dashboard${filter ? "?type=filter" : ""}`,
    method: "POST",
    token: token,
    navigation: navigation,
    postData: body
  })
}
