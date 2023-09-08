import { useEffect, useState, useRef, forwardRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Analytics } from 'aws-amplify';
import ReactGA from 'react-ga';


import useGetCacheTenantId from "../../hooks/useGetCacheTenantId";

import { fetchGrades } from "../../stores/grades/actions";
import { fetchClasses } from "../../stores/classes/actions";
import { fetchRoles } from "../../stores/roles/actions";
import { cacheSession, getUserProfile } from "../../utils/StorageUtil";
import { cleanSpaces, getSessionAction,getCognitoId, getUsername,getAnalyticsUserContext } from "../../utils/Utils";

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
    IonInput,
} from "@ionic/react";
import {
    Button,
    InputGroup,
    Modal,
    Icon,
    Input,
    Form,
    Grid,
    Row,
    Col,
    Panel,
    Carousel,
    FormGroup,
    RadioGroup,
    Radio,
} from "rsuite";
import "./login-web.css";
// @ts-ignore
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
//import { } from "scholarpresent-integration"

//redux
import { connect } from "react-redux";
import { classesSetData } from "../../stores/classes/actions";
import { gradeSetData } from "../../stores/grades/actions";
import { conversationsSetData, messagesReset } from "../../stores/messages/actions";
import { contactsResetContacts } from "../../stores/contacts/actions";
import { invitationsResetContacts } from "../../stores/contacts/actions";
import { groupsReset } from "../../stores/groups/actions";
import {rolesReset} from "../../stores/roles/actions";


import * as integration from "scholarpresent-integration";
import useIsLogined from "../../hooks/useIsLogined";
import useGetCacheUserRoleName from "../../hooks/useGetCacheUserRoleName";

const steps: any = {
    1: "Log in",
    2: "",
    3: "Join Scholar Present as ...",
    41: "Tell us about yourself",
    42: "As a parent, Please tell us more about yourself",
    43: "School Name, Please confirm ",
    61: "Tell us about yourself",
    62: "As a parent, Please tell us more about yourself",
    63: "School Name, Please confirm ",
    7: "Fill School Information",
    8: "Please provide your personal information",
    9: "Welcome",
};

