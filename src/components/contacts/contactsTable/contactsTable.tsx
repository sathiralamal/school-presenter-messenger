import React, { useEffect, useState, useRef } from "react";
import { IonGrid, IonIcon, IonCheckbox, IonText, IonSpinner } from "@ionic/react";
import { fileTrayFullOutline } from "ionicons/icons";
import TableRow from "../tableRow/tableRow";
import "./contactsTable.css";
import GradeBox from "../gradeBox/gradeBox";
import ClassBox from "../classBox/classBox";
import { FlexboxGrid, CheckPicker } from "rsuite";
import InfiniteScroll from "react-infinite-scroller";

//redux
import { connect } from "react-redux";
import {
    fetchContacts,
    fetchInvitations,
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
    contacts: any[];
    invitations: any[];
    accessRequests:any[];
    contactsNextToken: any;
    invitationNextToken: any;
    invitationTotalNumberOfPages : any;
    accessRequestsNextToken: any;
    accessRequestsTotalNumberOfPages : any;
    fetchContacts: Function;
    fetchInvitations: Function;
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
    contacts,
    invitations,
    accessRequests,
    contactsNextToken,
    invitationNextToken,
    accessRequestsNextToken,
    invitationTotalNumberOfPages,
    accessRequestsTotalNumberOfPages,
    fetchContacts,
    fetchInvitations,
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

    
    useEffect(() => {
        prevContactsNextTokenRef.current = contactsNextToken;
        prevContactsRef.current = contacts;

        prevInvitationsNextTokenRef.current = invitationNextToken;
        prevInvitationsRef.current = invitations;

    });

    const prevContactsNextToken = prevContactsNextTokenRef.current;
    const prevContacts = prevContactsRef.current;

    const prevInvitationsNextToken = prevInvitationsNextTokenRef.current;
    const prevInvitations = prevInvitationsRef.current;

    useEffect(() => {
        console.log("1-useEffect First load isTab ", isTab ," isFirstLoad ", isFirstLoad);

        if(isFirstLoad){
            handleUserRole();
            console.log("useEffect FIRST LOADING Contacts");
            if (isTab === "Contacts") {
                if (searchText.length >= 3) {
                    handleSearchUsers();
                } else if(isFirstLoad) {
                    console.log("fetchContacts isTab === Contacts filter ", filter, " contactsNextToken ", contactsNextToken);
                    fetchContacts(null, null);
                    setIsFirstLoad(false);

                }
            } else {
                console.log("useEffect 1 FIRST LOADING Invitations");

                fetchInvitations();
                setIsInvitationFirstLoad(true);
            }
        }else if(isTab === "Invitations"){
            if(isInvitationFirstLoad){
                console.log("useEffect 2 FIRST LOADING Invitations");

                fetchInvitations(null);
                setIsInvitationFirstLoad(false);
            }
        }else if(isTab === "Requests"){
            //if(isInvitationFirstLoad){
            //    console.log("useEffect 2 FIRST LOADING Invitations");

                fetchAccessRequests(null);
                setIsAccessRequestsFirstLoad(false);
            //}
        }

        
        if(isTab !=="Contacts"){
            console.log("useEffect collecting  invitations...")
            setInvitationsDup(invitations);
            setCountInvitation(invitations.length);
        }

        if (searchText.length >= 3) {
            handleSearchUsers();
        } 

    }, [isTab , invitations,searchText]);

    useEffect(() => {
        console.log("4-useEffect accessRequests ", accessRequests);

        setAccessRequestsDup(accessRequests);
    }, [accessRequests]);

    useEffect(() => {
        console.log("2-useEffect contacts updated contacts ", contacts, 
        " prevContacts ", prevContacts)
        if (selectedGrades.length) {
            let filteredContacts = contactsDup.filter(
                (contact: any) =>
                    selectedGrades.includes(contact.className?.gradeID) ||
                    selectedClasses.includes(contact.className?.id)
            );
            setContactsDup(filteredContacts);
            setCountUser(filteredContacts.length);
        } else {
            setContactsDup(contacts);
            setCountUser(contacts.length);
        }
    }, [contacts]);
   
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
    const handleSelectGrades = (value: any, checked: boolean) => {
        if (checked) {
            let gradesTemp = [...selectedGrades];
            gradesTemp.push(value);
            setSelectedGrades([...gradesTemp]);
        } else {
            setSelectedGrades((grd: any) => {
                let temp = grd.filter((gr: any) => gr !== value);
                return temp;
            });
        }
    };
    useEffect(() => {
        console.log("4-useEffect selectedGrades, selectedClasses ");

        if (selectedGrades.length || selectedClasses.length) {
            let filteredContacts = contacts.filter((contact: any) => {
                return (
                    selectedGrades.includes(contact.className?.gradeID) ||
                    selectedClasses.includes(contact.className?.id)
                );
            });
            setContactsDup(filteredContacts);
            setCountUser(filteredContacts.length);
        } else {
            setContactsDup(contacts);
            setCountUser(contacts.length);
        }
    }, [selectedGrades, selectedClasses]);

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

    const usePrevious=(value:any)=> {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
      }

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

    const handleUserRole = async () => {
        const store = new Storage();
        await store.create();
        setUserLogonRoleName(await store.get(CACHE_USER_LOGIN_ROLE_NAME));
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
            setSelectedContacts(contacts);
        } else {
            setSelectedContacts([]);
        }
    };
   

    const handleSelectClasses = (value: any, checked: boolean) => {
        if (checked) {
            let classesTemp = [...selectedClasses];
            classesTemp.push(value);
            setSelectedClasses([...classesTemp]);
        } else {
            setSelectedClasses((cls: any) => {
                let temp = cls.filter((c: any) => c !== value);
                return temp;
            });
        }
    };
    const handleInvitationHasMore = () => {

        console.log("handleInvitationHasMore  invitationsNextToken ", invitationNextToken , " isInvitationFirstLoad ", isInvitationFirstLoad);
        console.log("handleInvitationHasMore prevInvitationsNextToken ",prevInvitationsNextToken ," invitationTotalNumberOfPages ", invitationTotalNumberOfPages);
        // if(isInvitationFirstLoad){
        //     return true;
        // }else
        // if(invitationNextToken === null || invitationNextToken === prevInvitationsNextToken){
        //     console.log("DO NOT LOADING MORE INVITATIONS ...")
        //     return false
        // }else{
        //     console.log("LOADING INVITATIONS MORE...")
        //     return true;
        // }
        
        return invitationNextToken != invitationTotalNumberOfPages && invitationNextToken < invitationTotalNumberOfPages
        ;
    };

    const handleAccessRequestsHasMore = () => {

        console.log("handleAccessRequestsHasMore  accessRequestsNextToken ", accessRequestsNextToken , " isInvitationFirstLoad ", isInvitationFirstLoad);
        console.log("handleInvitationHasMore prevInvitationsNextToken ",prevInvitationsNextToken ," invitationTotalNumberOfPages ", invitationTotalNumberOfPages);
        // if(isInvitationFirstLoad){
        //     return true;
        // }else
        // if(invitationNextToken === null || invitationNextToken === prevInvitationsNextToken){
        //     console.log("DO NOT LOADING MORE INVITATIONS ...")
        //     return false
        // }else{
        //     console.log("LOADING INVITATIONS MORE...")
        //     return true;
        // }
        
        return invitationNextToken != invitationTotalNumberOfPages && invitationNextToken < invitationTotalNumberOfPages
        ;
    };
    const handleGradeHasMore = () => {
        console.log("handleGradeHasMore");
        return false
    }
    const handleContactHasMore = () => {
        console.log("handleContactHasMore  contactsNextToken ", contactsNextToken , " isFirstLoad ", isFirstLoad);
        console.log("handleContactHasMore prevContactsNextToken ",prevContactsNextToken)
        if(isFirstLoad && contactsDup.length === 0){
            console.log("FIRST LOADING MORE...")
            return true;
        }else if(searchText.length > 0){
            console.log("handleContactHasMore searchNextTokenState ", searchNextTokenState); 
            return searchNextTokenState.searchFirstNameNextToken !=null && searchNextTokenState.searchLastNameNextToken !=null
        } else
        if(contactsNextToken === null || contactsNextToken === prevContactsNextToken){
            console.log("DO NOT LOADING MORE...")
            return false
        }else{
            console.log("LOADING MORE...")
            return true;
        }
        // contactsNextToken === null ||
                                            // selectedGrades.length ||
                                            // selectedClasses.length
                                            //     ? false
                                            //     : true

                                            
    };

    

    // useEffect(() => {
    //     contactsResetContacts();
    //     setTimeout(() => {
    //         console.log("fetchContacts  filter");

    //         fetchContacts(null, filter);
    //     }, 2000);
    // }, [filter]);



    return (
        <div style={{ zIndex: 3 }}>
            <IonGrid className="contactTable">
                <FlexboxGrid className="table-head">
                    <FlexboxGrid.Item className="col-row name-column" style={{ paddingLeft: 20 }}>
                        <IonCheckbox
                            style={{ marginRight: 20 }}
                            onIonChange={(e) => handleSelectAll(e.detail.checked)}
                        />
                        <IonText className="green-text">Name</IonText>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="col-row green-text surname-width">Surname</FlexboxGrid.Item>
                    <FlexboxGrid.Item
                        className="col-row grade-column green-text"
                        style={{ position: "relative", cursor: "pointer" }}
                    >
                        {/* <div
                className=""
                onClick={() => {
                  setOpenGrade(!openGrade);
                }}
              >
                Grade
                <IonIcon icon={fileTrayFullOutline} className="tableIcon" />
              </div>
              <GradeBox
                grade={openGrade}
                close={() => {
                  setOpenGrade(!openGrade);
                }}
                onSelect={(value: any, checked: boolean) => {
                  handleSelectGrades(value, checked);
                }}
              /> */}
                        {/* 
                        Filer by Grade backend not ready 
                        {userLogonRoleName !== "Student" && userLogonRoleName !== "Parent" ? (
                            <CheckPicker
                                data={gradesMod}
                                appearance="subtle"
                                placeholder="Grade"
                                className="CustDrop"
                                onChange={(value) => {
                                    console.log("**** selected Grade value ", value);
                                    setSelectedGrades([...value]);
                                    integration.listUserByGradeInfo(tenantId,value[0], null).then((userByGrade: any) => {
                                        //setContactsDup( )
                                        console.log("userByGrade  ", userByGrade);
                                        setContactsDup(userByGrade.items);
                                        setCountUser(userByGrade.items.length);
                                    });
                                }}
                            />
                        ) : (
                            "Grade"
                        )} */}
                        Grade

                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="col-row class-column green-text" style={{ cursor: "pointer" }}>
                        {/* <div
              className=""
              onClick={() => {
                setOpenClass(!openClass);
              }}
            >
              Class
              <IonIcon icon={fileTrayFullOutline} className="tableIcon" />
            </div>
            <ClassBox
              classOpen={openClass}
              close={() => {
                setOpenClass(!openClass);
              }}
              onSelect={(value: any, checked: boolean) => {
                handleSelectClasses(value, checked);
              }}
            /> */}
                        {userLogonRoleName !== "Student" && userLogonRoleName !== "Parent" ? (
                            <CheckPicker
                                data={classesMod}
                                appearance="subtle"
                                placeholder="Class"
                                className="CustDrop"
                                onSelect={(value) => {
                                    console.log("onSelect selected Class value  ", value);

                                }}
                                onChange={(value) => {
                                    console.log("selected Class value  ", value);
                                    integration.listUserByClassName(value[0]).then((userByclasses: any) => {
                                        //setContactsDup( )
                                        console.log("userByclasses  ", userByclasses);
                                        if(value.length > 1 ){
                                            setContactsDup([...contactsDup, ...userByclasses.items]);
                                            setCountUser(userByclasses.items.length+contactsDup.length);
                                        }else{
                                            setContactsDup(userByclasses.items);
                                            setCountUser(userByclasses.items.length);
                                        }
                                        //setSelectedClasses([...value]);
                                    });
                                }}
                            />
                        ) : (
                            "Class"
                        )}
                    </FlexboxGrid.Item>
                    {userLogonRoleName !== "Student" && userLogonRoleName !== "Parent" ? (
                        <>
                            <FlexboxGrid.Item className="col-row green-text phone-column ">Phone</FlexboxGrid.Item>
                            {isTab === "Contacts" ?
                            <FlexboxGrid.Item className="col-row green-text email-column">Email</FlexboxGrid.Item>
                            :""}
                        </>
                    ) : (
                        ""
                    )}
                    { isTab !== "Contacts" ? 
                    <FlexboxGrid.Item className="col-row green-text email-column">
                    <CheckPicker
                                data={[{label:"accepted", value:"accepted"}, {label:"distributed", value:"distributed"}]}
                                appearance="subtle"
                                label="Status"
                                // searchable={false}
                                className="CustDrop"
                                onSelect={(value) => {
                                    console.log("onSelect selected Class value  ", value);

                                }}
                                onChange={(value) => {
                                    console.log("selected Class value  ", value);
                                   // Lenkwe
                                }}
                            />
                    </FlexboxGrid.Item>:""
                    }
                    <FlexboxGrid.Item className="col-row total-column">
                        {isTab === "Contacts" ? "Total filtered:" : "Count :"}{" "}
                        {isTab === "Contacts" ? countUser : countInvitation}
                    </FlexboxGrid.Item>
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
                                <TableRow
                                    isTab={isTab}
                                    key={i}
                                    item={item}
                                    onSelect={(item: any, checked: boolean) => {
                                        handleSelectRow(item, checked);
                                    }}
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
                            {isTab === "Contacts" ? (
                                <div style={{ height: "calc(100vh - 335px)", overflow: "auto" }}>
                                    <InfiniteScroll
                                        initialLoad = {false}
                                        pageStart={0}
                                        loadMore={() => {
                                            console.log("contactsTable loadMore data ... ");
                                            if(searchText.length > 0){
                                                console.log("contactsTable searchText ", searchText);
                                            }else{
                                                fetchContacts(contactsNextToken, filter);
                                            }
                                        }}
                                        hasMore={handleContactHasMore()}
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
                                        //getScrollParent={() => this.scrollParentRef}
                                    >
                                        {contactsDup.map((item: any, i: number) => (
                                            <TableRow
                                                isTab={isTab}
                                                key={i}
                                                item={item}
                                                onSelect={(item: any, checked: boolean) => {
                                                    handleSelectRow(item, checked);
                                                }}
                                                selectedContacts={selectedContacts}
                                                onSetStaff={(staff: any) => {
                                                    onSetStaff(staff);
                                                }}
                                                onSetLearner={(staff: any) => {
                                                    onSetLearner(staff);
                                                }}
                                            />
                                        ))}
                                    </InfiniteScroll>
                                </div>
                            ) : isTab === "Requets" ? (
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
                                            //console.log("invitationsDup ", invitationsDup);
                                            return (
                                                <TableRow
                                                    isTab={isTab}
                                                    key={i}
                                                    item={item}
                                                    onSelect={(item: any, checked: boolean) => {
                                                        handleSelectRow(item, checked);
                                                    }}
                                                    selectedContacts={selectedContacts}
                                                    onSetStaff={(staff: any) => {}}
                                                    onSetLearner={(staff: any) => {}}
                                                />
                                            );
                                        })}
                                    </InfiniteScroll>
                                </div>
                            ) :( <div style={{ height: "calc(100vh - 335px)", overflow: "auto" }}>
                                    <InfiniteScroll
                                        initialLoad = {false}
                                        pageStart={0}
                                        loadMore={() => {
                                            console.log("Collecting more invitations...");
                                            fetchInvitations(invitationNextToken);
                                        }}
                                        hasMore={handleInvitationHasMore()}
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
                                        {invitationsDup.map((item: any, i: number) => {
                                            //console.log("invitationsDup ", invitationsDup);
                                            return (
                                                <TableRow
                                                    isTab={isTab}
                                                    key={i}
                                                    item={item}
                                                    onSelect={(item: any, checked: boolean) => {
                                                        handleSelectRow(item, checked);
                                                    }}
                                                    selectedContacts={selectedContacts}
                                                    onSetStaff={(staff: any) => {}}
                                                    onSetLearner={(staff: any) => {}}
                                                />
                                            );
                                        })}
                                    </InfiniteScroll>
                                </div>
                            )}
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
    fetchContacts,
    fetchInvitations,
    fetchAccessRequests,
    contactsSetSelectedContacts,
    contactsResetContacts,
    invitationsResetContacts
    
};
export default connect(mapStateToProps, mapDispatchToProps)(ContactsTable);
