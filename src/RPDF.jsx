import { Document, Page, pdfjs } from "react-pdf";
import pdfFile from "./assets/tofes-161.pdf";
import { useEffect, useState } from "react";
import { useRef } from "react";
import SignatureBox from "./_components/SignatureBox";
import { PDFDocument } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const RPDF = () => {
  const [numPages, setNumPages] = useState(null);
  const [modifiedPdfUrl, setModifiedPdfUrl] = useState(null);
  const [signatures, setSignatures] = useState([
    {
      shouldRender: true,
      ref: useRef(null),
      sigDrawn: false,
      page: 3,
      sigPosition: { x: 173, y: 640, width: 180, height: 58 },
    },
    {
      shouldRender: true,
      ref: useRef(null),
      sigDrawn: false,
      page: 4,
      sigPosition: { x: 74, y: 81, width: 180, height: 58 },
    },
    {
      shouldRender: true,
      ref: useRef(null),
      sigDrawn: false,
      page: 4,
      sigPosition: { x: 297, y: 81, width: 180, height: 58 },
    },
  ]);

  const allSignaturesDrawn = signatures.some((sig) => !sig.sigDrawn);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const updatePdfWithSignature = async () => {
    const sigCanvasPromises = signatures.map((sig) => sig.ref.current.getCanvas());
    const signatureCanvases = await Promise.all(sigCanvasPromises);

    if (signatureCanvases.some((signatureCanvas) => signatureCanvas.width === 0 || signatureCanvas.height === 0)) {
      console.log("No signature drawn");
      return;
    }

    const existingPdfBytes = await fetch(pdfFile).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed signatures
    const pngImagePromises = signatureCanvases.map((canvas) => fetch(canvas.toDataURL()).then((res) => res.arrayBuffer()));
    const pngImageBytes = await Promise.all(pngImagePromises);
    const pngImages = await Promise.all(pngImageBytes.map((bytes) => pdfDoc.embedPng(bytes)));

    signatures.forEach((signature, index) => {
      const pngImage = pngImages[index];
      const page = pdfDoc.getPage(signature.page - 1);
      page.drawImage(pngImage, signature.sigPosition);
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setModifiedPdfUrl(url);
  };

  useEffect(() => {
    if (modifiedPdfUrl) {
      const a = document.createElement("a");
      a.href = modifiedPdfUrl;
      a.download = "signed_pdf.pdf";
      a.click();
    }
  }, [modifiedPdfUrl]);

  return (
    <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {Array.from(new Array(numPages), (el, index) => index + 1).map((pageNumber) => (
          <Page width={1280} key={pageNumber} pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false}>
            {signatures.map((signature, index) => {
              if (signature.page === pageNumber && signature.shouldRender) {
                return (
                  <SignatureBox
                    key={index}
                    sigRef={signature.ref}
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
      </div>
      <div style={{ display: "flex" }}>
        <button
          onClick={updatePdfWithSignature}
          disabled={allSignaturesDrawn}
          style={{
            backgroundColor: "#13135b",
            border: "none",
            cursor: "pointer",
            color: "white",
            padding: "10px 40px",
            margin: "20px auto",
            textAlign: "center",
            borderRadius: 5,
            fontSize: 16,
            fontWeight: "bold",
            opacity: allSignaturesDrawn ? 0.5 : 1,
            pointerEvents: allSignaturesDrawn ? "none" : "auto",
          }}
        >
          סיים
        </button>
      </div>
    </Document>
  );
};

export default RPDF;
