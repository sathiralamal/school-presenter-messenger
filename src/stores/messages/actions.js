import { MESSAGES_LOADING, CONVERSATION_SET_DATA,MESSAGES_SET_DATA, MESSAGES_ADD_DATA, 
    MESSAGES_MERGE_DATA, MESSAGES_SET_TOKEN, MESSAGES_RESET } from "./constants";
import { toConversationUI, toMessageUI } from "../../utils/DataMapping";
import * as integration from "scholarpresent-integration";
import { Storage } from "@ionic/storage";

const store = new Storage();

export function messagesSetLoading(loading) {
    return {
        type: MESSAGES_LOADING,
        payload: loading
    };
}
export function conversationsSetData(params) {
    return {
        type: CONVERSATION_SET_DATA,
        payload: params
    };
}
export function messagesAddData(params) {
    return {
        type: MESSAGES_ADD_DATA,
        payload: params
    };
}
export function messagesMergeData(params) {
    return {
        type: MESSAGES_MERGE_DATA,
        payload: params
    };
}
export function messagesReset(params) {
    return {
        type: MESSAGES_RESET,
        payload: params
    };
}
export function conversationsSetToken(params) {
    return {
        type: MESSAGES_SET_TOKEN,
        payload: params
    };
}

export function messagesSetData(params) {
    return {
        type: MESSAGES_SET_DATA,
        payload: params
    };
}
export const fetchConversation = (cachedConversationId,userId) => (dispatch) => {
    console.log("fetchConversation cachedConversationId ", cachedConversationId)
    return new Promise(async(resolve, reject) => {
        dispatch(messagesSetLoading(true));
        if(cachedConversationId === null || cachedConversationId ===undefined){
            
            integration.listChatConversationsInfo().then(async (conversation) => {
                try {
                    console.log("fetchConversation conversation" , conversation, "->");
                    const values = await toConversationUI(conversation);
                    console.log("fetchConversation Array.isArray(values) " , Array.isArray(values));
                    if (Array.isArray(values)) {
                        console.log("fetchConversation ARRAY is TRUE values ", values);
                        dispatch(conversationsSetData(values));
                        dispatch(conversationsSetToken({
                            nextToken: conversation?.nextToken,
                            total: conversation?.total,
                            pageNumber: conversation?.pageNumber,
                            totalNumberOfPages: conversation?.totalNumberOfPages
                        }))

                        resolve(conversation);
                    } else {
                        console.log("fetchConversation *** FALSE values ", values);

                        dispatch(conversationsSetToken({
                            nextToken: conversation?.nextToken,
                            total: conversation?.total,
                            pageNumber: conversation?.pageNumber,
                            totalNumberOfPages: conversation?.totalNumberOfPages,
                        }))
                        resolve([])
                    }
                } catch (err) {
                    reject(err);
                }
            }).catch((err) => {
                console.log(err, "fetchConversation --->>>");
                
                reject(err);
            }).finally(() => {
                dispatch(messagesSetLoading(false));
            })
        }else{
            console.log("fetchConversation loading cached cachedConversationId ", cachedConversationId)

            await store.create().then(value=>{
                store.get(cachedConversationId).then(conversation=>{
                    console.log("fetchConversation cached conversation ", conversation);
                    if(conversation !== null){
                        toConversationUI({items:[conversation.item]}).then(conversationArray=>{
                            console.log("fetchConversation cached conversationArray ", conversationArray);
                            if (Array.isArray(conversationArray)) {
                                dispatch(messagesAddData(conversationArray));
                                resolve(conversationArray);
                            } else {
                                resolve([])
                            }
                        })
                    }
                    
            
                })
            }).catch((err) => {
                console.log(err, "fetchConversation loading cached --->>>");
                
                reject(err);
            }).finally(() => {
                dispatch(messagesSetLoading(false));
            });


        }
    })
};
export const fetchMoreConversation = (nextToken) => (dispatch) => {
    return new Promise((resolve, reject) => {
        integration.listChatConversationsInfo(nextToken).then(async (conversation) => {
            try {
                console.log(conversation, "->");
                const values = await toConversationUI(conversation);
                if (Array.isArray(values)) {
                    dispatch(messagesAddData(values));
                    dispatch(conversationsSetToken({
                        nextToken: conversation?.nextToken,
                        total: conversation?.total,
                        pageNumber: conversation?.pageNumber,
                        totalNumberOfPages: conversation?.totalNumberOfPages,
                    }))
                    resolve(conversation);
                } else {
                    resolve([])
                }
            } catch (err) {
                reject(err);
            }
        }).catch((err) => {
            console.log(err, "fetchConversation --->>>");
            
            reject(err);
        }).finally(() => {
            dispatch(messagesSetLoading(false));
        });
    })
};




