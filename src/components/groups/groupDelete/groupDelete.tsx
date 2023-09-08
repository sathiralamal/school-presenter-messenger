import React, { useState } from "react";
import { IonItem, IonText, IonButton, IonSpinner } from "@ionic/react";
import { FlexboxGrid } from "rsuite";
import "./groupDelete.css";

//redux
import { connect } from "react-redux";
import { deleteGroup } from "../../../stores/groups/actions";

const GroupDelete: React.FC<{
  open: boolean;
  close: Function;
  group: any;
  deleteGroup: Function;
}> = ({ open, close, group, deleteGroup }) => {
  const [isLoading, setLoading] = useState(false);

  const handleDeleteGroup = async () => {
    try {
      setLoading(true);
      deleteGroup(group.id);
      close();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <IonItem
      lines="none"
      className="groupDelete"
      style={{ display: open ? "block" : "none" }}
    >
      <FlexboxGrid style={{ flexDirection: "column", width: "100%" }}>
        <FlexboxGrid
          justify="space-between"
          align="middle"
          style={{
            width: "100%",
          }}
        >
          <IonText className="groupDeleteText" style={{flex: 3}} >
            "{group.groupName}" will be permanently deleted Are you sure you
            want to continue?
          </IonText>
          <FlexboxGrid.Item style={{flexDirection: "column", flex: 1}}>
            <IonButton
              className="btn-green-popup btn-red-delete"
              onClick={() => {
                handleDeleteGroup();
              }}
              disabled={isLoading}
            >
              {isLoading ? <IonSpinner name="dots" /> : "Delete"}
            </IonButton>
            <IonButton
              className="btn-green-popup btn-delete"
              style={{'--background': '#aaa'}}
              onClick={() => {
                close();
              }}
              disabled={isLoading}
            >
              {isLoading ? <IonSpinner name="dots" /> : "Cancel"}
            </IonButton>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid>
    </IonItem>
  );
};
const mapStateToProps = (state: any) => ({});
const mapDispatchToProps = {
  deleteGroup,
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupDelete);
