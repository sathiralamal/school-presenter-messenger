import React from "react";

import { ServiceWorker } from "aws-amplify";
import * as integration from "scholarpresent-integration";
import { Storage } from "@ionic/storage";

const webServerKey =
  "BMxE8qWjI3G17-dzmAUFwCOrqXx_BBH8JH5u3d5CbgwcX7KnYns7ogzPnF47Wn9OnGe1fKoOpeQMvnLDelJ_ZcI";
const store = new Storage();

export const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const registerServiceWorker = async (tenantId, userId) => {
  console.log(
    "registerServiceWorker entered tenantId ",
    tenantId,
    " userId ",
    userId
  );

  let contactWebPushId;

  const myserviceWorker = new ServiceWorker();
  const publicKey = base64UrlToUint8Array(webServerKey);
  //let registeredServiceWorker = await
  // myserviceWorker.register("/service-worker.js", "/").then((registration) => {
  myserviceWorker.register("/serviceworker.js", "/").then((registration) => {
    console.log("registration :", registration);
    //console.log('registration.active.state :', registration.active.state);

    //registration.active.state = "activate";
    if (registration.installing) {
      console.log("registration.installing entered");

      registration.installing.onstatechange = (event) => {
        console.log(event.target.state);
        if (event.target.state === "activated") {
          console.log("registration :", registration);

          myserviceWorker
            .enablePush(webServerKey)
            .then(function (subscription) {
              console.log("Create NewContact subscription", subscription);

              let key = subscription.getKey("p256dh");
              console.log("[ServiceWorker.js] p256dh ", key);

              let auth = subscription.getKey("auth");
              console.log("[ServiceWorker.js] auth ", auth);

              console.log(
                "[ServiceWorker.js] JSON.stringify ",
                JSON.stringify(subscription)
              );

              let contacts = [
                {
                  contactType: "webpush",
                  detail: JSON.stringify(subscription),
                },
              ];

              console.log("contacts ", contacts);
              console.log("userId ", userId);
              console.log("tenantId ", tenantId);

              integration
                .updateUserContactsInfo(userId, tenantId, contacts)
                .then((resUser) => {
                  console.log("resUser ", resUser);
                  store.create().then((value) => {
                    store
                      .set("pushNotificationKey", JSON.stringify(subscription))
                      .then((res) => {});
                  });
                });

              // updateWebPushAddressInfo(tenantId,userId,webPushAddress ).then(userUpdateResult=>{
              //   console.log("userUpdateResult :", userUpdateResult );

              // })
            });

          // registration.active.pushManager.subscribe({
          //       userVisibleOnly: true,
          //       applicationServerKey: publicKey
          //   });
        }
      };
    } else if (registration.active.state === "activated") {
      console.log(
        "Entered - registration.active.state :",
        registration.active.state
      );
      myserviceWorker.enablePush(webServerKey).then(function (subscription) {
        console.log("Create NewContact subscription", subscription);

        let key = subscription.getKey("p256dh");
        console.log("[ServiceWorker.js] p256dh ", key);

        let auth = subscription.getKey("auth");
        console.log("[ServiceWorker.js] auth ", auth);

        console.log(
          "[ServiceWorker.js] JSON.stringify ",
          JSON.stringify(subscription)
        );

        let contacts = [
          {
            contactType: "webpush",
            detail: JSON.stringify(subscription),
          },
        ];

        console.log("contacts ", contacts);
        console.log("userId ", userId);
        console.log("tenantId ", tenantId);

        integration
          .updateUserContactsInfo(userId, tenantId, contacts)
          .then((resUser) => {
            console.log("resUser ", resUser);
            store.create().then((value) => {
              store
                .set("pushNotificationKey", JSON.stringify(subscription))
                .then((res) => {});
            });
          });
      });
    }

    // myserviceWorker.
    // enablePush('BHL5EesAIESUki92hJEU_owZ5bYzGlQ4UFNDroaNqZbFwgxrw6J0u4BZshf8a26W3vk36WDQt7ODhQ4xBqw-Z5I').then(function(subscription){
    //   console.log('Create NewContact');
    // });

    // sw.ready.then(function(reg) {
    //   console.log('[----->>>>ServiceWorker.js]', registration );

    //   console.log('[----->>>>ServiceWorker.js] registration.active ' , registration.active );
    //   registration.active.onstatechange = function() {
    //     // At this point, swr.waiting OR swr.active might be true. This is because the statechange
    //     // event gets queued, meanwhile the underlying worker may have gone into the waiting
    //     // state and will be immediately activated if possible.
    //   }
    // });
  });
};

const base64UrlToUint8Array = (base64UrlData) => {
  const padding = "=".repeat((4 - (base64UrlData.length % 4)) % 4);
  const base64 = (base64UrlData + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const buffer = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }

  return buffer;
};

const registerMessageListener = (tenantId, userId) => {
  const myserviceWorker = new ServiceWorker();

  const sw = navigator.serviceWorker;
  sw.onmessage = (event) => {
    console.log("ServiceWorker.js : event ", event);

    if (event.data.eventType === "pushsubscriptionchange") {
      myserviceWorker.enablePush(webServerKey).then(function (subscription) {
        console.log("Create NewContact subscription", subscription);

        let key = subscription.getKey("p256dh");
        console.log("[ServiceWorker.js] p256dh ", key);

        let auth = subscription.getKey("auth");
        console.log("[ServiceWorker.js] auth ", auth);

        console.log(
          "[ServiceWorker.js] JSON.stringify ",
          JSON.stringify(subscription)
        );

        let contacts = [
          {
            contactType: "webpush",
            detail: JSON.stringify(subscription),
          },
        ];

        console.log("contacts ", contacts);
        console.log("userId ", userId);
        console.log("tenantId ", tenantId);

        integration
          .updateUserContactsInfo(userId, tenantId, contacts)
          .then((resUser) => {
            console.log("resUser ", resUser);
            store.create().then((value) => {
              store
                .set("pushNotificationKey", JSON.stringify(subscription))
                .then((res) => {});
            });
          });

        // updateWebPushAddressInfo(tenantId,userId,webPushAddress ).then(userUpdateResult=>{
        //   console.log("userUpdateResult :", userUpdateResult );

        // })
      });
    }
    console.log(
      "ServiceWorker.js : event.data.msg ",
      event.data.msg,
      " event.data.url ",
      event.data.url
    );
  };
};
// const updateContact = async (userId, subscription)=>{

// try {
//     const userInfo = await API.graphql(
//       graphqlOperation(updateUserModel, {
//         input: {
//           id: userId,
//           tenantIDs: [localStorage.getItem("tenantId")],
//           contacts: [
//             {
//               contactType: "webpush",
//               detail: subscription,
//             }
//           ],
//           userUserRoleId: localStorage.getItem("tenantId")+1,

//         },
//       })
//     );

//     console.log("[Contact.js] userInfo", userInfo);
//   } catch (err) {
//     console.log("err :", err);
//   }
// }

export default registerServiceWorker;