export const fetchMessages =  (tenantId,conversationList,conversationIndex,conversationId) => (dispatch) =>  {
    console.log("fetchMessages conversationList ",conversationList ," conversationId " , conversationId, " messageNextToken ", conversationList[conversationIndex]?.messageNextToken);
    console.log("fetchMessages conversationIndex ", conversationIndex);
    if( conversationList[conversationIndex]?.conversationType ==="member_to_member"){
        return new Promise((resolve, reject) => {
            if(conversationList[conversationIndex]?.messageNextToken!=null || conversationList[conversationIndex]?.messageNextToken === undefined ){
                integration.getMessageByConversationId(tenantId, conversationId, conversationList[conversationIndex]?.messageNextToken).then(
                    messages=>{
                        console.log("fetchMessages messages ",messages);
                        if (Array.isArray(messages?.items) && messages?.items.length >0) {
                            let _isBroadcast =  conversationList[conversationIndex]?.isBroadcast? conversationList[conversationIndex].isBroadcast:false
                            console.log("_isBroadcast ", _isBroadcast);
                            toMessageUI(messages, _isBroadcast ).then(values=>{
                                console.log("fetchMessages values ", JSON.stringify(values) , " conversationIndex ", conversationIndex);
                                console.log("fetchMessages conversationList[conversationIndex].messages ", JSON.stringify(conversationList[conversationIndex].messages));
                                if(values && values!=null && conversationList[conversationIndex]?.messages){

                                    conversationList[conversationIndex].messages = [...values,...conversationList[conversationIndex].messages]; 

                                }else{
                                    conversationList[conversationIndex].messages = [...values]; 
                                }
                                console.log("fetchMessages messages?.nextToken ",messages?.nextToken);

                                conversationList[conversationIndex].messageNextToken = messages?.nextToken;
                                console.log("--------fetchMessages conversationList[conversationIndex].messages ", JSON.stringify(conversationList[conversationIndex].messages));

                                dispatch(messagesSetLoading(false));
                                dispatch(messagesSetData(conversationList));
                                resolve(conversationList);

                            })
                        } else {
                            conversationList[conversationIndex].messages = [];
                            conversationList[conversationIndex].messageNextToken = messages?.nextToken;
                            dispatch(messagesSetLoading(false));
                            dispatch(messagesSetData(conversationList));
                            resolve(conversationList);
                        }   
                    }
                ).catch((err) => {
                    console.log(err, "fetchConversation --->>>");
                    
                    reject(err);
                }).finally(() => {
                    dispatch(messagesSetLoading(false));
                });;
            }else{
                console.log("fetchMessages messageNextToken is NULL. MUST NOT FETCH MORE MESSAGES");
                dispatch(messagesSetLoading(false));
                resolve([])
            }
        })
    } else{
        return new Promise((resolve, reject) => {
            if(conversationList[conversationIndex]?.messageNextToken!=null || conversationList[conversationIndex]?.messageNextToken === undefined ){
                integration.getGroupTopicMessages(tenantId, conversationId, conversationList[conversationIndex]?.messageNextToken).then(
                    messages=>{
                        console.log("fetchMessages messages ",messages);
                        if(messages?.items){
                            messages.items = removeDuplicateMessages(messages?.items, conversationList[conversationIndex].messages )
                        }
                        if (Array.isArray(messages?.items) && messages?.items.length >0) {
                            let _isBroadcast =  conversationList[conversationIndex]?.isBroadcast? conversationList[conversationIndex].isBroadcast:false
                            console.log("_isBroadcast ", _isBroadcast);
                            toMessageUI(messages, _isBroadcast ).then(values=>{
                                console.log("fetchMessages values ", values , " conversationIndex ", conversationIndex);
                                if(values && values!=null && conversationList[conversationIndex]?.messages){
                                    conversationList[conversationIndex].messages = [...values,...conversationList[conversationIndex].messages]; 

                                }else{
                                    console.log("fetchMessages conversation ",conversationList)
                                    conversationList[conversationIndex]["messages"] = [...values]; 
                                    
                                }
                                console.log("fetchMessages messages?.nextToken ",messages?.nextToken);

                                conversationList[conversationIndex].messageNextToken = messages?.nextToken;
                                dispatch(messagesSetLoading(false));

                                dispatch(messagesSetData(conversationList));
                                resolve(conversationList);

                            })
                        } else if(conversationList[conversationIndex]?.messages?.length >0){
                            conversationList[conversationIndex].messages = [...conversationList[conversationIndex].messages]; 

                            console.log("fetchMessages messages?.nextToken ",messages?.nextToken);

                            conversationList[conversationIndex].messageNextToken = messages?.nextToken;
                            dispatch(messagesSetLoading(false));

                            dispatch(messagesSetData(conversationList));
                            resolve(conversationList);
                        } else {
                            conversationList[conversationIndex].messages = [];
                            conversationList[conversationIndex].messageNextToken = messages?.nextToken;
                            dispatch(messagesSetLoading(false));
                            dispatch(messagesSetData(conversationList));
                            resolve(conversationList);
                        }   
                    }
                ).catch((err) => {
                    console.log(err, "fetchConversation --->>>");
                    
                    reject(err);
                }).finally(() => {
                    dispatch(messagesSetLoading(false));
                });;
            }else{
                console.log("fetchMessages messageNextToken is NULL. MUST NOT FETCH MORE MESSAGES");
                dispatch(messagesSetLoading(false));
                resolve([])
            }
        })

    }


        // if (Array.isArray(resp?.items)) {
        //     let messages: any = await toMessageUI(resp, false);
        //     let allMessages: any[] = [...messageList, ...messages];
        //     const sortedMessages = allMessages.sort((a: any, b: any) => {
        //         ////console.log("toMessageUI sortedMessage b.createdAt " ,b.createdAt , " a.createdAt ", a.createdAt);
        //         if (a?.createdAt) {
        //             return a.createdAt.localeCompare(b.createdAt);
        //         } else {
        //             return false;
        //         }
        //     });
        //     console.log("handleLoadMoreMessages sortedMessages ", sortedMessages); 

        //     setMessageList([...sortedMessages]);
        // }
        // console.log("handleLoadMoreMessages resp ", resp); 
        // setMessageNextToken(resp.nextToken);
    

};
const removeDuplicateMessages = (newMessages, currentMessages )=>{
    console.log("removeDuplicateMessages newMessages ",JSON.stringify(newMessages), " currentMessages ", JSON.stringify(currentMessages) );
    let newArray  = [];
    for(let i=0; i < newMessages.length;i++ ){
        if(currentMessages.findIndex(item => item?.id === newMessages[i]?.id) < 0){
            newArray.push(newMessages[i])
        }
    }
    console.log("removeDuplicateMessages newArray ",JSON.stringify(newArray) );

    return newArray;
}
export const addNewMessageReplies =  (conversationList,conversationIndex, messageIndex ,newMessage ) => (dispatch) =>  {
    
    return new Promise((resolve, reject) => {

        console.log("addNewMessageReplies conversationList ", conversationList);

        if(conversationList[conversationIndex]?.messages[messageIndex]?.linkedMessages.length > 0){
            console.log("addNewMessageReplies add Updating Message  ");

            conversationList[conversationIndex].messages[messageIndex].linkedMessages = [...conversationList[conversationIndex].messages[messageIndex].linkedMessages,...newMessage ]; 
        }else{
            console.log("addNewMessageReplies add New Message  ");

            conversationList[conversationIndex].messages[messageIndex]["linkedMessages"] = [...newMessage]; 
        }
        dispatch(messagesSetData(conversationList));
        resolve(conversationList);
    })
}


