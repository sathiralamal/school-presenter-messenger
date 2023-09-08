import React, { useEffect, useState } from "react";
import { IonRow, IonCol, IonIcon, IonButton, IonCheckbox, IonText, useIonAlert, IonImg } from "@ionic/react";
import { book, add, chevronDown, chevronUp, mail, checkmark, pencil } from "ionicons/icons";
import { FlexboxGrid } from "rsuite";
import TableInnerRow from "../tableInnerRow/tableInnerRow";
import "./tableRow.css";

import {
    CACHE_USER_LOGIN_ID,
    TENANT_ID,
    TENANT_NAME,
    CACHE_USER_LOGIN_ROLE_NAME,CACHE_USER_PROFILE_FULL_NAME

} from "../../../utils/StorageUtil";

import {
    getContactDetails

} from "../../../utils/Utils";
import { Storage } from "@ionic/storage";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";
//redux
import { connect } from "react-redux";

import * as integration from "scholarpresent-integration";
const TableRow: React.FC<{
    isTab: string;
    item: any;
    grades: any[];
    onSelect: Function;
    selectedContacts: any[];
    roles: any[];
    onSetStaff: any;
    onSetLearner: any;
}> = ({ isTab, item, grades, roles, onSelect, selectedContacts, onSetStaff, onSetLearner }) => {
    const history = useHistory();
    const store = new Storage();
    const [present] = useIonAlert();
    const [open, setOpen] = useState(false);
    const [parentDetails, setParentDetails] = useState<any>([]);
    const [parentLoading, setParentLoading] = useState<boolean>(false);
    const [userLogonRoleName, setUserLogonRoleName] = useState<string>("Parent");

    
    const handleSendInvite = async () => {
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
        if(contact && contact!=null && contact.length > 0 ){
        //(tenantId, createdByUserId,message,contact, linkedUserId, invitedUserId )
            console.log("handleSendInvite item ", item);
            let newInvitation = await integration.createInvitationInfo(
                tenantId,
                userId,
                message,
                contact,
                item?.linkedUserId,
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
        //     let contact = getContactDetails(item, "sms");
        //     let userId = await store.get(CACHE_USER_LOGIN_ID);

        //     let newInvitation = await integration.createInvitationInfo(
        //       tenantId,
        //       userId,
        //       message,
        //       contact, undefined
        //       ,item.id
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
        console.log("handleCreateConversation item ", item)
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
                    console.log("createConversationInfo ")
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
                        

                    conversationId = resp.id;
                    if(isParentOrStudentView()){
                        history.push(`/lmessaging/${conversationId}`);
                    } else {
                        history.push(`/messaging/${conversationId}`);

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
        } catch (err:any) {
            console.log("handleCreateConversation err ", err);

            present({
                cssClass: "my-css",
                header: "Something went wrong!",
                message: "Please try again after sometime.",
                buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
                onDidDismiss: (e) => console.log("did dismiss"),
            });
        }
    };
    const getGrade = (gradeId: string) => {
        let filteredGrade = grades.filter((grade: any) => grade.id === gradeId);
        if (filteredGrade.length) {
            return filteredGrade[0]?.gradeName;
        } else {
            return "N/A";
        }
    };
    const getRole = () => {
        if (item?.roleName) {
            return item?.roleName;
        } else {
            let filteredRole = roles.filter((role: any) => role.id === item.userRoleId);
            if (filteredRole.length) {
                return filteredRole[0]?.roleName;
            }
        }
    };
    const fetchParentInfo = async (id: string) => {
        try {
            console.log("***** fetchParentInfo id ", id);
            console.log("***** fetchParentInfo item ", item);

            setParentLoading(true);
            console.log("***** fetchParentInfo *****");
            let parentInfo = null;
            try{
                parentInfo = await integration.getLearnerAndParentInfo(id);
            }catch(error){
                console.error("fetchParentInfo error ", error)
            }
            console.log("***** fetchParentInfo parentInfo ", parentInfo);
            if (Array.isArray(parentInfo?.items) && parentInfo?.items.length > 0 ) {
                parentInfo.items.map(async (parent: any) => {
                    console.log("***** fetchParentInfo parent ", parent);

                    parent.grade = parent.grade;
                    parent.className = parent?.className || "N/A";
                });
                setParentDetails(parentInfo.items);
            
                // if (Array.isArray(parentInfo.items[0]?.linkedUser?.items)) {
                //     if (parentInfo.items[0]?.linkedUser?.items.length) {
                //         parentInfo.items[0]?.linkedUser?.items.map(async (parent: any) => {
                //             parent.grade = getGrade(item?.className?.gradeID);
                //             parent.className = item?.className?.className || "N/A";
                //         });
                //         setParentDetails(parentInfo.items[0]?.linkedUser?.items);
                //     }
                // }
            }
        } catch (err) {
        } finally {
            setParentLoading(false);
        }
    };
    const isParentOrStudentView = () => {
        return userLogonRoleName === "Student" || userLogonRoleName === "Parent";
    };

    const handleUserRole = async () => {
        await store.create();
        setUserLogonRoleName(await store.get(CACHE_USER_LOGIN_ROLE_NAME));
    };

    useEffect(() => {
        handleUserRole();
        if (open) {
            fetchParentInfo(item?.id);
        } else {
            setParentDetails([]);
        }
    }, [open]);
    useEffect(() => {}, [userLogonRoleName, parentDetails]);
    const isChecked = selectedContacts.filter((grp: any) => grp.id === item.id).length ? true : false;

    return (
        <> 
            <FlexboxGrid className="desktop-only">
                <FlexboxGrid
                    className="table-body"
                    onClick={(event:any) => {
                        let tagName = JSON.stringify(event.target.tagName);
                        tagName = tagName?  tagName.toLowerCase() :tagName;
                        console.log("event.target.tagName ", tagName )

                        if(tagName.indexOf("div") > 0 || tagName.indexOf("ion-text") > 0  || (tagName.indexOf("button")< -1 && tagName.indexOf("span") ) ){
                            if (!isParentOrStudentView()) {
                                setOpen(!open);
                            }
                        }

                        
                    }}
                    style={{ cursor: !isParentOrStudentView() ? "pointer" : "" }}
                >
                    <FlexboxGrid.Item className="tableRowCol name-column" style={{ paddingLeft: 20 }}>
                        <IonCheckbox
                            style={{ verticalAlign: "middle" }}
                            onIonChange={(e) => onSelect(item, e.detail.checked)}
                            checked={isChecked}
                        />
                        {/* <IonIcon icon={book} className="nameIcon" /> */}
                        <IonImg
                            src={
                                getRole() === "Student"
                                    ? "/assets/learner.png"
                                    : getRole() === "Parent"
                                    ? "/assets/familyOne.png"
                                    : "/assets/teacher.png"
                            }
                            className="groupAdminsIcon"
                            style={{ width: "10%", margin: "0 12px", verticalAlign: "middle" }}
                        />
                        <IonText>{item.firstName}</IonText>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="tableRowCol surname-width">{item.lastName}</FlexboxGrid.Item>

                    <FlexboxGrid.Item className="tableRowCol grade-column">
                        {item?.gradeName || "N/A"}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="tableRowCol class-column">
                        {item?.className || "N/A"}
                    </FlexboxGrid.Item>
                    {!isParentOrStudentView() ? (
                        <>
                            <FlexboxGrid.Item className="tableRowCol phone-column">
                                {item.contactPhone}

                            </FlexboxGrid.Item>
                            {isTab === "Contacts" ?
                            <FlexboxGrid.Item
                                className="tableRowCol email-column"
                                style={{ textTransform: "lowercase" }}
                            >
                                {item.contactEmail}
                            </FlexboxGrid.Item> :""}
                        </>
                    ) : (
                        ""
                    )}
                    <FlexboxGrid.Item
                        className="tableRowColbtns contact-col-3"
                        style={{ display: "flex", justifyContent: "end", alignItems: "end" }}
                    >
                        {isTab === "Contacts" ? (
                            <>
                                {!isParentOrStudentView() ? (
                                    <IonButton
                                        fill="outline"
                                        className="outlineBtn btn-send"
                                        onClick={() => {
                                            if (getRole() === "Student" || getRole() === "Parent") {
                                                onSetLearner(item);
                                            } else {
                                                onSetStaff(item);
                                            }
                                        }}
                                    >
                                        <IonIcon icon={pencil} className="sendIcon" />
                                    </IonButton>
                                ) : (
                                    ""
                                )}
                                <IonButton
                                    fill="outline"
                                    className="outlineBtn btn-send"
                                    id="createConversation"
                                    onClick={(event) => {
                                        console.log("***** event ", event?.target)
                                        event.preventDefault();
                                        return handleCreateConversation(item)
                                    }}
                                >
                                    <span>Send message</span>
                                    <IonIcon icon={mail} className="sendIcon" />
                                </IonButton>
                                {!isParentOrStudentView() ? (
                                    <IonButton
                                        fill="outline"
                                        className="outlineBtn btn-send"
                                        onClick={() => handleSendInvite()}
                                    >
                                        <IonIcon icon={add} className="sendIcon" />
                                        <span>Send invite</span>
                                    </IonButton>
                                ) : (
                                    ""
                                )}
                            </>
                        ) : (
                            <FlexboxGrid style={{ textTransform: "none", width: "100%" }}>
                                <div style={{ width: "40%" }}>
                                    {item?.status === "distributed" ? (
                                        <>
                                            <IonText style={{ width: "100%" }}>Distributed</IonText>
                                            <br />
                                            <IonText>{moment.utc(item.updatedAt).format("DD MMMM YYYY")}</IonText>
                                        </>
                                    ) : (
                                        <>
                                            <IonIcon
                                                icon={checkmark}
                                                style={{
                                                    verticalAlign: "middle",
                                                    fontWeight: "bold",
                                                    marginLeft: 5,
                                                    color: "#219653",
                                                }}
                                            />
                                            <IonText>Accepted</IonText>
                                            <br />
                                            <IonText>{moment.utc(item.updatedAt).format("DD MMMM YYYY")}</IonText>
                                        </>
                                    )}
                                </div>
                                <IonButton
                                    fill="outline"
                                    className="outlineBtn btn-send"
                                    onClick={() => handleSendInvite()}
                                >
                                    <span>Resend</span>
                                    <IonIcon icon={mail} className="sendIcon" />
                                </IonButton>
                            </FlexboxGrid>
                        )}
                        {!isParentOrStudentView() ? (
                            <>
                                <IonText className="textSmalll" style={{ width: "auto" }}>
                                    Parent's details
                                </IonText>
                                <IonIcon
                                    icon={open ? chevronUp : chevronDown}
                                    style={{ verticalAlign: "middle", marginLeft: 5, color: "#000" }}
                                />
                                </>
                        ) : (
                            ""
                        )}
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <TableInnerRow
                    visibility={open}
                    isTab={isTab}
                    parentDetails={parentDetails}
                    learnerDetails={item}
                    loading={parentLoading}
                />
            </FlexboxGrid>
            <FlexboxGrid className="mobile-only">
                <IonRow className={`contact_card ${open ? "contact-border" : ""}`}>
                    <IonCol size="12">
                        <IonText className="Grade"> {item?.className?.className} </IonText>
                    </IonCol>

                    <IonCol>
                        <FlexboxGrid justify="start">
                            <FlexboxGrid.Item>
                                <FlexboxGrid style={{ marginTop: -25 }}>
                                    {/* <IonIcon
                    icon={book}
                    className="nameIcon"
                    style={{ marginLeft: 0 }}
                  /> */}
                                    <FlexboxGrid.Item style={{ marginTop: 0 }}>
                                        {/* <IonImg
                                            src={
                                                getRole() === "Student"
                                                    ? "/assets/learner.png"
                                                    : getRole() === "Parent"
                                                    ? "/assets/familyOne.png"
                                                    : "/assets/teacher.png"
                                            }
                                            className="groupAdminsIcon"
                                            style={{ margin: "0 12px", verticalAlign: "middle", width:"20%" }}
                                        /> */}
                                        
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item>
                                        <IonText className="textName">
                                            {item.firstName} {item.lastName}
                                        </IonText>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>

                                {!isParentOrStudentView() ? (
                                    <IonText className="textSmalll rowcat">{item?.className?.className}</IonText>
                                ) : (
                                    ""
                                )}
                            </FlexboxGrid.Item>
                            {isParentOrStudentView() ? (
                                <FlexboxGrid.Item>
                                    {/* <IonText> */}
                                    <b>{item?.userRole?.roleName}</b>
                                    {/* </IonText>  */}
                                </FlexboxGrid.Item>
                            ) : (
                                ""
                            )}
                        </FlexboxGrid>
                    </IonCol>
                    {!isParentOrStudentView() ? (
                        <IonCol>
                            <FlexboxGrid justify="end">
                                <FlexboxGrid.Item>
                                    <IonText className="textSmalll2 textRight">
                                        
                                        { isTab === "Contacts" ? getContactDetails(item, "sms") : item.contact}
                                    </IonText>
                                    {isTab === "Contacts" ?
                                    <IonText className="textSmalll2 textRight">
                                        {getContactDetails(item, "email")}
                                    </IonText> :""}
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </IonCol>
                    ) : (
                        ""
                    )}
                    {!isParentOrStudentView() ? (
                        <IonCol
                            size={`12`}
                            onClick={() => {
                                setOpen(!open);
                            }}
                        >
                            <FlexboxGrid justify="end">
                                <IonText className="textSmalll" style={{ width: "auto" }}>
                                    Parent's details
                                </IonText>
                                <IonIcon
                                    icon={open ? chevronUp : chevronDown}
                                    style={{
                                        verticalAlign: "middle",
                                        marginLeft: 5,
                                        color: "#219653",
                                    }}
                                />
                            </FlexboxGrid>
                        </IonCol>
                    ) : (
                        ""
                    )}
                    <TableInnerRow
                        visibility={open}
                        isTab={isTab}
                        parentDetails={parentDetails}
                        learnerDetails={item}
                        loading={parentLoading}
                    />
                    <IonCol className="tableRowCol" size="12">
                        {isTab === "Contacts" ? (
                            <FlexboxGrid>
                                {!isParentOrStudentView() ? (
                                    <IonButton
                                        fill="outline"
                                        className="outlineBtn btn-send w-100"
                                        style={{ marginBottom: 10 }}
                                        onClick={() => {
                                            if (getRole() === "Student" || getRole() === "Parent") {
                                                onSetLearner(item);
                                            } else {
                                                onSetStaff(item);
                                            }
                                        }}
                                    >
                                        <IonIcon icon={pencil} className="sendIcon" />
                                        <span>Edit Contact Information</span>
                                    </IonButton>
                                ) : (
                                    ""
                                )}
                                <IonButton
                                    fill="outline"
                                    className={
                                        isParentOrStudentView() ? "outlineBtn btn-send w-100" : "outlineBtn btn-send"
                                    }
                                    onClick={(event) => {
                                        console.log("***** event ", event);
                                        event.preventDefault()
                                        return handleCreateConversation(item)
                                    }}
                                >
                                    <span>Send message</span>
                                    <IonIcon icon={mail} className="sendIcon" />
                                </IonButton>
                                {!isParentOrStudentView() ? (
                                    <IonButton
                                        fill="outline"
                                        className="outlineBtn btn-send"
                                        onClick={() => handleSendInvite()}
                                    >
                                        <IonIcon icon={add} className="sendIcon" />
                                        <span>Send invite</span>
                                    </IonButton>
                                ) : (
                                    ""
                                )}
                            </FlexboxGrid>
                        ) : (
                            <FlexboxGrid>
                                {item?.status === "distributed" ? (
                                        <>
                                            <IonText style={{ width: "100%" }}>Distributed</IonText>
                                            <br />
                                            <IonText>{moment.utc(item.updatedAt).format("DD MMMM YYYY")}</IonText>
                                        </>
                                    ) : (
                                        <>
                                            <IonIcon
                                                icon={checkmark}
                                                style={{
                                                    verticalAlign: "middle",
                                                    fontWeight: "bold",
                                                    marginLeft: 5,
                                                    color: "#219653",
                                                }}
                                            />
                                            <IonText>Accepted</IonText>
                                            <br />
                                            <IonText>{moment.utc(item.updatedAt).format("DD MMMM YYYY")}</IonText>
                                        </>
                                    )}
                            </FlexboxGrid>
                        )}
                    </IonCol>
                </IonRow>
            </FlexboxGrid>
        </>
    );
};

const mapStateToProps = (state: any) => ({
    grades: state.grades.grades,
    roles: state.roles.roles,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(TableRow);
