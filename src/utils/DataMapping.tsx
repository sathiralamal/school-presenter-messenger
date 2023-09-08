import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json'

import moment from 'moment';
import { Storage } from '@ionic/storage';
import {CACHE_USER_LOGIN_ID, TENANT_ID, getRoleName} from './StorageUtil';
import * as integration from "scholarpresent-integration";
import { StringIterator } from 'cypress/types/lodash';


type Conversation = { id: string, name:string, date:string,rawDate:any , status:string, role:string, messages:Message[], messageNextToken: any, cognitoId:string, imageKey:string, location:string, 
    isBroadcast:boolean, isGroupAdminUser:boolean , unread :number };
type Message = { id: string, deliveryStatus: string, type: string, time: string, text:string, media:any, cognitoId:string, createdByUserId:string ,
    createdAt:Date,isBroadcast:boolean, parentMessage:any, like:number, likedActivities: any[]};

type Media = { id: string, type: string, url: string};


const store = new Storage();
let tenantId:string;
    let userLoginId:string;

// @ts-ignored
TimeAgo.addDefaultLocale(en)

store.create().then(storeResults=>{
        store.get(CACHE_USER_LOGIN_ID).then((cachedUserLoginId:any)=>userLoginId=cachedUserLoginId);
        store.get(TENANT_ID).then((cachedTenantId:any)=>tenantId=cachedTenantId);
});

export const toMessageUI  = async (messageDataModel:any, isBroadcast:boolean) => {
    console.log("toMessageUI messageDataModel :" ,messageDataModel);
    let retVal:Message[] = [];

    let messageId:string;
    let deliveryStatus:string;
    let type:string;
    let time:string;
    let text:string;

    for(let i=0;i < messageDataModel?.items?.length;i++ ){
        
        let linkedMessage = messageDataModel?.items[i]?.linkedMessage;
        let linkedMessageUI=[];
        if(linkedMessage){
           for(let j=0; j < linkedMessage.length; j++){
               if(linkedMessage[j]!=null){
                    linkedMessageUI.push(await toMessageObjectUI(linkedMessage[j], null, isBroadcast && linkedMessage[j].messageLevel ==="topic",null) );
                }
            }
        }
        // Push initial message
        let initialPushMessage = await toMessageObjectUI(messageDataModel?.items[i], null, isBroadcast && messageDataModel?.items[i].messageLevel ==="topic", null);
        if(initialPushMessage?.id !==undefined ){
            retVal.push(initialPushMessage);    
        }

        // Push linked messages
        if(linkedMessageUI.length>0){
            for(let linkedMessageUIIndex=0; linkedMessageUIIndex < linkedMessageUI.length; linkedMessageUIIndex++ ){
                if(messageDataModel?.items[i]!=null){
                    let newMessage = await toMessageObjectUI(messageDataModel?.items[i], linkedMessageUI[linkedMessageUIIndex], isBroadcast && messageDataModel?.items[i].messageLevel ==="topic",null);                    
                    retVal.push(newMessage);
                }
            }


        }
        
    }
    if( retVal.length > 0 || Object.keys(retVal).length >0 ){
        const sortedMessage = retVal.sort((a:any, b:any) => {
            ////console.log("toMessageUI sortedMessage b.createdAt " ,b.createdAt , " a.createdAt ", a.createdAt);
            if(a?.createdAt){
                return a.createdAt.localeCompare(b.createdAt)
            }else{
                return false;
            }
        })
        console.log("toMessageUI retVal :" ,retVal);
        return retVal;
    }else{
        console.log("toMessageUI retVal NULL");
        return null;
    }
}

