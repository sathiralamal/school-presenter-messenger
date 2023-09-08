import React, {useEffect, useState} from "react";
import {
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { add, close } from "ionicons/icons";
import "./updateLearner.css";
import { Input, FlexboxGrid, InputPicker } from "rsuite";
import * as integration from "scholarpresent-integration";
// popup
// import UpdateLearnerGroup from "./newLearner";

const UpdateLearner: React.FC<{ open: boolean; closee: any; user: any }> = ({
  open,
  closee,
  user
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [parents, setParents] = useState<any[]>([{
    name: "",
    phone: "",
    email: ""
  }])
  const data = [
    {
      label: "Eugenia",
      value: "Eugenia",
      role: "Master",
    },
    {
      label: "Kariane",
      value: "Kariane",
      role: "Master",
    },
    {
      label: "Louisa",
      value: "Louisa",
      role: "Master",
    },
    {
      label: "Marty",
      value: "Marty",
      role: "Master",
    },
    {
      label: "Kenya",
      value: "Kenya",
      role: "Master",
    },
    {
      label: "Hal",
      value: "Hal",
      role: "Developer",
    },
    {
      label: "Julius",
      value: "Julius",
      role: "Developer",
    },
    {
      label: "Travon",
      value: "Travon",
      role: "Developer",
    },
    {
      label: "Vincenza",
      value: "Vincenza",
      role: "Developer",
    },
    {
      label: "Dominic",
      value: "Dominic",
      role: "Developer",
    },
    {
      label: "Pearlie",
      value: "Pearlie",
      role: "Guest",
    },
    {
      label: "Tyrel",
      value: "Tyrel",
      role: "Guest",
    },
    {
      label: "Jaylen",
      value: "Jaylen",
      role: "Guest",
    },
    {
      label: "Rogelio",
      value: "Rogelio",
      role: "Guest",
    },
  ];
  
  const fetchParents = async(userId:string) =>{
    try{
      let user = await integration.getLearnerAndParentInfo(userId)
      console.log(user);
      
    }catch(err){

    }finally{

    }
  }
  const addAnotherParentRow = () => {
    parents.push({
      name: "",
      phone: "",
      email: ""
    })
    setParents([...parents])
  }
  useEffect(()=>{
    if(open){
      fetchParents(user.id)
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.contactPhone);
      setEmail(user.contactEmail);
    }
  }, [user, open])
  return (
    <IonItem
      lines="none"
      className="UpdateLearner"
      style={{ display: open ? "block" : "none" }}
    >
      <IonGrid>
        <IonRow>
          <IonCol>
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item>
                <IonText className="PopupHeader">Edit Learner</IonText>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                <IonIcon
                  icon={close}
                  style={{
                    fontSize: 22,
                    verticalAlign: "top",
                    color: "#f00",
                  }}
                  onClick={closee}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <Input placeholder="First Name" value={firstName} onChange={(e:any)=>setFirstName(e.target.value)}/>
            <IonText className="PopupLable"> First Name </IonText>
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input placeholder="Last Name" value={lastName} onChange={(e:any)=>setLastName(e.target.value)}/>
            <IonText className="PopupLable"> Last Name </IonText>
          </IonCol>
        </IonRow>
        <IonRow className="LearnerSelect">
          <IonCol size="12" size-md="6">
            <InputPicker
              className="PopupInputPicker"
              placeholder="Select Grade"
              data={data}
              // searchable={false}
            />
          </IonCol>
          <IonCol size="12" size-md="6">
            <InputPicker
              className="PopupInputPicker"
              placeholder="Select Class"
              data={data}
              // searchable={false}
            />
          </IonCol>
        </IonRow>
        <IonRow className="LearnerPhoneEmail">
          <IonCol size="12" size-md="6">
            <Input placeholder="Phone" value={phone} onChange={(e:any)=>setPhone(e.target.value)}/>
            <IonText className="PopupLable"> Phone </IonText>
          </IonCol>
          <IonCol size="12" size-md="6">
            <Input placeholder="Email" value={email} onChange={(e:any)=>setEmail(e.target.value)}/>
            <IonText className="PopupLable"> Email </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText className="PopupHeader devider">
              Add Parents/Guardians Details
            </IonText>
          </IonCol>
        </IonRow>
        {parents.map((parent: any, i: number) => (
            <React.Fragment key={i}>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <Input placeholder="Parent Name" value={parent.name} onChange={(value: string) => {
                    parent.name = value;
                    setParents([...parents])
                  }} />
                  <IonText className="PopupLable"> Parent Name </IonText>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <Input placeholder="Phone" value={parent.phone} onChange={(value: string) => {
                    parent.phone = value;
                    setParents([...parents])
                  }} />
                  <IonText className="PopupLable"> Phone </IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <Input placeholder="Email" value={parent.email} onChange={(value: string) => {
                    parent.email = value;
                    setParents([...parents])
                  }} type="email" />
                  <IonText className="PopupLable"> Email </IonText>
                </IonCol>
              </IonRow>
              {i !== (parents.length - 1) && (
                <div className="devider-light" />
              )}
            </React.Fragment>
          ))}
        <IonRow>
          <IonCol>
            <FlexboxGrid justify="center">
              <FlexboxGrid.Item>
                <IonButton 
                  className="btn-white-popup " 
                  color="light"
                  onClick={() => addAnotherParentRow()}
                  disabled={parents.length === 2}
                >
                  <IonIcon
                    icon={add}
                    style={{
                      fontSize: 22,
                      verticalAlign: "middle",
                      color: "#219653",
                      marginRight: 7,
                    }}
                  />
                  <IonText style={{ color: "#219653" }}>
                    Add another parent
                  </IonText>
                </IonButton>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
        <IonRow className="devider">
          <IonCol>
            <FlexboxGrid justify="end">
              <FlexboxGrid.Item>
                <IonButton
                  fill="outline"
                  className="outlineBtn "
                  color="success"
                  onClick={closee}
                >
                  Cancel
                </IonButton>
                <IonButton
                  className="btn-green-popup "
                  onClick={() => {
                    closee();
                  }}
                >
                  Save
                </IonButton>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default UpdateLearner;
