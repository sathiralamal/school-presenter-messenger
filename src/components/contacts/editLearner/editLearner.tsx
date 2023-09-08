import React, { useEffect, useState,useRef } from "react";
import {
    IonItem,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    useIonAlert,
} from "@ionic/react";
import IntlTelInput from "react-intl-tel-input";

import { add, close, person, people } from "ionicons/icons";
import "./editLearner.css";
import { Input, FlexboxGrid, InputPicker, Icon } from "rsuite";
import Draggable from "react-draggable";

//redux
import { connect } from "react-redux";
import { contactsEditContact } from "../../../stores/contacts/actions";
import { TENANT_ID, TENANT_COUNTRY_CODE } from "../../../utils/StorageUtil";
import { Storage } from "@ionic/storage";
// popup
// import NewLearnerGroup from "./newLearner";
import * as integration from "scholarpresent-integration";
import CreateGradeAndClass from "../createGradeAndClass/createGradeAndClass";

const EditLearner: React.FC<{
    open: boolean;
    closee: any;
    grades: any[];
    learner: any;
    contactsEditContact: Function;
    onSuccess: Function;
    roles: any[];
}> = ({ open, closee, grades, learner, contactsEditContact, onSuccess, roles }) => {
    const [present] = useIonAlert();
    const store = new Storage();
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        grade: "",
        class: "",
        phone: "",
        email: "",
        parents: [
            {
                id: "",
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
            },

            {
                id: "",
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
            },
        ],
    });
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [allGrades, setAllGrades] = useState<any>([]);
    const [allClasses, setAllClasses] = useState<any>([]);
    const [parentLoading, setParentLoading] = useState<any>([]);
    const [parentDetails, setParentDetails] = useState<any>([]);
    const [step, setStep] = useState(1);
    const [countryCode, setCountryCode] = useState<string>("za");
    const [isCreateGradeAndClassOpened, setIsCreateGradeAndClassOpened] = useState(false);
    const telInputRef = useRef<any>(null);
    const parent1TelInputRef = useRef<any>(null);



    const addAnotherParentRow = () => {
        let parents = state.parents;
        parents.push({
            id: "",
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
        });
        setState({ ...state, parents });
    };

    const handleNext = () => setStep((state) => state + 1);

    const handleFetchClasses = async (gradeId: string) => {
        let classesArr: any[] = [];
        let classes = await integration.listClassNamesByGradeIdInfo(gradeId, null);
        //classes = JSON.parse(classes)
        console.log("[editLearner] handleFetchClasses classes.items ", classes.items );
        classesArr = [...classesArr, ...classes.items];
        let nextToken = classes.nextToken;
        while (nextToken != null) {
            let temp = await integration.listClassNamesByGradeIdInfo(gradeId, nextToken);
            nextToken = temp.nextToken;
            classesArr = [...classesArr, ...temp.items];
        }
        let classesTemp: any[] = [];
        classesArr.map((cls: any) => {
            classesTemp.push({
                label: cls.className,
                value: cls.id,
            });
        });
        setAllClasses([...classesTemp]);
    };
    const handleEditLearner = async () => {
        try {
            setBtnLoading(true);
            await store.create();
            let tenantId = await store.get(TENANT_ID);
            let parentRole = roles.filter((role: any) => role.roleName === "Parent");
            let learnerRole = roles.find(function(object) {
                return object.roleName === "Student";
              });

            let promises: any[] = [];
            let updatedLearner = {
                id: learner.id,
                firstName: state.firstName,
                lastName: state.lastName,
                classNameId: state.class?.length > 0 ? state.class : null,
                contacts: [
                    { contactType: "email", detail: state.email },
                    { contactType: "sms", detail: state.phone },
                ],
                userRoleId: learnerRole.id
            };
            let learnerInfo = await integration.updateUserInfo(updatedLearner);
            learnerInfo.gradeId = state.grade;
            let selectedGrade = grades.find(function(object) {
                return object.id === state.grade;
            });
            learnerInfo.gradeName = selectedGrade?.gradeName;

            let selectedClass = allClasses.find(function(object:any) {
                return object.value === learnerInfo?.classNameId;
            });
            learnerInfo.className = selectedClass?.label
            if (parentDetails.length === 0) {
                //create new parents
                state.parents.map((parent) => {

                    if (parent.firstName &&  parent.firstName?.length > 0  && parent.lastName &&  parent.lastName?.length > 0) {
                        promises.push(
                            integration.createUserInfo(
                                null,
                                tenantId,
                                parent.firstName,
                                parent.lastName,
                                "private",
                                parent.email,
                                parent.phone,
                                state.class?.length > 0 ? state.class : null,
                                parentRole[0]?.id,
                                learner.id
                            )
                        );
                    }
                });
            } else {
                state.parents.map((parent) => {

                    if (parent.id?.length > 0) {
                        promises.push(
                            integration.updateUserInfo({
                                id: parent.id,
                                firstName: parent.firstName,
                                lastName: parent.lastName,
                                classNameId: state.class?.length > 0 ? state.class : null,
                                contacts: [
                                    { contactType: "email", detail: parent.email },
                                    { contactType: "sms", detail: parent.phone },
                                ],
                                userRoleId: parentRole[0]?.id

                            })
                        );
                    } else if(parent.firstName &&  parent.firstName?.length > 0  && parent.lastName &&  parent.lastName?.length > 0){
                        promises.push(
                            integration.createUserInfo(
                                null,
                                tenantId,
                                parent.firstName,
                                parent.lastName,
                                "private",
                                parent.email,
                                parent.phone,
                                state.class?.length > 0 ? state.class : null,
                                parentRole[0]?.id,
                                learner.id
                            )
                        );
                    }
                });
            }
            await Promise.all(promises).then((resp) => {
                console.log(resp);
            });
            console.log(learnerInfo, "LEARNER");
            if (learnerInfo) {
                present({
                    message: `Learner updated successfully!`,
                    buttons: [
                        {
                            text: "Ok",
                            handler: (d) => {
                                
                
                                contactsEditContact(learnerInfo);
                                onSuccess(learnerInfo);
                            },
                        },
                    ],
                });
            }
            closee();
        } catch (err) {
            console.log(err);
        } finally {
            setBtnLoading(false);
        }
    };
    
    const fetchParentInfo = async (id: string) => {
        try {
            setParentLoading(true);
            const parentInfo = await integration.getLearnerAndParentInfo(id);
            if (Array.isArray(parentInfo?.items)) {
                console.log("fetchParentInfo parentInfo ", parentInfo );
                setParentDetails(parentInfo.items);
            }
        } catch (err) {
        } finally {
            setParentLoading(false);
        }
    };
    useEffect(() => {
        if (!open) {
            setState({
                firstName: "",
                lastName: "",
                grade: "",
                class: "",
                phone: "",
                email: "",
                parents: [
                    {
                        id: "",
                        firstName: "",
                        lastName: "",
                        phone: "",
                        email: "",
                    },

                    {
                        id: "",
                        firstName: "",
                        lastName: "",
                        phone: "",
                        email: "",
                    },
                ],
            });
            setStep(1);
        } else if (learner?.id) {
            console.log("***** learner ", learner);
            fetchParentInfo(learner.id);
            setState({
                ...state,
                firstName: learner.firstName,
                lastName: learner.lastName,
                grade: learner?.gradeId,
                class: learner?.classNameId,
                phone: learner?.contactPhone,
                email: learner?.contactEmail,
            });
        }
    }, [open, learner]);
    useEffect(() => {
        let gradesTemp: any[] = [];
        grades.map((grade: any) => {
            gradesTemp.push({
                label: grade.gradeName,
                value: grade.id,
            });
        });
        setAllGrades([...gradesTemp]);
    }, [grades]);
    useEffect(() => {
        if (state.grade?.length > 0) {
            handleFetchClasses(state.grade);
        } else {
            setAllClasses([]);
        }
    }, [state.grade]);
    useEffect(() => {
        let parentsTemp: any[] = [];
        for (let i = 0; i < 2; i++) {
            parentsTemp.push({
                id: parentDetails[i]?.id || "",
                firstName: parentDetails[i]?.firstName || "",
                lastName: parentDetails[i]?.lastName || "",
                phone: parentDetails[i]?.contactPhone,
                email: parentDetails[i]?.contactEmail,
            });
        }

        setState({ ...state, parents: [...parentsTemp] });
    }, [parentDetails]);

    useEffect(() => {
        store.create().then(value=>{
            store.get(TENANT_COUNTRY_CODE).then(retCountryCode=>{
                if(retCountryCode!=null){
                    setCountryCode(retCountryCode );
                    if(telInputRef!=null && telInputRef?.current?.updateFlagOnDefaultCountryChange){
                        telInputRef.current.updateFlagOnDefaultCountryChange(retCountryCode);
                    }

                    if(parent1TelInputRef!=null && parent1TelInputRef?.current?.updateFlagOnDefaultCountryChange){
                        parent1TelInputRef.current.updateFlagOnDefaultCountryChange(retCountryCode);
                    }
                }

            })
        })
    },[])  
    useEffect(() => {},[countryCode]) 

    return (
        // <Draggable defaultPosition={{ x: 0, y: 0 }} cancel=".drag-cancel" >
            <IonItem lines="none" className="NewLearner" style={{ display: open ? "block" : "none" }}>
                <IonGrid>
                    <IonGrid>
                        <IonRow className="tab-header">
                            <IonSegment value={step.toString()} mode="md" className="learner-tab-header">
                                <IonSegmentButton className="learner-tab-button drag-cancel" id="tabLearner" onClick={() => setStep(1)} value={"1"}>
                                    <div className="learner-tab-label">
                                        <Icon size="lg" icon="user" style={{ color: "#219653" }} />
                                        <p>Learner</p>
                                    </div>
                                </IonSegmentButton>
                                <IonSegmentButton
                                    disabled={parentLoading}
                                    onClick={() => setStep(2)}
                                    className="learner-tab-button drag-cancel"
                                    value={"2"} id="tabParent1"
                                >
                                    <div className="learner-tab-label">
                                        <Icon size="lg" icon="group" style={{ color: "#219653" }} />
                                        <p>Parent 1</p>
                                    </div>
                                </IonSegmentButton>
                                <IonSegmentButton
                                    disabled={parentLoading}
                                    onClick={() => setStep(3)}
                                    className="learner-tab-button drag-cancel"
                                    value={"3"}
                                    id="tabParent2"
                                >
                                    <div className="learner-tab-label">
                                        <Icon size="lg" icon="group" style={{ color: "#219653" }} />
                                        <p>Parent 2</p>
                                    </div>
                                </IonSegmentButton>
                                <div className="learner-close-icon">
                                    <IonIcon
                                        icon={close}
                                        style={{
                                            fontSize: 22,
                                            verticalAlign: "top",
                                            color: "#f00",
                                        }}
                                        onClick={closee}
                                        className="drag-cancel"
                                    />
                                </div>
                            </IonSegment>
                        </IonRow>
                    </IonGrid>

                    <IonRow>
                        <IonText className="PopupHeader">Edit Learner</IonText>
                    </IonRow>

                    {step === 1 && (
                        <div className="learner-tab1">
                            <IonRow>
                                <IonText className="PopupHeader">Learner Information</IonText>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12" size-md="6">
                                    <Input
                                        placeholder="First Name"
                                        value={state.firstName}
                                        onChange={(value: string) => setState({ ...state, firstName: value })}
                                        required
                                        style={{ borderColor: "#f00" }}
                                        className="drag-cancel"
                                    />
                                    <IonText className="PopupLable"> First Name* </IonText>
                                </IonCol>
                                <IonCol size="12" size-md="6">
                                    <Input
                                        placeholder="Last Name"
                                        value={state.lastName}
                                        onChange={(value: string) => setState({ ...state, lastName: value })}
                                        required
                                        style={{ borderColor: "#f00" }}
                                        className="drag-cancel"
                                    />
                                    <IonText className="PopupLable"> Last Name* </IonText>
                                </IonCol>
                            </IonRow>
                            <IonRow className="LearnerSelect">
                                <IonCol size="12" size-md="6" className="learner-select-container">
                                    <select
                                        onChange={(e) => setState({ ...state, grade: e.target.value })}
                                        value={state?.grade === null?"":state?.grade}
                                        key={state?.grade}
                                        className="drag-cancel learner-select"
                                    >
                                        <option selected>
                                            Select Grade
                                        </option>
                                        {allGrades.map((item: any, i: any) => (
                                            <option value={item.value} key={i}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                    <IonButton
                                        fill="outline"
                                        className="outlineBtn btn-right drag-cancel"
                                        id="addContact"
                                        onClick={() => setIsCreateGradeAndClassOpened(true)}
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
                                        New
                                    </IonButton>
                                </IonCol>
                                <IonCol size="12" size-md="6" className="learner-select-container">
                                    <select
                                        onChange={(e) => setState({ ...state, class: e.target.value })}
                                        value={state?.class ===null?"":state?.class}
                                        key={state?.class}
                                        className="drag-cancel learner-select"
                                    >
                                        <option selected>
                                            Select Class
                                        </option>
                                        {allClasses.map((item: any, i: any) => (
                                            <option value={item.value} key={i}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                    <IonButton
                                        fill="outline"
                                        className="outlineBtn btn-right drag-cancel"
                                        id="addContact"
                                        onClick={() => setIsCreateGradeAndClassOpened(true)}
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
                                        New
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                            <IonRow className="LearnerPhoneEmail">
                                <IonCol size="12" size-md="6">
                                    {/* <Input
                                        placeholder="Phone"
                                        value={state.phone}
                                        type="number"
                                        onChange={(value: string) => setState({ ...state, phone: value })}
                                        required
                                        style={{ borderColor: "#f00" }}
                                        className="drag-cancel"
                                    /> */}
                                    <IntlTelInput
                                fieldId="editLearnerNumber"
                                containerClassName="intl-tel-input drag-cancel"
                                preferredCountries={[ countryCode]}
                                inputClassName="rs-input drag-cancel"
                                placeholder="e.g. 073 123 4567"
                                value={state?.phone ===null?"": state?.phone}
                                ref={telInputRef}
                                telInputProps={{
                                    onPaste: (e: any) => {
                                        telInputRef.current.updateValFromNumber(e.clipboardData.getData("text"), false, true);
                                        telInputRef.current.setNumber(e.clipboardData.getData("text"));
                                        e.preventDefault();
                                        e.stopPropagation();
                                    },
                                }}
                                
                                onPhoneNumberChange={(status: any, value: any, countryData: any, number: any, id: any) => {
                                    number = number.replace(/ /g, '');

                                    setCountryCode(countryData.iso2);
                                    setState({ ...state, phone: number })
                                    // setMobileNumber(number);
                                    // if (number.length > 1 && value.match(/^[+]*[0-9 ]*$/)) {
                                    //     setLoginButtonEnabler(true);
                                    // } else {
                                    //     setLoginButtonEnabler(false);
                                    // }
                                }}
                            />

                                    <IonText className="PopupLable"> Phone </IonText>
                                </IonCol>
                                <IonCol size="12" size-md="6">
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        value={state?.email ===null?"":state?.email}
                                        onChange={(value: string) => setState({ ...state, email: value })}
                                        className="drag-cancel"
                                    />
                                    <IonText className="PopupLable"> Email </IonText>
                                </IonCol>
                            </IonRow>
                        </div>
                    )}

                    {state.parents.map((parent: any, i: number) => {
                        if (step === i + 2)
                            return (
                                <div key={i}>
                                    <IonRow>
                                        <IonText className="PopupHeader">Parent {i + 1}</IonText>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" size-md="6">
                                            <Input
                                                placeholder="Parent's First Name"
                                                value={parent.firstName}
                                                onChange={(value: string) => {
                                                    parent.firstName = value;
                                                    setState({ ...state, parents: state.parents });
                                                }}
                                                className="drag-cancel"
                                                id="parentFirstName"
                                            />
                                            <IonText className="PopupLable"> Parent's First Name </IonText>
                                        </IonCol>
                                        <IonCol size="12" size-md="6">
                                            <Input
                                                placeholder="Parent's Last Name"
                                                value={parent.lastName}
                                                onChange={(value: string) => {
                                                    parent.lastName = value;
                                                    setState({ ...state, parents: state.parents });
                                                }}
                                                className="drag-cancel"
                                                id="parentLastName"
                                            />
                                            <IonText className="PopupLable"> Parent's Last Name </IonText>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" size-md="6">
                                            <IntlTelInput
                                                fieldId="editParentNumber"
                                                containerClassName="intl-tel-input drag-cancel"
                                                preferredCountries={[ countryCode]}
                                                inputClassName="rs-input drag-cancel"
                                                placeholder="e.g. 073 123 4567"
                                                ref={parent1TelInputRef}
                                                value={ parent?.phone ===null?"": parent?.phone }
                                                telInputProps={{
                                                    onPaste: (e: any) => {
                                                        parent1TelInputRef.current.updateValFromNumber(e.clipboardData.getData("text"), false, true);
                                                        telInputRef.current.setNumber(e.clipboardData.getData("text"));
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    },
                                                }}
                                                
                                                onPhoneNumberChange={(status: any, value: any, countryData: any, number: any, id: any) => {
                                                    value = value.replace(/ /g, '');

                                                    parent.phone = value;
                                                    setState({ ...state, parents: state.parents });
                                                    // setMobileNumber(number);
                                                    // if (number.length > 1 && value.match(/^[+]*[0-9 ]*$/)) {
                                                    //     setLoginButtonEnabler(true);
                                                    // } else {
                                                    //     setLoginButtonEnabler(false);
                                                    // }
                                                }}
                                />
                                            <IonText className="PopupLable"> Phone </IonText>
                                        </IonCol>
                                        <IonCol size="12" size-md="6">
                                            <Input
                                                placeholder="Email"
                                                type="email"
                                                value={parent.email}
                                                onChange={(value: string) => {
                                                    parent.email = value;
                                                    setState({ ...state, parents: state.parents });
                                                }}
                                                className="drag-cancel"
                                                id="email"
                                            />
                                            <IonText className="PopupLable"> Email </IonText>
                                        </IonCol>
                                    </IonRow>
                                </div>
                            );
                    })}

                    {/* {parentLoading && (
                        <div className="w-100 margin-auto" style={{ textAlign: "center" }}>
                            <IonSpinner name="bubbles" />
                        </div>
                    )} */}

                    <IonRow className="learner-button-container ">
                        <IonButton fill="outline" className="outlineBtn drag-cancel" color="success" onClick={closee}>
                            Cancel
                        </IonButton>
                        <IonButton
                            className="outlineBtn drag-cancel learner-submit-button"
                            onClick={step !== 3 ? handleNext : handleEditLearner}
                            disabled={btnLoading || parentLoading}
                        >
                            {btnLoading && <IonSpinner name="dots" />}
                            {!btnLoading && step === 3 && "Submit"}
                            {!btnLoading && step !== 3 && "Next"}
                        </IonButton>
                    </IonRow>
                </IonGrid>

                <CreateGradeAndClass
                    open={isCreateGradeAndClassOpened}
                    closee={() => setIsCreateGradeAndClassOpened(false)}
                    onSuccess={(value: any) => {
                        setState(state => ({
                            ...state,
                            class: value.class,
                            grade: value.grade,
                        }))
                        setIsCreateGradeAndClassOpened(false)
                        handleFetchClasses(value.grade);
                    }}
                />
            </IonItem>

            
        // </Draggable>
    );
};
const mapStateToProps = (state: any) => ({
    grades: state.grades.grades,
    roles: state.roles.roles,
});
const mapDispatchToProps = {
    contactsEditContact,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditLearner);
