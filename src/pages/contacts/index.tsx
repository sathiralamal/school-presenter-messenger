import React, { useState, useEffect, Props } from "react";
import { Analytics } from "aws-amplify";
import _ from "lodash";

import {
  IonLabel,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonInput,
  useIonAlert,
} from "@ionic/react";
import {
  funnel,
  search,
  trash,
  pencil,
  add,
  documentTextOutline,
  chevronDown,
} from "ionicons/icons";
import "./contacts.css";
import { FlexboxGrid, InputPicker, Dropdown } from "rsuite";
import ContactsTable from "../../components/contacts/contactsTable/contactsTable";
import JoinRequestTable from "../../components/contacts/contactsTable/joinRequestsTable";

import { jsPDF } from "jspdf";
import {
  TENANT_ID,
  CACHE_USER_LOGIN_ID,
  TOUR_ACTIVE,
} from "../../utils/StorageUtil";
import { Storage } from "@ionic/storage";
import registerServiceWorker from "../../ServiceWorker";

// popups
import NewLearner from "../../components/contacts/newLearner/newLearner";
import NewStaff from "../../components/contacts/newStaff/newStaff";
import AddLearnerToGroup from "../../components/contacts/addLearnerToGroup/addLearnerToGroup";
import ColumnMapping from "../../components/contacts/columnMapping/columnMapping";
import CreateGroupsSendInvitations from "../../components/contacts/createGroupsSendInvitations/createGroupsSendInvitations";
import SendInvitations from "../../components/contacts/sendInvitations/sendInvitations";
import UploadModal from "../../components/contacts/uploadModal/uploadModal";
import StaffsToGroup from "../../components/contacts/staffsToGroup/StaffsToGroup";
import AddContact from "../../components/contacts/addContact/addContact";
import SendInvitations2nd from "../../components/contacts/sendInvitations2nd/sendInvitations2nd";
import NewInvite from "../../components/contacts/newInvite/newInvite";
import EditStaff from "../../components/contacts/editStaff/editStaff";
import EditLearner from "../../components/contacts/editLearner/editLearner";
import ImportContact from "../../components/contacts/importContact/importContact";
import TourComponent from "../../components/tours/tour-component";
import { useParams } from "react-router-dom";

