import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import pdfFile from "./assets/sample-pdf-2-pages.pdf";
import SignatureCanvas from "react-signature-canvas";
import { useState } from "react";
import { useRef } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const RPDF = () => {
  const [signatures, setSignatures] = useState([
    {
      render: true,
      ref: useRef(null),
      signatureDrawn: false,
      stepTitle: "ב3. הצהרת העובד",
      page: 2,
      position: { x: 115, y: 300, width: 25, height: 25 },
    },
    {
      render: true,
      ref: useRef(null),
      signatureDrawn: false,
      stepTitle: "ג3. הצהרת המעסיק - חתימה א",
      page: 3,
      position: { x: 55, y: 40, width: 25, height: 25 },
    },
  ]);

  return (
    <>
      <Document file={pdfFile}>
        <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} className={"sb_page"}>
          <SignatureCanvas penColor="black" canvasProps={{ width: 250, height: 130, className: "sig_canvas" }} />
        </Page>
        <Page pageNumber={2} renderAnnotationLayer={false} renderTextLayer={false}>
          <SignatureCanvas penColor="black" canvasProps={{ width: 250, height: 130, className: "sig_canvas" }} />
        </Page>
      </Document>
    </>
  );
};

export default RPDF;
