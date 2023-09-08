import React, { useEffect, useState } from "react";
import { IonItem, IonText, IonButton, IonIcon, IonImg, IonSpinner } from "@ionic/react";
import { FlexboxGrid, Progress } from "rsuite";
import { close } from "ionicons/icons";
import SuccessImg from "../../../assets/Success.png";
import "./sendInvitations.css";
import {
  CACHE_USER_LOGIN_ID,
  TENANT_ID, CACHE_USER_PROFILE_FULL_NAME, CACHE_USER_LOGIN_ROLE_NAME, TENANT_NAME
} from "../../../utils/StorageUtil";
import { Storage } from "@ionic/storage";

import * as integration from "scholarpresent-integration";
const SendInvitations: React.FC<{ open: boolean; closee: any; importedContacts: any[] }> = ({
  open,
  closee,
  importedContacts
}) => {
  const { Line } = Progress;
  const store = new Storage();
  const [btnLoading, setBtnLoading] = useState(false);
  const [contactLength, setContactLength] = useState(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  
  
  const handleSendBulkInvitation = async() =>{
    try{
      setBtnLoading(true);
      await store.create();
      let tenantId = await store.get(TENANT_ID);
      let fullName = await store.get(CACHE_USER_PROFILE_FULL_NAME);
      let roleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);
      let tenantName = await store.get(TENANT_NAME);

      let signature = roleName +" "+fullName;
      let message ="Exciting news! " +tenantName+" now uses Scholar Present as our official communicator. Download at scholarpresent.com/app. ";
      message +=signature;
      let contacts:any[] = [];
      let userId = await store.get(CACHE_USER_LOGIN_ID);
      console.log("importedContacts ", importedContacts);
      importedContacts.map((contact: any)=>{
        console.log("importedContacts contact ", contact , " contact?.map ", contact?.map, " contact?.items ", contact?.items);

        if(contact?.items){
          contact?.items?.map((cnt:any)=>{
            if(cnt?.contactPhone && cnt?.contactPhone!==null ){
              contacts.push({contact:cnt?.contactPhone,invitedUserId:cnt.id, linkedUserId:cnt?.linkedUserId, createdByUserId:userId })
            }
          })
        }else if(contact?.map){

          contact?.map((cnt:any)=>{

            if(cnt?.contactPhone && cnt?.contactPhone!==null ){
              contacts.push({contact:cnt?.contactPhone,invitedUserId:cnt.id, linkedUserId:cnt?.linkedUserId, createdByUserId:userId })
            }
          })
        }
        

        
      })
      console.log("contacts ", contacts);
      if(contacts.length){
        setShowProgress(true);
        let i,j, chunks, chunkSize = 50;
        let percent = 0;
        let inviteResp:any[] = [];
        for (i = 0,j = contacts.length; i < j; i += chunkSize) {
          chunks = contacts.slice(i, i + chunkSize);
          let respUploads = await integration.createBulkInvitationInfo(chunks, message);
          inviteResp.push(respUploads);
          percent = (i/contacts.length)*100;
          setProgressPercent(parseInt(percent.toString()));
        }
        closee();
        console.log(inviteResp);
      }
    }catch(err){
      console.log(err);
    }finally{
      setBtnLoading(false);
    }
  }
  
  useEffect(()=>{
    let length = 0
    importedContacts?.map((contact: any)=>{
      length += contact.length
    })
    setContactLength(length);
  }, [importedContacts])
  return (
    <IonItem
      lines="none"
      className="sendInvitations"
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
          <IonImg src={SuccessImg} className="sendInvitationsImg" />
          <IonText className="sendInvitationsBodyHead">
            You are about to send an invitation to {contactLength} imported contacts
          </IonText>
        </FlexboxGrid>
        <FlexboxGrid className="sendInvitationsBody">
          <IonText className="sendInvitationsBodyMid">
            WE HIGHLY RECOMMEND SENDING OF INVITATIONS
          </IonText>
          <IonText>
            This is crucial as it will allow members to download Scholar Present and
            receive messages from the school
          </IonText>
        </FlexboxGrid>
        <FlexboxGrid className="sendInvitationsBox">
          <IonText>
            We have started using Scholar Present Platform as our official communication
            channel. Please download this App, Follow the link to learn more
            https://scholarpresent.com/app
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
              id="btnDontSend"
            >
              Don't Send Invitation
            </IonButton>
            <IonButton
              className="btn-green-popup "
              onClick={() => handleSendBulkInvitation()}
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

export default SendInvitations;
