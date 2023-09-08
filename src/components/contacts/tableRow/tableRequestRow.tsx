import React, { useEffect, useState, useRef } from "react";
import { IonRow, IonCol, IonIcon, IonButton, IonCheckbox, IonText, useIonAlert, IonImg, IonSpinner } from "@ionic/react";
import { book, add, chevronDown, chevronUp, mail, checkmark, pencil, closeOutline,checkboxOutline } from "ionicons/icons";
import { FlexboxGrid, Cascader, Button, SelectPicker, InputGroup  } from "rsuite";
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import * as integration from "scholarpresent-integration";

import TableInnerRow from "../tableInnerRow/tableInnerRow";
import JoinRequest from "../../joinrequest/joinRequest";

import "./tableRow.css";

import {
    CACHE_USER_LOGIN_ID,
    TENANT_ID,
    TENANT_NAME,
    CACHE_USER_LOGIN_ROLE_NAME,CACHE_USER_PROFILE_FULL_NAME

} from "../../../utils/StorageUtil";

import {
    getContactDetails

} from "../../../utils/Utils";
import { Storage } from "@ionic/storage";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
//redux
import { connect } from "react-redux";

const TableRow: React.FC<{
    isTab: string;
    item: any;
    onSelect: Function;
    onPageReload: Function;
    selectedContacts: any[];
    roles: any[];
    onSetStaff: any;
    onSetLearner: any;
}> = ({ isTab, item, roles, onSelect, onPageReload , selectedContacts, onSetStaff, onSetLearner }) => {
    const history = useHistory();
    const store = new Storage();
    const [present] = useIonAlert();
    const [open, setOpen] = useState(false);
    const [parentDetails, setParentDetails] = useState<any>([]);
    const [parentLoading, setParentLoading] = useState<boolean>(false);
    const [userLogonRoleName, setUserLogonRoleName] = useState<string>("Parent");
    const cascaderRef = useRef<any>(null);
    const [data, setData] = useState<any>([]);
    const [members, setMembers] = useState<any>([]);
    const [uncheckableItems, setUncheckableItems] = useState<any>([]);
    const [teachers, setTeachers] = useState<any>([]);
    const [principals, setPrincipals] = useState<any>([]);
    const [otherStaffs, setOtherStaffs] = useState<any>([]);
    const [grades, setGrades] = useState<any>([]);  
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [openAcceptJoinRequest, setOpenAcceptJoinRequest] = useState<boolean>(false);

    
    const fetchParentInfo = async (id: string) => {
        try {
            console.log("***** fetchParentInfo id ", id);
            console.log("***** fetchParentInfo item ", item);

            setParentLoading(true);
            console.log("***** fetchParentInfo *****");
            let parentInfo = null;
            try{
                parentInfo = await integration.getLearnerAndParentInfo(id);
            }catch(error){
                console.error("fetchParentInfo error ", error)
            }
            console.log("***** fetchParentInfo parentInfo ", parentInfo);
            if (Array.isArray(parentInfo?.items) && parentInfo?.items.length > 0 ) {
                parentInfo.items.map(async (parent: any) => {
                    console.log("***** fetchParentInfo parent ", parent);

                    parent.grade = parent.grade;
                    parent.className = parent?.className || "N/A";
                });
                setParentDetails(parentInfo.items);
            
                // if (Array.isArray(parentInfo.items[0]?.linkedUser?.items)) {
                //     if (parentInfo.items[0]?.linkedUser?.items.length) {
                //         parentInfo.items[0]?.linkedUser?.items.map(async (parent: any) => {
                //             parent.grade = getGrade(item?.className?.gradeID);
                //             parent.className = item?.className?.className || "N/A";
                //         });
                //         setParentDetails(parentInfo.items[0]?.linkedUser?.items);
                //     }
                // }
            }
        } catch (err) {
        } finally {
            setParentLoading(false);
        }
    };
    const isParentOrStudentView = () => {
        return userLogonRoleName === "Student" || userLogonRoleName === "Parent";
    };

    const handleUserRole = async () => {
        await store.create();
        setUserLogonRoleName(await store.get(CACHE_USER_LOGIN_ROLE_NAME));
    };

    const getRole = () => {
        if (item?.roleName) {
            return item?.roleName;
        } else {
            let filteredRole = roles.filter((role: any) => role.id === item.userRoleId);
            if (filteredRole.length) {
                return filteredRole[0]?.roleName;
            }
        }
    };

    const getData = (id:string):Record<string, any>[] => {
        console.log("getData id ", id , " data ", data);

        return data[id];
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
      const CaseCaderFooter = (props: any) => {
        return (
            <Button
              color='green'
              size='md'
              style={{ width: "100%" }}
              onClick={()=>props.action()}
              disabled={btnLoading}
            >
              {btnLoading ? <IonSpinner color="#fff"/> : "Accept"}
            </Button>
        )
      }

      const renderMenu = (menu:any) => {
        if (data.length === 0) {
          return (
            <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
              <SpinnerIcon spin /> Loading...
            </p>
          );
        }
        return menu;
      };

    useEffect(() => {
        handleUserRole();
        if (open) {
            fetchParentInfo(item?.id);
        } else {
            setParentDetails([]);
        }
    }, [open]);
    useEffect(() => {}, [userLogonRoleName, parentDetails]);
    const isChecked = selectedContacts.filter((grp: any) => grp.id === item.id).length ? true : false;
    const compare=(a:any, b:any)=> {
        let nameA = a.toUpperCase();
        let nameB = b.toUpperCase();
      
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
    

    const onUpdate = ()=>{
      onPageReload()
    }
    return (
        <> 
        <FlexboxGrid justify="start">
            <FlexboxGrid
                className="table-body"
                onClick={(event:any) => {
                    let tagName = JSON.stringify(event.target.tagName);
                    tagName = tagName?  tagName.toLowerCase() :tagName;
                    console.log("event.target.tagName ", tagName )

                    if(tagName.indexOf("div") > 0 || tagName.indexOf("ion-text") > 0  || (tagName.indexOf("button")< -1 && tagName.indexOf("span") ) ){
                        if (!isParentOrStudentView()) {
                            setOpen(!open);
                        }
                    }

                    
                }}
                style={{ cursor: !isParentOrStudentView() ? "pointer" : "" }}
            >
              <FlexboxGrid.Item className="tableRowCol grade-column">
                    <IonText>{item?.requestRole}</IonText>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item className="tableRowCol grade-column">
                    <IonText>{item.firstName}</IonText>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item className="tableRowCol grade-column">{item.lastName}</FlexboxGrid.Item>
                <FlexboxGrid.Item className="tableRowCol grade-column">
                    Grade {item?.childGrade || "N/A"}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item className="tableRowCol phone-column">
                    {item.contactPhone}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item className="tableRowCol phone-column">
                    {item.contactEmail}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item
                    fill="outline"
                    className="outlineBtn btn-send"
                >
                    <JoinRequest
                      open={openAcceptJoinRequest}
                      closee={() => {
                        setOpenAcceptJoinRequest(!openAcceptJoinRequest);
                      }}
                      item={item}
                      onUpdate={()=>{onPageReload()}}
                    />                    
                    <IonButton
                                    fill="outline"
                                    className="outlineBtn btn-send"
                                    onClick={() => setOpenAcceptJoinRequest(!openAcceptJoinRequest)}
                                >
                                    <IonIcon icon={checkboxOutline} className="sendIcon" />
                                    <span>Accept</span>
                                </IonButton>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item
                    fill="outline"
                    className="outlineBtn btn-send"
                >            
                    <IonButton
                                    fill="outline"
                                    className="outlineBtn btn-send"
                                    onClick={async(event:any)=>{
                    
                                      await integration.respondJoinRequestInfo(item,undefined,"reject" )
                                      onUpdate()

                                    }}
                                >
                                    <IonIcon icon={closeOutline} className="sendIcon" />
                                    <span>Reject</span>
                                </IonButton>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </FlexboxGrid>
        
    </>
    );
};

const mapStateToProps = (state: any) => ({
    grades: state.grades.grades,
    roles: state.roles.roles,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(TableRow);
