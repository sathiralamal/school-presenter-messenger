/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { IonPage, IonHeader, IonToolbar, IonContent } from "@ionic/react";
import { Navbar, Nav, Dropdown, IconButton, Icon } from "rsuite";
import {
    Capacitor,
    // PushNotification,
    // PushNotificationToken,
    // PushNotificationActionPerformed,
} from "@capacitor/core";
// components
import Header from "../../components/template/header/header";
import PrivacyPolicyPage from "../../pages/policies/privacy-policy";

import "./websiteView.css";
import "./header.css";
import { useHistory, BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const MainView: React.FC<{ children: any }> = ({ children }) => {
    let history = useHistory();
    const goTo = (url: string) => {
        history.push(url);
    };

    const [drawer, setDrawer] = useState(false);
    const toggleDrawer = () => setDrawer((state) => !state);

    const handleJoinMySchool = () => {
        toggleDrawer();
        goTo("/joinschool");
    };

    const handleNewSchool = () => {
        toggleDrawer();
        goTo("/newschool");
    };

    const handleLogin = () => {
        toggleDrawer();
        goTo("/login");
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-white p-1 navbar-section">
                <div className="container">
                    <a className="navbar-brand image-section" href="/">
                        <img src="assets/logo.png" alt="" className="d-inline-block align-text-top" />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={toggleDrawer}
                    >
                        <span
                            className={drawer ? "navbar-toggler-icon cross-icon" : "navbar-toggler-icon menu-icon"}
                        ></span>
                    </button>
                    <div
                        className={
                            drawer
                                ? "collapse navbar-collapse button-container show"
                                : "collapse navbar-collapse button-container"
                        }
                        id="navbarNavDropdown"
                    >
                        {Capacitor.getPlatform() === "web"?
                        <ul className="navbar-nav ms-lg-auto">
                            <li className="nav-item">
                                <a
                                    className="nav-link active fw-600 primary-text px-3"
                                    aria-current="page"
                                    href="https://scholarpresent.com"
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link fw-600 primary-text px-3"
                                    href="https://scholarpresent.com/downloadapp"
                                >
                                    Download App
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link fw-600 primary-text px-3"
                                    href="https://scholarpresent.com/aboutus"
                                >
                                    About Us
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link fw-600 primary-text px-3" href="https://scholarpresent.com/faq">
                                    FAQs
                                </a>
                            </li>
                            <li className="nav-item pe-5">
                                <a
                                    className="nav-link fw-600 primary-text px-3"
                                    href="https://scholarpresent.com/contactus"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>:""}

                        <a
                            className="nav-link fw-300 primary-text pe-5 secondary-text sin-up-btn nav-button-device"
                            onClick={handleLogin}
                        >
                            Sign In
                        </a>

                        <Dropdown
                            title="Register"
                            className="register-dropdown-container"
                            toggleClassName="register-dropdown"
                        >
                            <Dropdown.Item
                                icon={<Icon className="text-green" icon="user-plus" />}
                                onSelect={handleJoinMySchool}
                                className="register-dropdown-item"
                            >
                                Join My School
                            </Dropdown.Item>
                            <Dropdown.Item icon={<Icon icon="home" />} onSelect={handleNewSchool}>
                                New School
                            </Dropdown.Item>
                        </Dropdown>
                        {/* mobile view */}

                        {/* <button className="btn btn-success  secondary-btn fs-12 px-4 reg-btn" type="submit">Register</button> */}
                    </div>
                </div>
            </nav>

            {children}
            {/* A <Switch> looks through its children <Route>s and
    renders the first one that matches the current URL. */}
        </div>
    );
    // return (
    //   <IonPage>
    //     <IonHeader>
    //       <IonToolbar>
    //         <Navbar>
    //           <Navbar.Header>
    //             <img
    //               className="navbar-brand logo"
    //               src="assets/logo.png"
    //               alt="logo"
    //             />
    //           </Navbar.Header>
    //           <Navbar.Body>
    //             <Nav appearance="subtle" justified pullRight>
    //               <Nav.Item icon={<Icon className="text-green" icon="user" />} onSelect={()=>goTo("/login")}>Login</Nav.Item>
    //               <Dropdown
    //                 className="menu-dropdown"
    //                 title="Register"
    //                 placement="leftStart"
    //                 icon={<Icon className="text-green" icon="plus" />}
    //               >
    //                 <Dropdown.Item icon={<Icon className="text-green" icon="user-plus" />}  onSelect={()=>goTo("/joinschool")} >
    //                   Join My School
    //                 </Dropdown.Item>
    //                 <Dropdown.Item
    //                   icon={<Icon icon="home" />}
    //                   onSelect={()=>goTo("/newschool")}
    //                 >
    //                   New School
    //                 </Dropdown.Item>

    //               </Dropdown>
    //             </Nav>
    //           </Navbar.Body>
    //         </Navbar>
    //       </IonToolbar>
    //     </IonHeader>
    //     <IonContent className="mainView-Content" fullscreen>
    //       {children}
    //     </IonContent>
    //   </IonPage>
    // );
};

export default MainView;

{
    /* <nav className="navbar navbar-expand-lg navbar-light bg-white p-1 navbar-section">
            <div className="container">
                <a className="navbar-brand image-section" href="https://scholarpresent.com">
                    <img src="assets/logo.png" alt="" className="d-inline-block align-text-top" />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-lg-auto">
                        <li className="nav-item">
                            <a className="nav-link active fw-600 primary-text px-3" aria-current="page" href="https://scholarpresent.com">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-600 primary-text px-3" href="https://scholarpresent.com/downloadapp">Download App</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-600 primary-text px-3" href="https://scholarpresent.com/aboutus">About Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-600 primary-text px-3" href="https://scholarpresent.com/faq">FAQs</a>
                        </li>
                        <li className="nav-item pe-5">
                            <a className="nav-link fw-600 primary-text px-3" href="https://scholarpresent.com/contactus">Contact Us</a>
                        </li>

                    </ul>
                
                    <Link className="nav-link fw-600 primary-text pe-5 secondary-text sin-up-btn nav-button-device" to="/login">Login</Link>
                    {/* <a className="nav-link fw-600  reg-btn nav-button-device " href="#">Register</a> */
}

{
    /* mobile view */
}
//             <a className="nav-link fw-600  reg-btn nav-button-mobile-device" href="#">Register</a>
//             <a className="nav-link fw-600 primary-text pe-5 secondary-text sin-up-btn nav-button-mobile-device" href="#">Sign In</a>
//             {/* <button className="btn btn-success  secondary-btn fs-12 px-4 reg-btn" type="submit">Register</button> */}
//             <Dropdown
//           className="reg-btn"
//           title="Register"
//           placement="bottomEnd"
//           // icon={<Icon className="text-green" icon="plus" />}
//         >
//           <Dropdown.Item icon={<Icon className="text-green" icon="user-plus" />}  onSelect={()=>goTo("/joinschool")} >
//             Join My School
//           </Dropdown.Item>
//           <Dropdown.Item
//             icon={<Icon icon="home" />}
//             onSelect={()=>goTo("/newschool")}
//           >
//             New School
//           </Dropdown.Item>

//         </Dropdown>
//         </div>
//     </div>
// </nav> */}
