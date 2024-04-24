import invokeApi from "../functions/invokeAPI";

export const PROGRESS_LIST = ({ token, navigation, page, filters }) => {
  return invokeApi({
    path: `api/progress_report/list_progress_report_by_filter_v2?page=${page}&limit=10`,
    method: "POST",
    postData: filters,
    token,
    navigation,
  })
}


export const PROGRESS_CATEGORIES_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/progress_report_cateogry/list_progress_report_category_for_delegates`,
    method: "GET",
    token,
    navigation,
  })
}



export const PROGRESS_ADD = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/progress_report/`,
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    postData: formdata,
    token,
    navigation,
  })
}

export const PROGRESS_UPDATE = ({ token, navigation, formdata, progressId }) => {
  return invokeApi({
    path: `api/progress_report/${progressId}`,
    headers: { "content-type": "multipart/form-data" },
    method: "PUT",
    postData: formdata,
    token,
    navigation,
  })
}



export const PROGRESS_DELETE = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/progress_report/delete/${id}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const PROGRESS_NOTES_LIST = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/progress_internal_note/list_progress_internal_note/${id}`,
    method: "POST",
    token,
    navigation,
  })
}

export const PROGRESS_NOTES_DELETE = ({ token, navigation, progressId, id }) => {
  return invokeApi({
    path: `api/progress_internal_note/delete/${progressId}/${id}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const PROGRESS_NOTES_ADD = ({ token, navigation, body: {
  progressId, note
} }) => {

  return invokeApi({
    path: `api/progress_internal_note/`,
    method: "POST",
    postData: { internal_note: note, progress_id: progressId },
    token,
    navigation,
  })
}

export const PROGRESS_NOTES_UPDATE = ({ token, navigation, id, noteId, note }) => {
  return invokeApi({
    path: `api/progress_internal_note/${id}`,
    method: "PUT",
    postData: { internal_note: note, internal_note_id: noteId },
    token,
    navigation,
  })
}
