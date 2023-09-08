import Amplify, { Auth } from 'aws-amplify';
import * as integration from "scholarpresent-integration";

// const conversations  = async () => {
//     let user = await Auth.currentSession();
//     const { accessToken }:any = user;
//     const { idToken }:any = user;
//     let tenantId = accessToken.payload["cognito:groups"][0];
//     console.log('conversations tenantId ', tenantId);

//     const userIdPerTenantStr = idToken.payload["userIdPerTenant"];
//     const userIdPerTenant = JSON.parse(idToken.payload["userIdPerTenant"]);
//     let userIdTenantKeys = Object.keys(userIdPerTenant);
//     let userLogonId = userIdTenantKeys[0];
//     console.log("****userLogonId", userLogonId);

//     // Auth.currentSession().then((user:any)=>{
//     //     const { accessToken } = user;
//     //     const { idToken } = user;
//     //     let tenantId = accessToken.payload["cognito:groups"][0];
//     //     console.log('tenantId ', tenantId);

//     //     const userIdPerTenantStr = idToken.payload["userIdPerTenant"];
//     //     const userIdPerTenant = JSON.parse(idToken.payload["userIdPerTenant"]);
//     //     let userIdTenantKeys = Object.keys(userIdPerTenant);
//     //     let userLogonId = userIdTenantKeys[0];
//     //     console.log("userLogonId", userLogonId);
        
//     //       integration.listChatConversationsInfo(userLogonId).then((conversation:any)=>{
//     //         console.log("***** conversation ", conversation);

//     //     })

//     //   } );

//     return conversationList;

