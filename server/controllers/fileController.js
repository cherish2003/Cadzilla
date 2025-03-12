const path = require("path");
const { v4: uuidv4 } = require("uuid");
const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const file = new File({
      userId: req.user._id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      fileType: path.extname(req.file.originalname).substring(1),
      size: req.file.size,
    });

    await file.save();
    req.user.files.push(file);
    await req.user.save();

    res.status(201).json({
      id: file._id,
      originalName: file.originalName,
      uploadDate: file.uploadDate,
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).send("Upload failed");
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id })
      .sort("-uploadDate")
      .select("originalName uploadDate fileType size");
    res.json(files);
  } catch (err) {
    res.status(500).send("Error retrieving files");
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!file) return res.status(404).send("File not found");

    res.download(
      path.join(__dirname, "../uploads", file.storedName),
      file.originalName
    );
  } catch (err) {
    res.status(500).send("Download failed");
  }
};
