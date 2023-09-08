import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { IonReactRouter } from "@ionic/react-router";
import ReactGA from "react-ga";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import { selectEnvironment } from "scholarpresent-integration";
import React, { useEffect } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import awsconfig from "./aws-exports";
import awsconfig_dev from "./aws-exports-dev";
import awsconfig_qa from "./aws-exports-qa";

import "./index.css";
// import LessonComponent from "./lesson";
import RouteComponent from "./route";
/* Theme variables */
import "./theme.css";
import { SplashScreen } from "@capacitor/splash-screen";
//import * as integration from "scholarpresent-integration";

const ScholarPresentApp: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize("G-B7DWBVZXKW");

    init().then((values) => {
      console.log("init values ");
    });
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide();
      App.addListener("backButton", (e) => {
        if (window.location.pathname === "/") {
          let ans = window.confirm("Are you sure");
          if (ans) {
            App.exitApp();
          }
        } else if (window.location.pathname === "/message") {
          // Show A Confirm Box For User to exit app or not
          let ans = window.confirm("Are you sure");
          if (ans) {
            App.exitApp();
          }
        }
      });
    }
  }, []);

  const init = async () => {
    console.log("window.location ", window.location);
    let currentEnv = window.location.hostname.split(".", 1)[0];
    let hostname = window.location.host;
    //currentEnv = "dev";

    console.log("currentEnv ", currentEnv);
    let selectedEnv = awsconfig_dev;

    if (
      (currentEnv === "localhost" && hostname === "localhost:3000") ||
      currentEnv === "dev" ||
      currentEnv === "d3r3zqdt7r6pj8"
    ) {
      selectedEnv = awsconfig_dev;
    } else if (currentEnv === "qa" || currentEnv === "d5gfuxg0uj774") {
      selectedEnv = awsconfig_qa;
    } else {
      selectedEnv = awsconfig;
    }
    selectEnvironment(selectedEnv);
  };

  return (
    <IonReactRouter>
      <RouteComponent />
    </IonReactRouter>
  );
};
export default ScholarPresentApp;
