import invokeApi from "../functions/invokeAPI"

export const GET_TRAINING_LIST = ({ token, navigation, page, search = "" }) => {
  return invokeApi({
    path: `api/consultant/delegate_training/list?page=${page}&limit=10&search_text=${search}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}

export const GET_TRAINING_DETAIL = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/program/get_program/${slug}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}

export const GET_TRAINING_LESSONS_LIST = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/lesson/lesson_list_by_program/${slug}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}

export const GET_TRAINING_LESSONS_DETAIL = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/lesson/${slug}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}
export const GET_TRAINING_LESSONS_RECORDING = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/lesson_recording/recording_detail/${slug}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}