import React, { useEffect, useState, useRef } from "react";
import { IonGrid, IonIcon, IonCheckbox, IonText, IonSpinner } from "@ionic/react";
import { fileTrayFullOutline } from "ionicons/icons";
import TableRequestRow from "../tableRow/tableRequestRow";
import "./contactsTable.css";
import GradeBox from "../gradeBox/gradeBox";
import ClassBox from "../classBox/classBox";
import { FlexboxGrid, CheckPicker } from "rsuite";
import InfiniteScroll from "react-infinite-scroller";

//redux
import { connect } from "react-redux";
import {
    fetchAccessRequests,
    contactsSetSelectedContacts,
    contactsResetContacts,
    invitationsResetContacts
} from "../../../stores/contacts/actions";
import { CACHE_USER_LOGIN_ROLE_NAME } from "../../../utils/StorageUtil";
import useGetCacheTenantId from "../../../hooks/useGetCacheTenantId";


import { Storage } from "@ionic/storage";

import * as integration from "scholarpresent-integration";

const ContactsTable: React.FC<{
    isTab: string;
    accessRequests:any[];
    accessRequestsNextToken: any;
    accessRequestsTotalNumberOfPages : any;
    fetchAccessRequests:Function;
    searchText: string;
    loading: boolean;
    loadingInvitaion: boolean;
    contactsSetSelectedContacts: Function;
    onSetStaff: Function;
    onSetLearner: Function;
    grades: any[];
    classes: any[];
    filter: string;
    contactsResetContacts: Function;
    invitationsResetContacts:Function;
}> = ({
    isTab,
    accessRequests,
    accessRequestsNextToken,
    accessRequestsTotalNumberOfPages,
    fetchAccessRequests,
    searchText,
    loading,
    loadingInvitaion,
    contactsSetSelectedContacts,
    onSetStaff,
    onSetLearner,
    grades,
    classes,
    filter,
    contactsResetContacts,
    invitationsResetContacts
}) => {
    const [openGrade, setOpenGrade] = useState(false);
    const [openClass, setOpenClass] = useState(false);
    const [contactsDup, setContactsDup] = useState<any>([]);
    const [invitationsDup, setInvitationsDup] = useState<any>([]);

    const [accessRequestsDup, setAccessRequestsDup] = useState<any>([]);

    const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
    const [selectedInvitations, setSelectedInvitations] = useState<any[]>([]);
    const [selectedGrades, setSelectedGrades] = useState<any[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<any[]>([]);
    const [gradesMod, setGradesMod] = useState<any[]>([]);
    const [classesMod, setClassesMod] = useState<any[]>([]);
    const [countUser, setCountUser] = useState<number>(0);
    const [countInvitation, setCountInvitation] = useState<number>(0);

    const [userLogonRoleName, setUserLogonRoleName] = useState<string>("Parent");
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [isInvitationFirstLoad, setIsInvitationFirstLoad] = useState<boolean>(true);
    const [isAccessRequestsFirstLoad, setIsAccessRequestsFirstLoad] = useState<boolean>(true);

    const [invitationRef, setInvitationRef] = useState<HTMLDivElement>();

    const prevContactsNextTokenRef = useRef();
    const prevContactsRef:any = useRef();

    const prevInvitationsNextTokenRef = useRef();
    const prevInvitationsRef:any = useRef();
    let tenantId:string = useGetCacheTenantId();

    const [searchNextTokenState, setSearchNextTokenState] = useState<any>({
        searchFirstNameNextToken : undefined,
        searchLastNameNextToken : undefined
    });


    const prevContactsNextToken = prevContactsNextTokenRef.current;
    const prevContacts = prevContactsRef.current;

    const prevInvitationsNextToken = prevInvitationsNextTokenRef.current;
    const prevInvitations = prevInvitationsRef.current;

    useEffect(() => {
        console.log("1-useEffect First load isTab ", isTab ," isFirstLoad ", isFirstLoad);

        if(isFirstLoad && isTab === "Requests"){
                fetchAccessRequests(null);
                setIsAccessRequestsFirstLoad(false);
                setIsFirstLoad(false);
        }

        if (searchText.length >= 3) {
            handleSearchUsers();
        } 

    }, [isTab , accessRequests,searchText]);

    useEffect(() => {
        console.log("4-useEffect accessRequests ", accessRequests);
        setAccessRequestsDup(accessRequests);
    }, [accessRequests]);

   
    useEffect(() => {
        console.log("3-useEffect contactsDup ", contactsDup, " CountUser ", countUser ,  " searchNextTokenState ",searchNextTokenState );
    },[contactsDup, countUser, searchNextTokenState])
    useEffect(() => {
        console.log("6-useEffect accessRequestsDup ", accessRequestsDup );
    },[accessRequestsDup])
    useEffect(() => {
        console.log("5-useEffect ")
        contactsSetSelectedContacts(selectedContacts);
    }, [selectedContacts]);
    
    useEffect(() => {
        console.log("4-useEffect grades ", grades);

        let gradesTemp: any[] = [];
        grades.map((grade: any) => {
            gradesTemp.push({
                label: grade.gradeName,
                value: grade.id,
            });
        });
        setGradesMod([...gradesTemp]);
    }, [grades]);
    
    useEffect(() => {
        console.log("4-useEffect grades ");

        let classesMod: any[] = [];
        classes.map((cls: any) => {
            classesMod.push({
                label: cls.className,
                value: cls.id,
            });
        });
        setClassesMod([...classesMod]);
    }, [classes]);


    const handleSearchUsers = async () => {
        const searchResults = await integration.searchUserByFirstOrLastName(tenantId,searchText);
        console.log("handleSearchUsers searchResults ", searchResults);
        if (Array.isArray(searchResults.items)) {
            setContactsDup(searchResults.items);
            setCountUser(searchResults.items.length);
        }
        setSearchNextTokenState({
            searchFirstNameNextToken : searchResults.nextTokenFirstName,
            searchLastNameNextToken : searchResults.nextTokenLastName
        })
    };

    const handleSelectRow = (item: any, checked: boolean) => {
        if (checked) {
            setSelectedContacts((grps: any) => {
                let contactsArr: any[] = [...grps];
                let filteredContacts = grps.filter((grp: any) => grp.id === item.id);
                if (!filteredContacts.length) {
                    contactsArr.push(item);
                }
                return contactsArr;
            });
        } else {
            setSelectedContacts((grps: any) => {
                let filteredContacts = grps.filter((group: any) => group.id !== item.id);
                return filteredContacts;
            });
        }
    };
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            //setSelectedContacts(contacts);
        } else {
            setSelectedContacts([]);
        }
    };
   


    const handleAccessRequestsHasMore = () => {

        console.log("handleAccessRequestsHasMore  accessRequestsNextToken ", accessRequestsNextToken );
        
        
        return accessRequestsNextToken != accessRequestsTotalNumberOfPages && accessRequestsNextToken < accessRequestsTotalNumberOfPages
        ;
    };
    

    const onPageReload = async()=>{
        console.log("###### onPageReload #######")
        fetchAccessRequests(null);

    }

    return (
        <div style={{ zIndex: 3 }}>
            <IonGrid className="contactTable">
                <FlexboxGrid className="table-head">
                     <FlexboxGrid.Item className="col-row green-text surname-width">
                         Request Role
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="col-row green-text surname-width">
                         Request Name
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="col-row green-text surname-width">Request Surname</FlexboxGrid.Item>
                    <FlexboxGrid.Item
                        className="col-row grade-column green-text"
                        style={{ position: "relative", cursor: "pointer" }}
                    >Grade
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="col-row green-text phone-column ">Phone</FlexboxGrid.Item>
                    <FlexboxGrid.Item className="col-row green-text email-column">Email</FlexboxGrid.Item>
                </FlexboxGrid>
                <div>
                    <>
                        {isTab === "Contacts" ? (
                            <>
                                {loading && (
                                    <div style={{ textAlign: "center", padding: 10 }}>
                                        <IonSpinner name="bubbles" style={{ transform: "scale(1.5)" }} color="success" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {loadingInvitaion && (
                                    <div style={{ textAlign: "center", padding: 10 }}>
                                        <IonSpinner name="bubbles" style={{ transform: "scale(1.5)" }} color="success" />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                    {searchText.length >= 1 ? (
                        <>
                            {contactsDup.map((item: any, i: number) => (
                                <TableRequestRow
                                    isTab={isTab}
                                    key={i}
                                    item={item}
                                    onSelect={(item: any, checked: boolean) => {
                                        handleSelectRow(item, checked);
                                    }}
                                    onPageReload={()=>onPageReload()}
                                    selectedContacts={selectedContacts}
                                    onSetStaff={(staff: any) => {
                                        onSetStaff(staff);
                                    }}
                                    onSetLearner={(staff: any) => {
                                        onSetLearner(staff);
                                    }}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <div style={{ height: "calc(100vh - 335px)", overflow: "auto" }}>
                                    <InfiniteScroll
                                        initialLoad = {false}
                                        pageStart={0}
                                        loadMore={() => {
                                            console.log("Collecting more access request...");
                                            fetchAccessRequests(accessRequestsNextToken);
                                        }}
                                        hasMore={handleAccessRequestsHasMore()}
                                        loader={
                                            <div style={{ textAlign: "center", padding: 10 }}>
                                                <IonSpinner
                                                    name="bubbles"
                                                    style={{ transform: "scale(2.5)" }}
                                                    color="success"
                                                />
                                            </div>
                                        }
                                        useWindow={false}
                                        // getScrollParent={() => this.scrollParentRef}
                                    >
                                        {accessRequestsDup.map((item: any, i: number) => {
                                            console.log("accessRequestsDup item ", item);
                                            return (
                                                <TableRequestRow
                                                    isTab={isTab}
                                                    key={i}
                                                    item={item}
                                                    onSelect={(item: any, checked: boolean) => {
                                                        handleSelectRow(item, checked);
                                                    }}
                                                    onPageReload={()=>onPageReload()}

                                                    selectedContacts={selectedContacts}
                                                    onSetStaff={(staff: any) => {}}
                                                    onSetLearner={(staff: any) => {}}
                                                />
                                            );
                                        })}
                                    </InfiniteScroll>
                                </div>
                        </>
                    )}
                </div>
            </IonGrid>
        </div>
    );
};
const mapStateToProps = (state: any) => ({
    contacts: state.contacts.contacts,
    invitations: state.contacts.invitations,
    accessRequests: state.contacts.accessRequests,
    contactsNextToken: state.contacts.contactsNextToken,
    invitationNextToken: state.contacts.invitationNextToken,
    accessRequetsNextToken: state.contacts.accessRequetsNextToken,
    invitationTotalNumberOfPages: state.contacts.invitationTotalNumberOfPages,
    searchText: state.contacts.searchText,
    loading: state.contacts.loading,
    loadingInvitaion: state.contacts.loadingInvitation,
    grades: state.grades.grades,
    classes: state.classes.classes,
    filter: state.contacts.filter,
});
const mapDispatchToProps = {
    fetchAccessRequests,
    contactsSetSelectedContacts,
    contactsResetContacts,
    invitationsResetContacts
    
};
export default connect(mapStateToProps, mapDispatchToProps)(ContactsTable);
