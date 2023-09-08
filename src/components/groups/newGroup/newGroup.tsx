import React, { useState, useEffect, useRef } from "react";
import { IonItem, IonText, IonButton, IonIcon, IonSpinner } from "@ionic/react";
import { folder, person, personAdd } from "ionicons/icons";
import "./newGroup.css";
import { FlexboxGrid, Input, MultiCascader, Button } from "rsuite";
import { v4 as uuid } from "uuid";
import Draggable from "react-draggable";


//redux
import { connect } from "react-redux";
import { groupSetData, fetchGroups, groupAddData } from "../../../stores/groups/actions";

//utils
import asyncForEach from "../../../utils/asyncForeach";
import useGetCacheTenantId from "../../../hooks/useGetCacheTenantId";

import { CACHE_USER_LOGIN_ID, TENANT_ID,getUserRoles } from '../../../utils/StorageUtil';
import { Storage } from '@ionic/storage';
import * as integration from "scholarpresent-integration";
import { fetchRoles } from "../../../stores/roles/actions";
const NewGroup: React.FC<{
  open: boolean;
  edit:boolean;
  close: any;
  save: any,
  fetchGroups: Function;
  groupInfo: any;
  groupAddData: Function;
}> = ({
  open,
  edit,
  close,
  save,
  fetchGroups,
  groupInfo,
  groupAddData
}) => {
    const store = new Storage();
    const cascaderRefAdmin = useRef<any>(null);
    const cascaderRefMember = useRef<any>(null);
    const [data, setData] = useState<any>([]);
    const [adminData, setAdminData] = useState<any>([]);

    const [roles, setRoles] = useState<any>([]);
    const [grades, setGrades] = useState<any>([]);
    const [uncheckableItems, setUncheckableItems] = useState<any>([]);
    const [groupName, setGroupName] = useState("");
    const [groupAdministrators, setGroupAdministrators] = useState<any>([]);
    const [groupMembers, setGroupMembers] = useState<any>([]);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [defaultAdmins, setDefaultAdmins] = useState<any>([]);
    const [adminKey, setAdminKey] = useState<any>(`admin-${Date.now()}`);
    const [defaultMembers, setDefaultMembers] = useState<any>([]);
    const [memberKey, setMemberKey] = useState<any>(`member-${Date.now()}`);
    let tenantId:string = useGetCacheTenantId();

    useEffect(() => {
      console.log(">>>> open ", open," data ", data);

      if (!open) {
        setGroupName("");
        setDefaultAdmins([]);
        setDefaultMembers([]);
        setAdminKey(`admin-${Date.now()}`)
        setMemberKey(`member-${Date.now()}`)
      }
    }, [open])

    useEffect(() => {
      console.log(">>>> edit ", edit)

      if (edit) {
        setGroupName("");
        setDefaultAdmins([]);
        setDefaultMembers([]);
        setAdminKey(`admin-${Date.now()}`)
        setMemberKey(`member-${Date.now()}`)
      }
    }, [edit])

    
    const handleStartLoadingCascader = (value: any, level: number, isAdmin:boolean) => {
      if (level === 1) {
        if(!isAdmin){
          data.map((item: any) => {
            if ((value.label === item.label) && item.children.length === 0) {
              item.children = [{
                "label": <IonSpinner name="dots" />
              }];
            }
          })
        }else{
          adminData.map((item: any) => {
            if ((value.label === item.label) && item.children.length === 0) {
              item.children = [{
                "label": <IonSpinner name="dots" />
              }];
            }
          })
        }
        
      } else if (level === 2) {
        if(!isAdmin){
          data.map((item: any) => {
            item.children.map((child: any) => {
              if ((value.label === child.label) && child.children.length === 0) {
                child.children = [{
                  "label": <IonSpinner name="dots" />
                }];
              }
            })
          })
        }else{
          adminData.map((item: any) => {
            item.children.map((child: any) => {
              if ((value.label === child.label) && child.children.length === 0) {
                child.children = [{
                  "label": <IonSpinner name="dots" />
                }];
              }
            })
          })
        }
      } else if (level === 3) {
        if(!isAdmin){
          data.map((item: any) => {
            item.children.map((child: any) => {
              child.children.map((ch: any) => {
                if ((value.label === ch.label)) {
                  ch.children = [{
                    "label": <IonSpinner name="dots" />
                  }];
                }
              })
            })
          })
        }else{
          adminData.map((item: any) => {
            item.children.map((child: any) => {
              child.children.map((ch: any) => {
                if ((value.label === ch.label)) {
                  ch.children = [{
                    "label": <IonSpinner name="dots" />
                  }];
                }
              })
            })
          })
        }
      }
      if(!isAdmin){
        setData([...data]);
      }else{
        setAdminData([...adminData])
      }
      
    }
    const handleFetchRoles = async () => {
      try {
        let rolesArr: any[] = [];
        let _roles = await getUserRoles();
        console.log("handleFetchRoles _roles ", _roles);
        let roles = JSON.parse(_roles)?.items;
        
        rolesArr =roles;
        
        
        setRoles( roles);

        let rolesModified: any[] = [];
        let uncheckableArr: any[] = [];
        rolesArr.map((role, i) => {
          rolesModified.push({
            value: JSON.stringify({ id: role.id, level: "role", index: i, label: role.roleName, rootIndex: i }),
            label: role.roleName,
            children: []
          })
          uncheckableArr.push(JSON.stringify({ id: role.id, level: "role", index: i, label: role.roleName, rootIndex: i }))
        })
        console.log("rolesModified ",rolesModified , " uncheckableArr ", uncheckableArr);
        setData([...rolesModified]);
        setAdminData([...rolesModified]);
        setUncheckableItems(uncheckableArr)
      } catch (err) {
        console.error("handleFetchRoles err ", err);
      }
    }
    useEffect(() => {
      handleFetchRoles()
    }, [])
    useEffect(() => {
    }, [data])
    const handleSelect = async (value: any, activePath: any, isAdmin:boolean) => {
      console.log("handleSelect value ",value," activePath ", activePath, " isAdmin ", isAdmin)
      switch (activePath.length) {
        case 1:
          if (["Parent", "Student"].includes(value.label))
            handleFetchGrades(value, activePath ,isAdmin )
          else
            handleFetchStaff(value, activePath, isAdmin)
          return;
        case 2:
          handleFetchClasses(value, activePath, isAdmin)
          return;
        case 3:
          handleFetchStudents(value, activePath, isAdmin)
          return;
      }
    }

    const handleFetchStaff = async (value: any, activePath: any, isAdmin:boolean) => {
      await store.create();
			let tenantId = await store.get(TENANT_ID);
      try {
        handleStartLoadingCascader(value, 1, isAdmin);
        let filteredUncheckableList = uncheckableItems.filter((item: any) => item !== value.value)
        value = JSON.parse(value.value)
        let activePathJson = JSON.parse(activePath[0]?.value)
        let staffArr: any[] = [];
        let staff = await integration.listUserByRole(value.id, null);

        staffArr = [...staffArr, ...staff.items];
        let nextToken = staff.nextToken;
        let i = 0;
        // while (nextToken != null && i < 100) {
        //   let temp = await integration.listUserByRole(tenantId,value.id, nextToken);
        //   nextToken = temp.nextToken;
        //   staffArr = [...staffArr, ...temp.items];
        //   i = i + 10;
        // }
        if(!isAdmin){
          setData((data: any) => {
            data.map((item: any) => {
              if ((value.label === item.label)) {
                item.children = [];
              }
            })
            let staffModified: any[] = [];
            staffArr.map((stf, i) => {
              staffModified.push({
                value: JSON.stringify({ id: stf.id, level: "student", index: i, label: `${stf.firstName} ${stf.lastName}`, rootIndex: activePathJson?.index }),
                label: `${stf.firstName} ${stf.lastName}`,
                children: []
              })
            })
            let flag = false;
  
            data.map((item: any) => {
              if ((value.label === item.label) && item.children.length === 0) {
                flag = true;
                item.children = staffModified;
              }
            })
            if (flag) {
              setUncheckableItems(filteredUncheckableList)
            }
            return [...data]
          })
        }else{
          setAdminData((data: any) => {
            data.map((item: any) => {
              if ((value.label === item.label)) {
                item.children = [];
              }
            })
            let staffModified: any[] = [];
            staffArr.map((stf, i) => {
              staffModified.push({
                value: JSON.stringify({ id: stf.id, level: "student", index: i, label: `${stf.firstName} ${stf.lastName}`, rootIndex: activePathJson?.index }),
                label: `${stf.firstName} ${stf.lastName}`,
                children: []
              })
            })
            let flag = false;
  
            data.map((item: any) => {
              if ((value.label === item.label) && item.children.length === 0) {
                flag = true;
                item.children = staffModified;
              }
            })
            if (flag) {
              setUncheckableItems(filteredUncheckableList)
            }
            return [...data]
          })
        }
        
      } catch (err) {
        console.log("err ", err)
      }
    }
    const handleFetchGrades = async (value: any, activePath: any, isAdmin:boolean) => {
      try {
        handleStartLoadingCascader(value, 1, isAdmin);
        let activePathJson = JSON.parse(activePath[0]?.value)
        let gradesArr: any[] = [];
        let grades = await integration.getGrades(null);
        console.log("handleFetchGrades grades ", grades);
        if(grades?.items){
          gradesArr = grades?.items;
        }
        
        // let nextToken = grades.nextToken;
        // while (nextToken != null) {
        //   let temp = await integration.getGrades(nextToken);
        //   nextToken = temp.nextToken;
        //   gradesArr = [...gradesArr, ...temp.items]
        // }
        if(!isAdmin){
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
                value: JSON.stringify({ id: grade.id, level: "grade", index: i, label: grade.gradeName, rootIndex: activePathJson.index }),
                label: grade.gradeName,
                children: []
              })
              uncheckableArr.push(JSON.stringify({ id: grade.id, level: "grade", index: i, label: grade.gradeName, rootIndex: activePathJson.index }))
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
        }else{
          setAdminData((data: any) => {
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
                value: JSON.stringify({ id: grade.id, level: "grade", index: i, label: grade.gradeName, rootIndex: activePathJson.index }),
                label: grade.gradeName,
                children: []
              })
              uncheckableArr.push(JSON.stringify({ id: grade.id, level: "grade", index: i, label: grade.gradeName, rootIndex: activePathJson.index }))
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
        }
      } catch (err) {
        console.log("err ", err)

      }
    }
    const handleFetchClasses = async (value: any, activePath: any, isAdmin:boolean) => {
      try {
        handleStartLoadingCascader(value, 2, isAdmin);
        let activePathJson = JSON.parse(activePath[0]?.value)
        value = JSON.parse(value.value)
        let classesArr: any[] = [];
        let classes = await integration.listClassNamesByGradeIdInfo(value.id,null);
        classesArr = [...classesArr, ...classes.items];
        let nextToken = classes.nextToken;
        while (nextToken != null) {
          let temp = await integration.listClassNamesByGradeIdInfo(value.id, nextToken);
          nextToken = temp.nextToken;
          classesArr = [...classesArr, ...temp.items]
        }
        if(!isAdmin){
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
                    value: JSON.stringify({ id: cls.id, level: "class", index: i, label: cls.className, rootIndex: activePathJson.index }),
                    label: cls.className,
                    children: []
                  })
                  uncheckableArr.push(JSON.stringify({ id: cls.id, level: "class", index: i, label: cls.className, rootIndex: activePathJson.index }))
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
        } else{
          setAdminData((data: any) => {
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
                value: JSON.stringify({ id: cls.id, level: "class", index: i, label: cls.className, rootIndex: activePathJson.index }),
                label: cls.className,
                children: []
              })
              uncheckableArr.push(JSON.stringify({ id: cls.id, level: "class", index: i, label: cls.className, rootIndex: activePathJson.index }))
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
        }
      } catch (err) {
      }
    }
    const handleFetchStudents = async (value: any, activePath: any, isAdmin:boolean) => {
      console.log("handleFetchStudents value ", value, " activePath ", activePath);
      try {
        handleStartLoadingCascader(value, 3, isAdmin);
        let activePathJson = JSON.parse(activePath[0]?.value)
        value = JSON.parse(value.value)
        let roleId = JSON.parse(activePath[0]?.value).id;
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
        if(!isAdmin){
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
                  value: JSON.stringify({ id: std.id, level: "student", index: i, label: `${std.firstName} ${std.lastName}`, rootIndex: activePathJson.index }),
                  label: `${std.firstName} ${std.lastName}`,
                  children: []
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
              if (flag) {
                if (studentsModified.length)
                  setUncheckableItems([]);
              }
              return [...data]
            })
        } else{
          setAdminData((data: any) => {
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
                value: JSON.stringify({ id: std.id, level: "student", index: i, label: `${std.firstName} ${std.lastName}`, rootIndex: activePathJson.index }),
                label: `${std.firstName} ${std.lastName}`,
                children: []
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
            if (flag) {
              if (studentsModified.length)
                setUncheckableItems([]);
            }
            return [...data]
          })
        }
      } catch (err) {
        console.log("error ", err)
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
        let totalNumberOfPages = user.totalNumberOfPages;
        let pageNumber = user.pageNumber;
        console.log("totalNumberOfPages ", totalNumberOfPages, " pageNumber ", pageNumber);
         while (!isEndOfPages(totalNumberOfPages, pageNumber)) {
           let temp = await integration.listUserByRole(
             roleId, nextToken);
             totalNumberOfPages = user.totalNumberOfPages;
             pageNumber = user.pageNumber;
             nextToken = user?.nextToken;
           userArr = [...userArr, ...temp.items.map((item: any) => item.id)]
        }
        console.log("userArr ", userArr);
        resolve(userArr);
      })
    }

    const isEndOfPages = (pageNumber:number, totalNumberOfPages:number) =>{
    
      return totalNumberOfPages === pageNumber;
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
          console.log("extractUserIds user ", user);
          if (parsedValue.level === "student") {
            userIds.push(parsedValue.id);
          } else {
            if (["Teacher", "Other Staff", "Principal"].includes(parsedValue.label)) {
              let staffArr = await getUsersFromRole(parsedValue.id);
              userIds = [...userIds, ...staffArr as any];
            } else {
              if (parsedValue.level === "role") {
                let parentOrStudentArr = await getUsersFromRole(parsedValue.id);
                userIds = [...userIds, ...parentOrStudentArr as any];
              } else if (parsedValue.level === "grade") {
                let classIds = await getClassesFromGrade(parsedValue.id);
                let roleId = JSON.parse(data[parsedValue.rootIndex].value)?.id;
                let respUserIds = await getUsersFromClasses(classIds, roleId);
                userIds = [...userIds, ...respUserIds as any];
              } else if (parsedValue.level === "class") {
                let respUserIds: any[] = [];
                let roleId = JSON.parse(data[parsedValue.rootIndex].value)?.id;
                let students = await integration.getUserByRoleAndClassInfo(roleId, parsedValue.id, null);
                respUserIds = [...respUserIds, ...students.items.map((item: any) => item.id)];
                let nextToken = students.nextToken;
                while (nextToken != null) {
                  let temp = await integration.getUserByRoleAndClassInfo(roleId, parsedValue.id, nextToken);
                  nextToken = temp.nextToken;
                  respUserIds = [...respUserIds, ...temp.items.map((item: any) => item.id)]
                }
                userIds = [...userIds, ...respUserIds as any];
              }
            }
          }
        })
        resolve(userIds);
      })
    }
    const handleCreateGroup = async (e:any) => {
      try {
        e.preventDefault();
        setBtnLoading(true)
        console.log("handleCreateGroup groupAdministrators ", groupAdministrators)
        console.log("handleCreateGroup groupMembers ", groupMembers)

        let adminPromise = extractUserIds(groupAdministrators);
        let memberPromise = extractUserIds(groupMembers);
        let values = await Promise.all([adminPromise, memberPromise])
        let adminUserIds = values[0] as any;
        let memberUserIds = values[1] as any;
        await store.create();
        let loginId = await store.get(CACHE_USER_LOGIN_ID);
        console.log("::loginId::", loginId);

        console.log("::", adminUserIds, memberUserIds, "::");
        await store.create();
        let tenantId = await store.get(TENANT_ID);
        if (edit) {
          let updatedGroup = await integration.updateGroupInfo(groupInfo?.id, groupName, memberUserIds, adminUserIds);
          console.log("::updatedGroup::", updatedGroup);
          setTimeout(()=>{
            fetchGroups();
          }, 2000)
        } else {

          let newGroup = await integration.createGroupInfo(uuid(), groupName, memberUserIds, adminUserIds, loginId);
          console.log("::newGroup::", newGroup);
          groupAddData(newGroup)
        }
        save(memberUserIds.length + adminUserIds.length);
        close();
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
            onClick={() => props.action()}
            disabled={btnLoading}
          >
            {btnLoading ? <IonSpinner color="#fff" /> : "DONE"}
          </Button>
        </>
      )
    }
    useEffect(() => {
      if (groupInfo?.id) {
        setGroupName(groupInfo.groupName)
        // setDefaultAdmins(Array.isArray(groupInfo.groupAdminUsers) ? groupInfo.groupAdminUsers : [])
        // setDefaultMembers(Array.isArray(groupInfo.groupMembers) ? groupInfo.groupMembers : [])
      }
    }, [groupInfo])
    useEffect(() => {
      if ((groupInfo?.groupAdminUsers?.length > 0 || groupInfo?.groupMembers?.length > 0) && data.length > 0) {
        let defaultAdminsTemp: any[] = [];
        let defaultMembersTemp: any[] = [];
        data.map((role: any) => {
          role.children.map((grade: any) => {
            let _json = _parseJSON(grade.value);
            if (_json) {
              if (_json.level === "student") {
                if (groupInfo?.groupMembers?.includes(_json.id)) {
                  defaultMembersTemp.push(JSON.stringify({ id: _json.id, level: "student", index: _json.index, label: _json.label, rootIndex: _json.rootIndex }))
                }
                if (groupInfo?.groupAdminUsers?.includes(_json.id)) {
                  defaultAdminsTemp.push(JSON.stringify({ id: _json.id, level: "student", index: _json.index, label: _json.label, rootIndex: _json.rootIndex }))
                }
              } else {
                if (Array.isArray(grade.children)) {
                  grade.children.map((cls: any) => {
                    if (Array.isArray(cls.children)) {
                      cls.children.map((student: any) => {
                        let _json = _parseJSON(student.value);
                        if (_json) {
                          if (groupInfo?.groupMembers?.includes(_json.id)) {
                            defaultMembersTemp.push(JSON.stringify({ id: _json.id, level: "student", index: _json.index, label: _json.label, rootIndex: _json.rootIndex }))
                          }
                        }
                      })
                    }
                  })
                }
              }
            }
          })
        })
        if (defaultAdminsTemp.length > 0) {
          setDefaultAdmins([...defaultAdminsTemp]);
          if (defaultAdminsTemp.length !== defaultAdmins.length) {
            setAdminKey(`admin-${Date.now()}`)
          }
        }
        if (defaultMembersTemp.length > 0) {
          setDefaultMembers([...defaultMembersTemp]);
          if (defaultMembersTemp.length !== defaultMembers.length) {
            setMemberKey(`member-${Date.now()}`)
          }
        }
      }
    }, [data, groupInfo])
    return (
      <Draggable defaultPosition={{ x: 0, y: 0 }} cancel=".drag-cancel">
        <IonItem
          lines="none"
          className="newGroup"
          style={{ display: open ? "block" : "none" }}
        >
        <form action="" onSubmit={handleCreateGroup}>

          <FlexboxGrid style={{ flexDirection: "column", width: "100%" }}>
            <IonText className="newGroupHead">{!edit? "Create a New Group": "Edit a Group"}</IonText>
            <FlexboxGrid className="groupModalInput">
              <FlexboxGrid.Item className="groupModalInputInner">
                <IonText>Name your Group</IonText>
                <Input 
                  placeholder="Type here" 
                  value={groupName} 
                  onChange={(value) => setGroupName(value)} 
                  className="drag-cancel"
                  required
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginTop: 20 }}>
                <IonIcon
                  icon={folder}
                  style={{
                    fontSize: 22,
                    verticalAlign: "middle",
                    color: "#219653",
                  }}
                  className="hide-mob"
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
            
            <FlexboxGrid className="groupModalInput">
              <FlexboxGrid.Item className="groupModalInputInner">
                <IonText>Add Group Members</IonText>
                <MultiCascader
                  className="drag-cancel"
                  ref={cascaderRefMember}
                  data={data}
                  onChange={(value: any) => setGroupMembers([...value])}
                  onSelect={(value, activePath) => handleSelect(value, activePath, false )}
                  defaultValue={defaultMembers}
                  key={memberKey}
                  renderExtraFooter={() => <CaseCaderFooter
                    action={() => cascaderRefMember.current.close()}
                  />}
                  //uncheckableItemValues={uncheckableItems}
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginTop: 20 }}>
                <IonIcon
                  icon={personAdd}
                  style={{
                    fontSize: 22,
                    verticalAlign: "middle",
                    color: "#219653",
                  }}
                  className="hide-mob"
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid className="groupModalInput">
              <FlexboxGrid.Item className="groupModalInputInner">
                <IonText>Add Group administrators</IonText>
                <MultiCascader
                  className="drag-cancel"
                  ref={cascaderRefAdmin}
                  data={adminData}
                  onChange={(value: any) => setGroupAdministrators([...value])}
                  onSelect={(value, activePath) => handleSelect(value, activePath, true)}
                  defaultValue={defaultAdmins}
                  key={adminKey}
                  renderExtraFooter={() => <CaseCaderFooter
                    action={() => cascaderRefAdmin.current.close()}
                  />}
                // uncheckableItemValues={uncheckableItems}
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginTop: 20 }}>
                <IonIcon
                  icon={person}
                  style={{
                    fontSize: 22,
                    verticalAlign: "middle",
                    color: "#219653",
                  }}
                  className="hide-mob"
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="end" style={{ width: "100%", marginTop: 20 }}>
              <FlexboxGrid.Item>
                <IonButton
                  fill="outline"
                  className="outlineBtn drag-cancel"
                  color="success"
                  onClick={close}
                >
                  Cancel
                </IonButton>
                <IonButton
                  className="btn-green-popup drag-cancel"
                  type="submit"
                  disabled={btnLoading}
                >
                  {btnLoading ? <IonSpinner name="dots" /> : "Save"}
                </IonButton>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid>
        </form>
        </IonItem>
      </Draggable>
    );
  };
const mapStateToProps = (state: any) => ({
  groups: state.groups.groups
});
const mapDispatchToProps = {
  groupSetData,
  fetchGroups,
  groupAddData
};
export default connect(mapStateToProps, mapDispatchToProps)(NewGroup);