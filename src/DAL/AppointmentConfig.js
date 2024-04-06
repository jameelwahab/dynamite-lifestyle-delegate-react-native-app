import invokeApi from "../functions/invokeAPI";

export const GET_APPOINTMENT_CONFIG_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/consultant/appointment/list`,
    token,
    navigation,
  })
}


export const APPOINTMENT_CONFIG_ADD = ({ token, navigation, body }) => {
  return invokeApi({
    path: `api/consultant/add_appointment`,
    method: "POST",
    postData: body,
    token,
    navigation,
  })
}
