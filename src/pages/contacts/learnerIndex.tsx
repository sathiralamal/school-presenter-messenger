import React, { useState, useEffect, Props } from "react";
import {
  IonLabel,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonInput,
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
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import { TENANT_ID,CACHE_USER_LOGIN_ID } from '../../utils/StorageUtil';
import { getContactDetails } from '../../utils/Utils';

import { Storage } from '@ionic/storage';

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
import TourComponent from '../../components/tours/tour-component';
import { useParams } from 'react-router-dom';


//redux
import { connect } from "react-redux";
import {
  contactsSetSearchText,
  fetchContacts,
  contactsRemoveContacts,
  contactsSetFilter
} from "../../stores/contacts/actions";
import { AnyRecord } from "dns";
import * as integration from "scholarpresent-integration";
const ContactsPage: React.FC<{
  contactsSetSearchText: Function;
  fetchContacts: Function;
  searchText: string;
  selectedContacts: any[];
  grades: any[];
  contactsRemoveContacts: Function;
  contactsSetFilter: Function;
}> = ({
  contactsSetSearchText,
  fetchContacts,
  searchText,
  selectedContacts,
  grades,
  contactsRemoveContacts,
  contactsSetFilter,
  
}) => {
  const filterData = [
  // {
  //   label: "All Contacts",
  //   value: "all"
  // }, 
  {
    label: "Learners",
    value: "Student"
  },
  {
    label: "Parents",
    value: "Parent"
  }
  , {
    label: "Teacher",
    value: "Teacher"
  },{
    label: "Principal",
    value: "Principal"
  },{
    label: "Other Stuff",
    value: "Other Staff"
  },];

  const [tab, setTab] = useState<string>("Contacts");
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tutorialType, setTutorialType] = useState<string>("learner");

  const [importedContacts, setImportedContacts] = useState<any[]>([]);
  const [invitingContacts, setInvitingContacts] = useState<any[]>([]);
  const [mobile, setMobile] = useState(window.innerWidth < 992)
  const [gradeCount, setGradeCount] = useState<any>(0);
  const [classCount, setClassCount] = useState<any>(0);
  const [preparedGroups, setPreparedGroups] = useState<any>(0);
  const [showProgressGroupUpload , setShowProgressGroupUpload]  = useState<any>(0);
  const [isGeneratedGroupActive, setIsGeneratedGroupActive] = useState<boolean>(true);
  const store = new Storage();


  


  const {showtour,tourrole}:any = useParams();
  useEffect(() => {
    console.log(">>>> showTour ", showtour, " tourRole ", tourrole)
    setShowModal(showtour);
    setTutorialType(tourrole);

  },[showtour,tourrole ]);
  useEffect(() => { 
    console.log(">>>> preparedGroups ", preparedGroups);
  });
  
  const getGrade = (gradeId: string) => {
    console.log("***** getGrade gradeId ",gradeId );
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
          <td>${getContactDetails(contact, "sms")}</td>
          <td>
            <div style="width: 50px; word-wrap: break-word">
              ${getContactDetails(contact, "email")}
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
   
  return (
    <>
      {!mobile? <TourComponent tourRole={tutorialType} showModal={showModal}/>:""}      
      <div className="fixed-top-Bar">
        <FlexboxGrid className="aboveTable" fixed={true}>
          <FlexboxGrid.Item className="left">
          <div className="divider" />
            <IonInput
              placeholder="Search for e.g. John"
              onIonChange={(e) => {console.log("*** contactsSetSearchText "); contactsSetSearchText(e.detail.value!)}}
              clearInput
              value={searchText}
              id="searcLearnerhName"
            ></IonInput>
            <IonButton className="outlineBtn btn-green">
              <IonIcon
                icon={search}
                style={{ fontSize: 20, verticalAlign: "middle" }}
              />
            </IonButton>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
      <ContactsTable
        isTab={tab}
        onSetStaff={(item: any) => {
          setStaff(item);
          setEditStaffOpen(true);
        }}
        onSetLearner={(item: any) => {
          setLearner(item);
          setEditLearnerOpen(true);
        }}
        accessRequestsNextToken={undefined}  // Placeholder undefined value for accessRequestsNextToken
        accessRequestsTotalNumberOfPages={undefined} 
      />
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
  contactsSetFilter
};
export default connect(mapStateToProps, mapDispatchToProps)(ContactsPage);
