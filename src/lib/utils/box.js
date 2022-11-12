"use strict";
exports.__esModule = true;
exports.getBoxCoordatesForUserDraw = exports.drawBox = void 0;
var constants_1 = require("../constants");
var drawBox = function (context, _a, input) {
    var dx = _a.dx, dy = _a.dy;
    context.beginPath();
    context.strokeStyle = "red";
    context.rect(input.coordintate.x + dx, input.coordintate.y + dy, input.coordintate.width, input.coordintate.height);
    context.stroke();
};
exports.drawBox = drawBox;
var getBoxCoordatesForUserDraw = function (mousePos, client, offset) {
    var x = mousePos.x - offset.dx - constants_1.MOUSE_POINT_OFFSET;
    var y = mousePos.y - offset.dy - constants_1.MOUSE_POINT_OFFSET;
    var width = client.clientX - mousePos.x;
    var height = client.clientY - mousePos.y;
    return { x: x, y: y, width: width, height: height };
};
exports.getBoxCoordatesForUserDraw = getBoxCoordatesForUserDraw;
