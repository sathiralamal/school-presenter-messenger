import React, { useState } from "react";
import { IonItem, IonText, IonButton, IonIcon, IonImg } from "@ionic/react";
import { FlexboxGrid } from "rsuite";
import { close } from "ionicons/icons";
import SuccessImg from "../../../assets/Success.png";
import "./groupSuccess.css";

const GroupSuccess: React.FC<{ open: boolean; closee: any, memberCount: number }> = ({
  open,
  closee,
  memberCount
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <IonItem
      lines="none"
      className="groupSuccess"
      style={{ display: open ? "block" : "none" }}
    >
      <FlexboxGrid style={{ flexDirection: "column", width: "100%" }}>
        <FlexboxGrid
          justify="space-between"
          style={{
            width: "100%",
            borderBottom: "1px solid #bbb",
            paddingBottom: 10,
          }}
        >
          <IonText className="groupSuccessHead">
            Group Created Successfully
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
          align="middle"
          style={{
            width: "100%",
            flexDirection: "column",
            padding: "10px 0 30px",
          }}
        >
          <IonImg src={SuccessImg} style={{ width: 120 }} />
          <IonText style={{ color: "#219653", fontSize: 18, marginTop: 15 }}>
            Congratulations
          </IonText>
          <IonText style={{ marginTop: 15 }} className="text-align-center">
            A group with {memberCount} participants was created
          </IonText>
        </FlexboxGrid>
        <FlexboxGrid justify="end" style={{ width: "100%", marginTop: 20 }}>
          <FlexboxGrid.Item>
            <IonButton
              className="btn-green-popup "
              onClick={() => {
                closee();
                setOpenModal(!openModal);
              }}
            >
              Close
            </IonButton>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid>
    </IonItem>
  );
};

export default GroupSuccess;
