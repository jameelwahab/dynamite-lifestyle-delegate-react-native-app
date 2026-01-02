import invokeApi from '../functions/invokeAPI';

export const GET_FEED_KEYWORDS_SETTINGS = ({token, navigation}) => {
  return invokeApi({
    path: `api/consultant/feed_keyword_settings/get`,
    method: 'GET',
    token,
    navigation,
    isNewAPI: true,
  });
};

export const UPDATE_FEED_KEYWORDS_SETTINGS = ({
  token,
  navigation,
  feed_keyword_setting,
}) => {
  return invokeApi({
    path: `api/consultant/feed_keyword_settings/update`,
    method: 'PUT',
    token,
    navigation,
    postData: {feed_keyword_setting},
    isNewAPI: true,
  });
};
