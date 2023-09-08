import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { Button, InputGroup,Carousel ,Modal, Icon, Input, Grid, Row, Col, FormGroup, RadioGroup, Radio, Panel } from "rsuite";
import {
    useIonAlert,
} from "@ionic/react";
import { Storage } from "@ionic/storage";

import useGetCacheTenantId from "../../hooks/useGetCacheTenantId";

import './login-mobile.css'
// @ts-ignore
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import {fetchGrades} from "../../stores/grades/actions";
import {fetchClasses} from "../../stores/classes/actions";
import {fetchRoles} from "../../stores/roles/actions";
import {cleanSpaces} from "../../utils/Utils"

//redux
import { connect } from "react-redux";
import { classesSetData } from "../../stores/classes/actions";
import { gradeSetData } from "../../stores/grades/actions";
import { conversationsSetData } from "../../stores/messages/actions";
import { contactsResetContacts } from "../../stores/contacts/actions";
import { invitationsResetContacts } from "../../stores/contacts/actions";
import {cacheSession} from "../../utils/StorageUtil"

import * as integration from "scholarpresent-integration";

const LoginMobile = (props: any) => {
    const STEPS = { LOGIN: 0, SUBMIT_PINCODE: 1, HOME: 2};

    const [step, setStep] = useState<number>(STEPS.LOGIN);
    const dispatch = useDispatch()
    const telInputRef = useRef<any>(null);
    const store = new Storage();


    const [present] = useIonAlert();

    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [logonUser, setLogonUser ]= useState<any>(null);
    const [cognitoUser, setCognitoUser ]= useState<any>(null);
    const [pinCode, setPinCode] = useState<number>();
    let tenantId:string = useGetCacheTenantId();


    let history = useHistory();

    const onLoginRequest=async()=>{
        // present({
        //     message: `login-mobile Mobile Number `+ mobileNumber ,
        //     buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
        // });
        let altMobileNumber = cleanSpaces(mobileNumber);
       
        console.log("altMobileNumber ", altMobileNumber);
        let cUser = await integration.authSignIn(cleanSpaces(mobileNumber))
        await setCognitoUser(cUser);
        console.log("onLoginRequest cognitoUser :", cognitoUser);

        setStep(STEPS.SUBMIT_PINCODE)
    }
    const handleLogout = async () => {
        console.log("login-mobile handleLogout enter");

        await store.create(); 
        let pushNotificationKey = await store.get("pushNotificationKey");
        let appNotificationKey = await store.get("appNotificationKey");
        console.log( "handleLogout pushNotificationKey ", pushNotificationKey, " appNotificationKey ", appNotificationKey);
        integration.authSignOut(pushNotificationKey, appNotificationKey).then((value: any) => {});
        store.create().then((value:any)=>{
            store.clear();
        })
        classesSetData([]);
        gradeSetData([]);
        conversationsSetData([]);
        contactsResetContacts();
        invitationsResetContacts();
        console.log("login-mobile handleLogout exit");

    };

    const onLoginSubmitPinCode=async()=>{
        console.log("onLoginSubmitPinCode cognitoUser :", cognitoUser);
        let signedInUser = await integration.authSubmitCode(cognitoUser, pinCode);
        console.log("onLoginSubmitPinCode signedInUser :", signedInUser);
        await cacheSession(signedInUser.signInUserSession)
        setLogonUser(signedInUser);
        console.log("onLoginSubmitPinCode logonUser :", logonUser);
        dispatch(fetchGrades(undefined));
        dispatch(fetchClasses(tenantId));
        dispatch(fetchRoles());

        history.push("/contacts")
        
        console.log("onSubmitPinCode logonUser :", logonUser);
    }

    return (
        <div className='register-mobile'>
            {
                step === STEPS.LOGIN &&<>{handleLogout()}
                <div className="login-component">
            <Carousel className="custom-slider">
                <img src="/assets/login.jpg" height="250"/>
                <img src="/assets/user.jpg" height="250"/>
            </Carousel>                    
            <div className='ion-margin-bottom ion-text-center'>

                    <Button color='green' size='sm' appearance='link'><u>Log in</u></Button>&nbsp;&nbsp;
                    <Button color='green' onClick={() => setStep(10)} size='sm' appearance='link'>Join my School</Button>
                    </div>
                    <IntlTelInput
                        fieldId="mLoginNumber"
                        containerClassName="intl-tel-input"
                        inputClassName="rs-input"
                        preferredCountries={['za']}
                        placeholder='e.g. 073 123 4567'
                        ref={telInputRef}
                        telInputProps={{
                            onPaste: (e:any) => {
                                telInputRef.current.updateValFromNumber(e.clipboardData.getData('text'), false, true)
                                telInputRef.current.setNumber(e.clipboardData.getData("text"));
                                setMobileNumber(e.clipboardData.getData('text')); 
                                e.preventDefault()
                                e.stopPropagation()
                            }
                        }}
                        onPhoneNumberChange={(status:any, value:any, countryData:any, number:any, id:any) => {
                            number = number.replace(/ /g, '');
                            setMobileNumber(number);
                          }}
                    />
                    {/* <InputGroup>
                        <InputGroup.Addon>
                            <Icon icon="avatar" />
                            </InputGroup.Addon>
                            <Input placeholder='e.g. 073 123 4567' />
                        </InputGroup> */}
                    <label>We'll text you to confirm your number</label>
                    <p className="terms">By continuing you are agreeing to Scholar Present <a className='terms-link' target="_blank" href="https://iconnect99-public.s3.eu-central-1.amazonaws.com/Scholar+Present+Terms+of+Service.pdf">Terms of Service</a>.</p>
                    <Button 
                            id="btnContinue"
                            onClick={async () =>{ 
                            console.log("Mobile Number ", mobileNumber);
                            present({
                                message: ` Mobile Number `+ mobileNumber ,
                                buttons: [{ text: "OK", handler: (d) => console.log("ok pressed") }],
                            });

                            try{
                                await onLoginRequest();
                                setStep(STEPS.SUBMIT_PINCODE);
                            }catch(error){
                                console.log("error ", error);
                                throw error 
                            }
                        }} color="green" block>Continue</Button>
                    <Button className='pull-right' onClick={() => setStep(10)} size='sm' appearance='link'>Enrol new School</Button>
                </div>
            </>
            }
            {/* {
                step === STEPS.SUBMIT_PINCODE &&
                <div className="otp-component">
                    <img className='ion-margin-bottom' src='/assets/login.jpg' />
                    <h3 className="title text-green">One Time Password (OTP) has been sent to your mobile number displayed below</h3>
                    <h5 className="sub-title">Enter the code just sent to +27 73 123 4567</h5>
                    <Input className='password-box' onChange={(value:any)=>{
                             setPinCode(value);
                        }} placeholder='⸻ ⸻ ⸻ ⸻ ⸻' />
                    <Button onClick={async() =>{ 
                             console.log("PinCode ", pinCode);
                             await onLoginSubmitPinCode();
                            }} color="green">Validate</Button>
                    <div className='btn-container'>
                        <Button appearance="link">Resend One-Time Password</Button>
                        <Button appearance="link">Entered a wrong number?</Button>
                    </div>
                </div>
            } */}
    
        </div>
    );
}
const mapStateToProps = (state: any) => ({});
const mapDispatchToProps = {
    classesSetData,
    gradeSetData,
    conversationsSetData,
    contactsResetContacts,
    invitationsResetContacts
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginMobile);
