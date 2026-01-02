import invokeApi from '../functions/invokeAPI';

export const QUESTIONS_LIST = ({
  token,
  navigation,
  body: {created_for, created_for_id, member_id, check_user = undefined},
}) => {
  return invokeApi({
    path: `api/questionnaire/list_question_reply_against/lesson`,
    method: 'POST',
    postData: {created_for, created_for_id, member_id, check_user},
    token,
    navigation,
    isNewAPI: true,
  });
};

export const GET_USER_LISTING_WHO_ASNWERED_BY_MODULE = ({
  token,
  navigation,
  created_for,
  created_for_id,
  search_text,
  page,
  type = undefined,
}) => {
  return invokeApi({
    path: `api/questionnaire/list_member_replies_against_module?page=${page}&limit=20`,
    method: 'POST',
    postData: {
      created_for,
      created_for_id,
      search_text,
      type,
    },
    token,
    navigation,
  });
};

export const QUESTIONS_LIST_BY_MODULE = ({token, navigation, module, id}) => {
  return invokeApi({
    path: `api/questionnaire/list/by_module?created_for=${module}&created_for_id=${id}`,
    method: 'GET',
    token,
    navigation,
  });
};

export const ADD_QUESTIONS = ({token, navigation, formdata}) => {
  return invokeApi({
    path: `api/questionnaire`,
    method: 'POST',
    postData: formdata,
    headers: {'Content-Type': 'multipart/form-data'},
    token,
    navigation,
  });
};

export const EDIT_QUESTIONS = ({token, navigation, formdata, questionId}) => {
  return invokeApi({
    path: `api/questionnaire/${questionId}`,
    method: 'PUT',
    postData: formdata,
    headers: {'Content-Type': 'multipart/form-data'},
    token,
    navigation,
  });
};

export const DELETE_QUESTIONS = ({token, navigation, questionId}) => {
  return invokeApi({
    path: `api/questionnaire/${questionId}`,
    method: 'DELETE',
    token,
    navigation,
  });
};

export const GET_QUESTIONS_CONFIGURRATION = ({
  token,
  navigation,
  created_for,
  created_for_id,
}) => {
  return invokeApi({
    path: `api/questionnaire/get_configration`,
    method: 'POST',
    postData: {created_for, created_for_id},
    token,
    navigation,
  });
};

export const ADD_ANSWER_FOR_SPECIFIC_QUESTION = ({
  token,
  navigation,
  created_for,
  created_for_id,
  question_answer_array,
}) => {
  return invokeApi({
    path: `api/questionnaire/add_comment_on_questionare`,
    method: 'POST',
    postData: {created_for, created_for_id, question_answer_array},
    token,
    navigation,
  });
};

export const UPLOAD_FILE_QUESTIONS = ({token, navigation, file}) => {
  return invokeApi({
    path: `app/upload_csv_file_on_s3`,
    method: 'POST',
    headers: {'Content-Type': 'multipart/form-data'},
    postData: file,
    token,
    navigation,
  });
};

export const QUESTION_REPLY_LIST = ({
  token,
  navigation,
  body: {check_user, created_for, created_for_id, member_id},
}) => {
  return invokeApi({
    path: `api/questionnaire/list_question_reply_against/lesson`,
    method: 'POST',
    postData: {
      check_user,
      created_for,
      created_for_id,
      member_id,
    },
    token,
    navigation,
  });
};

export const QUESTION_ADD_REPLY = ({
  token,
  navigation,
  body: {comment, member, question_id},
}) => {
  return invokeApi({
    path: `api/questionnaire/add_comment_on_member_replies`,
    method: 'POST',
    postData: {
      comment,
      member,
      question_id,
    },
    token,
    navigation,
  });
};

export const QUESTION_EDIT_REPLY = ({
  token,
  navigation,
  body: {comment, comment_id, member, question_id},
}) => {
  return invokeApi({
    path: `api/questionnaire/edit_reply_by/admin`,
    method: 'POST',
    postData: {
      comment,
      comment_id,
      member,
      question_id,
    },
    token,
    navigation,
  });
};

export const QUESTION_DELETE_REPLY = ({
  token,
  navigation,
  body: {comment, comment_id, member, question_id},
}) => {
  return invokeApi({
    path: `api/questionnaire/delete_reply_by/admin`,
    method: 'POST',
    postData: {
      comment_id,
      member,
      question_id,
    },
    token,
    navigation,
  });
};

export const QUESTIONS_ADD_DYNAMIYE_REPLY = ({token, navigation, formData}) => {
  return invokeApi({
    path: `api/questionnaire/reply_on_member/answers`,
    method: 'POST',
    headers: {'content-type': 'multipart/form-data'},
    postData: formData,
    token,
    navigation,
  });
};

export const QUESTIONS_DELETE_DYNAMIYE_REPLY = ({
  token,
  navigation,
  body: {created_for, message_id},
}) => {
  return invokeApi({
    path: `api/questionnaire/delete_reply_on_member/answers`,
    method: 'POST',
    postData: {created_for, message_id},
    token,
    navigation,
  });
};

export const TOGGLE_SHOW_REPLIES = ({
  token,
  navigation,
  body: {created_for, question_id, member_id, show_replies},
}) => {
  return invokeApi({
    path: `api/questionnaire/set/show_replies`,
    method: 'POST',
    postData: {created_for, question_id, member_id, show_replies},
    token,
    navigation,
  });
};
