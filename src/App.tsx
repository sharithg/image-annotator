import React, { useState } from "react";
import "./App.css";
import AnnotationImage from "./AnnotationImage";
import { AnnotationState } from "./annotationImageReducer";
import { AnyAnnotation } from "./types";

const bbCoordinates = [
  {
    id: "1",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  {
    id: "2",
    x: 200,
    y: 200,
    width: 50,
    height: 100,
  },
];

const lineCoordinates = [
  {
    id: "1",
    x1: 230,
    y1: 23,
    x2: 100,
    y2: 130,
  },
];

function App() {
  const [drawType, setDrawType] = useState("box");
  const [newAnnotations, setNewAnnotations] = useState<AnyAnnotation[]>([]);

  const handleAnnotationChange = (
    annotations: AnnotationState,
    newAnnotation: AnyAnnotation
  ) => {
    setNewAnnotations([...newAnnotations, newAnnotation]);
  };

  return (
    <div>
      <AnnotationImage
        annotations={{
          boundingBoxes: bbCoordinates,
          lines: lineCoordinates,
        }}
        drawMode={drawType}
        imageSrc="https://medlineplus.gov/images/Xray_share.jpg"
        onAnnotationChange={handleAnnotationChange}
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
        <ul>
          {newAnnotations.map((annotation) => (
            <li key={annotation.id}>{JSON.stringify(annotation)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
