import { useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const buttonStyle = {
  all: "unset",
  cursor: "grab",
  // lineHeight: "15px",
  transform: "scale(1.1)",
  border: "1px solid #ccc",
  padding: "5px 10px",
  borderRadius: 5,
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 5,
  minHeight: "23px",
  fonfFamily: "inherit",
  background: "forestGreen",
  color: "white",
};

const resetButtonStyle = {
  ...buttonStyle,
  maxWidth: "13px",
  color: "gray",
  backgroundColor: "transparent",
};

const deskTopResetButtonStyle = {
  ...resetButtonStyle,
  padding: "0",
  border: "none",
};

const mobileResetButtonStyle = {
  ...resetButtonStyle,
};

const SignatureBox = ({ width = 250, height = 100, positionX = 10, positionY = 110, sigRef, onDraw }) => {
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false); // Controls the visibility of the modal

  const isMobile = pageWidth < 768;

  useEffect(() => {
    const handleResize = () => setPageWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeModal = () => setShowModal(false);

  // const offsetScale = 10 * pageScale;

  return (
    <>
      <div
        style={{
          transform: `TranslateY(-${positionY + height}px) TranslateX(${positionX}px)`,
          position: "absolute",
        }}
      >
        {isMobile ? (
          <button onClick={() => setShowModal(true)}>Sign</button>
        ) : (
          <>
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
            <button style={deskTopResetButtonStyle} onClick={() => sigRef.current.clear()}>
              {resetIcon}
            </button>
          </>
        )}
      </div>

      {/* mobile modal */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: showModal ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px 30px",
              borderRadius: 8,
              position: "relative",
              // width: "90%",
              // maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                border: ".5px solid rgba(0,0,0,0.1)",
                cursor: "crosshair",
                backgroundColor: "rgb(255 255 233)",
                borderRadius: 2,
              }}
            >
              <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{ width: 300, height: 150 }}
                minWidth={1}
                maxWidth={1}
                velocityFilterWeight={0.1}
                onEnd={onDraw}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 10,
                alignItems: "center",
                maxWidth: "300px",
              }}
            >
              <button style={mobileResetButtonStyle} onClick={() => sigRef.current.clear()}>
                {resetIcon}
              </button>
              <button onClick={closeModal} style={buttonStyle}>
                {approveSignatureSvg} אשר
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignatureBox;

const resetIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    // height="auto"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-rotate-ccw"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const approveSignatureSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-signature"
  >
    <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284" />
    <path d="M3 21h18" />
  </svg>
);
