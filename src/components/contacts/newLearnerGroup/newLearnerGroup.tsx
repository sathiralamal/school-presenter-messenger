import React from "react";
import {
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";
import "./newLearnerGroup.css";
import { Input, FlexboxGrid, InputPicker } from "rsuite";

const NewLearnerGroup: React.FC<{ open: boolean; close: any }> = ({
  open,
  close,
}) => {
  const data = [
    {
      label: "Eugenia",
      value: "Eugenia",
      role: "Master",
    },
    {
      label: "Kariane",
      value: "Kariane",
      role: "Master",
    },
    {
      label: "Louisa",
      value: "Louisa",
      role: "Master",
    },
    {
      label: "Marty",
      value: "Marty",
      role: "Master",
    },
    {
      label: "Kenya",
      value: "Kenya",
      role: "Master",
    },
    {
      label: "Hal",
      value: "Hal",
      role: "Developer",
    },
    {
      label: "Julius",
      value: "Julius",
      role: "Developer",
    },
    {
      label: "Travon",
      value: "Travon",
      role: "Developer",
    },
    {
      label: "Vincenza",
      value: "Vincenza",
      role: "Developer",
    },
    {
      label: "Dominic",
      value: "Dominic",
      role: "Developer",
    },
    {
      label: "Pearlie",
      value: "Pearlie",
      role: "Guest",
    },
    {
      label: "Tyrel",
      value: "Tyrel",
      role: "Guest",
    },
    {
      label: "Jaylen",
      value: "Jaylen",
      role: "Guest",
    },
    {
      label: "Rogelio",
      value: "Rogelio",
      role: "Guest",
    },
  ];

  return (
    <IonItem
      lines="none"
      className="NewLearnerGroup"
      style={{ display: open ? "block" : "none" }}
    >
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText className="PopupHeader">Add A Staff Member</IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <Input />
            <IonText className="PopupLable" id="staffFirstName"> First Name </IonText>
          </IonCol>
          <IonCol>
            <Input />
            <IonText className="PopupLable" id="staffLastName"> Last Name </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <InputPicker
              className="PopupInputPicker"
              placeholder="Select Role"
              data={data}
              style={{ width: 224 }}
              labelKey="role"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <Input />
            <IonText className="PopupLable" id="staffPhone"> Phone </IonText>
          </IonCol>
          <IonCol>
            <Input />
            <IonText className="PopupLable" id="staffEmail"> Email </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <InputPicker id="staffGrade"
              className="PopupInputPicker"
              placeholder="Select Grade"
              data={data}
              style={{ width: 224 }}
            />
          </IonCol>
          <IonCol>
            <InputPicker id="staffClass"
              className="PopupInputPicker"
              placeholder="Select Class"
              data={data}
              style={{ width: 224 }}
            />
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
                  onClick={close}
                >
                  Cancel
                </IonButton>
                <IonButton id="btnNext" className="btn-green-popup ">Next</IonButton>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default NewLearnerGroup;
