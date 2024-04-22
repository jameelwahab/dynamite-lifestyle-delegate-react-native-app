import invokeApi from "../functions/invokeAPI";

export const GET_VAULT_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/delegate_recording/programs_recording/list`,
    method: "GET",
    token,
    navigation,
  })
}
