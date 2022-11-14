import React, { useState } from "react";
import "./App.css";
import { Annotator } from "./lib";
import { AnnotationsStateInternal, AnyAnnotation } from "./lib/types";
import { v4 as uuidv4 } from "uuid";

const bbCoordinates = [
  {
    id: uuidv4(),
    x: 15,
    y: 15,
    width: 50,
    height: 50,
    styles: {
      strokeColor: "red",
      strokeWidth: 3,
    },
  },
  {
    id: uuidv4(),
    x: 150,
    y: 150,
    width: 50,
    height: 100,
    styles: {
      strokeColor: "green",
      strokeWidth: 1,
    },
  },
];

const lineCoordinates = [
  {
    id: uuidv4(),
    x1: 230,
    y1: 23,
    x2: 100,
    y2: 130,
    styles: {
      strokeColor: "purple",
      strokeWidth: 4,
      strokeDashArray: [5, 5],
      showHandles: true,
    },
  },
];

function App() {
  const [drawType, setDrawType] = useState("line");
  const [boundingBoxAnnotations, setBoundingBoxAnnotations] = useState<any[]>(
    []
  );
  const [lineAnnotations, setLineAnnotations] = useState<any[]>([]);

  const handleAnnotationDraw = (
    currentAnnotationState: AnnotationsStateInternal,
    newAnnotation: AnyAnnotation
  ) => {
    if (newAnnotation.boundingBoxCoordinate) {
      setBoundingBoxAnnotations([
        ...boundingBoxAnnotations,
        newAnnotation.boundingBoxCoordinate,
      ]);
    }
    if (newAnnotation.lineCoordinate) {
      setLineAnnotations([...lineAnnotations, newAnnotation.lineCoordinate]);
    }
  };

  const handleAnnotationUpdate = (
    currentAnnotationState: AnnotationsStateInternal,
    updatedAnnotation: AnyAnnotation
  ) => {
    console.log("updatedAnnotation", updatedAnnotation, currentAnnotationState);
  };

  return (
    <div>
      <Annotator
        annotations={{
          boundingBoxes: bbCoordinates,
          lines: lineCoordinates,
        }}
        drawMode={drawType}
        imageSrc="https://medlineplus.gov/images/Xray_share.jpg"
        onAnnotationDraw={handleAnnotationDraw}
        onAnnotationUpdate={handleAnnotationUpdate}
        height={300}
        width={500}
      />
      <div className="control-container">
        <div>
          <h3>Select Annotation Type</h3>
          <select
            className="draw-type"
            value={drawType}
            onChange={(e) => setDrawType(e.target.value)}
          >
            <option value="box">Box</option>
            <option value="line">Line</option>
          </select>
        </div>
      </div>
      <div>
        <p>Box Annotations</p>
        <ul>
          {boundingBoxAnnotations.map((annotation) => (
            <li
              style={{ color: annotation.styles.strokeColor }}
              key={annotation.id}
            >
              X: {annotation.x.toFixed(2)}, Y: {annotation.y.toFixed(2)}, H:{" "}
              {annotation.height.toFixed(2)}, W: {annotation.width.toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Line Annotations</p>
        <ul>
          {lineAnnotations.map((annotation) => (
            <li
              style={{ color: annotation.styles.strokeColor }}
              key={annotation.id}
            >
              X0: {annotation.x1.toFixed(2)}, Y0: {annotation.y1.toFixed(2)},
              X1: {annotation.x2.toFixed(2)}, Y1: {annotation.y1.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
