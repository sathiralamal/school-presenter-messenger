import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Storage } from "@ionic/storage";
import { Avatar, Button, Dropdown, Drawer, Icon, IconButton, Modal, Nav, Navbar } from "rsuite";
import { NavLink, Link } from "react-router-dom";
//import AppInstallPopup from '../app-install-popup/app-install-popup';
//import NotificationPopup from '../notification-popup/notification-popup';
import "./header.css";
import ProfilePage from "../../../pages/profile/profile-page";

//redux
import { connect } from "react-redux";
import { classesSetData } from "../../../stores/classes/actions";
import { gradeSetData } from "../../../stores/grades/actions";
import { conversationsSetData } from "../../../stores/messages/actions";
import { contactsResetContacts } from "../../../stores/contacts/actions";
import { isTSConstructSignatureDeclaration } from "@babel/types";
import {
    CACHE_USER_LOGIN_ID,
    TENANT_ID,
    CACHE_USER_PROFILE_URL,
    CACHE_USER_LOGIN_ROLE_NAME,
} from "../../../utils/StorageUtil";

import * as integration from "scholarpresent-integration";

const Header: React.FC<{
    classesSetData: Function;
    gradeSetData: Function;
    conversationsSetData: Function;
    contactsResetContacts: Function;
}> = ({ classesSetData, gradeSetData, conversationsSetData, contactsResetContacts }) => {
    const history = useHistory();
    const [mobile, setMobile] = useState(window.innerWidth < 992);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModal2, setShowModal2] = useState<boolean>(false);
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const [showHowTo, setShowHowTo] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>();
    const [countGroupAdmin, setCountGroupAdmin] = useState<number>(0);

    const store = new Storage();

    useEffect(() => {
        handleGroupView();
    }, []);

    const handleGroupView = async () => {
        await store.create();
        let userId = await store.get(CACHE_USER_LOGIN_ID);
        let groupAdmin = await integration.findUserBelongToGroup(userId);
        setCountGroupAdmin(groupAdmin.length);
    };
    const toggleModal = (flag = false) => {
        setShowModal(flag);
    };

    const toggleModal2 = (flag = false) => {
        setShowModal2(flag);
    };
    const handleLogout = async () => {
        const store = new Storage();
        await store.create();
        store.clear();
        classesSetData([]);
        gradeSetData([]);
        conversationsSetData([]);
        contactsResetContacts();
    };
    useEffect(() => {}, [mobile, window.innerWidth]);

    const goTo = (url: string) => {
        setActiveTab(url);
        history.push(url);
    };

    return (
        <>
            <div>
                <Navbar>
                    <Navbar.Header>
                        <img className="navbar-brand logo" src="assets/logo.png" alt="logo" />
                        {mobile && <Icon icon="ellipsis-v" size="lg" />}
                    </Navbar.Header>
                    <Navbar.Body>
                        <Nav appearance="subtle" justified pullRight>
                            <Nav.Item id="clientContacts"
                                icon={<Icon size="2x" icon="id-badge" />}
                                active={activeTab === "contacts"}
                                onSelect={() => goTo("/lcontacts")}
                            >
                                Contacts
                            </Nav.Item>
                            {countGroupAdmin > 0 ? (
                                <Nav.Item id="clientGroup"
                                    icon={<Icon size="2x" icon="group" />}
                                    active={activeTab === "groups"}
                                    onSelect={() => goTo("/lgroups")}
                                >
                                    Groups
                                </Nav.Item>
                            ) : (
                                ""
                            )}
                            <Nav.Item id="messaging"
                                icon={<Icon size="2x" icon="wechat" />}
                                active={activeTab === "messaging"}
                                onSelect={() => goTo("/lmessaging")}
                            >
                                Messaging
                            </Nav.Item>
                            <Dropdown
                                className="menu-dropdown"
                                icon={
                                    !mobile ? (
                                        <IconButton
                                            color="green"
                                            appearance="primary"
                                            icon={<Icon icon="user" />}
                                            circle
                                        />
                                    ) : (
                                        <></>
                                    )
                                }
                                placement="bottomEnd"
                            >
                                <Dropdown.Item id="myProfile"
                                    icon={<Icon className="text-green" icon="user" />}
                                    onSelect={() => setShowProfile(!showProfile)}
                                >
                                    My Profile
                                </Dropdown.Item>
                                <Dropdown.Item id="logout"
                                    icon={<Icon icon="sign-out" />}
                                    onClick={() => {
                                        goTo("/login");
                                        handleLogout();
                                    }}
                                >
                                    Logout
                                </Dropdown.Item>
                                <Dropdown.Item
                                    icon={<Icon className="text-green" icon="support" />}
                                    onClick={() => setShowHowTo(true)}
                                >
                                    How To
                                </Dropdown.Item>
                            </Dropdown>
                        </Nav>
                    </Navbar.Body>
                    <Nav></Nav>
                </Navbar>

                <Modal size="xs" show={showModal} onHide={() => toggleModal(false)}>
                    <Modal.Body className="ion-no-padding modal-no-margin"></Modal.Body>
                </Modal>

                <Modal size="xs" show={showModal2} onHide={() => toggleModal2(false)}>
                    <Modal.Body className="ion-no-padding modal-no-margin"></Modal.Body>
                </Modal>

                <Drawer size="xs" show={showProfile} onHide={() => setShowProfile(false)}>
                    <div className="profile-modal">
                        <ProfilePage setShow={setShowProfile} size="web" type="profile" title="My Profile" />
                    </div>
                </Drawer>

                <Drawer size="xs" show={showHowTo} onHide={() => setShowHowTo(false)}>
                    <div className="profile-modal">
                        <ProfilePage setShow={setShowHowTo} size="web" type="howTo" title="How to" />
                    </div>
                </Drawer>
            </div>
        </>
    );
};
const mapStateToProps = (state: any) => ({});
const mapDispatchToProps = {
    classesSetData,
    gradeSetData,
    conversationsSetData,
    contactsResetContacts,
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
