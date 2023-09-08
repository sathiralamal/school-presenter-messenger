import {
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonImg,
} from "@ionic/react";
import { useCallback, useEffect, useState, useRef } from "react";
import { Analytics } from "aws-amplify";

import { useHistory, useLocation } from "react-router-dom";

import {
  Avatar,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  Dropdown,
  Grid,
  Icon,
  IconButton,
  Input,
  InputGroup,
  MultiCascader,
  Row,
} from "rsuite";
import { Storage } from "@ionic/storage";
import $ from "jquery";
import {
  Plugins,
  Capacitor,
  // PushNotification,
  // PushNotificationToken,
  // PushNotificationActionPerformed,
} from "@capacitor/core";
import { MESSAGE_STAGES } from "../../utils/Constants";

import useScreenSize from "../../hooks/useScreenSize";
import Conversation from "../../components/messaging/conversation/conversation";
import Header from "../../components/messaging/header/header";
import "./message-page.css";
import { toConversationUI, toMessageUI } from "../../utils/DataMapping";
import {
  useComponentDidMount,
  useComponentDidUpdate,
  useComponentWillUnmount,
} from "../../utils/ReactLifeCycle";

import Amplify, { Auth } from "aws-amplify";

import ReplyNotification from "../../components/messaging/reply-notification/reply-notification";
import ChatControls from "../../components/messaging/chat-controls/chat-controls";
import MessageComponent from "../../components/messaging/message-component/message-component";

import CasCaderComponent from "../../components/messaging/cascader/cascader";
import CreateConversation from "../../components/messaging/createConversation/CreateConversation";
// import CascadeData from '../../components/cascader/data';
import { toMessageObjectUI } from "../../utils/DataMapping";
import InfiniteScroll from "react-infinite-scroller";

import {
  CACHE_USER_LOGIN_ROLE_NAME,
  CACHE_USER_LOGIN_ID,
  TENANT_ID,
} from "../../utils/StorageUtil";
import { v4 as uuid } from "uuid";

//redux
import { connect } from "react-redux";
import {
  fetchConversation,
  fetchMoreConversation,
  fetchMessages,
} from "../../stores/messages/actions";
import { conversationsSetData } from "../../stores/messages/actions";

import * as integration from "scholarpresent-integration";
import useHandleNotification from "../../hooks/useHandleNotification";
import useGetCacheUserId from "../../hooks/useGetCacheUserId";
import useGetCacheTenantId from "../../hooks/useGetCacheTenantId";

import usePrevious from "../../hooks/usePrevious";

var cascadeRawData: any = [];

