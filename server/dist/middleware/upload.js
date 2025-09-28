"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// middleware/upload.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../public/uploads/templates');
        // Create directory if it doesn't exist
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});
// File filter to allow only certain file types
// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const allowedTypes = [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   ];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX are allowed')
//     );
//   }
// };
exports.upload = (0, multer_1.default)({
    storage: storage,
    // fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
