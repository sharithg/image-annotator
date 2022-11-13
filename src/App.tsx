import React, { useState } from "react";
import "./App.css";
import { AnnotationImage } from "./lib";
import { AnyAnnotation } from "./lib/types";
import { v4 as uuidv4 } from "uuid";

const bbCoordinates = [
  {
    id: uuidv4(),
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  {
    id: uuidv4(),
    x: 200,
    y: 200,
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
  },
];

function App() {
  const [drawType, setDrawType] = useState("box");
  const [boundingBoxAnnotations, setBoundingBoxAnnotations] =
    useState(bbCoordinates);
  const [lineAnnotations, setLineAnnotations] = useState(lineCoordinates);

  const handleAnnotationDraw = (newAnnotation: AnyAnnotation) => {
    if (newAnnotation.boundingBoxCoordinate) {
      setBoundingBoxAnnotations([
        ...boundingBoxAnnotations,
        {
          ...newAnnotation.boundingBoxCoordinate,
          id: uuidv4(),
        },
      ]);
    }
    if (newAnnotation.lineCoordinate) {
      setLineAnnotations([
        ...lineAnnotations,
        {
          ...newAnnotation.lineCoordinate,
          id: uuidv4(),
        },
      ]);
    }
  };

  return (
    <div>
      <AnnotationImage
        annotations={{
          boundingBoxes: boundingBoxAnnotations,
          lines: lineAnnotations,
        }}
        drawMode={drawType}
        imageSrc="https://medlineplus.gov/images/Xray_share.jpg"
        onAnnotationDraw={handleAnnotationDraw}
      />
      <div className="control-container">
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
      <div>
        <p>New Annotations</p>
        <ul>
          {lineAnnotations.map((annotation) => (
            <li key={annotation.id}>{JSON.stringify(annotation)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
