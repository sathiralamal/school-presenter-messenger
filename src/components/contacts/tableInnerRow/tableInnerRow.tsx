import React, { useEffect,useState } from "react";
import {
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonCheckbox,
  IonText,
  IonImg,
  IonSpinner,
  useIonAlert
} from "@ionic/react";
import { book, add, mail } from "ionicons/icons";
import "./tableInnerRow.css";
import { FlexboxGrid } from "rsuite";
import Swal from "sweetalert2";
import {
  CACHE_USER_LOGIN_ID,
  TENANT_ID, TENANT_NAME, CACHE_USER_LOGIN_ROLE_NAME, CACHE_USER_PROFILE_FULL_NAME
} from "../../../utils/StorageUtil";

import {
 getContactDetails
} from "../../../utils/Utils";
import { Storage } from "@ionic/storage";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";

import * as integration from "scholarpresent-integration";
const TableInnerRow: React.FC<{
  visibility: boolean;
  isTab: string;
  parentDetails: any[];
  learnerDetails: any;
  loading: boolean;
}> = ({
  visibility,
  isTab,
  parentDetails,
  learnerDetails,
  loading
}) => {
    const history = useHistory();
    const [present] = useIonAlert();
    const store = new Storage();
    const [userLogonRoleName, setUserLogonRoleName] = useState<string>("Parent");

    useEffect(() => {
      if (visibility) {

        console.log("parentDetails ", parentDetails);
      }
    }, [visibility])
    
    const handleSendInvite = async (item: any) => {

      await store.create();
      let tenantId = await store.get(TENANT_ID);
      let userId = await store.get(CACHE_USER_LOGIN_ID);
      let tenantName = await store.get(TENANT_NAME);
      let fullName = await store.get(CACHE_USER_PROFILE_FULL_NAME);
      let roleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);

      let signature = roleName +" "+fullName;

      let message ="Exciting news! " +tenantName+" now uses Scholar Present as our official communicator. Download at scholarpresent.com/app. ";
      message += signature;
      let contact = item.contactPhone;
      
      console.log("Invitation item ---- learnerDetails ", learnerDetails )
      //(tenantId, createdByUserId,message,contact, linkedUserId, invitedUserId )
      if(contact && contact!=null && contact.length > 0 ){

        let newInvitation = await integration.createInvitationInfo(
          tenantId,
          userId,
          message,
          contact, 
          learnerDetails?.id,
          item.id
        );

        present({
          cssClass: "my-alert-css",
          header: "Invitation Sent Successfully!",
          message: `You can check the invitation from the "invitation" tab`,
          buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
          onDidDismiss: (e) => console.log("did dismiss"),
        });
     }else{

      present({
          cssClass: "my-css",
          header: "Missing Mobile Number",
          message: "Can't send invitation without mobile number. Edit mobile number and try again.",
          buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
          onDidDismiss: (e) => console.log("did dismiss"),
        });
  }
      // Swal.fire({
      //   title: "Enter your message",
      //   input: "textarea",
      //   inputValue: "Welcome to iConnect99!",
      //   showCancelButton: true,
      //   confirmButtonText: "Send Invite",
      //   showLoaderOnConfirm: true,
      //   preConfirm: async (message) => {
      //     await store.create();
      //     let tenantId = await store.get(TENANT_ID);
      //     let userId = await store.get(CACHE_USER_LOGIN_ID);

      //     let contact = getContactDetails(item, "sms");
      //     console.log("Invitation item ---- learnerDetails ", learnerDetails )
      //     //(tenantId, createdByUserId,message,contact, linkedUserId, invitedUserId )
          
      //     let newInvitation = await integration.createInvitationInfo(
      //       tenantId,
      //       userId,
      //       message,
      //       contact, 
      //       learnerDetails?.id,
      //       item.id
      //     );
      //     return newInvitation;
      //   },
      //   allowOutsideClick: () => !Swal.isLoading(),
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     present({
      //       cssClass: "my-alert-css",
      //       header: "Invitation Sent Successfully!",
      //       message: `You can check the invitation from the "invitation" tab`,
      //       buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
      //       onDidDismiss: (e) => console.log("did dismiss"),
      //     });
      //   }
      // });
    };
    const handleCreateConversation = async (item: any) => {
      try {
        let email = item?.contactEmail;
        let phone = item?.contactPhone;
        if (email === "N/A" && phone === "N/A") {
          present({
            cssClass: "my-css",
            header: "No contact information found!",
            message: "Please update contact information to send message.",
            buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
            onDidDismiss: (e) => console.log("did dismiss"),
          });
        } else {
          await store.create();
          let tenantId = await store.get(TENANT_ID);
          let loginId = await store.get(CACHE_USER_LOGIN_ID);
          let conversationId = uuid();
          if(loginId === item.id){
            present({
                cssClass: "my-css",
                header: "Something went wrong!",
                message: "Can't create conversation to yourself.",
                buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
                onDidDismiss: (e) => console.log("did dismiss"),
            });

        }else{
            const resp = await integration.createConversationInfo(
              conversationId,
              "member_to_member",
              item.id,loginId
            );
            resp.receiptUser = [item];

            console.log("handleCreateConversation is conversation new " , resp.id === conversationId);

            if(resp.id === conversationId){
                resp.messages = {items:[]};    
            }    
            console.log("handleCreateConversation resp " , resp);

            await store.set(resp.id,{item:resp, isNew: resp.id === conversationId})

            console.log("handleCreateConversation" , resp);
            conversationId = resp.id;
            if(isParentOrStudentView()){
              history.push(`/lmessaging/${conversationId}`)
            } else{
              history.push(`/messaging/${conversationId}`)
            }
          }
          // present({
          //   cssClass: "my-alert-css",
          //   header: "Conversation Created Successfully!",
          //   message: `You can now communicate with ${item.firstName} ${item.lastName} from messaging tab`,
          //   buttons: [{ text: "Ok", handler: (d) => {
          //     history.push(`/messaging/${conversationId}`)
          //   } }],
          //   onDidDismiss: (e) => console.log("did dismiss"),
          // });
        }
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
    const handleUserRole = async () => {
      await store.create();
      setUserLogonRoleName(await store.get(CACHE_USER_LOGIN_ROLE_NAME));
    };
    const isParentOrStudentView = () => {
        return userLogonRoleName === "Student" || userLogonRoleName === "Parent";
    };
    return (
      <>
        {loading ? (
          <div style={{
            display: visibility ? "block" : "none",
            padding: 15,
            textAlign: "center",
            width: "100%"
          }}>
            <IonSpinner name="bubbles" />
          </div>
        ) : (
          <>
            {
            parentDetails.length > 0 ?
              <>
                {parentDetails.map((parent, i) => (
                  <React.Fragment key={i}>
                    <FlexboxGrid className="desktop-only">
                      <FlexboxGrid
                        className="table-body table-inner-body"
                        style={{ display: visibility ? "flex" : "none" }}
                      >
                        <FlexboxGrid.Item className="contact-col-2" style={{ paddingLeft: 16 }}>
                          {/* <IonCheckbox style={{ verticalAlign: "middle" }} /> */}
                          {/* <IonIcon icon={book} className="nameIcon" /> */}
                          <IonImg
                            src={
                              i % 2 ?
                                "/assets/familyTwo.png"
                                : "/assets/familyOne.png"
                            }
                            className="groupAdminsIcon"
                            style={{ width:"10%",margin: "0 12px", verticalAlign: "middle" }}
                          />
                          <IonText
                            style={{
                              textTransform: "uppercase",
                              // opacity: 0.5,
                            }}
                            className="green-text"
                          >
                            {parent.firstName}
                          </IonText>
                        </FlexboxGrid.Item>
                        {/*  */}
                        <FlexboxGrid.Item className="tableRowCol green-text contact-col-1">
                          {parent.lastName}
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item className="tableRowCol green-text contact-col-1">
                          {parent.gradeName}
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item className="tableRowCol green-text contact-col-1">
                          {parent.className}
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item className="tableRowCol green-text contact-col-1">
                          {parent.contactPhone}
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item className="tableRowCol green-text contact-col-2">
                          {parent.contactEmail}
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item className="tableRowCol contact-col-3">
                          {isTab === "Contacts" ? (
                            <>
                              <IonButton
                                fill="outline"
                                className="outlineBtn btn-send"
                                onClick={() => handleCreateConversation(parent)}
                              >
                                <span>Send message</span>
                                <IonIcon icon={mail} className="sendIcon" />
                              </IonButton>
                              <IonButton
                                fill="outline"
                                className="outlineBtn btn-send"
                                onClick={() => handleSendInvite(parent)}
                              >
                                <IonIcon icon={add} className="sendIcon" />
                                <span>Send invite</span>
                              </IonButton>
                            </>
                          ) : (""
                            // <FlexboxGrid style={{ textTransform: "none", width: "100%" }}>
                            //   <div style={{ width: "40%" }}>
                            //     <IonText className="tableTnnerDistributed">
                            //       Distributed
                            //     </IonText>
                            //     { console.log("Distributed 25 April 2019 ", parent)}
                            //     <IonText>25 April 2019</IonText>
                            //   </div>
                            //   <IonButton
                            //     fill="outline"
                            //     className="outlineBtn btn-send"
                            //     onClick={() => handleSendInvite(parent)}
                            //   >
                            //     <span>Resend</span>
                            //     <IonIcon icon={mail} className="sendIcon" />
                            //   </IonButton>
                            // </FlexboxGrid>
                          )}
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </FlexboxGrid>
                    <FlexboxGrid className="mobile-only">
                      <IonRow
                        className="table-body table-inner-body"
                        style={{ display: visibility ? "flex" : "none" }}
                      >
                        <IonCol size="12">
                          <FlexboxGrid>
                            <FlexboxGrid.Item>
                              <FlexboxGrid>
                                <IonImg
                                  src={
                                    i % 2 ?
                                      "/assets/familyTwo.png"
                                      : "/assets/familyOne.png"
                                  }
                                  className="groupAdminsIcon"
                                  style={{width:"15%", marginRight: 8, verticalAlign: "middle" }}
                                />
                                <IonText className="textName ">
                                  {parent.firstName} {parent.lastName}
                                </IonText>
                              </FlexboxGrid>
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </IonCol>
                        <IonCol size="12">
                          <FlexboxGrid justify="start">
                            <FlexboxGrid.Item>
                              <IonText className="textSmalll2 textRight ">
                                {getContactDetails(parent, "sms")}
                              </IonText>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item style={{ marginLeft: 15 }}>
                              <IonText className="textSmalll2 textRight ">
                                {getContactDetails(parent, "email")}
                              </IonText>
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </IonCol>
                        <IonCol className="tableRowCol " size="12">
                          {isTab === "Contacts" ? (
                            <FlexboxGrid>
                              <IonButton
                                fill="outline"
                                className="outlineBtn btn-send"
                                onClick={() => handleCreateConversation(parent)}
                              >
                                <span>Send message</span>
                                <IonIcon icon={mail} className="sendIcon" />
                              </IonButton>
                              <IonButton
                                fill="outline"
                                className="outlineBtn btn-send"
                                onClick={() => handleSendInvite(parent)}
                              >
                                <IonIcon icon={add} className="sendIcon" />
                                <span>Send invite</span>
                              </IonButton>
                            </FlexboxGrid>
                          ) : (""
                            // <FlexboxGrid style={{ textTransform: "none", width: "100%" }}>
                            //   <div style={{ width: "50%" }}>
                            //     <IonText className="tableTnnerDistributed">
                            //       Distributed
                            //     </IonText>
                            //     { console.log("Distributed 25 April 2019 ", parent)}

                            //     <IonText>25 April 2019</IonText>
                            //   </div>
                            //   <IonButton
                            //     fill="outline"
                            //     className="outlineBtn btn-send"
                            //     onClick={() => handleSendInvite(parent)}
                            //   >
                            //     <span>Resend</span>
                            //     <IonIcon icon={mail} className="sendIcon" />
                            //   </IonButton>
                            // </FlexboxGrid>
                          )}
                        </IonCol>
                      </IonRow>
                    </FlexboxGrid>
                  </React.Fragment>
                ))}
              </>
              : (
                <div style={{
                  display: visibility ? "block" : "none",
                  padding: 15,
                  textAlign: "center",
                  width: "100%"
                }}>
                  <span style={{ color: '#000' }} >No parent information found!</span>
                </div>
              )}
          </>
        )}
      </>
    );
  };

export default TableInnerRow;
