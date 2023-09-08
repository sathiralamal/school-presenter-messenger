import { useEffect, useState, useRef } from "react";
import {
    Button,
    InputGroup,
    Toggle,
    Navbar,
    Modal,
    Carousel,
    Icon,
    InputPicker,
    Input,
    Grid,
    Row,
    Col,
    Panel,
    Dropdown,
    Form,
    FormGroup,
    RadioGroup,
    Radio,
} from "rsuite";
import { Analytics } from 'aws-amplify';
import ReactGA from 'react-ga';


import { cacheSession , cacheUserRoleName, cacheSessionFromUserProfile} from "../../utils/StorageUtil";
import { cleanSpaces,getUsername } from "../../utils/Utils";

import { useHistory } from "react-router-dom";
import OtpInput from "react-otp-input";
import { Storage } from "@ionic/storage";

import {
    IonItem,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonSpinner,
    useIonAlert,
    IonSelect,
    IonSelectOption,
    IonInput,
} from "@ionic/react";

import "./register-web.css";
// @ts-ignore
import IntlTelInput from "react-intl-tel-input";

import "react-intl-tel-input/dist/main.css";

import { useDispatch } from "react-redux";
import { fetchGrades } from "../../stores/grades/actions";
import { fetchClasses } from "../../stores/classes/actions";
import { fetchRoles } from "../../stores/roles/actions";
import { formField } from "aws-amplify";
import { classesSetData } from "../../stores/classes/actions";
import { gradeSetData } from "../../stores/grades/actions";
import { conversationsSetData, messagesReset } from "../../stores/messages/actions";
import { contactsResetContacts } from "../../stores/contacts/actions";
import { invitationsResetContacts } from "../../stores/contacts/actions";
import { groupsReset } from "../../stores/groups/actions";
import {rolesReset} from "../../stores/roles/actions";



import * as integration from "scholarpresent-integration";