export const fetchMessageReplies =  (tenantId, conversationList,conversationIndex, messageIndex ,messageId, messageNextToken ) => (dispatch) =>  {
    console.log("^^^^^^^^^fetchMessageReplies conversationList ", conversationList, " conversationIndex ", conversationIndex," messageIndex ",messageIndex ," messageId " , messageId, " messageNextToken ", messageNextToken );

    return new Promise((resolve, reject) => {
        if(messageNextToken!=null || messageNextToken === undefined ){
            integration.getMessageByLinkedMessageId(conversationList[conversationIndex]?.id, messageId, messageNextToken).then(
                messages=>{
                    console.log("fetchMessageReplies messages ",messages);
                    if (Array.isArray(messages?.items) && messages?.items?.length >0 ) {
                        
                        toMessageUI(messages, false ).then(values=>{
                            console.log("fetchMessageReplies values ", values , " conversationIndex ", conversationIndex);
                            if(values && values!=null){
                                if(conversationList[conversationIndex].messages.length > 0 && conversationList[conversationIndex].messages[messageIndex]?.length > 0){
                                    conversationList[conversationIndex].messages[messageIndex].linkedMessages = [...values,...conversationList[conversationIndex].messages[messageIndex]]; 
                                }else{
                                    console.log("fetchMessageReplies conversationList[conversationIndex].messages[messageIndex] ", conversationList[conversationIndex].messages[messageIndex]);

                                    conversationList[conversationIndex].messages[messageIndex]["linkedMessages"] = [...values]; 

                                }

                            }
                            console.log("fetchMessageReplies messages?.nextToken ",messages?.nextToken);

                            conversationList[conversationIndex].messages[messageIndex]["linkedMessages"].messageNextToken = messages?.nextToken;
                            dispatch(messagesSetData(conversationList));
                            resolve(conversationList);

                        })
                    } else {
                        resolve([])
                    }        
                }
            ).catch((err) => {
                console.log(err, "fetchConversation --->>>");
                
                reject(err);
            }).finally(() => {
                dispatch(messagesSetLoading(false));
            });;
        }else{
            console.log("fetchMessages messageNextToken is NULL. MUST NOT FETCH MORE MESSAGES");
            dispatch(messagesSetLoading(false));
            resolve([])
        }
    })


}

