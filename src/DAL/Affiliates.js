import invokeApi from "../functions/invokeAPI";

export const GET_AFFILAITE_LINK = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/consultant/link/list_by_clickfunnels`,
    method: "GET",
    token,
    navigation,
  })
}



