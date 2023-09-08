import { useEffect, useState , useRef} from "react";
import { useHistory } from "react-router";

import { Button, InputGroup,Uploader,Progress, Icon, Input, Grid, Row, Col, Message, Modal } from "rsuite";
import imageCompression from 'browser-image-compression';
import {
    IonItem,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonSpinner,
    useIonAlert
  } from "@ionic/react";
import { Storage } from "@ionic/storage";

import './profile-page.css'
// @ts-ignore
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import * as integration from "scholarpresent-integration";
import { CACHE_USER_LOGIN_ROLE_NAME,CACHE_COGNITO_CURRENT_USER } from "../../utils/StorageUtil";



const ProfilePage = (props: any) => {
    const telInputRef = useRef<any>(null);
    const history = useHistory();

    const [loading, setLoading] = useState<boolean>(true)

    const [step, setStep] = useState(0)
    const [stage, setStage] = useState(0)
    const [show, setShow] = useState(false)
    const [changeEmail, setChangeEmail] = useState(false)
    const [parentFirstName, setParentFirstName] = useState("")
    const [parentLastName, setParentLastName] = useState("")
    const [parentMobileNumber, setMobileNumber] = useState("")
    const [parentEmail, setParentEmail] = useState("")
    const [parentRole, setParentRole] = useState("")


    const [learnerUserId, setLearnerUserId] = useState("")
    const [learnerRole, setLearnerRole] = useState("")

    const [learnerFirstName, setLearnerFirstName] = useState("")
    const [learnerLastName, setLearnerLastName] = useState("")
    const [learnerMobileNumber, setLearnerMobileNumber] = useState("")
    const [learnerEmail, setLearnerEmail] = useState("")
    const [learnerGrade, setLearnerGrade] = useState("")
    const [learnerClass, setLearnerClass] = useState("")
    const [learnerContacts, setLearnerContacts] = useState([])
    const [showLinkedUser, setShowLinkedUser] = useState(false)
    


    const [parentUserId, setParentUserId] = useState("")

    const [parentContacts, setParentContacts] = useState([])
    const fileUploader = useRef<any>(null);
    const [profileImage, setProfileImage] = useState("/assets/user.png")
    const [profileNewImage, setProfileNewImage] = useState<File>();
    const [profileImageKey, setProfileImageKey] = useState("")
    const [profileImageExtension, setProfileImageExtension] = useState("")
    const [profileImageProgress, setProfileImageProgress] = useState<number>(0)


    const [tenantId, setTenantId] = useState("")
    const [schoolName, setSchoolName] = useState("")
    const [schoolTelNumber, setSchoolTelNumber] = useState("")
    const [schoolAddress, setSchoolAddress] = useState("")
    const [schoolEmail, setSchoolEmail] = useState("")
    const [updateSchoolButton, setUpdateSchoolButton] = useState(false)
    const [updatePersonalButton, setUpdatePersonalButton] = useState(false)
    const [deletePersonalButton, setDeletePersonalButton] = useState(false)

    const [updateLearnerButton, setUpdateLearnerButton] = useState(false)

    const [schoolInfoUpdate, setSchoolInfoUpdate] = useState(false)
    const [personalInfoUpdate, setPersonalInfoUpdate] = useState(false)
    const [personalInfoDelete, setPersonalInfoDelete] = useState(false)

    const [learnerInfoUpdate, setLearnerInfoUpdate] = useState(false)
    const [currentRoleName, setCurrentRoleName] = useState("")

    const [linkedUserTitle, setLinkedUserTitle] = useState("")


    

    const [present] = useIonAlert();

    const store = new Storage();

    useEffect(() => {
        if (!show) {
            setStage(0)

            integration.getCurrentUserProfile().then((user:any)=>{
                setLoading(false);
                console.log("getCurrentUserProfile integration: ", user);
                setParentUserId(user.id);
                setParentFirstName(user.firstName );
                setParentLastName(user.lastName);
                setParentRole(user?.roleName);
                setParentEmail( user.contactEmail);
                setMobileNumber(user.contactPhone);
                if(user.contacts){
                    setParentContacts(user.contacts);
                    for(let index = 0; index < user.contacts.length;index++){
                        console.log("integration: user.contacts[index] ", user.contacts[index]);
                        
                        if(user.contacts[index].contactType === "email" && user.contacts[index].detail 
                            && user.contacts[index].detail.length > 0 ){
                            setParentEmail( user.contacts[index].detail);
                        } else if(user.contacts[index].contactType === "sms" && user.contacts[index].detail 
                            && user.contacts[index].detail.length > 0 ){
                        
                                setMobileNumber( user.contacts[index].detail);
                        }
                    }
                }
                
                if(user.tenantId){
                    setTenantId(user.tenantId);
                    integration.getTenantInfo().then((value:any)=>{
                        console.log( "getTenantInfo  ", value)
                        setSchoolName(value.tenantName);
                        setSchoolTelNumber(value.tenantContactNumber);
                        setSchoolAddress(value?.tenantAddress)
                        setSchoolEmail(value.tenantEmail);
                
                    });
                }
                if(user?.linkedUser && user.linkedUser.items.length > 0){
                    console.log("getUserInfo: user ", user);
                    setShowLinkedUser(true);

                    let child  = user.linkedUser.items[0];
                    setLearnerUserId(child.id );
                    setLearnerRole( child?.roleName)
                    setLearnerFirstName(child.firstName);
                    setLearnerLastName(child.lastName);
                    if(child?.className?.className){
                        setLearnerClass(child?.className?.className);
                    }
                    if(child?.className?.grade?.gradeName){
                        setLearnerGrade(child?.className?.grade?.gradeName);
                    }
                    if(child.contacts){
                        setLearnerContacts(child.contacts);
                    }
                    for(let index = 0; index < child?.contacts?.length;index++){
                        console.log("integration: user.contacts[index] ", child.contacts[index]);

                        if(child.contacts[index].contactType === "email" && child.contacts[index].detail 
                            && child.contacts[index].detail.length > 0 ){
                                setLearnerEmail( child.contacts[index].detail);
                        } else if(child.contacts[index].contactType === "sms" && child.contacts[index].detail 
                            && child.contacts[index].detail.length > 0 ){
                                setLearnerMobileNumber( child.contacts[index].detail);
                        }
                    }
                }

                


                if(user?.profilePhotoKey  ){

                    setProfileImageKey(user?.profilePhotoKey);
                    const callback=(value:any)=>{
                        console.log( "callback ", value )
                    }
                    
                    integration.getProfilePhotoThumbnailInfo(user?.profilePhotoKey,user?.profilePhotoLocation, callback).then(

                        (imgData:any)=>{
                            console.log( "getProfilePhotoInfo imgData ", imgData )
                            setProfileImage(URL.createObjectURL(imgData));
                        }
                    ).catch((error:any)=>{
                        console.log("error with fetch user?.profilePhoto?.key ", user?.profilePhotoKey, " at location ", user?.profilePhotoLocation);

                        // present({
                        //     cssClass: "my-css",
                        //     header: "Something went wrong!",
                        //     message: "Error with loading the profile image",
                        //     buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
                        //     onDidDismiss: (e) => console.log("did dismiss"),
                        // });
                    })

                }
                

            } )

            
        }
    }, [show])

    useEffect(() => {
        store.create().then((value: any) => {
            store.get(CACHE_USER_LOGIN_ROLE_NAME).then((roleName: any) => {
                setCurrentRoleName(roleName);
            })
        });
    },[])    

    useEffect(() => {
    },[profileImageProgress,loading]);


    const isLogonPrincipalRole = () =>{
        return currentRoleName === "Principal"     
    }

    const uploadFileHandler = async(event: any) => {
    console.log("uploadFileHandler event ", event)
    
    const imageFile = event.target.files[0];
    console.log("imageFile.name ", imageFile.name);
    const lastDot = imageFile.name.lastIndexOf('.');

    const fileName = imageFile.name.substring(0, lastDot);
    setProfileImageExtension(imageFile.name.substring(lastDot + 1));
    console.log("profileImageExtension ", imageFile.name.substring(lastDot + 1));

    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);    
    
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 250,
        useWebWorker: true
    }
  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log("compressedFile  ", compressedFile);

    console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    setProfileNewImage(compressedFile);
    setProfileImage(URL.createObjectURL(compressedFile));
    setPersonalInfoUpdate(true);
} catch (error) {
    console.log(error);
  }

        //sendFileMessage(e.target.files[0])
    }
    const openUploader = () => {
        fileUploader?.current?.click()
    }

    
    
    const goTo = (url: string) => {
        history.push(url);
    };
    return (
        <div className="profile-page-container">
            <div className="banner">
                <h3 className='page-title'>{props.title}</h3>
                {
                    props.setShow &&
                    <Icon onClick={() => props.setShow(false)} icon='angle-up' size='2x' />
                }
            </div>
            {
                props.type === 'profile' &&
                <div className="ion-margin-bottom">
                    <Button className={step === 0 ? 'active-link tab-link' : 'tab-link'} color='green' onClick={() => {
                        let grades = "";
                        console.log("grades=====> ", grades);
                        setStep(0)
                        
                        }} appearance="link" ><Icon icon="edit" /> Edit Profile</Button>
                    {showLinkedUser?
                    <Button className={step === 2 ? 'active-link tab-link' : 'tab-link'} color='green' onClick={() => setStep(2)} appearance="link" ><Icon icon="user-info" />Linked Person Info</Button>
                    :<></>} 
                    <Button className={step === 1 ? 'active-link tab-link' : 'tab-link'} color='green' onClick={() => {  setStep(1)}} appearance="link" ><Icon icon="fort-awesome" /> School Info</Button>
                </div>
            }
            { !loading && (<div className={`${props.size} profile-page ion-padding-bottom ion-margin-top`}>
                {
                    (step === 0 && props.type !== 'howTo') &&
                    <div className='personal-info'>
                        <div className="ion-margin-bottom ion-text-center text-green scrollbar">
                            <div className='profile'>
                                {/* <img className='aside-image' src="/assets/user.jpg" alt="" />
                                <img className='add' src="/assets/camera.svg" alt="camera" />
                                <input
                                    type="file"
                                    onChange={(e) => console.log(e)}
                                    // style={{ 'display': 'none' }}
                                    name="Upload"
                                >
                                    
                                </input> */}
                                
                            </div>
                            {profileImageProgress>0 && profileImageProgress < 99? 
                            <Progress.Circle percent={profileImageProgress} className="image-profile" strokeColor="#ffc107" />
                           :     
                           <img src={profileImage} alt="Avatar"  
                        //    className="cursor-pointer" 
                            className="image-profile"
                           onClick={() => openUploader()} />
                            }
                            <h4 className='username'>{parentFirstName}{" "}{parentLastName} <br /></h4>
                                <h5><span>{parentRole}</span></h5>
                        </div>
                        <Grid fluid>
                            <Row className="show-grid">
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                        <h5 className='form-title'>Personal information</h5>
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                         <InputGroup>
                                            <InputGroup.Addon><Icon icon="user" />&nbsp; First Name  :</InputGroup.Addon>
                                            <Input value={parentFirstName} onChange={(value)=>{setPersonalInfoUpdate(true);setParentFirstName(value)}}/>
                                        </InputGroup>
                                        
                                        {/* <label className='rs-control-label'>First Name</label>
                                        <Input name="firstName" placeholder='First Name' value={parentFirstName} onChange={(value)=>setParentFirstName(value)}/> */}
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="user" />&nbsp; Last Name  :</InputGroup.Addon>
                                            <Input value={parentLastName} onChange={(value)=>{setPersonalInfoUpdate(true);setParentLastName(value)}}/>
                                        </InputGroup>
            
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="at" />&nbsp; Email  :</InputGroup.Addon>
                                            <Input value={parentEmail} onChange={(value)=>{setPersonalInfoUpdate(true);setParentEmail(value)}}/>
                                        </InputGroup>
                    
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>

                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="mobile" />&nbsp; Mobile Number  :</InputGroup.Addon>
                                            <Input value={parentMobileNumber} disabled={true}/>
                                            <InputGroup.Button>
                                                <Button onClick={() => setShow(true)} color="green" appearance="link">Change</Button>
                                            </InputGroup.Button>
                                        </InputGroup>
                                </div>
                                {/* <div className="contact">
                                    <div className='contact-item'>  
                                    <label className='rs-control-label'>Mobile Number</label>
                                    <div className='change-btn'>
                                        <p>Your mobile number is <strong>{parentMobileNumber}</strong></p>
                                        <Button onClick={() => setShow(true)} appearance="link">Change</Button>
                                    </div>

                                    
                                        
                                    </div>
                                    </div>*/}
                                </Col>
                                
                            </Row>
                        </Grid>
                       
                        <IonButton className="btn-green-popup drag-cancel" type="button" 
                            onClick={async(event)=>{
                                setUpdatePersonalButton(true);
                                const callback=(value:any)=>{
                                    console.log("callback ", value );
                                    let progress  = (value.loaded/value.total)*100;
                                    console.log("callback  progress ", progress );

                                    setProfileImageProgress(progress)
                                }
                                // profileImageKey - existing key
                                console.log("updateUserProfileImage profileNewImage ", profileNewImage)
                                setProfileImageProgress(10);
                                await store.create();
                                let currentUser = await store.get(CACHE_COGNITO_CURRENT_USER);
                                integration.updateUserProfileImage(parentUserId, parentFirstName,parentLastName,parentEmail, 
                                    parentContacts,learnerUserId,
                                    profileNewImage,profileImageKey,currentUser, profileImageExtension, callback).then(
                                        (value:any)=>{
                                            console.log("updateUserProfileImage done ", value );
                                            present({
                                                cssClass: "my-alert-css",
                                                header: "Updated Successfully",
                                                message: `Profile information updated successfully`,
                                                buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
                                                onDidDismiss: (e) => console.log("did dismiss"),
                                              });
                                            setUpdatePersonalButton(false);

                                        }
                                        
                                    )
                            }}
                            disabled={!personalInfoUpdate}
                        >
                                {updatePersonalButton ? <IonSpinner name="dots" /> : "Save"}
                        </IonButton> 

                        <IonButton size="small"
                            color="dark"            
                            type="button" 
                            onClick={async(event)=>{
                                setDeletePersonalButton(true);
                                console.log("Delete Account");
                                let result = await integration.deleteCognitoUserInfo();
                                console.log("Delete Account result ", result);
                                setDeletePersonalButton(false);
                                console.log("Logging out");
                                goTo("/login/loginStatus=false") 

                                // present({
                                //     cssClass: "my-alert-css",
                                //     header: "You are about to delete permanent your Profile",
                                //     message: `Do you want to proceed?`,
                                //     buttons: [{ text: "Yes", handler: async(d) => { 
                                //         let result = await integration.deleteCognitoUserInfo();
                                //         console.log("Delete Account result ", result);
                                //         setDeletePersonalButton(false);
                                //         goTo("/login/loginStatus=false") 
                                //     }},
                                //     { text: "No", handler: (d) => console.log("dismissed")  } 
                                //      ],
                                //     onDidDismiss: (e) => console.log("dismissed"),
                                //   });

                                  

                            }}
                            
                        >
                                {deletePersonalButton ? <IonSpinner name="dots" /> : "Delete Account"}
                        </IonButton> 


                        <input
                            type="file"
                            onChange={(e) => uploadFileHandler(e)}
                            style={{ 'display': 'none' }}
                            ref={fileUploader}  
                            name=""
                        />
                    </div>
                }
                {
                    (step === 1 && props.type !== 'howTo') &&
                    <div className='school-info'>
                        <div className="ion-margin-bottom ion-text-center text-green">
                            <div className='profile'>
                                <img className='aside-image' src="/assets/home.JPG" alt="" />
                                <img className='add' src="/assets/camera.svg" alt="camera" />
                            </div>
                            <h4 className='username'>{schoolName}</h4>
                        </div>
                        <Grid fluid>
                            <Row className="show-grid">
                                <Col xs={24}>
                                    <div className='form-field'>
                                        <h5 className='form-title'>School Information</h5>
                                    </div>
                                </Col>
                                <Col xs={24}>
                                    <div className='form-field'>
                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="fort-awesome" />&nbsp; School Name:</InputGroup.Addon>
                                            <Input readOnly={!isLogonPrincipalRole()} value={schoolName} onChange={(value)=>{setSchoolInfoUpdate(true);setSchoolName(value)}}/>
                                        </InputGroup>
                                    </div>
                                </Col>
                                <Col xs={24}>
                                    <div className='form-field'>
                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="phone" />&nbsp; School Tel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</InputGroup.Addon>
                                            <Input readOnly={!isLogonPrincipalRole()} value={schoolTelNumber} onChange={(value)=>{setSchoolInfoUpdate(true);setSchoolTelNumber(value)}}/>
                                        </InputGroup>
                                    </div>
                                </Col>
                                <Col xs={24}>
                                    <div className='form-field'>
                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="envelope" />&nbsp; School Email  :</InputGroup.Addon>
                                            <Input readOnly={!isLogonPrincipalRole()} value={schoolEmail} onChange={(value)=>{setSchoolInfoUpdate(true);setSchoolEmail(value)}}/>
                                        </InputGroup>
                                    </div>
                                </Col>
                                <Col xs={24}>
                                    <div className='form-field'>
                                        <InputGroup readOnly={!isLogonPrincipalRole()}>
                                            <InputGroup.Addon><Icon icon="map-marker" />&nbsp; Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</InputGroup.Addon>
                                            <Input readOnly={!isLogonPrincipalRole()} componentClass="textarea" rows={5} value={schoolAddress} onChange={(value)=>{setSchoolInfoUpdate(true);setSchoolAddress(value)}} />
                                        </InputGroup>
                                    </div>
                                </Col>
                                   
                            </Row>
                        </Grid>
                        {isLogonPrincipalRole()? 
                        <IonButton className="btn-green-popup drag-cancel" type="button" 
                            onClick={async()=>{
                                setSchoolInfoUpdate(false);
                                setUpdateSchoolButton(true);
                                let retVal = await integration.updateTenantAndContactInfo(tenantId,schoolName, schoolTelNumber
                                    ,schoolAddress, schoolEmail );

                                setUpdateSchoolButton(false);
                                present({
                                    cssClass: "my-alert-css",
                                    header: "Updated Successfully",
                                    message: `School information updated successfully`,
                                    buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
                                    onDidDismiss: (e) => console.log("did dismiss"),
                                  });

                                console.log("integration.updateTenantAndContactInfo ",retVal );
                            }}
                            disabled={!schoolInfoUpdate}
                        >
                                {updateSchoolButton ? <IonSpinner name="dots" /> : "Save"}
                        </IonButton> :""}
                    </div>
                }
                {
                    (props.type == 'howTo') &&
                    <div className='tutorials-info'>
                        <h5 className='page-title ion-color-primary'>Please take some time to do these tutorials to learn new and exciting ways to get your work done faster</h5>
                        <div className="tutorials-container text-success">
                            {
                                ['Messaging', 'Contacts'].map(moduleName => (
                                    <div className="module">
                                        <h6>{moduleName}</h6>
                                        <div className='btn-container'>
                                            <span className='count ion-color-success'>0 of 7 done</span>
                                            <Button size='xs' className='restart' color="green" >
                                                <Icon icon="reload" /> Re-start
                                            </Button>
                                            <Button id="btnProfile"
                                                size='xs' onClick={() => setStep(step + 1)} color="green" >
                                                <Icon icon="play" /> Continue
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
                {
                    (step === 2 && props.type !== 'howTo') &&
                    <div className='setting'>
                        <Grid fluid>

                        <Row className="show-grid">
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                        <h5 className='form-title'>{learnerRole} information</h5>
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="user" />&nbsp; First Name  :</InputGroup.Addon>
                                            <Input value={learnerFirstName} onChange={(value)=>{setLearnerInfoUpdate(true);setLearnerFirstName(value)}}/>
                                        </InputGroup>
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="user" />&nbsp; Last Name  :</InputGroup.Addon>
                                            <Input value={learnerLastName} onChange={(value)=>{setLearnerInfoUpdate(true);setLearnerLastName(value)}}/>
                                        </InputGroup>
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                    <InputGroup>
                                            <InputGroup.Addon><Icon icon="level-up" />&nbsp; Grade  :</InputGroup.Addon>
                                            <Input value={learnerGrade} onChange={(value)=>{setLearnerInfoUpdate(true);setLearnerGrade(value)}} />
                                        </InputGroup>
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                        <InputGroup>
                                            <InputGroup.Addon><Icon icon="home" />&nbsp; Class  :</InputGroup.Addon>
                                            <Input value={learnerClass} onChange={(value)=>{setLearnerInfoUpdate(true);setLearnerClass(value)}} />
                                        </InputGroup>
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                    <InputGroup>
                                            <InputGroup.Addon><Icon icon="at" />&nbsp; Email  :</InputGroup.Addon>
                                            <Input value={learnerEmail} onChange={(value)=>{setLearnerInfoUpdate(true);setLearnerEmail(value)}}/>
                                        </InputGroup>
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <div className='form-field'>
                                    <InputGroup>
                                            <InputGroup.Addon><Icon icon="mobile" />&nbsp; Mobile Number  :</InputGroup.Addon>
                                            <Input value={learnerMobileNumber} disabled={true}/>
                                            {/* <InputGroup.Button>
                                                <Button onClick={() => setShow(true)} color="green" appearance="link">Invite</Button>
                                            </InputGroup.Button> */}
                                    </InputGroup>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                        <IonButton className="btn-green-popup drag-cancel" type="button" 
                            onClick={(event)=>{
                                setUpdatePersonalButton(true);
                                const callback=(value:any)=>{
                                    console.log("callback ", value );
                                }
                                // profileImageKey - existing key
                                integration.updateUserProfileImage(learnerUserId, learnerFirstName,learnerLastName,learnerEmail, 
                                    learnerContacts, parentUserId, null, null,null, null, null).then(
                                        (value:any)=>{
                                            console.log("updateUserProfileImage ", value );
                                            setUpdateLearnerButton(false)
                                        }
                                        
                                    )
                            }}
                            disabled={!learnerInfoUpdate}
                        >
                                {updateLearnerButton ? <IonSpinner name="dots" /> : "Save"}
                        </IonButton>

                        {/* <div>
                            <Message
                                showIcon
                                type="warning"
                                title="Please None"
                                description="If you change your mobile number, you will no longer be able to log into this profile using
                                your old mobile number. Please only proceed if you wish to transfer your account to the
                                new number. Changing your prefeed email address would mean you will no longer be able
                                to receive communication to your previous email address. "
                            />
                        </div> */}
                        {/* <div className="contact">
                            <div className='contact-item'>
                                <h3 className="sub-title">Mobile Number</h3>
                                <div className='change-btn'>
                                    <p>Your mobile number is <strong>+27(0) 72 123 4568</strong></p>
                                    <Button onClick={() => setShow(true)} appearance="link">Change</Button>
                                </div>
                            </div>
                            <div className='contact-item'>
                                <h3 className="sub-title">Email Address</h3>
                                <div className='change-btn'>
                                    <p>Your Email Address is <strong>myemailadress@email.co.za</strong></p>
                                    <Button onClick={() => setChangeEmail(true)} appearance="link">Change</Button>
                                </div>
                                {
                                    changeEmail &&
                                    <div className='change-btn ion-margin-top ion-margin-bottom'>
                                        <Input name="email" placeholder='Email' />&nbsp;&nbsp;
                                        <Icon className='cursor-pointer' onClick={() => setChangeEmail(false)} icon='check' />&nbsp;&nbsp;
                                        <Icon className='cursor-pointer' onClick={() => setChangeEmail(false)} icon='close' />
                                    </div>
                                }
                            </div>
                        </div> */}
                    </div>
                }
                {
                    step === 4 &&
                    <div className="login-component">
                        <h3 className="title">Provide your mobile number below</h3>
                        <IntlTelInput
                            fieldId="profileNumber"
                            containerClassName="intl-tel-input"
                            inputClassName="rs-input"
                            placeholder='e.g. 073 123 4567'
                        />
                        {/* <InputGroup>
                            <InputGroup.Addon>
                                <Icon icon="avatar" />
                            </InputGroup.Addon>
                            <Input placeholder='e.g. 073 123 4567' />
                        </InputGroup> */}
                        <label>We'll text you to confirm you number</label>
                        <p className="terms">By continuing you are agreeing to Scholar Present <a className='terms-link' href="javascript:void(0)">Terms of Service</a>.</p>
                        <Button onClick={() => setStep(step + 1)} color="green" block>Continue</Button>
                    </div>
                }
                {
                    step === 5 &&
                    <div className="otp-component">
                        <h3 className="title">One Time Password (OTP) has been sent to your mobile number displayed below</h3>
                        <h5 className="sub-title">Enter the code just sent to +27 73 123 4567</h5>
                        <Input className='password-box' placeholder='⸻ ⸻ ⸻ ⸻ ⸻' />
                        <Button onClick={() => setStep(step + 1)} color="green">Validate</Button>
                        <div className='btn-container'>
                            <Button appearance="link">Resend One-Time Password</Button>
                            <Button appearance="link">Entered a wrong number?</Button>
                        </div>
                    </div>
                }
                {
                    step === 6 &&
                    <div className="done-component text-success">
                        <img height='50px' src="/assets/done.jpg" alt="" />
                        <h5 className="sub-title">Congratulations</h5>
                        <h5 className="sub-title ion-margin">Your mobile number was successfully updated</h5>
                        <Button color='green' block>Save</Button>

                    </div>
                }
            </div>)
            }
            { loading && (<div style={{ textAlign: "center", padding: 10 }}>
                                        <IonSpinner name="bubbles" style={{ transform: "scale(1.5)" }} color="success" />
                                    </div>)}
            <Modal backdrop={true} show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>Change Number</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        stage === 0 &&
                        <div className="login-component">
                            <h3 className="title text-green">Provide Your Mobile Number Below</h3>
                            <br />
                            <IntlTelInput
                                fieldId="changeProfileNumber"
                                containerClassName="intl-tel-input"
                                inputClassName="rs-input"
                                placeholder='e.g. 073 123 4567'
                            />
                            <br />
                            <br />
                            <Button onClick={() => setStage(1)} color="green" block>Continue</Button>
                        </div>
                    }
                    {
                        stage === 1 &&
                        <div className="login-component">
                            <h3 className="title text-green">Are you Realy Sure?</h3>
                            <h5 className="title text-green ion-margin-top">This will dlink the mobile number +1212122343 to the current profile and will no longer be able to use it to login</h5>
                            <h5 className="title text-green ion-margin-top">Please tye the word CHANGE to confirm.</h5>
                            <br />
                            <Input />
                            <br />
                            <br />
                            <Button onClick={() => setShow(false)} color="green">Cancel</Button>&nbsp;
                            <Button onClick={() => setStage(2)} color="red">Change My Number</Button>
                        </div>
                    }
                    {
                        stage === 2 &&
                        <div className="otp-component">
                            <h3 className="title text-green">One Time Password (OTP) has been sent to your mobile number displayed below</h3>
                            <h5 className="sub-title">Enter the code just sent to +27 73 123 4567</h5>
                            <br />
                            <Input className='password-box' placeholder='⸻ ⸻ ⸻ ⸻ ⸻' />
                            <br />
                            <Button onClick={() => setStage(3)} color="green">Validate</Button>
                            <div className='btn-container'>
                                <Button appearance="link">Resend One-Time Password</Button>
                                <Button appearance="link">Entered a wrong number?</Button>
                            </div>
                        </div>
                    }
                    {
                        stage === 3 &&
                        <div className="done-component text-success">
                            <img height='50px' src="/assets/done.jpg" alt="" />
                            <h5 className="sub-title">Congratulations</h5>
                            <h5 className="sub-title ion-margin">Your mobile number was successfully updated</h5>
                            <Button onClick={() => setShow(false)} color='green' block>Save</Button>

                        </div>
                    }
                </Modal.Body>
            </Modal>
        
        </div>
    );
}
export default ProfilePage;