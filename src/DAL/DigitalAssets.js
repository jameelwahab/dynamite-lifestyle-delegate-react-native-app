import invokeApi from "../functions/invokeAPI";

export const GET_ASSETS_CATEGORY_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/assest_category/list/active`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_ASSETS_LIST_BY_CATEGORY = ({ token, navigation, categoryId }) => {
  return invokeApi({
    path: `api/digital_asset/assets_list/delegate/${categoryId}`,
    method: "GET",
    token,
    navigation,
  })
}