// }
const conversations = [
    {
        "id": 1,
        "name": "Mulalo Nethononda",
        "date": "3 min ago",
        "role": "STUDENT",
        "unread": 5,
        "status": "online",
        "avatar": "https://iconnect99backend89ce0a116bdc473d9f1e27bba0f2e144247-dev.s3.eu-central-1.amazonaws.com/public/149fbe66-57a4-473e-8807-6fe40d258840image.png",
        messages: [
            { id: 1, deliveryStatus: 'read', type: 'sent', time: '08:15', text: "Please Mulalo Nethononda find the attached attendance roaster.Download it and store safely. Thank you." },
            {
                id: 2, deliveryStatus: 'delivered', type: 'received', time: '08:15',
                replay: { count: 5 },
                text: "Parent Message with Reply."
            },
            {id:4,type:'sent',time:'08:15',text:"Please Mulalo Nethononda find the attached attendance roaster.Download it and store safely. Thank you."},
            {
                id: 3, type: 'received', time: '08:15', text: "New Timetable starting next week", 
                media: {
                    type:'pdf',
                    url:'/assets/pdf.svg'
                }
            },
            {
                id: 9, type: 'received', time: '08:15', text: "Mr Fun", 
                media: {
                    type:'image',
                    url:'https://i.pravatar.cc/150?img=50'
                }
            },
            // {id:4,type:'received',time:'08:15',text:"Please Mulalo Nethononda find the attached attendance roaster.Download it and store safely. Thank you."},
            // {id:5,type:'sent',time:'08:15',text:"Please Mulalo Nethononda find the attached attendance roaster.Download it and store safely. Thank you."},
            // {id:6,type:'received',time:'08:15',text:"Please Mulalo Nethononda find the attached attendance roaster.Download it and store safely. Thank you."},
            // {id:7,type:'sent',time:'08:15',text:"Please Mulalo Nethononda find the attached attendance roaster.Download it and store safely. Thank you."},
            // {id:8,type:'received',time:'08:15',text:"Please Mulalo Nethononda find the attached attendance roaster.Download it and store safely. Thank you."},
        ]
    },
    {
        "id": 2,
        "name": "Catarina gomes",
        "date": "3 min ago",
        "role": "STUDENT",
        "unread": 0,
        "status": "offline",
        "avatar": "https://iconnect99backend89ce0a116bdc473d9f1e27bba0f2e144247-dev.s3.eu-central-1.amazonaws.com/public/35f954f1-4174-4766-81f7-11caa5209b97image.png",
        messages: [
            { id: 9, deliveryStatus: 'read', type: 'sent', time: '08:15', text: "Parent Message with Reply." },
            {
                id: 10,
                deliveryStatus: 'delivered', type: 'received', time: '08:15', text: "Please Catarina gomes find the attached attendance roaster.Download it and store safely. Thank you."
            },
            { id: 11, deliveryStatus: 'read', type: 'sent', time: '08:15', text: "Please Catarina gomes find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 12, deliveryStatus: 'delivered', type: 'received', time: '08:15', text: "Please Catarina gomes find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 13, deliveryStatus: 'read', type: 'sent', time: '08:15', text: "Please Catarina gomes find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 14, deliveryStatus: 'delivered', type: 'received', time: '08:15', text: "Please Catarina gomes find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 15, deliveryStatus: 'read', type: 'sent', time: '08:15', text: "Please Catarina gomes find the attached attendance roaster.Download it and store safely. Thank you." },
            {
                id: 16,
                parentMessage: { id: 9, type: 'received', time: '08:15', text: "Parent Message with Reply." },
                type: 'received', time: '08:15', text: "Please Catarina gomes find the attached attendance roaster.Download it and store safely. Thank you."
            },
        ]
    },
    {
        "id": 3,
        "name": "Broadcast",
        "date": "3 min ago",
        "role": "STUDENT",
        "unread": 4,
        "status": "online",
        "avatar": "/assets/broadcast.svg",
        messages: [
            { id: 17, type: 'sent', time: '08:15', text: "Please Jhon Doe find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 18, type: 'received', time: '08:15', text: "Please Jhon Doe find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 19, isBroadcast: true, type: 'sent', time: '08:15', text: "Please Jhon Doe find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 20, type: 'received', time: '08:15', text: "Please Jhon Doe find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 21, type: 'sent', time: '08:15', text: "Please Jhon Doe find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 22, type: 'received', time: '08:15', text: "Please Jhon Doe find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 23, type: 'sent', time: '08:15', text: "Please Jhon Doe find the attached attendance roaster.Download it and store safely. Thank you." },
            { id: 24, type: 'received', time: '08:15', text: "Please Jhon Doe find the attached attendance roaster.Download it and store safely. Thank you." },
        ]
    },
    {
        "id": 4,
        "name": "Parent Student",
        "date": "3 min ago",
        "role": "School Clerk",
        "unread": 0,
        "status": "offline",
        "avatar": "/assets/broadcast.svg",
        messages: [
            { id: 25, type: 'broadcastReceived', time: '08:15', text: `Good Morning all Parents
Happy Mothers Day to all lovely mommies. May you be blessed and spoiled beyond measure today.

Please visit our school's FB page for a little surprise from our junior choir. 
The page's name is Christian Secondary School.

Enjoy the day with your families
` },
            { id: 26, type: 'broadcastReceived', time: '08:15', text: `Good Morning all Parents
Happy Mothers Day to all lovely mommies. May you be blessed and spoiled beyond measure today.

Please visit our school's FB page for a little surprise from our junior choir. 
The page's name is Christian Secondary School.

Enjoy the day with your families
` },
            // { id: 27, type: 'broadcastReceived', time: '08:15', text: "Please James Bass find the attached attendance roaster.Download it and store safely. Thank you." },
            // { id: 28, type: 'broadcastReceived', time: '08:15', text: "Please James Bass find the attached attendance roaster.Download it and store safely. Thank you." },
            // { id: 29, type: 'broadcastReceived', time: '08:15', text: "Please James Bass find the attached attendance roaster.Download it and store safely. Thank you." },
            // { id: 30, type: 'broadcastReceived', time: '08:15', text: "Please James Bass find the attached attendance roaster.Download it and store safely. Thank you." },
            // { id: 31, type: 'broadcastReceived', time: '08:15', text: "Please James Bass find the attached attendance roaster.Download it and store safely. Thank you." },
            // { id: 32, type: 'broadcastReceived', time: '08:15', text: "Please James Bass find the attached attendance roaster.Download it and store safely. Thank you." },
        ]
    },
    // {
    // 	"id":5,
    // 	"name":"David Aliac",
    // 	"date":"3 min ago",
    // 	"role":"STUDENT",
    //     "unread":3,
    // 	"status":"online",
    // 	"avatar":"https://i.pravatar.cc/50?img=24",
    //     messages:[
    //         {id:33,type:'sent',time:'08:15',text:"Please David Aliac find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:34,type:'received',time:'08:15',text:"Please David Aliac find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:35,type:'sent',time:'08:15',text:"Please David Aliac find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:36,type:'received',time:'08:15',text:"Please David Aliac find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:37,type:'sent',time:'08:15',text:"Please David Aliac find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:38,type:'received',time:'08:15',text:"Please David Aliac find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:39,type:'sent',time:'08:15',text:"Please David Aliac find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:40,type:'received',time:'08:15',text:"Please David Aliac find the attached attendance roaster.Download it and store safely. Thank you."},
    //     ]
    // },
    // {
    // 	"id":6,
    // 	"name":"Adam Edic",
    // 	"date":"3 min ago",
    // 	"role":"STUDENT",
    //     "unread":0,
    // 	"status":"offline",
    // 	"avatar":"https://i.pravatar.cc/50?img=25",
    //     messages:[
    //         {id:41,type:'sent',time:'08:15',text:"Please Adam Edic find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:42,type:'received',time:'08:15',text:"Please Adam Edic find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:43,type:'sent',time:'08:15',text:"Please Adam Edic find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:44,type:'received',time:'08:15',text:"Please Adam Edic find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:45,type:'sent',time:'08:15',text:"Please Adam Edic find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:46,type:'received',time:'08:15',text:"Please Adam Edic find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:47,type:'sent',time:'08:15',text:"Please Adam Edic find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:48,type:'received',time:'08:15',text:"Please Adam Edic find the attached attendance roaster.Download it and store safely. Thank you."},
    //     ]
    // },
    // {
    // 	"id":7,
    // 	"name":"Robo Chat",
    // 	"date":"3 min ago",
    // 	"role":"STUDENT",
    //     "unread":0,
    // 	"status":"online",
    // 	"avatar":"https://i.pravatar.cc/50?img=2",
    //     messages:[
    //         {id:49,type:'sent',time:'08:15',text:"Please Robo Chat find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:50,type:'received',time:'08:15',text:"Please Robo Chat find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:51,type:'sent',time:'08:15',text:"Please Robo Chat find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:52,type:'received',time:'08:15',text:"Please Robo Chat find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:53,type:'sent',time:'08:15',text:"Please Robo Chat find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:54,type:'received',time:'08:15',text:"Please Robo Chat find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:55,type:'sent',time:'08:15',text:"Please Robo Chat find the attached attendance roaster.Download it and store safely. Thank you."},
    //         {id:56,type:'received',time:'08:15',text:"Please Robo Chat find the attached attendance roaster.Download it and store safely. Thank you."},
    //     ]
    // }
]

export default conversations