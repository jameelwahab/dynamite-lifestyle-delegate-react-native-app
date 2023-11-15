import invokeApi from "../functions/invokeAPI"

export const INIT_WITH_TOKEN = ({ token }) => {
  return invokeApi({
    path: "api/consultant_init/with_token",
    method: "GET",
    token: token,
    noAlerts: true
  })
}


export const INIT_WITHOUT_TOKEN = () => {
  return invokeApi({
    path: "api/consultant_init/without_token",
    method: "GET",
    checkAuth: false,
    noAlerts: true
  })
}
