import axios from 'axios';
import { domain } from '../utilities/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showToast from './showToast';
import routes from '../navigation/routes';

axios.defaults.headers.post['Content-Type'] = 'application/json';
let alertShown = false;
export default async function invokeApi({
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  postData = {},
  checkAuth = true,
  token = "",
  noAlerts = false,
  navigation = null,
  excludeBaseURL = false
}) {
  const reqObj = {
    method,
    url: excludeBaseURL ? path : domain + path,
    headers: {
      ...headers,
      "x-sh-auth": token
    },
  };


  reqObj.params = queryParams;

  if (method === 'POST') {
    reqObj.data = postData;
  }
  if (method === 'PUT') {
    reqObj.data = postData;
  }
  if (method === 'DELETE') {
    reqObj.data = postData;
  }

  let results;

  console.log(`<===REQUEST-OBJECT===>\t %c${path} \n`, 'background:#FF0; color: #000', reqObj,);

  try {
    results = await axios(reqObj);

    console.log(`<===Api-Success-Result===>\t %c${path} \n`, 'background:#0F0; color: #000', results);
    return results.data;

  } catch (error) {

    console.log(`<===Api-Error===>\t %c${path} \n`, 'background:#F00; color: #FFF', error);
    if (error.code == 'ERR_NETWORK') {
      if (!noAlerts) {
        showToast({ body: "No Internet Connection", title: "Network Error" });
      }
      return {
        code: 'ERR_NETWORK',
        message: 'No Internet Connection',
      };
    } else if (error?.response?.data?.code === 401 && checkAuth == true && alertShown == false) {
      if (!noAlerts) {
        showToast({ body: "Please login again", title: "Authentication failed" });
      }
      await AsyncStorage.multiRemove(["token"]);
      navigation.reset({
        index: 0,
        routes: [{
          name: routes.login
        }]
      })
    } else {
      if (!noAlerts) {
        if (!!error?.response?.data?.message) {
          showToast({ body: error?.response?.data?.message, title: "Error" });
        } else {
          showToast({ body: error.message, title: "Error" });
        }
      }
    }

    return {
      code: error.response.status,
      message: error.response.data.message
        ? error.response.data.message
        : error?.message,
    };
  }
}

