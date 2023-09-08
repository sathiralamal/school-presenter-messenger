import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Icon,
  IconButton,
  Modal,
  Input,
  Progress,
} from "rsuite";

import PlayOutlineIcon from "@rsuite/icons/PlayOutline";
import SortDownIcon from "@rsuite/icons/SortDown";
import { Storage } from "@ionic/storage";
import * as integration from "scholarpresent-integration";
import { getAllMethods } from "../../../utils/Utils";
import conversations from "../../../pages/message-page/data";
import {
  CACHE_USER_LOGIN_ID,
  TENANT_ID,
  CACHE_USER_PROFILE_URL,
  CACHE_USER_LOGIN_ROLE_NAME,
} from "../../../utils/StorageUtil";
import "./message-component.css";
import ReplyChatControls from "../reply-chat-controls/ReplyChatControls";
import { v4 as uuid } from "uuid";
import { IonButton, IonIcon, useIonAlert } from "@ionic/react";
import {
  checkmarkOutline,
  checkmarkDoneOutline,
  playOutline,
  playCircleOutline,
} from "ionicons/icons";
import useGetCacheUserId from "../../../hooks/useGetCacheUserId";
import useGetCacheTenantId from "../../../hooks/useGetCacheTenantId";

let currentUser = { avatar: "" };
let recieptAvatar = {};

const fileExtentions: string[] = [
  "txt",
  "rtx",
  "ppt",
  "pptx",
  "doc",
  "csv",
  "xsl",
  "xslx",
  "xlsm",
  "rtf",
  "odt",
  "zip",
  "docx",
  "psd",
];