export const toMessageObjectUI = async (messageObject:any, parentMessageUI:any, isBroadcast:boolean, attachmentContent:any)=>{

    console.log("toMessageObjectUI messageObject", messageObject, " isBroadcast ", isBroadcast);
    let messageId:string;
    let deliveryStatus:string;
    let type:string;
    let time:string;
    let text:string;
    let cognitoId:string;
    let createdByUserId:string;

    let countLike:number;
    let likedActivities:any;
    let countComments:number;
    let userName:string ="";
    let imageKey:string;
    let location:string;
    let roleName:string = "No Role";
    let linkedMessages = [];

    if(messageObject?.id ){
        messageId = messageObject?.id;
    } else {
        messageId = messageObject?.messageId;
    }

    let userLogonId = await store.get(CACHE_USER_LOGIN_ID);
    console.log("toMessageObjectUI userLogonId ", userLogonId);

    userName = messageObject?.firstName+" "+messageObject?.lastName+" ";
    roleName = messageObject?.roleName;
    if( userLogonId === messageObject?.createdByUserId){
        type = "sent";
        let sentUser = await integration.getCurrentUserProfile();
        console.log("sentUser ", sentUser);

        if(sentUser?.profilePhoto?.key && sentUser?.profilePhoto?.location){
            imageKey = sentUser.profilePhoto.key;
            location = sentUser.profilePhoto.location;
            console.log("sentUser imageKey ", imageKey , " location ", location);

        }else{
            imageKey = ""
            location = ""
        }
    }else{
        type = "received";
        let receiverUser = messageObject?.createdByUser;
        console.log("receiverUser ", receiverUser);

        if(receiverUser?.profilePhoto?.key && receiverUser?.profilePhoto?.location){
            imageKey = receiverUser.profilePhoto.key;
            location = receiverUser.profilePhoto.location;
            console.log("receiverUser imageKey ", imageKey , " location ", location);

        }else{
            imageKey = ""
            location = ""
        }


    }
    cognitoId = "";
    deliveryStatus = messageObject?.stage
    let createdAt = null;

    //userName = messageObject?.createdByUser?.firstName+" "+messageObject?.createdByUser?.lastName;

    if(messageObject?.createdByUser&& messageObject.createdByUser!=null && messageObject.createdByUser.userRoleId){
        roleName = await getRoleName(messageObject.createdByUser.userRoleId);
    }   
    if(messageObject?.createdByUser?.cognitoId){
        cognitoId = messageObject?.createdByUser?.cognitoId;
    }
    createdByUserId = messageObject?.createdByUserId;

    console.log("createdByUserId ", createdByUserId)

    // if(messageObject?.likeMessageEventId && messageObject.likeMessageEventId!=null){
    //     countLike = messageObject.likeMessageEventId.length;
    // }else{
    //     countLike = 0;
    // }
    if(Array.isArray(messageObject?.likedMessage?.items)){
        countLike = messageObject.likedMessage.items?.length;
        likedActivities = messageObject.likedMessage.items;
    }else{
        countLike = 0;
    }
    if(messageObject?.linkedMessageId && messageObject.linkedMessageId!=null){
        countComments = messageObject.linkedMessageId.length;
        //console.log(" messageObject " , messageObject, "linkedMessage :", messageObject.linkedMessage);
        
        for(let linkedMsgIndex=0;linkedMsgIndex < messageObject.linkedMessage?.length;linkedMsgIndex++  ){
            let newLinkedMessage = await toMessageObjectUI(messageObject.linkedMessage[linkedMsgIndex], undefined, false,attachmentContent);
            linkedMessages.push(newLinkedMessage);
        }
    }else{
        countComments = 0;
    }

    if( parentMessageUI && parentMessageUI!=null  && parentMessageUI.createdAt){
        //console.log("parentMessageUI :", parentMessageUI, " messageObject " , messageObject);
        createdAt = Date.parse(parentMessageUI.createdAt)
    }else{
        //console.log("**** createdAt :", createdAt);
        if(messageObject?.createdAt){
            createdAt = Date.parse(messageObject?.createdAt)
        }
    }

    const timeAgo:any = new TimeAgo('en-US');
    console.log("**** createdAt :", createdAt);
    if(createdAt){
        var TODAY = moment().clone().startOf('day');
        
        if(moment(createdAt).isSame(TODAY, 'd')){
            time = moment(createdAt).format("h:mm a");
        }else{
            time = timeAgo.format(createdAt);
        }
    }else{
        time='';
    }
    text = messageObject?.content
    let attachment = {}; 
    console.log("***attachmentContent ", attachmentContent, " messageObject ", messageObject);
    
    if(!messageObject?.attachment && messageObject?.documentId){
        let attach:any = [{id:messageObject.documentId, 
            bucket:messageObject.bucket, region:messageObject.region,key:messageObject.key, 
            location:messageObject.location,extension:messageObject.extension  }]
        messageObject['attachment'] = attach;
        console.log("====> attach ",attach);
    }
    if(attachmentContent && attachmentContent!=null && messageObject?.attachment  ){
        
        let fileName = messageObject.attachment[0]?.key || '';
        let lastIndex = fileName.lastIndexOf(".");
        let extension = fileName.substr(lastIndex,fileName.length );
        extension = extension.replace(".","").toLowerCase();

        attachment = {
            url: attachmentContent, 
            id: messageObject.attachment[0].id,
            location:messageObject.attachment[0]?.location,
            key:messageObject.attachment[0]?.key,
            type:extension
        }
    } else
    if(messageObject?.attachment){
        attachment = await toAttachmentUI( messageObject.attachment);
        console.log("*** attachment :", attachment );
    } 
    

    let retVal:any;
    if(parentMessageUI && parentMessageUI!=null){
        parentMessageUI.parentMessage = {id:messageId, type, deliveryStatus, time , text, 
            media:attachment, 
            createdAt: parentMessageUI && parentMessageUI!=null?parentMessageUI.createdAt:messageObject.createdAt,
            isBroadcast, userName, imageKey, location,cognitoId, roleName, linkedMessages,createdByUserId,
            status: messageObject.stage

        
        };
        console.log("toMessageObjectUI parentMessageUI :" ,parentMessageUI);

        return parentMessageUI;
    }else{
        retVal={id:messageId, type, deliveryStatus, time , text, 
            media:attachment, 
            createdAt: parentMessageUI && parentMessageUI!=null?parentMessageUI?.createdAt:messageObject?.createdAt ,
            isBroadcast, countLike, countComments, userName, imageKey, location, cognitoId,createdByUserId, roleName, linkedMessages,
            status: messageObject.stage,
            likedActivities
            //parentMessage: undefined
        };
        
        console.log("toMessageObjectUI retVal :" ,retVal);

        return retVal;
    }
}
export const toAttachmentUI  = async (attachmentObject:any) => {
    console.log("toAttachmentUI attachmentObject :" ,attachmentObject);
    let retVal:any={};
    let attachments = null;
    if(Array.isArray(attachmentObject)){
        attachments = attachmentObject
    } else if( typeof(attachmentObject) === 'string' ){ 
        attachments = JSON.parse(attachmentObject);        
    }
    else
    if( attachmentObject?.items){
        attachments = attachmentObject?.items;
    } else {
        attachments = JSON.parse(attachmentObject).items
       
    }

    //console.log("toAttachmentUI attachments :" ,attachments);
    if(attachments){
        try{

        for(let i:number=0; i < attachments.length;i++ ){
            let fileName = attachments[i]?.key || '';
            let lastIndex = fileName.lastIndexOf(".");
            let extension = fileName.substr(lastIndex,fileName.length );
            extension = extension.replace(".","");
            console.log("attachments[i] ", attachments[i]);
            console.log("extension : ", extension);
            //console.log("S3_BASE_HOST ", S3_BASE_HOST+fileName );
            if(attachments[i]&&attachments[i]?.key){

                let url = "";
                const callback=( value:any)=>{
                    console.log("Download Progress ", value)
                }
                if(extension.toLowerCase() === "jpg" || extension.toLowerCase() == "png"){  
                    let imgData:any = await integration.getAttachmentThumbnailURLInfo(attachments[i]?.key , attachments[i]?.location, callback);
                    url = imgData?.Body;
                }else{
                    url = ""
                }
                retVal = {
                    id:attachments[i].id, 
                    type:extension.toLowerCase(), 
                    url,
                    key:attachments[i]?.key,
                    location:attachments[i]?.location
                };
                break; 
            }
                  
        }
    }catch(err){
        console.log(err, "ERR");
    }
    }
    console.log("toAttachmentUI attachment retVal ", retVal );
    //console.log("toAttachmentUI exit" );
    return retVal;
}

