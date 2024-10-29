import SignatureCanvas from "react-signature-canvas";

const githubButtonStyle = {
  all: "unset",
  display: "inline-block",
  outline: 0,
  cursor: "grab",
  padding: 0,
  margin: 0,
  fontSize: 12,
  lineHeight: "15px",
  position: "relative",
  top: -4,
  left: -2,
};

const SignatureBox = ({
  width = 250,
  height = 100,
  posXPercent = 0.05,
  posYPercent = 0.2,
  sigRef,
  pageWidth,
  pageHeight,
  onDraw,
}) => {
  const clear = () => sigRef.current.clear();

  // Calculate positions based on percentage of pageWidth and pageHeight
  const positionX = posXPercent * pageWidth;
  const positionY = posYPercent * pageHeight;

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
          border: ".5px solid rgba(0,0,0,0.1)",
          cursor: "crosshair",
          backgroundColor: "rgb(255 255 233)",
          borderRadius: 2,
        }}
      >
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{ width, height }}
          minWidth={1}
          maxWidth={1}
          velocityFilterWeight={0.1}
          onEnd={onDraw}
        />
      </div>
      <button style={githubButtonStyle} onClick={clear}>
        🔄
      </button>
    </div>
  );
};

export default SignatureBox;
