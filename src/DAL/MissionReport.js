import {is} from 'cheerio/lib/api/traversing';
import invokeApi from '../functions/invokeAPI';

export const GET_MEMBER_LIST_FOR_MISSION = ({
  token,
  navigation,
  page,
  mission_type,
  type,
  search_txt,
  body,
}) =>
  invokeApi({
    path: `api/consultant/member_mission/report?page=${page}&limit=50&include_members=${type}&search_text=${search_txt}&mission_type=${mission_type}`,
    method: 'POST',
    token: token,
    navigation: navigation,
    postData: body,
  });

export const GET_MISSION_LIST_BY_MEMBER = ({token, navigation, memberId}) => {
  return invokeApi({
    path: `api/consultant/user_completed_missions/list/${memberId}`,
    method: 'GET',
    token: token,
    navigation: navigation,
  });
};

export const GET_MISSION_DETAIL_BY_ID = ({
  token,
  navigation,
  missionId,
  memberId,
}) => {
  return invokeApi({
    path: `api/mission/report/for_delegate`,
    method: 'POST',
    token: token,
    navigation: navigation,
    postData: {
      data: 'all',
      tab: 'report',
      user_id: memberId,
      mission_id: missionId,
    },
    isNewAPI: true,
  });
};

export const GET_MISSION_FILTER_LIST = ({
  token,
  navigation,
  missionId,
  memberId,
}) =>
  invokeApi({
    path: 'api/consultant/missions/list',
    token,
    navigation,
  });
