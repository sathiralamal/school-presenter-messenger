import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonText,
  useIonAlert,
} from "@ionic/react";
import {
  chevronDown,
  chevronUp,
  chatbox,
  trash,
  pencil,
  ellipsisVerticalOutline,
} from "ionicons/icons";
import "./groupChart.css";
import GroupAdmins from "../groupAdmins/groupAdmins";
import GroupsMoreAdmins from "../groupsMoreAdmins/groupsMoreAdmins";
import GroupDelete from "../groupDelete/groupDelete";
import { FlexboxGrid, Dropdown } from "rsuite";
import {
  CACHE_USER_LOGIN_ID,
  TENANT_ID,CACHE_USER_LOGIN_ROLE_NAME
} from "../../../utils/StorageUtil";
import { Storage } from "@ionic/storage";
import { v4 as uuid } from "uuid";

//redux
import { connect } from "react-redux";
import {} from "../../../stores/groups/actions";

import * as integration from "scholarpresent-integration";

const GroupChart: React.FC<{
  selectedId: any
  id: number;
  SetDelete: any;
  selectedDelete: any;
  group: any;
  onSelect: Function;
  selectedGroups: any;
  onEdit: Function;
}> = ({
  selectedId,
  id,
  SetDelete,
  selectedDelete,
  group,
  onSelect,
  selectedGroups,
  onEdit,
}) => {
  const history = useHistory();

  const [present] = useIonAlert();
  const store = new Storage();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [users, setUsers] = useState<any>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [admins, setAdmins] = useState<any>([]);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminOffset, setAdminOffset] = useState<number>(0);
  const [adminIsMore, setAdminIsMore] = useState<boolean>(true);
  const [memberOffset, setMemberOffset] = useState<number>(0);
  const [memberIsMore, setMemberIsMore] = useState<boolean>(true);

  const loadUsers = async ( type: string) => {
    try {
      if (type === "members") {
        //if (Array.isArray(userIds)) {
          setUserLoading(true);
          let userArray = await integration.getGroupMembersDetailsInfo(
            group.id ,memberOffset
          );
          let userTempArr: any[] = [];
          userArray?.items.map((user: any) => {
            // if (Array.isArray(user.items)) {
            //   if (user.items.length) {
            //     userTempArr.push(user.items[0]);
            //   }
            // }
            if(user){
              userTempArr.push(user);
            }
          });
          setUsers([...users, ...userTempArr]);
          if (userArray?.items.length === 0) {
            setMemberIsMore(false);
          }else{
           setMemberOffset(memberOffset + 1);
          }
        //}
      } else {
        console.log("loading admin users");
        //if (Array.isArray(userIds)) {
          setAdminLoading(true);
          //if (Array.isArray(userIds)) {
            //console.log("loading findUsersById adminUsers");
            //if(userIds.slice(adminOffset, adminOffset + 50).length > 0){
                let userArray = await integration.getGroupAdminMembersDetailsInfo(
                  group.id , adminOffset
                );
                let userTempArr: any[] = [];
                userArray?.items.map((user: any) => {
                  // if (Array.isArray(user.items)) {
                  //   if (user.items.length) {
                  //     userTempArr.push(user.items[0]);
                  //   }
                  // }
                  if(user){
                    userTempArr.push(user);
                  }
                });
                //console.log("loadUsers userTempArr ", userTempArr, " userIds ", userIds); 
                setAdmins([...admins, ...userTempArr]);
                //console.log("loadUsers admins ", admins, " userTempArr ", userTempArr, " userIds ", userIds); 
                // if (
                //   userTempArr.length === userIds.length ||
                //   userTempArr.length === 0
                // ) {
                //   setAdminIsMore(false);
                // }
              if( userArray?.items?.length ===0){
                setAdminIsMore(false);
              }else{
                setAdminOffset(adminOffset + 1);
              }
            //}else{
            //}
          //}
        //}
      }
    } catch (err) {
    } finally {
      if (type === "members") setUserLoading(false);
      else setAdminLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      loadUsers("members");
      loadUsers("admins");

      
    }
  }, [open]);
  const handleLoadMore = (type: string) => {
    if (type === "members") loadUsers("members");
    else loadUsers("admins");
  };
  const handleCreateConversation = async () => {
    try {
      await store.create();
      console.log("handleCreateConversation group ", group);

      let groupId = group?.id;
      let tenantId = await store.get(TENANT_ID);
      let loginId = await store.get(CACHE_USER_LOGIN_ID);
      let conversationId = uuid();

      let userAlreadyGroupAdmin = group?.isAdminUser
      console.log("****userAlreadyGroupAdmin ", userAlreadyGroupAdmin );
      //Lenkwe
      if(userAlreadyGroupAdmin === false){
        present({
          cssClass: "my-alert-css",
          header: "Add me to the group",
          message:
            "You are currently not a member of this group. Do want to be added to this group?",
          buttons: [{ text: "Yes", handler: async(d) => {
            await integration.addGroupAdminMemberInfo(groupId, [loginId]) 
            
            const resp = await integration.createConversationInfo(
              conversationId,
              "member_to_group",
              groupId, loginId
            );
            let newConversation  = resp;
            newConversation.receiptGroup = group;
            console.log("handleCreateConversation is conversation new " , resp.id === conversationId);
      
            if(resp.id === conversationId){
              resp.messages = {items:[]};    
            }    
            console.log("handleCreateConversation resp " , resp);
      
            await store.set(resp.id,{item:resp, isNew: resp.id === conversationId})
      
                      
            let roleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);
            console.log("handleCreateConversation roleName ", roleName);
            if(roleName ==="Student" || roleName ==="Parent"){
              history.push(`/lmessaging/${conversationId}`);
            }else{
              history.push(`/messaging/${conversationId}`);
            }
          }},
            { text: "No", handler: async(d) => {
              console.log("did dismiss")}}
          ],
          onDidDismiss: (e) => console.log("did dismiss"),
        });
      }else{
        const resp = await integration.createConversationInfo(
          conversationId,
          "member_to_group",
          groupId, loginId
        );
        let newConversation  = resp;
        newConversation.receiptGroup = group;
        console.log("handleCreateConversation is conversation new " , resp.id === conversationId);
  
        if(resp.id === conversationId){
          resp.messages = {items:[]};    
        }    
        console.log("handleCreateConversation resp " , resp);
  
        await store.set(resp.id,{item:resp, isNew: resp.id === conversationId})
  
                  
        let roleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);
        console.log("handleCreateConversation roleName ", roleName);
        if(roleName ==="Student" || roleName ==="Parent"){
          history.push(`/lmessaging/${conversationId}`);
        }else{
          history.push(`/messaging/${conversationId}`);
        }

      }
      
                
      //history.push(`/messaging/${conversationId}`)
      // console.log(resp);
      // present({
      //   cssClass: "my-alert-css",
      //   header: "Conversation Created Successfully!",
      //   message:
      //     "You can now communicate with the group members from messaging tab",
      //   buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
      //   onDidDismiss: (e) => console.log("did dismiss"),
      // });
    } catch (err) {
      present({
        cssClass: "my-css",
        header: "Something went wrong!",
        message: "Please try again after sometime.",
        buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
        onDidDismiss: (e) => console.log("did dismiss"),
      });
    }
  };
  const isChecked = selectedGroups?.filter((grp: any) => grp.id === group.id)
    .length
    ? true
    : false;
  return (
    <FlexboxGrid 
      className={`groupBodyMain ${open ? "groupMainShadow" : ""}`}
      // onClick={() => {
      //   setOpen(!open);
      // }}
    >
      <FlexboxGrid
        id="divGroupItem"
        className={`groupBody ${open ? "" : "groupBodyShadow"} ${
          open ? "groupBodyBorder" : ""
        }`}
        onClick={(event:any) => {
          const target = event.target as HTMLButtonElement;
          console.log("target.id ", target.id)
          if( target.id === "chevronIcon" || target.id === "divGroupItem" ){
            setOpen(!open);
          }
        }}
      >
        <IonItem lines="none" style={{ borderRadius: "7px 0 0 7px" }}>
          <IonCheckbox
            className="groupCheck"
            onIonChange={(e) => onSelect(group, e.detail.checked)}
            checked={isChecked}
          />
          <IonText className="groupBodyText">
            {group?.groupName}{" "}
            <span className="groupNumbers">{group?.membersCount + group?.adminCount }</span>
          </IonText>
        </IonItem>
        <IonIcon
          id="chevronIcon"
          icon={open ? chevronUp : chevronDown}
          className="groupBodyDown"
          onClick={() => {
            setOpen(!open);
          }}
        />
        <IonButton
          fill="outline"
          className="outlineBtn btnGroupChat desk-only"
          id="btnGroupChat"
          onClick={() => {
            return handleCreateConversation()
          }}
        >
          <IonIcon
            icon={chatbox}
            style={{
              fontSize: 20,
              verticalAlign: "middle",
              color: "#219653",
            }}
          />
        </IonButton>
        <IonButton
          fill="outline"
          className="outlineBtn btnGroupTrash desk-only"
          onClick={() => {
            setDeleteOpen(!deleteOpen);
          }}
        >
          <IonIcon
            icon={trash}
            style={{
              fontSize: 20,
              verticalAlign: "middle",
              color: "#bf0000",
            }}
          />
        </IonButton>
        {/* <IonButton
          fill="outline"
          className="outlineBtn btnGroupPencil desk-only"
          onClick={() => onEdit(group)}
        >
          <IonIcon
            icon={pencil}
            style={{
              fontSize: 20,
              verticalAlign: "middle",
              color: "#219653",
            }}
          />
        </IonButton> */}

        <Dropdown
          renderTitle={(children) => {
            return (
              <IonButton
                fill="outline"
                className="mob-only outlineBtn bttn "
                // onClick={() => handleCreateConversation()}
              >
                <IonIcon
                  icon={ellipsisVerticalOutline}
                  style={{
                    fontSize: 20,
                    verticalAlign: "middle",
                    color: "#219653",
                  }}
                />
              </IonButton>
            );
          }}
          onSelect={(value) => {
            if (value==='create') {
              handleCreateConversation()
            } else if (value === "delete") {
              setDeleteOpen(!deleteOpen);
            } else {
                onEdit(group);
            }
          }}
          placement={window.innerWidth > 356? "leftStart":"rightStart"}
        >
          <Dropdown.Item eventKey="create">
            Create Message
          </Dropdown.Item>
          <Dropdown.Item eventKey="delete">Delete Group</Dropdown.Item>
          {/* <Dropdown.Item eventKey="edit">Edit Group</Dropdown.Item> */}
        </Dropdown>
        {open && (
          <GroupAdmins
            adminShow={open}
            members={admins}
            loading={adminLoading}
            loadMore={() => handleLoadMore("admins")}
            isMore={adminIsMore}
          />
        )}
        <GroupDelete
          open={deleteOpen}
          close={() => {
            setDeleteOpen(!deleteOpen);
          }}
          group={group}
        />
      </FlexboxGrid>
      <div
        className={`groupNumber2 ${
          open ? "groupNumberOpen" : "groupNumberClose"
        }`}
      >
        {/* {group?.groupMembers?.length} */}
      </div>
      <GroupsMoreAdmins
        selectedId={selectedId}
        moreAdminShow={open}
        group={group}
        members={users}
        loading={userLoading}
        toggleOpen={() => setOpen(!open)}
        loadMore={() => handleLoadMore("members")}
        isMore={memberIsMore}
      />
    </FlexboxGrid>
  );
};
const mapStateToProps = (state: any) => ({
  groups: state.groups.groups,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(GroupChart);
