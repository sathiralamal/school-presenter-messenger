import React, { useState, useEffect } from "react";
import {
  IonItem,
  // IonCheckbox,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonButton,
  IonIcon,
  IonSpinner,
  useIonAlert
} from "@ionic/react";
import { chevronDownOutline, searchOutline, close, add } from "ionicons/icons";
import "./StaffsToGroup.css";
import { Input, FlexboxGrid, Toggle, Checkbox } from "rsuite";
import Swal from "sweetalert2";
import { v4 as uuid } from "uuid";
//redux
import { connect } from "react-redux";
import { fetchGroups } from "../../../stores/groups/actions";

import { Storage } from "@ionic/storage";
import { TENANT_ID } from "../../../utils/StorageUtil";

import * as integration from "scholarpresent-integration";
const StaffsToGroup: React.FC<{
  open: boolean;
  closee: any;
  fetchGroups: Function;
  groups: any;
  staff: any;
}> = ({ open, closee, fetchGroups, groups, staff }) => {
  const store = new Storage();
  const [add, setAdd] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [groupsDup, setGroupsDup] = useState<any[]>([]);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<any[]>([]);
  const [present] = useIonAlert();

  useEffect(() => {
    fetchGroups();
  }, []);
  useEffect(() => {
    if(groups?.items){
      setGroupsDup([...groups.items]);
    }
  }, [groups]);
  useEffect(() => {
    if (searchText.length >= 3) {
      let filteredGroups;
      if(groups?.filter){
        filteredGroups = groups?.filter((group: any) =>
          group.groupName.toLowerCase().includes(searchText.toLocaleLowerCase())
        );
        setGroupsDup(filteredGroups);
      }
    } else {
      setGroupsDup(groups);
    }
  }, [searchText]);
  const handleCreateGroup = async () => {
    try {
      setBtnLoading(true);
      await store.create();
      let tenantId = await store.get(TENANT_ID);
      const groupInfo = await integration.createGroupInfo(
        uuid(),
        searchText,
        [],
        [], null
      );
      console.log(groupInfo);
      setSearchText("");
      fetchGroups();
    } catch (err) {
    } finally {
      setBtnLoading(false);
    }
  };
  const handleSelectGroup = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedGroup((grps: any) => {
        let groupsArr: any[] = [...grps];
        let filteredGroups = grps.filter((grp: any) => grp.id === value);
        if (!filteredGroups.length) {
          groupsArr.push({ id: value, role: "member" });
        }
        return groupsArr;
      });
    } else {
      setSelectedGroup((grps: any) => {
        let filteredGroups = grps.filter((group: any) => group.id !== value);
        return filteredGroups;
      });
    }
  };
  const handleChangeRole = (value: string, role: string) => {
    let index = selectedGroup.findIndex(grp => grp.id === value);
    if (index > -1) {
      selectedGroup[index].role = role;
      setSelectedGroup([...selectedGroup])
    }
  }
  const handleSubmit = async () => {
    try {
      setBtnLoading(true);
      let promises:any[] = [];
      selectedGroup.map((item:any)=>{
        if(item.role === "member"){
          promises.push(integration.addGroupMemberInfo(item.id, [staff.id]));
        }else{
          promises.push(integration.addGroupAdminMemberInfo(item.id, [staff.id]));
        }
      })
      let response = await Promise.all(promises);
      console.log(response);
      closee();
      
      present({
        message: "Staff created successfully",
        buttons: [
        { text: "OK", handler: (d) => console.log("ok pressed") },

        ],
      });
    } catch (err) {

    } finally {
      setBtnLoading(false);
    }
  }
  return (
    <IonItem
      lines="none"
      className="StaffsToGroup"
      style={{ display: open ? "block" : "none" }}
    >
      <IonGrid>
        <IonRow>
          <IonCol>
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item>
                <IonText className="PopupHeader">
                  Add Staff Member To Groups
                </IonText>
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
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <IonRow className="selectGroupWrapper">
              <IonCol>
                <IonRow
                  onClick={() => {
                    setAdd(!add);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FlexboxGrid className="selectGroup">
                    <IonText style={{ display: "flex", flex: 1 }}>
                      Select Group
                    </IonText>
                    <IonIcon
                      icon={chevronDownOutline}
                      style={{
                        fontSize: 22,
                        verticalAlign: "top",
                        color: "#222",
                      }}
                    />
                  </FlexboxGrid>
                </IonRow>
                {add && (
                  <>
                    <IonRow>
                      <FlexboxGrid className="searchGroup">
                        <Input
                          className="searchGroupBorder"
                          placeholder="Search"
                          value={searchText}
                          onChange={(value) => setSearchText(value)}
                        />
                        <IonIcon
                          icon={searchOutline}
                          style={{
                            fontSize: 22,
                            verticalAlign: "top",
                            color: "#222",
                          }}
                        />
                      </FlexboxGrid>
                    </IonRow>
                    <IonRow>
                      <IonText className="linkGroup">Grant Access</IonText>
                    </IonRow>
                    {groupsDup.length > 0 ? (
                      <IonRow style={{ height: 300, overflowY: "auto" }}>
                        <IonCol size="8">
                          {groupsDup.map((item, i) => (
                            <FlexboxGrid className="Popcheckbox" key={i}>
                              <Checkbox
                                value={item.id}
                                onChange={(value, checked) => {
                                  handleSelectGroup(value, checked);
                                }}
                              />
                              <IonLabel>{item.groupName}</IonLabel>
                            </FlexboxGrid>
                          ))}
                        </IonCol>
                        <IonCol size="4" >
                          {groupsDup.map((item, i) => (
                            <FlexboxGrid className="PopcheckboxToggler" key={i}>
                              {/* <IonCheckbox
                              slot="start"
                              value={val}
                              checked={isChecked}
                              mode="ios"
                            />
                            <IonLabel>Member</IonLabel> */}
                              <Toggle
                                size="md"
                                checkedChildren="Admin"
                                unCheckedChildren="Member"
                                color="primary"
                                onChange={(checked) => {
                                  handleChangeRole(item.id, checked ? "admin" : "member");
                                }}
                              />
                            </FlexboxGrid>
                          ))}
                        </IonCol>
                        {/* <IonCol>
                        {checkboxList.map(({ val, isChecked }, i) => (
                          <FlexboxGrid className="Popcheckbox" key={i}>
                            <IonCheckbox
                              slot="start"
                              value={val}
                              checked={isChecked}
                              mode="ios"
                            />
                            <IonLabel>Admin</IonLabel>
                          </FlexboxGrid>
                        ))}
                      </IonCol> */}
                      </IonRow>
                    ) : (
                      <>
                        <FlexboxGrid
                          justify="center"
                          className="StaffSelectGradeText"
                        >
                          <IonText>Not found in our records!</IonText>
                          <IonText>
                            Please confirm spelling before adding a new group.
                          </IonText>
                        </FlexboxGrid>
                        <FlexboxGrid justify="space-around">
                          <IonButton
                            fill="outline"
                            className="outlineBtn btn-Grade"
                            disabled={btnLoading}
                            onClick={() => {
                              handleCreateGroup();
                            }}
                          >
                            {btnLoading ? (
                              <IonSpinner name="dots" />
                            ) : (
                              "Add this Group"
                            )}
                          </IonButton>
                        </FlexboxGrid>
                      </>
                    )}
                  </>
                )}
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>

        <IonRow className="devider">
          <IonCol>
            <FlexboxGrid justify="end">
              <FlexboxGrid.Item>
                <IonButton
                  fill="outline"
                  className="outlineBtn "
                  color="success"
                  onClick={closee}
                >
                  Cancel
                </IonButton>
                <IonButton 
                  className="btn-green-popup" 
                  onClick={() => handleSubmit()}
                  disabled={btnLoading}
                >
                  {btnLoading ? (
                    <IonSpinner name="dots" />
                  ) : (
                    "Next"
                  )}
                </IonButton>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};
const mapStateToProps = (state: any) => ({
  groups: state.groups.groups,
});
const mapDispatchToProps = {
  fetchGroups,
};
export default connect(mapStateToProps, mapDispatchToProps)(StaffsToGroup);
