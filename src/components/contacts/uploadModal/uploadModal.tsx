import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonProgressBar,
  IonImg,
  IonIcon,
} from "@ionic/react";
import "./uploadModal.css";
import { FlexboxGrid, Uploader, Dropdown } from "rsuite";
import { close } from "ionicons/icons";
import CSVReader from "react-csv-reader";

const UploadModal: React.FC<{
  open: boolean;
  closee: any;
  next: any;
  type: string;
}> = ({ open, closee, next, type }) => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<any>(null);
  const [headers, setHeaders] = useState<any[]>([]);
  const [csvData, setCSVData] = useState<any[]>([]);
  const processData = (allText: string) => {};
  const handleImport = async (data: any, info: any) => {
    console.log(data);
    setFile(info);
    setProgress(0);
    let headersTemp = [];
    for (const [key, value] of Object.entries(data[0])) {
      headersTemp.push(value);
    }
    setHeaders([...headersTemp]);
    setCSVData([...data]);
  };
  return (
    <IonItem
      lines="none"
      className="UploadModal"
      style={{ display: open ? "block" : "none" }}
    >
      <IonGrid style={{position: "relative"}}>
        <IonRow>
          <IonCol>
            <FlexboxGrid className='upload_header' >
              <FlexboxGrid.Item>
                <IonText className="PopupHeader">Upload File</IonText>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item className="UploadModalClose">
                <IonIcon
                  icon={close}
                  style={{
                    fontSize: 22,
                    verticalAlign: "top",
                    color: "#f00",
                  }}
                  onClick={closee}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="mw-100">
            <FlexboxGrid>
              <FlexboxGrid.Item className="UploadModalBtn mw-100">
                <label
                  htmlFor="csv_import_btn"
                  className="uploader"
                  style={{ width: 200, height: 200 }}
                >
                  <IonImg
                    src="/assets/cloudupload.png"
                    className="uploader_icon"
                  />
                  <br />
                  <IonText className="uploaderText">
                    Drop files to upload
                  </IonText>
                </label>
                {/* <input type="file" style={{ opacity: 0 }} id="uploader" /> */}
                <label htmlFor="csv_import_btn" className="btn-green-upload">
                  {/* <IonButton
                    className="btn-green-popup"
                    style={{ marginLeft: "8%" }}
                  > */}
                  Upload File
                  {/* </IonButton> */}
                </label>
                <CSVReader
                  onFileLoaded={(data, fileInfo) =>
                    handleImport(data, fileInfo)
                  }
                  onError={(err) => console.log(err)}
                  inputId="csv_import_btn"
                  inputStyle={{ display: "none" }}
                  // parserOptions={{
                  //   beforeFirstChunk: function(chunk) {
                  //     var rows = chunk.split( /\r\n|\r|\n/ );
                  //     // var headings = rows[0].toUpperCase();
                  //     // rows[0] = headings;
                  //     console.log(chunk);

                  //     // return rows.join("\r\n");
                  // },
                  // }}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
          <IonCol className="UploadModalBody mw-100">
            <FlexboxGrid>
              <FlexboxGrid.Item justify="end">
                {/* {file !== null && (
                  <IonText className="uploadingText">Uploading</IonText>
                )} */}
                <FlexboxGrid justify="center">
                  <FlexboxGrid.Item>
                    <IonImg
                      src="/assets/Excel@2x.png"
                      className="uploader_img"
                    />
                  </FlexboxGrid.Item>
                  {file !== null && (
                    <FlexboxGrid.Item className="endFlexRow">
                      <IonText className="uploader_text">{file?.name}</IonText>
                    </FlexboxGrid.Item>
                  )}
                  <br />
                  {progress > 0 && (
                    <>
                      <IonProgressBar
                        color="success"
                        value={progress / 100}
                      ></IonProgressBar>
                      <br />
                      <IonText className="uploader_Text_Progress">
                        {parseInt(progress.toString())}%
                      </IonText>
                    </>
                  )}
                </FlexboxGrid>
                <IonButton
                  className="btn-green-popup marginHZ"
                  onClick={() => {

                    let downloadLink =
                      type === "learner"
                        ? "/assets/downloads/learnerTemplate.csv"
                        : "/assets/downloads/staffTemplate.csv";
                    // Downloads the file
                    console.log("downloadLink ", downloadLink)
                    let link = document.createElement("a");
                    link.download = type === "learner"? "learnerTemplate.csv"
                    : "staffTemplate.csv";
                    link.href = downloadLink;
                    link.click();
                    URL.revokeObjectURL(link.href);
                  }}
                >
                  DOWNLOAD A TEMPLATE
                </IonButton>
                {/* <Dropdown
                  title="DOWNLOAD A TEMPLATE"
                  renderTitle={(children) => {
                    return (
                      <IonButton className="btn-green-popup marginHZ">
                        DOWNLOAD A TEMPLATE
                      </IonButton>
                    );
                  }}
                  onSelect={(value) => {
                    let downloadLink =
                      value === "learner"
                        ? "https://iconnect99-public.s3.eu-central-1.amazonaws.com/Learner%2Band%2BParents.csv"
                        : "https://iconnect99-public.s3.eu-central-1.amazonaws.com/Staff%2BMembers.csv";
                    // Downloads the file
                    let link = document.createElement("a");
                    link.download = downloadLink;
                    link.href = downloadLink;
                    link.click();
                    URL.revokeObjectURL(link.href);
                  }}
                >
                  <Dropdown.Item eventKey="learner">
                    Learner and Parents Template
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="staff">
                    Staff Members Template
                  </Dropdown.Item>
                </Dropdown> */}
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
        <IonRow className="devider">
          <IonCol>
            <FlexboxGrid className="UploadModalFooter">
              <FlexboxGrid.Item>
                <IonButton
                  fill="outline"
                  className="outlineBtn "
                  color="success"
                  onClick={closee}
                >
                  Cancel
                </IonButton>
                <IonButton
                  className="btn-green-popup"
                  onClick={() => {
                    next({ headers, csvData });
                    closee();
                  }}
                  disabled={file === null}
                  id="uploadNext"
                >
                  Next
                </IonButton>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default UploadModal;
