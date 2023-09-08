import { useEffect, useState , useRef} from "react";
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

import awsconfig from "../../aws-exports";

import './appinfo-page.css'
// @ts-ignore
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import * as integration from "scholarpresent-integration";
import { CACHE_USER_LOGIN_ROLE_NAME } from "../../utils/StorageUtil";



const AppInfoPage = (props: any) => {
    const telInputRef = useRef<any>(null);
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
    const [updateLearnerButton, setUpdateLearnerButton] = useState(false)

    const [schoolInfoUpdate, setSchoolInfoUpdate] = useState(false)
    const [personalInfoUpdate, setPersonalInfoUpdate] = useState(false)
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
                setParentRole(user.userRole?.roleName);
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
                if(user.tenantIDs && user.tenantIDs.length> 0){
                    setTenantId(user.tenantIDs[0]);
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
                    setLearnerRole( child.userRole?.roleName)
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

                


                if(user?.profilePhoto?.key  ){

                    setProfileImageKey(user?.profilePhoto?.key);
                    const callback=(value:any)=>{
                        console.log( "callback ", value )
                    }
                    
                    console.log( "user?.profilePhoto user?.profilePhoto ", user?.profilePhoto); 
                    integration.getProfilePhotoThumbnailInfo(user?.profilePhoto?.key,user?.profilePhoto?.location, callback).then(

                        (imgData:any)=>{
                            console.log( "getProfilePhotoInfo imgData ", imgData )
                            setProfileImage(URL.createObjectURL(imgData));
                        }
                    ).catch((error:any)=>{
                        console.log("error with fetch user?.profilePhoto?.key ", user?.profilePhoto?.key, " at location ", user?.profilePhoto?.location);

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

    return (
        <div className="profile-page-container">
            <div className="banner">
                <h3 className='page-title'>{props.title}</h3>
                {
                    props.setShow &&
                    <Icon onClick={() => props.setShow(false)} icon='angle-up' size='2x' />
                }
            </div>
            <div className="login-component">
                <p>Scholar Present {awsconfig?.env}{"-"}{awsconfig?.version}</p>
                <br/>
                <br/>
                <Button onClick={() => props.setShow(false)} color="green">Back</Button>&nbsp;
            </div>
        </div>
    );
}
export default AppInfoPage;