import { CONTACTS_LOADING, CONTACTS_LOADING_INVITATION,CONTACTS_LOADING_ACCESS_REQUESTS, CONTACTS_SET_ACCESS_REQUESTS ,CONTACTS_SET_CONTACTS, CONTACTS_SET_NEW_CONTACTS, CONTACTS_SET_SEARCH_TEXT, CONTACTS_SET_INVITATIONS, CONTACTS_SET_SELECTED_CONTACTS, CONTACTS_EDIT_CONTACT, CONTACTS_REMOVE_CONTACTS, CONTACTS_RESET_CONTACTS, INVITATIONS_RESET_CONTACTS, CONTACTS_SET_FILTER } from "./constants";
import { Storage } from '@ionic/storage';
import { CACHE_USER_LOGIN_ROLE_NAME, CACHE_ALL_USER_ROLES, getUserRoles, TENANT_ID } from '../../utils/StorageUtil';

import asyncForEach from "../../utils/asyncForeach";
import * as integration from "scholarpresent-integration";
const store = new Storage();

export function contactsSetLoading(loading) {
	return {
		type: CONTACTS_LOADING,
		payload: loading
	};
}
export function contactsSetLoadingInvitation(loading) {
	return {
		type: CONTACTS_LOADING_INVITATION,
		payload: loading
	};
}

export function contactsSetLoadingAccessRequests(loading) {
	return {
		type: CONTACTS_LOADING_ACCESS_REQUESTS,
		payload: loading
	};
}

export function contactsSetContacts(params) {
	return {
		type: CONTACTS_SET_CONTACTS,
		payload: params
	};
}
export function contactsSetNewContacts(params) {
	return {
		type: CONTACTS_SET_NEW_CONTACTS,
		payload: params
	};
}

export function contactsSetSearchText(params) {
	return {
		type: CONTACTS_SET_SEARCH_TEXT,
		payload: params
	};
}
export function contactsSetInvitations(params) {
	return {
		type: CONTACTS_SET_INVITATIONS,
		payload: params
	};
}
export function contactsSetAccessRequests(params) {
	return {
		type: CONTACTS_SET_ACCESS_REQUESTS,
		payload: params
	};
}

export function contactsSetSelectedContacts(params) {
	return {
		type: CONTACTS_SET_SELECTED_CONTACTS,
		payload: params
	};
}
export function contactsEditContact(params) {
	return {
		type: CONTACTS_EDIT_CONTACT,
		payload: params
	};
}
export function contactsRemoveContacts(params) {
	return {
		type: CONTACTS_REMOVE_CONTACTS,
		payload: params
	};
}
export function contactsResetContacts(params) {
	return {
		type: CONTACTS_RESET_CONTACTS,
		payload: params
	};
}