const MessageComponent = (props: any) => {
  const [present] = useIonAlert();

  const [previewImage, setPreviewImage] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [downloadData, setDownloadData] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [isDownloaded, setIsDownloaded] = useState(false);

  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [userLogonRoleName, setUserLogonRoleName] = useState<string>("Parent");
  const [receiptProfilePhoto, setReceiptProfilePhoto] = useState<string>("");
  const [sentProfilePhoto, setSentProfilePhoto] = useState<string>("");
  let tenantId: string = useGetCacheTenantId();

  const store = new Storage();

  let userLoginId: string = useGetCacheUserId();

  useEffect(() => {
    console.log(
      "useEffect likeCount ",
      likeCount,
      " commentCount ",
      commentCount
    );
  }, [
    receiptProfilePhoto,
    sentProfilePhoto,
    downloadProgress,
    likeCount,
    commentCount,
  ]);
  useEffect(() => {
    console.log("useEffect Entering new Message ", props?.message);

    if (props?.message?.countLike) {
      setLikeCount(props.message.countLike);
    }
    if (props?.message?.countComments) {
      setCommentCount(props.message.countComments);
    }

    store.create().then((storeResults) => {
      //store.get(CACHE_USER_LOGIN_ID).then((cachedUserLoginId: any) => userLoginId = cachedUserLoginId);
      store
        .get(CACHE_USER_PROFILE_URL)
        .then((url: any) => (currentUser.avatar = url));
      handleUserRole();
    });
  }, [props?.message]);

  useEffect(() => {
    console.log(
      "useEffect Collection Image ",
      props.message.imageKey,
      " props.message ",
      props.message
    );

    if (props.message.imageKey && props.message.imageKey.length > 0) {
      const callback = (value: any) => {
        console.log("callback ", value);
        let progress = (value.loaded / value.total) * 100;
        console.log("callback  progress ", progress);
      };
      getProfilePhoto(props.message?.imageKey, props.message?.location);

      // if(props.message.cognitoId){
      //     console.log("getAttachmentThumbnailURLInfo props.message :", props.message );
      //     getProfilePhoto(props.message?.imageKey,props.message?.location)
      // }
    }
  }, [props?.message?.imageKey, props?.message?.location]);

  const handleUserRole = async () => {
    setUserLogonRoleName(await store.get(CACHE_USER_LOGIN_ROLE_NAME));
  };
  const isParentOrStudentView = () => {
    return userLogonRoleName === "Student" || userLogonRoleName === "Parent";
  };
  const scrollIntoView = (id: string) => {
    const elmnt = document.getElementById(id);
    elmnt?.scrollIntoView();
  };
  const toggleModal = (flag = false) => {
    setPreviewImage(flag);
  };

  const imagePreview = (url: string) => {
    setImageUrl(url);
    toggleModal(true);
  };

  const editMessageHandler = () => {
    // editMessageInfo
  };

  const deleteMessageHandler = () => {
    props.deleteMessage(props?.conversationId, props?.message?.id);

    integration.deleteMessageInfo(props?.message?.id).then((res: any) => {
      console.log("Message deleted res :", res);
      // props.getConversations()
    });
  };

  const playAudio = (url: string) => {
    let audio = new Audio(url);
    audio.play();
  };
  const handleLikeClick = async (message: any) => {
    console.log("handleLikeClick message ", message);
    console.log(
      "handleLikeClick Enter props.conversationList ",
      JSON.stringify(props.conversationList)
    );

    let isLiked = props.message?.likedActivities?.filter(
      (likeEvent: any) => likeEvent.userId === userLoginId
    );
    let msgIndex = props.conversationList[props.activeIndex].messages.findIndex(
      (msg: any) => msg.id === message.id
    );
    console.log("handleLikeClick msgIndex ", msgIndex);
    console.log(
      "handleLikeClick props.conversationList[props.activeIndex] ",
      props.conversationList[props.activeIndex]
    );

    if (isLiked && isLiked.length > 0) {
      //already liked > dislike the message
      console.log("handleLikeClick UNLIKE");
      let newLikedActivities = props.conversationList[
        props.activeIndex
      ].messages[msgIndex].likedActivities?.filter(
        (like: any) => like.id !== isLiked[0]?.id
      );
      props.conversationList[props.activeIndex].messages[
        msgIndex
      ].likedActivities = newLikedActivities;
      console.log(
        "handleLikeClick UNLIKE props.conversationList[props.activeIndex] ",
        props.conversationList[props.activeIndex]
      );

      //props.conversationList[props.activeIndex] = props.conversation;
      console.log(
        "handleLikeClick Exit props.conversationList ",
        JSON.stringify(props.conversationList)
      );

      //props.onConversationListChange(props.conversationList);
      setLikeCount((like: number) => {
        console.log(
          "setLikeCount newLikedActivities.length ",
          newLikedActivities.length
        );
        return newLikedActivities.length;
      });
      integration.unLikeMessageInfo(isLiked[0]?.id).then((resp) => {
        console.log("unlikeMessage:", resp);
      });
    } else {
      //like message
      console.log("handleLikeClick LIKE");

      setLikeCount((like: number) => {
        console.log("setLikeCount like ", like);

        return ++like;
      });
      let likeId = uuid();
      if (
        props.conversationList[props.activeIndex].messages[msgIndex]
          ?.likedActivities === undefined
      ) {
        props.conversationList[props.activeIndex].messages[
          msgIndex
        ].likedActivities = [
          {
            activityType: "liked",
            channelType: "anyone",
            id: likeId,
            messageId: props.message.id,
            payload: null,
            tenantIDs: [tenantId],
            userId: userLoginId,
          },
        ];
      } else {
        props.conversationList[props.activeIndex].messages[
          msgIndex
        ].likedActivities.push({
          activityType: "liked",
          channelType: "anyone",
          id: likeId,
          messageId: props.message.id,
          payload: null,
          tenantIDs: [tenantId],
          userId: userLoginId,
        });
      }

      //props.conversationList[props.activeIndex] = props.conversation;
      console.log(
        "handleLikeClick Exit props.conversationList ",
        JSON.stringify(props.conversationList)
      );

      //props.onConversationListChange(props.conversationList);
      integration
        .createMessageLikeInfo(likeId, message.id, "anyone")
        .then((likeMessage) => {
          console.log("likeMessage:", likeMessage);
        });
    }
  };

  const getProfilePhoto = async (imageKey: string, location: string) => {
    console.log(
      "getProfilePhoto imageKey ",
      imageKey,
      " location ",
      location,
      " props.message.type ",
      props.message.type
    );
    console.log(
      "getProfilePhoto props.message ",
      props.message,
      " props.message.type ",
      props.message.type
    );

    await store.create();
    let cachedData = await store.get(imageKey);
    if (cachedData && cachedData != null) {
      if (props.message.type === "received") {
        setReceiptProfilePhoto(URL.createObjectURL(cachedData));
        console.log(
          "getProfilePhoto cachedData receiptProfilePhoto ",
          receiptProfilePhoto
        );
      } else {
        setSentProfilePhoto(URL.createObjectURL(cachedData));
        console.log(
          "getProfilePhoto cachedData sentProfilePhoto ",
          sentProfilePhoto
        );
      }
    } else {
      integration
        .getProfilePhotoThumbnailInfo(imageKey, location, null)
        .then((thumbNailData: any) => {
          console.log(
            "avatar thumbNailData ",
            thumbNailData,
            " props.message.type ",
            props.message.type
          );
          store.set(imageKey, thumbNailData).then((value: any) => {});
          if (props.message.type === "received") {
            setReceiptProfilePhoto(URL.createObjectURL(thumbNailData));
            console.log(
              "getProfilePhoto receiptProfilePhoto ",
              receiptProfilePhoto
            );
          } else {
            setSentProfilePhoto(URL.createObjectURL(thumbNailData));
            console.log("getProfilePhoto sentProfilePhoto ", sentProfilePhoto);
          }
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

  return (
    <>
      <div
        id={`message_${props.message.id}`}
        className={`message ${props.message.type} ${
          props.message?.isBroadcast ? "broadcast-message" : ""
        } ${props.message?.media?.id ? "media-message" : ""}`}
      >
        <small>
          {props.message?.roleName} - {props.message?.userName}
          {" ~ "}
        </small>
        {/* {
                props.message.type === 'broadcastReceived' &&
                <div>
                    {console.log("props.message.type === 'broadcastReceived'")}
                    <div className={props.active ? 'active broadcast-msg-parent' : 'broadcast-msg-parent'}>
                        <div className='header-bar'>
                            <div className='user'>
                                <Avatar src={receiptProfilePhoto} size="md" circle alt={conversations[3]?.name?.toString()?.substr(0, 1)} />
                                <h2 className='name'>Lindsey Rivard [<span className='ion-margin-none role'>{conversations[3].role}</span>]</h2>
                            </div>
                            <div>
                                <span className='date'>{conversations[3].date}</span>
                            </div>
                        </div>
                        <div className='content'>
                            <p>{conversations[3].messages[0].text}</p>
                            <div className='ratings'>
                                <span className='count'>12</span>
                                <Icon icon='good' />
                                <span className='count'>5</span>
                                <Icon icon='comment-o' />
                            </div>
                        </div>
                        <div className="btn-ctrls">
                            <IconButton className='like-button' appearance='ghost' color="green" icon={<Icon icon="good" />}
                                onClick={async (event) => {
                                    let likeMessage = await integration.createMessageLikeInfo(tenantId, userLoginId, props?.message?.id, "anyone")
                                    console.log("Click Like:", likeMessage)
                                    console.log("likeMessage:", likeMessage)

                                }}
                            >Like</IconButton>
                            <IconButton appearance='ghost' color="green" icon={<Icon icon="comment-o" />}
                                onClick={(event) => (console.log("Click Comments"))}>Comment</IconButton>
                        </div>
                    </div>

                </div>
            } */}
        {props.message.type !== "broadcastReceived" && (
          <div>
            {/* {console.log("Avatar props.message.type ", props.message.type)} */}
            <Avatar
              size="sm"
              circle
              src={
                props.message.type === "received"
                  ? receiptProfilePhoto
                  : props.message.type
                  ? sentProfilePhoto
                  : ""
              }
            />
            <div className="text">
              {props?.message?.parentMessage && (
                <p
                  onClick={() =>
                    scrollIntoView(`message_${props.message?.parentMessage.id}`)
                  }
                  className="replyTo"
                >
                  {props.message?.parentMessage?.text}
                </p>
              )}
              {/* { console.log("props.message?.media ", props.message?.media ," props.message?.media?.type == 'jpg' ", props.message?.media?.type == 'jpg' )} */}
              {props.message.text}
              {props.message?.media && (
                <div>
                  {(props.message?.media?.type == "png" ||
                    props.message?.media?.type == "jpg" ||
                    props.message?.media?.type == "jpeg" ||
                    props.message?.media?.type == "jfif" ||
                    props.message?.media?.type == "gif" ||
                    props.message?.media?.type == "svg") && (
                    <img
                      onClick={() =>
                        imagePreview(
                          props.message?.media?.url instanceof File ||
                            props.message?.media?.url instanceof Blob
                            ? URL.createObjectURL(props.message?.media?.url)
                            : ""
                        )
                      }
                      src={
                        props.message?.media?.url instanceof File ||
                        props.message?.media?.url instanceof Blob
                          ? URL.createObjectURL(props.message?.media?.url)
                          : ""
                      }
                    />
                  )}

                  {props.message?.media?.type == "mp3" && (
                    <div>
                      {/* <img onClick={() => playAudio(props.message?.media?.url)} src='assets/play.svg' alt='play' /> */}

                      {isDownloaded ? (
                        <audio
                          src={downloadData}
                          controls
                          className="audio-message"
                        ></audio>
                      ) : (
                        <>
                          <IconButton
                            size="lg"
                            onClick={async () => {
                              console.log(
                                "Downloading...",
                                props.message?.media
                              );
                              const callback = (value: any) => {
                                console.log(
                                  "Download Percentage ",
                                  (value.loaded / value.total) * 100
                                );
                                let percentage =
                                  (value.loaded / value.total) * 100;
                                setDownloadProgress(
                                  Math.round(percentage * 10) / 10
                                );
                              };
                              //let attachment = await integration.getAttachmentInfo(props.message?.media.key,props.message?.media.location , callback );
                              let audioUrl =
                                await integration.getAttachmentURLInfo(
                                  props.message?.media.key,
                                  props.message?.media.location
                                );
                              console.log("audioUrl ", audioUrl);

                              setIsDownloaded(true);
                              // let blob = new Blob([attachment], {type: value.value.mimeType});

                              // let blob = new Blob(attachment, {
                              //     type:"data:audio/mpeg"
                              // })
                              // const text = await new Response(attachment).text()
                              // console.log("downloaded audio text ", await attachment.text());

                              setDownloadData(audioUrl);
                            }}
                          >
                            <PlayOutlineIcon />{" "}
                            {downloadProgress >= 0
                              ? "Download"
                              : downloadProgress}
                          </IconButton>

                          {/* <Button onClick={async() => {
                                            console.log("Downloading...", props.message?.media); 
                                            const callback=(value:any)=>{
                                                console.log("Download Document ", value);
                                            }
                                            let attachment = await integration.getAttachmentInfo(props.message?.media.key,props.message?.media.location , callback );
                                            setIsDownloaded(true);
                                            // let blob = new Blob([attachment], {type: value.value.mimeType});

                                            // let blob = new Blob(attachment, {
                                            //     type:"data:audio/webm"
                                            // })
                                            const text = await new Response(attachment).text()
                                            console.log("downloaded audio text ", await attachment.text());
                                            setDownloadData(await attachment.text());
                                            
                                              
                                            
                                            }}>Download</Button> */}
                        </>
                      )}
                    </div>
                  )}
                  {/* {console.log("props.message.type != 'image' ", props.message.type != 'image')} */}

                  {/* {console.log("props.message?.media?.type == pdf ", props.message?.media?.type == "pdf")} */}
                  {/* {console.log("fileExtentions.includes(props.message?.media?.type) ", fileExtentions.includes(props.message?.media?.type))}  */}

                  {props.message?.media?.type != "image" && (
                    <>
                      <Dropdown
                        placement={
                          props.message.type == "received"
                            ? "leftStart"
                            : "rightStart"
                        }
                        renderTitle={() => {
                          return (
                            <div>
                              {props.message?.media?.type === "pdf" && (
                                <img
                                  height="120"
                                  src="assets/pdf.svg"
                                  alt={props.message?.media?.type}
                                />
                              )}
                              {props.message?.media?.extension !== "pdf" &&
                                fileExtentions.includes(
                                  props.message?.media?.type
                                ) && (
                                  <img
                                    height="120"
                                    src="assets/file.svg"
                                    alt={props.message?.media?.type}
                                  />
                                )}
                            </div>
                          );
                        }}
                      >
                        <Dropdown.Item>
                          <div className="pdf-options">
                            <Button
                              color="green"
                              size="xs"
                              onClick={async () => {
                                console.log("Open...", props.message?.media);
                                const callback = (value: any) => {
                                  console.log(
                                    "Open Download Percentage ",
                                    (value.loaded / value.total) * 100
                                  );
                                  let percentage =
                                    (value.loaded / value.total) * 100;
                                  //setDownloadProgress(Math.round(percentage * 10) / 10 );
                                };
                                let downloadUrl =
                                  await integration.getAttachmentURLInfo(
                                    props.message?.media.key,
                                    props.message?.media.location
                                  );
                                window.open(downloadUrl, "_blank");
                              }}
                            >
                              Open
                            </Button>
                            <Button
                              onClick={async () => {
                                console.log(
                                  "Downloading...",
                                  props.message?.media
                                );
                                const callback = (value: any) => {
                                  console.log(
                                    "Download Percentage ",
                                    (value.loaded / value.total) * 100
                                  );
                                  let percentage =
                                    (value.loaded / value.total) * 100;
                                  //setDownloadProgress(Math.round(percentage * 10) / 10 );
                                };
                                let downloadUrl =
                                  await integration.getAttachmentURLInfo(
                                    props.message?.media.key,
                                    props.message?.media.location
                                  );
                                window.open(downloadUrl, "_blank");
                              }}
                              download
                              color="green"
                              size="xs"
                            >
                              Download
                            </Button>
                          </div>
                        </Dropdown.Item>
                      </Dropdown>
                    </>
                  )}
                </div>
              )}
              {props.message?.isBroadcast && (
                <div className="unread-reply-broadcast">
                  {/* {console.log(" props.message?.isBroadcast ", props.message )} */}
                  <div className="notification-header">
                    <Icon className="bell-icon" icon="bell" />
                    <Button
                      onClick={() => {
                        props.setReplyNotificationView(true);
                        props.setReplyMessageId(props?.message?.id);
                        props.setMessageId(props?.message?.id);
                      }}
                      size="xs"
                      color="green"
                    >
                      View Replies
                    </Button>
                    <span>
                      <IconButton
                        className="like-button"
                        appearance="subtle"
                        color="green"
                        icon={<Icon icon="good" />}
                        onClick={(event) => {
                          handleLikeClick(props?.message);
                        }}
                      ></IconButton>
                      <span className="count">
                        {likeCount > 0 ? likeCount : ""}
                      </span>

                      {/* <Icon className='bell-icon' icon="thumbs-o-up" /> */}
                    </span>
                    <span>
                      <IconButton
                        className="bell-icon"
                        appearance="subtle"
                        color="green"
                        icon={<Icon icon="comment-o" />}
                        onClick={(event) => {
                          props.setReplyNotificationView(true);
                          props.setReplyMessageId(props?.message?.id);
                          props.setMessageId(props?.message?.id);
                        }}
                      ></IconButton>
                      {/* <ReplyChatControls 
                                            messageId={props?.message?.id}
                                            conversationId={props?.conversationId}
                                        /> */}
                      <span className="count">
                        {commentCount > 0 ? commentCount : ""}
                      </span>
                      {/*  <Icon className='bell-icon' icon="comment-o" /> */}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="timebox">
              {props.message?.createdByUserId === userLoginId &&
                (props.message?.status === undefined ||
                  props.message?.status === "queued" ||
                  props.message?.status === "distributed") && (
                  <IonIcon icon={checkmarkOutline} style={{ fontSize: 18 }} />
                )}
              {props.message?.createdByUserId === userLoginId &&
                props.message?.status === "received" && (
                  <IonIcon
                    icon={checkmarkDoneOutline}
                    style={{ fontSize: 18 }}
                  />
                )}
              {props.message?.status === "error" && (
                <Icon icon={"times-circle-o"} />
              )}
              {props.message?.createdByUserId === userLoginId &&
                props.message?.status === "opened" && (
                  <IonIcon
                    icon={checkmarkDoneOutline}
                    style={{ fontSize: 18, color: "#1675e0" }}
                  />
                )}
              {/* <Icon icon={props.message?.deliveryStatus === 'read' ? 'eye' : 'times-circle-o'} /> */}
              <span className="time">{props.message.time}</span>
            </div>
            {/* {
                        props.message?.replay &&
                        <div className="unread-reply clearfix">
                            <div className='notification-header'>
                                <Icon className='bell-icon' icon="bell-o" />
                                <label className='title'>Reply Notifications</label>
                            </div>
                            <div className='notification-content'>
                                <p className='count'>{props.message?.replay?.count} unread replies</p>
                                <Button onClick={() => { props.setReplyNotificationView(true) }} size='xs' color="green">Reply</Button>
                            </div>
                        </div>
                    } */}
            {props.message.type !== "received" ? (
              <>
                <Dropdown
                  className="message-options"
                  placement="leftStart"
                  renderTitle={() => {
                    return <Icon icon="ellipsis-v" />;
                  }}
                >
                  <Dropdown.Item
                    onClick={() => props.setSelectedMessage(props.message)}
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => deleteMessageHandler()}>
                    Delete
                  </Dropdown.Item>

                  {!isParentOrStudentView() ? (
                    <Dropdown.Item>Mute Replies</Dropdown.Item>
                  ) : (
                    ""
                  )}
                </Dropdown>
              </>
            ) : (
              ""
            )}
          </div>
        )}

        <Modal
          size="xs"
          className="imagePreview"
          show={previewImage}
          onHide={() => toggleModal(false)}
        >
          <Modal.Body className="ion-no-padding modal-no-margin">
            <img src={imageUrl} />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default MessageComponent;
