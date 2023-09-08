import React, { useState, useEffect, useRef } from "react";
import {
  IonItem,
  IonText,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
  IonSpinner
} from "@ionic/react";
import { FlexboxGrid, MultiCascader, Button } from "rsuite";
import { close } from "ionicons/icons";
import Draggable from "react-draggable";
import useGetCacheTenantId from "../../../hooks/useGetCacheTenantId";

import "./newInvite.css";
import { Storage } from '@ionic/storage';
import {  TENANT_ID } from '../../../utils/StorageUtil';

//utils
import asyncForEach from "../../../utils/asyncForeach";
import * as integration from "scholarpresent-integration";
import { isNonNullChain } from "typescript";

const NewInvite: React.FC<{ open: boolean; closee: any; next: any }> = ({
  open,
  closee,
  next,
}) => {
  const store = new Storage();

  const cascaderRef = useRef<any>(null);
  const [data, setData] = useState<any>([]);
  const [roles, setRoles] = useState<any>([]);
  const [grades, setGrades] = useState<any>([]);
  const [teachers, setTeachers] = useState<any>([]);
  const [principals, setPrincipals] = useState<any>([]);
  const [otherStaffs, setOtherStaffs] = useState<any>([]);
  const [uncheckableItems, setUncheckableItems] = useState<any>([]);
  const [members, setMembers] = useState<any>([]);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  let tenantId:string = useGetCacheTenantId();

  const handleStartLoadingCascader = (value: any, level: number) => {
    if (level === 1) {
      data.map((item: any) => {
        if ((value.label === item.label) && item.children.length === 0) {
          item.children = [{
            "label": <IonSpinner name="dots" />
          }];
        }
      })
    } else if (level === 2) {
      data.map((item: any) => {
        item.children.map((child: any) => {
          if ((value.label === child.label) && child.children.length === 0) {
            child.children = [{
              "label": <IonSpinner name="dots" />
            }];
          }
        })
      })
    } else if (level === 3) {
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
    }
    setData([...data]);
  }
  const handleFetchRoles = async () => {
    try {
      let rolesArr: any[] = [];
      let _roles = await integration.getUserRoles();
      let roles = JSON.parse(_roles);
      rolesArr = [...rolesArr, ...roles.items];
      // let nextToken = roles.nextToken;
      // while (nextToken != null) {
      //   let temp = await integration.getUserRoles(nextToken);
      //   nextToken = temp.nextToken;
      //   rolesArr = [...rolesArr, ...temp.items]
      // }
      setRoles([...rolesArr]);

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
      setData([...rolesModified]);
      setUncheckableItems(uncheckableArr)
    } catch (err) {

    }
  }
  useEffect(() => {
    handleFetchRoles()
  }, [])
  const handleSelect = async (value: any, activePath: any) => {
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
      let i=0;
      while (nextToken != staff.totalNumberOfPages && nextToken < (staff.totalNumberOfPages -1)  ) {
        let temp = await integration.listUserByRole(value.id, nextToken);
        nextToken = temp.nextToken;
        staffArr = [...staffArr, ...temp.items]
        i=i+10;
      }
      if(value.label === "Teacher"){
        setTeachers([...staffArr])
      } else if (value.label === "Principal"){
        setPrincipals([...staffArr])
      } else{
        setOtherStaffs([...staffArr])
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
    } catch (err) {

    }
  }
  const handleFetchGrades = async (value: any, activePath: any) => {
    try {
      handleStartLoadingCascader(value, 1);
      let activePathJson = JSON.parse(activePath[0]?.value)
      let gradesArr: any[] = [];
      console.log("get grades...");
      let grades = await integration.getGrades(undefined);
      console.log("handleFetchGrades grades ", grades);
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
    } catch (err) {
    }
  }
  const handleFetchStudents = async (value: any, activePath: any) => {
    try {
      handleStartLoadingCascader(value, 3);
      let activePathJson = JSON.parse(activePath[0]?.value)
      value = JSON.parse(value.value)
      let roleId = JSON.parse(activePath[0]?.value).id;
      let classId = value.id;
      let studentsArr: any[] = [];
      let students = await integration.getUserByRoleAndClassInfo(roleId, classId,null);
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
    } catch (err) {
    }
  }
  const getUsersFromRole = async (roleId: string) => {
    await store.create();
		let tenantId = await store.get(TENANT_ID);
    
    return new Promise(async (resolve, reject) => {
      let userArr: any[] = [];
      let user = await integration.listUserByRole(roleId, null);
      userArr = [...userArr, ...user.items];
      let nextToken = user.nextToken;
      while (nextToken != null) {
        let temp = await integration.listUserByRole(roleId, nextToken);
        nextToken = temp.nextToken;
        userArr = [...userArr, ...temp.items]
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
        userIds = [...userIds, ...students.items];
        let nextToken = students.nextToken;
        while (nextToken != null) {
          let temp = await integration.getUserByRoleAndClassInfo(roleId, classId, nextToken);
          nextToken = temp.nextToken;
          userIds = [...userIds, ...temp.items]
        }
      })
      resolve(userIds);
    })
  }
  const extractUserIds = async (payload: any) => {
    return new Promise(async (resolve, reject) => {
      let users: any[] = [];
      await asyncForEach(payload, async (user: any) => {
        let parsedValue = JSON.parse(user);
        if (parsedValue.level === "student") {
          // users.push(parsedValue);
          const resp = await integration.findUsersById([parsedValue.id]);
          // if (Array.isArray(resp[0]?.items)) {
          //   users.push(resp[0]?.items[0]);
          // }
          if(resp[0]){
            users.push(resp[0]);
          }
        } else {
          if (["Teacher", "Other Staff", "Principal"].includes(parsedValue.label)) {
            let staffArr:any[] = [];
            if(parsedValue.label === "Teacher"){
              staffArr = [...teachers];
            } else if(parsedValue.label === "Principal"){
              staffArr = [...principals];
            } else{
              staffArr = [...otherStaffs];
            }
            // let staffArr = await getUsersFromRole(parsedValue.id);
            users = [...users, ...staffArr as any];
          } else {
            if (parsedValue.level === "role") {
              let parentOrStudentArr = await getUsersFromRole(parsedValue.id);
              users = [...users, ...parentOrStudentArr as any];
            } else if (parsedValue.level === "grade") {
              let classIds = await getClassesFromGrade(parsedValue.id);
              let roleId = JSON.parse(data[parsedValue.rootIndex].value)?.id;
              let respUserIds = await getUsersFromClasses(classIds, roleId);
              users = [...users, ...respUserIds as any];
            } else if (parsedValue.level === "class") {
              let respUserIds: any[] = [];
              let roleId = JSON.parse(data[parsedValue.rootIndex].value)?.id;
              let students = await integration.getUserByRoleAndClassInfo(roleId, parsedValue.id, null);
              respUserIds = [...respUserIds, ...students.items];
              let nextToken = students.nextToken;
              while (nextToken != null) {
                let temp = await integration.getUserByRoleAndClassInfo(roleId, parsedValue.id, nextToken);
                nextToken = temp.nextToken;
                respUserIds = [...respUserIds, ...temp.items]
              }
              users = [...users, ...respUserIds as any];
            }
          }
        }
      })
      resolve(users);
    })
  }
  const handleNext = async () => {
    try {
      setBtnLoading(true)
      let resp = await extractUserIds(members);
      closee();
      next(resp);
    } catch (err) {
      console.log(err);
    } finally {
      setBtnLoading(false)
    }
  }
  const CaseCaderFooter = (props: any) => {
    return (
        <Button
          color='green'
          size='md'
          style={{ width: "100%" }}
          onClick={()=>props.action()}
          disabled={btnLoading}
        >
          {btnLoading ? <IonSpinner color="#fff"/> : "DONE"}
        </Button>
    )
  }
  return (
    <Draggable defaultPosition={{ x: 0, y: 0 }} cancel=".drag-cancel">
      <IonItem
        lines="none"
        className="newInvite"
        style={{ display: open ? "block" : "none" }}
      >
        <FlexboxGrid style={{ flexDirection: "column", width: "100%" }}>
          <FlexboxGrid
            justify="space-between"
            style={{
              width: "100%",
              borderBottom: "1px solid #bbb",
              paddingBottom: 10,
            }}
          >
            <IonText
              style={{
                color: "#219653",
                fontSize: 21,
              }}
            >
              New Invitation
            </IonText>
            <IonIcon
              icon={close}
              style={{
                fontSize: 22,
                verticalAlign: "top",
                color: "#bf0000",
              }}
              onClick={closee}
              className="drag-cancel"
            />
          </FlexboxGrid>
          <IonRow className="groupModalInput">
            <IonCol>
              <FlexboxGrid className="">
                <FlexboxGrid.Item className="">
                  <IonText>Select people to invite</IonText>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <FlexboxGrid className="">
                <FlexboxGrid.Item className="">
                  <MultiCascader
                    ref={cascaderRef}
                    className="inviteCascader drag-cancel"
                    data={data}
                    onChange={(value: any) => setMembers([...value])}
                    onSelect={(value, activePath) => handleSelect(value, activePath)}
                    renderExtraFooter={() => <CaseCaderFooter
                      action={()=>cascaderRef.current.close()}
                    />}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </IonCol>
          </IonRow>
          <FlexboxGrid justify="end" style={{ width: "100%", marginTop: 20 }}>
            <FlexboxGrid.Item>
              <IonButton
                fill="outline"
                className="outlineBtn drag-cancel"
                color="success"
                onClick={closee}
              >
                Cancel
              </IonButton>
              <IonButton
                className="btn-green-popup drag-cancel"
                disabled={btnLoading || members?.length === 0}
                onClick={() => handleNext()}
              >
                {btnLoading ? <IonSpinner name="dots" /> : "Next"}
              </IonButton>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid>
      </IonItem>
    </Draggable>
  );
};

export default NewInvite;