export const toConversationUI  = async (conversationDataModel:any) => {
    console.log("toFrontEndConversation conversationDataModel :" ,conversationDataModel);

    console.log("toFrontEndConversation :" ,conversationDataModel.items);
    
    let conversations = conversationDataModel.items? conversationDataModel.items: [];
    let status:string = "online";
    let date:string;
    let imageKey:string = "";
    let location:string = "";
    let roleName:string = "No Role";
    let retVal:Conversation[] = [];
    let messageDirection = "";
    let cognitoId:string;
    let createdByUserId:string;
    let isBroadcast = false;
    let userLogonId = await store.get(CACHE_USER_LOGIN_ID);
    console.log("toConversationUI " , conversations, "===>>>");
    for(let index=0; index < conversations.length;index++){
        let isGroupAdminUser = false;

        let id = conversations[index].id;
        let name = null;  
        cognitoId = "";              
        if(conversations[index].conversationType ==='member_to_member'){
            isBroadcast = false;
            console.log("CACHE_USER_LOGIN_ID ", userLogonId);
            console.log("conversations[index] ", conversations[index]);
            let recieverUser = null;
            if(userLogonId === conversations[index].createdByUserId ){

                name = conversations[index].receiptFirstName+" "+conversations[index].receiptLastName;
                roleName = await getRoleName(conversations[index].receiptUserRoleId);
                imageKey = '';
                location = '';
            }else{
                name = conversations[index].createdFirstName+" "+conversations[index].createdLastName;
                roleName = await getRoleName(conversations[index].createdUserRoleId);
                imageKey = '';
                location = '';          
            }

            //console.log("Receiving User ", recieverUser);

            // if(recieverUser ){
            //     name = recieverUser.firstName+" "+recieverUser.lastName;
            //     roleName = await getRoleName(recieverUser.userRoleId);
            //         console.log("conversations[index].receiptUser.profilePhoto ", recieverUser.profilePhoto);
            //         if(recieverUser.profilePhoto&&recieverUser.profilePhoto?.key){
            //         imageKey = recieverUser.profilePhoto?.key;
            //         location = recieverUser.profilePhoto?.location;
            //         cognitoId = recieverUser.cognitoId
            //         console.log("imageKey ",imageKey );

            //     }else{
            //         imageKey = "";
            //         location = "";
            //     }
            //     console.log(" conversations[index].receiptUser[0] ",  conversations[index].receiptUser[0]);
            // }else{
            //     name = "No Name";
            // }

        }else{
            isBroadcast = true;
            console.log("Broadcast:",  conversations[index]);
            let groupAdminUsers = conversations[index].receiptGroup?.groupAdminUsers;
            isGroupAdminUser = conversations[index].isGroupAdminUser

            if(conversations[index] && conversations[index].groupName  ){
                name =  conversations[index].groupName;
                console.log(" conversations[index].receiptGroup ",  conversations[index]);
                roleName = "GROUP"

            }else{
                name = "No Group Name";
            }

            if(conversations[index].receiptGroup&&conversations[index].receiptGroup.groupPhoto && conversations[index].receiptGroup.groupPhoto!=null ){
                console.log("splitGroupPhotoArray groupPhoto: ",conversations[index].receiptGroup.groupPhoto.key );
                let isUserAdmin = conversations[index].receiptGroup.groupAdminUsers.includes((userId:any) => {
                    return userLogonId === userId;
                  });
                isBroadcast = isUserAdmin;

                let splitGroupPhotoArray = conversations[index].receiptGroup.groupPhoto.key.split("=");
                let imageKey = splitGroupPhotoArray[1]?.replace("}", "");
                let location = conversations[index].receiptGroup.groupPhoto.key?.location;
                if(imageKey){
                    let imageUrl = await integration.getAttachmentURLInfo(imageKey, location);
                    imageKey = imageUrl;
                    cognitoId = ""

                }else{
                    imageKey = "";
                }
                console.log("GROUP imageUrl ",imageKey );
            }else{
                imageKey = "";
            }
        }

        const timeAgo:any = new TimeAgo('en-US');
        let createdAt = Date.parse(conversations[index].createdAt);
        console.log(conversations[index], "===>>>");

        
        if(!isNaN(createdAt)){
            let messages:any = await toMessageUI (conversations[index].messages, isBroadcast)
            let messageNextToken = conversations[index]?.messages?.nextToken;
            console.log("|||messageNextToken ", messageNextToken);
            if(messages?.length> 0 ){
                retVal.push({id,name,rawDate:messages[ messages.length -1 ].createdAt , date:moment(createdAt).format("h:mm a") , status: "online", role:roleName, messages:messages , 
                messageNextToken,cognitoId, imageKey, location, isBroadcast, isGroupAdminUser, 
                unread :0})

            }else if(messages!=null){
                console.log("timeAgo.format(createdAt) ", timeAgo.format(createdAt) , " date:moment ", moment(createdAt).format("h:mm a") );
                retVal.push({id,name,rawDate:conversations[index].createdAt , 
                    date:timeAgo.format(createdAt) , status: "online", 
                    role:roleName, messages:messages , 
                    messageNextToken,cognitoId, imageKey,location, isBroadcast, isGroupAdminUser,
                unread :0})
                    //date:moment(createdAt).format("h:mm a") , status: "online", role:roleName, messages:messages , messageNextToken,cognitoId, imageKey,location, isBroadcast, isGroupAdminUser})
            }else{
                console.log("timeAgo.format(createdAt) ", timeAgo.format(createdAt) , " date:moment ", moment(createdAt).format("h:mm a") );
                retVal.push({id,name,rawDate:conversations[index].createdAt , 
                    date:timeAgo.format(createdAt) , status: "online", role:roleName, messages:[] , messageNextToken,cognitoId, imageKey,location, isBroadcast, 
                    isGroupAdminUser, unread :0})
                    //date:moment(createdAt).format("h:mm a") , status: "online", role:roleName, messages:[] , messageNextToken,cognitoId, imageKey,location, isBroadcast, isGroupAdminUser})
            }
        }
        //let item:Conversation = {id : String(conversations[index].id)};
        //item.name = "";
        // let item = {"id": conversations[index].id,
        // "name" : conversations[index].firstName +" " +conversations[index].lastName
        // };
        // item.set('name', conversations[index].firstName +" " +conversations[index].lastName);
        
        // retVal.push( item );
    }
    //console.log("toFrontEndConversation retVal :" ,retVal);

    // "name": "Mulalo Nethononda",
    // "date": "3 min ago",
    // "role": "STUDENT",
    // "unread": 5,
    // "status": "online",
    // "avatar": "https://i.pravatar.cc/50?img=64"

    retVal = retVal.sort((a:any, b:any) => {
        console.log("****DataMapping a ", a)
        var dateA = new Date(a.rawDate).getTime();
        var dateB = new Date(b.rawDate).getTime();
        return dateA < dateB ? 1 : -1;
      })

    console.log("toConversationUI retVal :" , retVal);


    return retVal;
}

