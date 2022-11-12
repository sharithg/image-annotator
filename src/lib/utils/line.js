"use strict";
exports.__esModule = true;
exports.getLineCoordatesForUserDraw = exports.drawLine = void 0;
var constants_1 = require("../constants");
var drawLine = function (context, _a, input) {
    var dx = _a.dx, dy = _a.dy;
    context.beginPath();
    context.strokeStyle = "yellow";
    context.moveTo(input.coordintate.x1 + dx, input.coordintate.y1 + dy);
    context.lineTo(input.coordintate.x2 + dx, input.coordintate.y2 + dy);
    context.stroke();
};
exports.drawLine = drawLine;
var getLineCoordatesForUserDraw = function (mousePos, client, offset) {
    var x1 = mousePos.x - offset.dx - constants_1.MOUSE_POINT_OFFSET;
    var y1 = mousePos.y - offset.dy - constants_1.MOUSE_POINT_OFFSET;
    var x2 = client.clientX - offset.dx - constants_1.MOUSE_POINT_OFFSET;
    var y2 = client.clientY - offset.dy - constants_1.MOUSE_POINT_OFFSET;
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
};
exports.getLineCoordatesForUserDraw = getLineCoordatesForUserDraw;
