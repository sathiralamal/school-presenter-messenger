import { Button, FormGroup, Input, Modal, Radio, RadioGroup } from "rsuite";
import PlaceholderParagraph from "rsuite/lib/Placeholder/PlaceholderParagraph";

const CreateFolder = (props: any) => {
    return (
        <Modal backdrop={true} show={props.show} onHide={() => props.setShow(false)}>
            <Modal.Header>
                <Modal.Title>New Folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='text-success'>
                    <div>
                        <label>Name</label><br />
                        <Input placeholder="Folder Name" />
                    </div>
                </div><br /><br />
                <div className='text-success'>
                    <label>Visible for</label><br />
                    <FormGroup controlId="radioList">
                        <RadioGroup name="radioList" inline>
                            <Radio value="A">All</Radio>
                            <Radio value="B">Learner</Radio>
                            <Radio value="C">Parent</Radio>
                            <Radio value="d">Staff</Radio>
                        </RadioGroup>
                    </FormGroup>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color='green' onClick={() => props.setShow(false)} appearance="primary">
                    Save
                </Button>
                <Button onClick={() => props.setShow(false)} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default CreateFolder;