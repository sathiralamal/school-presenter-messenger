import React, { useState, useEffect, useRef } from "react";
import { IonItem, IonText, IonButton, IonIcon, IonSpinner, useIonAlert } from "@ionic/react";
import { useHistory } from "react-router-dom";

import { folder, person, personAdd } from "ionicons/icons";
import { Icon, InputGroup, Input, MultiCascader, Button } from "rsuite";
import { v4 as uuid } from "uuid";


//redux
import { connect } from "react-redux";
import { groupSetData, fetchGroups } from "../../../stores/groups/actions";
import { fetchConversation } from "../../../stores/messages/actions";
//utils
import asyncForEach from "../../../utils/asyncForeach";
import useGetCacheTenantId from "../../../hooks/useGetCacheTenantId";

import { CACHE_USER_LOGIN_ID, TENANT_ID,getUserRoles } from '../../../utils/StorageUtil';
import { Storage } from '@ionic/storage';
import * as integration from "scholarpresent-integration";
const CreateConversation: React.FC<{
	fetchGroups: Function;
	fetchConversation: Function;
}> = ({
	fetchGroups,
	fetchConversation
}) => {
		const history = useHistory();
		const cascaderRef = useRef<any>(null);
		const store = new Storage();
		const [data, setData] = useState<any>([]);
		const [roles, setRoles] = useState<any>([]);
		const [grades, setGrades] = useState<any>([]);
		const [uncheckableItems, setUncheckableItems] = useState<any>([]);
		const [conversationName, setConversationName] = useState("");
		const [groupAdministrators, setGroupAdministrators] = useState<any>([]);
		const [btnLoading, setBtnLoading] = useState<boolean>(false);
		const [defaultAdmins, setDefaultAdmins] = useState<any>([]);
		const [adminKey, setAdminKey] = useState<any>(`admin-${Date.now()}`);
		const [defaultMembers, setDefaultMembers] = useState<any>([]);
		const [memberKey, setMemberKey] = useState<any>(`member-${Date.now()}`);
		const [cascadeValue, setCascadeValue] = useState([])
		const [present] = useIonAlert();
		let tenantId:string = useGetCacheTenantId();


		// useEffect(() => {
		// 	if (!open) {
		// 		setGroupName("");
		// 		setDefaultAdmins([]);
		// 		setDefaultMembers([]);
		// 		setAdminKey(`admin-${Date.now()}`)
		// 		setMemberKey(`member-${Date.now()}`)
		// 	}
		// }, [open])
		const handleStartLoadingCascader = (value: any, level: number) => {
			console.log( "enter handleStartLoadingCascader value ", value, " level ", level);
			if (level === 1) {
				console.log( "starting level 1") 
				data.map((item: any) => {
					if ((value.label === item.label) && item.children.length === 0) {
						item.children = [{
							"label": <IonSpinner name="dots" />
						}];
					}
				})
				console.log( "end level 1") 

			} else if (level === 2) {
				console.log( "starting level 2") 
				data.map((item: any) => {
					item.children.map((child: any) => {
						if ((value.label === child.label) && child.children.length === 0) {
							child.children = [{
								"label": <IonSpinner name="dots" />
							}];
						}
					})
				})
				console.log( "end level 2") 

			} else if (level === 3) {
				console.log( "starting level 3") 
				let isThirdLevelChildrenFound = false;
				data.map((item: any) => {
					item.children.map((child: any) => {
						if(child?.children){
							child.children?.map((ch: any) => {
								if ((value.label === ch.label)) {
									ch.children = [{
										"label": <IonSpinner name="dots" />
									}];
								}
							})
						}else{
							child.children = [];
							child.children?.map((ch: any) => {
								if ((value.label === ch.label)) {
									ch.children = [{
										"label": <IonSpinner name="dots" />
									}];
								}
							})
						}
						
					})
				})
				if(!isThirdLevelChildrenFound){

				}
				console.log( "end level 3") 

			}else {
				throw Error("Level incorrect");
			}
			
			setData([...data]);
			console.log( "exit handleStartLoadingCascader") 
		}
		const handleFetchRoles = async () => {
			try {
				console.log("handleFetchRoles")
				let rolesArr: any[] = [];
				let _roles = await getUserRoles();
				console.log("handleFetchRoles _roles ", JSON.parse(_roles));
				rolesArr = JSON.parse(_roles)?.items
				
				setRoles(rolesArr);

				let rolesModified: any[] = [];
				let uncheckableArr: any[] = [];
				rolesArr.map((role, i) => {
					rolesModified.push({
						value: JSON.stringify({ id: role.id, data: role, level: "role", index: i, label: role.roleName, rootIndex: i }),
						label: role.roleName,
						children: []
					})
					uncheckableArr.push(JSON.stringify({ id: role.id, data: role, level: "role", index: i, label: role.roleName, rootIndex: i }))
				})
				console.log("rolesModified : ", rolesModified);

				setData([...rolesModified]);
				setUncheckableItems(uncheckableArr)
			} catch (err) {

			}
		}
		useEffect(() => {
			console.log("useEffect createConversation first load");
			console.log("useEffect roles ", roles);

			if(roles?.length < 1){
				handleFetchRoles()
			}
		}, [])

		useEffect(() => {
			console.log("useEffect createConversation entered")
			
		})
		const handleSelectAdmins = async (value: any, activePath: any) => {
			console.log("handleSelectAdmins value ", value , " activePath ", activePath);
			console.log(" activePath.length ", activePath?.length);
			switch (activePath.length) {
				case 1:
					if (["Parent", "Student"].includes(value.label))
						handleFetchGrades(value, activePath)
					else
						handleFetchStaff(value, activePath)
					return;
				case 2:
					handleFetchClasses(value, activePath)
					return;
				case 3:
					handleFetchStudents(value, activePath)
					return;
			}
		}

		const handleFetchStaff = async (value: any, activePath: any) => {
			await store.create();
			let tenantId = await store.get(TENANT_ID);

			try {
				handleStartLoadingCascader(value, 1);
				let filteredUncheckableList = uncheckableItems.filter((item: any) => item !== value.value)
				value = JSON.parse(value.value)
				let activePathJson = JSON.parse(activePath[0]?.value)
				let staffArr: any[] = [];
				let staff = await integration.listUserByRole(value.id, null);

				staffArr = [...staffArr, ...staff.items];
				let nextToken = staff.nextToken;
				let i = 0;
				while (nextToken != staff.totalNumberOfPages && nextToken < (staff.totalNumberOfPages -1) ) {
					let temp = await integration.listUserByRole(value.id, nextToken);
					nextToken = temp.nextToken;
					staffArr = [...staffArr, ...temp.items];
					i = i + 10;
				}
				setData((data: any) => {
					data.map((item: any) => {
						if ((value.label === item.label)) {
							item.children = [];
						}
					})
					let staffModified: any[] = [];
					staffArr.map((stf, i) => {
						staffModified.push({
							value: JSON.stringify({ id: stf.id, data:stf, level: "student", index: i, label: `${stf.firstName} ${stf.lastName}`, rootIndex: activePathJson?.index }),
							label: `${stf.firstName} ${stf.lastName}`,
							//children: []
						})
					})
					let flag = false;

					data.map((item: any) => {
						if ((value.label === item.label) && item.children.length === 0) {
							flag = true;
							item.children = staffModified;
						}
					})
					// if (flag) {
					// 	setUncheckableItems(filteredUncheckableList)
					// }
					return [...data]
				})
			} catch (err) {

			}
		}
		const handleFetchGrades = async (value: any, activePath: any) => {
			try {
				handleStartLoadingCascader(value, 1);
				let activePathJson = JSON.parse(activePath[0]?.value)
				let gradesArr: any[] = [];
				let grades = await integration.getGrades(undefined);
				gradesArr = grades?.items;
				
				setData((data: any) => {
					data.map((item: any) => {
						if ((value.label === item.label)) {
							item.children = [];
						}
					})
					setGrades([...gradesArr]);
					let gradesModified: any[] = [];
					let uncheckableArr: any[] = [];
					gradesArr.map((grade, i) => {
						gradesModified.push({
							value: JSON.stringify({ id: grade.id, data:grade, level: "grade", index: i, label: grade.gradeName, rootIndex: activePathJson.index }),
							label: grade.gradeName,
							children: []
						})
						uncheckableArr.push(JSON.stringify({ id: grade.id,data:grade, level: "grade", index: i, label: grade.gradeName, rootIndex: activePathJson.index }))
					})
					let flag = false;
					data.map((item: any) => {
						if ((value.label === item.label) && item.children.length === 0) {
							flag = true;
							item.children = gradesModified;
						}
					})
					if (flag) {
						setUncheckableItems([...uncheckableItems, ...uncheckableArr])
					}
					return [...data]
				})
			} catch (err) {

			}
		}
		const handleFetchClasses = async (value: any, activePath: any) => {
			try {
				handleStartLoadingCascader(value, 2);
				let activePathJson = JSON.parse(activePath[0]?.value)
				value = JSON.parse(value.value)
				let classesArr: any[] = [];
				let classes = await integration.listClassNamesByGradeIdInfo(value.id, null);
				classesArr = [...classesArr, ...classes.items];
				let nextToken = classes.nextToken;
				while (nextToken != null) {
					let temp = await integration.listClassNamesByGradeIdInfo(value.id, nextToken);
					nextToken = temp.nextToken;
					classesArr = [...classesArr, ...temp.items]
				}
				setData((data: any) => {
					data.map((item: any) => {
						item.children.map((child: any) => {
							if ((value.label === child.label)) {
								child.children = [];
							}
						})
					})
					let classesModified: any[] = [];
					let uncheckableArr: any[] = [];
					classesArr.map((cls, i) => {
						classesModified.push({
							value: JSON.stringify({ id: cls.id, data:cls, level: "class", index: i, label: cls.className, rootIndex: activePathJson.index }),
							label: cls.className,
							children: []
						})
						uncheckableArr.push(JSON.stringify({ id: cls.id,data:cls, level: "class", index: i, label: cls.className, rootIndex: activePathJson.index }))
					})
					let flag = false;
					data.map((item: any) => {
						item.children.map((child: any) => {
							if ((value.label === child.label) && child.children.length === 0) {
								child.children = classesModified;
								flag = true;
							}
						})
					})
					if (flag) {
						setUncheckableItems([...uncheckableItems, ...uncheckableArr])
					}
					return [...data]
				})
			} catch (err) {
			}
		}
		const handleFetchStudents = async (value: any, activePath: any) => {
			console.log("fetching students or parents value ", value,  " activePath ", activePath);
			try {
				handleStartLoadingCascader(value, 3);
				let activePathJson = JSON.parse(activePath[0]?.value)
				console.log("activePathJson ", activePathJson);

				value = JSON.parse(value.value)
				console.log("value ", value);

				let roleId = JSON.parse(activePath[0]?.value).id;
				console.log("roleId ", roleId);
				let classId = value.id;
				let studentsArr: any[] = [];
				let students = await integration.getUserByRoleAndClassInfo(roleId, classId, null);
				studentsArr = [...studentsArr, ...students.items];
				let nextToken = students.nextToken;
				while (nextToken != null) {
					let temp = await integration.getUserByRoleAndClassInfo(roleId, classId, nextToken);
					nextToken = temp.nextToken;
					studentsArr = [...studentsArr, ...temp.items]
				}
				setData((data: any) => {
					data.map((item: any) => {
						item.children.map((child: any) => {
							child.children.map((ch: any) => {
								if ((value.label === ch.label)) {
									ch.children = [];
								}
							})
						})
					})
					let studentsModified: any[] = [];
					studentsArr.map((std, i) => {
						studentsModified.push({
							value: JSON.stringify({ id: std.id,data : std, level: "student", index: i, label: `${std.firstName} ${std.lastName}`, rootIndex: activePathJson.index }),
							label: `${std.firstName} ${std.lastName}`,
							
							//children: []
						})
					})

					let flag = false;
					data.map((item: any) => {
						item.children.map((child: any) => {
							child.children.map((ch: any) => {
								if ((value.label === ch.label) && ch.children.length === 0) {
									ch.children = studentsModified;
									flag = true;
								}
							})
						})
					})
					// if (flag) {
					// 	if (studentsModified.length)
					// 		setUncheckableItems([]);
					// }
					return [...data]
				})
			} catch (err) {
			}
		}
		const getUsersFromRole = async (roleId: string) => {
			await store.create();
			let tenantId = await store.get(TENANT_ID);
			return new Promise(async (resolve, reject) => {
				let userArr: any[] = [];
				let user = await integration.listUserByRole(roleId, null);
				userArr = [...userArr, ...user.items.map((item: any) => item.id)];
				let nextToken = user.nextToken;
				while (nextToken != null) {
					let temp = await integration.listUserByRole(roleId, nextToken);
					nextToken = temp.nextToken;
					userArr = [...userArr, ...temp.items.map((item: any) => item.id)]
				}
				resolve(userArr);
			})
		}
		const getClassesFromGrade = async (gradeId: string) => {
			return new Promise(async (resolve, reject) => {
				let classesArr: any[] = [];
				let classes = await integration.listClassNamesByGradeIdInfo(gradeId, null);
				classesArr = [...classesArr, ...classes.items.map((item: any) => item.id)];
				let nextToken = classes.nextToken;
				while (nextToken != null) {
					let temp = await integration.listClassNamesByGradeIdInfo(gradeId, nextToken);
					nextToken = temp.nextToken;
					classesArr = [...classesArr, ...temp.items.map((item: any) => item.id)]
				}
				resolve(classesArr);
			})
		}
		const getUsersFromClasses = async (classIds: any, roleId: string) => {
			return new Promise(async (resolve, reject) => {
				let userIds: any[] = [];
				await asyncForEach(classIds, async (classId: string) => {
					let students = await integration.getUserByRoleAndClassInfo(roleId, classId, null);
					userIds = [...userIds, ...students.items.map((item: any) => item.id)];
					let nextToken = students.nextToken;
					while (nextToken != null) {
						let temp = await integration.getUserByRoleAndClassInfo(roleId, classId, nextToken);
						nextToken = temp.nextToken;
						userIds = [...userIds, ...temp.items.map((item: any) => item.id)]
					}
				})
				resolve(userIds);
			})
		}
		const extractUserIds = async (payload: any) => {
			return new Promise(async (resolve, reject) => {
				let userIds: any[] = [];
				await asyncForEach(payload, async (user: any) => {
					let parsedValue = JSON.parse(user);
					console.log("extractUserIds payload ", payload , " user ", user , "parsedValue.level ", parsedValue.level);
					userIds.push(parsedValue.id);
					// if (parsedValue.level === "student") {
					// 	userIds.push(parsedValue.id);
					// } else {
					// 	if (["Teacher", "Other Staff", "Principal"].includes(parsedValue.label)) {
					// 		let staffArr = await getUsersFromRole(parsedValue.id);
					// 		userIds = [...userIds, ...staffArr as any];
					// } 
					// else {
					// 		if (parsedValue.level === "role") {
					// 			let parentOrStudentArr = await getUsersFromRole(parsedValue.id);
					// 			userIds = [...userIds, ...parentOrStudentArr as any];
					// 		} else if (parsedValue.level === "grade") {
					// 			let classIds = await getClassesFromGrade(parsedValue.id);
					// 			let roleId = JSON.parse(data[parsedValue.rootIndex].value)?.id;
					// 			let respUserIds = await getUsersFromClasses(classIds, roleId);
					// 			userIds = [...userIds, ...respUserIds as any];
					// 		} else if (parsedValue.level === "class") {
					// 			let respUserIds: any[] = [];
					// 			let roleId = JSON.parse(data[parsedValue.rootIndex].value)?.id;
					// 			let students = await integration.getUserByRoleAndClassInfo(roleId, parsedValue.id, null);
					// 			respUserIds = [...respUserIds, ...students.items.map((item: any) => item.id)];
					// 			let nextToken = students.nextToken;
					// 			while (nextToken != null) {
					// 				let temp = await integration.getUserByRoleAndClassInfo(roleId, parsedValue.id, nextToken);
					// 				nextToken = temp.nextToken;
					// 				respUserIds = [...respUserIds, ...temp.items.map((item: any) => item.id)]
					// 			}
					// 			userIds = [...userIds, ...respUserIds as any];
					// 		}
					// 	}
					// }
				})
				resolve(userIds);
			})
		}
		const handleCreateConversation = async () => {
			try {
				setBtnLoading(true)
				await store.create();
				let tenantId = await store.get(TENANT_ID);
				let userId = await store.get(CACHE_USER_LOGIN_ID);
				console.log( "handleCreateConversation groupAdministrators ", groupAdministrators);
				if (groupAdministrators.length === 1) {
					let parsedValue = JSON.parse(groupAdministrators[0]);
					let conversationId = uuid();
					console.log(parsedValue.id);
					const resp = await integration.createConversationInfo(conversationId, "member_to_member",parsedValue.id, userId);
					
					resp.receiptUser = [parsedValue.data];
					console.log("handleCreateConversation is conversation new " , resp.id === conversationId);

					if(resp.id === conversationId){
						resp.messages = {items:[]};    
					}    
					console.log("handleCreateConversation resp " , resp);

					await store.set(resp.id,{item:resp, isNew: resp.id === conversationId})
					
					console.log("handleCreateConversation" , resp);
					history.push(`/messaging/${resp.id}`)
				}else if(groupAdministrators.length > 1){
					let groupName = "";
					groupAdministrators.map((member:any)=>{
						let parsedValue = JSON.parse(member);
						groupName += `${parsedValue.label}, `;
					})
					if(groupName?.length > 50){
						groupName = `${groupName.substr(0, 30)} [...]`;
					}
					let memberIds:any = await extractUserIds(groupAdministrators);
					let groupId = uuid();
					console.log( "CreateConversation memberIds ", memberIds);
					let promises  = [];
					let newGroup = await integration.createGroupInfo(groupId, groupName, memberIds, [userId],userId);
					let newConversation:any = await integration.createConversationInfo(uuid(), "member_to_group", groupId, userId );
					

					newConversation.receiptGroup = newGroup;
					await store.set(newConversation.id,newConversation)
					console.log("handleCreateConversation group" , newConversation);

					history.push(`/messaging/${newConversation.id}`)
					
          			// // console.log("::newGroup::", newGroup);
					// console.log("::", memberIds, "::");
				}else{
					present({
						message: "Please select a contact",
						buttons: [
						{ text: "OK", handler: (d) => console.log("ok pressed") },
		
						],
					});
				}
				//await fetchConversation(null,userId, tenantId);
				cascaderRef.current.close();
				setCascadeValue([])
				//fetchGroups();
			} catch (err) {
				console.log(err);
			} finally {
				setBtnLoading(false)
			}
		}
		function _parseJSON(str: string) {
			try {
				return JSON.parse(str);
			} catch (e) {
				return null;
			}
		}
		const CaseCaderFooter = (props: any) => {
			return (
				<>
					<Button
						color='green'
						size='md'
						style={{ width: "100%" }}
						onClick={()=>props.handleCreateConversation()}
						disabled={btnLoading}
					>
						{btnLoading ? <IonSpinner color="#fff"/> : "SEND MESSAGE"}
					</Button>
				</>
			)
		}
		// useEffect(() => {
		// 	if ((groupInfo?.groupAdminUsers?.length > 0 || groupInfo?.groupMembers?.length > 0) && data.length > 0) {
		// 		let defaultAdminsTemp: any[] = [];
		// 		let defaultMembersTemp: any[] = [];
		// 		data.map((role: any) => {
		// 			role.children.map((grade: any) => {
		// 				let _json = _parseJSON(grade.value);
		// 				if (_json) {
		// 					if (_json.level === "student") {
		// 						if (groupInfo?.groupMembers?.includes(_json.id)) {
		// 							defaultMembersTemp.push(JSON.stringify({ id: _json.id, level: "student", index: _json.index, label: _json.label, rootIndex: _json.rootIndex }))
		// 						}
		// 						if (groupInfo?.groupAdminUsers?.includes(_json.id)) {
		// 							defaultAdminsTemp.push(JSON.stringify({ id: _json.id, level: "student", index: _json.index, label: _json.label, rootIndex: _json.rootIndex }))
		// 						}
		// 					} else {
		// 						if (Array.isArray(grade.children)) {
		// 							grade.children.map((cls: any) => {
		// 								if (Array.isArray(cls.children)) {
		// 									cls.children.map((student: any) => {
		// 										let _json = _parseJSON(student.value);
		// 										if (_json) {
		// 											if (groupInfo?.groupMembers?.includes(_json.id)) {
		// 												defaultMembersTemp.push(JSON.stringify({ id: _json.id, level: "student", index: _json.index, label: _json.label, rootIndex: _json.rootIndex }))
		// 											}
		// 										}
		// 									})
		// 								}
		// 							})
		// 						}
		// 					}
		// 				}
		// 			})
		// 		})
		// 		if (defaultAdminsTemp.length > 0) {
		// 			setDefaultAdmins([...defaultAdminsTemp]);
		// 			if (defaultAdminsTemp.length !== defaultAdmins.length) {
		// 				setAdminKey(`admin-${Date.now()}`)
		// 			}
		// 		}
		// 		if (defaultMembersTemp.length > 0) {
		// 			setDefaultMembers([...defaultMembersTemp]);
		// 			if (defaultMembersTemp.length !== defaultMembers.length) {
		// 				setMemberKey(`member-${Date.now()}`)
		// 			}
		// 		}
		// 	}
		// }, [data, groupInfo])

		return (
			<>
				<MultiCascader
					ref={cascaderRef}
					data={data}
					onChange={(value: any) => {
						setGroupAdministrators([...value]); setCascadeValue(value)}
					}
					onSelect={(value, activePath) => handleSelectAdmins(value, activePath)}
					onSearch={(event:any) => { console.log("onSeach event ", event) }} 
					onScroll={(event:any) => { console.log("onScroll event ", event) }} 
					// defaultValue={defaultAdmins}
					key={adminKey}
					value={cascadeValue}
					placeholder="+ New Message"
					renderExtraFooter={() => <CaseCaderFooter
						conversationName={conversationName}
						setConversationName={(value: string) => setConversationName(value)}
						handleCreateConversation={handleCreateConversation}
					/>}
				  uncheckableItemValues={uncheckableItems}
				/>
			</>
		);
	};
const mapStateToProps = (state: any) => ({
	groups: state.groups.groups
});
const mapDispatchToProps = {
	groupSetData,
	fetchGroups,
	fetchConversation
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateConversation);