import { IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import { Input, InputGroup, Icon, Button, Panel, Table, Checkbox, Dropdown, Badge } from "rsuite";
import PlaceholderParagraph from "rsuite/lib/Placeholder/PlaceholderParagraph";
import CreateFolder from "../../components/Create-folder/Create-folder";
import FileComponent from "../../components/file-component/File-component";
import Header from "../../components/messaging/header/header";
//import Tour from 'reactour'
import './Files-Page.css'

const fileData = [
    {
        "id": 1,
        "name": "New Amieshire",
        type: "Adobe Acrobat Document",
        size: "57KB",
        updatedOn: "2021/06/09 14:32",
    },
    {
        "id": 2,
        "name": "New Amieshire",
        type: "Adobe Acrobat Document",
        size: "57KB",
        updatedOn: "2021/06/09 14:32",
    },
    {
        "id": 3,
        "name": "New Amieshire",
        type: "Adobe Acrobat Document",
        size: "57KB",
        updatedOn: "2021/06/09 14:32",
    },
]
const steps = [
    {
      selector: '.new-message',
      content: `Click this button when you want to create a new folder
      wherein you can add documents inside. The folder
      can be considered as the category heading. An Example
      of a folder heading may be minutes, inside this folder,
      different meeting minutes may be stored`,
    },
    {
      selector: '.search-input',
      content: `Search for a previous document by name here `,
    },
    {
      selector: '.recently-viewed',
      content: `These are files that were recently viewed for quick access`,
    },
    {
      selector: '.folder-name',
      content: `This is the name of the folder with`,
    },
    {
      selector: '.document-count',
      content: `Number of files inside this folder`,
    },
    {
      selector: '.selection-column',
      content: `Select one or more files by ticking the checkbox and search for
      the name of the person or group to share with.`,
    },
    {
      selector: '.visible-to-group',
      content: `Choose who to share the folder with, if you select "Teachers", all teachers
      will have access to the folder and all sub documents`,
    },
    {
      selector: '.copy-option',
      content: `Click once to copy the document link. you can then paste it in the conversation
      to share with the intended receiver`,
    },
  ]

const FilesPage = () => {

    const [show, setShow] = useState<boolean>(false)
    const [isTourOpen, setIsTourOpen] = useState<boolean>(false)

    useEffect(()=>{
        setTimeout(()=>{
            setIsTourOpen(true)
        },3000)
    },[])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {/* <Header active='file' /> */}
                    <Header />
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className='files-page'>
                    <div className="container">
                        <div>
                            <div className="top-bar">
                                <InputGroup className='search-input'>
                                    <Input placeholder='Search' />
                                    <InputGroup.Addon>
                                        <Icon icon="search" />
                                    </InputGroup.Addon>
                                </InputGroup>
                                <Button className='new-message' onClick={() => setShow(true)} color="green" appearance="ghost" ><Icon icon="plus" /> New Folder</Button>
                            </div>
                            <div className='recently-viewed'>
                                <h4 className='heading'>Recently Viewed</h4>
                                <div className='recent-file-container'>
                                    {[1, 2, 3, 4, 5, 6, 7].map(i => (<FileComponent key={i} index={i} />))}
                                </div>
                            </div>
                            <div>
                                <h4 className='heading'>Folder</h4>
                                <div>
                                    {
                                        ['Privacy','Parent', 'Admin', 'Student'].map((r,index) => (
                                            <div className='file-panel' key={r}>
                                                <Panel header={<PanelHeader title={r} index={index} />} collapsible bordered>
                                                    {/* <PlaceholderParagraph /> */}
                                                    <Table
                                                        data={fileData}
                                                    >
                                                        {/* onRowClick={data => {
                                                            console.log(data);
                                                        }} */}
                                                        <Table.Column width={50} fixed>
                                                            <Table.HeaderCell>
                                                                <span></span>
                                                                {/* <InputGroup size='xs'>
                                                                    <Input />
                                                                    <InputGroup.Addon>
                                                                        <Icon icon="search" />
                                                                    </InputGroup.Addon>
                                                                </InputGroup> */}
                                                            </Table.HeaderCell>
                                                            <Table.Cell className='row-selecter'>
                                                                <Checkbox defaultChecked></Checkbox>
                                                            </Table.Cell>
                                                        </Table.Column>
                                                        <Table.Column width={250} fixed>
                                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                                            <Table.Cell dataKey="name">
                                                            <Icon icon='file-pdf-o' />&nbsp;
                                                            AGM Meeting (03 May 2021)
                                                            </Table.Cell>
                                                        </Table.Column>

                                                        <Table.Column width={150} fixed>
                                                            <Table.HeaderCell>Date Modified</Table.HeaderCell>
                                                            <Table.Cell dataKey="updatedOn" />
                                                        </Table.Column>
                                                        <Table.Column width={180} fixed>
                                                            <Table.HeaderCell>Type of Document</Table.HeaderCell>
                                                            <Table.Cell dataKey="type" />
                                                        </Table.Column>
                                                        <Table.Column width={200} fixed>
                                                            <Table.HeaderCell>Size of Document</Table.HeaderCell>
                                                            <Table.Cell dataKey="size" />
                                                        </Table.Column>
                                                        <Table.Column width={200} fixed>
                                                            <Table.HeaderCell>
                                                                <InputGroup size='xs'>
                                                                    <Input />
                                                                    <InputGroup.Addon>
                                                                        <Icon icon="search" />
                                                                    </InputGroup.Addon>
                                                                </InputGroup>
                                                            </Table.HeaderCell>
                                                            <Table.Cell>
                                                            </Table.Cell>
                                                        </Table.Column>
                                                        <Table.Column width={150}>
                                                            <Table.HeaderCell>
                                                                <Dropdown title='Visible for'>
                                                                    <Dropdown.Item>
                                                                            Parent
                                                                        {/* <Button color='green' size='xs'>
                                                                        </Button> */}
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item>
                                                                            Student
                                                                        {/* <Button color='green' size='xs'>
                                                                        </Button> */}
                                                                    </Dropdown.Item>
                                                                </Dropdown>
                                                            </Table.HeaderCell>
                                                            <Table.Cell dataKey="size">
                                                                <Icon icon="trash" color='green' />
                                                            </Table.Cell>
                                                        </Table.Column>
                                                    </Table>
                                                </Panel>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CreateFolder show={show} setShow={setShow} />
                {/* <Tour
                    steps={steps}
                    isOpen={isTourOpen}
                    onRequestClose={()=>setIsTourOpen(false)} /> */}
            </IonContent>
        </IonPage>
    );

}

export default FilesPage;

const PanelHeader = (props: any) => {
    return (
        <div className='panel-title'>
            <Icon className={props.index==0?'folder-name':''} icon="folder-open-o" />
            {props.title}
            &nbsp;&nbsp;
            <Badge className='document-count' content={35+props.index} />
        </div>
    )
}