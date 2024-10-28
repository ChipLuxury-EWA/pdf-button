import { pdfjs } from "react-pdf";
import { Document, Page, Outline } from "react-pdf";
import pdfFile from "./assets/sample-pdf-2-pages.pdf";
import { useState } from "react";
import { useRef } from "react";
import SignatureBox from "./_components/SignatureBox";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const RPDF = () => {
  const [signatures, setSignatures] = useState([
    {
      render: true,
      ref: useRef(null),
      sigDrawn: false,
      stepTitle: "ב3. הצהרת העובד",
      page: 1,
      sigPosition: { x: 115, y: 300, width: 25, height: 25 },
    },
    {
      render: true,
      ref: useRef(null),
      sigDrawn: false,
      stepTitle: "ג3. הצהרת המעסיק - חתימה א",
      page: 3,
      sigPosition: { x: 55, y: 40, width: 25, height: 25 },
    },
  ]);

  return (
    <Document file={pdfFile}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false}>
          <SignatureBox width={250} height={120} positionX={265} positionY={220} />
        </Page>
        <Page pageNumber={2} renderAnnotationLayer={false} renderTextLayer={false}>
          <SignatureBox width={250} height={120} positionX={265} positionY={220} />
        </Page>
      </div>
      <button onClick={() => console.log("OK")}>OK!</button>
    </Document>
  );
};

export default RPDF;
