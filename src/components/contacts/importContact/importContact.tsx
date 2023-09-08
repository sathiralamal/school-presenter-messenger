import React from "react";
import { IonItem, IonText } from "@ionic/react";
import "./importContact.css";
import { FlexboxGrid } from "rsuite";

const ImportContact: React.FC<{
  importCon: boolean;
  onSelect: Function;
  close: any;
}> = ({ importCon, onSelect, close }) => {
  return (
    <IonItem
      lines="none"
      className="importContact"
      style={{ display: importCon ? "block" : "none" }}
    >
      <FlexboxGrid style={{ flexDirection: "column" }}>
        <IonText
          className="importContactText"
          onClick={() => {
            onSelect("learner");
            close();
          }}
        >
          Learner and Parents
        </IonText>
        <IonText
          className="importContactText"
          onClick={() => {
            onSelect("staff");
            close();
          }}
        >
          Staff Member
        </IonText>
      </FlexboxGrid>
    </IonItem>
  );
};

export default ImportContact;
