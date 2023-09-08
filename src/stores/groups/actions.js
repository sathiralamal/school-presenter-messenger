import { GROUPS_LOADING, GROUPS_SET_DATA, GROUPS_REMOVE_DATA, GROUPS_ADD_DATA, GROUPS_RESET } from "./constants";
import { Storage } from '@ionic/storage';
import { CACHE_USER_LOGIN_ROLE_NAME, CACHE_USER_LOGIN_ID } from '../../utils/StorageUtil';

import * as integration from "scholarpresent-integration";
const store = new Storage();


export function groupSetLoading(loading) {
	return {
		type: GROUPS_LOADING,
		payload: loading
	};
}
export function groupSetData(params) {
	return {
		type: GROUPS_SET_DATA,
		payload: params
	};
}

export function groupsReset(params) {
	return {
		type: GROUPS_RESET,
		payload: params
	};
}
export function groupRemoveData(params) {
	return {
		type: GROUPS_REMOVE_DATA,
		payload: params
	};
}
export function groupAddData(params) {
	return {
		type: GROUPS_ADD_DATA,
		payload: params
	};
}
export const fetchGroups = (nextToken) => (dispatch) => {
	console.log("fetchGroups nextToken ", nextToken);
	return new Promise((resolve, reject) => {
		dispatch(groupSetLoading(true));
		 store.create().then(async(value)=>{
			let logonRoleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);
			
			if(logonRoleName!=="Student" && logonRoleName!=="Parent" ){

				integration.listAllGroups(nextToken).then(async (res) => {
					if(Array.isArray(res.items)){
						dispatch(groupSetData(res));
						resolve(res);
					}else{
						resolve([])
					}
				}).catch((err) => {
					console.log(err, "fetchGroups --->>>");
					
					console.log((""+ err).indexOf("No current user"), "fetchGroups --->>>");

					reject(err);
				}).finally(() => {
					dispatch(groupSetLoading(false));
				})
			}else{
				let userId = await store.get(CACHE_USER_LOGIN_ID);
				integration.findUserBelongToGroup(userId).then(async (res) => {
					if(Array.isArray(res)){
						dispatch(groupSetData(res));
						resolve(res);
					}else{
						resolve([])
					}
				}).catch((err) => {
					console.log(err, "fetchGroups --->>>");
					console.log((""+ err).indexOf("No current user"), "fetchGroups --->>>");

					reject(err);
				}).finally(() => {
					dispatch(groupSetLoading(false));
				})
			}

		});
		
	})
};
export const deleteGroup = (groupId) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const {groups} = getState().groups;
		integration.deleteGroupInfo(groupId).then(async (res) => {
			console.log("groups ", groups);
			let filteredGroups = groups;
			if(Array.isArray(groups)){
				filteredGroups = groups.filter(group=>group.id !== groupId);
			}else if(groups?.items){
				filteredGroups = groups.items.filter(group=>group.id !== groupId);
			}
			dispatch(groupSetData(filteredGroups));
		}).catch((err) => {
			console.log(err, "fetchGroups --->>>");
			console.log((""+ err).indexOf("No current user"), "fetchGroups --->>>");

			reject(err);
		})
	})
};