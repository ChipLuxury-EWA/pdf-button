import { useState } from "react";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

// const githubButtonStyle = {
  
//   display: "inline-block",
//   outline: 0,
//   cursor: "pointer",
//   padding: 5px 16px,
//   font-size: 14px,
//   font-weight: 500,
//   line-height: 20px,
//   vertical-align: middle,
//   border: 1px solid,
//   border-radius: 6px,
//   color: #ffffff,
//   background-color: #2ea44f,
//   border-color: #1b1f2326,
//   box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset,
//   transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1),
//   transition-property: color, background-color, border-color,
//   :hover {
//       background-color: #2c974b,
//       border-color: #1b1f2326,
//       transition-duration: 0.1s,
//   }
// }

const SignatureBox = ({ width = 250, height = 100, positionX = 10, positionY = 110 }) => {
  const sigCanvas = useRef({})
  const clear = () => sigCanvas.current.clear();
  


  return (
    <div style={{transform: `TranslateY(-${positionY}px) TranslateX(${positionX}px)`,position: "absolute"}}>
      <div
        style={{
          width,
          height,
          border: "1px solid #000",
          cursor: "crosshair",
          backgroundColor: "#fff",
        }}
      >
        <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width, height }} />
      </div>
      <button onClick={clear}>reset</button>
    </div>
  );
};

export default SignatureBox;
