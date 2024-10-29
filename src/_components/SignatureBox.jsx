import SignatureCanvas from "react-signature-canvas";

const githubButtonStyle = {
  display: "inline-block",
  outline: 0,
  cursor: "pointer",
  padding: 0,
  margin: 0,
  fontSize: 12,
  lineHeight: "15px",
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
          border: "1px solid rgba(0,0,0,0.1)",
          cursor: "crosshair",
          backgroundColor: "#fff",
        }}
      >
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{ width, height }}
          minWidth={1}
          maxWidth={1}
          velocityFilterWeight={0.1}
        />
      </div>
      <button style={githubButtonStyle} onClick={clear}>
      🔄
      </button>
    </div>
  );
};

export default SignatureBox;
