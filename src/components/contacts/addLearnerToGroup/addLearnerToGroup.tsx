import React, { useEffect, useState } from "react";
import { IonItem, IonText, IonButton, IonIcon, IonSpinner } from "@ionic/react";
import { close } from "ionicons/icons";
import "./addLearnerToGroup.css";
import { FlexboxGrid, CheckPicker } from "rsuite";

//redux
import { connect } from "react-redux";
import {fetchGroups} from "../../../stores/groups/actions";

import * as integration from "scholarpresent-integration";
const AddLearnerToGroup: React.FC<{ open: boolean; closee: any, learner: any, fetchGroups: Function, groups: any}> = ({
  open,
  closee,
  learner,
  fetchGroups,
  groups
}) => {
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [filterGroups, setFilterGroups] = useState<any[]>([]);

  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  

  useEffect(()=>{
    fetchGroups()
  }, [])
  useEffect(()=>{
    if(Array.isArray(groups.items)){
      let allGroupsTemp:any[] = [];
      console.log("addLearner groups" , groups);
      groups.items.map((group:any)=>{
        allGroupsTemp.push({
          label: group.groupName,
          value: group.id,
        })
      })
      setAllGroups([...allGroupsTemp]);
    }
  }, [groups])
  useEffect(()=>{

  },[searchText, allGroups])
  const handleAddToGroups = async() =>{
    try{
      setBtnLoading(true);
      let promises:any[] = [];
      console.log("handleAddToGroups learner ", learner);
      selectedGroups.map((group:any)=>{
        promises.push(integration.addGroupMemberInfo(group, [learner.id]));
      })
      let response = await Promise.all(promises);
      console.log(response);
      closee();
    }catch(err){

    }finally{
      setBtnLoading(false);
    }
  }
  const handleSearchGroups = async ( searchText:any, e: any) => {
    //e.preventDefault();
    setSearchText(searchText);
    if (searchText.length === 0) {
      setFilterGroups([]);
    } else {
      try {
        const resp = await integration.searchByGroupName(searchText);
        let filterGroups:any = [];
        resp?.items.map((group:any)=>{
          filterGroups.push({
            label: group.groupName,
            value: group.id,
          })
        })
        setFilterGroups(filterGroups);
        console.log("||||||| handleSearchGroups:", resp);  

        
      } catch (err) {
        console.log("handleSearchGroups err ", err);
      } 
    }
  };

  return (
    <IonItem
      lines="none"
      className="AddLearnerToGroup"
      style={{ display: open ? "block" : "none" }}
    >
      <FlexboxGrid
        style={{ flexDirection: "column", width: "100%", padding: "10px 0" }}
      >
        <FlexboxGrid
          justify="space-between"
          style={{
            width: "100%",
          }}
        >
          <IonText className="LearnerToGroupHead">
            Add A Learner Member To Groups
          </IonText>
          <IonIcon
            icon={close}
            style={{
              fontSize: 22,
              verticalAlign: "top",
              color: "#bf0000",
            }}
            onClick={closee}
          />
        </FlexboxGrid>
        <FlexboxGrid
          justify="center"
          style={{ width: "100%", height: 370, marginTop: 20 }}
        >
          <CheckPicker
            data={searchText?.length > 0? filterGroups : allGroups}
            placeholder="Select Group"
            style={{ width: "250px" }}
            onSelect={(value, item)=>{
              setSelectedGroups(value)
            }}
            onSearch={(searchKeyword:string, event)=>{
              console.log("onSearch searchKeyword ", searchKeyword, " event ", event );

              handleSearchGroups(searchKeyword, event).then((value)=>{
                console.log("return value ", value);
              })
            } 

            }
          />
        </FlexboxGrid>
        <FlexboxGrid justify="end" style={{ width: "100%", marginTop: 20 }}>
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
              className="btn-green-popup "
              onClick={() => {
                handleAddToGroups();
              }}
              disabled={btnLoading}
            >
              {btnLoading ? <IonSpinner name="dots" /> : "Save"}
            </IonButton>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid>
    </IonItem>
  );
};

const mapStateToProps = (state: any) => ({
  groups: state.groups.groups
});
const mapDispatchToProps = {
  fetchGroups
};
export default connect(mapStateToProps, mapDispatchToProps)(AddLearnerToGroup);