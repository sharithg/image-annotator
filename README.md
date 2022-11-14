# Image Annotator

React library for annotating images

## Philosophy

This libary is meant for the developer to handle the logic of what annotations are displayed and the library will handle the displaying of the annotations and end user interactions.

## Usage

Basic Usage:

```JSX
import React from "react";

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
  return (
    <div>
      <Annotator
        annotations={{
          boundingBoxes: bbCoordinates,
          lines: lineCoordinates,
        }}
        imageSrc="https://medlineplus.gov/images/Xray_share.jpg"
        height={300}
        width={500}
      />
    </div>
  );
}

export default App;
```

### Demo

[Demo](https://image-annotator-demo.netlify.app/)
![With X-Ray](https://github.com/sharithg/image-annotator/blob/main/src/assets/demo.png)

[Code](https://github.com/sharithg/image-annotator/blob/main/src/App.tsx)

Known Bugs:
