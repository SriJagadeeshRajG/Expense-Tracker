import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Toaster
  position="top-right"
  reverseOrder={false}
  containerStyle={{
    zIndex: 999999,
  }}
  toastOptions={{
    duration: 2500,
    style: {
      background: "#1e293b",
      color: "#fff",
      border: "1px solid #334155",
      borderRadius: "12px",
      zIndex: 999999,
    },
  }}
/>

    <App />
  </>
);