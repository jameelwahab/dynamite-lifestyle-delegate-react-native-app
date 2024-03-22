import invokeApi from "../functions/invokeAPI"

export const GET_LINKS_LIST = ({ token, navigation }) => {
  return invokeApi({
    path: `api/consultant/links_listing/`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}
