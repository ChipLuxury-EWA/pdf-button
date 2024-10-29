import { useState } from "react";
import RPDF from "./RPDF";

function App() {
  const [signedInUserRole, setSignedInUserRole] = useState("worker");

  return (
    <>
      <div
        style={{
          position: "fixed",
          zIndex: 1,
          backgroundColor: "lightblue",
          padding: "5px",
          border: "1px solid black",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "end" }}>
          <label>
            עובד
            <input
              type="radio"
              value="worker"
              checked={signedInUserRole === "worker"}
              onChange={() => setSignedInUserRole("worker")}
            />
          </label>
          <label>
            מנהל 1
            <input
              type="radio"
              value="employer1"
              checked={signedInUserRole === "employer1"}
              onChange={() => setSignedInUserRole("employer1")}
            />
          </label>
          <label>
            מנהל 2
            <input
              type="radio"
              value="employer2"
              checked={signedInUserRole === "employer2"}
              onChange={() => setSignedInUserRole("employer2")}
            />
          </label>
        </div>
      </div>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: "20px",
        }}
      >
        <RPDF signedInUserRole={signedInUserRole} />
      </main>
    </>
  );
}

export default App;
