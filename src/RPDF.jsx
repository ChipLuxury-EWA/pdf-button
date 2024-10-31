import { Document, Page, pdfjs } from "react-pdf";
import pdfFile from "./assets/tofes-161.pdf";
import { useEffect, useState } from "react";
import SignatureBox from "./_components/SignatureBox";
import { PDFDocument } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const maxWidthPercentsFill = 0.95;
const a4WidthInPx = 595;
const windowMaxWidth = maxWidthPercentsFill / a4WidthInPx;
const maxScale = 2; //adjust the maximum scale that the PDF can be zoomed to
const calcPageScale = () => {
  const windowScale = window.innerWidth * windowMaxWidth;
  return Math.min(windowScale, maxScale);
};

//////////////////////// search text and get position ////////////////////////
const findSignaturePosition = async ({ pdfUrl, searchTerms = [] }) => {
  const pdf = await pdfjs.getDocument(pdfUrl).promise;
  const signatureLocations = [];
  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
    const searchPage = await pdf.getPage(pageIndex);
    const textContent = await searchPage.getTextContent();
    const foundedSearchTerms = textContent.items.filter((item) => {
      return searchTerms.some((word) => {
        return item.str.indexOf(word) > -1;
      });
    });
    console.log(foundedSearchTerms);
    foundedSearchTerms.forEach((term) => {
      const { height, width, transform } = term;
      const [x, y] = [transform[4] - width * 1.5, transform[5] + height];
      signatureLocations.push({ pageIndex, height, width, x, y });
    });
  }

  return signatureLocations;
};

/////////////////////// search text and get position ////////////////////////

const RPDF = ({ signedInUserRole }) => {
  const [pageScale, setPageScale] = useState(calcPageScale);
  const [numPages, setNumPages] = useState(null);
  const [modifiedPdfUrl, setModifiedPdfUrl] = useState(null);
  const [signatures, setSignatures] = useState([
    // {
    //   shouldRender: true,
    //   signerRole: ["worker"],
    //   ref: useRef(null),
    //   sigDrawn: false,
    //   page: 3,
    //   sigPosition: { x: 73, y: 297, width: 91, height: 29 },
    // },
    // {
    //   shouldRender: true,
    //   signerRole: ["employer1"],
    //   ref: useRef(null),
    //   sigDrawn: false,
    //   page: 4,
    //   sigPosition: { x: 30, y: 38, width: 91, height: 29 },
    // },
    // {
    //   shouldRender: true,
    //   signerRole: ["employer1", "employer2"],
    //   ref: useRef(null),
    //   sigDrawn: false,
    //   page: 4,
    //   sigPosition: { x: 131, y: 38, width: 91, height: 29 },
    // },
  ]);

  useEffect(() => {
    findSignaturePosition({ pdfUrl: pdfFile, searchTerms: ["חותמת", "חתימ", "חתימת"] }).then((signaturesFound) => {
      console.log(signaturesFound);
      const newSigArray = [];
      signaturesFound.forEach((sig) => {
        newSigArray.push({
          shouldRender: true,
          signerRole: ["worker"],
          // ref: useRef(null),
          sigDrawn: false,
          page: sig.pageIndex,
          sigPosition: { x: sig.x, y: sig.y, width: 91, height: 29 },
        });
      });
      setSignatures(newSigArray);
    });
  }, []);

  const allSignaturesDrawn = signatures.some((sig) => sig.signerRole.includes(signedInUserRole) && !sig.sigDrawn);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const updatePdfWithSignature = async () => {
    const signaturesToRender = signatures.filter((sig) => sig.signerRole.includes(signedInUserRole));
    const sigCanvasPromises = signaturesToRender.map((sig) => sig.ref.current.getCanvas());
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

    signaturesToRender.forEach((signature, index) => {
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

  useEffect(() => {
    const handleResize = () => setPageScale(calcPageScale);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {Array.from(new Array(numPages), (el, index) => index + 1).map((pageNumber) => (
          <Page scale={pageScale} key={pageNumber} pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false}>
            {signatures.map((signature, index) => {
              if (signature.page === pageNumber && signature.shouldRender && signature.signerRole.includes(signedInUserRole)) {
                return (
                  <SignatureBox
                    key={index}
                    sigRef={signature.ref}
                    width={signature.sigPosition.width * pageScale}
                    height={signature.sigPosition.height * pageScale}
                    positionX={signature.sigPosition.x * pageScale}
                    positionY={signature.sigPosition.y * pageScale}
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
