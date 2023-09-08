import { useEffect, useState, useCallback, useRef } from "react";
import { Capacitor } from "@capacitor/core";

import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Dropdown,
  Icon,
  IconButton,
  Input,
  Progress,
} from "rsuite";
import { Storage } from "@ionic/storage";
import useRecorder from "../useRecorder/useRecorder";
import { v4 as uuid } from "uuid";
import * as integration from "scholarpresent-integration";

import {
  CACHE_USER_LOGIN_ID,
  TENANT_ID,
  CACHE_USER_LOGIN_ROLE_NAME,
  CACHE_COGNITO_CURRENT_USER,
  CACHE_USER_PROFILE_FULL_NAME,
} from "../../../utils/StorageUtil";
import {
  addMessageToConversation,
  toConversationUI,
} from "../../../utils/DataMapping";
import Picker from "emoji-picker-react";

// const fs = require("browserify-fs");

const ChatControls = (props: any) => {
  const { Line } = Progress;
  const store = new Storage();
  const fileUploader = useRef(null);

  let [showMenu, setShowMenu] = useState(false);
  let [progress, setProgress] = useState(0);

  let [message, setMessage] = useState("");
  let [caption, setCaption] = useState("");
  let [loadingEdit, setLoadingEdit] = useState(false);
  const [userLogonRoleName, setUserLogonRoleName] = useState<string>("Parent");

  let [
    audioFile,
    audioURL,
    isRecording,
    timer,
    startRecording,
    stopRecording,
    resetRecording,
    setAudioURL,
  ] = useRecorder() as any;

  let tenantId: string;
  let userLoginId: string;
  let userFullName: string;

  store.create().then((storeResults) => {
    store
      .get(CACHE_USER_LOGIN_ID)
      .then((cachedUserLoginId: any) => (userLoginId = cachedUserLoginId));
    store
      .get(TENANT_ID)
      .then((cachedTenantId: any) => (tenantId = cachedTenantId));
    store
      .get(CACHE_USER_PROFILE_FULL_NAME)
      .then((cachedUserFullName: any) => (userFullName = cachedUserFullName));
    handleUserRole();
  });
  const handleUserRole = async () => {
    await store.create();
    setUserLogonRoleName(await store.get(CACHE_USER_LOGIN_ROLE_NAME));
  };
  useEffect(() => {
    console.log("progress ", progress);
  }, [progress, fileUploader]);

  const reset = () => {
    document.getElementById("resetRecorder")?.click();
  };

  const isParentOrStudentView = () => {
    return userLogonRoleName === "Student" || userLogonRoleName === "Parent";
  };

  const openUploader = () => {
    // document.getElementById('fileUpload')?.click()
    // @ts-ignore
    fileUploader?.current?.click();

    console.log("[chat-controls] openUploader ");
  };
  const uploadFileHandler = (e: any) => {
    console.log("[chat-controls] uploadFileHandler ", e);
    sendFileMessage(e.target.files[0]);
  };
  const calculateProgress = (value: any) => {
    let percent = (value.loaded / value.total) * 100;
    setProgress(parseInt(percent.toString()));
    if (percent === 100) {
      setTimeout(() => {
        setProgress(0);
      }, 2000);
    }
  };

  const sendFileMessage = async (file: File) => {
    console.log("SENT FILE :");

    // params
    // messageId, tenantId,messageContent+messageId,conversationId, userLogonId,channelType,fileContents,filePath
    let createdAt = new Date().toISOString();
    let id = uuid();
    let fileContents = file;
    console.log("fileContents :", fileContents);
    console.log("currentUser :", store.get(CACHE_COGNITO_CURRENT_USER));
    let currentUser: any = await store.get(CACHE_COGNITO_CURRENT_USER);

    if (file) {
      let messageContent = file.name;
      console.log("sendFileMessage  messageContent :", messageContent);
      let nameArr = file.name.split(".");
      let extention = nameArr[nameArr.length - 1];
      setMessage("");
      let location = currentUser?.id;
      if (props.messageType === "reply") {
        let conversationId = props.replyMessage?.conversationId;
        let uploadRes = await integration.createMessageWithAttachmentInfo(
          id,
          messageContent,
          conversationId,
          props.replyMessage?.id,
          userLoginId,
          "anyone",
          fileContents,
          extention,
          location,
          (value: any) => {
            calculateProgress(value);
          }
        );
        props.onReplyListUpdate(uploadRes);
        console.log(uploadRes);
      } else {
        let conversationId = props.conversation.id;
        let uploadRes = await integration.createMessageWithAttachmentInfo(
          id,
          messageContent,
          conversationId,
          null,
          userLoginId,
          "anyone",
          fileContents,
          extention,
          location,
          (value: any) => {
            calculateProgress(value);
          }
        );
        let msg_id = uuid();
        let conversationList = await addMessageToConversation(
          props.conversationList,
          conversationId,
          msg_id,
          message,
          userLoginId,
          "anyone",
          createdAt,
          uploadRes,
          fileContents,
          props.conversation?.isBroadcast,
          uploadRes.stage,
          "",
          userLogonRoleName,
          userFullName
        );
        props.onConversationListChange(conversationList);
      }
    }
    // console.log("uploadRes ", uploadRes)
    // let getUrl = await integration.getAttachmentURLInfo(id + `.${extention}`);
    // console.log("getAttachmentURLInfo - getUrl :", getUrl);
  };
  const sendVoiceMessage = async () => {
    // params
    // messageId, tenantId,messageContent+messageId,conversationId, userLogonId,channelType,fileContents,filePath
    let createdAt = new Date().toISOString();
    console.log("sendVoiceMessage props.conversation :", props.conversation);
    let conversationId = null;
    if (props.conversation) {
      conversationId = props.conversation.id;
    } else {
      conversationId = props.conversationId;
    }
    let id = uuid();
    let filePath = new Date().getMilliseconds();
    let fileContents = audioFile;
    setMessage("");
    console.log("fileContents :", fileContents);
    console.log("conversationId ", conversationId);
    let currentUser = await store.get(CACHE_COGNITO_CURRENT_USER);
    let location = currentUser?.id;
    if (props.messageType === "reply") {
      let conversationId = props.replyMessage?.conversationId;
      let uploadRes = await integration.createMessageWithAttachmentInfo(
        id,
        caption,
        conversationId,
        props.replyMessage?.id,
        userLoginId,
        "anyone",
        fileContents,
        "webm",
        location,
        (value: any) => {
          calculateProgress(value);
        }
      );
      props.onReplyListUpdate(uploadRes);
      setAudioURL("");
      resetRecording();
      console.log(uploadRes);
    } else {
      console.log("***** fileContents ", fileContents);
      console.log("currentUser :", await store.get(CACHE_COGNITO_CURRENT_USER));

      let uploadRes = await integration.createMessageWithAttachmentInfo(
        id,
        caption,
        conversationId,
        null,
        userLoginId,
        "anyone",
        fileContents,
        "mp3",
        location,
        (value: any) => calculateProgress(value)
      );
      console.log("uploadRes ", uploadRes);
      setAudioURL("");
      resetRecording();
      let sentUser = await integration.getCurrentUserProfile();

      let msg_idu = uuid();
      let conversationList = await addMessageToConversation(
        props.conversationList,
        conversationId,
        msg_idu,
        caption,
        userLoginId,
        "anyone",
        createdAt,
        uploadRes,
        audioFile,
        props.conversation?.isBroadcast,
        uploadRes.stage,
        "",
        userLogonRoleName,
        userFullName
      );
      props.onConversationListChange(conversationList);
    }
    // let getUrl = await integration.getAttachmentURLInfo(id + ".webm");
    // console.log("getAttachmentURLInfo - getUrl :", getUrl);
  };

  const sendMessage = async (channel: string = "anyone") => {
    console.log("click send button");
    try {
      let messageId = uuid();
      let createdAt = new Date().toISOString();
      console.log("sendMessage props.conversation ", props);
      console.log("sendMessage props.conversationId ", props.conversationId);
      console.log(
        "sendMessage props.conversationList ",
        props.conversationList
      );

      if (props.messageReplyLevel === "top") {
        let messageId = uuid();
        setMessage("");
        let conversationId = props.conversationId;
        let conversationList = await addMessageToConversation(
          props.conversationList,
          conversationId,
          messageId,
          message,
          userLoginId,
          channel,
          createdAt,
          null,
          null,
          props.conversation?.isBroadcast,
          "queued",
          props.replyMessageId,
          userLogonRoleName,
          userFullName
        );
        props.onConversationListChange(conversationList);
        integration
          .createReplyMessageInfo(
            messageId,
            conversationId,
            props.replyMessageId,
            userLoginId,
            channel,
            message
          )
          .then((res: any) => {
            //props.onReplyListUpdate(res);
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else if (props.messageType === "reply") {
        setMessage("");
        let conversationId = props.conversationId;
        let conversationList = await addMessageToConversation(
          props.conversationList,
          conversationId,
          messageId,
          message,
          userLoginId,
          channel,
          createdAt,
          null,
          null,
          props.conversation?.isBroadcast,
          "queued",
          props.replyMessage?.id,
          userLogonRoleName,
          userFullName
        );
        props.onConversationListChange(conversationList);

        integration
          .createReplyMessageInfo(
            messageId,
            conversationId,
            props.replyMessage?.id,
            userLoginId,
            channel,
            message
          )
          .then((res: any) => {
            //props.onReplyListUpdate(res);
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        let conversationId = props.conversation?.id;
        console.log(
          "sendMessage createdAt ",
          createdAt,
          " userLoginId ",
          userLoginId
        );

        let conversationList = await addMessageToConversation(
          props.conversationList,
          conversationId,
          messageId,
          message,
          userLoginId,
          channel,
          createdAt,
          null,
          null,
          props.conversation?.isBroadcast,
          "queued",
          "",
          userLogonRoleName,
          userFullName
        );
        props.onConversationListChange(conversationList);
        setMessage("");
        integration
          .createMessageInfo(messageId, message, conversationId, channel)
          .then((res: any) => {
            console.log("integration.createMessageInfo :", res);
            // props.getConversations()
          })
          .catch((err: any) => {
            console.log("integration.createMessageInfo : err ", err);
          });
      }
      // params
      // id,tenantId,messageContent, conversationId, userLoginId,channelType
    } catch (err) {
      console.log(err);
    }
  };
  const handleCancelEdit = () => {
    props.setSelectedMessage(null);
    setMessage("");
  };
  const handleEditMessage = async () => {
    try {
      setLoadingEdit(true);
      const resp = await integration.updateMessageInfo(
        props.selectedMessage?.id,
        message
      );
      console.log(resp);
      props.onUpdateMessage(props.selectedMessage?.id, message);
      handleCancelEdit();
    } catch (err) {
    } finally {
      setLoadingEdit(false);
    }
  };
  useEffect(() => {
    if (props.selectedMessage?.id) {
      setMessage(props.selectedMessage?.text);
    } else {
      setMessage("");
    }
  }, [props.selectedMessage]);
  return (
    <>
      {progress > 0 && <Line percent={progress} strokeColor="#28ba62" />}
      <div className="chat-controls">
        <Icon
          icon="plus"
          onClick={resetRecording}
          className="hidden"
          id="resetRecorder"
        />
        <div className={`insert-icons ${showMenu ? "large" : ""}`}>
          <Icon
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            icon="plus"
          />
          {showMenu && (
            <>
              <Dropdown
                placement={"topStart"}
                renderTitle={() => {
                  return <Icon icon="smile-o" />;
                }}
              >
                <Picker
                  onEmojiClick={(event, emojiObject) => {
                    console.log(emojiObject);
                    setMessage(`${message} ${emojiObject.emoji}`);
                  }}
                />
              </Dropdown>
              <Icon
                className="cursor-pointer"
                onClick={() => openUploader()}
                icon="attachment"
              />
            </>
          )}
        </div>
        <div className={`text-input ${!showMenu ? "large" : ""}`}>
          <Input
            id="txtMessage"
            placeholder="Type a message"
            value={message}
            onChange={(value) => setMessage(value)}
          />
        </div>

        <div className="send-button">
          {!props.selectedMessage?.id && Capacitor.getPlatform() === "web" && (
            <Icon
              size="lg"
              onClick={(event: any) => {
                console.log("startRecording event ", event);
                startRecording();
              }}
              className="microphone"
              icon="microphone"
            />
          )}
          {console.log(
            "audioURL ",
            audioURL,
            " isRecording ",
            isRecording,
            " AudioFile ",
            audioFile
          )}
          {audioURL && !isRecording ? (
            <div className="recordingList">
              <div className="record">
                <audio src={audioURL} controls></audio>
              </div>
              <div className="control">
                <Input
                  componentClass="textarea"
                  placeholder="Caption"
                  value={caption}
                  onChange={(value) => setCaption(value)}
                />
                <div className="buttons">
                  <Button
                    size="xs"
                    onClick={() => {
                      setAudioURL("");
                      resetRecording();
                    }}
                    color="green"
                    appearance="ghost"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => sendVoiceMessage()}
                    color="green"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            console.log("Dont show send audio dialo")
          )}

          {isRecording && (
            <div className="recordingList recorders">
              <div
                className="recorder"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Icon
                    size="lg"
                    className="microphone microphone-animate"
                    icon="microphone"
                  />
                  <span className="time-counter">{timer}</span>
                </div>
                <div>
                  <span
                    className="time-counter"
                    style={{ color: "#f00", cursor: "pointer" }}
                    onClick={() => {
                      resetRecording();
                    }}
                  >
                    Cancel
                  </span>
                  <span
                    className="time-counter"
                    style={{ color: "#28ba62", cursor: "pointer" }}
                    onClick={() => stopRecording()}
                  >
                    Stop
                  </span>
                </div>
                {/* <Icon size='lg' onClick={stopRecording} icon='pause' /> */}
              </div>
            </div>
          )}
          {props.selectedMessage?.id ? (
            <ButtonToolbar className="send-toolbar">
              <Icon
                size="lg"
                className="microphone"
                icon="times-circle"
                onClick={() => handleCancelEdit()}
              />
              <Icon
                size="lg"
                className="microphone"
                icon="check"
                onClick={() => handleEditMessage()}
              />
            </ButtonToolbar>
          ) : (
            <ButtonToolbar className="send-toolbar">
              <ButtonGroup size="sm">
                <Button
                  color="green"
                  onClick={() => sendMessage()}
                  disabled={message?.length === 0}
                  id="btnSendMessage"
                >
                  Send
                </Button>
                {!isParentOrStudentView() ? (
                  <Dropdown
                    placement="topEnd"
                    renderTitle={() => {
                      return (
                        <IconButton
                          color="green"
                          icon={<Icon icon="caret-down" />}
                        />
                      );
                    }}
                    disabled={message?.length === 0}
                  >
                    <Dropdown.Item onSelect={() => sendMessage("sms")}>
                      <div className="message-medium">
                        <span className="text-success"> Via SMS ONLY</span>
                        <Icon className="text-success" icon="envelope" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown>
                ) : (
                  ""
                )}
              </ButtonGroup>
            </ButtonToolbar>
          )}
        </div>
        <input
          type="file"
          onChange={(e) => uploadFileHandler(e)}
          style={{ display: "none" }}
          ref={fileUploader}
          name=""
        />
      </div>
    </>
  );
};

export default ChatControls;
