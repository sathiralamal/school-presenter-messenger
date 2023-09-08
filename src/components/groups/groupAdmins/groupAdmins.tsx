import React from "react";
import { IonImg, IonText, IonButton } from "@ionic/react";
import { FlexboxGrid } from "rsuite";
import "./groupAdmins.css";

//redux
import { connect } from "react-redux";

const GroupAdmins: React.FC<{
  adminShow: boolean,
  members: any,
  loading: boolean,
  roles: any[],
  loadMore: Function,
  isMore: boolean
}> = ({ adminShow, members, loading, roles, isMore, loadMore }) => {
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
  return (
    <FlexboxGrid
      className="groupAdmins"
      style={{ display: adminShow ? "flex" : "none" }}
    >
      <IonText
        className="hide-mob"
        style={{ color: "#888", fontWeight: "bold", whiteSpace: 'nowrap' }}
      >
        Group Admins
      </IonText>
      {(loading && members.length === 0) && (<IonText style={{ margin: "auto" }}>Loading group admins...</IonText>)}
      {members.map((admin: any, i: string) => (
        <IonText className="groupAdminsText" key={i}>
          <IonImg src={
            getRole(admin) === "Student"
              ? "/assets/learner.png"
              : getRole(admin) === "Parent"
                ? "/assets/familyOne.png"
                : "/assets/teacher.png"
          } className="groupAdminsIcon"
          style={{ width: "10%", margin: "0 12px", verticalAlign: "middle" }}
           />
          {`${admin.firstName} ${admin.lastName}`}
        </IonText>
      ))}
      {isMore && (
        <IonButton
          fill="outline"
          className="outlineBtn btn-right btn-addGroup"
          onClick={() => loadMore()}
          style={{height: 30}}
        >
          <IonText>Load More</IonText>
        </IonButton>
      )}
    </FlexboxGrid>
  );
};
const mapStateToProps = (state: any) => ({
  roles: state.roles.roles,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(GroupAdmins);
