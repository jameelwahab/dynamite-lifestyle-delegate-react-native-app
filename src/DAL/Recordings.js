import invokeApi from "../functions/invokeAPI";

export const GET_MY_RECORDING_LIST = ({ token, navigation, }) => {
	return invokeApi({
		path: `api/program_recording`,
		method: "GET",
		token,
		navigation,
	})
}

export const RECORDING_PROGRAMMES_AND_CATEGORY = ({ token, navigation, slug }) => {
	return invokeApi({
		path: `api/consultant/list_main_portal_program/delegate`,
		method: "POST",
		postData: { filter_array: ["program", "vault_category", "mission"] },
		token,
		navigation,
	})
}


export const RECORDING_ADD = ({ token, navigation, formdata }) => {
	return invokeApi({
		path: `api/program_recording`,
		method: "POST",
		headers: { "Content-Type": "multipart/form-data" },
		postData: formdata,
		token,
		navigation,
	})
}


export const RECORDING_UPDATE = ({ token, navigation, slug, formdata }) => {
	return invokeApi({
		path: `api/program_recording/${slug}`,
		method: "PUT",
		headers: { "Content-Type": "multipart/form-data" },
		postData: formdata,
		token,
		navigation,
	})
}

export const RECORDING_DELETE = ({ token, navigation, slug }) => {
	return invokeApi({
		path: `api/program_recording/${slug}`,
		method: "DELETE",
		token,
		navigation,
	})
}

export const RECORDING_REMOVE_AUDIO = ({ token, navigation, slug }) => {
	return invokeApi({
		path: `api/program_recording/${slug}`,
		method: "POST",
		postData: { "status": "audio" },
		token,
		navigation,
	})
}

