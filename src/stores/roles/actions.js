import { Storage } from '@ionic/storage';

import { ROLES_LOADING, ROLES_SET_DATA, ROLES_RESET } from "./constants";
import { CACHE_USER_LOGIN_ROLE_NAME, CACHE_ALL_USER_ROLES, getUserRoles, TENANT_ID } from '../../utils/StorageUtil';

import * as integration from "scholarpresent-integration";

export function roleSetLoading(loading) {
	return {
		type: ROLES_LOADING,
		payload: loading
	};
}
export function roleSetData(params) {
	return {
		type: ROLES_SET_DATA,
		payload: params
	};
}
export function rolesReset(params) {
	return {
		type: ROLES_RESET,
		payload: params
	};
}
export const fetchRoles = () => (dispatch) => {
	return new Promise(async(resolve, reject) => {
		dispatch(roleSetLoading(true));
		const store = new Storage();
		await store.create();
		let roles = await getUserRoles();
		console.log("fetchRoles roles ", roles);
		roles = JSON.parse(roles);
		if(Array.isArray(roles?.items) || Array.isArray(roles)){
			if( Array.isArray(roles?.items) ){
				roles = roles?.items;
			}
			dispatch(roleSetData(roles));
			resolve(roles);
		}else{
			resolve([])
		}

		dispatch(roleSetLoading(false));
		// integration.getUserRoles(null).then(async (_res) => {
		// 	console.log(_res, "___");
		// 	let res = JSON.parse(_res);
		// 	const store = new Storage();
		// 	await store.create();
		// 	await store.set(CACHE_ALL_USER_ROLES , res.items);
		// 	console.log("checking roles ...",res.items);

		// 	if(Array.isArray(res.items)){
		// 		console.log("Caching roles ...");

		// 		dispatch(roleSetData(res.items));
		// 		resolve(res.items);
		// 	}else{
		// 		resolve([])
		// 	}
		// }).catch((err) => {
		// 	console.log(err, "fetchRoles --->>>");
			
		// 	reject(err);
		// }).finally(() => {
		// 	dispatch(roleSetLoading(false));
		// })
	})
};