import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonText,
  IonButton,
  IonIcon,
  IonImg,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  useIonAlert
} from "@ionic/react";
import Draggable from "react-draggable";
import { FlexboxGrid, Progress, Input, SelectPicker,  } from "rsuite";
import { close } from "ionicons/icons";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";

// import SuccessImg from "../../../assets/Success.png";
import "./joinRequest.css";
import {
  getRoleId
} from "../../utils/StorageUtil";
import { Storage } from "@ionic/storage";

import * as integration from "scholarpresent-integration";
const SendInvitations: React.FC<{ open: boolean; closee: any; item: any, onUpdate: Function; }> = ({
  open,
  closee,
  item,
  onUpdate
}) => {
  const { Line } = Progress;
  const store = new Storage();
  const [btnLoading, setBtnLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [selectLinkToUser, setSelectLinkToUser] = useState<any>();
  const [present] = useIonAlert();

  
  useEffect(() => {
     getRoleId(item?.requestRole).then(value=>item['userRoleId']=value)
  }, []);
  
  const getData = (id: string): Record<string, any>[] => {
    console.log("getData id ", id, " data ", data);

    return data[id];
  };
  const searchUserByFirstOrLastName = async (
    requestId: any,
    searchText: string,
    requestRole: string
  ) => {
    console.log(
      "searchUserByFirstOrLastName searchText ",
      searchText,
      " requestRole ",
      requestRole
    );
    if (requestRole === "Parent") {
      requestRole = "Student";
    }
    const result = await integration.searchUserByFirstOrLastName(
      null,
      searchText,
      requestRole
    );
    console.log("searchUserByFirstOrLastName result ", result);
    let usersArr = result?.items;
    let usersModified: any[] = [];
    usersArr.map((user: any, i: any) => {
      let label =
        (user?.className !== null ? user?.className + ">" : "") +
        user?.firstName +
        " " +
        user?.lastName;
      usersModified.push({
        value: JSON.stringify({
          id: user.id,
          level: "user",
          index: i,
          label: user,
          rootIndex: i,
        }),
        label,
        role: user?.roleName,
        //children: []
      });
    });
    let temp: any = {};
    temp[requestId] = [...usersModified];
    setData({ ...data, ...temp });
  };
  const renderMenu = (menu: any) => {
    if (data.length === 0) {
      return (
        <p style={{ padding: 4, color: "#999", textAlign: "center" }}>
          <SpinnerIcon spin /> Loading...
        </p>
      );
    }
    return menu;
  };
  const compare = (a: any, b: any) => {
    let nameA = a.toUpperCase();
    let nameB = b.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  };
  const joinRequestParentView = () => {
    return (
      <>
      <IonRow>
        {/* <IonText className="PopupHeader"> */}
        Link to :{" "}
                {/* </IonText> */}
         <SelectPicker
            block
            data={getData(item?.id)}
            placement="rightStart"
            style={{ width: 300, borderColor: "#f00" }}
            placeholder ={"Searching " + item?.requestRole + " " + item.childLastName}

            groupBy="role"
            onOpen={async () =>
              searchUserByFirstOrLastName(
                item?.id,
                item.childLastName,
                item?.requestRole
              )
            }
            onSearch={(value: any) => {
              if(value?.length > 2){
                searchUserByFirstOrLastName(
                  item?.id,
                  value,
                  item?.requestRole
                ).then((value) => {});
              }
              
            }}
            onSelect={(value,item, event)=>{
              console.log("onSelect value ", value);
              console.log("onSelect JSON.parse(value)?.label ", JSON.parse(value)?.label);

              setSelectLinkToUser(JSON.parse(value)?.label)
            }}
            sort={(isGroup) => {
              if (isGroup) {
                return (a, b) => {
                  return compare(a.groupTitle, b.groupTitle);
                };
              }

              return (a, b) => {
                return compare(a.value, b.value);
              };
            }}
            renderMenu={renderMenu}
          />
        </IonRow>  
        <IonRow>
          <IonCol>
                <IonText className="PopupHeader">
                </IonText>
          </IonCol>
        </IonRow> 
        <IonRow>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="First Name"
              value={item?.firstName}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable" id="staffFirstName">
              Parent First Name{" "}
            </IonText>
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Last Name"
              value={item?.lastName}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable" id="staffLastName">
              Parent Last Name{" "}
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className="StaffPhoneEmail">
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Phone"
              type="text"
              value={item.contactPhone}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable">Parent Phone </IonText>
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Email"
              value={item.contactEmail}
              className="drag-cancel"
              type="email"
            />
            <IonText className="PopupLable">Parent Email </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
                <IonText className="PopupHeader">
                </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="First Name"
              value={item?.childFirstName}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable" id="staffFirstName">
              Child First Name{" "}
            </IonText>
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Last Name"
              value={item?.childLastName}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable" id="staffLastName">
              Child Last Name{" "}
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="First Name"
              value={item?.childGrade}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable" id="staffFirstName">
              Grade{" "}
            </IonText>
          </IonCol>
        </IonRow>
        
        
      </>
    );
  };

  const joinRequestTeacherView = () => {
    return (
      <>
      <IonRow>
        <IonText className="PopupHeader">
        Link to :{" "}
                </IonText>
        <SelectPicker
            block
            placement="rightStart"
            data={getData(item?.id)}
            style={{ width: 300, borderColor: "#f00" }}
            placeholder ={"Searching " +item?.requestRole + " " + item.lastName}
            groupBy="role"
            onOpen={async () =>{
                console.log("item ", item);
                searchUserByFirstOrLastName(
                  item?.id,
                  item.lastName,
                  item?.requestRole
                )
              }
            }
            onSearch={(value: any) => {
              if(value?.length > 2){
                searchUserByFirstOrLastName(
                  item?.id,
                  value,
                  item?.requestRole
                ).then((value) => {});
              }
            }}
            sort={(isGroup) => {
              if (isGroup) {
                return (a, b) => {
                  return compare(a.groupTitle, b.groupTitle);
                };
              }

              return (a, b) => {
                return compare(a.value, b.value);
              };
            }}
            onSelect={(value,item, event)=>{
              console.log("onSelect value ", value);
              console.log("onSelect JSON.parse(value)?.label ", JSON.parse(value)?.label);

              setSelectLinkToUser(JSON.parse(value)?.label)
            }}
            renderMenu={renderMenu}
          />
        </IonRow>
      <IonRow>
          <IonCol>
                <IonText className="PopupHeader">
                  {item?.requestRole} Info
                </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="First Name"
              value={item?.firstName}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable" id="staffFirstName">
               First Name{" "}
            </IonText>
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Last Name"
              value={item?.lastName}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable" id="staffLastName">
               Last Name{" "}
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className="StaffPhoneEmail">
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Phone"
              type="text"
              value={item.contactPhone}
              disabled
              className="drag-cancel"
            />
            <IonText className="PopupLable"> Phone </IonText>
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Email"
              value={item.contactEmail}
              className="drag-cancel"
              type="email"
            />
            <IonText className="PopupLable"> Email </IonText>
          </IonCol>
        </IonRow>
        
        
      </>
    );
  };
  useEffect(() => {
    console.log("item ", item, " selectLinkToUser ", selectLinkToUser );
  }, [item, selectLinkToUser]);
  
  return (
    <Draggable defaultPosition={{ x: 0, y: 0 }} cancel=".drag-cancel">

    <IonItem
      lines="none"
      className="NewStaff"
      style={{ display: open ? "block" : "none" }}
    >
      <IonGrid>
        <IonRow>
          <IonCol>
            <FlexboxGrid>
              <FlexboxGrid.Item>
                <IonText className="PopupHeader">Join Request</IonText>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                    <IonIcon
                      icon={close}
                      style={{
                        fontSize: 22,
                        verticalAlign: "top",
                        color: "#f00",
                      }}
                      onClick={closee}
                      className="drag-cancel"
                    />
                  </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>

        {item?.requestRole ==="Parent" ?joinRequestParentView():joinRequestTeacherView() }

        <IonRow>
          <IonCol>
            <FlexboxGrid justify="end">
              <FlexboxGrid.Item>
                <IonButton
                  fill="outline"
                  className="outlineBtn drag-cancel"
                  color="success"
                  onClick={closee}
                >
                  Cancel
                </IonButton>
                <IonButton className="btn-green-popup " type="button"
                  onClick={async(event:any)=>{
                    console.log("selectLinkToUser ", selectLinkToUser)
                    if(!selectLinkToUser?.id && item?.requestRole ==="Parent"){
                      present({
                        message: "Select the learner to linked to proceed",
                        buttons: [
                        { text: "OK", handler: (d) => console.log("ok pressed") },
                
                        ],
                      });
                      return;
                    }

                    setBtnLoading(true)
                    
                    await integration.respondJoinRequestInfo(item,selectLinkToUser,"accept" );
                    setBtnLoading(false)
                    present({
                      message: "Successful executed",
                      buttons: [
                      { text: "OK", handler: (d) => console.log("ok pressed") },
              
                      ],
                    });
                    onUpdate();
                    closee();

                  }}
                >
                  {btnLoading ? <IonSpinner name="dots" /> : "Save"}
                  
                </IonButton>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
    </Draggable>

  );
};

export default SendInvitations;
