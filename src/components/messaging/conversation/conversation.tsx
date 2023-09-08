import React, { useEffect, useState } from "react";
import { Avatar, Badge } from "rsuite";
import { Storage } from "@ionic/storage";
import { v4 as uuid } from "uuid";


import { toMessageObjectUI } from "../../../utils/DataMapping";
import { MESSAGE_STAGES } from "../../../utils/Constants";

import "./conversation.css";

//redux
import { connect } from "react-redux";
import { conversationsSetData } from "../../../stores/messages/actions";

import * as integration from "scholarpresent-integration";

const Conversation = (props: any) => {
    const [avatar, setAvatar] = useState("");
    const store = new Storage();
    let userLoginId: string;
	
                   

    useEffect(() => {
        if (props.conversation?.imageKey) {
            getProfilePhotoInfo(props.conversation.imageKey, props.conversation.location);
        }else{
            setAvatar("");
        }
        console.log("conversation props.conversation ", props.conversation);
       
    }, [props.conversation]);

    useEffect(() =>{
        console.log("useEffect avatar ",avatar )
    },[avatar])
    const getProfilePhotoInfo = async (imageKey: string, location: string) => {
        await store.create();
        let cachedData = await store.get(imageKey);
        console.log("IMAGE cachedData ", cachedData);
        if (cachedData && cachedData != null) {
            setAvatar(URL.createObjectURL(cachedData));
        } else {
            integration.getProfilePhotoThumbnailInfo(imageKey, location, null).then((thumbNailData: any) => {
                console.log("avatar thumbNailData ", thumbNailData);
                setAvatar(URL.createObjectURL(thumbNailData));
                store.set(imageKey, thumbNailData).then((value: any) => {});
            }).catch(error=>{
                console.log("error with fetch imageKey ", imageKey, " at location ", location);
            });
        }
    };
    

    return (
        <div
            className={props.active ? "active conversation" : "conversation"}
            onClick={() => {
                console.log("Conversation clicked! props ", props);
                if(props.openConversation){
                    props.openConversation(props.index);
                }

            }}
        >
            <div className={`${props.conversation.status} media`}>
                <Avatar src={avatar} size="md" circle alt={props.conversation?.name?.toString()?.substr(0, 1)}>
                    {props.conversation?.avatar ? "" : props.conversation.name?.toString()?.substr(0, 1)}
                </Avatar>
            </div>
            <div className="content">
                <div className="header-title">
                    <h2 className="name">{props.conversation.name}</h2>
                    <div>
                        <span className="role">{props.conversation.role}</span>
                        <span className="date">
                            {props.conversation?.messages!=null && props.conversation.messages?.length > 0
                                ? props.conversation.messages[props.conversation.messages?.length - 1]?.time
                                : ""}
                        </span>
                    </div>
                </div>
                <p className="message">
                    {/* {
                        console.log("props?.conversation?.messages ", props?.conversation?.messages,
                        "  props?.conversation?.messages!==null ", props?.conversation?.messages!==null)
                    }             */}
                    {props?.conversation?.messages!==null && props.conversation?.messages?.length > 0
                     && props.conversation.messages[props.conversation.messages?.length - 1]!=null
                        ? props.conversation.messages[props.conversation.messages?.length - 1].text
                        : ""} 
                </p>
                {props.conversation?.unread > 0? <Badge content={props.conversation.unread} />:""}

            </div>
        </div>
    );
};
const mapStateToProps = (state: any) => ({
    messages: state.messages.messages,
});
const mapDispatchToProps = {
    conversationsSetData,
};
export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
