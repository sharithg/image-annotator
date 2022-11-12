"use strict";
exports.__esModule = true;
var react_1 = require("react");
var box_1 = require("./utils/box");
var annotations_1 = require("./utils/annotations");
var line_1 = require("./utils/line");
var annotationImageReducer_1 = require("./annotationImageReducer");
var drawImage = function (context, canvas, imageSrc, onImageLoad) {
    var img = new Image();
    img.onload = function () {
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var dx = (canvas.width - img.width * ratio) / 2;
        var dy = (canvas.height - img.height * ratio) / 2;
        context.drawImage(img, dx, dy, img.width * ratio, img.height * ratio); // draw the image offset by half
        onImageLoad(dx, dy);
    };
    img.src = imageSrc;
};
var AnnotationImage = function (_a) {
    var _b;
    var annotations = _a.annotations, imageSrc = _a.imageSrc, drawMode = _a.drawMode, onAnnotationChange = _a.onAnnotationChange, width = _a.width, height = _a.height;
    (0, annotations_1.validateAnnotations)(annotations);
    var canvasHeightAndWidth = {
        height: height !== null && height !== void 0 ? height : 600,
        width: width !== null && width !== void 0 ? width : 1000
    };
    var canvasRef = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)(false), imageLoaded = _c[0], setImageLoaded = _c[1];
    var _d = (0, react_1.useState)(0), xOffset = _d[0], setXOffset = _d[1];
    var _e = (0, react_1.useState)(0), yOffset = _e[0], setYOffset = _e[1];
    var _f = (0, react_1.useState)(null), currentDrawingMousePosition = _f[0], setCurrentDrawingMousePosition = _f[1];
    var context = (_b = canvasRef.current) === null || _b === void 0 ? void 0 : _b.getContext("2d");
    var _g = (0, react_1.useReducer)(annotationImageReducer_1.annotationImageReducer, {
        boundingBoxes: [],
        lines: []
    }), dispatchAnnotation = _g[1];
    var offsets = {
        dx: xOffset,
        dy: yOffset
    };
    (0, react_1.useEffect)(function () {
        if (imageLoaded) {
            return;
        }
        var canvas = canvasRef.current;
        var context = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
        context.fillStyle = "#000000";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        drawImage(context, canvas, imageSrc, function (dx, dy) {
            setImageLoaded(true);
            setXOffset(dx);
            setYOffset(dy);
        });
    }, []);
    (0, react_1.useEffect)(function () {
        if (imageLoaded) {
            (0, annotations_1.validateAnnotations)(annotations);
            annotations.boundingBoxes.forEach(function (box) {
                (0, box_1.drawBox)(context, offsets, {
                    coordintate: box
                });
                dispatchAnnotation({
                    type: "ADD_BB_ANNOTATION",
                    payload: {
                        coordinates: box,
                        context: context,
                        offsets: offsets
                    }
                });
            });
            annotations.lines.forEach(function (line) {
                dispatchAnnotation({
                    type: "ADD_BB_ANNOTATION",
                    payload: {
                        coordinates: line,
                        context: context,
                        offsets: offsets
                    }
                });
            });
        }
    }, [imageLoaded]);
    var handleDrawLine = function (e) {
        if (currentDrawingMousePosition) {
            var coordintates = (0, line_1.getLineCoordatesForUserDraw)(currentDrawingMousePosition, e, offsets);
            dispatchAnnotation({
                type: "ADD_LINE_ANNOTATION",
                payload: {
                    coordinates: coordintates,
                    context: context,
                    offsets: offsets,
                    onAnnotationChange: onAnnotationChange
                }
            });
        }
    };
    var handleDrawBox = function (e) {
        if (currentDrawingMousePosition) {
            var cordinates = (0, box_1.getBoxCoordatesForUserDraw)(currentDrawingMousePosition, e, offsets);
            dispatchAnnotation({
                type: "ADD_BB_ANNOTATION",
                payload: {
                    coordinates: cordinates,
                    context: context,
                    offsets: offsets,
                    onAnnotationChange: onAnnotationChange
                }
            });
        }
    };
    var handleDrawAnnotation = function (e) {
        if (!drawMode)
            return;
        if (drawMode === "line") {
            handleDrawLine(e);
        }
        if (drawMode === "box") {
            handleDrawBox(e);
        }
        setCurrentDrawingMousePosition(null);
    };
    return (<div className="App">
      <canvas ref={canvasRef} onMouseDown={function (e) {
            setCurrentDrawingMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        }} onMouseUp={handleDrawAnnotation} {...canvasHeightAndWidth}/>
    </div>);
};
exports["default"] = AnnotationImage;
