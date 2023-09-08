import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import LoginWeb from "./components/login-web/login-web";
import Invitation from "./components/register-web/invitation";
import RegisterWeb from "./components/register-web/register-web";
// Layouts
import RouteWithLayout from "./components/routeWithLayout/RouteWithLayout";
import Loading from "./components/shared/Loading";
import TourComponent from "./components/tours/tour-component";
import useGetCacheUserRoleName from "./hooks/useGetCacheUserRoleName";
import useIsLogined from "./hooks/useIsLogined";
import ClientMainView from "./layouts/clientView";
import MainView from "./layouts/mainVIew";
import NoMenuView from "./layouts/noMenuView";
import WebsiteView from "./layouts/websiteView";
// pages
const FilesPage = React.lazy(() => import("./pages/files-page/Files-Page"));
const ContactsPage = React.lazy(() => import("./pages/contacts/index"));
const LearnerContactsPage = React.lazy(
  () => import("./pages/contacts/learnerIndex")
);
const GroupsPage = React.lazy(() => import("./pages/groups/index"));
// const GroupsPage = React.lazy(() => import("group_mfe/group"));

const PendingApproval = React.lazy(
  () => import("./pages/home/pendingApproval")
);
const Message = React.lazy(() => import("./pages/message-page/message-page"));
const ShowPDF = React.lazy(() => import("./pages/showPDF/ShowPDF"));

export default function RouteComponent() {
  const [initScreenIndex, setInitScreenIndex] = useState<any>(0);
  const isLogined = useIsLogined();
  const roleName = useGetCacheUserRoleName();

  useEffect(() => {
    if (roleName === null || isLogined === null) {
      return;
    }
    if (isLogined === false) {
      setInitScreenIndex(1);
    } else {
      if (roleName === "Student" || roleName === "Parent") {
        setInitScreenIndex(2);
      } else {
        setInitScreenIndex(3);
      }
    }
  }, [isLogined, roleName]);

  const InitComponent =
    initScreenIndex === 0
      ? Loading
      : initScreenIndex === 1
      ? LoginWeb
      : initScreenIndex === 2
      ? LearnerContactsPage
      : ContactsPage;

  const InitLayoutComponent =
    initScreenIndex === 0
      ? WebsiteView
      : initScreenIndex === 1
      ? WebsiteView
      : initScreenIndex === 2
      ? ClientMainView
      : MainView;

  if (initScreenIndex === 0) {
    return <Loading />;
  }

  return (
    <IonApp>
      <Suspense fallback={<Loading />}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Switch>
              {/* <Redirect from="/" to="/contacts" /> */}
              {/* <RouteWithLayout
                path="/"
                component={InitComponent}
                exact={true}
                layout={InitLayoutComponent}
              /> */}

              {/* <RouteWithLayout
                path="/login/:loginStatus?"
                component={LoginWeb}
                exact={true}
                layout={WebsiteView}
              /> */}
              {/* <RouteWithLayout
                path="/joinschool"
                component={Invitation}
                exact={true}
                layout={WebsiteView}
              /> */}
              {/* <RouteWithLayout
                path="/newschool"
                component={RegisterWeb}
                exact={true}
                layout={WebsiteView}
              /> */}
              {/* <RouteWithLayout
                path="/files"
                component={FilesPage}
                exact={true}
                layout={WebsiteView}
              /> */}

              {/* <RouteWithLayout
                path="/getstarted/:showtour?/:role?"
                component={TourComponent}
                exact={true}
                layout={NoMenuView}
              /> */}

              {/* <RouteWithLayout
                path="/contacts/:showtour?/:tourrole?"
                component={ContactsPage}
                exact={true}
                layout={MainView}
              /> */}
              {/* <RouteWithLayout
                path="/lcontacts/:showtour?/:tourrole?"
                component={LearnerContactsPage}
                exact={true}
                layout={ClientMainView}
              /> */}
              {/* <RouteWithLayout
                path="/groups"
                component={GroupsPage}
                exact={true}
                layout={MainView}
              /> */}
              <RouteWithLayout
                path="/messaging/:id?"
                component={Message}
                exact={true}
                layout={MainView}
              />
              <RouteWithLayout
                path="/lgroups"
                component={GroupsPage}
                exact={true}
                layout={ClientMainView}
              />
              <RouteWithLayout
                path="/lmessaging/:id?"
                component={Message}
                exact={true}
                layout={ClientMainView}
              />
              {/* <RouteWithLayout
                path="/show-pdf"
                component={ShowPDF}
                exact={true}
                layout={MainView}
              /> */}
              {/* <RouteWithLayout
                path="/pendingApproval"
                component={PendingApproval}
                exact={true}
                layout={WebsiteView}
              /> */}
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      </Suspense>
    </IonApp>
  );
}