const Message = (props: any) => {
  const history = useHistory();
  const prevMessages = usePrevious(props.messages);
  const prevLoading = usePrevious(props.loading);
  const prevParamConversationId = usePrevious(props.match?.params?.id);

  const { mobile } = useScreenSize();
  const prevMobile = usePrevious(mobile);

  const [conversationName, setConversationName] = useState<string>("");
  const [isPrinciple, setIsPrinciple] = useState<boolean>(true);
  const [updater, setUpdater] = useState<string>("0");

  const [state, setState] = useState({
    userLogonId: "",
    tenantId: "",
    conversationList: [] as any,
    messageList: [] as any,
    activeIndex: -1,
  });

  const prevActiveIndex = usePrevious(state.activeIndex);

  const [replyMessageId, setReplyMessageId] = useState<string>("");
  const [messageId, setMessageId] = useState<string>("");
  const [replyNotificationView, setReplyNotificationView] =
    useState<boolean>(false);
  const [cascadeData, setCascadeData] = useState<any[]>([]);
  const prevConversationList = usePrevious(state.conversationList);

  const prevMessageList = usePrevious(state.messageList);

  const [messageNextToken, setMessageNextToken] = useState<any>(null);
  const [selectedValues, setSelectedValue] = useState<string[]>([]);
  const [isInstantMessageActive, setIsInstantMessageActive] =
    useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [messageSearchLoading, setMessageSearchLoading] =
    useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [avatar, setAvatar] = useState("");
  const [currentRoleName, setCurrentRoleName] = useState("");
  const prevCurrentRoleName = usePrevious(currentRoleName);

  const [studentOrParentContactList, setStudentOrParentContactList] = useState(
    []
  );
  const userLoginId = useGetCacheUserId();
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const prevIsFirstLoad = usePrevious(isFirstLoad);
  const conversationScrollRef = useRef<any>();
  const scrollParentRef = useRef<HTMLElement | null>();
  let isInfiniteFirstLoad: boolean = !(
    !props.loading &&
    (conversationScrollRef?.current?.beforeScrollHeight === undefined ||
      conversationScrollRef?.current?.beforeScrollTop === undefined)
  );

  // refresh conversation listener every 2 mins
  const [listenerInterval, setListenerInterval] = useState<any>(null);

  // const [internal, setUpdater] = useState<string>("0");

  // @TODO: can update chat content base on this state
  const [lastNativeNotification, lastWebNotification] = useHandleNotification();
  const prevLastNativeNotification = usePrevious(lastNativeNotification);
  const location: any = useLocation();

  let store: any = null;
  try {
    store = new Storage();
  } catch (ex) {
    console.log("store ex ", ex);
  }
  let convList;

  useEffect(() => {
    console.log("1-useEffect ENTER");

    console.log(
      "1-useEffect isFirstLoad ",
      isFirstLoad,
      " prevIsFirstLoad ",
      prevIsFirstLoad,
      " location?.state?.conversationId ",
      location?.state?.conversationId
    );
    if (
      isFirstLoad &&
      isFirstLoad !== prevIsFirstLoad &&
      location?.state?.conversationId
    ) {
      console.log("1-useEffect HALT");
      return;
    }

    if (isFirstLoad && isFirstLoad !== prevIsFirstLoad) {
      console.log("1-useEffect calling handleOnLoadChangeCache ...");
      handleOnLoadChangeCache();

      return;
    }

    console.log(
      "1-useEffect props.loading ",
      props.loading,
      " prevLoading ",
      prevLoading
    );

    if (isFirstLoad || props.loading !== prevLoading) {
      console.log("1-useEffect return loading changed");
      console.log(
        "1-useEffect props.messages ",
        props.messages,
        " props.messages.length ",
        props.messages?.length
      );
      if (isFirstLoad && props.messages.length > 0) {
        // Retrieve messages for the first load
        console.log("1-useEffect calling props.fetchMessages ...");
        props.fetchMessages(
          state.tenantId,
          props.messages,
          0,
          props.messages[0].id
        );
      }
      setIsFirstLoad(false);
      return;
    }

    console.log("1-useEffect mobile ", mobile, " prevMobile ", prevMobile);
    if (mobile !== prevMobile) {
      if (props.messages.length > 0) {
        let newState: any = {
          conversationList: props.messages,
        };
        if (!mobile) {
          newState.activeIndex = state.activeIndex;
        } else {
          newState.activeIndex = -1;
        }
        setState({ ...state, ...newState });
        // Allow for the ui to load
        setTimeout(
          () =>
            $("#ud-message-container").scrollTop(
              $("#ud-message-container")[0]?.scrollHeight
            ),
          1000
        );
      }
      console.log("1-useEffect return MOBILE changed");

      return;
    }

    console.log(
      "1-useEffect activeIndex ",
      state.activeIndex,
      " prevActiveIndex ",
      prevActiveIndex
    );
    if (
      state.activeIndex !== prevActiveIndex &&
      props.match?.params?.id === undefined
    ) {
      console.log("1-useEffect calling handleOnChangeConversation ...");

      handleOnChangeConversation();
      console.log("useEffect return conversation changed");
      //return;
    }

    // if(messageList!==prevMessageList || conversationList!==prevConversationList){
    //     onMessageChange();
    // }
  }, [
    props.loading,
    state.messageList,
    state.conversationList,
    mobile,
    state.activeIndex,
    currentRoleName,
    studentOrParentContactList,
    messageNextToken,
    listenerInterval,
  ]);

  useEffect(() => {
    console.log("2-useEffect ENTER");
    console.log("2-useEffect props.messages ", JSON.stringify(props.messages));

    onMessageChange(false);
    Analytics.record({ name: "view-message", attributes: { action: "load" } });
  }, [props.messages]);

  useEffect(() => {
    console.log("3-useEffect ENTER");

    if (lastNativeNotification !== prevLastNativeNotification) {
      onLastNativeNotification();
    } else if (location?.state?.messageId) {
      if (state.conversationList.length < 1) {
        let conversationIndex = props.messages.findIndex(
          (conversation: any) =>
            conversation.id === location?.state?.conversationId
        );
        let conversationList = props.messages;
        console.log("3-useEffect conversationIndex");
        if (conversationIndex > -1) {
          onLastNativeNotification();
          setState({ ...state, activeIndex: conversationIndex });

          //conversationList[conversationIndex].messageNextToken = undefined;

          //props.fetchMessages(tenantId, conversationList,conversationIndex,location?.state?.conversationId);
          //setState({ ...state, activeIndex:conversationIndex})
          //setIsFirstLoad(false);
          //setTimeout(() => handleOpenConversation(conversationIndex, true) , 1500)
        } else {
          onLastNativeNotification();
        }
      } else {
        integration
          .getMessageByIdInfo(location?.state?.messageId, null)
          .then((newMessage: any) => {
            console.log("getMessageByIdInfo newMessage:", newMessage);
            let conversationIndex = props.messages.findIndex(
              (conversation: any) =>
                conversation.id === location?.state?.conversationId
            );
            console.log(
              "getMessageByIdInfo conversationIndex:",
              conversationIndex
            );
            updateConversation(newMessage, conversationIndex);
          });
      }
    }

    console.log("3-useEffect EXIT");
  }, [lastNativeNotification]);

  useEffect(() => {
    console.log("4-useEffect ENTER");
    console.log("----props.match?.params?.id ", props.match?.params?.id);

    console.log(
      "4-useEffect props.match?.params?.id ",
      props.match?.params?.id,
      " prevParamConversationId ",
      prevParamConversationId
    );

    if (prevParamConversationId !== props.match?.params?.id) {
      console.log("1-useEffect calling onNewConversationOpen ...");

      onNewConversationOpen(props.match?.params?.id);
      onMessageChange(true, props.match?.params?.id);
    }
  }, [props.match?.params?.id]);

  const onLastNativeNotification = () => {
    console.log(
      "onLastNativeNotification lastNativeNotification" +
        !lastNativeNotification +
        " lastNativeNotification, ...",
      JSON.stringify(lastNativeNotification)
    );
    console.log(
      "onLastNativeNotification location?.state?.data ",
      location?.state?.data
    );

    let newMessage: any = {};
    let conversationIndex;
    let isConversationNotSelected = false;
    if (lastNativeNotification) {
      console.log("onLastNativeNotification new notification");
      let tempConversationList = state.conversationList;
      if (
        state.conversationList.length === 0 &&
        getCurrentConversation().length > 0
      ) {
        tempConversationList = getCurrentConversation();
      }
      if (lastNativeNotification?.actionId) {
        conversationIndex = tempConversationList.findIndex(
          (conversation: any) =>
            conversation.id === lastNativeNotification.data.conversationId
        );
        console.log(
          "onLastNativeNotification  lastNativeNotification?.actionId ",
          lastNativeNotification?.actionId,
          " conversationIndex ",
          conversationIndex
        );
      }
      console.log(
        "onLastNativeNotification isString?" +
          typeof lastNativeNotification?.data
      );

      let foundMessage = false;
      if (tempConversationList?.length > 0 && conversationIndex > -1) {
        foundMessage = tempConversationList[conversationIndex].messages.find(
          (message: any) => {
            return message.id === lastNativeNotification?.data?.id;
          }
        );
      }
      // if there is conversation selected just add the message
      if (state?.activeIndex > -1) {
        if (!foundMessage) {
          if (typeof lastNativeNotification?.data === "string") {
            newMessage = {
              ...lastNativeNotification,
            };
          } else {
            newMessage = {
              ...lastNativeNotification.data,
            };
          }

          if (newMessage?.newConversationId) {
            newMessage.conversationId = newMessage?.newConversationId;
          }
        } else {
          console.log("Message already in the list.");
        }
      } else if (conversationIndex && conversationIndex > -1) {
        // works when the conversation is clicked from notification
        props.fetchMessages(
          state.tenantId,
          props.messages,
          conversationIndex,
          lastNativeNotification.data.conversationId
        );
      } else {
        //
        isConversationNotSelected = true;
        if (typeof lastNativeNotification?.data === "string") {
          newMessage = {
            ...lastNativeNotification,
          };
        } else {
          newMessage = {
            ...lastNativeNotification.data,
          };
        }

        if (newMessage?.newConversationId) {
          newMessage.conversationId = newMessage?.newConversationId;
        }
      }
    } else if (location?.state?.data) {
      console.log(
        "onLastNativeNotification location?.state?.data ",
        location?.state?.data
      );

      if (state.activeIndex < 0) {
        let tempConversationList = state.conversationList;
        if (
          state.conversationList.length === 0 &&
          getCurrentConversation().length > 0
        ) {
          tempConversationList = getCurrentConversation();
        }
        conversationIndex = tempConversationList.findIndex(
          (conversation: any) =>
            conversation.id === location?.state?.conversationId
        );
      }

      newMessage = {
        ...location?.state?.data,
      };
    } else {
      console.warn("No new message found cant't proceed");
      return;
    }

    //store.set("MESSAGE_" + lastNativeNotification.data.id, lastNativeNotification);

    console.log(
      "onLastNativeNotification step 2 newMessage ",
      JSON.stringify(newMessage)
    );

    //newMessage["content"] = lastNativeNotification.body;
    console.log(
      "onLastNativeNotification step 3 newMessage ",
      JSON.stringify(newMessage)
    );

    let newMessageArray = [];
    newMessageArray.push(newMessage);
    console.log(
      "onLastNativeNotification pushNotificationReceived newMessageArray ",
      JSON.stringify(newMessageArray)
    );
    console.log("isConversationNotSelected ", isConversationNotSelected);
    if (isConversationNotSelected) {
      updateConversation(newMessageArray, undefined);
    } else {
      updateConversation(newMessageArray, conversationIndex);
    }
  };

  const onNewConversationOpen = (_conversationId: any) => {
    console.log(
      "3-useEffect message-page props.match?.params ",
      props.match,
      " props.match?.params?.id ",
      props.match?.params?.id
    );

    if (_conversationId) {
      let conversationId = _conversationId;
      loadCachedConversation(conversationId).then((value) => {});
      updateMessages();
      manageConversationListener();
    }
  };

  const handleOnChangeConversation = () => {
    if (replyNotificationView) {
      setReplyNotificationView(false);
    }
    if (state.activeIndex > -1 && state.conversationList?.length > 0) {
      console.log(
        "handleOnChangeConversation state.conversationList[state.activeIndex] ",
        state.conversationList[state.activeIndex]
      );
      if (
        state.conversationList[state.activeIndex]?.imageKey &&
        state.conversationList[state.activeIndex]?.imageKey.length > 0
      ) {
        getProfilePhotoInfo(
          state.conversationList[state.activeIndex]?.imageKey,
          state.conversationList[state.activeIndex]?.location
        );
      }

      store.create().then((_storeValue: any) => {
        store
          .get(state.conversationList[state.activeIndex].id)
          .then((conversation: any) => {
            if (conversation != null && conversation.isNew) {
              setState({ ...state, messageList: [] });

              store.remove(state.conversationList[state.activeIndex].id);
            } else if (conversation != null && !conversation.isNew) {
              setState({ ...state, messageList: [] });

              handleLoadMoreMessages(
                state.conversationList[state.activeIndex].id,
                state.activeIndex
              );
              store.remove(state.conversationList[state.activeIndex].id);
            }
            console.log(
              "2-useEffect state.activeIndex conversation ",
              conversation
            );
          });
      });
    }
  };

  const handleOnLoadChangeCache = () => {
    console.log("Enter handleOnLoadChangeCache");

    props.fetchConversation();
    //setState({ ...state, userLogonId:_userLogonId , tenantId: _tenantId })
    store.create().then(async (storeResults: any) => {
      store.get(CACHE_USER_LOGIN_ROLE_NAME).then((roleName: any) => {
        setCurrentRoleName(roleName);

        if (roleName === "Student" || roleName === "Parent") {
          integration.listContactForEveryone(null).then((contacts: any) => {
            if (contacts.items) {
              setStudentOrParentContactList(contacts.items);
            }
          });
        }
      });
    });
    console.log("Exit handleOnLoadChangeCache");
  };

  const onMessageChange = (
    isNewMessageById: boolean,
    conversationId: any = undefined
  ) => {
    console.log(
      "Enter onMessageChange state.activeIndex ",
      state.activeIndex,
      " isNewMessageById ",
      isNewMessageById,
      " conversationId ",
      conversationId
    );
    if (props?.messages?.length > 0) {
      let conversations = props.messages;

      if (state.activeIndex > -1) {
        conversations[state.activeIndex].unread = 0;
      }

      let newState: any = {
        conversationList: [...conversations],
      };

      if (props.messages[state.activeIndex]?.messages) {
        console.log(
          "onMessageChange props.messages[state.activeIndex]  : ",
          JSON.stringify(props.messages[state.activeIndex])
        );

        console.log(
          "onMessageChange [props.messages]  props.messages[state.activeIndex]?.messages : ",
          JSON.stringify(props.messages[state.activeIndex]?.messages)
        );

        console.log(
          "onMessageChange [props.messages]  props.messages[state.activeIndex]?.messageNextToken : ",
          JSON.stringify(props.messages[state.activeIndex]?.messageNextToken)
        );
        newState.messageList = [...props.messages[state.activeIndex]?.messages];
        newState.messageNextToken =
          props.messages[state.activeIndex]?.messageNextToken;
      }

      if (isNewMessageById && conversationId) {
        let conversationIndex = props.messages.findIndex(
          (conversation: any) => conversation.id === conversationId
        );
        newState.activeIndex = conversationIndex;
        console.log(
          "onMessageChange newState.activeIndex ",
          newState.activeIndex
        );
        setState({ ...state, activeIndex: conversationIndex });
      }
      setState({ ...state, ...newState });

      setTimeout(
        () =>
          $("#ud-message-container").scrollTop(
            $("#ud-message-container")[0]?.scrollHeight
          ),
        1000
      );
      manageConversationListener();
    }
    console.log("Exit onMessageChange");
  };

  useComponentDidMount(() => {
    //console.log("Component did mount!");
  });

  useComponentDidUpdate(() => {
    //console.log("Component did update!");
  });

  useComponentDidUpdate(() => {
    //console.log("myProp did update!");
  }, [props]);

  useComponentWillUnmount(() => {
    console.log("------Component will unmount!-----");
  });

  const manageConversationListener = () => {
    console.log(
      "manageConversationListener props?.messages?.length ",
      props?.messages?.length
    );
    if (props?.messages?.length < 1) {
      return;
    }

    if (props?.messages?.length > 0) {
      store.create().then((storeValue: any) => {
        store.get("LISTENED_CONVERSATION").then((_lisConversations: any) => {
          // conversation listener listenerConversations ", lisConversations)
          let lisConversations = null;
          try {
            lisConversations = JSON.parse(_lisConversations);
          } catch (error) {
            console.log("lisConversations error ", error);
          }
          if (lisConversations === null) {
            try {
              let listeners = handleListenMessageChange();
              if (Object.keys(listeners).length > 0) {
                store.set(
                  "LISTENED_CONVERSATION",
                  JSON.stringify([
                    {
                      conversationId:
                        state.conversationList[state.activeIndex]?.id,
                      timestamp: new Date(),
                      listeners,
                    },
                  ])
                );
                console.log(
                  "ConversationListener: Added listener of conversation Id ",
                  state.conversationList[state.activeIndex]?.id
                );
              }
            } catch (error) {
              console.warn(
                "ConversationListener: Error with creating conversation listener"
              );
            }
          } else {
            let lisIndex = lisConversations.findIndex(
              (conver: any) => conver.conversationId === props?.conversation?.id
            );
            if (lisIndex > -1) {
              // let registerTimestamp = lisConversations[lisIndex].timestamp;
              // let currentTimestamp:any = new Date();
              // let lapsedTimeInMinutes = (currentTimestamp - registerTimestamp)/60000;
              // console.log("lapsedTimeInMinutes ",  lapsedTimeInMinutes);

              // if(lapsedTimeInMinutes > 2){
              //     // clear all listener ensure that there is always one listener
              //     for(let index=0; index < lisConversations.length; index++){
              //         lisConversations[index]?.listeners?.conversationListener.unsubscribe();
              //         lisConversations[index]?.listeners?.sessionListener.unsubscribe();
              //     }
              let listeners = handleListenMessageChange();

              if (Object.keys(listeners).length > 0) {
                store.remove("LISTENED_CONVERSATION");
                store.set(
                  "LISTENED_CONVERSATION",
                  JSON.stringify([
                    ...lisConversations,
                    {
                      conversationId:
                        state.conversationList[state.activeIndex]?.id,
                      timestamp: new Date(),
                      listeners,
                    },
                  ])
                );
                console.log(
                  "ConversationListener: Added listener of conversation Id ",
                  state.conversationList[state.activeIndex]?.id
                );
              }

              // }else{
              //     console.log("ConversationListener: Conversation already added");
              // }
            }
            // else{
            //     try{
            //         // clear all listener ensure that there is always one listener

            //         for(let index=0; index < lisConversations.length; index++){
            //             lisConversations[index]?.listeners?.conversationListener.unsubscribe();
            //             lisConversations[index]?.listeners?.sessionListener.unsubscribe();
            //         }
            //         let listeners = handleListenMessageChange();
            //         if(Object.keys(listeners).length > 0){
            //             store.remove("LISTENED_CONVERSATION");
            //             store.set("LISTENED_CONVERSATION", JSON.stringify([{conversationId:state.conversationList[state.activeIndex]?.id, timestamp:new Date(), listeners}]) );
            //             console.log("ConversationListener: Added listener of conversation Id ", state.conversationList[state.activeIndex]?.id);
            //         }
            //     }catch(error){
            //         console.warn("ConversationListener: Error with creating conversation listener");
            //     }
            // }
          }
        });
        //store.set("LISTENED_CONVERSATION", [] );
        //handleListenMessageChange();
      });
    }
  };
  const handleListenMessageChange = () => {
    let retVal = {};
    try {
      console.log("handleListenMessageChange");
      if (
        state.conversationList[state.activeIndex]?.id &&
        state.conversationList[state.activeIndex]?.id !== undefined
      ) {
        let conversationListener = integration
          .onMessageByConversationIdInfo(
            state.conversationList[state.activeIndex]?.id,
            (value: any) => {
              console.log(
                "onMessageByConversationIdInfo value.message ",
                value.message
              );
              try {
                //console.log("onMessageByConversationIdInfo props.conversation ", props.conversation);
                if (
                  value.message.messageLevel === "reply" ||
                  value.message.conversationType === "member_to_group"
                ) {
                  console.log(
                    "onMessageByConversationIdInfo message is a reply can't process "
                  );

                  return;
                }
                let activeConversation =
                  state.conversationList[state.activeIndex];
                let foundMessage;
                let msgIndex = -1;
                if (activeConversation?.messages) {
                  foundMessage = activeConversation.messages.find(
                    (message: any) => message.id === value.message.id
                  );
                  msgIndex = activeConversation.messages.findIndex(
                    (message: any) => message.id === value.message.id
                  );

                  //console.log("onMessageByConversationIdInfo foundMessage :", foundMessage);
                  //console.log("onMessageByConversationIdInfo msgIndex ", msgIndex);
                }

                let isBroadcast = activeConversation?.isBroadcast;

                //console.log("onMessageByConversationIdInfo msgIndex ",msgIndex, " activeConversation ",activeConversation.messages.length," isBroadcast " ,isBroadcast, "***");
                console.log(
                  "onMessageByConversationIdInfo foundMessage :",
                  foundMessage
                );

                if (!foundMessage) {
                  //console.log("onMessageByConversationIdInfo ADDING NEW Message");
                  if (
                    value.message.stage === "queued" &&
                    userLoginId !== value.message.createdByUserId
                  ) {
                    //console.log("onMessageByConversationIdInfo send open event");
                    integration
                      .createOpenMessageEventInfo(
                        uuid(),
                        value.message.id,
                        "anyone"
                      )
                      .then((value: any) => {
                        integration
                          .updateMessageStageOpen(value.message.id)
                          .then((retValue: any) => {});
                      });
                  }
                  msgIndex = activeConversation.messages.length;
                  toMessageObjectUI(
                    value.message,
                    null,
                    isBroadcast,
                    null
                  ).then((value) => {
                    activeConversation.messages[msgIndex] = value;
                    //console.log("onMessageByConversationIdInfo activeConversation ", activeConversation);
                    //console.log("onMessageByConversationIdInfo conversationList ", conversationList);

                    onConversationListChange(state.conversationList, undefined);
                  });
                } else {
                  //console.log("onMessageByConversationIdInfo *** UPDATE Message STATUS ", value.message.stage);

                  //console.log("onMessageByConversationIdInfo value.message ", value.message , " foundMessage ", foundMessage);
                  //console.log("onMessageByConversationIdInfo foundMessage.status ", foundMessage.status, " value.message.stage ", value.message.stage)
                  let currentStage = MESSAGE_STAGES[foundMessage.status];
                  let newStage = MESSAGE_STAGES[value.message.stage];
                  //console.log("onMessageByConversationIdInfo currentStage ", currentStage, " newStage ", newStage);

                  if (newStage > currentStage) {
                    //console.log("onMessageByConversationIdInfo updating currentStage ", currentStage, " to newStage ", newStage);

                    toMessageObjectUI(
                      value.message,
                      null,
                      isBroadcast,
                      null
                    ).then((value) => {
                      activeConversation.messages[msgIndex] = value;
                      //console.log("onMessageByConversationIdInfo activeConversation ", activeConversation);
                      //console.log("onMessageByConversationIdInfo conversationList ", conversationList);

                      onConversationListChange(
                        state.conversationList,
                        undefined
                      );
                    });
                  } else {
                    //console.log("onMessageByConversationIdInfo NOT update required currentStage ", currentStage, " to newStage ", newStage);
                  }
                }
              } catch (errorMsg: any) {
                console.error(
                  "onMessageByConversationIdInfo 1 errorMsg",
                  errorMsg
                );
                if (
                  errorMsg?.error?.errors?.length > 0 &&
                  errorMsg?.error?.errors[0].message === "Connection closed"
                ) {
                  console.log(
                    "onMessageByConversationIdInfo clear all LISTENED_CONVERSATION"
                  );

                  store.create().then((storeValue: any) => {
                    store.set("LISTENED_CONVERSATION", []).then((l: any) => l);
                  });
                }
              }
              // toMessageObjectUI(value.message, null,false).then(value=>{
              //     props.conversation.messages.push(value);
              //     props.state.conversationList[props.index] = props.conversation;
              //     props.onConversationListChange(props.conversationList.slice())
              // });
              // }
            }
          )
          .catch(({ provider, errorMsg }) => {
            console.error("onMessageByConversationIdInfo 2 errorMsg", errorMsg);
            if (
              errorMsg?.error?.errors?.length > 0 &&
              errorMsg?.error?.errors[0].message === "Connection closed"
            ) {
              console.log(
                "onMessageByConversationIdInfo clear all LISTENED_CONVERSATION"
              );

              store.create().then((storeValue: any) => {
                store.set("LISTENED_CONVERSATION", []).then((l: any) => l);
              });
            }
          });
        //console.log("onSessionEventByUserIdInfo props ", props);
        let sessionListener = integration.onSessionEventByUserIdInfo(
          props.userLogonId,
          (value: any) => {
            //console.log("onSessionEventByUserId value ", value);
          }
        );
        retVal = {
          conversationListener,
          sessionListener,
        };
      } else {
        //console.log("handleListenMessageChange CAN NOT LISTEN TO ", state.conversationList[state.activeIndex]?.id);
      }
    } catch (error) {
      console.log(
        "handleListenMessageChange onMessageByConversationIdInfo error ",
        error
      );
      try {
        console.log(
          "handleListenMessageChange stopped listening ",
          props.conversation.id
        );
        store.create().then((storeValue: any) => {
          store
            .remove(props.conversation.id)
            .then((lisConversations: any) => {});
        });
      } catch (errorRemove) {
        console.log("handleListenMessageChange errorRemove ", errorRemove);
      }
    }

    return retVal;
  };

  const createInterval = () => {
    let newInterval = setInterval(async () => {
      console.log(
        "Listener running Internal window.location ",
        window?.location
      );
      if (window?.location?.pathname?.indexOf("messaging") < 0) {
        console.log("clearing Internal listenerInterval ", listenerInterval);
        clearInterval(newInterval);
        setListenerInterval(null);
        return;
      }

      await store.create().then(() => {
        updateMessages();
      });

      let intervalLastRun = await store.get("INTERVAL_LAST_RUN");
      if (intervalLastRun && intervalLastRun != null) {
        console.log("Checking INTERVAL_LAST_RUN ", intervalLastRun);
        let currentTimestamp: any = new Date();
        console.log("Checking currentTimestamp ", currentTimestamp);

        let lapsedTimeInMinutes = (currentTimestamp - intervalLastRun) / 60000;
        console.log("lapsedTimeInMinutes ", lapsedTimeInMinutes, "");
        if (lapsedTimeInMinutes < 1 || lapsedTimeInMinutes > 3) {
          clearInterval(newInterval);
          setListenerInterval(null);
          console.log("INTERVAL_LAST_RUN cleared Interval");
          await store.set("INTERVAL_LAST_RUN", new Date());
        }
      } else {
        await store.set("INTERVAL_LAST_RUN", new Date());
      }

      if (
        props?.messages?.length > 0 &&
        props.messages[state.activeIndex]?.id &&
        props.messages[state.activeIndex]?.id !== undefined
      ) {
        console.log("invoked manageConversationListener");
        manageConversationListener();
      } else {
        console.log(
          "cant invoke manageConversationListener due to props?.messages?.length ",
          props?.messages?.length,
          " state.activeIndex ",
          state.activeIndex
        );
      }
    }, 120000);

    return newInterval;
  };

  const getProfilePhotoInfo = async (imageKey: string, location: string) => {
    await store.create();
    let cachedData = await store.get(imageKey);
    if (cachedData && cachedData != null) {
      setAvatar(URL.createObjectURL(cachedData));
    } else {
      integration
        .getProfilePhotoThumbnailInfo(imageKey, location, null)
        .then((thumbNailData: any) => {
          store.set(imageKey, thumbNailData).then((value: any) => {});
          setAvatar(URL.createObjectURL(thumbNailData));
        })
        .catch((error) => {
          console.log(
            "error with fetch imageKey ",
            imageKey,
            " at location ",
            location
          );
        });
    }
  };

  // useEffect(() => {
  //     if(isPrinciple){
  //         getRoles()
  //     }else{
  //         getContactList()
  //     }
  // }, [])

  const updateMessages = async () => {
    await store.create();

    store.forEach((value: any, key: any, index: any) => {
      // console.log("key  ", key ," value ", value, " index ", index );
      // console.log("key.indexOf(MESSAGE_)  ", key.indexOf("MESSAGE_") );

      if (key.indexOf("MESSAGE_") > -1) {
        let messageId = key.split("_")[1];
        console.log("focus messageId ", messageId);
        store.remove(key).then((removedItem: any) => {
          console.log("removedItem ", removedItem);
        });
        integration
          .getMessageByIdInfo(messageId, null)
          .then((newMessage: any) => {
            console.log("focus newMessage ", newMessage);
            updateConversation(newMessage, undefined);
          });
      }
    });
  };
  const updateConversation = (newMessage: any, conversationIndex: any) => {
    console.log("updateConversation newMessage:", JSON.stringify(newMessage));
    console.log("updateConversation state :", state);
    console.log(
      "updateConversation state.conversationList :",
      state.conversationList
    );
    console.log(
      "updateConversation conversationList :",
      state.conversationList.length
    );
    console.log(
      "updateConversation getCurrentConversation :",
      getCurrentConversation()
    );
    console.log(
      "updateConversation getCurrentConversation.length :",
      getCurrentConversation().length
    );

    console.log(
      "updateConversation props.messages length:",
      props.messages.length
    );
    let isConversationFound = false;
    let latestConversationList = state.conversationList;
    if (
      state.conversationList.length === 0 &&
      getCurrentConversation().length > 0
    ) {
      latestConversationList = getCurrentConversation();
    }
    console.log(
      "updateConversation latestConversationList :",
      latestConversationList
    );

    for (let index = 0; index < latestConversationList.length; index++) {
      let foundMessage;
      console.log(
        "focus latestConversationList[index] :",
        latestConversationList[index]
      );
      if (latestConversationList[index].id === newMessage[0].conversationId) {
        isConversationFound = true;
        foundMessage = latestConversationList[index].messages.find(
          (message: any) => {
            return message.id === newMessage[0].id;
          }
        );
        if (!foundMessage) {
          toMessageObjectUI(
            newMessage[0],
            null,
            newMessage[0]?.isGroupConversation,
            null
          ).then((value: any) => {
            console.log("toMessageObjectUI value ", JSON.stringify(value));
            console.log(
              "toMessageObjectUI latestConversationListindex].messages before ",
              latestConversationList[index].messages
            );
            latestConversationList[index].messages.push(value);

            console.log(
              "toMessageObjectUI latestConversationList[index].messages after ",
              latestConversationList[index].messages
            );

            onConversationListChange(
              latestConversationList.slice(),
              conversationIndex
            );
          });
        }
      }
    }
    if (!isConversationFound) {
      console.log(
        "No pre-existing conversations. A specific conversation will be collected"
      );

      let promiseConversationAndMessage = [];

      promiseConversationAndMessage.push(
        integration.listChatConversationByIdInfo(newMessage[0].conversationId)
      );

      //promiseConversationAndMessage.push(integration.getMessageByConversationId(tenantId, newMessage[0].conversationId, undefined, "topic"))
      Promise.all(promiseConversationAndMessage).then(
        (conversationAndMessage) => {
          let conversationModel: any = {};
          conversationModel["items"] = conversationAndMessage[0];

          toConversationUI(conversationModel).then(
            (uiConversationModel: any) => {
              console.log(
                "toConversationUI uiConversationModel ",
                uiConversationModel
              );
              toMessageObjectUI(newMessage[0], null, false, null).then(
                (value: any) => {
                  uiConversationModel[0]["messages"] = [value];

                  let newConversationList = [];
                  if (state.conversationList.length > 0) {
                    newConversationList = [
                      ...state.conversationList,
                      ...uiConversationModel,
                    ];
                  } else {
                    newConversationList = uiConversationModel;
                  }

                  props.conversationsSetData(newConversationList);

                  //setState({ ...state,...newState});
                }
              );
            }
          );
        }
      );
    }
  };

  const getContactList = () => {
    // listContactForEveryone
    integration.listContactForEveryone(null).then((contacts: any) => {
      console.log("Conversation List", contacts);
    });
  };

  const getCurrentConversation = () => {
    return props.messages;
  };

  const getConversations = async () => {
    console.log("******getConversations ");
    // await store.create();
    // let tenantIdTemp = await store.get(TENANT_ID);
    // let logonUser = await store.get(CACHE_USER_LOGIN_ID);
    // setUserLogonId(logonUser);

    props.fetchConversation();
    // integration.listChatConversationsInfo(id ? id : userLogonId).then((conversation: any) => {
    //     toConversationUI(conversation).then(values => {
    //         console.log('getConversations-Conversation List', values);
    //         setConversationList([...values]);
    //     });
    // })
  };

  const onConversationListChange = (
    updatedConversations: any,
    _conversationIndex: any
  ) => {
    console.log(
      "onConversationListChange updatedConversations ",
      updatedConversations,
      " _conversationIndex ",
      _conversationIndex
    );
    console.log(
      "onConversationListChange updatedConversations  state.activeIndex ",
      state.activeIndex
    );
    let conversationIndex = state.activeIndex;

    if (state.activeIndex < 0 && lastNativeNotification) {
      conversationIndex = state.conversationList.findIndex(
        (conversation: any) =>
          conversation.id === lastNativeNotification.data.conversationId
      );
      updatedConversations[conversationIndex] = {
        ...updatedConversations[conversationIndex],
        unread: updatedConversations[conversationIndex]?.unread + 1,
      };
    }
    if (_conversationIndex) {
      conversationIndex = _conversationIndex;
    }
    let newState: any = {
      conversationList: [...updatedConversations],
      messageList: [...updatedConversations[conversationIndex]?.messages],
    };
    if (_conversationIndex !== undefined) {
      newState.activeIndex = _conversationIndex;
    }
    console.log("onConversationListChange newState ", JSON.stringify(newState));

    setState({ ...state, ...newState });
    setTimeout(
      () =>
        $("#ud-message-container").scrollTop(
          $("#ud-message-container")[0]?.scrollHeight
        ),
      1000
    );
  };

  const deleteMessageInConversation = (conversationId: any, messageId: any) => {
    let conversationIndex = state.conversationList.findIndex(
      (conversation: any) => conversation.id === conversationId
    );
    let conversation = state.conversationList[conversationIndex];
    let messageIndex = conversation.messages.findIndex(
      (message: any) => message.id === messageId
    );
    conversation.messages.splice(messageIndex, 1);
    let values = state.conversationList.slice();
    setState({
      ...state,
      conversationList: values,
      messageList: values[state.activeIndex]?.messages,
    });
  };

  // const getRoles = () => {
  //     integration.getUserRoles(null).then(async (res: any) => {
  //         console.log("Roles", res);
  //         formatData(res.items);
  //     });
  //     // integration.listAllGroups().then(async (res: any) => {
  //     //     console.log('listAllGroups', res)
  //     // })
  // };

  const formatData = async (data: any[]) => {
    cascadeRawData = data;
    await data.forEach(
      async (item: any, index: number) => await getChildren(item, index)
    );
    //// setCascadeData(cascadeRawData)
  };

  const getChildren = (event: any, index: number) => {
    switch (event.roleName) {
      case "Student":
        getGrades(event.roleName, index);
        break;
      case "Teacher":
        getGrades(event.roleName, index);
        break;
      case "Principal":
        console.log("Principal", event);
        break;
      default:
        console.log("Something went wrong! " + event.roleName);
        break;
    }
  };
  const handleSelect = (event: any) => {};

  const getGrades = (role: string, index: number) => {
    integration.getGrades(undefined).then(async (res: any) => {
      // if(data[index]){
      cascadeRawData[index].children = res?.items;
      cascadeRawData[index].children.forEach((g: any, gradeIndex: number) => {
        g.roleName = g.gradeName;
        listClassNamesByGradeIdInfo(g, gradeIndex, index, role);
      });
      setUpdater(Math.random().toString());
      // setCascadeData(cascadeRawData)
      // }
    });
  };
  const listClassNamesByGradeIdInfo = (
    grade: any,
    gradeIndex: number,
    roleIndex: number,
    role: any
  ) => {
    integration
      .listClassNamesByGradeIdInfo(grade.id, null)
      .then(async (res: any) => {
        if (res?.items) {
          cascadeRawData[roleIndex].children[gradeIndex].children = res?.items;
          setCascadeData(cascadeRawData);
          setUpdater(Math.random().toString());
          await res?.items.forEach((g: any, classIndex: number) => {
            g.roleName = g.className;
            getClassDetails(role, g, roleIndex, gradeIndex, classIndex);
          });
          // }
        }
      });
    // .catch(error=>console.log(error))
  };

  const getClassDetails = (
    role: any,
    classData: any,
    roleIndex: number,
    gradeIndex: number,
    classIndex: number
  ) => {
    integration
      .listClassNamesByGradeIdInfo(classData.id, null)
      .then((res: any) => {
        if (res?.items) {
          res?.items.forEach((g: any) => (g.roleName = g.className));
          cascadeRawData[roleIndex].children[gradeIndex].children[
            classIndex
          ].children = res?.items;
          console.log(res);
          // getClassList(role.id,classData.id,roleIndex, gradeIndex, classIndex)
          setCascadeData(cascadeRawData);
          setUpdater(Math.random().toString());
        }
      });
  };
  //getUserByRoleAndClassInfo    in case of student ClassLsit function
  const getClassList = (
    roleId: string,
    classId: string,
    roleIndex: number,
    gradeIndex: number,
    classIndex: number
  ) => {
    integration
      .getUserByRoleAndClassInfo(roleId, classId, null)
      .then((res: any) => {
        if (res?.items) {
          res?.items.forEach((g: any) => (g.roleName = g.className));
          cascadeRawData[roleIndex].children[gradeIndex].children[
            classIndex
          ].children = res?.items;
          setCascadeData(cascadeRawData);
          setUpdater(Math.random().toString());
        }
      });
  };

  const createGroupHandler = () => {
    let createdByUserId = userLoginId;

    // params
    // tenantIDs,groupName, groupMembers,groupAdminUsers,

    integration
      .createGroupInfo(
        uuid(),
        conversationName,
        [...selectedValues, createdByUserId],
        [createdByUserId],
        null
      )
      .then((res: any) => {
        console.log("Create Group Info !!!", res);
        integration
          .createConversationInfo(
            uuid(),
            isPrinciple ? "member_to_group" : "member_to_member",
            createdByUserId,
            res.id
          )
          .then((res: any) => {
            console.log("Create Conversaation !!", res);
            setConversationName("");
            setSelectedValue([]);
            getConversations();
          });
        //createConversationInfo
      });
  };
  //  export const createConversationInfo = async (tenantId,conversationType,userId, receiptUserOrGroupId  )

  const searchChatConversationsInfo = (text: string) => {
    if (text.length >= 3) {
      setSearchLoading(true);
      let searchResults: any[] = [];
      console.log("searchChatConversationsInfo text ", text);
      integration.searchConversationsInfo(text, async (resp: any) => {
        console.log(resp, "===>>");
        if (Array.isArray(resp?.items)) {
          const values = await toConversationUI(resp);
          searchResults = [...searchResults, ...values];
        }
        setState({ ...state, conversationList: searchResults });

        setSearchLoading(false);
      });
    } else {
      setState({ ...state, conversationList: [...props.messages] });
    }
  };
  const searchMessages = (text: string) => {
    if (text.length >= 3) {
      const filteredMessages = state.messageList?.filter((msg: any) =>
        msg.text?.toLowerCase()?.includes(text.toLocaleLowerCase())
      );

      setState({ ...state, messageList: [...filteredMessages] });
    } else {
      setState({
        ...state,
        messageList: [...props.messages[state.activeIndex]?.messages],
      });
    }
  };
  const handleOpenConversation = (
    index: number,
    isResetMessageNextToken: boolean
  ) => {
    console.log(
      "Enter handleOpenConversation index ",
      index,
      " isResetMessageNextToken ",
      isResetMessageNextToken
    );

    let newState = {
      activeIndex: index,
      messageList: getCurrentConversation()[index]?.messages,
      messageNextToken: !isResetMessageNextToken
        ? undefined
        : getCurrentConversation()[index]?.messageNextToken,
      selectedMessage: null,
    };

    setState({ ...state, ...newState });
    console.log("----handleOpenConversation newState ", newState);

    console.log(
      "----handleOpenConversation getCurrentConversation()[index]?.messages ",
      getCurrentConversation()[index]?.messages
    );
    console.log(
      "----handleOpenConversation getCurrentConversation() ",
      getCurrentConversation()
    );
    console.log(
      "----handleOpenConversation getCurrentConversation()[index]?.id ",
      getCurrentConversation()[index]?.id
    );

    handleLoadMoreMessages(getCurrentConversation()[index]?.id, index);
    console.log("Exit handleOpenConversation");
  };
  const updateMessageContent = (messageId: string, newMessage: string) => {
    console.log(messageId, newMessage);

    var index = state.messageList.findIndex((i: any) => i.id === messageId);
    state.messageList[index].text = newMessage;
    setState({ ...state, messageList: [...state.messageList] });
  };
  const handlePagination = async () => {
    try {
      const { nextToken, total, pageNumber, totalNumberOfPages } = props.tokens;

      await props.fetchMoreConversation(nextToken);
    } catch (err) {
    } finally {
    }
  };
  const handleLoadMoreMessages = async (
    conversationId: string,
    activeIndex: any
  ) => {
    console.log(
      "[message-page.tsx] handleLoadMoreMessages conversationId ",
      conversationId,
      " messageNextToken ",
      messageNextToken,
      "activeIndex ",
      activeIndex
    );
    let currentConversationList = getCurrentConversation();
    currentConversationList[activeIndex].messageNextToken = undefined;

    props.fetchMessages(
      state.tenantId,
      state.conversationList?.length > 0
        ? state.conversationList
        : currentConversationList,
      activeIndex,
      conversationId
    );

    // if(messageNextToken!=null || messageNextToken === undefined ){
    //     const resp = await integration.getMessageByConversationId(conversationId, messageNextToken);
    //     if (Array.isArray(resp?.items)) {
    //         let messages: any = await toMessageUI(resp, false);
    //         let allMessages: any[] = [...messageList, ...messages];
    //         const sortedMessages = allMessages.sort((a: any, b: any) => {
    //             ////console.log("toMessageUI sortedMessage b.createdAt " ,b.createdAt , " a.createdAt ", a.createdAt);
    //             if (a?.createdAt) {
    //                 return a.createdAt.localeCompare(b.createdAt);
    //             } else {
    //                 return false;
    //             }
    //         });
    //         console.log("handleLoadMoreMessages sortedMessages ", sortedMessages);

    //         setMessageList([...sortedMessages]);
    //     }
    //     console.log("handleLoadMoreMessages resp ", resp);
    //     setMessageNextToken(resp.nextToken);
    // }
  };
  const handleCreateConversation = async (otherUserId: any, contact: any) => {
    try {
      console.log("handleCreateConversation otherUserId ", otherUserId);

      await store.create();

      let conversationId = uuid();
      const resp = await integration.createConversationInfo(
        conversationId,
        "member_to_member",
        otherUserId,
        userLoginId
      );

      resp.receiptUser = [contact];
      console.log(
        "handleCreateConversation is conversation new ",
        resp.id === conversationId
      );

      if (resp.id === conversationId) {
        resp.messages = { items: [] };
      }
      console.log("handleCreateConversation resp ", resp);

      await store.set(resp.id, {
        item: resp,
        isNew: resp.id === conversationId,
      });

      if (isParentOrStudentView()) {
        history.push(`/lmessaging/${resp.id}`);
      } else {
        history.push(`/messaging/${resp.id}`);
      }
      console.log("handleCreateConversation resp ", resp);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const isParentOrStudentView = () => {
    return currentRoleName === "Student" || currentRoleName === "Parent";
  };

  const loadCachedConversation = async (conversationId: string) => {
    let conversationIndex = props.messages.findIndex(
      (conversation: any) => conversation.id === conversationId
    );
    if (conversationIndex > -1) {
      setState({ ...state, activeIndex: conversationIndex });
    } else {
      props.fetchConversation();
      setState({ ...state, activeIndex: 0 });
    }
  };

  const handleHasMoreMessages = () => {
    console.log(
      ">>>>>handleHasMoreMessages return ",
      messageNextToken === undefined || messageNextToken != null
    );
    console.log(
      ">>>>>handleHasMoreMessages lastNativeNotification ",
      messageNextToken === undefined || messageNextToken != null
    );

    if (lastNativeNotification !== prevLastNativeNotification) {
      onLastNativeNotification();
    }
    return messageNextToken === undefined || messageNextToken != null;
  };
  const handleHasMoreConversations = () => {
    console.log("handleHasMoreConversations props.tokens ", props.tokens);

    const { nextToken, total, pageNumber, totalNumberOfPages } = props.tokens;

    // if(isFirstLoad ){
    //     console.log("It is the first load collect conversations");
    //     return false;
    // }else
    if (nextToken < totalNumberOfPages) {
      console.log("nextToken is less collect more pages ");
      return true;
    } else {
      console.log("No more pages ");
      return false;
    }
  };

  return (
    <>
      <div
        onLoad={() => {
          //console.log("onLoad isFirstLoad ", isFirstLoad)
          //if(isFirstLoad){
          //console.log("useEffect currentRoleName isFirstLoad ", isFirstLoad);
          //setisFirstLoad(false);
          //}
        }}
      >
        <Grid fluid className="message-page">
          <Row className="show-grid">
            {(!mobile ||
              (mobile && !state.conversationList[state.activeIndex])) && (
              <Col lg={8} md={8} xs={24}>
                <div className="search-header">
                  {mobile &&
                    currentRoleName !== "Student" &&
                    currentRoleName !== "Parent" && (
                      <CreateConversation />

                      // <CasCaderComponent
                      //     conversationName={conversationName}
                      //     createGroupHandler={createGroupHandler}
                      //     setConversationName={setConversationName}
                      // />
                    )}
                  {mobile &&
                    (currentRoleName === "Student" ||
                      currentRoleName === "Parent") && (
                      // <MultiCascader placeholder="+ New Massage" childrenKey='groupMembers' labelKey='groupName'  data={cascadeData} />
                      // <MultiCascader renderExtraFooter={() => <CaseCaderFooter />} onChange={(e) => { setSelectedValue(e) }} value={selectedValues} onClose={() => createGroupHandler()} menuWidth={220} childrenKey='children' onSelect={(event) => handleSelect(event)} valueKey='id' placeholder="+ New Massage" labelKey='roleName' data={cascadeData} />
                      // <MultiCascader renderExtraFooter={() => <CaseCaderFooter conversationName={conversationName} createGroupHandler={createGroupHandler} setConversationName={setConversationName} />} onChange={(e) => { setSelectedValue(e) }} value={selectedValues} menuWidth={220} childrenKey='children' onSelect={(event) => handleSelect(event)} valueKey='id' placeholder="+ New Massage" labelKey='roleName' data={cascadeData} />
                      <Dropdown
                        color="green"
                        appearance="ghost"
                        title="+ New Message"
                        onChange={() => console.log("clicked + New Message")}
                      >
                        {studentOrParentContactList.map(
                          (contact: any, i: number) => {
                            return (
                              <Dropdown.Item
                                key={i}
                                onClick={() =>
                                  handleCreateConversation(contact.id, contact)
                                }
                              >
                                <IonImg
                                  src={
                                    contact?.userRole?.roleName === "Student"
                                      ? "/assets/learner.png"
                                      : contact?.userRole?.roleName === "Parent"
                                      ? "/assets/familyOne.png"
                                      : "/assets/teacher.png"
                                  }
                                  className="groupAdminsIcon"
                                  style={{
                                    width: "10%",
                                    margin: "0 12px",
                                    verticalAlign: "middle",
                                  }}
                                />
                                {contact.firstName} {contact.lastName}{" "}
                                <span className="text-success">
                                  <b>
                                    {contact?.userRole?.roleName
                                      ? contact?.userRole?.roleName
                                      : ""}
                                  </b>
                                </span>
                              </Dropdown.Item>
                            );
                          }
                        )}
                      </Dropdown>
                    )}
                  <InputGroup className="search-input-message">
                    <Input
                      onKeyUp={(event: any) =>
                        searchChatConversationsInfo(event.target.value)
                      }
                      placeholder="Search"
                    />
                    <InputGroup.Addon>
                      {searchLoading ? (
                        <IonSpinner name="dots" color="#000" />
                      ) : (
                        <Icon icon="search" />
                      )}
                    </InputGroup.Addon>
                  </InputGroup>
                </div>
                {props.loading && (
                  <p style={{ color: "#28ba62", marginBottom: 10 }}>
                    Fetching messages...
                  </p>
                )}
                {/* <InfiniteScroll
                                    pageStart={0}
                                    loadMore={() => handlePagination()}
                                    hasMore={
                                        true
                                    }
                                    loader={
                                        <div style={{ textAlign: "center", padding: 10 }}>
                                            <IonSpinner
                                                name="bubbles"
                                                style={{ transform: "scale(1.5)" }}
                                                color="dark"
                                            />
                                        </div>
                                    }
                                    useWindow={false}
                                // getScrollParent={() => this.scrollParentRef}
                                > */}
                <div
                  id="conversationDiv"
                  className="conversation-list my-scrollbar"
                >
                  <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={async () => {
                      console.log(
                        "contactsTable loadMore data ... isFirstLoad ",
                        isFirstLoad,
                        " userLoginId ",
                        userLoginId
                      );
                      if (isFirstLoad) {
                        console.log("contactsTable isFirstLoad ", isFirstLoad);
                        props.fetchConversation();

                        //setisFirstLoad(false);
                      } else {
                        handlePagination();
                      }
                    }}
                    hasMore={handleHasMoreConversations()}
                    loader={
                      <>
                        {isInfiniteFirstLoad && (
                          <div style={{ textAlign: "center", padding: 10 }}>
                            <IonSpinner
                              name="bubbles"
                              style={{ transform: "scale(1.5)" }}
                              color="success"
                            />
                          </div>
                        )}
                      </>
                    }
                    ref={conversationScrollRef}
                    useWindow={false}
                    // getScrollParent={() => scrollParentRef}
                  >
                    {state.conversationList.map(
                      (conversation: any, index: number) =>
                        conversation?.id ? (
                          <Conversation
                            index={index}
                            key={conversation.id}
                            openConversation={(index: number) =>
                              handleOpenConversation(index, false)
                            }
                            active={index == state.activeIndex}
                            conversation={conversation}
                            conversationList={state.conversationList}
                            onConversationListChange={onConversationListChange}
                            deleteMessageInConversation={
                              deleteMessageInConversation
                            }
                            userLogonId={state.userLogonId}
                          />
                        ) : (
                          "Loading messages..."
                        )
                    )}
                  </InfiniteScroll>
                </div>
                {/* </InfiniteScroll> */}
              </Col>
            )}
            {(!mobile ||
              (mobile && state.conversationList[state.activeIndex])) && (
              <Col lg={16} md={16} xs={24}>
                {replyNotificationView && (
                  <>
                    <ReplyNotification
                      conversationList={state.conversationList}
                      onConversationListChange={onConversationListChange}
                      conversation={state.conversationList[state.activeIndex]}
                      activeIndex={state.activeIndex}
                      setReplyMessageId={setReplyMessageId}
                      replyMessageId={replyMessageId}
                      setReplyNotificationView={setReplyNotificationView}
                      messageId={messageId}
                    />
                  </>
                )}

                {!replyNotificationView && (
                  <div className="conversation-detail" key={updater}>
                    {/* <Button color="green" appearance="ghost" ><Icon icon="plus" /> New Massage</Button> */}
                    {!mobile &&
                      currentRoleName !== "Student" &&
                      currentRoleName !== "Parent" && (
                        // <MultiCascader placeholder="+ New Massage" childrenKey='groupMembers' labelKey='groupName'  data={cascadeData} />
                        // <MultiCascader renderExtraFooter={() => <CaseCaderFooter />} onChange={(e) => { setSelectedValue(e) }} value={selectedValues} onClose={() => createGroupHandler()} menuWidth={220} childrenKey='children' onSelect={(event) => handleSelect(event)} valueKey='id' placeholder="+ New Massage" labelKey='roleName' data={cascadeData} />
                        // <MultiCascader renderExtraFooter={() => <CaseCaderFooter conversationName={conversationName} createGroupHandler={createGroupHandler} setConversationName={setConversationName} />} onChange={(e) => { setSelectedValue(e) }} value={selectedValues} menuWidth={220} childrenKey='children' onSelect={(event) => handleSelect(event)} valueKey='id' placeholder="+ New Massage" labelKey='roleName' data={cascadeData} />
                        <CreateConversation />
                      )}
                    {!mobile &&
                      (currentRoleName === "Student" ||
                        currentRoleName === "Parent") && (
                        // <MultiCascader placeholder="+ New Massage" childrenKey='groupMembers' labelKey='groupName'  data={cascadeData} />
                        // <MultiCascader renderExtraFooter={() => <CaseCaderFooter />} onChange={(e) => { setSelectedValue(e) }} value={selectedValues} onClose={() => createGroupHandler()} menuWidth={220} childrenKey='children' onSelect={(event) => handleSelect(event)} valueKey='id' placeholder="+ New Massage" labelKey='roleName' data={cascadeData} />
                        // <MultiCascader renderExtraFooter={() => <CaseCaderFooter conversationName={conversationName} createGroupHandler={createGroupHandler} setConversationName={setConversationName} />} onChange={(e) => { setSelectedValue(e) }} value={selectedValues} menuWidth={220} childrenKey='children' onSelect={(event) => handleSelect(event)} valueKey='id' placeholder="+ New Massage" labelKey='roleName' data={cascadeData} />
                        <Dropdown
                          color="green"
                          appearance="ghost"
                          title="+ New Message"
                          onChange={() => console.log("clicked + New Message")}
                        >
                          {studentOrParentContactList.map(
                            (contact: any, i: number) => {
                              return (
                                <Dropdown.Item
                                  key={i}
                                  onClick={() =>
                                    handleCreateConversation(
                                      contact.id,
                                      contact
                                    )
                                  }
                                >
                                  <IonImg
                                    src={
                                      contact?.userRole?.roleName === "Student"
                                        ? "/assets/learner.png"
                                        : contact?.userRole?.roleName ===
                                          "Parent"
                                        ? "/assets/familyOne.png"
                                        : "/assets/teacher.png"
                                    }
                                    className="groupAdminsIcon"
                                    style={{
                                      width: "15%",
                                      margin: "0 12px",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  {contact.firstName} {contact.lastName}{" "}
                                  <span className="text-success">
                                    <b>
                                      {contact?.userRole?.roleName
                                        ? contact?.userRole?.roleName
                                        : ""}
                                    </b>
                                  </span>
                                </Dropdown.Item>
                              );
                            }
                          )}
                        </Dropdown>
                      )}
                    {state.conversationList[state.activeIndex] && (
                      <div className={`${mobile ? "mobile" : ""} message-body`}>
                        <div className="header-block">
                          {mobile && (
                            <Icon
                              onClick={() => {
                                setState({ ...state, activeIndex: -1 });
                              }}
                              className="back-btn"
                              icon="chevron-left"
                              style={{ color: "#777" }}
                            />
                          )}
                          <div className="user-detail">
                            <Avatar
                              circle
                              src={avatar}
                              size="md"
                              alt={state.conversationList[
                                state.activeIndex
                              ]?.name
                                ?.toString()
                                ?.substr(0, 1)}
                            >
                              {state.conversationList[state.activeIndex].avatar
                                ? ""
                                : state.conversationList[
                                    state.activeIndex
                                  ]?.name
                                    ?.toString()
                                    ?.substr(0, 1)}
                            </Avatar>
                            <h2 className="name">
                              {state.conversationList[state.activeIndex].name}
                            </h2>
                          </div>
                          {!mobile && (
                            // <Icon icon='search' style={{ color: '#777' }} />
                            <InputGroup
                              className="search-input-message"
                              style={{ width: "30%" }}
                            >
                              <Input
                                onKeyUp={(event: any) =>
                                  searchMessages(event.target.value)
                                }
                                placeholder="Search"
                              />
                              <InputGroup.Addon>
                                {messageSearchLoading ? (
                                  <IonSpinner name="dots" color="#000" />
                                ) : (
                                  <Icon icon="search" />
                                )}
                              </InputGroup.Addon>
                            </InputGroup>
                          )}
                        </div>
                        <div
                          className="message-content-block my-scrollbar"
                          id="ud-message-container"
                        >
                          <InfiniteScroll
                            initialLoad={true}
                            pageStart={0}
                            isReverse={true}
                            loadMore={() => {
                              console.log("loadMore Messages ... ");
                              handleLoadMoreMessages(
                                state.conversationList[state.activeIndex].id,
                                state.activeIndex
                              );
                            }}
                            hasMore={handleHasMoreMessages()}
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
                            <div className="message-list clearfix">
                              {state.messageList?.map(
                                (message: any, index: number) =>
                                  Object.keys(message) ? (
                                    <MessageComponent
                                      conversation={
                                        state.conversationList[
                                          state.activeIndex
                                        ]
                                      }
                                      conversationList={state.conversationList}
                                      onConversationListChange={
                                        onConversationListChange
                                      }
                                      getConversations={getConversations}
                                      key={`${message.type}_${index}`}
                                      message={message}
                                      setMessageId={setMessageId}
                                      setSelectedMessage={setSelectedMessage}
                                      activeIndex={state.activeIndex}
                                      conversationId={
                                        state.conversationList[
                                          state.activeIndex
                                        ].id
                                      }
                                      index={index}
                                      setReplyNotificationView={
                                        setReplyNotificationView
                                      }
                                      setReplyMessageId={setReplyMessageId}
                                      replyMessageId={replyMessageId}
                                      deleteMessage={(
                                        conversationId: any,
                                        messageId: any
                                      ) => {
                                        console.log(
                                          "deleteMessage conversationId ",
                                          conversationId,
                                          " messageId ",
                                          messageId
                                        );
                                        deleteMessageInConversation(
                                          conversationId,
                                          messageId
                                        );
                                      }}
                                    />
                                  ) : (
                                    "No Message"
                                  )
                              )}
                            </div>
                          </InfiniteScroll>
                        </div>
                        {state.conversationList[state.activeIndex]
                          ?.isBroadcast &&
                          state.conversationList[state.activeIndex]
                            ?.isGroupAdminUser && (
                            <ChatControls
                              onConversationListChange={
                                onConversationListChange
                              }
                              conversationList={state.conversationList}
                              conversation={
                                state.conversationList[state.activeIndex]
                              }
                              activeIndex={state.activeIndex}
                              selectedMessage={selectedMessage}
                              setSelectedMessage={setSelectedMessage}
                              onUpdateMessage={(
                                messageId: string,
                                newMessage: string
                              ) => {
                                console.log(newMessage);
                                updateMessageContent(messageId, newMessage);
                              }}
                            />
                          )}
                        {!state.conversationList[state.activeIndex]
                          ?.isBroadcast && (
                          <ChatControls
                            onConversationListChange={onConversationListChange}
                            conversationList={state.conversationList}
                            conversation={
                              state.conversationList[state.activeIndex]
                            }
                            activeIndex={state.activeIndex}
                            selectedMessage={selectedMessage}
                            setSelectedMessage={setSelectedMessage}
                            onUpdateMessage={(
                              messageId: string,
                              newMessage: string
                            ) => {
                              console.log(newMessage);
                              updateMessageContent(messageId, newMessage);
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Col>
            )}
          </Row>
        </Grid>
      </div>
    </>
  );
};
const CaseCaderFooter = (props: any) => {
  return (
    <>
      <InputGroup inside color="green">
        <Input
          placeholder="Name"
          value={props.conversationName}
          onChange={(value) => props.setConversationName(value)}
        />
        <InputGroup.Button
          onClick={() => props.createGroupHandler()}
          color="green"
        >
          <Icon icon="plus" />
        </InputGroup.Button>
      </InputGroup>
    </>
  );
};
const mapStateToProps = (state: any) => ({
  messages: state.messages.messages,
  loading: state.messages.loading,
  tokens: state.messages.tokens,
});
const mapDispatchToProps = {
  fetchConversation,
  fetchMoreConversation,
  fetchMessages,
  conversationsSetData,
};
export default connect(mapStateToProps, mapDispatchToProps)(Message);
