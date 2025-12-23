import invokeApi from '../functions/invokeAPI';

export const GET_ASSESSMENT_LIST = ({token, navigation, page, searchText}) => {
  return invokeApi({
    path: `api/member/list/for_assessment?page=${page}&limit=50&search_text=${searchText}`,
    method: 'GET',
    token,
    navigation,
  });
};

export const ASSESSMENT_NOTE_LIST = ({
  token,
  navigation,
  assessmentId,
  type,
}) => {
  return invokeApi({
    path: `api/attitude_assessment_question/list_assesment_intenal_note`,
    method: 'POST',
    postData: {
      assessment_id: assessmentId,
      internal_note_type: type,
    },
    token,
    navigation,
  });
};

export const ASSESSMENT_NOTE_ADD = ({
  token,
  navigation,
  assessmentId,
  type,
  message,
}) => {
  return invokeApi({
    path: `api/attitude_assessment_question/add_intenal_noteassessment`,
    method: 'POST',
    postData: JSON.stringify({
      assessment_id: assessmentId,
      internal_note_type: type,
      internal_note_message: message,
    }),
    token,
    navigation,
  });
};

export const ASSESSMENT_NOTE_UPDATE = ({
  token,
  navigation,
  assessmentId,
  type,
  noteId,
  message,
}) => {
  return invokeApi({
    path: `api/attitude_assessment_question/edit_intenal_note`,
    method: 'POST',
    postData: {
      assessment_id: assessmentId,
      internal_note_type: type,
      internal_note_id: noteId,
      internal_note_message: message,
    },
    token,
    navigation,
  });
};

export const ASSESSMENT_NOTE_DELETE = ({
  token,
  navigation,
  assessmentId,
  type,
  noteId,
}) => {
  return invokeApi({
    path: `api/attitude_assessment_question/delete_intenal_note`,
    method: 'POST',
    postData: {
      assessment_id: assessmentId,
      internal_note_type: type,
      internal_note_id: noteId,
    },
    token,
    navigation,
  });
};
