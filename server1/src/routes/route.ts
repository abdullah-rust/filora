import { Router } from "express";
import Login from "../controller/auth/Login";
import Signup from "../controller/auth/Signup";
import { LoginOTP, SignupOTP } from "../controller/auth/Otp";
import multer from "multer";
import Upload from "../controller/fileHandling/fileUpload";
import { CheckJwt } from "../middleware/check_jwt";
import { loadFilesAndFolders } from "../controller/fileHandling/getdata";
import StreamFile from "../controller/fileHandling/serveFile";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();

router.post("/login", Login);
router.post("/signup", Signup);
router.post("/otp", LoginOTP, SignupOTP);
router.post("/upload", CheckJwt, upload.array("files", 10), Upload);
router.get("/get-data", CheckJwt, loadFilesAndFolders);
router.get("/file/:uuid", CheckJwt, StreamFile);

export default router;
