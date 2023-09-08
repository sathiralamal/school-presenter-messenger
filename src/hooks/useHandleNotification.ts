import { FCM } from "@capacitor-community/fcm";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import * as integration from "scholarpresent-integration";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import registerServiceWorker from "../ServiceWorker";
import { Storage } from "@ionic/storage";
import { CACHE_USER_LOGIN_ID,CACHE_USER_LOGIN_ROLE_NAME, SAFARI_DISABLE_NOTIFICATION, TENANT_ID } from "../utils/StorageUtil";
import { useIonAlert } from "@ionic/react";
import { uuid } from "uuidv4";


const isSafari = "safari" in window && "pushNotification" in (window as any).safari;

// @TODO: should store it in central config.
function getSafariWebPushService() {
    switch (window?.location?.host) {
        case "localhost:3000":
            return "localhost:3000";
        case "dev.scholarpresent.com":
            return "https://a646k9cy12.execute-api.eu-central-1.amazonaws.com";
        case "qa.scholarpresent.com":
            return "https://0lotdxg0zj.execute-api.eu-central-1.amazonaws.com";
        case "app.scholarpresent.com":
            return "https://vwph875lm7.execute-api.eu-central-1.amazonaws.com";
        default:
            return null;
    }
}

export default function useHandleNotification() {
    // @TODO: should be the same if backend data is consistent
    const [lastNativeNotification, setLastNativeNotification] = useState<any>();
    const [lastWebNotification, setLastWebNotification] = useState<any>();
    const location = useLocation();
    const history = useHistory();
    const [tenantId, setTenantId] = useState("");
    const [cacheUserId, setCacheUserId] = useState("");
    const [safariDisableNotification, setSafariDisableNotification] = useState<undefined | boolean>();
    const [present] = useIonAlert();
    const store = new Storage();


    useEffect(() => {
        (async function () {
            console.log("useHandleNotidication enter")
            await store.create();
            setTenantId(await store.get(TENANT_ID));
            setCacheUserId(await store.get(CACHE_USER_LOGIN_ID));
            setSafariDisableNotification(!!(await store.get(SAFARI_DISABLE_NOTIFICATION)));
        })();
    }, []);

    // Handle native push notification
    useEffect(() => {
        console.log("useHandleNotidication tenantId ", tenantId, " cacheUserId ", cacheUserId, " Capacitor.isNativePlatform() ", Capacitor.isNativePlatform())

        if (!tenantId || !cacheUserId || !Capacitor.isNativePlatform()) {
            console.log("useHandleNotidication returning");
            return;
        }

        (async function handle() {
            const requestResult = await PushNotifications.requestPermissions();
            if (requestResult.receive !== "granted") {
                return;
            }
            // Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();

            // On succcess, we should be able to receive notifications
            PushNotifications.addListener("registration", async (token: any) => {
                console.warn(`[useHandleNotification.ts] Token reretrived 1: ${token?.value}`);
                let tokenStr: string;

                // on iOS, need extra step to get token
                if (Capacitor.getPlatform() === "ios") {
                    tokenStr = await FCM.getToken().then((r) => r.token);
                } else {
                    // on android, don't need
                    tokenStr = token.value;
                }

                console.warn("[useHandleNotification.ts] Token reretrived 2: ", tokenStr);
                let contacts = [
                    {
                        contactType: "app",
                        detail: tokenStr,
                    },
                ];
                store.create().then(value=>{
                    store.set("appNotificationKey", tokenStr).then(res=>{});
                });

                integration.updateUserContactsInfo(cacheUserId, tenantId, contacts).then((resUser: any) => {
                    console.warn("resUser ", resUser);
                    //alert('resUser: ' + resUser);
                });

                //alert('Push registration success, token: ' + token.value);
            });

            // Some issue with your setup and push will not work
            PushNotifications.addListener("registrationError", (error: any) => {
                console.error("[useHandleNotification.ts] Error on registration: " + JSON.stringify(error));
            });



            // Show us the notification payload if the app is open on our device
            PushNotifications.addListener("pushNotificationReceived", (notification: any) => {
                console.warn("[useHandleNotification.ts] pushNotificationReceived ", JSON.stringify(notification));
                let messageId = notification?.data?.id
                try{
                    integration.createMessageEventRecievedInfo(uuid(),messageId,Capacitor.getPlatform() ).then(value=>{
                        console.log("createMessageEventRecievedInfo value ", value)
                    })
                }catch(error){
                    console.log("[useHandleNotification.ts] pushNotificationReceived error ", error);
                }    

                setLastNativeNotification(notification);



                //const createdBy = JSON.parse(notification.data.createdByUser);

                // if (
                //     window.confirm(
                //         `You have new message from ${createdBy.firstName} ${createdBy.lastName}: ${notification.body}`
                //     )
                // ) {
                //     history.push("/messaging/" + notification.data.conversationId);
                // }
            });

            // Method called when tapping on a notification
            PushNotifications.addListener("pushNotificationActionPerformed", async(notification: any) => {
                console.log(
                    "[useHandleNotification.ts] tapping on a notification entered ")
                console.warn(
                    "[useHandleNotification.ts] tapping pushNotificationActionPerformed ",
                    JSON.stringify(notification)
                );
                let newTappedNotification = {
                    ...notification.notification
                }
                if(notification?.actionId) {
                    newTappedNotification.actionId = notification.actionId;
                }
                if(location?.pathname!="messaging"){
                    const store = new Storage();
                    await store.create();
                    let roleName = await store.get(CACHE_USER_LOGIN_ROLE_NAME);
                    console.log(
                                    "[useHandleNotification.ts] roleName ", roleName);
                                if(roleName ==="Student" || roleName ==="Parent"){
                                    history.push("/lmessaging" , {"conversationId":notification?.notification?.data?.conversationId, 
                                    "messageId" : notification?.notification?.data?.id, "data" :notification?.notification?.data   });
                                }else{
                                    history.push("/messaging" , {"conversationId":notification?.notification?.data?.conversationId, 
                                    "messageId" : notification?.notification?.data?.id,
                                     "data" :notification?.notification?.data });
                                }
                } else{
                    setLastNativeNotification(newTappedNotification);
                }

                // const store = new Storage();
                // store.create().then(value=>{
                //     store.get(CACHE_USER_LOGIN_ROLE_NAME).then(roleName=>{
                //         console.log(
                //             "[useHandleNotification.ts] roleName ", roleName);
                //         if(roleName ==="Student" || roleName ==="Parent"){
                //             history.push("/lmessaging" , {"conversationId":notification?.notification?.data?.conversationId, 
                //             "messageId" : notification?.notification?.data?.id, "data" :notification?.notification?.data   });
                //         }else{
                //             history.push("/messaging" , {"conversationId":notification?.notification?.data?.conversationId, 
                //             "messageId" : notification?.notification?.data?.id,
                //              "data" :notification?.notification?.data });
                //         }
                //     })
                // })

            });
        })();

        return () => {
            PushNotifications.removeAllListeners();
        };
    }, [cacheUserId, history, tenantId]);

    // Handle web push notification - listen message
    useEffect(() => {
        if (!tenantId || !cacheUserId || Capacitor.getPlatform() !== "web") {
            console.log("useEffect missing tenantId ", tenantId, " cacheUserId ", cacheUserId);
            return;
        }

        if (!("serviceWorker" in navigator)) {
            console.log("useEffect serviceWorker ", ("serviceWorker" in navigator));

            return;
        }

        if (isSafari) {
            return;
        }

        registerServiceWorker(tenantId, cacheUserId).then(value=>{
            const eventHandler: ServiceWorkerContainer["onmessage"] = (event) => {
                console.log(" eventHandler: ServiceWorkerContainer[onmessage]  event ", event);
                console.log(" eventHandler: ServiceWorkerContainer[onmessage]  event ", JSON.stringify(event));
    
                if (event.data) {
                    if (event.data.type === "MSG_RECEIVED") {
                        setLastNativeNotification(event.data);
                        // const store = new Storage();
                        // store.create().then(value=>{
                        //     store.set("MESSAGE_"+event.data.messageId, event.data.messageId);
                        // })
    
                    } else if (event.data.type === "RELOAD") {
                        // @TODO: if backend return conversationId. Redirect users to messaging page
                        console.log("if backend return conversationId. Redirect users to messaging page")
                        window.location.reload();
                    }
                }
            };
    
            
    
            navigator.serviceWorker.onmessage = eventHandler;
            navigator.serviceWorker.startMessages();
    
            return () => {
                navigator.serviceWorker.removeEventListener("message", eventHandler);
            };
        })

        
    }, [cacheUserId, location.pathname, tenantId]);

    // Handle web push notification: Chrome/Firefox - request permission
    useEffect(() => {
        if (Capacitor.getPlatform() !== "web") {
            return;
        }

        if (!("Notification" in window) || isSafari) {
            return;
        }

        // Let's check whether notification permissions have already been denied
        if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                console.warn("Permission request result: ", permission);
            });
        }
    }, []);

    // Handle web push notification: Safari - request permission
    useEffect(() => {
        if (!tenantId || !cacheUserId || Capacitor.getPlatform() !== "web") {
            return;
        }

        if (!isSafari) {
            return;
        }

        const permissionData = (window as any).safari.pushNotification.permission("web.scholarpresent.com");

        console.warn("[useHandleNotification.ts] permissionData: ", permissionData);

        if (permissionData.permission === "denied") {
            return;
        }

        if (safariDisableNotification === undefined || safariDisableNotification === true) {
            return;
        }

        const confirmHandler = () => {
            const checkRemotePermission = async function (permissionData: any) {
                const SAFARI_WEB_PUSH_SERVICE = getSafariWebPushService();
                if (!SAFARI_WEB_PUSH_SERVICE) {
                    console.warn("SAFARI_WEB_PUSH_SERVICE is not defined");
                    return;
                }
                if (permissionData.permission === "default") {
                    // This is a new web service URL and its validity is unknown.
                    (window as any).safari.pushNotification.requestPermission(
                        SAFARI_WEB_PUSH_SERVICE, // The web service URL.
                        "web.scholarpresent.com", // The Website Push ID.
                        {}, // Data that you choose to send to your server to help you identify the user.
                        checkRemotePermission // The callback function.
                    );
                } else if (permissionData.permission === "denied") {
                    // The user said no.
                    console.warn("denied");
                } else if (permissionData.permission === "granted" && permissionData.deviceToken) {
                    console.warn("granted");

                    const contacts = [
                        {
                            contactType: "safari",
                            detail: permissionData.deviceToken,
                        },
                    ];

                    integration
                        .updateUserContactsInfo(cacheUserId, tenantId, contacts)
                        .then((resUser) => {
                            console.warn("resUser ", resUser);
                        })
                        .catch((e) => {
                            console.error(e);
                        });

                    const store = new Storage();
                    await store.create();
                    await store.set(SAFARI_DISABLE_NOTIFICATION, true);
                }
            };

            checkRemotePermission(permissionData);
        };

        if (permissionData.permission === "granted") {
            confirmHandler();
        }

        if (permissionData.permission === "default") {
            present({
                header: "Enable push notification",
                message: "Please enable push notification to get latest message",
                buttons: [
                    {
                        text: "Cancel",
                        handler: async (d) => {
                            const store = new Storage();
                            await store.create();
                            await store.set(SAFARI_DISABLE_NOTIFICATION, true);
                        },
                    },
                    {
                        text: "Ok",
                        handler: (d) => {
                            confirmHandler();
                        },
                    },
                ],
                onDidDismiss: (e) => console.log("did dismiss"),
            });
        }
    }, [cacheUserId, present, safariDisableNotification, tenantId]);

    return [lastNativeNotification, lastWebNotification];
}
