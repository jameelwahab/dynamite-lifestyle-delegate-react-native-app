import invokeApi from '../functions/invokeAPI';

export const LOGIN = ({body}) => {
  return invokeApi({
    path: 'api/consultant/login/v1',
    method: 'POST',
    checkAuth: false,
    postData: body,
  });
};

export const VERIFY_LOGIN = ({body}) => {
  return invokeApi({
    path: 'api/consultant/login/verify-otp',
    method: 'POST',
    checkAuth: false,
    postData: body,
  });
};

export const SEND_OTP = ({body}) => {
  return invokeApi({
    path: 'api/consultant/forgot_password_send_verification_code',
    method: 'POST',
    checkAuth: false,
    postData: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const VERIFY_OTP = ({body}) => {
  return invokeApi({
    path: 'api/consultant/email_code_verification',
    method: 'POST',
    checkAuth: false,
    postData: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const RESET_PASSWORD = ({body}) => {
  return invokeApi({
    path: 'api/consultant/reset_password_consultant',
    method: 'POST',
    checkAuth: false,
    postData: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const CHANGE_PASSWORD = ({body, token, navigation}) => {
  return invokeApi({
    path: 'api/consultant/change_password/v1',
    method: 'POST',
    token: token,
    navigation: navigation,
    postData: body,
  });
};

export const VERIFY_CHANGE_PASSWORD = ({body, navigation, token}) => {
  return invokeApi({
    path: 'api/consultant/change_password/verify-otp',
    method: 'POST',
    navigation: navigation,
    token: token,
    postData: body,
    checkAuth: false,
  });
};

export const LOGOUT = ({token, navigation, type = 'this_device'}) => {
  return invokeApi({
    path: `api/consultant/logout_consultant?logout_from=${type}`,
    method: 'POST',
    token: token,
    navigation: navigation,
    checkAuth: false,
    noAlerts: true,
  });
};

export const RESEND_OTP = ({body, navigation}) => {
  return invokeApi({
    path: `api/member/auth/2fa/resend`,
    method: 'POST',
    postData: body,
    navigation: navigation,
    checkAuth: false,
  });
};
