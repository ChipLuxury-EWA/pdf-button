import SignatureCanvas from "react-signature-canvas";

const githubButtonStyle = {
  display: "inline-block",
  outline: 0,
  cursor: "pointer",
  padding: "1px 4px",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "15px",
  verticalAlign: "middle",
  border: "1px solid",
  borderRadius: 6,
  color: "#ffffff",
  backgroundColor: "#2ea44f",
  borderColor: "#1b1f2326",
  boxShadow: "rgba(27, 31, 35, 0.04) 0px 1px 0px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset",
  transition: "0.2s cubic-bezier(0.3, 0, 0.5, 1)",
  transitionProperty: "color, background-color, border-color",
  "&:hover": {
    backgroundColor: "darkgreen",
  },
};

const SignatureBox = ({ width = 250, height = 100, positionX = 10, positionY = 110, sigRef, buttonPosition }) => {
  const clear = () => sigRef.current.clear();

  return (
    <div
      style={{
        transform: `TranslateY(-${positionY + height}px) TranslateX(${positionX}px)`,
        position: "absolute",
      }}
    >
      <div
        style={{
          width,
          height,
          border: "1px solid #000",
          cursor: "crosshair",
          backgroundColor: "#fff",
        }}
      >
        <SignatureCanvas ref={sigRef} penColor="black" canvasProps={{ width, height }} />
      </div>
      <button style={githubButtonStyle} onClick={clear}>
        reset
      </button>
    </div>
  );
};

export default SignatureBox;
