const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  getFiles,
  downloadFile,
} = require("../controllers/fileController");
const authenticate = require("../middleware/authMiddleware");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router.post("/upload", authenticate, upload.single("model"), uploadFile);
router.get("/", authenticate, getFiles);
router.get("/:id", authenticate, downloadFile);

module.exports = router;
