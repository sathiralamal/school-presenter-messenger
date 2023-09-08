import React, { useState } from "react";
import { IonItem, IonText, IonButton, IonIcon, IonImg, IonSpinner } from "@ionic/react";
import { FlexboxGrid, Progress } from "rsuite";
import { close } from "ionicons/icons";
import SuccessImg from "../../../assets/Success.png";
import "./sendInvitations2nd.css";
import {
  CACHE_USER_LOGIN_ID,
  TENANT_ID, TENANT_NAME,CACHE_USER_PROFILE_FULL_NAME, CACHE_USER_LOGIN_ROLE_NAME

} from "../../../utils/StorageUtil";

import {
  getContactDetails
} from "../../../utils/Utils";
import { Storage } from "@ionic/storage";
import * as integration from "scholarpresent-integration";

const SendInvitations2nd: React.FC<{ open: boolean; closee: any; contacts: any[] }> = ({
  open,
  closee,
  contacts
}) => {
  const { Line } = Progress;
  const [btnLoading, setBtnLoading] = useState(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [tenantName, setTenantName] = useState<string>("");

  const store = new Storage();
  
  const handleSendBulkInvitation = async () => {
    try {
      setBtnLoading(true);
      await store.create();
      let tenantId = await store.get(TENANT_ID);
      if(tenantName && tenantName.length > 0 ){
        setTenantName(await store.get(TENANT_NAME));
      }
      let fullName = await store.get(CACHE_USER_PROFILE_FULL_NAME);
      let roleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);

      let signature = " From " + roleName +" "+fullName;

      let message ="Exciting news! " +tenantName+" now uses Scholar Present as our official communicator. Download at scholarpresent.com/app. ";
      message += signature;
      let contactsTemp: any[] = [];

      contacts.map((contact: any) => {
        contactsTemp.push({ contact: getContactDetails(contact, "sms"), invitedUserId:contact.id })
      })
      console.log("contactsTemp : ", contactsTemp);

      if(contactsTemp.length){
        let userId = await store.get(CACHE_USER_LOGIN_ID);
        setShowProgress(true);
        let i,j, chunks, chunkSize = 50;
        let percent = 0;
        let inviteResp:any[] = [];
        for (i = 0,j = contactsTemp.length; i < j; i += chunkSize) {
          chunks = contactsTemp.slice(i, i + chunkSize);
          let respUploads = await integration.createBulkInvitationInfo(chunks, message);
          inviteResp.push(respUploads);
          percent = (i/contactsTemp.length)*100;
          setProgressPercent(parseInt(percent.toString()));
        }
        closee();
        console.log(inviteResp);
      }
      // let userId = await store.get(CACHE_USER_LOGIN_ID);
      // let resp = await integration.createBulkInvitationInfo(contacts, tenantId, message, userId);
      // closee();
      // console.log(resp);
    } catch (err) {
      console.log(err);
    } finally {
      setBtnLoading(false);
    }
  }
  store.create().then((value:any)=>{
    store.get(TENANT_NAME).then((value:any)=>{
    setTenantName(value);
  })
  });
  
  let message = tenantName+" has started using Scholar Present as the official school communication channel.";
  message += "Follow the link to download https://scholarpresent.com/app.";

  return (
    <IonItem
      lines="none"
      className="sendInvitations2nd"
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
          <IonText className="sendInvitationsHead">Send Invitations</IonText>
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
        <FlexboxGrid align="middle" style={{ marginTop: 20 }}>
          <IonImg
            src={SuccessImg}
            className="sendInvitationsImg sendInvitations2ndImg"
          />
          <IonText className="sendInvitationsBodyHead sendInvitations2ndBodyHead">
            You are about to send an invitation to {contacts.length} imported contacts.
          </IonText>
        </FlexboxGrid>
        <FlexboxGrid className="sendInvitationsBody sendInvitations2ndBody">
          <IonText>
            Sending the invite will allow your contacts to connect with you on Scholar Present.
          </IonText>
        </FlexboxGrid>
        <FlexboxGrid className="sendInvitationsBox">
          <IonText>
            {message}
          </IonText>
        </FlexboxGrid>
        {showProgress && (
          <Line percent={progressPercent} />
        )}
        <FlexboxGrid justify="end" style={{ width: "100%", marginTop: 20 }}>
          <FlexboxGrid.Item>
            <IonButton
              fill="outline"
              className="outlineBtn "
              color="success"
              onClick={closee}
              id="btnDontSend2"

            >
              Don't Send Invitation
            </IonButton>
            <IonButton
              className="btn-green-popup "
              onClick={() => {
                handleSendBulkInvitation()
              }}
              disabled={btnLoading}
            >
              {btnLoading ? <IonSpinner name="dots" /> : "Send Invitations"}
            </IonButton>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid>
    </IonItem>
  );
};

export default SendInvitations2nd;
