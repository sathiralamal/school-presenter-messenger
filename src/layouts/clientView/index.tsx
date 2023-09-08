import React from "react";
import { IonPage, IonHeader, IonToolbar, IonContent } from "@ionic/react";

// components
import Header from "../../components/template/header/client-header";
import "./mainView.css";

const MainView: React.FC<{ children: any }> = ({ children }) => {
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
