import React, { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
const ShowPDF = () => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    function onDocumentLoadSuccess(params: any) {
        setNumPages(params.numPages);
    }
    return (
        <div>
            <iframe src="http://docs.google.com/gview?url=http://www.africau.edu/images/default/sample.pdf&embedded=true" style={{"width":"100%", "height":"100vh"}}></iframe>
        </div>

    );
}
export default ShowPDF;