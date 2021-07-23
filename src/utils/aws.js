"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSS3Uploader = void 0;
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var stream_1 = __importDefault(require("stream"));
var AWSS3Uploader = /** @class */ (function () {
    function AWSS3Uploader(config) {
        aws_sdk_1.default.config = new aws_sdk_1.default.Config();
        aws_sdk_1.default.config.update({
            region: config.region || "ap-southeast-1",
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });
        this.s3 = new aws_sdk_1.default.S3({ apiVersion: "2006-03-01" });
        this.config = config;
    }
    AWSS3Uploader.prototype.createDesintationFilePath = function (file, detail) {
        return file.name + "-" + detail + "." + file.extension;
    };
    AWSS3Uploader.prototype.createUploadStream = function (key) {
        var pass = new stream_1.default.PassThrough();
        return {
            writeStream: pass,
            promise: this.s3
                .upload({
                Bucket: this.config.destinationBucket,
                Key: key,
                Body: pass,
            })
                .promise(),
        };
    };
    AWSS3Uploader.prototype.uploadFile = function (file, detail) {
        return __awaiter(this, void 0, void 0, function () {
            var fileDetail, filePath, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileDetail = detail;
                        if (!detail) {
                            fileDetail = Date.now().toString();
                        }
                        filePath = this.createDesintationFilePath(file, fileDetail);
                        return [4 /*yield*/, this.s3.putObject({
                                Bucket: this.config.destinationBucket,
                                Key: filePath,
                                ContentType: file.type,
                                Body: file.content,
                            })];
                    case 1:
                        error = _a.sent();
                        return [2 /*return*/, this.config.destinationBucket + "/" + filePath];
                }
            });
        });
    };
    AWSS3Uploader.prototype.upload = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, path, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!Array.isArray(files)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.uploadFile(file)];
                            }); }); }))];
                    case 1:
                        paths = _b.sent();
                        return [2 /*return*/, paths.map(function (path) { return ({ path: path }); })];
                    case 2: return [4 /*yield*/, this.uploadFile(files)];
                    case 3:
                        path = _b.sent();
                        return [2 /*return*/, {
                                path: path,
                            }];
                    case 4:
                        _a = _b.sent();
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AWSS3Uploader;
}());
exports.AWSS3Uploader = AWSS3Uploader;
