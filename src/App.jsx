import { useEffect } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useState } from "react";

function App() {
  const [pdfURL, setPdfURL] = useState("");

  useEffect(() => {
    async function createPdf() {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 30;
      page.drawText("Button on pdf file POC", {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      const pdfBytes = await pdfDoc.save();
      const bytes = new Uint8Array(pdfBytes);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const docUrl = URL.createObjectURL(blob);

      setPdfURL(docUrl);
    }

    createPdf();
  }, []);

  return (
    <>
      <iframe style={{ width: "100vw", height: "100vh" }} className="pdf-iframe" src={pdfURL} type="application/pdf" />
    </>
  );
}

export default App;
