import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Eye, Package, Download } from "lucide-react";
import ModelViewer from "../components/ModelViewer";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

export default function History() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/files`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch upload history");
        }

        const data = await response.json();
        console.log(data);

        setUploadedFiles(data);
      } catch (err) {
        console.error("Error fetching upload history:", err);
        setError("Failed to load upload history");
        toast.error("Failed to fetch uploads");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadHistory();
  }, []);

  const selectFile = async (file) => {
    console.log(file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/files/${file._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch file for preview");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      setSelectedModel(objectUrl);
      setSelectedFileName(file.originalName);
      setSelectedFileType(file.fileType);
    } catch (error) {
      console.error("Error fetching file for preview:", error);
      toast.error("Failed to preview file");
    }
  };

  const downloadFile = async (fileId, fileName) => {
    console.log(fileId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/files/${fileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download file");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gray-900 mb-6">
          Upload History
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* File List */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="shadow-lg border rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Package className="w-6 h-6" /> Recent Uploads
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <AnimatePresence>
                    {uploadedFiles.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No files uploaded yet
                      </div>
                    ) : (
                      <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hide-scrollbar ">
                        <ul className="space-y-3">
                          {uploadedFiles.map((file) => (
                            <motion.li
                              key={file.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div
                                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                                  selectedModel ===
                                  `http://localhost:5890/uploads/${file._id}`
                                    ? "bg-indigo-50 border-2 border-indigo-200"
                                    : "bg-white hover:bg-gray-50 border border-gray-100"
                                }`}
                                onClick={() => selectFile(file)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gray-100 rounded-lg">
                                    <Package className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {file.originalName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {new Date(
                                        file.uploadDate
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Eye
                                    className="w-5 h-5 text-gray-600 hover:text-indigo-600 cursor-pointer"
                                    title="Preview"
                                    onClick={() => selectFile(file)}
                                  />
                                  <Download
                                    className="w-5 h-5 text-gray-600 hover:text-indigo-600 cursor-pointer"
                                    title="Download"
                                    onClick={() =>
                                      downloadFile(file._id, file.originalName)
                                    }
                                  />
                                </div>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="h-[600px] relative">
            <Card className="h-full shadow-lg border border-indigo-50 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="w-6 h-6" /> 3D Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-56px)] p-0 ">
                {selectedModel ? (
                  <ModelViewer
                    modelUrl={selectedModel}
                    fileName={selectedFileName}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-500">
                    <Package className="w-16 h-16 opacity-50" />
                    <p className="text-lg">Select a model to preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
