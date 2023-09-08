import React from "react";
import { IonPage, IonHeader, IonToolbar, IonContent } from "@ionic/react";
import { Navbar, Nav, Dropdown, IconButton, Icon } from "rsuite";

// components
import Header from "../../components/template/header/header";
import "./noMenuView.css";
import { useHistory } from "react-router-dom";

const MainView: React.FC<{ children: any }> = ({ children }) => {
  let history = useHistory();
  const goTo = (url: string) => {
    history.push(url)
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <Navbar>
            <Navbar.Header>
              <img
                className="navbar-brand logo"
                src="assets/logo.png"
                alt="logo"
              />
            </Navbar.Header>
          </Navbar>
        </IonToolbar>
      </IonHeader>
      <IonContent className="mainView-Content" fullscreen>
        {children}
      </IonContent>
    </IonPage>
  );
};

export default MainView;
