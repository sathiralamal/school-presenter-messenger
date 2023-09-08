import './app-install-popup.css'

const AppInstallPopup = () => {
    return (
        <div className='app-install-popup'>
            <div className='label'>
                <span>Get our Free Scholar Present App</span>
            </div>
            <p className='texture'>Scholar Present has designed a beautiful user-friendly App for mobile devices, Please download the app for better experience.</p>
            <div className='store-img'>
                <img src="assets/apple.png" />
                <img src="assets/store.png" />
            </div>
        </div>

    )
}
export default AppInstallPopup;