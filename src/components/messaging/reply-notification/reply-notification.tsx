import react, { useState, useEffect } from 'react';
import { Avatar, Button, ButtonGroup, Divider, Dropdown, Icon, IconButton, Input, Panel } from 'rsuite';
import { IonSpinner } from '@ionic/react';
import InfiniteScroll from "react-infinite-scroller";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

import conversations from '../../../pages/message-page/data';
import ChatControls from '../chat-controls/chat-controls';
import Conversation from '../conversation/conversation';
import MessageComponent from '../message-component/message-component';
import ReplyChatControls from "../reply-chat-controls/ReplyChatControls";
import useGetCacheTenantId from "../../../hooks/useGetCacheTenantId";

import { getRoleName } from '../../../utils/StorageUtil';
import { toMessageUI } from '../../../utils/DataMapping';

import moment from 'moment';
import './reply-notification.css'
import * as integration from "scholarpresent-integration";

import { connect } from "react-redux";
import {  fetchMessageReplies, addNewMessageReplies, fetchMessageInnerReplies, addNewInnerMessageReply} from "../../../stores/messages/actions";


const ReplyNotification = (props: any) => {

	const [messageView, setMessageView] = useState(false)
	const [activeIndex, setActiveIndex] = useState(1)
	const [innerActiveIndex, setInnerActiveIndex] = useState(0)

	const [conversation, setConversation] = useState<any>({});
	const [replies, setReplies] = useState<any[]>([]);
	const [loadingReplies, setLoadingReplies] = useState<boolean>(false);
	const [reply, setReply] = useState<any>({});
	const [replyNextToken, setReplyNextToken] = useState<any>();

	const [innerReplies, setInnerReplies] = useState<any>([]);
	const [innerRepliesOriginal, setInnerRepliesOriginal] = useState<any>([]);
	const [loadingInnerReplies, setLoadingInnerReplies] = useState<boolean>(false);
	let tenantId:string = useGetCacheTenantId();

	

	



	const fetchMessageDetails = async (messageId: string) => {
		try {
			setLoadingReplies(true);

			const timeAgo: any = new TimeAgo('en-US');
			let messageIndex = props.conversation.messages.findIndex( (message:any)=>message.id===props.messageId)
			
			console.log("props.messageId " , messageId , " messageIndex ",  messageIndex);
			props.fetchMessageReplies (tenantId,props.conversationList, props.activeIndex, messageIndex ,props.messageId );

			// const messageDetails = await integration.getMessageByIdInfo(messageId,null);
			// if (Array.isArray(messageDetails.items)) {
			// 	let item = messageDetails.items[0];
			// 	if (Array.isArray(item?.linkedMessage?.items)) {
			// 		let userIds: any[] = item.linkedMessage.items.map((message: any) => message.createdByUserId);
			// 		let userInfo = await integration.findUsersById(userIds);
			// 		for (let i = 0; i < item.linkedMessage.items.length; i++) {
			// 			let createdAt = Date.parse(item.linkedMessage.items[i]?.createdAt);
			// 			let time = "";
			// 			if (createdAt) {
			// 				var TODAY = moment().clone().startOf('day');
			// 				if (moment(createdAt).isSame(TODAY, 'd')) {
			// 					time = moment(createdAt).format("h:mm a");
			// 				} else {
			// 					time = timeAgo.format(createdAt);
			// 				}
			// 			} else {
			// 				time = '';
			// 			}
			// 			let roleName = await handleGetRoleName(userInfo[i]?.userRoleId);
			// 			userInfo[i]["roleName"] = roleName;
			// 			item.linkedMessage.items[i]["userInfo"] = userInfo[i];
			// 			item.linkedMessage.items[i]["time"] = time;
			// 		}
			// 		// item.linkedMessage.items.map((message:any, i:number)=>{
			// 		// 	message["userInfo"] = userInfo[i];
			// 		// })
			// 		setReplies([...item.linkedMessage.items]);
			// 	}
			// }
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingReplies(false);
		}
	}
	const handleGetRoleName = async (roleId: string) => {
		let roleName = await getRoleName(roleId);
		return roleName
	}
	const handleFetchInnerReplies = async (reply: any) => {
		console.log( "handleFetchInnerReplies reply ", reply);


		try {
			setLoadingInnerReplies(true);
			props.fetchMessageInnerReplies ( tenantId, props.conversationList,reply ,  props.activeIndex, activeIndex ,innerActiveIndex);
			// const messageDetails = await integration.getMessageByIdInfo(reply?.id, null);
			// if (Array.isArray(messageDetails.items)) {
			// 	let item = messageDetails.items[0];
			// 	if (Array.isArray(item?.linkedMessage?.items)) {
			// 		item?.linkedMessage?.items?.push(reply);
			// 		setInnerRepliesOriginal(item?.linkedMessage?.items);
			// 		let messages: any = await toMessageUI(item.linkedMessage, false);
			// 		const sortedMessages = messages.sort((a: any, b: any) => {
			// 			if (a?.createdAt) {
			// 				return a.createdAt.localeCompare(b.createdAt)
			// 			} else {
			// 				return false;
			// 			}
			// 		})
			// 		setInnerReplies([...sortedMessages]);
			// 	}
			// }
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingInnerReplies(false);
		}
	}

	const handleReplyListUpdate = async (replyObj: any) => {
		//innerRepliesOriginal.push(replyObj);
		let newMessage: any = await toMessageUI({ items: [replyObj] }, false);
		console.log("handleReplyListUpdate messages ",newMessage   );
		console.log("handleReplyListUpdate linkedMessages ",props.messages[props.activeIndex].messages[activeIndex].linkedMessages);
		let cuurentConversation  =  props.messages;
		props.addNewMessageReplies(props.messages, props.activeIndex, activeIndex ,newMessage);
		setReplies([...replies, ...newMessage ])
		// const sortedMessages = messages.sort((a: any, b: any) => {
		// 	if (a?.createdAt) {
		// 		return a.createdAt.localeCompare(b.createdAt)
		// 	} else {
		// 		return false;
		// 	}
		// })
		// setInnerReplies([...sortedMessages]);
	}

	const handleInnerReplyListUpdate = async (newInnerMessage: any) => {
		//innerRepliesOriginal.push(replyObj);
		console.log("handleInnerReplyListUpdate newInnerMessage ", newInnerMessage);
		let newMessage: any = await toMessageUI({ items: [newInnerMessage] }, false);
		console.log("handleInnerReplyListUpdate messages ",newMessage   );

		props.addNewInnerMessageReply(props.messages, props.activeIndex, activeIndex, innerActiveIndex ,newMessage);

		setInnerReplies([...innerReplies,...newMessage ]);
	}

	const handleHasMoreReplies=()=>{
		console.log("handleHasMoreReplies replyNextToken ", replyNextToken);
		return false
	}

	useEffect(() => {
		console.log("props:", props);

		console.log("props.conversation:", props.conversation);
		// @ts-ignored
		TimeAgo.addDefaultLocale(en)
		setConversation(props.conversation);
		console.log("reply.conversation:", conversation);
		setActiveIndex(props.conversation.messages.findIndex( (message:any)=>message.id===props.messageId))

		fetchMessageDetails(props.messageId)


	}, []);
	useEffect(() => {
        console.log("*** Reply Notification useEffect props.messages) : ", props.messages);
		if(!messageView){
			let messageIndex = props.conversation.messages.findIndex( (message:any)=>message.id===props.messageId)

			console.log("*** Reply Notification useEffect props.messages.length) : ", props.messages[props.activeIndex].messages[messageIndex]);
			setReplies(props.messages[props.activeIndex].messages[messageIndex].linkedMessages);
			setReplyNextToken(props.messages[props.activeIndex].messages[messageIndex].linkedMessages.messageNextToken);
		}else{
			console.log("||| InnerReplies: props.messages[props.activeIndex].messages[activeIndex].linkedMessages[innerActiveIndex] ", props.messages[props.activeIndex].messages[activeIndex].linkedMessages[innerActiveIndex]);
			console.log("*** InnerReplies: ", props.messages[props.activeIndex].messages[activeIndex].linkedMessages[innerActiveIndex]?.linkedMessages,
			" activeIndex ",activeIndex," innerActiveIndex ", innerActiveIndex, " ");

			setInnerReplies(props.messages[props.activeIndex].messages[activeIndex].linkedMessages[innerActiveIndex]?.linkedMessages);
			//setReplyNextToken(props.messages[props.activeIndex].messages[messageIndex].linkedMessages.messageNextToken);
		}
        // setConversationList([...props.messages]);
        
        
        // if (props.messages.length > 0 && props.messages[activeIndex]?.messages) {
        //     setMessageList([...props.messages[activeIndex]?.messages]);
        //     setMessageNextToken(props.messages[activeIndex]?.messageNextToken);
        // }

        // if(props.match?.params?.id){
        //     let conversationIndex = props.messages.findIndex((conversation:any) => conversation.id === props.match?.params?.id);
        //     setActiveIndex(conversationIndex);

        // }
        //$("#ud-message-container").scrollTop($("#ud-message-container")[0]?.scrollHeight);


    }, [props.messages]);
	useEffect(() => {
		handleFetchInnerReplies(reply);
	}, [reply])
	useEffect(() => {
		console.log("useEffect replies ", replies)
	},[replies]);
	return (
		<div className='reply-notifications'>
			<div className="header-block">
				<div className='user-detail'>
					<Icon onClick={() => { props.setReplyNotificationView(false) }} icon='chevron-left' style={{ color: '#777' }} />
					<Icon icon='bell' size='lg' style={{ color: '#777' }} />
					<h2 className='name'>Reply Notifications</h2>
				</div>
			</div>
			<Conversation conversation={conversation} />
			<div className='reply-message-content'>
				<Panel bordered>
					<h5 className='title'>
						{messageView &&
							<div>
								<Icon
									onClick={() => {
										setMessageView(false);
										setInnerReplies([]);
										setReply({})
									}}
									icon='chevron-left'
									style={{ color: '#777' }}
								/>
								{`Reply to ${`${reply?.userName}`}`}
							</div>
						}
						{
							!messageView &&
							'Replies'
						}
					</h5>
					{(loadingReplies || loadingInnerReplies) && (
						<>
						<div style={{ textAlign: "center" }}>
							<IonSpinner color="#2fd36e" />
						</div>
						<h2 className='title'>Loading...</h2>
						</>
					)}
					{
						!messageView &&
						<div>
						<InfiniteScroll
                                        initialLoad = {false}
                                        pageStart={0}
                                        loadMore={() => {
                                            console.log("reply-notification data ... ");
                                        }}
                                        hasMore={handleHasMoreReplies()}
                                        loader={
                                            <div style={{ textAlign: "center", padding: 10 }}>
                                                <IonSpinner
                                                    name="bubbles"
                                                    style={{ transform: "scale(1.5)" }}
                                                    color="success"
                                                />
                                            </div>
                                        }
                                        useWindow={false}
                                        //getScrollParent={() => this.scrollParentRef}
                                    >
							{
								replies.length > 0 && replies?.map((message: any, i: number) => {
									{console.log("message ",message )}
									return (
										<div key={i} className='reply-message' onClick={() => {
											setMessageView(true);
											setInnerActiveIndex(i);
											setReply(message);
										}}>
											<div className='user-block'>
												{/* <Avatar circle size='xs' src={message.avatar} /> */}
												<Avatar
													src={message.avatar}
													size="md" circle alt={message?.userName?.toString()?.substr(0, 1)}
												>
													{message.avatar ? '' : message?.userName?.toString()?.substr(0, 1)}
												</Avatar>
												<h5 className="name">{message.userName} </h5>
											</div>
											<div className='content-block'>
												<p className='message'>
													{message.text?.length > 50
														? `${message.text?.substring(0, 50)}... (${message?.time})`
														: `${message.text} (${message?.time})`
													}
												</p>
												<span className='role-name'>{message?.roleName}</span>
											</div>
										</div>
									)
								})
								
							}
							
							
						</InfiniteScroll>
						{
								replies.length === 0 &&<h6 className='title'>No comments yet</h6>
						}
						<ChatControls
						messageType="reply"
						replyMessage={reply}
						messageReplyLevel="top"
						replyMessageId={props?.replyMessageId}
						conversationId={props?.conversation?.id}
						conversationList={props?.conversationList}
						onConversationListChange={props?.onConversationListChange}
						onReplyListUpdate={(replyObj: any) => handleReplyListUpdate(replyObj)}
						/>
						</div>
					}
					{
						messageView &&
						<div>
							<div className="message-content-block my-scrollbar">
								<div className="message-list clearfix">
								<InfiniteScroll
                                        initialLoad = {false}
                                        pageStart={0}
                                        loadMore={() => {
                                            console.log("reply-notification data ... ");
                                        }}
                                        hasMore={handleHasMoreReplies()}
                                        loader={
                                            <div style={{ textAlign: "center", padding: 10 }}>
                                                <IonSpinner
                                                    name="bubbles"
                                                    style={{ transform: "scale(1.5)" }}
                                                    color="success"
                                                />
                                            </div>
                                        }
                                        useWindow={false}
                                        //getScrollParent={() => this.scrollParentRef}
                                    >
									{
										innerReplies?.map((message: any, index: number) => (

											<>
												<MessageComponent
													key={index}
													message={message}
													index={index}
													activeIndex={index}
												/>
											</>
										))}
									</InfiniteScroll>
								</div>
							</div>
							{console.log("reply-notification conversation ", conversation)}
							<ChatControls
								messageType="reply"
								replyMessage={reply}
								conversationList={props?.conversationList}
								onConversationListChange={props?.onConversationListChange}
								conversationId={props.messages[props.activeIndex].id}
								onReplyListUpdate={(replyObj: any) => handleInnerReplyListUpdate(replyObj)}
							/>
						</div>
					}
				</Panel>
			</div>
		</div>
	)
}
const mapStateToProps = (state: any) => ({
    messages: state.messages.messages,
    
});
const mapDispatchToProps = {
    fetchMessageReplies,addNewMessageReplies, fetchMessageInnerReplies,addNewInnerMessageReply
    
};
export default connect(mapStateToProps, mapDispatchToProps)(ReplyNotification);