export const addNewInnerMessageReply =  (conversationList,conversationIndex, messageIndex, linkedMessageIndex ,newMessage ) => (dispatch) =>  {
    
    return new Promise((resolve, reject) => {

        console.log("addNewInnerMessageReply conversationList ", conversationList);
        if(conversationList[conversationIndex]?.messages[messageIndex]?.linkedMessages?.length > 0){
            conversationList[conversationIndex].messages[messageIndex].linkedMessages[linkedMessageIndex] = [...conversationList[conversationIndex]?.messages[messageIndex]?.linkedMessages, newMessage]; 
        }else{
            console.log("fetchMessageInnerReplies conversationList[conversationIndex].messages[messageIndex] ", conversationList[conversationIndex].messages[messageIndex]);

            conversationList[conversationIndex].messages[messageIndex].linkedMessages[linkedMessageIndex] = [newMessage]; 

        }

        dispatch(messagesSetData(conversationList));
        resolve(conversationList);
    })
}

export const fetchMessageInnerReplies =  (tenantId,conversationList,linkedMessage,conversationIndex, messageIndex ,linkedMessageIndex, messageNextToken ) => (dispatch) =>  {
    console.log("fetchMessageInnerReplies conversationList ", conversationList, " linkedMessage ", linkedMessage)

    console.log(" conversationIndex ", conversationIndex," messageIndex ",messageIndex ," linkedMessageIndex " , linkedMessageIndex, " messageNextToken ", messageNextToken );

    return new Promise((resolve, reject) => {
        if(messageNextToken!=null || messageNextToken === undefined ){

            // integration.getMessageByLinkedMessageId(conversationList[conversationIndex]?.id, linkedMessage.id, messageNextToken).then(
            //     messages=>{
            //         console.log("fetchMessageInnerReplies messages ",messages);
            //         if (Array.isArray(messages?.items) && messages?.items?.length >0 ) {
                        
            //             // toMessageUI(messages, false ).then(values=>{
            //             //     console.log("fetchMessageInnerReplies values ", values , " conversationIndex ", conversationIndex);
            //             //     if(values && values!=null){
            //             //         if(conversationList[conversationIndex]?.messages[messageIndex]?.linkedMessages?.length > 0){
            //             //             conversationList[conversationIndex].messages[messageIndex].linkedMessages[linkedMessageIndex].linkedMessages = [conversationList[conversationIndex].messages[messageIndex].linkedMessages[linkedMessageIndex].linkedMessages, ...values]; 
            //             //         }else{
            //             //             console.log("fetchMessageInnerReplies conversationList[conversationIndex].messages[messageIndex] ", conversationList[conversationIndex].messages[messageIndex]);
            //             //             console.log("fetchMessageInnerReplies linkedMessage ", linkedMessage);
            //             //             if(Object.keys(linkedMessage).length > 0){
            //             //                 conversationList[conversationIndex].messages[messageIndex].linkedMessages[linkedMessageIndex].linkedMessages = [ linkedMessage, ...values]; 
            //             //             } else if(conversationList[conversationIndex]?.messages[messageIndex]?.linkedMessages){
            //             //                // conversationList[conversationIndex].messages[messageIndex].linkedMessages[linkedMessageIndex].linkedMessages = [ ...values]; 
            //             //             }

            //             //         }

            //             //     }
            //             //     console.log("fetchMessageInnerReplies messages?.nextToken ",messages?.nextToken);
            //             //     if(conversationList[conversationIndex]?.messages[messageIndex]?.linkedMessages){
            //             //         conversationList[conversationIndex].messages[messageIndex]["linkedMessages"][linkedMessageIndex].messageNextToken = messages?.nextToken;
            //             //     }
            //             //     console.log("fetchMessageInnerReplies conversationList ", conversationList);

            //             //     dispatch(messagesSetData(conversationList));
            //             //     resolve(conversationList);

            //             // })
            //         } else {
            //             if(Object.keys(linkedMessage).length > 0){
            //                 conversationList[conversationIndex].messages[messageIndex].linkedMessages[linkedMessageIndex].linkedMessages = [ linkedMessage]; 
            //             } 
            //             conversationList[conversationIndex].messages[messageIndex]["linkedMessages"][linkedMessageIndex].messageNextToken = messages?.nextToken;

            //             dispatch(messagesSetData(conversationList));
            //             resolve(conversationList);                    }        
            //     }
            // ).catch((err) => {
            //     console.log(err, "fetchConversation --->>>");
                
            //     reject(err);
            // }).finally(() => {
            //     dispatch(messagesSetLoading(false));
            // });;
        }else{
            console.log("fetchMessages messageNextToken is NULL. MUST NOT FETCH MORE MESSAGES");
            dispatch(messagesSetLoading(false));
            resolve([])
        }
    })


}


