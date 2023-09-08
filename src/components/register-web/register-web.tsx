import { useEffect, useState, useRef } from "react";
import { Analytics,API, Auth,Amplify } from 'aws-amplify';

import OtpInput from "react-otp-input";

import {
  Button,
  InputGroup,
  Modal,
  Carousel,
  Icon,
  Input,
  FlexboxGrid,
  Grid,
  Row,
  Col,
  Panel,
  Dropdown,
  FormGroup,
  RadioGroup,
  Radio,InputPicker
} from "rsuite";
import { cacheSession , cacheTenantDetails, cacheUserRoleName,CACHE_USER_LOGIN_ROLE_NAME, CACHE_USER_PROFILE_FULL_NAME} from "../../utils/StorageUtil";
import { cleanSpaces, getCognitoId, getUsername } from "../../utils/Utils";

import { useHistory } from "react-router-dom";
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
import { classesSetData } from "../../stores/classes/actions";
import { gradeSetData } from "../../stores/grades/actions";
import { conversationsSetData, messagesReset } from "../../stores/messages/actions";
import { contactsResetContacts } from "../../stores/contacts/actions";
import { invitationsResetContacts } from "../../stores/contacts/actions";
import { groupsReset } from "../../stores/groups/actions";
import {rolesReset} from "../../stores/roles/actions";

import * as integration from "scholarpresent-integration";
import { lte } from "cypress/types/lodash";

