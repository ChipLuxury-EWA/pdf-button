import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import pdfFile from "./assets/sample-pdf-2-pages.pdf";
import { useState } from "react";
import { useRef } from "react";
import SignatureBox from "./_components/SignatureBox";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const RPDF = () => {
  const [numPages, setNumPages] = useState(null);
  const [signatures, setSignatures] = useState([
    {
      shouldRender: true,
      ref: useRef(null),
      sigDrawn: false,
      stepTitle: "ב3. הצהרת העובד",
      page: 1,
      sigPosition: { x: 265, y: 220, width: 250, height: 120 },
    },
    {
      shouldRender: true,
      ref: useRef(null),
      sigDrawn: false,
      stepTitle: "ב3. הצהרת העובד",
      page: 1,
      sigPosition: { x: 165, y: 500, width: 250, height: 120 },
    },
  ]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {Array.from(new Array(numPages), (el, index) => index + 1).map((pageNumber) => (
          <Page key={pageNumber} pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false}>
            {signatures.map((signature, index) => {
              if (signature.page === pageNumber && signature.shouldRender) {
                return (
                  <SignatureBox
                    key={index}
                    ref={signature.ref}
                    width={signature.sigPosition.width}
                    height={signature.sigPosition.height}
                    positionX={signature.sigPosition.x}
                    positionY={signature.sigPosition.y}
                    onDraw={() => {
                      signature.sigDrawn = true;
                      setSignatures([...signatures]);
                    }}
                  />
                );
              }
              return null;
            })}
          </Page>
        ))}

        {/* <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false}>
          <SignatureBox width={250} height={120} positionX={265} positionY={220} />
        </Page>
        <Page pageNumber={2} renderAnnotationLayer={false} renderTextLayer={false}>
          <SignatureBox width={250} height={120} positionX={265} positionY={220} />
        </Page> */}
      </div>
      <button onClick={() => console.log("OK")}>OK!</button>
    </Document>
  );
};

export default RPDF;
