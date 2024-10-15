import { pdfjs } from "react-pdf";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import pdfFile from "./assets/sample-pdf-2-pages.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const RPDF = () => {
  return (
    <div>
      <Document file={pdfFile}>
        <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} />
        <button
          onClick={() => alert("Sign 1 Clicked")}
          style={{
            transform: "TranslateY(-160px) TranslateX(280px)",
            backgroundColor: "white",
            color: "blue",
            border: "1px solid black",
            ":hover": {
              backgroundColor: "blue",
            },
          }}
        >
          Sign here
        </button>
        <Page pageNumber={2} renderAnnotationLayer={false} renderTextLayer={false} />
        <button
          onClick={() => alert("Sign 2 Clicked")}
          style={{
            transform: "TranslateY(-160px) TranslateX(280px)",
            backgroundColor: "white",
            color: "blue",
            border: "1px solid black",
            ":hover": {
              backgroundColor: "blue",
            },
          }}
        >
          Sign here
        </button>
      </Document>
    </div>
  );
};
export default RPDF;