//redux
import { connect } from "react-redux";
import {
  contactsSetSearchText,
  fetchContacts,
  contactsRemoveContacts,
  contactsSetFilter,
  contactsResetContacts,
} from "../../stores/contacts/actions";
import { AnyRecord } from "dns";
import * as integration from "scholarpresent-integration";
import useHandleNotification from "../../hooks/useHandleNotification";
const ContactsPage: React.FC<{
  contactsSetSearchText: Function;
  fetchContacts: Function;
  searchText: string;
  selectedContacts: any[];
  grades: any[];
  contactsRemoveContacts: Function;
  contactsSetFilter: Function;
  contactsResetContacts: Function;
}> = ({
  contactsSetSearchText,
  fetchContacts,
  searchText,
  selectedContacts,
  grades,
  contactsRemoveContacts,
  contactsSetFilter,
  contactsResetContacts,
}) => {
  const filterData = [
    {
      label: "Learners",
      value: "Student",
    },
    {
      label: "Parents",
      value: "Parent",
    },
    {
      label: "Teacher",
      value: "Teacher",
    },
    {
      label: "Principal",
      value: "Principal",
    },
    {
      label: "Other Stuff",
      value: "Other Staff",
    },
  ];

  const [tab, setTab] = useState<string>("Contacts");
  const [present] = useIonAlert();

  const [addContact, setAddContact] = useState<boolean>(false);
  const [newLearner, setNewLearner] = useState<boolean>(false);
  const [newStaff, setNewStaff] = useState<boolean>(false);
  const [newL2G, setNewL2G] = useState<boolean>(false);
  const [newMap, setNewMap] = useState<boolean>(false);
  const [newCGSI, setNewCGSI] = useState<boolean>(false);
  const [newInvite, setNewInvite] = useState<boolean>(false);
  const [newSend, setNewSend] = useState<boolean>(false);
  const [newSend2nd, setNewSend2nd] = useState<boolean>(false);
  const [uploadModal, setuploadModal] = useState<boolean>(false);
  const [staffsToGroupModal, setStaffsToGroupModal] = useState<boolean>(false);
  const [learner, setLearner] = useState<any>({});
  const [staff, setStaff] = useState<any>({});
  const [editStaffOpen, setEditStaffOpen] = useState<boolean>(false);
  const [editLearnerOpen, setEditLearnerOpen] = useState<boolean>(false);
  const [csvHeaders, setCSVHeaders] = useState<any[]>([]);
  const [csvData, setCSVData] = useState<any[]>([]);
  const [importss, setImportss] = useState<boolean>(false);
  const [importType, setImportType] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tutorialType, setTutorialType] = useState<string>("learner");

  const [importedContacts, setImportedContacts] = useState<any[]>([]);
  const [invitingContacts, setInvitingContacts] = useState<any[]>([]);
  const [mobile, setMobile] = useState(window.innerWidth < 992);
  const [gradeCount, setGradeCount] = useState<any>(0);
  const [classCount, setClassCount] = useState<any>(0);
  const [preparedGroups, setPreparedGroups] = useState<any>(0);
  const [showProgressGroupUpload, setShowProgressGroupUpload] =
    useState<any>(0);
  const [isGeneratedGroupActive, setIsGeneratedGroupActive] =
    useState<boolean>(true);
  const [lastNativeNotification, lastWebNotification] = useHandleNotification();

  const store = new Storage();

  const { showtour, tourrole }: any = useParams();
  useEffect(() => {
    console.log(">>>> showTour ", showtour, " tourRole ", tourrole);
    setShowModal(showtour);
    setTutorialType(tourrole);
    handleCacheTourStatus(showtour);
    Analytics.record({ name: "view-message", attributes: { action: "load" } });
    //console.log("||||| lastWebNotification ", lastWebNotification, " lastWebNotification ", lastWebNotification);
  }, [showtour, tourrole]);
  useEffect(() => {
    console.log(">>>> preparedGroups ", preparedGroups);
  });

  // useEffect(() => {
  //     console.log(">>>> lastWebNotification ", lastWebNotification, " lastWebNotification ", lastWebNotification);
  //     // store.create().then(async(value)=>{
  //     //     let userId = await store.get(CACHE_USER_LOGIN_ID);
  //     //     let tenantId = await store.get(TENANT_ID);
  //     //     registerServiceWorker(tenantId, userId).then(value=>{
  //     //         console.log(">>>> value ", value);

  //     //         const eventHandler: ServiceWorkerContainer["onmessage"] = (event) => {
  //     //             console.log(" eventHandler: ServiceWorkerContainer[onmessage]  event ", event);
  //     //             console.log(" eventHandler: ServiceWorkerContainer[onmessage]  event ", JSON.stringify(event));

  //     //             if (event.data) {
  //     //                 if (event.data.type === "MSG_RECEIVED") {
  //     //                     //setLastNativeNotification(event.data);
  //     //                     // const store = new Storage();
  //     //                     // store.create().then(value=>{
  //     //                     //     store.set("MESSAGE_"+event.data.messageId, event.data.messageId);
  //     //                     // })

  //     //                 } else if (event.data.type === "RELOAD") {
  //     //                     // @TODO: if backend return conversationId. Redirect users to messaging page
  //     //                     console.log("if backend return conversationId. Redirect users to messaging page")
  //     //                     window.location.reload();
  //     //                 }
  //     //             }
  //     //         };

  //     //         navigator.serviceWorker.onmessage = eventHandler;
  //     //         navigator.serviceWorker.startMessages();

  //     //         return () => {
  //     //             navigator.serviceWorker.removeEventListener("message", eventHandler);
  //     //         };
  //     //     })
  //     // })

  // },[lastNativeNotification, lastWebNotification ]);

  const handleCacheTourStatus = (tourStatus: boolean) => {
    store.create().then((value: any) => {
      store.set(TOUR_ACTIVE, tourStatus);
    });
  };

  const handleRegisterNotification = () => {
    console.log("handleRegisterNotification ", handleRegisterNotification);
  };

  const handleSegmentChange = (e: any) => {
    setTab(e.detail.value);
  };
  const handleDeleteLearner = async () => {
    try {
      present({
        message: `This action is unrecoverable! Are you sure want to delete these contacts?`,
        buttons: [
          {
            text: "Ok",
            handler: async (d) => {
              try {
                let promises: any[] = [];
                let contactIds: any[] = [];
                selectedContacts.map((contact: any) => {
                  promises.push(integration.deleteUserInfo(contact.id));
                  contactIds.push(contact.id);
                });
                const resp = await Promise.all(promises);
                contactsRemoveContacts(contactIds);
                // fetchContacts();
                // handleFetchGroups();
              } catch (err) {
                console.log("error ", err);
                present({
                  message:
                    "Something went wrong! Please try again after sometime",
                  buttons: [
                    {
                      text: "Ok",
                    },
                  ],
                });
              }
            },
          },
          {
            text: "Cancel",
            handler: async (d) => {
              console.log("cancel...");
            },
          },
        ],
        onDidDismiss: (e) => console.log("did dismiss"),
      });
    } catch (err) {
      console.log("handleDeleteLearner error ", err);
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
  const handleExportPDF = () => {
    let html = `<html>
      <body style="margin: 30px">
      <head>
        <style>
          #customers {
            font-family: Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
          #customers td, #customers th {
            border: 1px solid #ddd;
            padding: 3px;
            font-size: 5px
          }
          #customers tr:nth-child(even){background-color: #f2f2f2;}
          #customers th {
            padding-top: 5px;
            padding-bottom: 5px;
            text-align: left;
            background-color: #04AA6D;
            color: white;
            font-size: 5px
          }
        </style>
        </head>
        <table id="customers">
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Grade</th>
            <th>Class</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        `;
    selectedContacts.map((contact: any) => {
      html += `
        <tr>
          <td>${contact.firstName}</td>
          <td>${contact.lastName}</td>
          <td>${getGrade(contact?.className?.gradeID)}</td>
          <td>${contact?.className?.className}</td>
          <td>${contact.contactPhone}</td>
          <td>
            <div style="width: 50px; word-wrap: break-word">
              ${contact.contactEmail}
            </div>
          </td>
        </tr>
      `;
    });
    html += `</table></body></html>`;
    const doc = new jsPDF();
    doc.html(html, {
      filename: `iConnectContacts.pdf`,
      callback: function (doc) {
        doc.save();
      },
      x: 10,
      y: 10,
      margin: [10, 0, 10, 0],
    });
  };
  // store.create().then((value: any) => {
  //     store.get(CACHE_USER_LOGIN_ID).then((value: any) => {
  //         integration.listContactForStudentOrParent(value).then((value: any) => {
  //             console.log("listContactForStudentOrParent value ", value);

  //         });
  //     });
  // });

  return (
    <>
      {!mobile ? (
        <TourComponent tourRole={tutorialType} showModal={showModal} />
      ) : (
        ""
      )}
      <div className="fixed-top-Bar">
        <IonSegment
          value={tab}
          mode="md"
          className="contactSegment"
          onIonChange={(e) => handleSegmentChange(e)}
        >
          <IonSegmentButton
            id="btnContacts"
            className="contactSegmentBtn"
            value="Contacts"
          >
            <IonLabel className="contactSegmentLable">Contacts</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton
            id="btnInvitations"
            className="contactSegmentBtn"
            value="Invitations"
          >
            <IonLabel className="contactSegmentLable">Invitations</IonLabel>
          </IonSegmentButton>
          <FlexboxGrid className="desktop-only">
            <IonSegmentButton
              id="btnRequests"
              className="contactSegmentBtn"
              value="Requests"
            >
              <IonLabel className="contactSegmentLable">Requests</IonLabel>
            </IonSegmentButton>
          </FlexboxGrid>
        </IonSegment>
        <FlexboxGrid className="aboveTable" fixed={true}>
          {tab === "Requests" ? ( <>
              <FlexboxGrid.Item className="left">
                <IonIcon
                  icon={funnel}
                  style={{
                    fontSize: 18,
                    verticalAlign: "middle",
                    marginLeft: 5,
                  }}
                />
                <InputPicker
                  searchable={false}
                  data={filterData}
                  className="aboveTableSelect"
                  onChange={(value) => {
                    console.log("filtered value ", value);
                    contactsResetContacts();
                    fetchContacts(undefined, value);
                    setRoleFilter(value);
                    contactsSetFilter(value);
                  }}
                />
                <div className="divider" />
                <IonInput
                  id="searchName"
                  placeholder="Search for e.g. John"
                  onIonChange={(e) => {
                    console.log(
                      "*** contactsSetSearchText e.detail.value ",
                      e.detail.value
                    );
                    if (e.detail.value && e.detail.value?.length > 0) {
                      contactsSetSearchText(e.detail.value!);
                    } else {
                      fetchContacts(undefined, roleFilter);
                      contactsSetSearchText(e.detail.value!);
                    }
                  }}
                  clearInput
                  className="search-input"
                  value={searchText}
                />
                <IonButton className="outlineBtn btn-green">
                  <IonIcon
                    icon={search}
                    style={{ fontSize: 20, verticalAlign: "middle" }}
                  />
                </IonButton>
              </FlexboxGrid.Item>
            </>) :
          tab === "Contacts" ? (
            <>
              <FlexboxGrid.Item className="left">
                <IonIcon
                  icon={funnel}
                  style={{
                    fontSize: 18,
                    verticalAlign: "middle",
                    marginLeft: 5,
                  }}
                />
                <InputPicker
                  searchable={false}
                  data={filterData}
                  className="aboveTableSelect"
                  onChange={(value) => {
                    console.log("filtered value ", value);
                    contactsResetContacts();
                    fetchContacts(undefined, value);
                    setRoleFilter(value);
                    contactsSetFilter(value);
                  }}
                />
                <div className="divider" />
                <IonInput
                  id="searchName"
                  placeholder="Search for e.g. John"
                  onIonChange={(e) => {
                    console.log(
                      "*** contactsSetSearchText e.detail.value ",
                      e.detail.value
                    );
                    if (e.detail.value && e.detail.value?.length > 0) {
                      contactsSetSearchText(e.detail.value!);
                    } else {
                      fetchContacts(undefined, roleFilter);
                      contactsSetSearchText(e.detail.value!);
                    }
                  }}
                  clearInput
                  className="search-input"
                  value={searchText}
                />
                <IonButton className="outlineBtn btn-green">
                  <IonIcon
                    icon={search}
                    style={{ fontSize: 20, verticalAlign: "middle" }}
                  />
                </IonButton>
              </FlexboxGrid.Item>
            </>
          ) : (
            ""
          )}
          <div style={{ display: "flex" }}>
            <FlexboxGrid.Item className="contact-right">
              {selectedContacts.length > 0 && tab === "Contacts" && (
                <IonButton
                  fill="outline"
                  className="outlineBtn btn-1st hide-mob"
                  disabled={selectedContacts.length > 0 ? false : true}
                  onClick={() => {
                    handleDeleteLearner();
                  }}
                >
                  <IonIcon
                    icon={trash}
                    style={{
                      verticalAlign: "middle",
                      color: "#bf0000",
                    }}
                  />
                </IonButton>
              )}
              {/* <IonButton fill="outline" className="outlineBtn btn-2nd hide-mob">
            <IonIcon
              icon={pencil}
              style={{
                fontSize: 20,
                verticalAlign: "middle",
                color: "#219653",
              }}
            />
          </IonButton> */}
              {
              tab === "Requests" ? (<></>):
              tab === "Contacts" ? (
                <>
                  <Dropdown
                    renderTitle={(children) => {
                      return (
                        <IonButton
                          fill="outline"
                          className="outlineBtn btn-right"
                          id="addContact"
                        >
                          <IonIcon
                            icon={add}
                            style={{
                              fontSize: 22,
                              verticalAlign: "middle",
                              color: "#219653",
                              marginRight: 7,
                            }}
                          />
                          Add Contact
                          <IonIcon
                            icon={chevronDown}
                            style={{
                              fontSize: 20,
                              verticalAlign: "middle",
                              color: "#219653",
                              marginLeft: 7,
                            }}
                          />
                        </IonButton>
                      );
                    }}
                    onSelect={(value) => {
                      if (value === "learner") {
                        setNewLearner(!newLearner);
                      } else {
                        setNewStaff(!newStaff);
                      }
                    }}
                  >
                    <Dropdown.Item
                      eventKey="learner"
                      id="dropDownAddNewLearner"
                    >
                      Add New Learner
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="staff" id="dropDownAddNewStaff">
                      Add New Staff
                    </Dropdown.Item>
                  </Dropdown>

                  <Dropdown
                    renderTitle={(children) => {
                      return (
                        <IonButton
                          fill="outline"
                          className="outlineBtn btn-right"
                        >
                          Import contact
                          <IonIcon
                            icon={chevronDown}
                            style={{
                              fontSize: 22,
                              verticalAlign: "middle",
                              color: "#219653",
                              marginLeft: 7,
                            }}
                          />
                        </IonButton>
                      );
                    }}
                    onSelect={(value) => {
                      if (value === "learner") {
                        setImportType("learner");
                        setuploadModal(!uploadModal);
                      } else {
                        setImportType("staff");
                        setuploadModal(!uploadModal);
                      }
                    }}
                  >
                    <Dropdown.Item eventKey="learner">
                      Learner and Parents
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="staff">Staff Member</Dropdown.Item>
                  </Dropdown>
                </>
              ) : (
                <IonButton
                  onClick={() => {
                    setNewInvite(!newInvite);
                  }}
                  fill="outline"
                  className="outlineBtn btn-right btn-invite"
                >
                  <IonIcon
                    icon={add}
                    style={{
                      fontSize: 22,
                      verticalAlign: "middle",
                      color: "#219653",
                      marginRight: 7,
                    }}
                  />
                  New Invitation
                </IonButton>
              )}
              <IonButton
                fill="outline"
                className="outlineBtn btn-right hide-mob"
                disabled={selectedContacts.length > 0 ? false : true}
                onClick={() => {
                  handleExportPDF();
                }}
                style={{ marginBottom: 10 }}
              >
                <IonIcon
                  icon={documentTextOutline}
                  style={{
                    fontSize: 22,
                    verticalAlign: "middle",
                    color: "#219653",
                    marginRight: 7,
                  }}
                />
                Export list to PDF
              </IonButton>
              {/* <AddContact
                            addCon={addContact}
                            learner={() => {
                                setNewLearner(!newLearner);
                            }}
                            staff={() => {
                                setNewStaff(!newStaff);
                            }}
                            close={() => {
                                setAddContact(!addContact);
                            }}
                        /> */}
              <ImportContact
                importCon={importss}
                onSelect={(value: string) => {
                  setImportType(value);
                  setuploadModal(!uploadModal);
                }}
                close={() => {
                  setImportss(!importss);
                }}
              />
            </FlexboxGrid.Item>
            <NewLearner
              open={newLearner}
              closee={() => {
                setNewLearner(!newLearner);
              }}
              next={(learnerInfo: any) => {
                setLearner(learnerInfo);
                setNewL2G(!newL2G);
              }}
            />
            <NewStaff
              open={newStaff}
              closee={() => {
                setNewStaff(!newStaff);
              }}
              next={(staffInfo: any) => {
                setStaff(staffInfo);
                setStaffsToGroupModal(!staffsToGroupModal);
              }}
            />
            <AddLearnerToGroup
              open={newL2G}
              closee={() => {
                setNewL2G(!newL2G);
              }}
              learner={learner}
            />
            <div className="column-mapping">
              <ColumnMapping
                open={newMap}
                closee={() => {
                  setNewMap(!newMap);
                }}
                done={(
                  items: any[],
                  gradeCount: any,
                  classCount: any,
                  preparedGroups: any
                ) => {
                  console.log(
                    "**** done items ",
                    items,
                    " gradeCount ",
                    gradeCount,
                    " classCount ",
                    classCount,
                    " preparedGroups ",
                    preparedGroups
                  );

                  setNewCGSI(!newCGSI);
                  setImportedContacts(items);
                  setGradeCount(gradeCount);
                  setClassCount(classCount);
                  console.log("preparedGroups ", preparedGroups);
                  setPreparedGroups(preparedGroups);
                }}
                headers={csvHeaders}
                csvData={csvData}
                type={importType}
              />
            </div>
            <CreateGroupsSendInvitations
              open={newCGSI}
              closee={() => {
                setNewCGSI(!newCGSI);
              }}
              next={async () => {
                setNewSend(!newSend);
                //if(isGeneratedGroupActive){
                let i,
                  j,
                  chunks,
                  chunkSize = 50;
                let percent = 0;
                let groupsResp: any[] = [];
                await store.create();
                let userId = await store.get(CACHE_USER_LOGIN_ID);
                let tenantId = await store.get(TENANT_ID);
                let groupsTosearch = [];
                for (let k = 0; k < preparedGroups.length; k++) {
                  groupsTosearch.push(preparedGroups[k].groupName);
                }
                let searchResults = await integration.bulkSearchByGroupName(
                  groupsTosearch
                );
                console.log("searchResults :", searchResults);

                let updateGroupList = [];
                let newGroupList = [];

                for (
                  let rIndex = 0;
                  rIndex < searchResults.items.length;
                  rIndex++
                ) {
                  if (searchResults.items[rIndex].groupName) {
                    let updateGroupObj = {
                      ...preparedGroups[rIndex],
                      id: searchResults.items[rIndex].id,
                    };
                    updateGroupList.push(updateGroupObj);
                  } else {
                    newGroupList.push(preparedGroups[rIndex]);
                  }
                }
                if (searchResults?.items.length == 0) {
                  newGroupList = preparedGroups;
                }
                // New Groups
                console.log("**** newGroupList ", newGroupList);
                for (i = 0, j = newGroupList.length; i < j; i += chunkSize) {
                  chunks = newGroupList.slice(i, i + chunkSize);
                  let respUploads = await integration.bulkGroupUpload(
                    tenantId,
                    userId,
                    chunks
                  );
                  groupsResp.push(respUploads);
                  percent = (i / groupsResp.length) * 100;
                  setShowProgressGroupUpload(parseInt(percent.toString()));
                }
                for (i = 0, j = updateGroupList.length; i < j; i += chunkSize) {
                  chunks = updateGroupList.slice(i, i + chunkSize);
                  let promises = [];
                  for (
                    let chuckIndex = 0;
                    chuckIndex < chunks.length;
                    chuckIndex++
                  ) {
                    promises.push(
                      integration.updateGroupInfo(
                        chunks[chuckIndex].id,
                        chunks[chuckIndex].groupName,
                        chunks[chuckIndex].groupMembers,
                        chunks[chuckIndex].groupAdminUsers
                      )
                    );
                  }
                  let updateResp = await Promise.all(promises);
                  percent = (i / updateResp.length) * 100;
                  setShowProgressGroupUpload(parseInt(percent.toString()));
                }

                console.log("groupsResp ", groupsResp);
                //}
              }}
              onGenerateGroupSelect={(value: string, checked: boolean) => {
                console.log(
                  "onGenerateGroupSelect value ",
                  value,
                  " checked ",
                  checked
                );
                setIsGeneratedGroupActive(checked);
              }}
              showProgressGroupUpload={showProgressGroupUpload}
              importedContacts={importedContacts}
              gradeCount={gradeCount}
              classCount={classCount}
            />
            <SendInvitations
              open={newSend}
              closee={() => {
                setNewSend(!newSend);
              }}
              importedContacts={importedContacts}
            />
            <UploadModal
              open={uploadModal}
              closee={() => {
                setuploadModal(!uploadModal);
              }}
              next={(params: any) => {
                setNewMap(!newMap);
                setCSVData(params.csvData);
                setCSVHeaders(params.headers);
              }}
              type={importType}
            />
            <StaffsToGroup
              open={staffsToGroupModal}
              // open={true}
              closee={() => {
                setStaffsToGroupModal(!staffsToGroupModal);
              }}
              staff={staff}
            />
            <NewInvite
              open={newInvite}
              closee={() => {
                setNewInvite(!newInvite);
              }}
              next={(resp: any[]) => {
                console.log("NewInvite resp ", resp);
                setNewSend2nd(!newSend2nd);
                setInvitingContacts(resp);
              }}
            />
            <SendInvitations2nd
              open={newSend2nd}
              closee={() => {
                setNewSend2nd(!newSend2nd);
              }}
              contacts={invitingContacts}
            />
            <EditStaff
              open={editStaffOpen}
              closee={() => {
                setEditStaffOpen(false);
              }}
              staff={staff}
              onSuccess={() => {}}
            />
            <EditLearner
              open={editLearnerOpen}
              closee={() => {
                setEditLearnerOpen(false);
              }}
              learner={learner}
              onSuccess={() => {}}
            />
          </div>
        </FlexboxGrid>
      </div>
      { tab !== "Requests"?
        <ContactsTable
          isTab={tab}
          onSetStaff={(item: any) => {
            setStaff(item);
            setEditStaffOpen(true);
          }}
          onSetLearner={async(item: any) => {
            console.log("Open Learner edit ", item);
            if(item?.roleName ==="Student"){
              setLearner(item);
            }else{
              let lernerInfo = await integration.getUserInfo(item?.linkedUserId);
              console.log("*** lernerInfo ", lernerInfo);
              setLearner(lernerInfo);

            }
            setEditLearnerOpen(true);
          }}
          accessRequestsNextToken={undefined}  // Placeholder undefined value for accessRequestsNextToken
          accessRequestsTotalNumberOfPages={undefined} 
        />:
          <JoinRequestTable
          isTab={tab}
          onSetStaff={(item: any) => {
            setStaff(item);
            setEditStaffOpen(true);
          }}
          onSetLearner={async(item: any) => {
            console.log("Open Learner edit ", item);
            if(item?.roleName ==="Student"){
              setLearner(item);
            }else{
              let lernerInfo = await integration.getUserInfo(item?.linkedUserId);
              console.log("*** lernerInfo ", lernerInfo);
              setLearner(lernerInfo);

            }
            setEditLearnerOpen(true);
          }}
          accessRequestsNextToken={undefined}  // Placeholder undefined value for accessRequestsNextToken
          accessRequestsTotalNumberOfPages={undefined} 
        />
  
      }
    </>
  );
};

const mapStateToProps = (state: any) => ({
  contacts: state.contacts.contacts,
  searchText: state.contacts.searchText,
  selectedContacts: state.contacts.selectedContacts,
  grades: state.grades.grades,
});
const mapDispatchToProps = {
  contactsSetSearchText,
  fetchContacts,
  contactsRemoveContacts,
  contactsSetFilter,
  contactsResetContacts,
};
export default connect(mapStateToProps, mapDispatchToProps)(ContactsPage);
