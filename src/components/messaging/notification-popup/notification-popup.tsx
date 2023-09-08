import { Button, Icon } from "rsuite";
import './notification-popup.css'

const NotificationPopup = () => {
    return (
        <div className='notification-popup'>
            <p className='texture'>Please Allow 'Show Notifications' as this will ensure that you receive messages from your school</p>
            <div className='label'>
                <Icon icon='bell' />
                <span>Show notifications</span>
            </div>
            <Button size='xs' color="green">Okay</Button>
        </div>

    )
}
export default NotificationPopup;