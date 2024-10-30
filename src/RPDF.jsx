import { Document, Page } from "react-pdf";
import pdfFile from "./assets/tofes-161.pdf";
import { useEffect, useState, useRef } from "react";
import SignatureBox from "./_components/SignatureBox";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Set pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
function createBlock(className) {
  const block = document.createElement("div"); // Create a <div> element
  block.className = className; // Set the class name
  return block; // Return the created element
}
async function findSignaturePosition(pdfUrl, searchText, searchText2) {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const signatureLocations = [];

  for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
    const page = await pdf.getPage(pageIndex + 1);
    const textContent = await page.getTextContent();

    for (const item of textContent.items) {
      if (item.str.includes(searchText) || item.str.includes(searchText2)) {
        console.log(item);
        const viewport = page.getViewport({ scale: 1 });
        console.log(viewport);
        const transform = item.transform; // Transformation matrix

        // Calculate the coordinates of the text in PDF
        const x = transform[4];
        const y = viewport.height - transform[5];

        console.log("y: " + y);
        console.log("x:" + x);

        const adjustedX = x;
        const adjustedY = y;

        signatureLocations.push({
          page: pageIndex + 1,
          x: adjustedX,
          y: adjustedY,
          width: item.width, // Adjust width as per requirements
          height: 43,
        });
      }
    }
  }

  console.log("Signature locations:", signatureLocations.length > 0 ? signatureLocations : "No signatures found");
  return signatureLocations;
}

const RPDF = () => {
  const [numPages, setNumPages] = useState(null);
  const [signatureLocation, setSignatureLocation] = useState([]);
  const [modifiedPdfUrl, setModifiedPdfUrl] = useState(null);
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    const findPosition = async () => {
      const location = await findSignaturePosition(pdfFile, "חתימה", "חותמת");
      const newSignatures = location.map((el) => ({
        shouldRender: true,
        // ref: useRef(null),
        sigDrawn: false,
        page: el.page,
        sigPosition: { x: el.x, y: el.y, width: 180, height: 58 },
      }));
      setSignatures(newSignatures);
    };

    findPosition();
  }, []);

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
    setModifiedPdfUrl(URL.createObjectURL(blob));
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