const Invitation = (props: any) => {
    const dispatch = useDispatch();
    const [present] = useIonAlert();

    const telInputRef = useRef<any>(null);

    const STEPS = {
        NEW_LOGIN: 0,
        SUBMIT_PINCODE: 1,
        PARENT_LINK_CHILD: 2,
        CHILD_INFO: 3,
        PARENT_INFO: 4,
        SUCCESS_JOIN_REQUEST: 5,
        LOAD_CONTACT: 6,
        REQUEST_TO_JOIN: 7,
        JOIN_REQUEST_COMPLETE: 8,
        PRE_LOAD_CONFIGURATION:9
    };
    let history = useHistory();

    const [step, setStep] = useState<number>(props?.history?.location?.state?.step === STEPS.PRE_LOAD_CONFIGURATION? 
        STEPS.PRE_LOAD_CONFIGURATION:STEPS.NEW_LOGIN);
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [logonUser, setLogonUser] = useState<any>(null);
    const [cognitoUser, setCognitoUser] = useState<any>(null);
    const [newRoleList, setNewRoleList] = useState<any>(null);
    const [otpCode, setOtpCode] = useState("");

    const [loginButton, setLoginButton] = useState(false);
    const [validateButton, setValidateButton] = useState(false);
    const [registerButton, setRegisterButton] = useState(false);

    const [loginButtonEnabler, setLoginButtonEnabler] = useState(false);
    const [validateButtonEnabler, setValidateButtonEnabler] = useState(false);

    const [countryCode, setCountryCode] = useState("");
    const [schoolName, setSchoolName] = useState<string>();
    const [schoolEmail, setSchoolEmail] = useState<string>();
    const [roleName, setRoleName] = useState<string>();
    const [contactPersonRole, setContactPersonRole] = useState<string>();
    const [contactPersonFirstName, setContactPersonFirstName] = useState<string>();
    const [contactPersonLastName, setContactPersonLastName] = useState<string>();
    const [contactPersonEmail, setContactPersonEmail] = useState<string>();
    const [confirmationChild, setConfirmationChild] = useState<boolean>(true);

    const [parentFirstName, setParentFirstName] = useState<string>();
    const [parentLastName, setParentLastName] = useState<string>();
    const [parentEmail, setParentEmail] = useState<string>();

    const [roles, setRoles] = useState<string[]>([]);
    const [invitation, setInvitation] = useState<any>();
    const [invitedUser, setInvitedUser] = useState<any>();

    const [nextAction, setNextAction] = useState<any>();

    const [tenant, setTenant] = useState<any>();
    const [selectedTenant, setSelectedTenant] = useState<any>();

    const [tenantList, setTenantList] = useState<any[]>([]);

    const [requestJoinSchoolEmail, setRequestJoinSchoolEmail] = useState<string>();
    const [requestJoinRole, setRequestJoinRole] = useState<string>("Parent");
    const [requestJoinFirstName, setRequestJoinFirstName] = useState<string>();
    const [requestJoinLastName, setRequestJoinLastName] = useState<string>();
    const [requestJoinEmail, setRequestJoinEmail] = useState<string>();
    const [requestJoinChildFirstName, setRequestJoinChildFirstName] = useState<string>();
    const [requestJoinChildLastName, setRequestJoinChildLastName] = useState<string>();
    const [requestJoinChildGrade, setRequestJoinChildGrade] = useState<string>();

    const [mobile, setMobile] = useState(window.innerWidth < 992);
    const [laodPage, setLoadPage] = useState<string>();
    const [state, setState] = useState({phone:""});

    useEffect(() => {
        console.log("invitation=====>>>> props ", props);
        if(props?.history?.location?.state?.step === STEPS.PRE_LOAD_CONFIGURATION){
            preLoadConfiguration(undefined).then(value=>console.log(""))
        }
        
        // Analytics.record({ name: 'view-invitation', attributes: { action: 'load'}});
        ReactGA.event({
            category: 'Invitation',
            action: 'load',
            label: 'load',                   
          });
        //if(props.show){
        //handleLogout();
        //setStep(STEPS.NEW_LOGIN);
        //}
    }, [props]);

    useEffect(() => {
        console.log("confirmationChild ", confirmationChild);
    });

    useEffect(() => {
        if(props?.history?.location?.state?.step !== STEPS.PRE_LOAD_CONFIGURATION){
            clearCache().then(value=>{});
        }
    }, []);
    const handleOtpChange = (value: string) => setOtpCode(value);
    const handleLogout = async () => {
        console.log("invitation handleLogout enter");

        const store = new Storage();
        await store.create();
        let pushNotificationKey = await store.get("pushNotificationKey");
        let appNotificationKey = await store.get("appNotificationKey");
        console.log( "handleLogout pushNotificationKey ", pushNotificationKey, " appNotificationKey ", appNotificationKey);

        integration.authSignOut(pushNotificationKey, appNotificationKey).then((value: any) => {});
        store.clear();
        console.log("invitation handleLogout exit");


    };
    const onMemberRegisterRequest = async () => {
        let altMobileNumber = mobileNumber.replace("+", "");
        altMobileNumber = cleanSpaces(altMobileNumber);
        let defaultEmail = altMobileNumber + "@scholarpresent.com";
        console.log("altMobileNumber ", altMobileNumber);
        let cUser = await integration.authSignUpMember(cleanSpaces(mobileNumber), defaultEmail);
        await setCognitoUser(cUser);
        console.log("onMemberRegisterRequest cognitoUser :", cognitoUser);
        // Analytics.record({ name: 'view-invitation', attributes: { action: 'request-otp' }});
        ReactGA.event({
            category: 'Invitation',
            action: 'request-otp',
            label: 'Request OTP',                   
          });

        setStep(STEPS.SUBMIT_PINCODE);
    };

    const onMemberRegisterSubmitPinCode = async () => {
        console.log("onMemberRegisterSubmitPinCode cognitoUser :", cognitoUser);
        let signedInUser = await integration.authSubmitCode(cognitoUser, otpCode);
        console.log("onMemberRegisterSubmitPinCode signedInUser :", signedInUser);

        if (signedInUser.challengeName === "CUSTOM_CHALLENGE") {
            Analytics.record({ name: 'view-invitation', attributes: { action: 'error-otp'}});

            present({
                message: `Invalid Pin Code. Please enter a correct pin code.`,
                buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
            });
            return;
        }
        // Analytics.updateEndpoint({
        //     address: getCognitoId(signedInUser),
        //        userId: getUsername(cognitoUser),
        //        // User attributes
        //        userAttributes: {
        //           interests: [mobileNumber]
        //         },
                
        // })

        // Analytics.record({ name: 'view-invitation', attributes: { action: 'sign-up-success'}});
        ReactGA.event({
            category: 'Invitation',
            action: 'sign-up-success',
            label: 'Sign Up Success',                   
          });
        await preLoadConfiguration(signedInUser);      

        console.log("onSubmitPinCode logonUser :", logonUser);
    };

    const preLoadConfiguration = async (signedInUser:any)=>{

        if(signedInUser === undefined){
            signedInUser = await integration.currentAuthenticatedUser();
            setCognitoUser(signedInUser);
        }

        let nextActionFromSession = getSessionAction(signedInUser);

        console.log("nextActionFromSession :", nextActionFromSession);

        if (nextActionFromSession === "parentSignUpByInvitation") {
            cacheSession(signedInUser.signInUserSession).then((value) => {
                console.log("cacheSession value :", value);
            });

            setLogonUser(signedInUser);
            console.log("onMemberRegisterSubmitPinCode logonUser :", logonUser);

            let invitationObj = getSessionInvitation(signedInUser);

            await integration.getUserProfileInfo(invitationObj.invitedUserId, true).then((value: any) => {
                console.log("getUserProfileInfo value ", value);
                cacheSessionFromUserProfile(value);
                if (invitationObj.linkedUserId !== null && invitationObj && invitationObj.invitedUserId) {
                    console.log("childConfirmationComponent getUserProfileInfo ", value);
                    setInvitedUser(value);
                    setParentFirstName(value.firstName);
                    setParentLastName(value.lastName);
                    setParentEmail(value.contactEmail);

                }
                console.log(" value.userRole?.roleName ", value.roleName);
                setContactPersonRole(value?.roleName);
                cacheUserRoleName(value?.roleName).then((retCacheRoleName) =>{})
            });

            // Checks if the invited person has a linked user
            if (invitationObj?.linkedUserId && invitationObj.linkedUserId !== null) {
                 
                console.log("invitation :", invitationObj);
                
                integration.getTenantInfo().then((value: any) => {
                    console.log("integration.getTenantInfo :", value);
                    setTenant(value);
                });

                //setLoadPage(mobile?"/getstarted")
                // Analytics.record({ name: 'view-invitation', attributes: { action: 'parent-link-request'}});
                ReactGA.event({
                    category: 'Invitation',
                    action: 'parent-link-request',
                    label: 'Parent Link Request',                   
                  });
                setStep(STEPS.PARENT_LINK_CHILD);
            } else {
                integration
                    .acceptInvitationInfo()
                    .then((value: any) => {
                        console.log("acceptInvitationInfo value ", value);
                    });
                // Analytics.record({ name: 'view-invitation', attributes: { action: 'accept-educator-link'}});
                ReactGA.event({
                    category: 'Invitation',
                    action: 'accept-educator-link',
                    label: 'Accept Educator Link',                   
                  });
                setStep(STEPS.LOAD_CONTACT);
            }

            dispatch(fetchGrades(undefined));
            dispatch(fetchClasses(invitationObj?.tenantId));
            dispatch(fetchRoles());
        } else if (nextActionFromSession === "parentRequestToJoin") {
            integration.getAllTenantList().then((value: any) => {
                console.log("getAllTenantList value ", value);
                let resTenantList = [];
                for (let i = 0; i < value.items.length; i++) {
                    resTenantList.push({ label: value.items[i].tenantName, value: value.items[i].id });
                }
                setTenantList(resTenantList);
            });
            // Analytics.record({ name: 'view-invitation', attributes: { action: 'request-approval'}});
            ReactGA.event({
                category: 'Invitation',
                action: 'request-approval',
                label: 'Request Approval',                   
              });

            setStep(STEPS.REQUEST_TO_JOIN);
        }
    }


    // const onUpdateOrganisation = async () => {
    //     //setStep(8)
    //     try {
    //         console.log("logonUser ", logonUser);
    //         setRegisterButton(true);
    //         let tenantId = getTenantId(logonUser);
    //         let userId = getUserId(logonUser);
    //         let mobileNumber = getPhoneNumber(logonUser);
    //         console.log(
    //             "onUpdateOrganisation tenantId ",
    //             tenantId,
    //             " schoolName ",
    //             schoolName,
    //             " userId ",
    //             userId,
    //             " contactPersonFirstName ",
    //             contactPersonFirstName,
    //             " contactPersonLastName ",
    //             contactPersonLastName,
    //             " contactPersonEmail ",
    //             contactPersonEmail,
    //             " contactPersonRole ",
    //             contactPersonRole
    //         );
    //         let role: any = roles.find((e: any) => e.roleName === contactPersonRole);
    //         console.log("onUpdateOrganisation role ", role);
    //         let retVal = await integration.updateOrgContactPerson(
    //             tenantId,
    //             schoolName,
    //             userId,
    //             contactPersonFirstName,
    //             contactPersonLastName,
    //             contactPersonEmail,
    //             mobileNumber,
    //             role.roleId
    //         );
    //         console.log("onUpdateOrganisation retVal ", retVal);
    //         setRegisterButton(false);
    //         dispatch(fetchGrades());
    //         dispatch(fetchClasses());
    //         dispatch(fetchRoles());
    //         history.push("/contacts");
    //     } catch (error: any) {
    //         setRegisterButton(false);
    //         present({
    //             message: "Error " + error.message,
    //             buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
    //         });
    //     }
    // };

    const getSessionInvitation = (logonUser: any) => {
        if (
            logonUser.signInUserSession &&
            logonUser.signInUserSession.idToken &&
            logonUser.signInUserSession.idToken.payload &&
            logonUser.signInUserSession.idToken.payload.invitation
        ) {
            console.log(
                "logonUser.signInUserSession.idToken.payload.invitation :",
                logonUser.signInUserSession.idToken.payload.invitation
            );

            let invitation = JSON.parse(logonUser.signInUserSession.idToken.payload.invitation);
            console.log("**** invitation :", invitation);
            setInvitation(invitation);

            return invitation;
        }
    };

    const getSessionAction = (logonUser: any) => {
        if (
            logonUser.signInUserSession &&
            logonUser.signInUserSession.idToken &&
            logonUser.signInUserSession.idToken.payload &&
            logonUser.signInUserSession.idToken.payload.nextAction
        ) {
            console.log(
                "logonUser.signInUserSession.idToken.payload.nextAction :",
                logonUser.signInUserSession.idToken.payload.nextAction
            );

            let action = logonUser.signInUserSession.idToken.payload.nextAction;
            console.log("getSessionAction  :", action);
            setNextAction(action);

            return action;
        }
    };

    const getPhoneNumber = (logonUser: any) => {
        if (
            logonUser.signInUserSession &&
            logonUser.signInUserSession.idToken &&
            logonUser.signInUserSession.idToken.payload
        ) {
            console.log(
                "logonUser.signInUserSession.idToken.payload.phone_number ",
                logonUser.signInUserSession.idToken.payload.phone_number
            );

            return logonUser.signInUserSession.idToken.payload.phone_number;
        }
    };

    const getCognitoId = (logonUser: any) => {
        if (
            logonUser.signInUserSession &&
            logonUser.signInUserSession.idToken &&
            logonUser.signInUserSession.idToken.payload
        ) {
            console.log(
                "logonUser.signInUserSession.idToken.payload.invitation :",
                logonUser.signInUserSession.idToken.payload["cognito:username"]
            );

            return logonUser.signInUserSession.idToken.payload["cognito:username"];
        }
    };

    const getTenantId = (logonUser: any) => {
        const { accessToken } = logonUser.signInUserSession;

        const tenantId = accessToken.payload["cognito:groups"];

        return tenantId[0];
    };

    const getUserId = (logonUser: any) => {
        const { idToken } = logonUser.signInUserSession;

        // { userId : [tenantId] } get the userId
        const userIdPerTenantStr = idToken.payload["userIdPerTenant"];
        //console.log("userIdPerTenantStr :", userIdPerTenantStr);
        const userIdPerTenant = JSON.parse(idToken.payload["userIdPerTenant"]);
        console.log("userIdPerTenant", userIdPerTenant);

        let userIdTenantKeys = Object.keys(userIdPerTenant);
        console.log("userIdTenantKeys[0]", userIdTenantKeys[0]);
        let userId = userIdTenantKeys[0];

        return userId;
    };

    const onRequestJoin = async () => {
        console.log(
            "onRequestJoin  requestJoinSchoolEmail ",
            requestJoinSchoolEmail,
            " requestJoinRole ",
            requestJoinRole,
            " requestJoinFirstName ",
            requestJoinFirstName,
            " requestJoinLastName ",
            requestJoinLastName,
            " requestJoinEmail ",
            requestJoinEmail,
            " requestJoinChildFirstName ",
            requestJoinChildFirstName,
            " requestJoinChildLastName ",
            requestJoinChildLastName,
            " requestJoinChildGrade ",
            requestJoinChildGrade
        );

        let cognitoId = await getCognitoId(cognitoUser);
        console.log("onRequestJoin cognitoId ", cognitoId);
        //(tenantId,cognitoId,firstName,lastName, requestRole ,email, sms, childFirstName, childLastName, childGrade)
        let joinAccessRequest = await integration.createJoinAccessRequestInfo(
            selectedTenant,
            requestJoinFirstName,
            requestJoinLastName,
            requestJoinRole,
            requestJoinEmail,
            mobileNumber,
            requestJoinChildFirstName,
            requestJoinChildLastName,
            requestJoinChildGrade
        );

        console.log("onRequestJoin joinAccessRequest ", joinAccessRequest);

        integration.authSignOut(undefined,undefined).then((value: any) => {
            console.log("successToRequestComponent signout");
        });
        //Analytics.record({ name: 'view-invitation', attributes: { action: 'request-approval'}});
        ReactGA.event({
            category: 'Invitation',
            action: 'request-approval',
            label: 'Request Approval',                   
          });
        history.push("/pendingApproval");
    };
    const loginComponent = () => {

        return (
            <div className="login-component">
                {/* {mobile ?
                            <Carousel className="custom-slider">
                                <img src="/assets/slider1.png" height="25"/>
                                <img src="/assets/slider2.png" height="25"/>
                                <img src="/assets/slider3.png" height="25"/>
                            </Carousel>:""
                        } */}
                <br />
                <br />
                <br />
                <h1 className="title">Join My School</h1>
                <h5>Provide your mobile number below</h5>
                <br />
                <IntlTelInput
                    fieldId="inviteeNumber"
                    containerClassName="intl-tel-input"
                    preferredCountries={["za"]}
                    inputClassName="rs-input"
                    placeholder="e.g. 073 123 4567"
                    ref={telInputRef}
                    //value={state.phone}

                    telInputProps={{
                        onPaste: (e: any) => {
                            telInputRef.current.updateValFromNumber(e.clipboardData.getData("text"), false, true);
                            //setCountryCode(countryData.dialCode);
                            setMobileNumber(e.clipboardData.getData("text"));
                            if (mobileNumber.length > 1) {
                                setLoginButtonEnabler(true);
                            } else {
                                setLoginButtonEnabler(false);
                            }
                            telInputRef.current.setNumber(e.clipboardData.getData("text"));
                            e.preventDefault();
                            e.stopPropagation();
                        },
                    }}
                    onPhoneNumberChange={(status: any, value: any, countryData: any, number: any, id: any) => {
                        number = number.replace(/ /g, '');

                        setCountryCode(countryData.dialCode);

                        setMobileNumber(number);
                        if (number.length > 1 && value.match(/^[+]*[0-9 ]*$/)) {
                            setLoginButtonEnabler(true);
                        } else {
                            setLoginButtonEnabler(false);
                        }
                        setState({ ...state, phone: number })

                    }}
                />
                <br />

                <label>We'll text you to confirm you number</label>
                <p className="terms">
                    By selecting Agree and continue below, I agree to Scholar Present <br />
                    <b>
                        <a
                            className="terms-link"
                            target="_blank"
                            href="https://iconnect99-public.s3.eu-central-1.amazonaws.com/Scholar+Present+Terms+of+Service.pdf"
                        >
                            Terms of Service
                        </a> and <a
                            className="terms-link" target="_blank"
                            href="https://scholarpresent.com/privacypolicy"
                            >
                            Privacy Policy
                            </a>
                    </b>
                    .
                </p>
                <IonButton
                    id="continueBtn"
                    className="btn-green-popup drag-cancel"
                    type="button"
                    onClick={async () => {
                        console.log("Mobile Number ", mobileNumber);

                        try {
                            setLoginButton(true);
                            await onMemberRegisterRequest();
                            setLoginButton(false);

                            setStep(STEPS.SUBMIT_PINCODE);
                        } catch (error: any) {
                            console.log("error ", error);
                            if (error.code === "UsernameExistsException") {
                                present({
                                    message: `You have already joined your school. 
                            Do you want type a different number or login?`,
                                    buttons: [
                                        { text: "New Mobile Number", handler: (d) => console.log("ok pressed") },
                                        { text: "Login", handler: (d) => history.push("/login") },
                                    ],
                                });
                            } else {
                                present({
                                    message: error.message,
                                    buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
                                });
                            }
                            //  UsernameExistsException
                            // Swal.fire("Error",error.message, "error");
                            setLoginButton(false);
                        }
                    }}
                    disabled={!loginButtonEnabler || loginButton}
                >
                    {" "}
                    {loginButton ? <IonSpinner name="dots" /> : "Continue"}
                </IonButton>
            </div>
        );
    };

    const submitComponent = () => {
        return (
            <div className="otp-component">
                {/* {mobile ?
                            <Carousel className="custom-slider">
                                <img src="/assets/slider1.png" />
                                <img src="/assets/slider2.png" />
                                <img src="/assets/slider3.png" />
                            </Carousel>:""
                        } */}
                <br />
                <br />
                <br />
                <h1 className="title">Join My School</h1>

                <h5>One Time Password (OTP) has been sent to your mobile number displayed below</h5>
                <h4 className="title">
                    <br />
                    Enter the code just sent to {mobileNumber}
                </h4>

                <div>
                    <OtpInput
                        value={otpCode}
                        onChange={handleOtpChange}
                        focusStyle="otp-input-focus"
                        inputStyle="otp-input"
                        containerStyle="otp-container"
                        data-testid="invitationOpt"

                    />
                </div>

                <div className="btn-center">
                    <IonButton
                        id="submitRegPinCodeBtn"
                        className="btn-green-popup drag-cancel"
                        onClick={async () => {
                            setValidateButton(true);
                            setLoginButton(true);
                            try {
                                await onMemberRegisterSubmitPinCode();
                            } catch (error: any) {
                                console.log("error ", error);

                                present({
                                    message: `An error occurred, please retry.`,
                                    buttons: [{ text: "OK", handler: (d) => setStep(STEPS.NEW_LOGIN) }],
                                });
                            }
                            setLoginButton(false);
                            setValidateButton(false);
                        }}
                        color="green"
                        disabled={otpCode.length !== 4 || loginButton}
                    >
                        {" "}
                        {loginButton ? <IonSpinner name="dots" /> : "Validate"}
                    </IonButton>
                </div>
                <div className="btn-container">
                    <Button
                        appearance="link"
                        onClick={async () => {
                            console.log("Mobile Number ", mobileNumber);

                            try {
                                await onMemberRegisterRequest();
                                present({
                                    message: "One Time Pin has been resent.",
                                    buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
                                });
                                setStep(STEPS.SUBMIT_PINCODE);
                            } catch (error: any) {
                                console.log("error ", error);
                                present({
                                    message: "Error " + error.message,
                                    buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
                                });
                                setLoginButton(false);
                                //throw error
                            }
                        }}
                    >
                        Resend One-Time Pin
                    </Button>
                    <Button
                        appearance="link"
                        onClick={(event) => {
                            console.log("One-Time Pin");
                            setStep(STEPS.NEW_LOGIN);
                        }}
                    >
                        Entered a wrong number?
                    </Button>
                </div>
            </div>
        );
    };

    const requestToJoin = () => {
        console.log("enter requestToJoin ");

        return (
            <div className="request-form-container">
                <div>
                    <div className="request-form">
                        <div>
                            <IonRow>
                                <IonCol size="12">
                                    <IonText className="PopupHeader no-border">
                                        We are delighted to have you join our family Please tell us more about yourself
                                        by filling out the form below
                                    </IonText>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <InputPicker
                                        className="PopupInputPicker drag-cancel school-picker"
                                        placeholder="Select School"
                                        data={tenantList}
                                        onSelect={(value, item) => {
                                            console.log("value ", value, " item ", item);

                                            setSelectedTenant(value);
                                        }}
                                        required
                                        defaultValue={"Select School"}
                                    />
                                </IonCol>
                            </IonRow>
                        </div>

                        <div>
                            <IonRow>
                                <IonCol size="12">
                                    <IonText className="PopupHeader no-border">
                                        Provide with your Personal Information
                                    </IonText>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <FormGroup controlId="radioList">
                                        <RadioGroup
                                            onChange={(value) => {
                                                setRequestJoinRole(value);
                                            }}
                                            inline
                                        >
                                            <Radio value="Parent" checked>
                                                Parent{" "}
                                            </Radio>
                                            <Radio value="Student">Student</Radio>
                                            <Radio value="Teacher">Teacher</Radio>
                                        </RadioGroup>
                                    </FormGroup>
                                </IonCol>
                            </IonRow>

                            <IonRow>
                                <IonCol size="12">
                                    <Input
                                        placeholder="First Name"
                                        value={requestJoinFirstName}
                                        onChange={(value: any) => setRequestJoinFirstName(value)}
                                        required
                                        className="drag-cancel"
                                    />
                                </IonCol>
                                <IonCol size="12">
                                    <Input
                                        placeholder="Last Name"
                                        value={requestJoinLastName}
                                        onChange={(value: any) => setRequestJoinLastName(value)}
                                        required
                                        className="drag-cancel"
                                    />
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <Input
                                        placeholder="Email Optional"
                                        value={requestJoinEmail}
                                        onChange={(value: any) => setRequestJoinEmail(value)}
                                        required
                                        className="drag-cancel"
                                    />
                                </IonCol>
                            </IonRow>
                            {requestJoinRole === "Parent" ? (
                                <>
                                    <IonRow>
                                        <IonCol>
                                            <IonText className="PopupHeader">Your Child's Information</IonText>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12">
                                            <Input
                                                placeholder="First Name"
                                                value={requestJoinChildFirstName}
                                                onChange={(value: any) => setRequestJoinChildFirstName(value)}
                                                required
                                                className="drag-cancel"
                                            />
                                        </IonCol>
                                        <IonCol size="12">
                                            <Input
                                                placeholder="Last Name"
                                                value={requestJoinChildLastName}
                                                onChange={(value: any) => setRequestJoinChildLastName(value)}
                                                required
                                                className="drag-cancel"
                                            />
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12">
                                            <Input
                                                placeholder="Grade"
                                                value={requestJoinChildGrade}
                                                onChange={(value: any) => setRequestJoinChildGrade(value)}
                                                required
                                                className="drag-cancel"
                                            />
                                        </IonCol>
                                    </IonRow>
                                </>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    <div className="parent-info-submit">
                        <IonRow>
                            <IonCol size="12">
                                <IonButton
                                    id="parentInfoBtn"
                                    className=""
                                    type="button"
                                    onClick={async () => {
                                        onRequestJoin();
                                        // setStep(STEPS.SUCCESS_JOIN_REQUEST)
                                    }}
                                >
                                    Submit
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </div>
                </div>
            </div>
        );
    };
    const childConfirmationComponent = () => {
        console.log("Enter childConfirmationComponent invitation ", invitation);
        let cFirstName = invitation.linkedUserFirstName;
        let cLastName = invitation.linkedUserLastName;
        

        return (
            <div className="confirm-child">
                <div className="confirm-component ion-text-center">
                    <img className="ion-margin-bottom confirm-child-cover" src="/assets/login.jpg" />
                    <div className="box">
                        <h5 className="sub-title">
                            Is {cFirstName} {cLastName} your child?
                        </h5>
                        <Toggle
                            size="lg"
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            checked={confirmationChild}
                            onChange={(event: any) => {
                                setConfirmationChild(event);
                            }}
                        />
                    </div>

                    <IonButton
                        id="childConfirmationBtn"
                        className="btn-green-popup drag-cancel"
                        type="button"
                        onClick={async () => {
                            if (confirmationChild) {
                                integration
                                    .acceptInvitationInfo(
                                        
                                    )
                                    .then((value: any) => {
                                        console.log("acceptInvitationInfo value ", value);
                                        // Analytics.record({ name: 'view-invitation', attributes: { action: 'accept-parent-link'}});
                                        ReactGA.event({
                                            category: 'Invitation',
                                            action: 'accept-parent-link',
                                            label: 'Accept Parent Link',                   
                                          });
                                    });
                                setStep(STEPS.PARENT_INFO);
                            } else {
                                setStep(STEPS.CHILD_INFO);
                            }
                        }}
                        // disabled={!loginButtonEnabler}
                    >
                        {" "}
                        {loginButton ? <IonSpinner name="dots" /> : "Continue"}
                    </IonButton>
                    {/* <Button onClick={() => setStep(6)} color='green' block>Continue</Button> */}
                </div>
            </div>
        );
    };

    const childInfoComponent = () => {
        return (
            <div className="basic-userinfo-container">
                <div className="basic-userinfo-component">
                    <Grid fluid>
                        <Row className="show-grid">
                            <Col>
                                <form>
                                    <div className="form-field">
                                        <h5 className="form-title">Your Child's Personal Information</h5>
                                    </div>
                                    <div className="form-field">
                                        <label className="rs-control-label">First Name</label>
                                        <Input name="firstName" />
                                    </div>
                                    <div className="form-field">
                                        <label className="rs-control-label">Last Name</label>
                                        <Input name="lastName" />
                                    </div>
                                    <div className="form-field">
                                        <label className="rs-control-label">Grade</label>
                                        <Input name="Grade" />
                                    </div>
                                    <div className="form-field">
                                        <label className="rs-control-label">Mobile Number</label>
                                        <Input name="mobileNumber" />
                                    </div>
                                    <div className="form-field">
                                        <label className="rs-control-label">Email</label>
                                        <Input name="email" />
                                    </div>
                                </form>
                            </Col>
                            {/* <Col xs={12}>
                    <div className="img-block">
                        <img className='aside-image' src="/assets/child.jpg" alt="" />
                    </div>
                </Col> */}
                        </Row>
                    </Grid>
                    <IonButton
                        id="childInfoBtn"
                        className="btn-green-popup drag-cancel"
                        type="button"
                        onClick={async () => {
                            setStep(STEPS.PARENT_INFO);
                        }}
                    >
                        Submit
                    </IonButton>
                </div>
            </div>
        );
    };

    const successToRequestComponent = () => {
        integration.authSignOut(undefined, undefined).then((value: any) => {
            console.log("successToRequestComponent signout");
        });
        // Analytics.record({ name: 'view-invitation', attributes: { action: 'pending-request-approval'}});
        ReactGA.event({
            category: 'Invitation',
            action: 'pending-request-approval',
            label: 'Pending Request Approval',                   
          });
        history.push("/pendingApproval");
    };

    const parentInfoComponent = () => {
        return (
            <div className="parent-info">
                <div>
                    <div className="parent-info-form-container">
                        <form>
                            <div className="form-field">
                                <h3 className="form-title reset-margin-padding">
                                    Please provide your personal information
                                </h3>
                            </div>
                            <div className="form-field">
                                <label className="rs-control-label">First Name</label>
                                <Input
                                    name="firstName"
                                    value={parentFirstName}
                                    onChange={(e) => setParentFirstName(e)}
                                />
                            </div>
                            <div className="form-field">
                                <label className="rs-control-label">Last Name</label>
                                <Input name="lastName" value={parentLastName} onChange={(e) => setParentLastName(e)} />
                            </div>
                            <div className="form-field">
                                <label className="rs-control-label">Email (optional)</label>
                                <Input name="email" value={parentEmail} onChange={(e) => setParentEmail(e)} />
                            </div>
                        </form>

                        <div className="img-block">
                            <div className="profile">
                                <img className="aside-image" src="/assets/user.jpg" alt="" />
                                <img className="add" src="/assets/camera.svg" alt="camera" />
                            </div>
                        </div>
                    </div>

                    <IonButton
                        id="parentInfoBtn"
                        className=" parent-info-btn"
                        type="button"
                        onClick={async () => {
                            let phoneNumber = getPhoneNumber(logonUser);
                            integration
                                .updateUserPersonalInfo(
                                    invitation.invitedUserId,
                                    parentFirstName,
                                    parentLastName,
                                    invitedUser?.contacts,
                                    phoneNumber,
                                    parentEmail,
                                    cognitoUser
                                )
                                .then((value: any) => {
                                    console.log("updateUserPersonalInfo value ", value);
                                });
                        //   Analytics.record({ name: 'view-invitation', attributes: { action: 'submit-praent-info'}});
                          ReactGA.event({
                            category: 'Invitation',
                            action: 'submit-praent-info',
                            label: 'Submit Praent Info',                   
                          });
                            setStep(STEPS.SUCCESS_JOIN_REQUEST);
                        }}
                    >
                        Submit
                    </IonButton>
                </div>
            </div>
        );
    };

    const successJoinComponent = () => {
        return (
            <div className="done-component">
                <img height="100px" src="/assets/done.jpg" alt="" />
                <h5 className="sub-title">
                    Welcome {parentFirstName} {parentLastName}
                </h5>
                <h5 className="sub-title ion-margin">You have successfully joined {tenant?.tenantName} School</h5>
                <IonButton
                    id="joinSuccessInfoBtn"
                    className="btn-green-popup drag-cancel"
                    type="button"
                    onClick={async () => {
                        history.push(!mobile ? "/lcontacts/true/learner" : "/getstarted/true/learner");
                    }}
                >
                    OK
                </IonButton>
            </div>
        );

        //    <div className="confirm-component">
        //                 <img height='100px' src="/assets/done.jpg" alt="" className="center" />
        //                 <label>We'll text you to confirm you number</label>
        //                 <h5 className="sub-title">Welcome Mr X</h5>
        //                 <h5 className="sub-title ion-margin">You have successfully joined xyz School</h5>
        //                 <IonButton id="joinSuccessInfoBtn" className="btn-green-popup drag-cancel" type="button"
        //                     onClick={async () =>{
        //                     }}
        //                     >OK
        //                 </IonButton>

        //             </div>
    };

    const handleSelectedTenant = (eventKey: any) => {
        let tenant: any = tenantList.find((e: any) => e.id === eventKey);
        console.log("handleSelectedTenant tenant ", tenant.tenantName);

        setSelectedTenant(tenant.tenantName);
        console.log("handleSelectedTenant ", eventKey);
    };

    const handleSelect = (eventKey: any) => {
        let role: any = roles.find((e: any) => e.roleId === eventKey);
        console.log("handleSelect role ", role.roleName);

        setContactPersonRole(role.roleName);
        console.log("handleSelect ", eventKey);
    };

    const loadContact = ()=>{
        if (isParentOrStudentView()){
            history.push(!mobile ? "/lcontacts/true/learner" : "/getstarted/true/learner")
        }else{
            history.push(!mobile ? "/contacts/true/school" : "/getstarted/true/learner")
        }
    }
    const isParentOrStudentView = () => {
        return contactPersonRole === "Student" || contactPersonRole === "Parent";
    };
    const clearCache = async () => {
        console.log("header clearCache enter");
        const store = new Storage();

        await store.create();
        let pushNotificationKey = await store.get("pushNotificationKey");
        let appNotificationKey = await store.get("appNotificationKey");

        integration.authSignOut(pushNotificationKey, appNotificationKey).then((value: any) => {});
        store.clear();
        classesSetData([]);
        gradeSetData([]);
        conversationsSetData([]);
        messagesReset();
        contactsResetContacts();
        rolesReset();
        invitationsResetContacts();
        groupsReset();
        console.log("header clearCache exit");
    };

    return (
        <>
            {/* <Modal className='register-modal' size='lg' backdrop={true} show={props.show} onHide={() => props.setShow(false)}>
            <Modal.Header>
                <Modal.Title>Join My School</Modal.Title>
            </Modal.Header>
            <Modal.Body> */}

            {step === STEPS.NEW_LOGIN && loginComponent()}
            {step === STEPS.SUBMIT_PINCODE && submitComponent()}
            {step === STEPS.PARENT_LINK_CHILD && childConfirmationComponent()}
            {step === STEPS.CHILD_INFO && childInfoComponent()}
            {step === STEPS.PARENT_INFO && parentInfoComponent()}
            {step === STEPS.SUCCESS_JOIN_REQUEST && successJoinComponent()}
            {step === STEPS.REQUEST_TO_JOIN && requestToJoin()}
            {step === STEPS.JOIN_REQUEST_COMPLETE &&
                present({
                    message: "Successfully requested",
                    buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
                })}
            {step === STEPS.JOIN_REQUEST_COMPLETE && successToRequestComponent()}
            {step === STEPS.LOAD_CONTACT &&
                loadContact()}

            {/* </Modal.Body>
        </Modal> */}
        </>
    );
};
export default Invitation;