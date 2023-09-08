import React, { useEffect, useState,useRef } from "react";
import {
    IonItem,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
} from "@ionic/react";
import { add, close } from "ionicons/icons";
import IntlTelInput from "react-intl-tel-input";
import "./newLearner.css";
import { Input, FlexboxGrid, InputPicker, Icon } from "rsuite";
import Draggable from "react-draggable";
//redux
import { connect, useDispatch } from "react-redux";
import { fetchContacts, contactsResetContacts, contactsSetNewContacts } from "../../../stores/contacts/actions";

import { TENANT_ID , TENANT_COUNTRY_CODE, TENANT_COUNTRY_DIALING_CODE} from "../../../utils/StorageUtil";
import { Storage } from "@ionic/storage";
import asyncForEach from "../../../utils/asyncForeach";
// popup
// import NewLearnerGroup from "./newLearner";
import * as integration from "scholarpresent-integration";
import CreateGradeAndClass from "../createGradeAndClass/createGradeAndClass";
import useScreenSize from "../../../hooks/useScreenSize";

const NewLearner: React.FC<{
    open: boolean;
    closee: any;
    next: any;
    grades: any[];
    fetchContacts: Function;
    contactsResetContacts: Function;
    filter: string;
    contactsSetNewContacts:Function;
}> = ({ open, closee, next, grades, fetchContacts, contactsResetContacts, filter, contactsSetNewContacts }) => {
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
    const [countryCode, setCountryCode] = useState<string>("za");
    const [isCreateGradeAndClassOpened, setIsCreateGradeAndClassOpened] = useState(false);

    const [allClasses, setAllClasses] = useState<any>([]);
    const telInputRef = useRef<any>(null);
    const parent1TelInputRef = useRef<any>(null);
    const { mobile } = useScreenSize();

    const [draggable, setDraggable] = useState(true);

    const [step, setStep] = useState(1);

    const handleNext = () => setStep((state) => state + 1);

    const addAnotherParentRow = () => {
        let parents = state.parents;
        parents.push({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
        });
        setState({ ...state, parents });
    };
    const handleFetchClasses = async (gradeId: string) => {
        let classesArr: any[] = [];
        let classes = await integration.listClassNamesByGradeIdInfo(gradeId, null);
        //classes = JSON.parse(classes);
        console.log("handleFetchClasses classes ", classes, " classes?.items?.length ", classes?.items?.length);
        if(classes?.items?.length > 0){
            classesArr = [...classesArr, ...classes.items];
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
    const handleCreateLearner = async (e: any) => {
        e.preventDefault();
        try {
            setBtnLoading(true);
            await store.create();
            let tenantId = await store.get(TENANT_ID);
            let _roles = await integration.getUserRoles();
            let roles = JSON.parse(_roles);
            if (Array.isArray(roles.items)) {
                let studentRole = roles.items.filter((role: any) => role.roleName === "Student");
                let parentRole = roles.items.filter((role: any) => role.roleName === "Parent");
                let linkedUserIds: any[] = [];
                let promises: any[] = [];
                let learnerInfo = await integration.createUserInfo(
                    null,
                    tenantId,
                    state.firstName,
                    state.lastName,
                    "private",
                    state.email,
                    state.phone,
                    state.class?.length > 0 ? state.class : null,
                    studentRole[0]?.id, null
                );
                console.log(learnerInfo, "LEARNER");
               

                learnerInfo.gradeId = state.grade;
                let selectedGrade = grades.find(function(object) {
                    return object.id === state.grade;
                });
                learnerInfo.gradeName = selectedGrade?.gradeName;

                let selectedClass = allClasses.find(function(object:any) {
                    return object.value === learnerInfo?.classNameId;
                });
                learnerInfo.className = selectedClass?.label
                

                state.parents.map((parent: any) => {
                    if (parent.firstName) {
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
                                learnerInfo?.id
                            )
                        );
                    }
                });
                await Promise.all(promises).then((values: any[]) => {
                    console.log(values, "PARENT");
                });
                // await asyncForEach(state.parents, async (parent: any) => {
                //   let parentFirstName = parent.firstName;
                //   let parentLastName = parent.lastName;
                //   parentInfo = await integration.createUserInfo(null, tenantId, parentFirstName, parentLastName, "private", parent.email, parent.phone, state.class, parentRole[0]?.id);
                //   linkedUserIds.push(parentInfo.id)
                // })
                
                contactsSetNewContacts(learnerInfo)
                // contactsResetContacts();
                // setTimeout(() => {
                //     fetchContacts(null, filter);
                // }, 2000);

                next(learnerInfo);
                closee();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setBtnLoading(false);
        }
    };
    useEffect(() => {
        store.create().then(value=>{
            store.get(TENANT_COUNTRY_CODE).then(retCountryCode=>{
                if(retCountryCode!=null){
                    setCountryCode(retCountryCode );
                    if(telInputRef!=null && telInputRef?.current?.updateFlagOnDefaultCountryChange){
                        telInputRef.current.updateFlagOnDefaultCountryChange(retCountryCode);
                    }
                }

            })
        })
        setTimeout(()=>{
            setDraggable(mobile);
        }, 5000);

    },[])  
    useEffect(() => {},[countryCode, draggable]) 
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
                        firstName: "",
                        lastName: "",
                        phone: "",
                        email: "",
                    },

                    {
                        firstName: "",
                        lastName: "",
                        phone: "",
                        email: "",
                    },
                ],
            });

            setStep(1)
        }

    }, [open]);
    useEffect(() => {
        let gradesTemp: any[] = [];
        console.log("useEffect grades ", grades);
        grades.map((grade: any) => {
            gradesTemp.push({
                label: grade.gradeName,
                value: grade.id,
            });
        });
        console.log("useEffect gradesTemp ", gradesTemp);

        setAllGrades([...gradesTemp]);
    }, [grades]);
    useEffect(() => {
        if (state.grade?.length > 0) {
            handleFetchClasses(state.grade);
        } else {
            setAllClasses([]);
        }
    }, [state.grade]);
    return (
            // <Draggable 
            // defaultPosition={{ x: 0, y: 0 }} 
            // //bounds={{top:0,left:0}} 
            // disabled={draggable} 
            // cancel=".drag-cancel">
                <IonItem lines="none" className="NewLearner" style={{ display: open ? "block" : "none" }}>
                    <IonGrid>
                        <IonGrid>
                            <IonRow className="tab-header">
                                <IonSegment value={step.toString()} mode="md" className="learner-tab-header">
                                    <IonSegmentButton className="learner-tab-button" id="tabLearner" onClick={() => setStep(1)} value={"1"}>
                                        <div className="learner-tab-label">
                                            <Icon size="lg" icon="user" style={{ color: "#219653" }} />
                                            <p>Learner</p>
                                        </div>
                                    </IonSegmentButton>
                                    <IonSegmentButton onClick={() => setStep(2)} id="tabParent1" className="learner-tab-button" value={"2"}>
                                        <div className="learner-tab-label">
                                            <Icon size="lg" icon="group" style={{ color: "#219653" }} />
                                            <p>Parent 1</p>
                                        </div>
                                    </IonSegmentButton>
                                    <IonSegmentButton onClick={() => setStep(3)} id="tabParent2" className="learner-tab-button" value={"3"}>
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
                            <IonText className="PopupHeader">Add A New Learner</IonText>
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
                                            id="leranerFirstName"
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
                                            id="leranerLastName"
                                        />
                                        <IonText className="PopupLable"> Last Name* </IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="LearnerSelect">
                                    <IonCol size="12" size-md="6" className="learner-select-container">
                                        <select
                                            value={state.grade}
                                            onChange={(e) => setState({ ...state, grade: e.target.value })}
                                            className="drag-cancel"
                                            id="leranerGrade"
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
                                            value={state.class}
                                            onChange={(e) => {
            
                                                setState({ ...state, class: e.target.value })}
                                            }
                                            className="drag-cancel"
                                            id="leranerClass"
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
                                            type="number"
                                            value={state.phone}
                                            onChange={(value: string) => setState({ ...state, phone: value })}
                                            required
                                            style={{ borderColor: "#f00" }}
                                            className="drag-cancel"
                                            id="leranerPhone"
                                        /> */}

                                    <IntlTelInput
                                    fieldId="newLearnerNumber"
                                    containerClassName="intl-tel-input"
                                    preferredCountries={[ countryCode]}
                                    inputClassName="rs-input"
                                    placeholder="e.g. 073 123 4567"
                                    //value={state.phone}
                                    ref={telInputRef}
                                    telInputProps={{
                                        onPaste: (e: any) => {
                                            telInputRef.current.updateValFromNumber(e.clipboardData.getData("text"), false, true);
                                            telInputRef?.current?.setNumber(e.clipboardData.getData("text"));
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
                                        <IonText className="PopupLable"> Phone</IonText>
                                    </IonCol>
                                    <IonCol size="12" size-md="6">
                                        <Input
                                            placeholder="Email"
                                            type="email"
                                            value={state.email}
                                            onChange={(value: string) => setState({ ...state, email: value })}
                                            className="drag-cancel"
                                            id="leranerEmail"
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
                                            <IonCol size="12" size-md="6">
                                                <Input
                                                    placeholder="Parent's First Name"
                                                    value={parent.firstName}
                                                    onChange={(value: string) => {
                                                        parent.firstName = value;
                                                        setState({ ...state, parents: state.parents });
                                                    }}
                                                    className="drag-cancel"
                                                    id="parent1FirstName"
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
                                                    id="parent1LastName"
                                                />
                                                <IonText className="PopupLable"> Parent's Last Name </IonText>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol size="12" size-md="6">
                                                {/* <Input
                                                    placeholder="Phone"
                                                    value={parent.phone}
                                                    type="number"
                                                    onChange={(value: string) => {
                                                        parent.phone = value;
                                                        setState({ ...state, parents: state.parents });
                                                    }}
                                                    className="drag-cancel"
                                                    id="parent1Phone"
                                                /> */}

                                    <IntlTelInput
                                        fieldId="newParentNumber"
                                        containerClassName="intl-tel-input"
                                        preferredCountries={[ countryCode]}
                                        inputClassName="rs-input"
                                        placeholder="e.g. 073 123 4567"
                                        ref={parent1TelInputRef}
                                        telInputProps={{
                                            onPaste: (e: any) => {
                                                parent1TelInputRef.current.updateValFromNumber(e.clipboardData.getData("text"), false, true);
                                                telInputRef?.current?.setNumber(e?.clipboardData?.getData("text"));
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
                                                    value={parent.email}
                                                    onChange={(value: string) => {
                                                        parent.email = value;
                                                        setState({ ...state, parents: state.parents });
                                                    }}
                                                    className="drag-cancel"
                                                    id="parent1Email"
                                                />
                                                <IonText className="PopupLable"> Email </IonText>
                                            </IonCol>
                                        </IonRow>
                                    </div>
                                );
                        })}

                        <IonRow className="learner-button-container ">
                            <IonButton fill="outline" className="outlineBtn drag-cancel" color="success" onClick={closee}>
                                Cancel
                            </IonButton>
                            <IonButton
                                className="outlineBtn drag-cancel learner-submit-button"
                                onClick={step !== 3 ? handleNext : handleCreateLearner}
                                disabled={btnLoading}
                                id={"step"+ step}
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
                            console.log({value});
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
    filter: state.contacts.filter,
});
const mapDispatchToProps = {
    fetchContacts,
    contactsResetContacts,
    contactsSetNewContacts
};
export default connect(mapStateToProps, mapDispatchToProps)(NewLearner);