export const addMessageToConversation  = async (conversationList:any,conversationId:string,messageId:string, message:string, userLoginId:string, 
    channel:string, createdAt:string, messageObjectActual: any, attachmentContent:any, isBroadcast:boolean, messageStage:string,linkedMessageId:string='', userLogonRoleName:string, userFullName:string) => {
    console.log("addMessageToConversation messageObjectActual :", messageObjectActual, " conversationList ", conversationList);
    let messageObject = {
        id:messageId,
        content:message,
        createdByUserId:userLoginId,
        createdAt, 
        stage:messageStage,   
        roleName: userLogonRoleName,
        firstName:"",lastName:""
    };
    let splittedFullName = userFullName && userFullName!=null? userFullName?.split(" ") : undefined;

    if(splittedFullName && splittedFullName?.length > 1){
        messageObject.firstName = splittedFullName[0]
        messageObject.lastName = splittedFullName[1]
    }
    

    if(messageObjectActual?.id){
        messageObject = messageObjectActual;
    }
    let parentMessageUI = {

    }
    console.log("addMessageToConversation messageObject ", messageObject);
    let messageObjectUI = await toMessageObjectUI(messageObject, null, isBroadcast, attachmentContent);
    console.log("addMessageToConversation messageObjectUI ", messageObjectUI);
    
    let conversationIndex = conversationList.findIndex( (conversation:any)=>conversation.id === conversationId);
    let messageIndex = -1;
    if(conversationIndex > -1 && linkedMessageId?.length > 0){
        messageIndex = conversationList[conversationIndex]?.messages?.findIndex( (message:any)=>message.id === linkedMessageId);
        
        if(conversationList[conversationIndex].messages[messageIndex].linkedMessages){
            conversationList[conversationIndex].messages[messageIndex].linkedMessages.push(messageObjectUI )
        }else{
            let messages = [messageObjectUI];
            conversationList[conversationIndex].messages[messageIndex].linkedMessages = messages
        }
    }else
    if(conversationList[conversationIndex].messages){
        conversationList[conversationIndex].messages.push(messageObjectUI )
    }else{
        let messages = [messageObjectUI];
        conversationList[conversationIndex]['messages'] = messages;
    }
    //console.log("New Conversation ", conversationList);

    return conversationList.slice();
}



