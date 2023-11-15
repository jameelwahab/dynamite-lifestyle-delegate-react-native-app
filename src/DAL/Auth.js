import invokeApi from "../functions/invokeAPI"



export const LOGIN = ({ body }) => {
  return invokeApi({
    path: "api/consultant/login",
    method: "POST",
    checkAuth: false,
    postData: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}


export const SEND_OTP = ({ body }) => {
  return invokeApi({
    path: "api/consultant/forgot_password_send_verification_code",
    method: "POST",
    checkAuth: false,
    postData: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const VERIFY_OTP = ({ body }) => {
  return invokeApi({
    path: "api/consultant/email_code_verification",
    method: "POST",
    checkAuth: false,
    postData: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const RESET_PASSWORD = ({ body }) => {
  return invokeApi({
    path: "api/consultant/reset_password",
    method: "POST",
    checkAuth: false,
    postData: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const CHNAGE_PASSWORD = ({ body, token, navigation }) => {
  return invokeApi({
    path: "api/consultant/change_password_by_consultant",
    method: "POST",
    token: token,
    navigation: navigation,
    postData: body
  })
}

export const LOGOUT = ({ token, navigation }) => {
  return invokeApi({
    path: "api/consultant/logout_consultant",
    method: "POST",
    token: token,
    navigation: navigation,
    checkAuth: false,
    noAlerts: true,
  })
}