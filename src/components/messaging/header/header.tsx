import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dropdown, Icon, IconButton, Modal, Nav, Navbar } from 'rsuite';
import AppInstallPopup from '../app-install-popup/app-install-popup';
import NotificationPopup from '../notification-popup/notification-popup';

import './header.css'

const Header = () => {
    const [mobile, setMobile] = useState(window.innerWidth < 992)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showModal2, setShowModal2] = useState<boolean>(false)

    const toggleModal = (flag = false) => {
        setShowModal(flag)
    }
    const toggleModal2 = (flag = false) => {
        setShowModal2(flag)
    }

    useEffect(() => {
    }, [mobile, window.innerWidth])

    return (
        <>
            <Navbar>
                <Navbar.Header>
                    <img className="navbar-brand logo" src="assets/logo.png" alt="logo" />
                    {mobile &&
                        <Icon icon='ellipsis-v' size='lg' />}
                </Navbar.Header>
                <Navbar.Body>
                    <Nav pullRight>
                        <Nav.Item>
                            <div onClick={() => toggleModal(true)} className='menu-item-inner'>
                                <Icon size="lg" icon="th-large" />
                                <span>Dashboard</span>
                            </div>
                        </Nav.Item>
                        <Nav.Item id="contacts">
                            <div onClick={() => toggleModal2(true)} className='menu-item-inner'>
                                <Icon size="lg" icon="id-badge" />
                                <span>Contacts</span>
                            </div>
                        </Nav.Item>
                        <Nav.Item id="groups">
                            <div className='menu-item-inner'>
                                <Icon size="lg" icon="group" />
                                <span>Groups</span>
                            </div>
                        </Nav.Item>
                        <Nav.Item active id="messaging">
                            <div className='menu-item-inner'>
                                <Icon size="lg" icon="wechat" />
                                <span>Messaging</span>
                            </div>
                        </Nav.Item>
                        <Nav.Item id="calendar">
                            <div className='menu-item-inner'>
                                <Icon size="lg" icon="calendar" />
                                <span>Calendar</span>
                            </div>
                        </Nav.Item>
                        <Nav.Item id="polls">
                            <div className='menu-item-inner'>
                                <Icon size="lg" icon="trello" />
                                <span>Polls</span>
                            </div>
                        </Nav.Item>
                    </Nav>
                </Navbar.Body>
            </Navbar>

            <Modal size="xs" show={showModal} onHide={() => toggleModal(false)}>
                <Modal.Body className='ion-no-padding modal-no-margin'>
                    <AppInstallPopup />
                </Modal.Body>
            </Modal>
            <Modal size="xs" show={showModal2} onHide={() => toggleModal2(false)}>
                <Modal.Body className='ion-no-padding modal-no-margin'>
                    <NotificationPopup />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Header;