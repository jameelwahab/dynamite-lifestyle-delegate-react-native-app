import invokeApi from "../functions/invokeAPI";

export const GET_DAILY_STREAK = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/dynamite_streak/get_dynamite_streak`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_DAILY_STREAK_LIST = ({ token, navigation, page, body: { date_from, date_to } }) => {
  return invokeApi({
    path: `api/dynamite_streak/get_dynamite_streak_list?page=${page}&limit=10`,
    method: "POST",
    postData: { date_from, date_to },
    token,
    navigation,
  })
}

export const SET_DAILY_STREAK_REMINDER = ({ token, navigation, days, time }) => {
  return invokeApi({
    path: `api/consultant/streak_reminder_time/update`,
    method: "POST",
    postData: {
      dynamite_streak_performance_reminder_time: {
        days, time
      }
    },
    token,
    navigation,
  })

}

export const ADD_DAILY_STREAK = ({ token, navigation, body: {
  attitude_performance_rate, desire_performance_rate, discipline_performance_rate,
  focus_performance_rate, win_note, win_note_performance_rate
} }) => {
  return invokeApi({
    path: `api/dynamite_streak/add_streak`,
    method: "POST",
    postData: {
      attitude_performance_rate, desire_performance_rate, discipline_performance_rate,
      focus_performance_rate, win_note, win_note_performance_rate
    },
    token,
    navigation,
  })
}

export const UPDATE_DAILY_STREAK = ({ token, navigation, id, body: {
  attitude_performance_rate, desire_performance_rate, discipline_performance_rate,
  focus_performance_rate, win_note, win_note_performance_rate
} }) => {
  return invokeApi({
    path: `api/dynamite_streak/update_streak/${id}`,
    method: "POST",
    postData: {
      attitude_performance_rate, desire_performance_rate, discipline_performance_rate,
      focus_performance_rate, win_note, win_note_performance_rate
    },
    token,
    navigation,
  })
}