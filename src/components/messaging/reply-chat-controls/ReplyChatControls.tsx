import React, { useRef, useState } from "react";
import { Dropdown, Icon, Input, Progress, Button } from "rsuite";
import "./ReplyChatControls.css";
import { v4 as uuid } from "uuid";
import { Storage } from "@ionic/storage";
import {
  CACHE_USER_LOGIN_ID,
  TENANT_ID,
  CACHE_COGNITO_CURRENT_USER,
} from "../../../utils/StorageUtil";
import useRecorder from "../useRecorder/useRecorder";
import Picker from "emoji-picker-react";
import * as integration from "scholarpresent-integration";
const ReplyChatControls = (props: any) => {
  const { Line } = Progress;
  const store = new Storage();

  let tenantId: string;
  let userLoginId: string;

  const fileUploader = useRef<any>(null);
  const dropdownRef = useRef<any>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [errText, setErrText] = useState<string>("");
  let [caption, setCaption] = useState("");
  let [progress, setProgress] = useState(0);
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
  store.create().then((storeResults) => {
    store
      .get(CACHE_USER_LOGIN_ID)
      .then((cachedUserLoginId: any) => (userLoginId = cachedUserLoginId));
    store
      .get(TENANT_ID)
      .then((cachedTenantId: any) => (tenantId = cachedTenantId));
  });

  const handleSendReply = async () => {
    if (replyText?.length > 0) {
      let conversationId = props.conversationId;
      let linkedMessageId = props.messageId;
      let replyMessageId = uuid();
      let channel = "anyone";
      let createdAt = new Date().toISOString();

      console.log("sendMessage createdAt ", createdAt);
      // params
      // id,tenantId,messageContent, conversationId, userLoginId,channelType

      // let conversationList = await addMessageToConversation(props.conversationList, conversationId, messageId, message, userLoginId, channel, createdAt, null)
      // props.onConversationListChange(conversationList);
      // setMessage('');

      integration
        .createReplyMessageInfo(
          replyMessageId,
          conversationId,
          linkedMessageId,
          userLoginId,
          channel,
          replyText
        )
        .then((res: any) => {
          dropdownRef.current.toggle();
          setErrText("");
          setReplyText("");
        })
        .catch((err: any) => {
          setErrText("Something went wrong!");
        });
    } else {
      setErrText("*Enter a message");
    }
  };
  const uploadFileHandler = (e: any) => {
    console.log(e);
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
    // params
    // messageId, tenantId,messageContent+messageId,conversationId, userLogonId,channelType,fileContents,filePath
    let createdAt = new Date().toISOString();
    let conversationId = props.conversationId;
    let id = uuid();
    //let messageContent = replyText;
    let fileContents = file;
    let linkedMessageId = props.messageId;
    console.log("fileContents :", fileContents);
    console.log("conversationId ", conversationId);
    let messageContent = file.name;
    console.log("sendFileMessage  messageContent :", messageContent);
    let nameArr = file.name.split(".");
    let extention = nameArr[nameArr.length - 1];
    let currentUser = await store.get(CACHE_COGNITO_CURRENT_USER);
    let location = currentUser?.id;
    // createMessageWithAttachmentInfo = async(id,tenantId,messageContent, conversationId,
    // 	linkedMessageId, createdByUserId,channelType, attachmentData , extension, callback )
    let uploadRes = await integration.createMessageWithAttachmentInfo(
      id,
      messageContent,
      conversationId,
      linkedMessageId,
      userLoginId,
      "anyone",
      fileContents,
      extention,
      location,
      (value: any) => {
        calculateProgress(value);
      }
    );
    console.log(uploadRes);

    setReplyText("");
  };
  const sendVoiceMessage = async () => {};
  const openUploader = () => {
    fileUploader?.current?.click();
  };
  return (
    <Dropdown
      placement={"bottomStart"}
      renderTitle={() => {
        return <Icon icon="comment-o" />;
      }}
      className="bell-icon"
      ref={dropdownRef}
    >
      <Input
        id="txtReplyMessage"
        placeholder="Type a message"
        value={replyText}
        onChange={(value) => setReplyText(value)}
        className="reply-chat-box"
      />
      {errText?.length > 0 && <small className="err-text">{errText}</small>}
      {console.log(
        " audioURL ",
        audioURL,
        " isRecording ",
        isRecording,
        " audioFile ",
        audioFile
      )}
      {audioURL && !isRecording ? (
        <div className="recordingListReply recorders">
          <div className="record">
            {console.log("audio reply audioURL ", audioURL)}

            <audio src={audioURL.toString()} controls></audio>
          </div>
          <div className="control">
            <Input
              componentClass="textarea"
              placeholder="Caption"
              value={caption}
              onChange={(value) => setCaption(value)}
              style={{ width: "18rem" }}
            />
          </div>
          <div className="buttons" style={{ marginTop: 15 }}>
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
            <Button size="xs" onClick={() => sendVoiceMessage()} color="green">
              Send
            </Button>
          </div>
        </div>
      ) : (
        console.log("Not showing dialog ")
      )}
      {isRecording && (
        <div className="recordingListReply recorders">
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
      <div className="reply-chat-control">
        <div>
          <Icon icon="smile-o" size="lg" className="cursor-pointer" />
          <Icon
            icon="attachment"
            size="lg"
            className="cursor-pointer"
            onClick={() => openUploader()}
          />
          <Icon
            icon="microphone"
            size="lg"
            className="cursor-pointer"
            onClick={(event: any) => {
              console.log("startRecording event ", event);
              startRecording();
            }}
          />
        </div>
        <div>
          <Icon
            icon="check"
            style={{ marginRight: 15 }}
            className="cursor-pointer"
            onClick={() => {
              handleSendReply();
            }}
          />
          <Icon
            icon="close"
            onClick={() => dropdownRef.current.toggle()}
            className="cursor-pointer"
          />
        </div>
      </div>
      <input
        type="file"
        onChange={(e) => uploadFileHandler(e)}
        style={{ display: "none" }}
        ref={fileUploader}
        name=""
      />
    </Dropdown>
  );
};
export default ReplyChatControls;
