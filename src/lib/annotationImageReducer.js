"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.annotationImageReducer = void 0;
var box_1 = require("./utils/box");
var line_1 = require("./utils/line");
var annotationImageReducer = function (state, action) {
    switch (action.type) {
        case "ADD_BB_ANNOTATION":
            (0, box_1.drawBox)(action.payload.context, action.payload.offsets, {
                coordintate: action.payload.coordinates
            });
            var newAnnotationBox = __assign(__assign({}, action.payload.coordinates), { displayed: true, id: state.boundingBoxes.length });
            if (action.payload.onAnnotationChange) {
                action.payload.onAnnotationChange(state, {
                    id: newAnnotationBox.id,
                    type: "box",
                    x: newAnnotationBox.x,
                    y: newAnnotationBox.y,
                    width: newAnnotationBox.width,
                    height: newAnnotationBox.height
                });
            }
            return __assign(__assign({}, state), { boundingBoxes: __spreadArray(__spreadArray([], state.boundingBoxes, true), [newAnnotationBox], false) });
        case "ADD_LINE_ANNOTATION":
            (0, line_1.drawLine)(action.payload.context, action.payload.offsets, {
                coordintate: action.payload.coordinates
            });
            var newAnnotationLine = __assign(__assign({}, action.payload.coordinates), { displayed: true, id: state.lines.length });
            if (action.payload.onAnnotationChange) {
                action.payload.onAnnotationChange(state, {
                    id: newAnnotationLine.id,
                    type: "line",
                    x1: newAnnotationLine.x1,
                    y1: newAnnotationLine.y1,
                    x2: newAnnotationLine.x2,
                    y2: newAnnotationLine.y2
                });
            }
            return __assign(__assign({}, state), { lines: __spreadArray(__spreadArray([], state.lines, true), [
                    __assign(__assign({}, action.payload.coordinates), { displayed: true, id: state.lines.length }),
                ], false) });
        default:
            return state;
    }
};
exports.annotationImageReducer = annotationImageReducer;
