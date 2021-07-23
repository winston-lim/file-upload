"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileHandler = void 0;
var fileHandler = function (req, _, next) {
    var files = req.files;
    var mappedFiles = (files || []).map(function (file) { return ({
        name: file.originalname,
        type: file.mimetype,
        content: file.buffer,
        size: file.size,
        extension: "" + file.originalname.split(".").pop(),
    }); });
    Object.assign(req.body, { files: mappedFiles });
    return next();
};
exports.fileHandler = fileHandler;
