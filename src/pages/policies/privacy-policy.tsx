import React from "react";
import { useEffect, useState , useRef} from "react";
import { Button, InputGroup,Uploader,Progress, Icon, Input, Grid, Row, Col, Message, Modal } from "rsuite";

import './privacy-policy.css'


const PrivacyPolicyPage = (props: any) => {
    const [show, setShow] = useState(false);
    const titleRef = useRef()

  const handleBackClick=()=> {
        //titleRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

    return (
        <div className="profile-page-container">
            <div className="banner">
                <h3 className="page-title">{props.title}</h3>
                {props.setShow && <Icon onClick={() => props.setShow(false)} icon="angle-up" size="2x" />}
            </div>
            <div className="scrollable-component">
                    <div>
                        <br />
                    </div>
                    <div>
                        <h5>Privacy Policy</h5>
                    </div>
                    <div>
                        <strong>Last updated&nbsp;May 01, 2023</strong>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        This privacy notice for&nbsp;iConnect99 Pty (LTD)&nbsp;("&nbsp;<strong>Company</strong> ," "
                        <strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"&nbsp;), describes how and
                        why we might collect, store, use, and/or share (&nbsp;"<strong>process</strong>") your
                        information when you use our services ("<strong>Services</strong>"), such as when you:
                    </div>
                    <ul>
                        <li>
                            Visit our website&nbsp;at&nbsp;
                            <a href="http://www.scholarpresent.com/" target="_blank">
                                http://www.scholarpresent.com
                            </a>{" "}
                            , or any website of ours that links to this privacy notice
                        </li>
                    </ul>
                    <div>
                        <br />
                    </div>
                    <ul>
                        <li>
                            Download and use&nbsp;our mobile application&nbsp;(Scholar Present)&nbsp;,&nbsp;or any other
                            application of ours that links to this privacy notice
                        </li>
                    </ul>
                    <div>
                        <br />
                    </div>
                    <ul>
                        <li>Engage with us in other related ways, including any sales, marketing, or events</li>
                    </ul>
                    <div>
                        <strong>Questions or concerns?&nbsp;</strong>Reading this privacy notice will help you
                        understand your privacy rights and choices. If you do not agree with our policies and practices,
                        please do not use our Services. If you still have any questions or concerns, please contact us
                        at&nbsp;info@scholarpresent.com.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>SUMMARY OF KEY POINTS</strong>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>
                            <em>
                                This summary provides key points from our privacy notice, but you can find out more
                                details about any of these topics by clicking the link following each key point or by
                                using our table of contents below to find the section you are looking for. You can also
                                click&nbsp;
                            </em>
                        </strong>
                        <a href="http://localhost:3000/privacypolicy.html#toc">
                            <strong>
                                <em>here</em>
                            </strong>
                        </a>
                        <strong>
                            <em>&nbsp;to go directly to our table of contents.</em>
                        </strong>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>What personal information do we process?</strong> When you visit, use, or navigate our
                        Services, we may process personal information depending on how you interact with&nbsp;iConnect99
                        Pty (LTD)&nbsp;and the Services, the choices you make, and the products and features you use.
                        Click &nbsp;<a href="http://localhost:3000/privacypolicy.html#personalinfo">here</a> to learn
                        more.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>Do we process any sensitive personal information?</strong> We do not process sensitive
                        personal information.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>Do we receive any information from third parties?</strong> We do not receive any
                        information from third parties.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>How do we process your information?</strong> We process your information to provide,
                        improve, and administer our Services, communicate with you, for security and fraud prevention,
                        and to comply with law. We may also process your information for other purposes with your
                        consent. We process your information only when we have a valid legal reason to do so.
                        Click&nbsp;<a href="http://localhost:3000/privacypolicy.html#infouse">here</a> to learn more.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>
                            In what situations and with which&nbsp;parties do we share personal information?
                        </strong>{" "}
                        We may share information in specific situations and with specific&nbsp;third parties.
                        Click&nbsp;<a href="http://localhost:3000/privacypolicy.html#whoshare">here</a> to learn more.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>How do we keep your information safe?</strong> We have&nbsp;organizational&nbsp;and
                        technical processes and procedures in place to protect your personal information. However, no
                        electronic transmission over the internet or information storage technology can be guaranteed to
                        be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or
                        other&nbsp;unauthorized&nbsp;third parties will not be able to defeat our security and
                        improperly collect, access, steal, or modify your information. Click&nbsp;
                        <a href="http://localhost:3000/privacypolicy.html#infosafe">here</a> to learn more.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>What are your rights?</strong> Depending on where you are located geographically, the
                        applicable privacy law may mean you have certain rights regarding your personal information.
                        Click&nbsp;<a href="http://localhost:3000/privacypolicy.html#privacyrights">here</a> to learn
                        more.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by
                        filling out our data subject request form available&nbsp;here:&nbsp;
                        <a href="https://www.scholarpresent.com/contactus" target="_blank">
                            https://www.scholarpresent.com/contactus
                        </a>{" "}
                        , or by contacting us. We will consider and act upon any request in accordance with applicable
                        data protection laws.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        Want to learn more about what&nbsp;Scholar Present&nbsp;does with any information we
                        collect? Click &nbsp;<a href="http://localhost:3000/privacypolicy.html#toc">here</a> to review
                        the notice in full.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>TABLE OF CONTENTS</strong>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#infocollect">
                            1. WHAT INFORMATION DO WE COLLECT?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#infouse">
                            2. HOW DO WE PROCESS YOUR INFORMATION?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#whoshare">
                            3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#inforetain">
                            4. HOW LONG DO WE KEEP YOUR INFORMATION?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#infosafe">
                            5. HOW DO WE KEEP YOUR INFORMATION SAFE?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#privacyrights">
                            6. WHAT ARE YOUR PRIVACY RIGHTS?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#DNT">7. CONTROLS FOR DO-NOT-TRACK FEATURES</a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#caresidents">
                            8. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#policyupdates">
                            9. DO WE MAKE UPDATES TO THIS NOTICE?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#contact">
                            10. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                        </a>
                    </div>
                    <div>
                        <a href="http://localhost:3000/privacypolicy.html#request">
                            11. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
                        </a>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>1. WHAT INFORMATION DO WE COLLECT?</strong>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>Personal information you disclose to us</strong>
                    </div>
                    <div>
                        <br />
                        <div>
                            <strong>
                                <em>In Short:</em>
                            </strong>
                            <strong>
                                <em>&nbsp;</em>
                            </strong>
                            <em>We collect personal information that you provide to us.</em>
                        </div>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        We collect personal information that you voluntarily provide to us when you&nbsp;register on the
                        Services,&nbsp;&nbsp;express an interest in obtaining information about us or our products and
                        Services, when you participate in activities on the Services, or otherwise when you contact us.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>Personal Information Provided by You.</strong> The personal information that we collect
                        depends on the context of your interactions with us and the Services, the choices you make, and
                        the products and features you use. The personal information we collect may include the
                        following:
                    </div>
                    <ul>
                        <li>names</li>
                    </ul>
                    <div>
                        <br />
                    </div>
                    <ul>
                        <li>phone numbers</li>
                    </ul>
                    <div>
                        <br />
                    </div>
                    <ul>
                        <li>email addresses</li>
                    </ul>
                    <div>
                        <br />
                    </div>
                    <ul>
                        <li>contact preferences</li>
                    </ul>
                    <div>
                        <br />
                    </div>
                    <ul>
                        <li>usernames</li>
                    </ul>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>Sensitive Information.</strong> We do not process sensitive information.
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <strong>Application Data.</strong> If you use our application(s), we also may collect the
                        following information if you choose to provide us with access or permission:
                        <div>
                            <div>
                                <div>
                                    <br />
                                </div>
                                <ul>
                                    <li>
                                        <em>Push Notifications.</em> We may request to send you push notifications
                                        regarding your account or certain features of the application(s). If you wish to
                                        opt out from receiving these types of communications, you may turn them off in
                                        your device's settings.
                                    </li>
                                </ul>
                                <div>
                                    This information is primarily needed to maintain the security and operation of our
                                    application(s), for troubleshooting, and for our internal analytics and reporting
                                    purposes.
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>
                                    All personal information that you provide to us must be true, complete, and
                                    accurate, and you must notify us of any changes to such personal information.
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>
                                    <strong>Information automatically collected</strong>
                                </div>
                                <div>
                                    <strong>
                                        <em>In Short:</em>
                                    </strong>
                                    <strong>
                                        <em>&nbsp;</em>
                                    </strong>
                                    <em>
                                        Some information — such as your Internet Protocol (IP) address and/or browser
                                        and device characteristics — is collected automatically when you visit our
                                        Services.
                                    </em>
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>
                                    We automatically collect certain information when you visit, use, or navigate the
                                    Services. This information does not reveal your specific identity (like your name or
                                    contact information) but may include device and usage information, such as your IP
                                    address, browser and device characteristics, operating system, language preferences,
                                    referring URLs, device name, country, location, information about how and when you
                                    use our Services, and other technical information. This information is primarily
                                    needed to maintain the security and operation of our Services, and for our internal
                                    analytics and reporting purposes.
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>The information we collect includes:</div>
                                <ul>
                                    <li>
                                        <em>Log and Usage Data.</em> Log and usage data is service-related, diagnostic,
                                        usage, and performance information our servers automatically collect when you
                                        access or use our Services and which we record in log files. Depending on how
                                        you interact with us, this log data may include your IP address, device
                                        information, browser type, and settings and information about your activity in
                                        the Services&nbsp;(such as the date/time stamps associated with your usage,
                                        pages and files viewed, searches, and other actions you take such as which
                                        features you use), device event information (such as system activity, error
                                        reports (sometimes called&nbsp;"crash dumps"), and hardware settings).
                                    </li>
                                </ul>
                                <div>
                                    <br />
                                </div>
                                <ul>
                                    <li>
                                        <em>Device Data.</em> We collect device data such as information about your
                                        computer, phone, tablet, or other device you use to access the Services.
                                        Depending on the device used, this device data may include information such as
                                        your IP address (or proxy server), device and application identification
                                        numbers, location, browser type, hardware model, Internet service provider
                                        and/or mobile carrier, operating system, and system configuration information.
                                    </li>
                                </ul>
                                <div>
                                    <br />
                                </div>
                                <ul>
                                    <li>
                                        <em>Location Data.</em> We collect location data such as information about your
                                        device's location, which can be either precise or imprecise. How much
                                        information we collect depends on the type and settings of the device you use to
                                        access the Services. For example, we may use GPS and other technologies to
                                        collect geolocation data that tells us your current location (based on your IP
                                        address). You can opt out of allowing us to collect this information either by
                                        refusing access to the information or by disabling your Location setting on your
                                        device. However, if you choose to opt out, you may not be able to use certain
                                        aspects of the Services.
                                    </li>
                                </ul>
                                <div>
                                    <strong>2. HOW DO WE PROCESS YOUR INFORMATION?</strong>
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>
                                    <strong>
                                        <em>In Short:&nbsp;</em>
                                    </strong>
                                    <em>
                                        We process your information to provide, improve, and administer our Services,
                                        communicate with you, for security and fraud prevention, and to comply with law.
                                        We may also process your information for other purposes with your consent.
                                    </em>
                                </div>
                                <div>
                                    <br />
                                </div>
                                <div>
                                    <strong>
                                        We process your personal information for a variety of reasons, depending on how
                                        you interact with our Services, including:
                                    </strong>
                                </div>
                                <ul>
                                    <li>
                                        <strong>
                                            To facilitate account creation and authentication and otherwise manage user
                                            accounts.&nbsp;
                                        </strong>
                                        We may process your information so you can create and log in to your account, as
                                        well as keep your account in working order.
                                    </li>
                                </ul>
                                <div>
                                    <br />
                                </div>
                                <ul>
                                    <li>
                                        <strong>
                                            To deliver and facilitate delivery of services to the user.&nbsp;
                                        </strong>
                                        We may process your information to provide you with the requested service.
                                    </li>
                                </ul>
                                <div>
                                    <div>
                                        <div>
                                            <div>
                                                <br />
                                            </div>
                                            <ul>
                                                <li>
                                                    <strong>To send administrative information to you.&nbsp;</strong>We
                                                    may process your information to send you details about our products
                                                    and services, changes to our terms and policies, and other similar
                                                    information.
                                                </li>
                                            </ul>
                                            <div>
                                                <div>
                                                    <br />
                                                </div>
                                                <ul>
                                                    <li>
                                                        <strong>
                                                            To&nbsp;fulfill&nbsp;and manage your orders.&nbsp;
                                                        </strong>
                                                        We may process your information to&nbsp;fulfill&nbsp;and manage
                                                        your orders, payments, returns, and exchanges made through the
                                                        Services.
                                                    </li>
                                                </ul>
                                                <div>
                                                    <p>
                                                        <br />
                                                    </p>
                                                    <ul>
                                                        <li>
                                                            <strong>
                                                                To enable user-to-user communications.&nbsp;
                                                            </strong>
                                                            We may process your information if you choose to use any of
                                                            our offerings that allow for communication with another
                                                            user.
                                                        </li>
                                                    </ul>
                                                    <p>
                                                        <br />
                                                    </p>
                                                    <p>
                                                        <br />
                                                    </p>
                                                    <ul>
                                                        <li>
                                                            <strong>To request feedback.&nbsp;</strong>We may process
                                                            your information when necessary to request feedback and to
                                                            contact you about your use of our Services.
                                                        </li>
                                                    </ul>
                                                    <p>
                                                        <br />
                                                    </p>
                                                    <div>
                                                        <div>
                                                            <div>
                                                                <div>
                                                                    <div>
                                                                        <div>
                                                                            <div>
                                                                                <div>
                                                                                    <div>
                                                                                        <br />
                                                                                    </div>
                                                                                    <ul>
                                                                                        <li>
                                                                                            <strong>
                                                                                                To evaluate and improve
                                                                                                our Services, products,
                                                                                                marketing, and your
                                                                                                experience.
                                                                                            </strong>{" "}
                                                                                            We may process your
                                                                                            information when we believe
                                                                                            it is necessary to identify
                                                                                            usage trends, determine the
                                                                                            effectiveness of our
                                                                                            promotional campaigns, and
                                                                                            to evaluate and improve our
                                                                                            Services, products,
                                                                                            marketing, and your
                                                                                            experience.
                                                                                        </li>
                                                                                    </ul>
                                                                                    <div>
                                                                                        <br />
                                                                                    </div>
                                                                                    <ul>
                                                                                        <li>
                                                                                            <strong>
                                                                                                To identify usage
                                                                                                trends.
                                                                                            </strong>{" "}
                                                                                            We may process information
                                                                                            about how you use our
                                                                                            Services to better
                                                                                            understand how they are
                                                                                            being used so we can improve
                                                                                            them.
                                                                                        </li>
                                                                                    </ul>
                                                                                    <div>
                                                                                        <div>
                                                                                            <div>
                                                                                                <div>
                                                                                                    <div>
                                                                                                        <div>
                                                                                                            <br />
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <br />
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <strong>
                                                                                                                3. WHEN
                                                                                                                AND WITH
                                                                                                                WHOM DO
                                                                                                                WE SHARE
                                                                                                                YOUR
                                                                                                                PERSONAL
                                                                                                                INFORMATION?
                                                                                                            </strong>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <br />
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <strong>
                                                                                                                <em>
                                                                                                                    In
                                                                                                                    Short:
                                                                                                                </em>
                                                                                                            </strong>
                                                                                                            <em>
                                                                                                                &nbsp;We
                                                                                                                may
                                                                                                                share
                                                                                                                information
                                                                                                                in
                                                                                                                specific
                                                                                                                situations
                                                                                                                described
                                                                                                                in this
                                                                                                                section
                                                                                                                and/or
                                                                                                                with the
                                                                                                                following&nbsp;third
                                                                                                                parties.
                                                                                                            </em>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <br />
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <br />
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            We&nbsp;may
                                                                                                            need to
                                                                                                            share your
                                                                                                            personal
                                                                                                            information
                                                                                                            in the
                                                                                                            following
                                                                                                            situations:
                                                                                                        </div>
                                                                                                        <ul>
                                                                                                            <li>
                                                                                                                <strong>
                                                                                                                    Business
                                                                                                                    Transfers.
                                                                                                                </strong>{" "}
                                                                                                                We may
                                                                                                                share or
                                                                                                                transfer
                                                                                                                your
                                                                                                                information
                                                                                                                in
                                                                                                                connection
                                                                                                                with, or
                                                                                                                during
                                                                                                                negotiations
                                                                                                                of, any
                                                                                                                merger,
                                                                                                                sale of
                                                                                                                company
                                                                                                                assets,
                                                                                                                financing,
                                                                                                                or
                                                                                                                acquisition
                                                                                                                of all
                                                                                                                or a
                                                                                                                portion
                                                                                                                of our
                                                                                                                business
                                                                                                                to
                                                                                                                another
                                                                                                                company.
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                        <div>
                                                                                                            <div>
                                                                                                                <div>
                                                                                                                    <div>
                                                                                                                        <br />
                                                                                                                    </div>
                                                                                                                    <ul>
                                                                                                                        <li>
                                                                                                                            <strong>
                                                                                                                                Other
                                                                                                                                Users.
                                                                                                                            </strong>{" "}
                                                                                                                            When
                                                                                                                            you
                                                                                                                            share
                                                                                                                            personal
                                                                                                                            information&nbsp;(for
                                                                                                                            example,
                                                                                                                            by
                                                                                                                            posting
                                                                                                                            comments,
                                                                                                                            contributions,
                                                                                                                            or
                                                                                                                            other
                                                                                                                            content
                                                                                                                            to
                                                                                                                            the
                                                                                                                            Services)&nbsp;or
                                                                                                                            otherwise
                                                                                                                            interact
                                                                                                                            with
                                                                                                                            public
                                                                                                                            areas
                                                                                                                            of
                                                                                                                            the
                                                                                                                            Services,
                                                                                                                            such
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            may
                                                                                                                            be
                                                                                                                            viewed
                                                                                                                            by
                                                                                                                            all
                                                                                                                            users
                                                                                                                            and
                                                                                                                            may
                                                                                                                            be
                                                                                                                            publicly
                                                                                                                            made
                                                                                                                            available
                                                                                                                            outside
                                                                                                                            the
                                                                                                                            Services
                                                                                                                            in
                                                                                                                            perpetuity.&nbsp;Similarly,
                                                                                                                            other
                                                                                                                            users
                                                                                                                            will
                                                                                                                            be
                                                                                                                            able
                                                                                                                            to
                                                                                                                            view
                                                                                                                            descriptions
                                                                                                                            of
                                                                                                                            your
                                                                                                                            activity,
                                                                                                                            communicate
                                                                                                                            with
                                                                                                                            you
                                                                                                                            within
                                                                                                                            our
                                                                                                                            Services,
                                                                                                                            and
                                                                                                                            view
                                                                                                                            your
                                                                                                                            profile.
                                                                                                                        </li>
                                                                                                                    </ul>
                                                                                                                    <div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                4.
                                                                                                                                HOW
                                                                                                                                LONG
                                                                                                                                DO
                                                                                                                                WE
                                                                                                                                KEEP
                                                                                                                                YOUR
                                                                                                                                INFORMATION?
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                <em>
                                                                                                                                    In
                                                                                                                                    Short:&nbsp;
                                                                                                                                </em>
                                                                                                                            </strong>
                                                                                                                            <em>
                                                                                                                                We
                                                                                                                                keep
                                                                                                                                your
                                                                                                                                information
                                                                                                                                for
                                                                                                                                as
                                                                                                                                long
                                                                                                                                as
                                                                                                                                necessary
                                                                                                                                to&nbsp;fulfill&nbsp;the
                                                                                                                                purposes
                                                                                                                                outlined
                                                                                                                                in
                                                                                                                                this
                                                                                                                                privacy
                                                                                                                                notice
                                                                                                                                unless
                                                                                                                                otherwise
                                                                                                                                required
                                                                                                                                by
                                                                                                                                law.
                                                                                                                            </em>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            We
                                                                                                                            will
                                                                                                                            only
                                                                                                                            keep
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            for
                                                                                                                            as
                                                                                                                            long
                                                                                                                            as
                                                                                                                            it
                                                                                                                            is
                                                                                                                            necessary
                                                                                                                            for
                                                                                                                            the
                                                                                                                            purposes
                                                                                                                            set
                                                                                                                            out
                                                                                                                            in
                                                                                                                            this
                                                                                                                            privacy
                                                                                                                            notice,
                                                                                                                            unless
                                                                                                                            a
                                                                                                                            longer
                                                                                                                            retention
                                                                                                                            period
                                                                                                                            is
                                                                                                                            required
                                                                                                                            or
                                                                                                                            permitted
                                                                                                                            by
                                                                                                                            law
                                                                                                                            (such
                                                                                                                            as
                                                                                                                            tax,
                                                                                                                            accounting,
                                                                                                                            or
                                                                                                                            other
                                                                                                                            legal
                                                                                                                            requirements).
                                                                                                                            No
                                                                                                                            purpose
                                                                                                                            in
                                                                                                                            this
                                                                                                                            notice
                                                                                                                            will
                                                                                                                            require
                                                                                                                            us
                                                                                                                            keeping
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            for
                                                                                                                            longer
                                                                                                                            than&nbsp;the
                                                                                                                            period
                                                                                                                            of
                                                                                                                            time
                                                                                                                            in
                                                                                                                            which
                                                                                                                            users
                                                                                                                            have
                                                                                                                            an
                                                                                                                            account
                                                                                                                            with
                                                                                                                            us&nbsp;.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            When
                                                                                                                            we
                                                                                                                            have
                                                                                                                            no
                                                                                                                            ongoing
                                                                                                                            legitimate
                                                                                                                            business
                                                                                                                            need
                                                                                                                            to
                                                                                                                            process
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information,
                                                                                                                            we
                                                                                                                            will
                                                                                                                            either
                                                                                                                            delete
                                                                                                                            or&nbsp;anonymize&nbsp;such
                                                                                                                            information,
                                                                                                                            or,
                                                                                                                            if
                                                                                                                            this
                                                                                                                            is
                                                                                                                            not
                                                                                                                            possible
                                                                                                                            (for
                                                                                                                            example,
                                                                                                                            because
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            has
                                                                                                                            been
                                                                                                                            stored
                                                                                                                            in
                                                                                                                            backup
                                                                                                                            archives),
                                                                                                                            then
                                                                                                                            we
                                                                                                                            will
                                                                                                                            securely
                                                                                                                            store
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            and
                                                                                                                            isolate
                                                                                                                            it
                                                                                                                            from
                                                                                                                            any
                                                                                                                            further
                                                                                                                            processing
                                                                                                                            until
                                                                                                                            deletion
                                                                                                                            is
                                                                                                                            possible.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                5.
                                                                                                                                HOW
                                                                                                                                DO
                                                                                                                                WE
                                                                                                                                KEEP
                                                                                                                                YOUR
                                                                                                                                INFORMATION
                                                                                                                                SAFE?
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                <em>
                                                                                                                                    In
                                                                                                                                    Short:&nbsp;
                                                                                                                                </em>
                                                                                                                            </strong>
                                                                                                                            <em>
                                                                                                                                We
                                                                                                                                aim
                                                                                                                                to
                                                                                                                                protect
                                                                                                                                your
                                                                                                                                personal
                                                                                                                                information
                                                                                                                                through
                                                                                                                                a
                                                                                                                                system
                                                                                                                                of&nbsp;organizational&nbsp;and
                                                                                                                                technical
                                                                                                                                security
                                                                                                                                measures.
                                                                                                                            </em>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            We
                                                                                                                            have
                                                                                                                            implemented
                                                                                                                            appropriate
                                                                                                                            and
                                                                                                                            reasonable
                                                                                                                            technical
                                                                                                                            and&nbsp;organizational&nbsp;security
                                                                                                                            measures
                                                                                                                            designed
                                                                                                                            to
                                                                                                                            protect
                                                                                                                            the
                                                                                                                            security
                                                                                                                            of
                                                                                                                            any
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            we
                                                                                                                            process.
                                                                                                                            However,
                                                                                                                            despite
                                                                                                                            our
                                                                                                                            safeguards
                                                                                                                            and
                                                                                                                            efforts
                                                                                                                            to
                                                                                                                            secure
                                                                                                                            your
                                                                                                                            information,
                                                                                                                            no
                                                                                                                            electronic
                                                                                                                            transmission
                                                                                                                            over
                                                                                                                            the
                                                                                                                            Internet
                                                                                                                            or
                                                                                                                            information
                                                                                                                            storage
                                                                                                                            technology
                                                                                                                            can
                                                                                                                            be
                                                                                                                            guaranteed
                                                                                                                            to
                                                                                                                            be
                                                                                                                            100%
                                                                                                                            secure,
                                                                                                                            so
                                                                                                                            we
                                                                                                                            cannot
                                                                                                                            promise
                                                                                                                            or
                                                                                                                            guarantee
                                                                                                                            that
                                                                                                                            hackers,
                                                                                                                            cybercriminals,
                                                                                                                            or
                                                                                                                            other&nbsp;unauthorized&nbsp;third
                                                                                                                            parties
                                                                                                                            will
                                                                                                                            not
                                                                                                                            be
                                                                                                                            able
                                                                                                                            to
                                                                                                                            defeat
                                                                                                                            our
                                                                                                                            security
                                                                                                                            and
                                                                                                                            improperly
                                                                                                                            collect,
                                                                                                                            access,
                                                                                                                            steal,
                                                                                                                            or
                                                                                                                            modify
                                                                                                                            your
                                                                                                                            information.
                                                                                                                            Although
                                                                                                                            we
                                                                                                                            will
                                                                                                                            do
                                                                                                                            our
                                                                                                                            best
                                                                                                                            to
                                                                                                                            protect
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information,
                                                                                                                            transmission
                                                                                                                            of
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            to
                                                                                                                            and
                                                                                                                            from
                                                                                                                            our
                                                                                                                            Services
                                                                                                                            is
                                                                                                                            at
                                                                                                                            your
                                                                                                                            own
                                                                                                                            risk.
                                                                                                                            You
                                                                                                                            should
                                                                                                                            only
                                                                                                                            access
                                                                                                                            the
                                                                                                                            Services
                                                                                                                            within
                                                                                                                            a
                                                                                                                            secure
                                                                                                                            environment.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                6.
                                                                                                                                WHAT
                                                                                                                                ARE
                                                                                                                                YOUR
                                                                                                                                PRIVACY
                                                                                                                                RIGHTS?
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                <em>
                                                                                                                                    In
                                                                                                                                    Short:
                                                                                                                                </em>
                                                                                                                            </strong>
                                                                                                                            <em>
                                                                                                                                &nbsp;
                                                                                                                                <em>
                                                                                                                                    &nbsp;
                                                                                                                                </em>{" "}
                                                                                                                                You
                                                                                                                                may
                                                                                                                                review,
                                                                                                                                change,
                                                                                                                                or
                                                                                                                                terminate
                                                                                                                                your
                                                                                                                                account
                                                                                                                                at
                                                                                                                                any
                                                                                                                                time.
                                                                                                                            </em>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            &nbsp;
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            If
                                                                                                                            you
                                                                                                                            are
                                                                                                                            located
                                                                                                                            in
                                                                                                                            the
                                                                                                                            EEA
                                                                                                                            or
                                                                                                                            UK
                                                                                                                            and
                                                                                                                            you
                                                                                                                            believe
                                                                                                                            we
                                                                                                                            are
                                                                                                                            unlawfully
                                                                                                                            processing
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information,
                                                                                                                            you
                                                                                                                            also
                                                                                                                            have
                                                                                                                            the
                                                                                                                            right
                                                                                                                            to
                                                                                                                            complain
                                                                                                                            to
                                                                                                                            your
                                                                                                                            local
                                                                                                                            data
                                                                                                                            protection
                                                                                                                            supervisory
                                                                                                                            authority.
                                                                                                                            You
                                                                                                                            can
                                                                                                                            find
                                                                                                                            their
                                                                                                                            contact
                                                                                                                            details
                                                                                                                            here:&nbsp;
                                                                                                                            <a
                                                                                                                                href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
                                                                                                                                rel="noopener noreferrer"
                                                                                                                                target="_blank"
                                                                                                                            >
                                                                                                                                https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
                                                                                                                            </a>
                                                                                                                            .
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            If
                                                                                                                            you
                                                                                                                            are
                                                                                                                            located
                                                                                                                            in
                                                                                                                            Switzerland,
                                                                                                                            the
                                                                                                                            contact
                                                                                                                            details
                                                                                                                            for
                                                                                                                            the
                                                                                                                            data
                                                                                                                            protection
                                                                                                                            authorities
                                                                                                                            are
                                                                                                                            available
                                                                                                                            here:&nbsp;
                                                                                                                            <a
                                                                                                                                href="https://www.edoeb.admin.ch/edoeb/en/home.html"
                                                                                                                                rel="noopener noreferrer"
                                                                                                                                target="_blank"
                                                                                                                            >
                                                                                                                                https://www.edoeb.admin.ch/edoeb/en/home.html
                                                                                                                            </a>
                                                                                                                            .
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                <u>
                                                                                                                                    Withdrawing
                                                                                                                                    your
                                                                                                                                    consent:
                                                                                                                                </u>
                                                                                                                            </strong>{" "}
                                                                                                                            If
                                                                                                                            we
                                                                                                                            are
                                                                                                                            relying
                                                                                                                            on
                                                                                                                            your
                                                                                                                            consent
                                                                                                                            to
                                                                                                                            process
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information,&nbsp;which
                                                                                                                            may
                                                                                                                            be
                                                                                                                            express
                                                                                                                            and/or
                                                                                                                            implied
                                                                                                                            consent
                                                                                                                            depending
                                                                                                                            on
                                                                                                                            the
                                                                                                                            applicable
                                                                                                                            law,&nbsp;you
                                                                                                                            have
                                                                                                                            the
                                                                                                                            right
                                                                                                                            to
                                                                                                                            withdraw
                                                                                                                            your
                                                                                                                            consent
                                                                                                                            at
                                                                                                                            any
                                                                                                                            time.
                                                                                                                            You
                                                                                                                            can
                                                                                                                            withdraw
                                                                                                                            your
                                                                                                                            consent
                                                                                                                            at
                                                                                                                            any
                                                                                                                            time
                                                                                                                            by
                                                                                                                            contacting
                                                                                                                            us
                                                                                                                            by
                                                                                                                            using
                                                                                                                            the
                                                                                                                            contact
                                                                                                                            details
                                                                                                                            provided
                                                                                                                            in
                                                                                                                            the
                                                                                                                            section&nbsp;"&nbsp;
                                                                                                                            <a href="http://localhost:3000/privacypolicy.html#contact">
                                                                                                                                HOW
                                                                                                                                CAN
                                                                                                                                YOU
                                                                                                                                CONTACT
                                                                                                                                US
                                                                                                                                ABOUT
                                                                                                                                THIS
                                                                                                                                NOTICE?
                                                                                                                            </a>{" "}
                                                                                                                            "&nbsp;below.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            However,
                                                                                                                            please
                                                                                                                            note
                                                                                                                            that
                                                                                                                            this
                                                                                                                            will
                                                                                                                            not
                                                                                                                            affect
                                                                                                                            the
                                                                                                                            lawfulness
                                                                                                                            of
                                                                                                                            the
                                                                                                                            processing
                                                                                                                            before
                                                                                                                            its
                                                                                                                            withdrawal
                                                                                                                            nor,&nbsp;when
                                                                                                                            applicable
                                                                                                                            law
                                                                                                                            allows,&nbsp;will
                                                                                                                            it
                                                                                                                            affect
                                                                                                                            the
                                                                                                                            processing
                                                                                                                            of
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            conducted
                                                                                                                            in
                                                                                                                            reliance
                                                                                                                            on
                                                                                                                            lawful
                                                                                                                            processing
                                                                                                                            grounds
                                                                                                                            other
                                                                                                                            than
                                                                                                                            consent.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                Account
                                                                                                                                Information
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            If
                                                                                                                            you
                                                                                                                            would
                                                                                                                            at
                                                                                                                            any
                                                                                                                            time
                                                                                                                            like
                                                                                                                            to
                                                                                                                            review
                                                                                                                            or
                                                                                                                            change
                                                                                                                            the
                                                                                                                            information
                                                                                                                            in
                                                                                                                            your
                                                                                                                            account
                                                                                                                            or
                                                                                                                            terminate
                                                                                                                            your
                                                                                                                            account,
                                                                                                                            you
                                                                                                                            can:
                                                                                                                        </div>
                                                                                                                        <ul>
                                                                                                                            <li>
                                                                                                                                Contact
                                                                                                                                us
                                                                                                                                using
                                                                                                                                the
                                                                                                                                contact
                                                                                                                                information
                                                                                                                                provided.
                                                                                                                            </li>
                                                                                                                        </ul>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            Upon
                                                                                                                            your
                                                                                                                            request
                                                                                                                            to
                                                                                                                            terminate
                                                                                                                            your
                                                                                                                            account,
                                                                                                                            we
                                                                                                                            will
                                                                                                                            deactivate
                                                                                                                            or
                                                                                                                            delete
                                                                                                                            your
                                                                                                                            account
                                                                                                                            and
                                                                                                                            information
                                                                                                                            from
                                                                                                                            our
                                                                                                                            active
                                                                                                                            databases.
                                                                                                                            However,
                                                                                                                            we
                                                                                                                            may
                                                                                                                            retain
                                                                                                                            some
                                                                                                                            information
                                                                                                                            in
                                                                                                                            our
                                                                                                                            files
                                                                                                                            to
                                                                                                                            prevent
                                                                                                                            fraud,
                                                                                                                            troubleshoot
                                                                                                                            problems,
                                                                                                                            assist
                                                                                                                            with
                                                                                                                            any
                                                                                                                            investigations,
                                                                                                                            enforce
                                                                                                                            our
                                                                                                                            legal
                                                                                                                            terms
                                                                                                                            and/or
                                                                                                                            comply
                                                                                                                            with
                                                                                                                            applicable
                                                                                                                            legal
                                                                                                                            requirements.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            If
                                                                                                                            you
                                                                                                                            have
                                                                                                                            questions
                                                                                                                            or
                                                                                                                            comments
                                                                                                                            about
                                                                                                                            your
                                                                                                                            privacy
                                                                                                                            rights,
                                                                                                                            you
                                                                                                                            may
                                                                                                                            email
                                                                                                                            us
                                                                                                                            at&nbsp;info@scholarpresent.com&nbsp;.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                7.
                                                                                                                                CONTROLS
                                                                                                                                FOR
                                                                                                                                DO-NOT-TRACK
                                                                                                                                FEATURES
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            Most
                                                                                                                            web
                                                                                                                            browsers
                                                                                                                            and
                                                                                                                            some
                                                                                                                            mobile
                                                                                                                            operating
                                                                                                                            systems
                                                                                                                            and
                                                                                                                            mobile
                                                                                                                            applications
                                                                                                                            include
                                                                                                                            a
                                                                                                                            Do-Not-Track
                                                                                                                            ("DNT")
                                                                                                                            feature
                                                                                                                            or
                                                                                                                            setting
                                                                                                                            you
                                                                                                                            can
                                                                                                                            activate
                                                                                                                            to
                                                                                                                            signal
                                                                                                                            your
                                                                                                                            privacy
                                                                                                                            preference
                                                                                                                            not
                                                                                                                            to
                                                                                                                            have
                                                                                                                            data
                                                                                                                            about
                                                                                                                            your
                                                                                                                            online
                                                                                                                            browsing
                                                                                                                            activities
                                                                                                                            monitored
                                                                                                                            and
                                                                                                                            collected.
                                                                                                                            At
                                                                                                                            this
                                                                                                                            stage
                                                                                                                            no
                                                                                                                            uniform
                                                                                                                            technology
                                                                                                                            standard
                                                                                                                            for&nbsp;recognizing&nbsp;and
                                                                                                                            implementing
                                                                                                                            DNT
                                                                                                                            signals
                                                                                                                            has
                                                                                                                            been&nbsp;finalized.
                                                                                                                            As
                                                                                                                            such,
                                                                                                                            we
                                                                                                                            do
                                                                                                                            not
                                                                                                                            currently
                                                                                                                            respond
                                                                                                                            to
                                                                                                                            DNT
                                                                                                                            browser
                                                                                                                            signals
                                                                                                                            or
                                                                                                                            any
                                                                                                                            other
                                                                                                                            mechanism
                                                                                                                            that
                                                                                                                            automatically
                                                                                                                            communicates
                                                                                                                            your
                                                                                                                            choice
                                                                                                                            not
                                                                                                                            to
                                                                                                                            be
                                                                                                                            tracked
                                                                                                                            online.
                                                                                                                            If
                                                                                                                            a
                                                                                                                            standard
                                                                                                                            for
                                                                                                                            online
                                                                                                                            tracking
                                                                                                                            is
                                                                                                                            adopted
                                                                                                                            that
                                                                                                                            we
                                                                                                                            must
                                                                                                                            follow
                                                                                                                            in
                                                                                                                            the
                                                                                                                            future,
                                                                                                                            we
                                                                                                                            will
                                                                                                                            inform
                                                                                                                            you
                                                                                                                            about
                                                                                                                            that
                                                                                                                            practice
                                                                                                                            in
                                                                                                                            a
                                                                                                                            revised
                                                                                                                            version
                                                                                                                            of
                                                                                                                            this
                                                                                                                            privacy
                                                                                                                            notice.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                8.
                                                                                                                                DO
                                                                                                                                CALIFORNIA
                                                                                                                                RESIDENTS
                                                                                                                                HAVE
                                                                                                                                SPECIFIC
                                                                                                                                PRIVACY
                                                                                                                                RIGHTS?
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                <em>
                                                                                                                                    In
                                                                                                                                    Short:&nbsp;
                                                                                                                                </em>
                                                                                                                            </strong>
                                                                                                                            <em>
                                                                                                                                Yes,
                                                                                                                                if
                                                                                                                                you
                                                                                                                                are
                                                                                                                                a
                                                                                                                                resident
                                                                                                                                of
                                                                                                                                California,
                                                                                                                                you
                                                                                                                                are
                                                                                                                                granted
                                                                                                                                specific
                                                                                                                                rights
                                                                                                                                regarding
                                                                                                                                access
                                                                                                                                to
                                                                                                                                your
                                                                                                                                personal
                                                                                                                                information.
                                                                                                                            </em>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            California
                                                                                                                            Civil
                                                                                                                            Code
                                                                                                                            Section
                                                                                                                            1798.83,
                                                                                                                            also
                                                                                                                            known
                                                                                                                            as
                                                                                                                            the&nbsp;"Shine
                                                                                                                            The
                                                                                                                            Light"&nbsp;law,
                                                                                                                            permits
                                                                                                                            our
                                                                                                                            users
                                                                                                                            who
                                                                                                                            are
                                                                                                                            California
                                                                                                                            residents
                                                                                                                            to
                                                                                                                            request
                                                                                                                            and
                                                                                                                            obtain
                                                                                                                            from
                                                                                                                            us,
                                                                                                                            once
                                                                                                                            a
                                                                                                                            year
                                                                                                                            and
                                                                                                                            free
                                                                                                                            of
                                                                                                                            charge,
                                                                                                                            information
                                                                                                                            about
                                                                                                                            categories
                                                                                                                            of
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            (if
                                                                                                                            any)
                                                                                                                            we
                                                                                                                            disclosed
                                                                                                                            to
                                                                                                                            third
                                                                                                                            parties
                                                                                                                            for
                                                                                                                            direct
                                                                                                                            marketing
                                                                                                                            purposes
                                                                                                                            and
                                                                                                                            the
                                                                                                                            names
                                                                                                                            and
                                                                                                                            addresses
                                                                                                                            of
                                                                                                                            all
                                                                                                                            third
                                                                                                                            parties
                                                                                                                            with
                                                                                                                            which
                                                                                                                            we
                                                                                                                            shared
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            in
                                                                                                                            the
                                                                                                                            immediately
                                                                                                                            preceding
                                                                                                                            calendar
                                                                                                                            year.
                                                                                                                            If
                                                                                                                            you
                                                                                                                            are
                                                                                                                            a
                                                                                                                            California
                                                                                                                            resident
                                                                                                                            and
                                                                                                                            would
                                                                                                                            like
                                                                                                                            to
                                                                                                                            make
                                                                                                                            such
                                                                                                                            a
                                                                                                                            request,
                                                                                                                            please
                                                                                                                            submit
                                                                                                                            your
                                                                                                                            request
                                                                                                                            in
                                                                                                                            writing
                                                                                                                            to
                                                                                                                            us
                                                                                                                            using
                                                                                                                            the
                                                                                                                            contact
                                                                                                                            information
                                                                                                                            provided
                                                                                                                            below.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            If
                                                                                                                            you
                                                                                                                            are
                                                                                                                            under
                                                                                                                            18
                                                                                                                            years
                                                                                                                            of
                                                                                                                            age,
                                                                                                                            reside
                                                                                                                            in
                                                                                                                            California,
                                                                                                                            and
                                                                                                                            have
                                                                                                                            a
                                                                                                                            registered
                                                                                                                            account
                                                                                                                            with
                                                                                                                            Services,
                                                                                                                            you
                                                                                                                            have
                                                                                                                            the
                                                                                                                            right
                                                                                                                            to
                                                                                                                            request
                                                                                                                            removal
                                                                                                                            of
                                                                                                                            unwanted
                                                                                                                            data
                                                                                                                            that
                                                                                                                            you
                                                                                                                            publicly
                                                                                                                            post
                                                                                                                            on
                                                                                                                            the
                                                                                                                            Services.
                                                                                                                            To
                                                                                                                            request
                                                                                                                            removal
                                                                                                                            of
                                                                                                                            such
                                                                                                                            data,
                                                                                                                            please
                                                                                                                            contact
                                                                                                                            us
                                                                                                                            using
                                                                                                                            the
                                                                                                                            contact
                                                                                                                            information
                                                                                                                            provided
                                                                                                                            below
                                                                                                                            and
                                                                                                                            include
                                                                                                                            the
                                                                                                                            email
                                                                                                                            address
                                                                                                                            associated
                                                                                                                            with
                                                                                                                            your
                                                                                                                            account
                                                                                                                            and
                                                                                                                            a
                                                                                                                            statement
                                                                                                                            that
                                                                                                                            you
                                                                                                                            reside
                                                                                                                            in
                                                                                                                            California.
                                                                                                                            We
                                                                                                                            will
                                                                                                                            make
                                                                                                                            sure
                                                                                                                            the
                                                                                                                            data
                                                                                                                            is
                                                                                                                            not
                                                                                                                            publicly
                                                                                                                            displayed
                                                                                                                            on
                                                                                                                            the
                                                                                                                            Services,
                                                                                                                            but
                                                                                                                            please
                                                                                                                            be
                                                                                                                            aware
                                                                                                                            that
                                                                                                                            the
                                                                                                                            data
                                                                                                                            may
                                                                                                                            not
                                                                                                                            be
                                                                                                                            completely
                                                                                                                            or
                                                                                                                            comprehensively
                                                                                                                            removed
                                                                                                                            from
                                                                                                                            all
                                                                                                                            our
                                                                                                                            systems
                                                                                                                            (e.g.&nbsp;,&nbsp;backups,
                                                                                                                            etc.).
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                9.
                                                                                                                                DO
                                                                                                                                WE
                                                                                                                                MAKE
                                                                                                                                UPDATES
                                                                                                                                TO
                                                                                                                                THIS
                                                                                                                                NOTICE?
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <em>
                                                                                                                                <strong>
                                                                                                                                    In
                                                                                                                                    Short:&nbsp;
                                                                                                                                </strong>
                                                                                                                                Yes,
                                                                                                                                we
                                                                                                                                will
                                                                                                                                update
                                                                                                                                this
                                                                                                                                notice
                                                                                                                                as
                                                                                                                                necessary
                                                                                                                                to
                                                                                                                                stay
                                                                                                                                compliant
                                                                                                                                with
                                                                                                                                relevant
                                                                                                                                laws.
                                                                                                                            </em>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            We
                                                                                                                            may
                                                                                                                            update
                                                                                                                            this
                                                                                                                            privacy
                                                                                                                            notice
                                                                                                                            from
                                                                                                                            time
                                                                                                                            to
                                                                                                                            time.
                                                                                                                            The
                                                                                                                            updated
                                                                                                                            version
                                                                                                                            will
                                                                                                                            be
                                                                                                                            indicated
                                                                                                                            by
                                                                                                                            an
                                                                                                                            updated&nbsp;"Revised"&nbsp;date
                                                                                                                            and
                                                                                                                            the
                                                                                                                            updated
                                                                                                                            version
                                                                                                                            will
                                                                                                                            be
                                                                                                                            effective
                                                                                                                            as
                                                                                                                            soon
                                                                                                                            as
                                                                                                                            it
                                                                                                                            is
                                                                                                                            accessible.
                                                                                                                            If
                                                                                                                            we
                                                                                                                            make
                                                                                                                            material
                                                                                                                            changes
                                                                                                                            to
                                                                                                                            this
                                                                                                                            privacy
                                                                                                                            notice,
                                                                                                                            we
                                                                                                                            may
                                                                                                                            notify
                                                                                                                            you
                                                                                                                            either
                                                                                                                            by
                                                                                                                            prominently
                                                                                                                            posting
                                                                                                                            a
                                                                                                                            notice
                                                                                                                            of
                                                                                                                            such
                                                                                                                            changes
                                                                                                                            or
                                                                                                                            by
                                                                                                                            directly
                                                                                                                            sending
                                                                                                                            you
                                                                                                                            a
                                                                                                                            notification.
                                                                                                                            We
                                                                                                                            encourage
                                                                                                                            you
                                                                                                                            to
                                                                                                                            review
                                                                                                                            this
                                                                                                                            privacy
                                                                                                                            notice
                                                                                                                            frequently
                                                                                                                            to
                                                                                                                            be
                                                                                                                            informed
                                                                                                                            of
                                                                                                                            how
                                                                                                                            we
                                                                                                                            are
                                                                                                                            protecting
                                                                                                                            your
                                                                                                                            information.
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                10.
                                                                                                                                HOW
                                                                                                                                CAN
                                                                                                                                YOU
                                                                                                                                CONTACT
                                                                                                                                US
                                                                                                                                ABOUT
                                                                                                                                THIS
                                                                                                                                NOTICE?
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            If
                                                                                                                            you
                                                                                                                            have
                                                                                                                            questions
                                                                                                                            or
                                                                                                                            comments
                                                                                                                            about
                                                                                                                            this
                                                                                                                            notice,
                                                                                                                            you
                                                                                                                            may&nbsp;email
                                                                                                                            us
                                                                                                                            at&nbsp;info@scholarpresent.com&nbsp;&nbsp;or
                                                                                                                            by
                                                                                                                            post
                                                                                                                            to:
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            iConnect99
                                                                                                                            Pty
                                                                                                                            (LTD)
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            12
                                                                                                                            Zandvliet
                                                                                                                            Crescent,
                                                                                                                            Kuilsriver
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            Kuilsriver
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            Cape
                                                                                                                            Town&nbsp;,&nbsp;Western
                                                                                                                            Cape&nbsp;7580
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            South
                                                                                                                            Africa
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <strong>
                                                                                                                                11.
                                                                                                                                HOW
                                                                                                                                CAN
                                                                                                                                YOU
                                                                                                                                REVIEW,
                                                                                                                                UPDATE,
                                                                                                                                OR
                                                                                                                                DELETE
                                                                                                                                THE
                                                                                                                                DATA
                                                                                                                                WE
                                                                                                                                COLLECT
                                                                                                                                FROM
                                                                                                                                YOU?
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            <br />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            Based
                                                                                                                            on
                                                                                                                            the
                                                                                                                            applicable
                                                                                                                            laws
                                                                                                                            of
                                                                                                                            your
                                                                                                                            country,
                                                                                                                            you
                                                                                                                            may
                                                                                                                            have
                                                                                                                            the
                                                                                                                            right
                                                                                                                            to
                                                                                                                            request
                                                                                                                            access
                                                                                                                            to
                                                                                                                            the
                                                                                                                            personal
                                                                                                                            information
                                                                                                                            we
                                                                                                                            collect
                                                                                                                            from
                                                                                                                            you,
                                                                                                                            change
                                                                                                                            that
                                                                                                                            information,
                                                                                                                            or
                                                                                                                            delete
                                                                                                                            it.
                                                                                                                            To
                                                                                                                            request
                                                                                                                            to
                                                                                                                            review,
                                                                                                                            update,
                                                                                                                            or
                                                                                                                            delete
                                                                                                                            your
                                                                                                                            personal
                                                                                                                            information,
                                                                                                                            please&nbsp;visit:&nbsp;
                                                                                                                            <a
                                                                                                                                href="https://www.scholarpresent.com/contactus"
                                                                                                                                target="_blank"
                                                                                                                            >
                                                                                                                                https://www.scholarpresent.com/contactus
                                                                                                                            </a>{" "}
                                                                                                                            .
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div>
                                                                                                                        This
                                                                                                                        privacy
                                                                                                                        policy
                                                                                                                        was
                                                                                                                        created
                                                                                                                        using
                                                                                                                        Termly's&nbsp;
                                                                                                                        <a href="https://termly.io/products/privacy-policy-generator/">
                                                                                                                            Privacy
                                                                                                                            Policy
                                                                                                                            Generator
                                                                                                                        </a>
                                                                                                                        .
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button onClick={() => props.setShow(false)} color="green">
                    Back
                </Button>
                &nbsp;
           
        </div>
    );
}

export default PrivacyPolicyPage;
