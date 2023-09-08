import React from "react";
import { useEffect, useState, useRef } from "react";

import { IonPage, IonHeader, IonToolbar, IonContent } from "@ionic/react";
import { useHistory } from "react-router-dom";
import * as integration from "scholarpresent-integration";

// components
import Header from "../../components/template/header/header";
import "./mainView.css";

const MainView: React.FC<{ children: any }> = ({ children }) => {
  let history = useHistory();
  
  // useEffect(() => {
  //   integration.currentAuthenticatedUser().then((value:any)=>{
  //   }).catch((error:any)=>{
  //     history.push("/login");
  //   })
  // });

  return (
    <IonPage>
      <IonHeader>
          <Header />
      </IonHeader>
      <IonContent className='mainView-Content' fullscreen>{children}</IonContent>
    </IonPage>
  );
};

export default MainView;
