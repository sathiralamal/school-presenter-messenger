import React, {useEffect, useState} from "react";
import { IonItem, IonText, IonButton, IonIcon, IonImg } from "@ionic/react";
import { Checkbox, FlexboxGrid , Progress} from "rsuite";
import { close } from "ionicons/icons";
import SuccessImg from "../../../assets/Success.png";
import "./createGroupsSendInvitations.css";

const CreateGroupsSendInvitations: React.FC<{
  open: boolean;
  closee: any;
  next: any;
  importedContacts: any[];
  gradeCount :any;  
  classCount : any; 
  showProgressGroupUpload:number;
  onGenerateGroupSelect:Function;
}> = ({ open, closee, next, importedContacts, gradeCount, classCount, showProgressGroupUpload, onGenerateGroupSelect }) => {
  const [allImportedContacts, setAllImportedContacts] = useState<any[]>([]);
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const { Line } = Progress;
  const [progressPercent, setProgressPercent] = useState<number>(10);

  useEffect(()=>{
    let temp:any[] = [];
    console.log("*** importedContacts ", importedContacts);
    importedContacts?.map((chunk:any)=>{
      console.log("*** chunk ", chunk);
      if(chunk?.map){
        chunk?.map((contact:any) => {
          temp.push(contact);
        })
      }else if(chunk?.items){
        chunk?.items?.map((contact:any) => {
          temp.push(contact);
        })
      }  
    })
    if(temp.length > 0){
      setAllImportedContacts(temp);
    }
  }, [importedContacts])
  return (
    <IonItem
      lines="none"
      className="createGroupsSendInvitations"
      style={{ display: open ? "block" : "none" }}
    >
      <FlexboxGrid style={{ flexDirection: "column", width: "100%" }}>
        <FlexboxGrid
          justify="space-between"
          style={{
            width: "100%",
            borderBottom: "1px solid #bbb",
            paddingBottom: 10,
          }}
        >
          <IonText className="CGSIHead">
            Create Groups And Send Invitations
          </IonText>
          <IonIcon
            icon={close}
            style={{
              fontSize: 22,
              verticalAlign: "top",
              color: "#bf0000",
            }}
            onClick={closee}
          />
        </FlexboxGrid>
        {allImportedContacts?.length > 0 ? (
          <>
            <FlexboxGrid className="CGSIBodyHeadCover">
              <IonImg src={SuccessImg} className="CGSIImg" />
              <IonText className="CGSIBodyHead">
                Contacts imported successfully
              </IonText>
            </FlexboxGrid>
            <FlexboxGrid className="CGSIBody">
              <IonText>
                A total of <b>{allImportedContacts.length}</b> unique contacts were imported
              </IonText>
              <IonText>
                {/* A total of <b>{allImportedContacts.filter((contact: any) => contact?.classNameId !== "null")?.length || 0}</b> Grades were identified */}
                A total of <b>{gradeCount}</b> Grades were identified
              </IonText>
              <IonText>
                {/* A total of <b>{allImportedContacts.filter((contact: any) => contact?.classNameId !== "null")?.length || 0}</b> Classes were identified */}
                A total of <b>{classCount}</b> Classes were identified
              </IonText>
            </FlexboxGrid>
            {gradeCount > 0||classCount > 0 ? 
            <FlexboxGrid
              style={{
                width: "100%",
                flexDirection: "column",
                padding: "15px 30px",
                border: "2px solid #21965333",
                borderRadius: 7,
              }}
            >
              <IonText className="CGSICheckHead">
                WE HIGHLY RECOMMEND THE FOLLOWING
              </IonText>
                {(gradeCount > 0 ||classCount > 0) && <Checkbox  defaultChecked onChange={(value, checked)=> onGenerateGroupSelect(value, checked)} className="createGroupsSendInvitationsCheck">
                  Generate groups for the Grades & Classes
                </Checkbox>}
            </FlexboxGrid>:""}
            { 
              showProgressGroupUpload > 0?
              <Line percent={showProgressGroupUpload} /> :""
              }
          </>
        ) : (
          <FlexboxGrid className="CGSIBodyHeadCover">
            <IonImg src={SuccessImg} className="CGSIImg" />
            <IonText className="CGSIBodyHeadError">
              Something went wrong!
            </IonText>
          </FlexboxGrid>
        )}
        <FlexboxGrid justify="end" style={{ width: "100%", marginTop: 20 }}>
          <FlexboxGrid.Item>
            <IonButton
              fill="outline"
              className="outlineBtn "
              color="success"
              onClick={closee}
            >
              Cancel
            </IonButton>
            {allImportedContacts?.length > 0 ?
              <IonButton
                className="btn-green-popup "
                onClick={() => {
                  closee();
                  next();
                }}
              >
                Next
              </IonButton>
              :
              <IonButton
                className="btn-green-popup "
                onClick={() => {
                  closee();
                }}
              >
                Finish
              </IonButton>
            }
          </FlexboxGrid.Item>
        </FlexboxGrid>

      </FlexboxGrid>
    </IonItem>
  );
};

export default CreateGroupsSendInvitations;
