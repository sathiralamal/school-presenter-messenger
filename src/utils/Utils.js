import { Storage } from '@ionic/storage';

import { CACHE_USER_LOGIN_ROLE_NAME } from './StorageUtil';
import * as integration from "scholarpresent-integration";

export const getAllMethods=(object)=> {
    return "" + Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
}

export const cleanSpaces = (value)=>{
    let retVal = "";
    if(value && value!=null){
        for(let i=0; i < value.length;i++){
            if(value[i] !==" "){
                retVal+=value[i];  
            }
        }
    }
    return retVal;
}

export const getSessionAction = (logonUser) => {
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

        return action;
    }
};


export const getCognitoId = (logonUser) => {
    if (
        logonUser.signInUserSession &&
        logonUser.signInUserSession.idToken &&
        logonUser.signInUserSession.idToken.payload
    ) {
    
        return logonUser.signInUserSession.idToken.payload["cognito:username"];
    }
};

export const getUsername = (cognitoUser) => {
        return cognitoUser.username;
};

export const getAnalyticsUserContext = async(userProfile) => {
    const store = new Storage();
    await store.create();
    let userContext = await store.get("AnalyticsUserContext");
    console.log("AnalyticsUserContext frm store ", userContext )
    if(userContext == null){
        try{
            userContext = await integration.getCurrentUserProfile();
        }catch(e){
            userContext = {"id": "123"}    
        }
    }
    console.log("AnalyticsUserContext return ", userContext )

    return userContext;
};

export const getContactDetails = (user, type) => {
    let retValue = "N/A" 
    if(type ==="sms"){
        if(user?.contactPhone){
            retValue = user?.contactPhone;
        }
    }

    if(type ==="email"){
        if(user?.contactEmail){
            retValue = user?.contactEmail;
        }
    }

    return retValue;
};