export function invitationsResetContacts(params) {
	return {
		type: INVITATIONS_RESET_CONTACTS,
		payload: params
	};
}
export function contactsSetFilter(params) {
	return {
		type: CONTACTS_SET_FILTER,
		payload: params
	};
}
export const fetchContacts = (nextToken, roleName) => (dispatch) => {
	return new Promise(async (resolve, reject) => {
		try {
			
			dispatch(contactsSetLoading(true));
			await store.create();
			let logonRoleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);
			let tenantId = await store.get("TENANT_ID");

			if(logonRoleName!=="Student" && logonRoleName!=="Parent" ){
				let roles = await getUserRoles();
				console.log("fetchContacts roles ", roles);
				roles = JSON.parse(roles)?.items;

				console.log("fetchContacts action roleName ", roleName , " roles ", roles , " tenantId ", tenantId);

						if(Array.isArray(roles) && roleName && roleName!=null){
							
							let studentRole = roles.filter(role => role.roleName === roleName);
							if (studentRole.length) {
								let roleId = studentRole[0]?.id
								console.log("retrieve with role filter ::nextToken::", nextToken , " roleId ", roleId);
								let res = {};
								if (nextToken) {
									res = await integration.listUserByRole(roleId, nextToken);
								} else {
									res = await integration.listUserByRole(roleId, null);
								}
								console.log("fetchContacts with filter applied ", res);
								if(roleId && roleId !=null){
									res.roleId = roleId;
								}
								if (nextToken && Array.isArray(res.items)) {
									if(res.items.length > 0){
										dispatch(contactsSetContacts(res));
									}else{
										dispatch(contactsSetContacts({items: [], nextToken: null}));
									}
									resolve(res.items);
								} else if( Array.isArray(res.items)) {
									if(res.items.length > 0){
										dispatch(contactsSetNewContacts(res));
									}else{
										dispatch(contactsSetNewContacts({items: [], nextToken: null}));
									}
									resolve(res.items);
								} else{
									dispatch(contactsSetNewContacts({items: [], nextToken: null}));

									resolve([])
								}
							} else {
								
								resolve([])
							}
						}else{
							let res = {};

							if (nextToken) {
								res = await integration.listUserByRole(null, nextToken);
							} else {
								res = await integration.listUserByRole(null, null);
							}
							console.log("fetchContacts NO ROLE FILTER ", res);
							console.log("fetchContacts NO ROLE FILTER Array.isArray(res.items) ", Array.isArray(res.items));

							if (Array.isArray(res.items)) {
								console.log("fetchContacts NO ROLE FILTER res.items.length ", res.items.length);

								if(res.items.length > 0){
									dispatch(contactsSetContacts(res));
								}else{
									dispatch(contactsSetContacts({items: [], nextToken: null}));
								}
								resolve(res.items);
							} else {
								resolve([])
							}
						}
				
			}else{
				let resp = await integration.listContactForEveryone(nextToken);
				if (Array.isArray(resp.items)) {
					if(resp.items.length > 0){
						dispatch(contactsSetContacts(resp));
					}else{
						dispatch(contactsSetContacts({items: [], nextToken: null}));
					}
					resolve(resp.items);
				} else {
					resolve([])
				}

			}
		} catch (err) {
			reject(err)
		} finally {
			dispatch(contactsSetLoading(false));
		}
	})
};
export const fetchInvitations = (nextToken = null) => (dispatch) => {
	console.log("fetch");
	return new Promise(async (resolve, reject) => {
		dispatch(contactsSetLoadingInvitation(true));
		await store.create();
		let tenantId = await store.get(TENANT_ID);
		console.log("fetchInvitations nextToken ", nextToken);
		integration.listInvitationInfo(nextToken).then(async (res) => {
			console.log("fetchInvitations res ", res)
			
			if (Array.isArray(res.items)) {
				dispatch(contactsSetInvitations({...res, nextToken:res.nextToken, invitationTotalNumberOfPages:res.totalNumberOfPages }));
				resolve(res.items);
				dispatch(contactsSetLoadingInvitation(false));

			} else {
				resolve([])
				dispatch(contactsSetLoadingInvitation(false));
			}
		}).catch((err) => {
			reject(err);
			dispatch(contactsSetInvitations([]));
			resolve([]);
			dispatch(contactsSetLoadingInvitation(false));

		})
	})
};

export const fetchAccessRequests = (nextToken = null) => (dispatch) => {
	console.log("fetch");
	return new Promise(async (resolve, reject) => {
		dispatch(contactsSetLoadingAccessRequests(true));
		
		integration.retrieveJoinAccessRequestInfo(nextToken).then(async (res) => {
			console.log("fetchAccessRequests res ", res)
			
			if (Array.isArray(res.items)) {
				dispatch(contactsSetAccessRequests({...res, nextToken:res.nextToken, accessRequestsTotalNumberOfPages:res.totalNumberOfPages }));
				resolve(res.items);
				dispatch(contactsSetLoadingAccessRequests(false));

			} else {
				resolve([])
				dispatch(contactsSetLoadingAccessRequests(false));
			}
		}).catch((err) => {
			reject(err);
			dispatch(contactsSetAccessRequests([]));
			resolve([]);
			dispatch(contactsSetLoadingAccessRequests(false));

		})
	})
};

export const deleteContact = (contactsId) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		const { contactss } = getState().contactss;
		integration.deleteContactInfo(contactsId).then(async (res) => {
			let filteredContacts = contactss.filter(contacts => contacts.id !== contactsId);
			dispatch(contactsSetContacts(filteredContacts));
		}).catch((err) => {
			console.log(err, "deleteContact --->>>");

			reject(err);
		})
	})
};