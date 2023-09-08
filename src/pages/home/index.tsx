import { useEffect, useState } from 'react';
import { Button } from 'rsuite';
import RegisterWeb from '../../components/register-web/register-web';
import Invitation from '../../components/register-web/invitation';

import LoginWeb from '../../components/login-web/login-web';
import './home.css'

const Register = () => {
    const [mobile, setMobile] = useState(window.innerWidth < 992)
    const [show, setShow] = useState<boolean>(false)
    const [login, setLogin] = useState<boolean>(false)
    const [newSchool, setNewSchool] = useState<boolean>(false)
    const [invitation, setInvitation] = useState<boolean>(false)

    const [showLogo, setShowLogo] = useState<boolean>(true)

    useEffect(() => {
        // setTimeout(() => {
        //     if (!mobile) {
        //         // setShow(true)
        //     } else {
        //         setShowLogo(false)
        //     }
        // }, 2000)
    }, [])

    // useEffect(() => {
    //     if (!show) {
    //         setNewSchool(false)
    //     }
    // }, [show])

    // useEffect(() => {
    //     if (!show) {
    //         setNewSchool(false)
    //     }
    // }, [login])

    // useEffect(() => {
    //     console.log("useEffect invitation :", invitation)
    // }, [invitation])

    // useEffect(() => {
    //     if(mobile){
    //         setShowLogo(false);
    //     }
    // }, [mobile,login,invitation,newSchool, show])

    const createNewSchool = async () => {
        await setNewSchool(true)
        setShow(true)
    }

    return (

        <div className={!mobile ? 'register-page web' : 'register-page mobile'}>
            {console.log("mobile ",mobile, " showLogo ", showLogo, " newSchool ", 
            newSchool, " login ",login, " invitation ", invitation )}
            {
                showLogo &&
                <div className='brand-container'>
                    <img src="/assets/logo.png" alt="logo" />
                    <p>Communication and Collaboration</p>
                    <Button id="homeLoginBtn" className='ion-margin-right' color='green' size='sm' onClick={() => {setLogin(true);setShow(true);setShowLogo(false);}}>Login</Button>&nbsp;&nbsp;
                    <Button id="homeRegisterBtn" className='ion-margin-right' color='green' size='sm' onClick={() => {setInvitation(true);setShow(true);setShowLogo(false);}}>Register User</Button>&nbsp;&nbsp;
                    <Button id="homeNewSchoolBtn" color='green' size='sm' onClick={() => createNewSchool()}>New School</Button>

                </div>
            }
            {
                mobile  
                // && !showLogo &&!newSchool&&!login 
                ? 
                    <div className='brand-container'>
                        <img src="/assets/logo.png" alt="logo" />
                        <p>Communication and Collaboration</p>
                        <Button id="homeLoginBtn" className='ion-margin-right' color='green' size='sm' onClick={() => {setLogin(true);setShow(true);}}>Login</Button>&nbsp;&nbsp;
                        <Button id="homeRegisterBtn" className='ion-margin-right' color='green' size='sm' onClick={() => {setInvitation(true);setShow(true);setShowLogo(false);} }>Register User</Button>&nbsp;&nbsp;
                        <Button id="homeNewSchoolBtn" color='green' size='sm' onClick={() => createNewSchool()}>New School</Button>

                    </div>:
                    login?
                        <div className='RegisterWeb-modal'>
                            <p className='tag-line'>Making our schools great!</p>
                            <LoginWeb id="loginWebBtn" newSchool={newSchool} show={show} setShow={setShow} />
                        </div>  
                    :invitation? 
                        <div className='RegisterWeb-modal'>
                            <Invitation id="invitationBtn" show={show} setShow={setShow}/>
                        </div>
                        :<div className='RegisterWeb-modal'>
                            <p className='tag-line'>Making our schools great!</p>
                            <RegisterWeb id="registerWebBtn" newSchool={newSchool} show={show} setShow={setShow} />
                        </div>
                    
            }
        </div>
    );
}
export default Register;
