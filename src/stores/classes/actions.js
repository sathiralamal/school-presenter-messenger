import { CLASSES_LOADING, CLASSES_SET_DATA } from "./constants";
import * as integration from "scholarpresent-integration";

export function classesSetLoading(loading) {
	return {
		type: CLASSES_LOADING,
		payload: loading
	};
}
export function classesSetData(params) {
	return {
		type: CLASSES_SET_DATA,
		payload: params
	};
}
export const fetchClasses = (tenantId) => (dispatch) => {
	return new Promise((resolve, reject) => {
		dispatch(classesSetLoading(true));
		integration.listClassesInfo(tenantId).then(async (res) => {
			if(Array.isArray(res.items)){
				dispatch(classesSetData(res.items));
				resolve(res.items);
			}else{
				resolve([])
			}
		}).catch((err) => {
			console.log(err);
			reject(err);
		}).finally(() => {
			dispatch(classesSetLoading(false));
		})
	})
};