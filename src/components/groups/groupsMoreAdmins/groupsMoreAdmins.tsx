import React, { useState, useEffect } from "react";
import {
  IonIcon,
  IonText,
  IonImg,
  useIonPopover,
  IonItem,
  IonList,
  IonListHeader,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import "./groupsMoreAdmins.css";
import { FlexboxGrid } from "rsuite";
import Swal from "sweetalert2";
// popups
import EditLearner from "../../contacts/editLearner/editLearner";
import EditStaff from "../../contacts/editStaff/editStaff";

//redux
import { connect } from "react-redux";
import { groupSetData } from "../../../stores/groups/actions";

import * as integration from "scholarpresent-integration";

const PopoverList: React.FC<{
  onHide: () => void;
  onRemoveMember: () => void;
  onEditMember: () => void;
  deleteLoading: boolean;
  selectingUser: boolean;
}> = ({ onHide, onRemoveMember, onEditMember, deleteLoading, selectingUser }) => (
  <IonList style={{ backgroundColor: "#fff" }}>
    <div
      className="popoverMenuItem"
      style={{ color: selectingUser ? "#ccc" : "#222", cursor: selectingUser ? "no-drop" : "pointer" }}
      onClick={() => {
        if (!selectingUser) {
          onEditMember();
          onHide();
        }
      }}
    >
      Edit Information
    </div>
    <div
      className="popoverMenuItem"
      style={{ color: selectingUser ? "#ccc" : "#222", cursor: selectingUser ? "no-drop" : "pointer" }}
      onClick={() => {
        if (!selectingUser) {
          onRemoveMember()
        }
      }}
    >
      Delete Information{" "}
      {deleteLoading && (
        <IonSpinner name="bubbles" style={{ marginLeft: 10 }} />
      )}
    </div>
  </IonList>
);

const GroupsMoreAdmins: React.FC<{
  selectedId:any;
  moreAdminShow: boolean;
  group: any;
  groups: any;
  groupSetData: Function;
  members: any;
  loading: boolean;
  roles: any[];
  toggleOpen: Function;
  loadMore: Function;
  isMore: boolean
}> = ({
  selectedId,
  moreAdminShow,
  group,
  groups,
  groupSetData,
  members,
  loading,
  roles,
  toggleOpen,
  loadMore,
  isMore
}) => {
    const [openLearnerPopup, setLernerPopup] = useState<boolean>(false);
    const [openStaffPopup, setStaffPopup] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>({});
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [selectingUser, setSelectingUser] = useState<boolean>(false);
    const getRole = (item: any) => {
      if (item?.userRole?.roleName) {
        return item?.userRole?.roleName;
      } else {
        let filteredRole = roles.filter(
          (role: any) => role.id === item.userRoleId
        );
        if (filteredRole.length) {
          return filteredRole[0]?.roleName;
        }
      }
    };
    const [present, dismiss] = useIonPopover(PopoverList, {
      onHide: () => dismiss(),
      onRemoveMember: () => handleRemoveMember(selectedUser.id),
      onEditMember: () => (getRole(selectedUser) === "Student" || getRole(selectedUser) === "Parent") ? setLernerPopup(true) : setStaffPopup(true),
      deleteLoading,
      selectingUser
    });
    const handleRemoveMember = async (user: any) => {
      try {
        Swal.fire({
          title: "Are you sure want to delete this member?",
          text: "This action is unrecoverable!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, keep it",
        }).then(async (result: any) => {
          if (result.isConfirmed) {
            try {
              setDeleteLoading(true);
              let filteredGroupMembers = group.groupMembers.filter(
                (member: string) => member !== user
              );
              let groupIndex = groups.findIndex(
                (grp: any) => grp.id === group.id
              );
              groups[groupIndex].groupMembers = filteredGroupMembers;
              await integration.removeGroupMemberInfo(group.id, [user]);
              groupSetData([...groups]);
              dismiss();
            } catch (err) {
              Swal.fire(
                "Something went wrong!",
                "Please try again after sometime",
                "error"
              );
            }
          }
        });
      } catch (err) {
      } finally {
        setDeleteLoading(false);
      }
    };
   
    const handleSelectUser = async (e: any, user: any) => {
      try {
        setSelectingUser(true);
        present({
          event: e.nativeEvent,
        });
        const resp = await integration.getLearnerAndParentInfo(user.id);
        if (Array.isArray(resp?.items)) {
          setSelectedUser(resp?.items[0]);
        }
      } catch (err) {
      } finally {
        setSelectingUser(false);
      }
    }
    return (
      <FlexboxGrid
        className="groupsMoreAdmins"
        style={{ display: moreAdminShow ? "flex" : "none", width: "100%" }}
      >
        {loading && members.length === 0 && (
          <IonText style={{ margin: "auto" }}>Loading group members...</IonText>
        )}
        {members.map((user: any, i: number) => (
          <FlexboxGrid className={user.id === selectedId? "groupsMoreAdminsInnerSelected": "groupsMoreAdminsInner"} key={i}>
            <IonText style={{ fontWeight: "bold" }}>
              <IonImg
                src={
                  getRole(user) === "Student"
                    ? "/assets/learner.png"
                    : getRole(user) === "Parent"
                      ? "/assets/familyOne.png"
                      : "/assets/teacher.png"
                }
                className="groupAdminsIcon"
                style={{ width:"10%",marginRight: 7 }}
              />
              {`${user.firstName} ${user.lastName}`}
              <IonIcon
                icon={ellipsisVertical}
                style={{
                  color: "#219653",
                  verticalAlign: "top",
                  marginLeft: 10,
                  cursor: "pointer",
                }}
                onClick={async (e) => {
                  handleSelectUser(e, user)
                }}
              />
            </IonText>
            <IonText>{user.contactPhone}</IonText>
          </FlexboxGrid>
        ))}
        {(isMore && !loading) && (
          <IonButton
            fill="outline"
            style={{height: 53}}
            className="outlineBtn btn-right btn-addGroup"
            onClick={() => loadMore()}
          >
            <IonText>Load More</IonText>
          </IonButton>
        )}
        <EditLearner
          open={openLearnerPopup}
          closee={() => {
            setLernerPopup(false);
          }}
          learner={selectedUser}
          onSuccess={() => {
            toggleOpen();
          }}
        />
        <EditStaff
          open={openStaffPopup}
          closee={() => {
            setStaffPopup(false);
          }}
          staff={selectedUser}
          onSuccess={() => {
            toggleOpen();
          }}
        />
      </FlexboxGrid>
    );
  };
const mapStateToProps = (state: any) => ({
  groups: state.groups.groups,
  roles: state.roles.roles,
});
const mapDispatchToProps = {
  groupSetData,
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupsMoreAdmins);
