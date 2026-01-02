import invokeApi from '../functions/invokeAPI';

export const EDIT_PROFILE = ({token, params, body, navigation}) => {
  return invokeApi({
    path: 'api/consultant/profile/v1/' + params,
    method: 'PUT',
    postData: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    token,
    navigation,
    isNewAPI: true,
  });
};

export const VERIFY_EDIT_PROFILE = ({token, params, body, navigation}) => {
  return invokeApi({
    path: 'api/consultant/profile/verify_otp',
    method: 'POST',
    postData: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    token,
    navigation,
    isNewAPI: true,
  });
};