var https = require('https');

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
const RegisterWeb = (props: any) => {
  const dispatch = useDispatch();
  const [present] = useIonAlert();

  const telInputRef = useRef<any>(null);

  const STEPS = { NEW_LOGIN: 0, SUBMIT_PINCODE: 1,PRE_LOAD_CONGIGURATION: 3 ,SCHOOL_PROFILE: 2 };
  let history = useHistory();

  const [step, setStep] = useState<number>(
    props?.history?.location?.state?.step === STEPS.PRE_LOAD_CONGIGURATION? 
      STEPS.PRE_LOAD_CONGIGURATION
    :
    (props.newSchool ? STEPS.NEW_LOGIN : 0)
  );

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

  const [schoolName, setSchoolName] = useState<string>();
  const [schoolEmail, setSchoolEmail] = useState<string>();
  const [roleName, setRoleName] = useState<string>();
  const [contactPersonRoleId, setContactPersonRoleId] = useState<string>();
  const [contactPersonFirstName, setContactPersonFirstName] =
    useState<string>();
  const [contactPersonLastName, setContactPersonLastName] = useState<string>();
  const [contactPersonEmail, setContactPersonEmail] = useState<string>();

  const [countryCode, setCountryCode] = useState("");
  const [countryISOCode, setCountryISOCode] = useState("");
  const [countryName, setCountryName] = useState<string>();
  const [countryDialingCode, setCountryDialingCode] = useState<string>();

  const [roles, setRoles] = useState<any[]>([]);
  const [mobile, setMobile] = useState(window.innerWidth < 992);
  const [state, setState] = useState({phone:""});

  const store = new Storage();


  useEffect(() => {
    console.log("register-web props.history.location.state ", props?.history?.location?.state);
    //handleLogout();
    setStep(STEPS.NEW_LOGIN);
  }, [props]);

  useEffect(() => {
    clearCache().then(value=>{});
}, []);

  const handleOtpChange = (value: string) => setOtpCode(value);
  const handleLogout = async () => {
    console.log("register-web handleLogout enter");
    await store.create();
    store.clear();
    integration.authSignOut(undefined, undefined).then((value: any) => {});
    console.log("register-web handleLogout exit");

};

  const onOrganisationRegsiterRequest = async () => {
    let altMobileNumber = mobileNumber.replace("+", "");
    altMobileNumber = cleanSpaces(altMobileNumber);
    let defaultEmail = altMobileNumber + "@scholarpresent.com";
    console.log("altMobileNumber ", altMobileNumber);
    let cUser = await integration.authSignUpOrg(
      cleanSpaces(mobileNumber),
      defaultEmail
    );
    await setCognitoUser(cUser);
    console.log("onOrganisationRegsiterRequest cognitoUser :", cognitoUser);
    Analytics.record({ name: 'view-register-school', attributes: { action: 'request-otp'}});

    setStep(STEPS.SUBMIT_PINCODE);
  };

  const onOrganisationRegsiterSubmitPinCode = async () => {
    console.log(
      "onOrganisationRegsiterSubmitPinCode cognitoUser :",
      cognitoUser
    );

    let signedInUser = await integration.authSubmitCode(
      cognitoUser,
      otpCode
    );

  const apiName = 'platformapi';
  const path = '/users';
  const token = signedInUser.signInUserSession.idToken.jwtToken 
  console.log("token ", token);
  // await Amplify.configure({
  //   API: {
  //     endpoints: [
  //         {
  //             name: "platformapi",
  //             endpoint: "https://r9drhgcno4.execute-api.af-south-1.amazonaws.com/dev",
  //             region:"af-south-1"
  //         }]},
  // });
  // const myInit = {
  //   headers: {
      
  //       Authorization: token,
  //     // "Access-Control-Allow-Origin": "http://localhost:3000",
  //     //"Access-Control-Allow-Origin": "*",
  //     // "Access-Control-Allow-Credentials": "true"
      
  //   }, // OPTIONAL
  //   queryStringParameters: 
  //        {
  //         "action":"getUsers"
  //       },
  //   action:"getUsers"
  // };

  // let apiResults = await API.get(apiName, path, myInit);
  // console.log(">>>>>>>>>>>>>> apiResults ",apiResults );
  // try {
  //   const response = await fetch(
      
  //     "https://r9drhgcno4.execute-api.af-south-1.amazonaws.com/dev/users",{
  //       method: 'GET', 
  //       mode: 'no-cors', 
  //       headers:{
  //       "Content-Type": "application/json",
  //       "Authorization":token,
  //       "queryStringParameters" : JSON.stringify(
  //         {
  //          "action":"getUsers"
  //        })
  //       },
        
  //     }
      
  //   );
  //   const data = await response.json();
  //   console.log(data);
  // } catch (error) {
  //   console.log(error);
  // }
  // var myHeaders = new Headers();
  // myHeaders.append("Authorization", token);
  // myHeaders.append("Content-Type", "application/json");
  
  // var raw = JSON.stringify({
  //   "action": "getTenants"
  // });
  // myHeaders.append("queryStringParameters", raw);
  
  
  // let requestOptions:any = {
  //   mode: 'no-cors',
  //   method: 'GET',
  //   credentials: "include",
  //   headers: myHeaders,
  //   // body: JSON.stringify({
  //   //   "action": "getUsers"
  //   // }),
  //   redirect: 'follow'
  // };
  
  // let results = await fetch("https://r9drhgcno4.execute-api.af-south-1.amazonaws.com/dev/users/{proxy+}", requestOptions);
  // console.log("results ", await results.text() )

    if (signedInUser.challengeName === "CUSTOM_CHALLENGE") {
      Analytics.record({ name: 'view-register-school', attributes: { action: 'error-otp'}});

      present({
        message: `Invalid Pin Code. Please enter a correct pin code.`,
        buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
      });
      return;
    }

    console.log(
      "onOrganisationRegsiterSubmitPinCode signedInUser :",
      signedInUser
    );
    await preConfigOrganisationInfo(signedInUser);

    console.log("onSubmitPinCode logonUser :", logonUser);
  };

  const preConfigOrganisationInfo = async (signedInUser:any) =>{
    
    if(signedInUser ===undefined){
      signedInUser =await integration.currentAuthenticatedUser();
    }

    cacheSession(signedInUser.signInUserSession).then((value) => {
      console.log("cacheSession value :", value);
    });
    

    let tenantId = getTenantId(signedInUser.signInUserSession);

    dispatch(fetchGrades(undefined));
    dispatch(fetchClasses(tenantId));
    dispatch(fetchRoles());

    setLogonUser(signedInUser);
    console.log("onOrganisationRegsiterSubmitPinCode logonUser :", logonUser);

    getRolesFromSession(signedInUser);
    console.log("roles :", roles);
      Analytics.updateEndpoint({
        address: getCognitoId(signedInUser),
          userId: getUsername(cognitoUser),
          // User attributes
          userAttributes: {
              interests: [mobileNumber]
            },
            location: {
                country:countryISOCode
            }
    })
    Analytics.record({ name: 'view-register-school', attributes: { action: 'school-registration-success'}});

    setStep(STEPS.SCHOOL_PROFILE);
    return <>Nothing</>
  }
  const onUpdateOrganisation = async () => {
    //setStep(8)
    try {
      console.log("logonUser ", logonUser);
      setRegisterButton(true);
      let tenantId = getTenantId(logonUser.signInUserSession);
      let userId = getUserId(logonUser);
      let mobileNumber = getPhoneNumber(logonUser);
      console.log(
        "onUpdateOrganisation tenantId ",
        tenantId,
        " schoolName ",
        schoolName,
        " userId ",
        userId,
        " contactPersonFirstName ",
        contactPersonFirstName,
        " contactPersonLastName ",
        contactPersonLastName,
        " contactPersonEmail ",
        contactPersonEmail,
        " sms ", mobileNumber,
        " contactPersonRole ",
        contactPersonRoleId
      );
      let retVal = await integration.updateOrgContactPerson(
        tenantId,
        schoolName,
        userId,
        contactPersonFirstName,
        contactPersonLastName,
        contactPersonEmail,mobileNumber,
        contactPersonRoleId, countryName , countryDialingCode, countryISOCode);
      
      

      console.log("onUpdateOrganisation retVal ", retVal);
      cacheTenantDetails(tenantId, roleName, contactPersonFirstName+" "+ contactPersonLastName);
      cacheUserRoleName( roleName);   
      setRegisterButton(false);
      dispatch(fetchGrades(tenantId));
      dispatch(fetchClasses(tenantId));
      dispatch(fetchRoles());
      Analytics.record({ name: 'view-register-school', attributes: { action: 'update-school-info'}});

      history.push(!mobile? "/contacts/true/school":"/getstarted/true/learner");
    } catch (error: any) {
      console.warn("register-web error ", error);
      setRegisterButton(false);
      present({
        message: "Error "+ error.message,
        buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
      });
    }
  };

  const getRolesFromSession = (logonUser: any) => {
    if (
      logonUser.signInUserSession &&
      logonUser.signInUserSession.idToken &&
      logonUser.signInUserSession.idToken.payload &&
      logonUser.signInUserSession.idToken.payload.roles
    ) {
      console.log(
        "logonUser.signInUserSession.idToken.payload.roles :",
        logonUser.signInUserSession.idToken.payload.roles
      );

      let rolesArray = JSON.parse(
        logonUser.signInUserSession.idToken.payload.roles
      );
      console.log("rolesArray :", rolesArray);
      let rolesData:any = [];
      rolesArray.map((role: any) => {
        rolesData.push({
            label: role.roleName,
            value: role.roleId
          })
      });
      setRoles(rolesData);


    }
  };
  const getPhoneNumber=(logonUser:any)=>{
    if(logonUser.signInUserSession && logonUser.signInUserSession.idToken && 
        logonUser.signInUserSession.idToken.payload ){
        console.log("logonUser.signInUserSession.idToken.payload.phone_number " , logonUser.signInUserSession.idToken.payload.phone_number);

        return logonUser.signInUserSession.idToken.payload.phone_number;
    }
}
  const getTenantId = (userSession: any) => {
    const { accessToken } = userSession;
    const { idToken } = userSession;

    let tenantId = accessToken.payload["cognito:groups"][0];

    return tenantId;
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
  const loginComponent = () => {
    return (
      <div className="login-component">
        {/* {mobile ? (
          <Carousel className="custom-slider">
            <img src="/assets/slider1.png" height="50" />
            <img src="/assets/slider2.png" height="50" />
            <img src="/assets/slider3.png" height="50" />
          </Carousel>
        ) : (
          ""
        )} */}
        <br />
        <br />
        <br />
        <h1 className="title">New School</h1>
        <h5>Provide your mobile number below</h5>
        <br />
        <IntlTelInput
          fieldId="newSchoolNumber"
          containerClassName="intl-tel-input"
          preferredCountries={["za"]}
          inputClassName="rs-input"
          placeholder="e.g. 073 123 4567"
          ref={telInputRef}
          //value={state.phone}
          telInputProps={{
            onPaste: (e: any) => {
              telInputRef.current.updateValFromNumber(
                e.clipboardData.getData("text"),
                false,
                true
              );
              //setCountryCode(countryData.dialCode);
              setMobileNumber(e.clipboardData.getData("text"));
              if(mobileNumber.length > 1 ){
                setLoginButtonEnabler(true);
              }else{
                setLoginButtonEnabler(false);
              }
              telInputRef.current.setNumber(e.clipboardData.getData("text"));
              e.preventDefault();
              e.stopPropagation();
            },
          }}
          onPhoneNumberChange={(
            status: any,
            value: any,
            countryData: any,
            number: any,
            id: any
          ) => {
            number = number.replace(/ /g, '');

            setCountryCode(countryData.dialCode);
            setCountryISOCode(countryData.iso2 )
            setCountryName(countryData.name );
            setCountryDialingCode(countryData.dialCode)

            setMobileNumber(number);
            if(number.length > 1 && value.match(/^[+]*[0-9 ]*$/)){
              setLoginButtonEnabler(true);
            }else{
              setLoginButtonEnabler(false);
            }
            setState({ ...state, phone: number })

          }}
        />

        <label>We'll text you to confirm your number</label>
        <p className="terms">
          By continuing you are agreeing to Scholar Present <br />
          <b>
            <a
              className="terms-link" target="_blank"
              href="https://scholarpresent-downloads.s3.af-south-1.amazonaws.com/ScholarPresentTermsofService.pdf"
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
              await onOrganisationRegsiterRequest();
              setLoginButton(false);

              setStep(STEPS.SUBMIT_PINCODE);
            } catch (error: any) {
              console.log("error ", error);

              if (error.code === "UsernameExistsException") {
                present({
                  message: `A School is already registered with this mobile. 
                            Do you want type a different number or login?`,
                  buttons: [
                    {
                      text: "New Mobilr Number",
                      handler: (d) => console.log("ok pressed"),
                    },
                    { text: "Login", handler: (d) => history.push("/login") },
                  ],
                });
              } else {
                present({
                  message: error.message,
                  buttons: [
                    { text: "Ok", handler: (d) => console.log("ok pressed") },
                  ],
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

      </div>
    );
  };

  const submitComponent = () => {
    return (
      <div className="otp-component">
        {/* {mobile ? (
          <Carousel className="custom-slider">
            <img src="/assets/slider1.png" />
            <img src="/assets/slider2.png" />
            <img src="/assets/slider3.png" />
          </Carousel>
        ) : (
          ""
        )} */}
        <br />
        <br />
        <br />
        <h1 className="title">New School</h1>
        <h5>
          One Time Password (OTP) has been sent to your mobile number displayed
          below
        </h5>
        <br />
        <h4 className="title">
          Enter the code just sent to{" "}
          {mobileNumber.startsWith("+" + countryCode)
            ? mobileNumber
            : "+" + countryCode + mobileNumber}
        </h4>

        <div>
                    <OtpInput
                        value={otpCode}
                        onChange={handleOtpChange}
                        focusStyle="otp-input-focus"
                        inputStyle="otp-input"
                        containerStyle="otp-container"
                        data-testid="registerOpt"

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
                await onOrganisationRegsiterSubmitPinCode();
              } catch (error: any) {
                console.log("error ", error);
                present({
                  message: "Error "+ error.message,
                  buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
                });
              }
              setLoginButton(false);
              setValidateButton(false);
            }}
            color="green"
            disabled={otpCode.length !==4 || loginButton}
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
                await onOrganisationRegsiterRequest();
                present({
                  message: "One Time Pin has been resent.",
                  buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
                });
                setStep(STEPS.SUBMIT_PINCODE);
              } catch (error: any) {
                console.log("error ", error);
                present({
                  message: "Error "+ error.message,
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


  const schoolProfileComponent = () => {
    return <>
    {true ? (
      <div className={!mobile? "school-register-component":""}>
      <IonGrid>
      <form>
        <IonRow>
          <IonCol>
           
                <IonText className="PopupHeader">
                  You're almost done. Provide with your School Information
                </IonText>
             
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="School Name"
              onChange={(value) => {
                setSchoolName(value);
              }}
              required
              style={{ borderColor: "#f00" }}
              className="drag-cancel"
            />
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="School Email"
              onChange={(value) => {
                setSchoolEmail(value);
              }}
              type="email"
              required
              style={{ borderColor: "#f00" }}
              className="drag-cancel"
            />
          </IonCol>
        </IonRow>
        
        <IonRow>
          <IonCol>
                <IonText className="PopupHeader">
                    Provide with your Personal Information
                </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          
          <IonCol size="12" size-md="6">
          <InputPicker
            className="PopupInputPicker drag-cancel"
            placeholder="Select Role [Principal]"
            data={roles}
          //   data={rolesMod}
            onSelect={(value, item) => {
                console.log("value ", value, " item ", item );
                setContactPersonRoleId(value);
                setRoleName(item?.label)
            }}
            required
            defaultValue={"Select Role [Principal]"}
          />
        

            </IonCol>
      </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="First Name"
              onChange={(value) => {
                setContactPersonFirstName(value);
              }}
              required
              className="drag-cancel"
            />
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Last Name"
              onChange={(value) => {
                setContactPersonLastName(value);
              }}
              required
              className="drag-cancel"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <Input
              placeholder="Email (Optional)"
              onChange={(value) => {
                setContactPersonEmail(value);
              }}
              
              className="drag-cancel"
            />
          </IonCol>
        </IonRow>
        <IonRow>
        <IonCol>
            </IonCol>
       <IonCol size="18" size-md="7">
        <IonButton
          id="submitRegPinCodeBtn"
          className="btn-green-popup drag-cancel"
          type="button"
          onClick={ ()=>{
             onUpdateOrganisation()
          }}
          color="green"
        >
          {" "}
          {registerButton ? <IonSpinner name="dots" /> : "Submit"}
        </IonButton>
        </IonCol>
      </IonRow>
      </form>
      </IonGrid>
      
      </div>
     ) : (
      <div className="basic-userinfo-component">
        <br />
        {/* <Grid fluid>
                  
                      <Row className="show-grid"> */}
        {/* <Col xs={12}> */}

        <form>
          <div className="form-field">
            <label className="rs-control-label">School Name</label>
            <Input
              name="schoolName"
              onChange={(value) => {
                setSchoolName(value);
              }}
            />
          </div>
          <div className="form-field">
            <label className="rs-control-label">School Email</label>
            <Input
              name="schoolEmail"
              onChange={(value) => {
                setSchoolEmail(value);
              }}
              type="email"
            />
          </div>
        </form>
        {/* </Col>
                          <Col xs={12}> */}
        <h5 className="title">Personal Information</h5>
        <form>
          <div className="form-field">
            <label className="rs-control-label">
              Your Role at School
            </label>
            <br />
            <Dropdown
              name="contactPersonRole"
              size="lg"
              // title={contactPersonRole}
              // // activeKey={contactPersonRole}
              // onSelect={handleSelect}
            >
              {roles.map((role: any) => {
                return (
                  <Dropdown.Item
                    active={
                      roles.find(
                        (e: any) => e.roleName === "Principal"
                      ) != null
                    }
                    eventKey={role.roleId}
                  >
                    {role.roleName}
                  </Dropdown.Item>
                );
              })}
            </Dropdown>
          </div>
          <div className="form-field">
            <label className="rs-control-label">First Name</label>
            <Input
              name="contactPersonFirstName"
              onChange={(value) => {
                setContactPersonFirstName(value);
              }}
            />
          </div>
          <div className="form-field">
            <label className="rs-control-label">Last Name</label>
            <Input
              name="contactPersonLastName"
              onChange={(value) => {
                setContactPersonLastName(value);
              }}
            />
          </div>
          <div className="form-field">
            <label className="rs-control-label">Email</label>
            <Input
              name="contactPersonEmail"
              type="email"
              onChange={(value) => {
                setContactPersonEmail(value);
              }}
            />
          </div>
        </form>
        {/* </Col>
                      </Row>
                  </Grid> */}

        <IonButton
          id="submitRegPinCodeBtn"
          className="btn-green-popup drag-cancel"
          onClick={async () => {
            onUpdateOrganisation();
          }}
          color="green"
        >
          {" "}
          {registerButton ? <IonSpinner name="dots" /> : "Submit"}
        </IonButton>
      </div>
      )}
    </>
   
  }

  return (
    // <Modal className='register-modal' size='lg' backdrop={true} show={props.show} onHide={() => props.setShow(false)}>
    //     <Modal.Header>
    //         <Modal.Title>Register New School</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    <>
      {step === STEPS.NEW_LOGIN && loginComponent()}
      {step === STEPS.SUBMIT_PINCODE && submitComponent()}
      {/* {step === STEPS.PRE_LOAD_CONGIGURATION && preConfigOrganisationInfo(props.signedInUser) && schoolProfileComponent()} */}
      {step === STEPS.SCHOOL_PROFILE && schoolProfileComponent()}
    </>)
};
export default RegisterWeb;
