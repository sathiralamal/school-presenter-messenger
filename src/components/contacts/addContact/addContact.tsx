import React from "react";
import { IonItem, IonText } from "@ionic/react";
import "./addContact.css";
import { FlexboxGrid } from "rsuite";

const AddContact: React.FC<{
  addCon: boolean;
  learner: any;
  staff: any;
  close: any;
}> = ({ addCon, learner, staff, close }) => {
  return (
    <IonItem
      lines="none"
      className="addContact"
      style={{ display: addCon ? "block" : "none" }}
    >
      <FlexboxGrid style={{ flexDirection: "column" }}>
        <IonText
          className="addContactText"
          onClick={() => {
            learner();
            close();
          }}
          id="addNewLearner"
        >
          Add New Learner
        </IonText>
        <IonText
          className="addContactText"
          onClick={() => {
            staff();
            close();
          }}
          id="addNewStaff"

        >
          Add New Staff
        </IonText>
      </FlexboxGrid>
    </IonItem>
  );
};

export default AddContact;