const LoginWeb = (props: any) => {

    const STEPS = { LOGIN: 0, SUBMIT_PINCODE: 1, NEW_SCHOOL_PRE_LOAD_CONGIGURATION: 3, 
        INVITATION_PRE_LOAD_CONGIGURATION:9 ,HOME: 2 };
    let history = useHistory();
    const dispatch = useDispatch();
    const telInputRef = useRef<any>(null);

    const [present] = useIonAlert();

    const [step, setStep] = useState<number>(STEPS.LOGIN);
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [logonUser, setLogonUser] = useState<any>(null);
    const [cognitoUser, setCognitoUser] = useState<any>(null);
 
    const [otpCode, setOtpCode] = useState("");

    const [loginButton, setLoginButton] = useState(false);
    const [validateButton, setValidateButton] = useState(false);

    const [loginButtonEnabler, setLoginButtonEnabler] = useState(false);
    const [validateButtonEnabler, setValidateButtonEnabler] = useState(false);

    const [countryCode, setCountryCode] = useState("");
    const [countryName, setCountryName] = useState("");

    const [mobile, setMobile] = useState(window.innerWidth < 992);
    const [isLogined, setIsLogined]  = useState(useIsLogined()) 
    const roleName = useGetCacheUserRoleName();
    let tenantId:string = useGetCacheTenantId();
    const [state, setState] = useState({phone:""});
    const store = new Storage();
    const socket = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const URL = 'wss://8ftp76ivtj.execute-api.af-south-1.amazonaws.com/dev';



    useEffect(() => {
        console.log("LoginWeb props ", props );
        if (props.loginStatus === false || roleName === null || isLogined === null || isLogined === false) {
            ReactGA.event({
                category: 'Login',
                action: 'login-screen',
                label: 'opening login',
              });
        } else
        if (roleName === "Student" || roleName === "Parent") {
            ReactGA.event({
                category: 'Login',
                action: 'redirect-lcontacts',
                label: 'redirect-lcontacts',
              });
            history.replace('/lcontacts');
        } else {
            ReactGA.event({
                category: 'Login',
                action: 'redirect-contacts',
                label: 'redirect-contacts',
              });
            history.replace('contacts');
        }
    }, [history, isLogined, roleName]);

   
    useEffect(() => {
        clearCache().then(value=>{});
    }, []);
    
    const handleOtpChange = (value: string) => setOtpCode(value);
    

    const onLoginRequest = async () => {
        // present({
        //     message: `login-web Mobile Number `+ mobileNumber ,
        //     buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
        // });

        let altMobileNumber = mobileNumber;
        altMobileNumber = cleanSpaces(mobileNumber);
        console.log( "onLoginRequest altMobileNumber ", altMobileNumber);
        // if (!mobileNumber.startsWith("+" + countryCode)) {
        //     altMobileNumber = "+" + countryCode + altMobileNumber;
        // }

        let cUser = await integration.authSignIn(altMobileNumber);
        if(cUser?.challengeParam?.name === undefined){
            throw Error("Invalid login");
        }
        await setCognitoUser(cUser);
        console.log("onLoginRequest cognitoUser :", cognitoUser);
        setOtpCode("")
        
        ReactGA.event({
            category: 'Login',
            action: 'request-otp',
            label: 'Requested OTP',
          });
        setStep(STEPS.SUBMIT_PINCODE);
    };
    const onSocketOpen = useCallback((event) => {
        setIsConnected(true);
        //const name = prompt('Enter your name');
        //socket.current?.send(JSON.stringify({ action: 'setName', name }));
        console.log("onSocketOpen event ", event);
      }, []);
    
      const onSocketClose = useCallback(() => {
        //setMembers([]);
        setIsConnected(false);
        //setChatRows([]);
      }, []);
    
      const onSocketMessage = useCallback((dataStr) => {
        const data = JSON.parse(dataStr);
        if (data.members) {
          //setMembers(data.members);
        } else if (data.publicMessage) {
          //setChatRows(oldArray => [...oldArray, <span><b>{data.publicMessage}</b></span>]);
        } else if (data.privateMessage) {
          alert(data.privateMessage);
        } else if (data.systemMessage) {
          //setChatRows(oldArray => [...oldArray, <span><i>{data.systemMessage}</i></span>]);
        }
      }, []);

    const onConnect = useCallback(() => {
        if (socket.current?.readyState !== WebSocket.OPEN) {
          socket.current = new WebSocket(URL);
          console.log("socket.current ", socket.current);
          socket.current.addEventListener('open', onSocketOpen);
          socket.current.addEventListener('close', onSocketClose);
          socket.current.addEventListener('message', (event) => {
            onSocketMessage(event.data);
          });
        }
      }, []);

    const onLoginSubmitPinCode = async () => {
        console.log("onLoginSubmitPinCode cognitoUser :", cognitoUser);

        let signedInUser = await integration.authSubmitCode(cognitoUser, otpCode);

        if (signedInUser.challengeName === "CUSTOM_CHALLENGE") {
            ReactGA.event({
                category: 'Login',
                action: 'error-otp',
                label: 'Requested OTP',
              });
            present({
                message: `Invalid Pin Code. Please enter a correct pin code.`,
                buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
            });
            return;
        }

        console.log("onLoginSubmitPinCode signedInUser :", signedInUser);
        // let userRoles = integration.getUserRoles(null);
        // console.log("onLoginSubmitPinCode userRoles :", userRoles);
        
        onConnect();
        let requestJoinObj = getRequestObj(signedInUser.signInUserSession);
        if (requestJoinObj != null) {
            // Analytics.updateEndpoint({
            //     address: getCognitoId(signedInUser),
            //        userId: getUsername(cognitoUser),
            //        // User attributes
            //        userAttributes: {
            //           interests: [mobileNumber]
            //         },
            //         location: {
            //             country:countryName
            //         }
            // })
            // Analytics.record({ name: 'view-login', attributes: { action: 'pending-approval', username: mobileNumber }});
            ReactGA.event({
                category: 'Login',
                action: 'pending-approval',
                label: 'Pending Approval',                   
              });

            history.push("/pendingApproval");
        } else if (signedInUser.challengeName !== "CUSTOM_CHALLENGE") {
           let backendNextAction = getSessionAction(signedInUser);

            if(backendNextAction ==="newOrg" ){
                // Analytics.updateEndpoint({
                //     address: getCognitoId(signedInUser),
                //        userId: getUsername(cognitoUser),
                //        // User attributes
                //        userAttributes: {
                //           interests: [mobileNumber]
                //         },
                //         location: {
                //             country:countryName
                //         }
                // })
                // Analytics.record({ name: 'view-login', attributes: { action: 'new-school-complete-sign-up', username: mobileNumber }});
                ReactGA.event({
                    category: 'Login',
                    action: 'new-school-complete-sign-up',
                    label: 'New School Complete Sign Up',                   
                  });
    
                history.push("/newschool", {
                    step:STEPS.NEW_SCHOOL_PRE_LOAD_CONGIGURATION
                });

            } else if(backendNextAction ==="parentSignUpByInvitation" || backendNextAction ==="parentRequestToJoin"   ){
                
                // Analytics.updateEndpoint({
                //     address: getCognitoId(signedInUser),
                //        userId: getUsername(cognitoUser),
                //        // User attributes
                //        userAttributes: {
                //           interests: [mobileNumber]
                //         },
                //         location: {
                //             country:countryName
                //         }
                // })
                // Analytics.record({ name: 'view-login', attributes: { action: 'join-school-complete-sign-up', username: mobileNumber }});
                ReactGA.event({
                    category: 'Login',
                    action: 'join-school-complete-sign-up',
                    label: 'Join School Complete Sign Up',                   
                  });

                history.push("/joinschool", {
                    step:STEPS.INVITATION_PRE_LOAD_CONGIGURATION
                });

            } else { 
                await cacheSession(signedInUser.signInUserSession);
                setLogonUser(signedInUser);
                console.log("onLoginSubmitPinCode logonUser :", logonUser);
                let userProfile = await getUserProfile(signedInUser.signInUserSession);
                console.log("onLoginSubmitPinCode userProfile :", userProfile);
                let _tenantId = getTenantId(userProfile)
                // Analytics.updateEndpoint({
                //     address: getCognitoId(signedInUser),
                //        userId: getUsername(cognitoUser),
                //        // User attributes
                //        userAttributes: {
                //           interests: [_tenantId, getUsername(cognitoUser), userProfile?.roleName ]
                //         },
                //         location: {
                //             country:countryName
                //         }
                // })
                // Analytics.record({ name: 'view-login', attributes: { action: 'login-success'}});
                
                ReactGA.event({
                    category: 'Login',
                    action: 'login-success',
                    label: 'Login Success',                   
                  });
                dispatch(fetchGrades(undefined));
                dispatch(fetchClasses(_tenantId));
                dispatch(fetchRoles());
                if (userProfile?.roleName === "Student" || userProfile?.roleName === "Parent") {

                    history.replace("/lcontacts");
                } else {

                    history.replace("/contacts");
                }
            }
        } else {
            present({
                message: `Invalid Pin Code. Please enter a correct pin code.`,
                buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
            });
            setStep(STEPS.SUBMIT_PINCODE);
        }

        console.log("onSubmitPinCode logonUser :", logonUser);
    };

    const getTenantId = (userProfile: any) => {
        let _tenantId; 
        if(userProfile?.tenantIDs){
            _tenantId = userProfile?.tenantIDs[0]
        }
    
        return _tenantId;
      };
    const getRequestObj = (logonUser: any) => {
        let requestJoinObj = null;
        if (logonUser.idToken.payload.requestJoinObj) {
            requestJoinObj = JSON.parse(logonUser.idToken.payload.requestJoinObj);
        }

        return requestJoinObj;
    };

    const loginComponent = () => {
       
        const setCaretPosition = (caretPos:any) => {
            const elem:any = document.getElementsByClassName('rs-input')[0];

            if (elem) {
                elem?.focus();
                setTimeout(() => {
                    elem?.setSelectionRange(caretPos, caretPos);
                }, 0);
            }
        };

        
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
                <h1 className="title">Login</h1>
                <h5>Provide your mobile number below</h5>
                <br />
                <IntlTelInput
                    fieldId="loginNumber"
                    containerClassName="intl-tel-input"
                    preferredCountries={["za"]}
                    inputClassName="rs-input"
                    placeholder="e.g. 073 123 4567"
                    ref={telInputRef}
                    //value={state.phone}

                    telInputProps={{
                        onPaste: (e: any) => {
                            telInputRef.current.updateValFromNumber(e.clipboardData.getData("text"), false, true);
                            telInputRef.current.setNumber(e.clipboardData.getData("text"));
                            e.preventDefault();
                            e.stopPropagation();
                        },
                    }}
                    
                    onPhoneNumberChange={(status: any, value: any, countryData: any, number: any, id: any) => {
                            //console.log("onPhoneNumberChange status ",status, " countryData ", countryData);
                            number = number.replace(/ /g, '');
                            setCountryName(countryData.iso2);
                       
                            setMobileNumber(number);
                            if (number.length > 1 && value.match(/^[+]*[0-9 ]*$/)) {
                                setLoginButtonEnabler(true);
                            } else {
                                setLoginButtonEnabler(false);
                            }
                            setState({ ...state, phone: number })
                            //telInputRef.current.focus(); cursorPosition
                            setCaretPosition(number?.length?number?.length:0);
                    }}

                />

                <label>We'll text you to confirm your number</label>

                <IonButton
                    id="continueBtn"
                    className="btn-green-popup drag-cancel"
                    type="button"
                    onClick={async () => {
                        console.log("Mobile Number ", mobileNumber);

                        try {
                            setLoginButton(true);
                            await onLoginRequest();
                            setLoginButton(false);

                            setStep(STEPS.SUBMIT_PINCODE);
                        } catch (error: any) {
                            console.log("Login error :", error)
                            if (error.code === "UserNotFoundException" || error.message === "Invalid login" ) {
                                present({
                                    message: `Your mobile number is incorrect, please enter the correct number 
                            or click on register to register your number.`,
                                    buttons: [
                                        { text: "Register", handler: (d) => history.push("/joinschool") },

                                        { text: "Retry again", handler: (d) => console.log("ok pressed") },
                                    ],
                                });
                            } else {
                                present({
                                    message: error.message,
                                    buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
                                });
                            }
                            setLoginButton(false);
                        }
                    }}
                    disabled={!loginButtonEnabler || loginButton}
                >
                    {" "}
                    {loginButton ? <IonSpinner name="dots" /> : "Continue"}
                </IonButton>
                <br />
                <br />
                <br />
                <p>
                    Have not joined My School Join?
                    <Button
                        appearance="link"
                        color="red"
                        onClick={(event: any) => {
                            history.push("/joinschool");
                        }}
                    >
                        <b>Join My School</b>
                    </Button>
                </p>

                <br />
                <br />
                <p>
                    
                    <Button
                        appearance="default"
                        size="xs"
                        onClick={(event: any) => {
                            window.open('https://scholarpresent.com/privacypolicy');
                        }}
                    >Find the Privacy Policy
                    </Button>
                </p>
            </div>
        );
    };

    const clearCache = async () => {
        console.log("clearCache enter");
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
        console.log("clearCache exit");
    };

    const submitComponent = () => {
        return (
            <div className="otp-component">
                {/* {mobile ?
                            <Carousel className="custom-slider">
                                <img src="/assets/slider1.png" height="2" />
                                <img src="/assets/slider2.png" height="2"/>
                                <img src="/assets/slider3.png" height="2"/>
                            </Carousel>:""
                        } */}
                <br />
                <br />
                <br />
                <h1 className="title">Login</h1>
                <h5>One Time Password (OTP) has been sent to your mobile number displayed below</h5>
                <br />
                <h4 className="title">
                    Enter the code just sent to{" "}
                    {mobileNumber.startsWith("+" + countryCode) ? mobileNumber : "+" + countryCode + mobileNumber}
                </h4>

                <div>
                    <OtpInput
                        data-testid="loginOpt"
                        value={otpCode}
                        onChange={handleOtpChange}
                        focusStyle="otp-input-focus"
                        inputStyle="otp-input"
                        containerStyle="otp-container"
                    />
                </div>

                <div className="btn-center">
                    <IonButton
                        id="submitPinCodeBtn"
                        className="btn-green-popup drag-cancel"
                        onClick={async () => {
                            setValidateButton(true);
                            setLoginButton(true);
                            try {
                                await onLoginSubmitPinCode();
                            } catch (error: any) {
                                console.log("login-web error ", error);
                                present({
                                    message: `An error occurred, please retry.`,
                                    buttons: [{ text: "OK", handler: (d) => setStep(STEPS.LOGIN) }],
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
                                await onLoginRequest();
                                present({
                                    message: `One Time Pin has been resent..`,
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
                            setStep(STEPS.LOGIN);
                        }}
                    >
                        Entered a wrong number?
                    </Button>
                </div>
            </div>
        );
    };
    console.log("login-web");

    return (
        // <Modal classPrefix='rs-register-modal' className='register-modal' size='lg' backdrop={true} show={props.show} onHide={() => props.setShow(false)}>
        // !mobile ?
        // <Modal className='register-modal' size='lg' backdrop={true} show={props.show} onHide={() => props.setShow(false)}>
        //     <Modal.Header>
        //         <Modal.Title>Login</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body>
        //         {
        //             step === STEPS.LOGIN &&
        //             loginComponent()
        //         }
        //         {
        //             step === STEPS.SUBMIT_PINCODE &&
        //             submitComponent()
        //         }
        //     </Modal.Body>
        // </Modal>:
        <>
            {step === STEPS.LOGIN && loginComponent()}
            {step === STEPS.SUBMIT_PINCODE && submitComponent()}
        </>
    );
};
const mapStateToProps = (state: any) => ({});
const mapDispatchToProps = {
    classesSetData,
    gradeSetData,
    conversationsSetData,
    contactsResetContacts,
    invitationsResetContacts
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginWeb);
