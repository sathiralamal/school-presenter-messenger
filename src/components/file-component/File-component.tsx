import { Panel } from "rsuite";
import './File-component.css'

const FileComponent = (props: any) => {
    return (
        <div className='file-container'>
            <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 150 }}>
                <img src="/assets/book.jpg" height="150" />
                <div className='content'>
                    <span className='title'>Document Name</span><br />
                    <span className='desc'>Recently Viewed File</span>
                </div>
            </Panel>
        </div>
    );
}
export default FileComponent;
