import { useEffect, useState } from 'react';
import { Button } from 'rsuite';
import RegisterWeb from '../../components/register-web/register-web';
import Invitation from '../../components/register-web/invitation';

import LoginMobile from '../../components/login-mobile/login-mobile';
import LoginWeb from '../../components/login-web/login-web';
import './home.css'

const Register = () => {
    const [mobile, setMobile] = useState(window.innerWidth < 992)
    
    return (

        <div className={!mobile ? 'register-page web' : 'register-page mobile'}>
            <div className='brand-container'>
                        <img src="/assets/logo.png" alt="logo" />
                        <p>Your profile is pending approval from your school. 
                            We will inform you as soon as it is approved. </p>
            
            </div>

        </div>
    );
}
export default Register;
