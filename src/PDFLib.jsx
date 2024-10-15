import { useEffect } from "react";
import { PDFDocument, StandardFonts, rgb, PDFHexString, PDFName } from "pdf-lib";
import { useState } from "react";

const PDFLib = () => {
  
  const [pdfURL, setPdfURL] = useState("");

  useEffect(() => {
    async function createPdf() {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const page = pdfDoc.addPage();
      const form = pdfDoc.getForm();
      const { width, height } = page.getSize();

      /// add title:
      const fontSize = 30;
      page.drawText("Button on pdf file POC", {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0.53, 0.71),
      });

      //add button:
      const signButton1 = form.createButton("signButton1");
      signButton1.addToPage("sign", page, {
        x: 200,
        y: 650,
        width: 50,
        height: 20,
        textColor: rgb(0, 0.53, 0.71),
        backgroundColor: rgb(1, 1, 1),
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
        font: timesRomanFont,
      });

      const helloWorldScript = 'console.log("Hello World!");';
      signButton1.acroField.getWidgets().forEach((widget) => {
        widget.dict.set(
          PDFName.of("AA"),
          pdfDoc.context.obj({
            U: {
              Type: "Action",
              S: "JavaScript",
              JS: PDFHexString.fromText(helloWorldScript),
            },
          })
        );
        console.log("widget", widget.dict);
      });

      // console.log(signButton1);
      // const fields = form.getFields();
      // fields.forEach((field) => {
      //   const name = field.getName();
      //   console.log("Field name:", name);
      // });

      /// render the pdf:
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
export default PDFLib