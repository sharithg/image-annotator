import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AnnotationsProvider } from "./lib/AnnotationImageContext";

const lineCoordinateStyles = {
  strokeColor: "green",
  showHandles: true,
  strokeWidth: 2,
  strokeDashArray: [5, 3],
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AnnotationsProvider
      defaultLineStyles={lineCoordinateStyles}
      defaultBoundingBoxStyles={{
        strokeColor: "red",
        strokeWidth: 1,
      }}
    >
      <App />
    </AnnotationsProvider>
  </React.StrictMode>
);
