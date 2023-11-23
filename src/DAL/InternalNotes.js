import invokeApi from "../functions/invokeAPI";

export const LIST_OF_NOTES = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/support_ticket/list_intenal_note/${id}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_NOTES = ({ token, navigation, body: {
  internal_note, support_ticket
} }) => {
  return invokeApi({
    path: `api/support_ticket/add_intenal_note`,
    method: "POST",
    postData: { internal_note, support_ticket },
    token,
    navigation,
  })
}

export const DELETE_NOTES = ({ token, navigation, noteId, ticketId }) => {
  return invokeApi({
    path: `api/support_ticket/delete_intenal_note/${ticketId}/${noteId}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const EDIT_NOTES = ({ token, navigation, body: {
  internal_note, internal_note_id, support_id
} }) => {
  return invokeApi({
    path: `api/support_ticket/edit_intenal_note/`,
    method: "PUT",
    postData: { internal_note, internal_note_id, support_id },
    token,
    navigation,
  })
}
